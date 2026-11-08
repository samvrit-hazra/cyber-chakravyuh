import ssl
import socket
import urllib.request
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List, Tuple
import httpx
from cryptography import x509
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import rsa, ec, dsa
from cryptography.x509.oid import ExtensionOID, AuthorityInformationAccessOID

from app.features.cert_analyzer.models import CertificateDetails, CTLogEntry, CertChainItem


def validate_tls_trust_store(hostname: str, port: int = 443, timeout: float = 5.0) -> Tuple[bool, Optional[str]]:
    """
    Attempts standard TLS connection with check_hostname=True and ssl.CERT_REQUIRED
    against the system/Python trusted root CA bundle.
    Returns (is_valid, error_message).
    """
    strict_ctx = ssl.create_default_context()
    strict_ctx.check_hostname = True
    strict_ctx.verify_mode = ssl.CERT_REQUIRED

    try:
        with socket.create_connection((hostname, port), timeout=timeout) as sock:
            sock.settimeout(timeout)
            with strict_ctx.wrap_socket(sock, server_hostname=hostname) as ssock:
                return True, None
    except Exception as e:
        return False, f"{type(e).__name__}: {str(e)}"


def check_crl_revocation(cert: x509.Certificate, timeout: float = 3.0) -> Tuple[bool, Optional[str], Optional[str]]:
    """
    Checks whether the certificate has been explicitly revoked via its CRL distribution points.
    Returns (is_revoked, revocation_date_utc, crl_url).
    """
    try:
        crl_ext = cert.extensions.get_extension_for_oid(ExtensionOID.CRL_DISTRIBUTION_POINTS)
        crl_urls: List[str] = []
        for dp in crl_ext.value:
            if dp.full_name:
                for name in dp.full_name:
                    crl_urls.append(str(name.value))

        for url in crl_urls:
            try:
                req = urllib.request.Request(url, headers={"User-Agent": "CyberChakravyuh-CertInspector/1.0"})
                with urllib.request.urlopen(req, timeout=timeout) as resp:
                    crl_data = resp.read()
                    crl = x509.load_der_x509_crl(crl_data)
                    revoked_record = crl.get_revoked_certificate_by_serial_number(cert.serial_number)
                    if revoked_record is not None:
                        rev_date = str(revoked_record.revocation_date_utc)
                        return True, rev_date, url
            except Exception:
                continue

        return False, None, None
    except Exception:
        return False, None, None


def parse_chain_cert(cert: x509.Certificate) -> Dict[str, Any]:
    """
    Parses a single certificate in the chain into standard metadata.
    """
    subject_cn = None
    try:
        cns = cert.subject.get_attributes_for_oid(x509.NameOID.COMMON_NAME)
        if cns:
            subject_cn = cns[0].value
    except Exception:
        pass
    subject_str = subject_cn or cert.subject.rfc4514_string()

    issuer_cn = None
    try:
        cns = cert.issuer.get_attributes_for_oid(x509.NameOID.COMMON_NAME)
        if cns:
            issuer_cn = cns[0].value
    except Exception:
        pass
    issuer_str = issuer_cn or cert.issuer.rfc4514_string()

    is_ca = False
    try:
        bc = cert.extensions.get_extension_for_oid(ExtensionOID.BASIC_CONSTRAINTS)
        is_ca = bc.value.ca
    except Exception:
        pass

    not_before = cert.not_valid_before_utc
    not_after = cert.not_valid_after_utc
    now = datetime.now(timezone.utc)
    is_expired = now > not_after

    pub_key = cert.public_key()
    key_type = "Unknown"
    key_size = None
    if isinstance(pub_key, rsa.RSAPublicKey):
        key_type = "RSA"
        key_size = pub_key.key_size
    elif isinstance(pub_key, ec.EllipticCurvePublicKey):
        key_type = "ECDSA"
        key_size = pub_key.curve.key_size
    elif isinstance(pub_key, dsa.DSAPublicKey):
        key_type = "DSA"
        key_size = pub_key.key_size

    return {
        "subject": subject_str,
        "issuer": issuer_str,
        "not_before": not_before,
        "not_after": not_after,
        "is_expired": is_expired,
        "is_ca": is_ca,
        "key_type": key_type,
        "key_size": key_size,
        "serial_number": format(cert.serial_number, "X")
    }


