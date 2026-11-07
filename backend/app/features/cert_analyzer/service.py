import uuid
import asyncio
from datetime import datetime, timezone
from urllib.parse import urlparse
from typing import List, Tuple

from app.features.cert_analyzer.models import (
    CertAnalyzeResponse,
    CertificateDetails,
    CertFinding,
    CTLogEntry,
    CertChainItem
)
from app.features.cert_analyzer.inspector import fetch_tls_certificate, query_crt_sh
from app.features.cert_analyzer.distrusted_cas import check_distrusted_ca
from app.core.groq_client import query_groq
from app.core.database import get_database


class CertAnalyzerService:

    def extract_hostname(self, raw_input: str) -> Tuple[str, str]:
        target = raw_input.strip()
        if not target.startswith(("http://", "https://")):
            target = "https://" + target

        parsed = urlparse(target)
        hostname = parsed.hostname or raw_input.strip()
        return target, hostname

    def evaluate_findings(self, cert_data: dict, hostname: str) -> List[CertFinding]:
        findings = []

        # 1. Hostname Mismatch
        if not cert_data.get("hostname_matches", True):
            findings.append(CertFinding(
                category="hostname_match",
                indicator="Hostname Mismatch: Certificate does not match domain name",
                severity="critical",
                evidence=f"Connected to '{hostname}' but certificate issued for SANs: {', '.join(cert_data.get('san_list', [])[:3])}",
                impact="Potential man-in-the-middle (MITM) attack or website impersonation",
                remediation="Configure a valid TLS certificate matching the exact domain name"
            ))

        # 2. Expiration Check
        if cert_data.get("is_expired", False):
            findings.append(CertFinding(
                category="validity",
                indicator="Expired TLS Certificate",
                severity="critical",
                evidence=f"Certificate expired on {cert_data.get('valid_to')}",
                impact="Encrypted connection is invalid and will trigger browser security warnings",
                remediation="Renew the SSL/TLS certificate immediately"
            ))
        elif cert_data.get("days_to_expiry") is not None and cert_data["days_to_expiry"] <= 14:
            days = cert_data["days_to_expiry"]
            findings.append(CertFinding(
                category="validity",
                indicator=f"TLS Certificate Expiring Soon ({days} days remaining)",
                severity="medium",
                evidence=f"Valid until {cert_data.get('valid_to')}",
                impact="Service disruption risk if certificate is not renewed before expiry",
                remediation="Initiate certificate renewal cycle"
            ))

        # 3. Self-Signed Certificate
        if cert_data.get("is_self_signed", False):
            findings.append(CertFinding(
                category="trust_chain",
                indicator="Self-Signed Certificate (Untrusted Authority)",
                severity="high",
                evidence=f"Issuer matches subject: '{cert_data.get('issuer_common_name')}'",
                impact="Connection cannot be independently verified by client devices",
                remediation="Replace with a certificate issued by an accredited Certificate Authority"
            ))

        # 4. Distrusted or Compromised Certificate Authority (Leaf + Intermediate Chain)
        issuer_org = cert_data.get("issuer_org")
        issuer_cn = cert_data.get("issuer_common_name")
        distrusted_match = check_distrusted_ca(issuer_org, issuer_cn)

        if distrusted_match:
            findings.append(CertFinding(
                category="trust_chain",
                indicator=f"Distrusted Certificate Authority: {distrusted_match['name']}",
                severity=distrusted_match["severity"],
                evidence=f"Leaf Issuer '{issuer_org or issuer_cn}' matches known security incident: {distrusted_match['reason']}",
                impact="Cryptographic trust in this authority has been revoked or questioned",
                remediation="Migrate certificate immediately to an established, accredited CA"
            ))

        # Check Intermediate Certificates in the Chain
        chain = cert_data.get("certificate_chain", [])
        if len(chain) > 1:
            for idx, item in enumerate(chain[1:], start=1):
                subj = item.get("subject", "")
                iss = item.get("issuer", "")
                chain_match = check_distrusted_ca(iss, subj)
                if chain_match:
                    findings.append(CertFinding(
                        category="trust_chain",
                        indicator=f"Distrusted Intermediate CA in Chain: {chain_match['name']}",
                        severity=chain_match["severity"],
                        evidence=f"Chain certificate #{idx} ('{subj}') is associated with: {chain_match['reason']}",
                        impact="Chain validation failure: Intermediate CA is revoked or distrusted by root stores",
                        remediation="Replace certificate chain with trusted intermediate certificates"
                    ))
                if item.get("is_expired"):
                    findings.append(CertFinding(
                        category="trust_chain",
                        indicator="Expired Intermediate Certificate in Chain",
                        severity="critical",
                        evidence=f"Intermediate certificate #{idx} ('{subj}') expired on {item.get('not_after')}",
                        impact="Certificate chain is broken; clients will reject TLS handshake",
                        remediation="Update web server TLS bundle with currently valid intermediate certificates"
                    ))

        # 5. Revocation Mechanisms (OCSP / CRL)
        if not cert_data.get("is_self_signed", False):
            if not cert_data.get("has_revocation_info", False):
                findings.append(CertFinding(
                    category="revocation",
                    indicator="Missing Revocation Endpoints (No OCSP or CRL)",
                    severity="low",
                    evidence="Certificate does not specify OCSP responder URLs or CRL distribution points",
                    impact="Clients cannot verify real-time revocation status if private key is compromised",
                    remediation="Issue certificate with AIA OCSP or CRL distribution points enabled"
                ))

        # 6. Weak Key Size
        key_type = cert_data.get("key_type")
        key_size = cert_data.get("key_size")

        if key_type == "RSA" and key_size and key_size < 2048:
            findings.append(CertFinding(
                category="cryptography",
                indicator=f"Inadequate RSA Key Size ({key_size} bits)",
                severity="high",
                evidence=f"Detected RSA key length of {key_size} bits (minimum recommended: 2048 bits)",
                impact="Weak cryptographic protection vulnerable to factoring attacks",
                remediation="Re-issue certificate with at least a 2048-bit RSA or 256-bit ECDSA key"
            ))

        # 7. Weak Signature Algorithm
        sig_algo = (cert_data.get("signature_algo") or "").lower()
        if "sha1" in sig_algo or "md5" in sig_algo:
            findings.append(CertFinding(
                category="cryptography",
                indicator=f"Deprecated / Weak Signature Algorithm ({cert_data.get('signature_algo')})",
                severity="critical",
                evidence=f"Signature algorithm: {cert_data.get('signature_algo')}",
                impact="Susceptible to collision attacks and rejected by modern browsers",
                remediation="Re-issue with SHA-256 or stronger digest"
            ))

        # 8. Wildcard Certificate Notice
        if cert_data.get("is_wildcard", False):
            findings.append(CertFinding(
                category="cryptography",
                indicator="Wildcard Certificate Detected",
                severity="low",
                evidence=f"SAN pattern: {', '.join(cert_data.get('san_list', [])[:2])}",
                impact="Key compromise impacts all subdomains under this wildcard",
                remediation="Ensure strict private key custody across all endpoints"
            ))

        return findings

    def compute_trust_score(self, findings: List[CertFinding], cert_data: dict) -> Tuple[int, str, str]:
        score = 0
        trust_status = "trusted"

        for f in findings:
            if f.severity == "critical":
                score += 40
                trust_status = "compromised"
            elif f.severity == "high":
                score += 25
                if trust_status != "compromised":
                    trust_status = "untrusted"
            elif f.severity == "medium":
                score += 15
                if trust_status == "trusted":
                    trust_status = "suspicious"
            elif f.severity == "low":
                score += 5

        final_score = min(score, 100)
        risk_level = "high" if final_score >= 60 else ("suspicious" if final_score >= 30 else "low")

        return final_score, risk_level, trust_status

    async def generate_ai_explanation(self, domain: str, cert_details: CertificateDetails, findings: List[CertFinding], trust_status: str, risk_score: int) -> Tuple[str, List[str]]:
        findings_summary = "\n".join([f"- [{f.severity.upper()}] {f.indicator}: {f.evidence}" for f in findings]) or "No certificate security issues identified."

        chain_info = f"{len(cert_details.certificate_chain)} certificate(s) in chain"
        revocation_info = f"OCSP: {len(cert_details.ocsp_urls)} endpoint(s), CRL: {len(cert_details.crl_distribution_points)} endpoint(s)"

        prompt = f"""
You are an expert Public Key Infrastructure (PKI) and TLS security analyst. Analyze the following TLS certificate findings:

Domain: {domain}
Issuer: {cert_details.issuer_org or cert_details.issuer_common_name or 'Unknown'}
Certificate Chain: {chain_info}
Revocation Mechanisms: {revocation_info}
Key: {cert_details.key_type} {cert_details.key_size} bits
Signature Algorithm: {cert_details.signature_algo}
Trust Status: {trust_status.upper()} (Risk Score: {risk_score}/100)

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

        explanation = f"TLS analysis for {domain} evaluated as {trust_status} (Risk Score: {risk_score}/100)."
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

        # Run TLS Handshake and CT Logs in parallel
        loop = asyncio.get_event_loop()
        tls_task = loop.run_in_executor(None, fetch_tls_certificate, hostname)
        ct_task = query_crt_sh(hostname)

        cert_data, ct_logs = await asyncio.gather(tls_task, ct_task)

        # Handle Connection Failure / Plaintext HTTP
        if not cert_data or "error" in cert_data:
            err_msg = cert_data.get("error", "No TLS certificate found") if cert_data else "Connection failed"
            finding = CertFinding(
                category="validity",
                indicator="HTTPS Unavailable or Failed TLS Handshake",
                severity="high",
                evidence=err_msg,
                impact="Traffic cannot be encrypted; communications exposed to interception",
                remediation="Enable HTTPS and install a trusted SSL/TLS certificate"
            )
            return CertAnalyzeResponse(
                report_id=report_id,
                domain=hostname,
                url=full_url,
                risk_level="high",
                risk_score=75,
                is_https_available=False,
                trust_status="untrusted",
                certificate=None,
                findings=[finding],
                ct_logs=ct_logs,
                ai_explanation=f"The domain '{hostname}' does not support a secure HTTPS connection or failed the TLS handshake. Data transmitted to this website is unencrypted and vulnerable to eavesdropping.",
                recommended_actions=["Do not enter passwords or sensitive personal data.", "Check if the website offers an HTTPS address."],
                created_at=datetime.now(timezone.utc)
            )

        # Evaluate Findings
        findings = self.evaluate_findings(cert_data, hostname)
        risk_score, risk_level, trust_status = self.compute_trust_score(findings, cert_data)

        cert_details = CertificateDetails(**cert_data)

        # Groq AI Explanation
        explanation, recommendations = await self.generate_ai_explanation(
            hostname, cert_details, findings, trust_status, risk_score
        )

        response = CertAnalyzeResponse(
            report_id=report_id,
            domain=hostname,
            url=full_url,
            risk_level=risk_level,
            risk_score=risk_score,
            is_https_available=True,
            trust_status=trust_status,
            certificate=cert_details,
            findings=findings,
            ct_logs=ct_logs,
            ai_explanation=explanation,
            recommended_actions=recommendations,
            created_at=datetime.now(timezone.utc)
        )

        # Async Save to MongoDB (cert_analyses collection)
        db = get_database()
        if db is not None:
            try:
                doc = response.model_dump()
                doc["_id"] = report_id
                await db.cert_analyses.insert_one(doc)
            except Exception as e:
                print(f"MongoDB cert persistence notice: {e}")

        return response


cert_analyzer_service = CertAnalyzerService()
