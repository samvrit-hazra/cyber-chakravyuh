import uuid
import asyncio
from datetime import datetime, timezone
from urllib.parse import urlparse
from typing import List, Tuple, Dict, Any

from app.features.cert_analyzer.models import (
    CertAnalyzeResponse,
    CertificateDetails,
    CertFinding,
    CTLogEntry,
    CertChainItem
)
from app.features.cert_analyzer.inspector import fetch_tls_certificate, query_crt_sh
from app.features.cert_analyzer.distrusted_cas import check_distrusted_ca
from app.core.security import is_safe_url
from app.core.groq_client import query_groq
from app.core.database import get_database
from app.features.reports.service import report_integrity_service
from app.features.reports.models import ReportRegisterRequest


class CertAnalyzerService:

    def extract_hostname(self, raw_input: str) -> Tuple[str, str]:
        target = raw_input.strip()
        if not target.startswith(("http://", "https://")):
            target = "https://" + target

        parsed = urlparse(target)
        hostname = parsed.hostname or raw_input.strip()
        return target, hostname

    def evaluate_findings(self, cert_data: dict, hostname: str) -> List[CertFinding]:
        findings: List[CertFinding] = []

        # 1. Revocation Check (Highest Priority)
        if cert_data.get("is_revoked", False):
            rev_date = cert_data.get("revocation_date") or "Recently"
            rev_url = cert_data.get("revocation_url") or "CA CRL Endpoint"
            findings.append(CertFinding(
                category="revocation",
                indicator="Revoked TLS Certificate (CRL Revocation Verified)",
                severity="critical",
                evidence=f"Certificate was explicitly revoked by the CA on {rev_date} (CRL: {rev_url})",
                impact="Cryptographic trust has been revoked by the issuing CA. Private key compromise or domain ownership revocation.",
                remediation="Cease communications immediately and revoke/replace the TLS certificate."
            ))

        # 2. Expiration Check
        if cert_data.get("is_expired", False):
            days = abs(cert_data.get("days_to_expiry", 0))
            findings.append(CertFinding(
                category="validity",
                indicator="Expired TLS Certificate",
                severity="critical",
                evidence=f"Certificate expired on {cert_data.get('valid_to')} ({days} days ago)",
                impact="Encrypted connection is invalid and will trigger browser security warnings.",
                remediation="Renew the SSL/TLS certificate immediately with a currently valid certificate."
            ))
        elif cert_data.get("days_to_expiry") is not None and cert_data["days_to_expiry"] <= 14:
            days = cert_data["days_to_expiry"]
            findings.append(CertFinding(
                category="validity",
                indicator=f"TLS Certificate Expiring Soon ({days} days remaining)",
                severity="medium",
                evidence=f"Valid until {cert_data.get('valid_to')}",
                impact="Service disruption risk if certificate is not renewed before expiry.",
                remediation="Initiate certificate renewal cycle."
            ))

        # 3. Hostname Mismatch
        if not cert_data.get("hostname_matches", True):
            san_preview = ", ".join(cert_data.get("san_list", [])[:4]) or "none"
            findings.append(CertFinding(
                category="hostname_match",
                indicator="Hostname Mismatch: Certificate does not match domain name",
                severity="critical",
                evidence=f"Connected to '{hostname}' but certificate is issued for SANs: {san_preview}",
                impact="Potential man-in-the-middle (MITM) attack or website impersonation. Browsers will refuse the connection.",
                remediation="Configure a valid TLS certificate matching the exact domain name."
            ))

        # 4. Self-Signed Certificate
        if cert_data.get("is_self_signed", False):
            findings.append(CertFinding(
                category="trust_chain",
                indicator="Self-Signed TLS Certificate",
                severity="critical",
                evidence="Issuer and Subject are identical. Certificate was not signed by a recognized Certificate Authority.",
                impact="No cryptographic verification of ownership. Vulnerable to interception by attackers.",
                remediation="Replace with a certificate issued by an industry-standard CA (e.g. Let's Encrypt)."
            ))

        # 5. System Trust Store Validation Failure (Untrusted Root / Unknown CA)
        if not cert_data.get("system_trust_valid", True) and not cert_data.get("is_self_signed", False):
            err_reason = cert_data.get("system_trust_error") or "Untrusted root authority"
            findings.append(CertFinding(
                category="trust_chain",
                indicator="Untrusted Root Authority / System Trust Validation Failed",
                severity="critical",
                evidence=f"Operating system trust store failed to verify certificate path: {err_reason}",
                impact="Certificate is issued by an unknown, untrusted, or private internal CA not in standard browser trust stores.",
                remediation="Install a certificate issued by a globally recognized, WebTrust-audited Certificate Authority."
            ))

        # 6. Distrusted / Compromised CA
        issuer_org = cert_data.get("issuer_org", "")
        issuer_cn = cert_data.get("issuer_common_name", "")
        distrusted_info = check_distrusted_ca(issuer_org, issuer_cn)
        if distrusted_info:
            reason = distrusted_info.get("reason", "CA distrusted by major root programs")
            findings.append(CertFinding(
                category="trust_chain",
                indicator=f"Distrusted Certificate Authority ({issuer_org or issuer_cn})",
                severity="critical",
                evidence=reason,
                impact="Major web browsers do not trust this CA due to security or compliance violations.",
                remediation="Migrate immediately to a compliant CA."
            ))

        # 7. Weak Cryptography / Key Size
        key_type = cert_data.get("key_type", "")
        key_size = cert_data.get("key_size", 0)
        if key_type == "RSA" and key_size and key_size < 2048:
            findings.append(CertFinding(
                category="cryptography",
                indicator=f"Insecure RSA Key Size ({key_size} bits)",
                severity="critical",
                evidence=f"RSA key length {key_size} is below the 2048-bit NIST minimum.",
                impact="Vulnerable to cryptographic factorization attacks.",
                remediation="Upgrade to RSA 2048-bit or ECDSA P-256 / P-384."
            ))

        # 8. Outdated / Insecure Signature Algorithm
        sig_algo = (cert_data.get("signature_algo") or "").lower()
        if "sha1" in sig_algo or "md5" in sig_algo:
            findings.append(CertFinding(
                category="cryptography",
                indicator=f"Insecure Signature Algorithm ({cert_data.get('signature_algo')})",
                severity="critical",
                evidence="SHA-1 and MD5 collision resistance is broken.",
                impact="Attackers can create forged certificates matching this signature.",
                remediation="Reissue certificate using SHA-256 or SHA-384."
            ))

        # 9. Outdated TLS Protocol
        tls_ver = cert_data.get("tls_version", "")
        if tls_ver in ("TLSv1", "TLSv1.1", "SSLv2", "SSLv3"):
            findings.append(CertFinding(
                category="cryptography",
                indicator=f"Deprecated TLS Protocol ({tls_ver})",
                severity="high",
                evidence=f"Server negotiated obsolete {tls_ver} protocol.",
                impact="Vulnerable to protocol downgrade and cipher suite exploits (POODLE, BEAST).",
                remediation="Disable TLS 1.0/1.1 on server; mandate TLS 1.2 and TLS 1.3."
            ))

        # 10. Missing Revocation Information (OCSP & CRL)
        if not cert_data.get("has_revocation_info", False):
            findings.append(CertFinding(
                category="revocation",
                indicator="No OCSP or CRL Distribution Points Provided",
                severity="low",
                evidence="Certificate lacks both Authority Information Access (OCSP) and CRL endpoints.",
                impact="Clients cannot verify if this certificate has been revoked prior to expiration.",
                remediation="Configure certificate issuance profile to include OCSP and CRL distribution points."
            ))

        return findings

    def compute_trust_score(self, findings: List[CertFinding], cert_data: dict) -> Tuple[int, str, str, str, int, str]:
        """
        Computes deterministic trust score (0-100), letter grade (A+, A, B, C, D, F),
        status string, and risk level.
        Critical certificate failures strictly cap the grade to 'F' and trust score <= 20.
        """
        has_critical = any(f.severity == "critical" for f in findings)
        has_high = any(f.severity == "high" for f in findings)
        has_medium = any(f.severity == "medium" for f in findings)

        if has_critical:
            risk_level = "critical"
            trust_grade = "F"

            if cert_data.get("is_revoked", False):
                return 0, trust_grade, "Revoked Certificate", risk_level, 100, "compromised"

            if cert_data.get("is_expired", False):
                return 10, trust_grade, "Expired Certificate", risk_level, 95, "untrusted"

            if not cert_data.get("hostname_matches", True):
                return 15, trust_grade, "Hostname Mismatch", risk_level, 90, "untrusted"

            if cert_data.get("is_self_signed", False):
                return 15, trust_grade, "Untrusted / Self-Signed", risk_level, 90, "untrusted"

            if not cert_data.get("system_trust_valid", True):
                return 15, trust_grade, "Untrusted / Self-Signed", risk_level, 90, "untrusted"

            sig_algo = (cert_data.get("signature_algo") or "").lower()
            if "sha1" in sig_algo or "md5" in sig_algo:
                return 20, trust_grade, "Weak Cryptography", risk_level, 85, "untrusted"

            key_type = cert_data.get("key_type", "")
            key_size = cert_data.get("key_size", 0)
            if key_type == "RSA" and key_size and key_size < 2048:
                return 20, trust_grade, "Weak Cryptography", risk_level, 85, "untrusted"

            return 20, trust_grade, "Compromised CA Indicator", risk_level, 85, "compromised"

        if has_high:
            return 45, "D", "Weak Cryptography", "high", 55, "untrusted"

        if has_medium:
            days = cert_data.get("days_to_expiry", 30)
            grade = "C" if (days is not None and days <= 7) else "B"
            return 75, grade, "Expiring Soon", "suspicious", 25, "suspicious"

        # Baseline: Valid & Trusted
        tls_ver = cert_data.get("tls_version", "")
        grade = "A+" if "1.3" in tls_ver else "A"
        return 95, grade, "Valid & Trusted", "low", 5, "trusted"

    async def generate_ai_explanation(
        self,
        domain: str,
        cert_details: CertificateDetails,
        findings: List[CertFinding],
        trust_status: str,
        status: str,
        trust_grade: str,
        trust_score: int
    ) -> Tuple[str, List[str]]:
        findings_summary = "\n".join([f"- [{f.severity.upper()}] {f.indicator}: {f.evidence}" for f in findings]) or "No certificate security issues identified."

        chain_info = f"{len(cert_details.certificate_chain)} certificate(s) in chain"
        revocation_info = f"OCSP: {len(cert_details.ocsp_urls)} endpoint(s), CRL: {len(cert_details.crl_distribution_points)} endpoint(s)"

        prompt = f"""
You are an expert Public Key Infrastructure (PKI) and TLS security analyst. Analyze the following TLS certificate findings:

Domain: {domain}
Certificate Status: {status} (Grade: {trust_grade}, Trust Score: {trust_score}/100)
Issuer: {cert_details.issuer_org or cert_details.issuer_common_name or 'Unknown'}
Certificate Chain: {chain_info}
Revocation Mechanisms: {revocation_info}
Key: {cert_details.key_type} {cert_details.key_size} bits
Signature Algorithm: {cert_details.signature_algo}
Trust Status: {trust_status.upper()}

Findings:
{findings_summary}

Important Context: Remember that having a valid SSL/TLS certificate does NOT prove a website is safe or free of fraud (phishing sites often obtain free valid certificates).

Please provide:
1. A concise, evidence-based assessment of the website's digital trust and certificate security (2-3 sentences max).
2. A bulleted list of 2-3 specific, actionable recommendations for an end user or site administrator.

Format your output exactly as:
EXPLANATION: <your explanation>
RECOMMENDATIONS:
- <recommendation 1>
- <recommendation 2>
"""
        response_text = await query_groq(prompt)

        explanation = f"TLS analysis for {domain} evaluated as {status} (Grade: {trust_grade}, Trust Score: {trust_score}/100)."
        recommendations = [
            "Verify the website identity before sharing credentials.",
            "Ensure the URL domain matches the expected institution."
        ]

        if "EXPLANATION:" in response_text:
            try:
                parts = response_text.split("RECOMMENDATIONS:")
                explanation_part = parts[0].replace("EXPLANATION:", "").strip()
                if explanation_part:
                    explanation = explanation_part

                if len(parts) > 1:
                    raw_recs = [line.strip("- ").strip() for line in parts[1].strip().split("\n") if line.strip()]
                    if raw_recs:
                        recommendations = raw_recs
            except Exception:
                pass

        return explanation, recommendations

    async def analyze_cert(self, raw_url: str) -> CertAnalyzeResponse:
        report_id = str(uuid.uuid4())
        full_url, hostname = self.extract_hostname(raw_url)

        # 1. SSRF Ingress Protection Filter
        if not is_safe_url(full_url):
            finding = CertFinding(
                category="trust_chain",
                indicator="Restricted or Private Network Destination (SSRF Warning)",
                severity="critical",
                evidence=f"Hostname '{hostname}' resolves to private, loopback, or invalid IP address space.",
                impact="Destination is on an internal network and cannot be analyzed.",
                remediation="Provide a publicly routable internet domain."
            )
            ai_exp = "The target domain resolves to an internal, loopback, or cloud-metadata IP address. TLS inspection was blocked under SSRF prevention rules."
            resp = CertAnalyzeResponse(
                report_id=report_id,
                domain=hostname,
                url=full_url,
                risk_level="critical",
                risk_score=95,
                trust_score=0,
                grade="F",
                status="Untrusted / Restricted Destination",
                is_https_available=False,
                trust_status="compromised",
                certificate=None,
                certificate_details=None,
                findings=[finding],
                ct_logs=[],
                ai_explanation=ai_exp,
                recommended_actions=["Inspect public domains only.", "Do not target internal infrastructure."],
                created_at=datetime.now(timezone.utc)
            )
            try:
                reg_res = await report_integrity_service.register_report(ReportRegisterRequest(
                    report_id=report_id,
                    target=hostname,
                    scan_type="tls_certificate",
                    findings_summary=ai_exp,
                    risk_score=95,
                    risk_level="CRITICAL",
                    canonical_data={
                        "report_id": report_id,
                        "domain": hostname,
                        "status": "Untrusted / Restricted Destination",
                        "grade": "F",
                        "trust_score": 0,
                        "is_ssrf_blocked": True
                    }
                ))
                resp.report_hash = reg_res.report_hash
                resp.tx_hash = reg_res.tx_hash
                resp.blockchain_status = "Registered on Ethereum Sepolia"
                resp.contract_address = reg_res.contract_address
                resp.etherscan_url = reg_res.etherscan_url
            except Exception:
                pass
            return resp

        # 2. Run TLS Handshake and CT Logs in parallel
        loop = asyncio.get_event_loop()
        tls_task = loop.run_in_executor(None, fetch_tls_certificate, hostname)

        async def safe_ct_logs():
            try:
                return await asyncio.wait_for(query_crt_sh(hostname), timeout=2.0)
            except Exception:
                return []

        cert_data, ct_logs = await asyncio.gather(tls_task, safe_ct_logs())

        # Handle Connection Failure / Plaintext HTTP
        if not cert_data or "error" in cert_data:
            err_msg = cert_data.get("error", "No TLS certificate found") if cert_data else "Connection failed"
            finding = CertFinding(
                category="validity",
                indicator="HTTPS Unavailable or Failed TLS Handshake",
                severity="critical",
                evidence=err_msg,
                impact="Traffic cannot be encrypted; communications exposed to interception.",
                remediation="Enable HTTPS and install a trusted SSL/TLS certificate."
            )
            ai_exp = f"The domain '{hostname}' does not support a secure HTTPS connection or failed the TLS handshake. Data transmitted to this website is unencrypted and vulnerable to eavesdropping."
            resp = CertAnalyzeResponse(
                report_id=report_id,
                domain=hostname,
                url=full_url,
                risk_level="critical",
                risk_score=95,
                trust_score=0,
                grade="F",
                status="Inconclusive / Refused",
                is_https_available=False,
                trust_status="untrusted",
                certificate=None,
                certificate_details=None,
                findings=[finding],
                ct_logs=ct_logs,
                ai_explanation=ai_exp,
                recommended_actions=["Do not enter passwords or sensitive personal data.", "Check if the website offers an HTTPS address."],
                created_at=datetime.now(timezone.utc)
            )
            try:
                reg_res = await report_integrity_service.register_report(ReportRegisterRequest(
                    report_id=report_id,
                    target=hostname,
                    scan_type="tls_certificate",
                    findings_summary=ai_exp,
                    risk_score=95,
                    risk_level="CRITICAL",
                    canonical_data={
                        "report_id": report_id,
                        "domain": hostname,
                        "status": "Inconclusive / Refused",
                        "grade": "F",
                        "trust_score": 0,
                    }
                ))
                resp.report_hash = reg_res.report_hash
                resp.tx_hash = reg_res.tx_hash
                resp.blockchain_status = "Registered on Ethereum Sepolia"
                resp.contract_address = reg_res.contract_address
                resp.etherscan_url = reg_res.etherscan_url
            except Exception:
                pass
            return resp

        # 3. Evaluate Findings & Compute Deterministic Trust Score
        findings = self.evaluate_findings(cert_data, hostname)
        trust_score, trust_grade, status, risk_level, risk_score, trust_status = self.compute_trust_score(findings, cert_data)

        cert_details = CertificateDetails(**cert_data)

        # 4. Groq AI Explanation
        explanation, recommendations = await self.generate_ai_explanation(
            hostname, cert_details, findings, trust_status, status, trust_grade, trust_score
        )

        response = CertAnalyzeResponse(
            report_id=report_id,
            domain=hostname,
            url=full_url,
            risk_level=risk_level,
            risk_score=risk_score,
            trust_score=trust_score,
            grade=trust_grade,
            status=status,
            is_https_available=True,
            trust_status=trust_status,
            certificate=cert_details,
            certificate_details=cert_details,
            findings=findings,
            ct_logs=ct_logs,
            ai_explanation=explanation,
            recommended_actions=recommendations,
            created_at=datetime.now(timezone.utc)
        )

        # 5. Persistence & Provenance — Ethereum Sepolia Smart Contract & Cryptographic SHA-256
        try:
            reg_req = ReportRegisterRequest(
                report_id=report_id,
                target=hostname,
                scan_type="tls_certificate",
                findings_summary=explanation,
                risk_score=risk_score,
                risk_level=risk_level.upper(),
                canonical_data={
                    "report_id": report_id,
                    "domain": hostname,
                    "status": status,
                    "grade": trust_grade,
                    "trust_score": trust_score,
                    "issuer": cert_details.issuer_org or cert_details.issuer_common_name,
                    "valid_to": cert_details.valid_to.isoformat() if cert_details.valid_to else None,
                    "sha256": cert_details.sha256_fingerprint,
                }
            )
            reg_res = await report_integrity_service.register_report(reg_req)
            response.report_hash = reg_res.report_hash
            response.tx_hash = reg_res.tx_hash
            response.blockchain_status = "Registered on Ethereum Sepolia"
            response.contract_address = reg_res.contract_address
            response.etherscan_url = reg_res.etherscan_url
        except Exception as reg_err:
            print(f"Cert report blockchain registration notice: {reg_err}")

        # 6. Async Save to MongoDB (cert_analyses + indicators collections)
        db = get_database()
        if db is not None:
            try:
                doc = response.model_dump()
                doc["_id"] = report_id
                await db.cert_analyses.insert_one(doc)

                # Store indicator
                await db.indicators.insert_one({
                    "report_id": report_id,
                    "type": "tls_cert",
                    "value": hostname,
                    "fingerprint": cert_details.sha256_fingerprint,
                    "grade": trust_grade,
                    "created_at": datetime.now(timezone.utc)
                })
            except Exception as e:
                print(f"MongoDB cert persistence notice: {e}")

        return response


cert_analyzer_service = CertAnalyzerService()