def fetch_tls_certificate(hostname: str, port: int = 443, timeout: float = 10.0) -> Optional[Dict[str, Any]]:
    """
    Establishes a diagnostic TLS connection to the hostname with SNI, retrieves the live
    X.509 certificate and chain, and performs independent trust store and CRL revocation verification.
    """
    diag_context = ssl.create_default_context()
    diag_context.check_hostname = False
    diag_context.verify_mode = ssl.CERT_NONE

    try:
        with socket.create_connection((hostname, port), timeout=timeout) as sock:
            sock.settimeout(timeout)
            with diag_context.wrap_socket(sock, server_hostname=hostname) as ssock:
                der_cert = ssock.getpeercert(binary_form=True)
                raw_chain = ssock.get_verified_chain() or []
                tls_version = ssock.version()
                cipher = ssock.cipher()

                if not der_cert:
                    return None

                if not raw_chain:
                    raw_chain = [der_cert]

                cert = x509.load_der_x509_certificate(der_cert)
                chain_certs = [x509.load_der_x509_certificate(c) for c in raw_chain]

                # Validity Dates & Remaining Time (UTC)
                not_before = cert.not_valid_before_utc
                not_after = cert.not_valid_after_utc
                now = datetime.now(timezone.utc)
                is_expired = now > not_after
                days_to_expiry = (not_after - now).days

                # Subject CN & SANs
                subject_cn = None
                try:
                    cns = cert.subject.get_attributes_for_oid(x509.NameOID.COMMON_NAME)
                    if cns:
                        subject_cn = cns[0].value
                except Exception:
                    pass

                san_list: List[str] = []
                try:
                    ext = cert.extensions.get_extension_for_oid(ExtensionOID.SUBJECT_ALTERNATIVE_NAME)
                    san_list = ext.value.get_values_for_type(x509.DNSName)
                except Exception:
                    pass

                if not san_list and subject_cn:
                    san_list = [subject_cn]

                # Self-signed check
                is_self_signed = cert.issuer == cert.subject

                # Hostname matching (RFC 6125)
                target_lower = hostname.lower()
                hostname_matches = False
                is_wildcard = False
                for name in san_list:
                    nl = name.lower()
                    if nl.startswith("*."):
                        is_wildcard = True
                        base = nl[2:]
                        if target_lower.endswith("." + base):
                            prefix = target_lower[:-len("." + base)]
                            if "." not in prefix and len(prefix) > 0:
                                hostname_matches = True
                                break
                    elif nl == target_lower:
                        hostname_matches = True
                        break

                # Trust store verification
                if is_expired:
                    system_trust_valid = False
                    system_trust_error = "SSLCertVerificationError: [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired"
                elif is_self_signed:
                    system_trust_valid = False
                    system_trust_error = "SSLCertVerificationError: [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: self-signed certificate"
                elif not hostname_matches:
                    system_trust_valid = False
                    system_trust_error = f"SSLCertVerificationError: [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: Hostname mismatch, certificate is not valid for '{hostname}'"
                else:
                    system_trust_valid, system_trust_error = validate_tls_trust_store(hostname, port, timeout=5.0)

                # CRL Revocation Check
                is_revoked, rev_date, rev_url = check_crl_revocation(cert, timeout=3.0)

                # SHA-256 fingerprint
                sha256_fp = cert.fingerprint(hashes.SHA256()).hex().upper()

                return parse_x509_certificate(
                    cert=cert,
                    chain_certs=chain_certs,
                    target_hostname=hostname,
                    tls_version=tls_version,
                    cipher=cipher,
                    system_trust_valid=system_trust_valid,
                    system_trust_error=system_trust_error,
                    is_revoked=is_revoked,
                    revocation_date=rev_date,
                    revocation_url=rev_url,
                    sha256_fingerprint=sha256_fp,
                    san_list=san_list,
                    subject_cn=subject_cn,
                    is_self_signed=is_self_signed,
                    hostname_matches=hostname_matches,
                    is_wildcard=is_wildcard,
                    is_expired=is_expired,
                    days_to_expiry=days_to_expiry,
                    not_before=not_before,
                    not_after=not_after
                )
    except Exception as e:
        return {"error": f"TLS connection to {hostname}:{port} failed: {str(e)}"}


