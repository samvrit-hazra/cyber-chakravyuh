import ssl
import socket
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
import httpx
from cryptography import x509
from cryptography.hazmat.primitives.asymmetric import rsa, ec, dsa
from cryptography.x509.oid import ExtensionOID, AuthorityInformationAccessOID

from app.features.cert_analyzer.models import CertificateDetails, CTLogEntry, CertChainItem


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


def fetch_tls_certificate(hostname: str, port: int = 443, timeout: float = 6.0) -> Optional[Dict[str, Any]]:
    """
    Establishes a TLS connection to the hostname and retrieves the X.509 certificate,
    the full certificate chain, and TLS handshake metadata.
    """
    context = ssl.create_default_context()
    # Allow inspection even if certificate is self-signed or expired
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE

    try:
        with socket.create_connection((hostname, port), timeout=timeout) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
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

                return parse_x509_certificate(cert, chain_certs, hostname, tls_version, cipher)
    except Exception as e:
        return {"error": f"TLS connection to {hostname}:{port} failed: {str(e)}"}


def parse_x509_certificate(
    cert: x509.Certificate,
    chain_certs: List[x509.Certificate],
    target_hostname: str,
    tls_version: str,
    cipher: tuple
) -> Dict[str, Any]:
    """
    Parses a cryptography.x509 Certificate object and its certificate chain
    into our CertificateDetails structure.
    """
    # 1. Subject CN
    subject_cn = None
    try:
        cns = cert.subject.get_attributes_for_oid(x509.NameOID.COMMON_NAME)
        if cns:
            subject_cn = cns[0].value
    except Exception:
        pass

    # 2. Issuer Org & CN
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

    # 3. Subject Alternative Names (SAN)
    san_list = []
    try:
        ext = cert.extensions.get_extension_for_oid(ExtensionOID.SUBJECT_ALTERNATIVE_NAME)
        san_list = ext.value.get_values_for_type(x509.DNSName)
    except Exception:
        pass

    if not san_list and subject_cn:
        san_list = [subject_cn]

    # 4. Validity Dates
    not_before = cert.not_valid_before_utc
    not_after = cert.not_valid_after_utc
    now = datetime.now(timezone.utc)
    is_expired = now > not_after
    days_to_expiry = (not_after - now).days

    # 5. Public Key & Key Size
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

    # 6. Signature Algorithm
    signature_algo = cert.signature_algorithm_oid._name

    # 7. Self-Signed Check
    is_self_signed = cert.issuer == cert.subject

    # 8. Hostname Matching Check (RFC 6125)
    target_lower = target_hostname.lower()
    hostname_matches = False
    is_wildcard = False

    for name in san_list:
        name_lower = name.lower()
        if name_lower.startswith("*."):
            is_wildcard = True
            base = name_lower[2:]
            # Under RFC 6125, *.domain.com matches only SINGLE-label subdomains (e.g. foo.domain.com)
            # It does NOT match nested subdomains (e.g. a.b.domain.com) or the apex domain itself
            if target_lower.endswith("." + base):
                prefix = target_lower[:-len("." + base)]
                if "." not in prefix:  # Exactly one label
                    hostname_matches = True
                    break
        elif name_lower == target_lower:
            hostname_matches = True
            break

    # 9. Revocation Endpoints (OCSP & CRL Distribution Points)
    ocsp_urls = []
    crl_urls = []
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

    # 10. Certificate Chain Details
    parsed_chain = [parse_chain_cert(c) for c in chain_certs]

    # Serial Number in Hex
    serial_hex = format(cert.serial_number, "X")

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
        "is_self_signed": is_self_signed,
        "hostname_matches": hostname_matches,
        "is_wildcard": is_wildcard,
        "serial_number": serial_hex,
        "ocsp_urls": ocsp_urls,
        "crl_distribution_points": crl_urls,
        "has_revocation_info": has_revocation_info,
        "certificate_chain": parsed_chain
    }


async def query_crt_sh(domain: str) -> List[CTLogEntry]:
    """
    Queries crt.sh Certificate Transparency logs for the domain.
    """
    entries = []
    try:
        url = f"https://crt.sh/?q={domain}&output=json"
        async with httpx.AsyncClient(timeout=6.0) as client:
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