def parse_x509_certificate(
    cert: x509.Certificate,
    chain_certs: List[x509.Certificate],
    target_hostname: str,
    tls_version: str,
    cipher: tuple,
    system_trust_valid: bool,
    system_trust_error: Optional[str],
    is_revoked: bool,
    revocation_date: Optional[str],
    revocation_url: Optional[str],
    sha256_fingerprint: str,
    san_list: List[str],
    subject_cn: Optional[str],
    is_self_signed: bool,
    hostname_matches: bool,
    is_wildcard: bool,
    is_expired: bool,
    days_to_expiry: int,
    not_before: datetime,
    not_after: datetime
) -> Dict[str, Any]:
    # Issuer Org & CN
    issuer_org = None
    issuer_cn = None
    try:
        orgs = cert.issuer.get_attributes_for_oid(x509.NameOID.ORGANIZATION_NAME)
        if orgs:
            issuer_org = orgs[0].value
        cns = cert.issuer.get_attributes_for_oid(x509.NameOID.COMMON_NAME)
        if cns:
            issuer_cn = cns[0].value
    except Exception:
        pass

    # Public Key & Key Size
    pub_key = cert.public_key()
    key_type = "Unknown"
    key_size = None

    if isinstance(pub_key, rsa.RSAPublicKey):
        key_type = "RSA"
        key_size = pub_key.key_size
    elif isinstance(pub_key, ec.EllipticCurvePublicKey):
        key_type = "ECDSA"
        key_size = pub_key.curve.key_size
    elif isinstance(pub_key, dsa.DSAPublicKey):
        key_type = "DSA"
        key_size = pub_key.key_size

    # Signature Algorithm
    signature_algo = cert.signature_algorithm_oid._name

    # Revocation Endpoints (OCSP & CRL Distribution Points)
    ocsp_urls: List[str] = []
    crl_urls: List[str] = []
    try:
        aia = cert.extensions.get_extension_for_oid(ExtensionOID.AUTHORITY_INFORMATION_ACCESS)
        for desc in aia.value:
            if desc.access_method == AuthorityInformationAccessOID.OCSP:
                ocsp_urls.append(str(desc.access_location.value))
    except Exception:
        pass

    try:
        crl = cert.extensions.get_extension_for_oid(ExtensionOID.CRL_DISTRIBUTION_POINTS)
        for dp in crl.value:
            if dp.full_name:
                for name in dp.full_name:
                    crl_urls.append(str(name.value))
    except Exception:
        pass

    has_revocation_info = bool(ocsp_urls or crl_urls)

    # Certificate Chain Details
    parsed_chain = [parse_chain_cert(c) for c in chain_certs]

    # Serial Number in Hex
    serial_hex = format(cert.serial_number, "X")

    cipher_name = cipher[0] if cipher else None

    return {
        "common_name": subject_cn,
        "san_list": san_list,
        "issuer_org": issuer_org,
        "issuer_common_name": issuer_cn,
        "valid_from": not_before,
        "valid_to": not_after,
        "is_expired": is_expired,
        "days_to_expiry": days_to_expiry,
        "key_type": key_type,
        "key_size": key_size,
        "signature_algo": signature_algo,
        "tls_version": tls_version,
        "cipher_suite": cipher_name,
        "sha256_fingerprint": sha256_fingerprint,
        "is_self_signed": is_self_signed,
        "hostname_matches": hostname_matches,
        "is_wildcard": is_wildcard,
        "serial_number": serial_hex,
        "ocsp_urls": ocsp_urls,
        "crl_distribution_points": crl_urls,
        "has_revocation_info": has_revocation_info,
        "system_trust_valid": system_trust_valid,
        "system_trust_error": system_trust_error,
        "is_revoked": is_revoked,
        "revocation_date": revocation_date,
        "revocation_url": revocation_url,
        "certificate_chain": parsed_chain
    }


async def query_crt_sh(domain: str) -> List[CTLogEntry]:
    """
    Queries crt.sh Certificate Transparency logs for the domain.
    Has a strict 2.0s timeout so slow crt.sh never blocks analysis.
    """
    entries = []
    try:
        url = f"https://crt.sh/?q={domain}&output=json"
        async with httpx.AsyncClient(timeout=2.0) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                raw_logs = resp.json()
                seen_ids = set()
                for item in raw_logs[:12]:
                    cert_id = item.get("id")
                    if cert_id not in seen_ids:
                        seen_ids.add(cert_id)
                        entries.append(CTLogEntry(
                            id=cert_id,
                            logged_at=item.get("entry_timestamp"),
                            not_before=item.get("not_before"),
                            not_after=item.get("not_after"),
                            common_name=item.get("common_name"),
                            issuer_name=item.get("issuer_name")
                        ))
                    if len(entries) >= 6:
                        break
    except Exception:
        pass

    return entries
