import uuid
import asyncio
import socket
from datetime import datetime, timezone
from urllib.parse import urlparse
from typing import List, Tuple, Dict, Any, Optional

import httpx

from app.features.security_auditor.models import (
    SecurityAuditRequest,
    SecurityAuditResponse,
    AuditFinding,
    HeaderAuditDetail,
    ExposureProbeResult,
    CookieAudit
)
from app.features.security_auditor.scanner import (
    audit_security_headers,
    audit_cookies,
    check_http_enforcement,
    run_exposure_probes,
    correlate_shodan_host
)
from app.core.security import is_safe_url
from app.core.shodan_client import query_shodan_host
from app.core.groq_client import query_groq
from app.core.database import get_database
from app.features.reports.service import report_integrity_service
from app.features.reports.models import ReportRegisterRequest


class SecurityAuditorService:

    def normalize_target(self, raw_input: str) -> Tuple[str, str]:
        target = raw_input.strip()
        if not target.startswith(("http://", "https://")):
            target = "https://" + target

        parsed = urlparse(target)
        hostname = parsed.hostname or raw_input.strip()
        return target, hostname

    def resolve_ip(self, hostname: str) -> str:
        try:
            return socket.gethostbyname(hostname)
        except Exception:
            return ""

    def calculate_score_and_grade(self, findings: List[AuditFinding]) -> Tuple[int, str, str]:
        score = 100
        has_critical = False
        has_high = False

        for f in findings:
            if f.severity == "critical":
                score -= 35
                has_critical = True
            elif f.severity == "high":
                score -= 20
                has_high = True
            elif f.severity == "medium":
                score -= 10
            elif f.severity == "low":
                score -= 4

        final_score = max(min(score, 100), 0)

        # Grade Assignment
        if final_score >= 90 and not has_high and not has_critical:
            grade = "A+"
            risk_level = "hardened"
        elif final_score >= 80:
            grade = "A"
            risk_level = "low_risk"
        elif final_score >= 65:
            grade = "B"
            risk_level = "moderate_risk"
        elif final_score >= 50:
            grade = "C"
            risk_level = "moderate_risk"
        elif final_score >= 35:
            grade = "D"
            risk_level = "high_risk"
        else:
            grade = "F"
            risk_level = "critical_risk"

        return final_score, grade, risk_level

    async def generate_ai_posture_summary(
        self,
        domain: str,
        score: int,
        grade: str,
        risk_level: str,
        findings: List[AuditFinding],
        headers_missing: List[str]
    ) -> Tuple[str, List[str]]:
        findings_summary = "\n".join([f"- [{f.severity.upper()}] {f.issue}: {f.technical_evidence}" for f in findings[:8]]) or "No major vulnerabilities identified."

        prompt = f"""
You are an elite Application Security Architect and DevSecOps Specialist. Evaluate the following website security posture audit:

Target Domain: {domain}
Security Score: {score}/100 (Grade: {grade}, Posture: {risk_level.upper()})
Missing Key Security Headers: {', '.join(headers_missing) or 'None'}

Identified Security Findings:
{findings_summary}

Please provide:
1. An executive summary assessing the site's defensive posture, identifying key exposure vectors (2-3 sentences).
2. A prioritized list of 2-3 concrete remediation actions for site administrators/developers (ordered by urgency).

Format output EXACTLY as:
SUMMARY: <your assessment>
REMEDIATIONS:
- <priority 1 remediation>
- <priority 2 remediation>
"""
        response_text = await query_groq(prompt)

        summary = f"Website security audit for {domain} received Grade {grade} (Score: {score}/100) with {len(findings)} identified configuration findings."
        remediations = [
            "Implement missing security headers (Content-Security-Policy, HSTS, X-Frame-Options).",
            "Ensure sensitive services and database ports are bound to localhost or protected behind a firewall."
        ]

        if "SUMMARY:" in response_text:
            try:
                parts = response_text.split("REMEDIATIONS:")
                sum_part = parts[0].replace("SUMMARY:", "").strip()
                if sum_part:
                    summary = sum_part
                if len(parts) > 1:
                    recs = [r.strip("- ").strip() for r in parts[1].strip().splitlines() if r.strip()]
                    if recs:
                        remediations = recs
            except Exception:
                pass

        return summary, remediations

    async def audit_url(self, raw_url: str) -> SecurityAuditResponse:
        report_id = str(uuid.uuid4())
        normalized_url, hostname = self.normalize_target(raw_url)

        # 1. DNS Resolution & SSRF Protection
        if not is_safe_url(normalized_url):
            host_ip = self.resolve_ip(hostname) or "127.0.0.1"
            critical_finding = AuditFinding(
                issue="Blocked Target: Internal or Loopback IP Address",
                technical_evidence=f"Hostname '{hostname}' resolves to restricted RFC 1918 / loopback address {host_ip}",
                potential_impact="Probing internal network infrastructure is forbidden under SSRF prevention rules",
                severity="critical",
                remediation="Provide a publicly routable internet domain",
                relevant_limitations="Private subnets are strictly un-auditable"
            )
            resp = SecurityAuditResponse(
                report_id=report_id,
                target_url=raw_url,
                normalized_url=normalized_url,
                host_ip=host_ip,
                security_score=0,
                risk_level="critical_risk",
                grade="F",
                https_enforced=False,
                findings=[critical_finding],
                ai_posture_summary="Target rejected: Hostname resolves to an internal or loopback IP address, violating SSRF protection policy.",
                remediation_priorities=["Audit publicly accessible domains only."],
                created_at=datetime.now(timezone.utc)
            )
            try:
                reg_res = await report_integrity_service.register_report(ReportRegisterRequest(
                    report_id=report_id,
                    target=normalized_url,
                    scan_type="security_audit",
                    findings_summary="Target rejected: Hostname resolves to an internal or loopback IP address, violating SSRF protection policy.",
                    risk_score=100,
                    risk_level="CRITICAL",
                    canonical_data={
                        "report_id": report_id,
                        "target": normalized_url,
                        "status": "SSRF_BLOCKED",
                        "grade": "F",
                        "security_score": 0
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

        host_ip = self.resolve_ip(hostname)

        # 2. Parallel Passive Data Gathering
        all_findings: List[AuditFinding] = []

        headers_task = self.fetch_headers_and_cookies(normalized_url)
        http_check_task = check_http_enforcement(hostname)
        probes_task = run_exposure_probes(normalized_url)
        shodan_task = query_shodan_host(host_ip) if host_ip else asyncio.sleep(0, result=None)

        (header_res, (https_enforced, http_finding), (probe_results, probe_findings), shodan_intel) = await asyncio.gather(
            headers_task, http_check_task, probes_task, shodan_task
        )

        # Process Headers & Cookies
        header_details, header_findings, headers_present, headers_missing, server_leak, cookie_audits, cookie_findings = header_res
        all_findings.extend(header_findings)
        all_findings.extend(cookie_findings)

        # Process HTTP Enforcement
        if http_finding:
            all_findings.append(http_finding)

        # Process Exposure Probes
        all_findings.extend(probe_findings)

        # Process Shodan OSINT
        if shodan_intel and not shodan_intel.get("error"):
            shodan_findings = correlate_shodan_host(shodan_intel)
            all_findings.extend(shodan_findings)

        # Calculate Score, Grade, and Risk Level
        score, grade, risk_level = self.calculate_score_and_grade(all_findings)

        # Groq AI Synthesis
        ai_summary, remediations = await self.generate_ai_posture_summary(
            hostname, score, grade, risk_level, all_findings, headers_missing
        )

        response = SecurityAuditResponse(
            report_id=report_id,
            target_url=raw_url,
            normalized_url=normalized_url,
            host_ip=host_ip,
            security_score=score,
            risk_level=risk_level,
            grade=grade,
            https_enforced=https_enforced,
            server_info_leak=server_leak,
            headers_present=headers_present,
            headers_missing=headers_missing,
            header_details=header_details,
            exposure_probes=probe_results,
            cookie_audits=cookie_audits,
            shodan_intel=shodan_intel if shodan_intel and not shodan_intel.get("error") else None,
            findings=all_findings,
            ai_posture_summary=ai_summary,
            remediation_priorities=remediations,
            created_at=datetime.now(timezone.utc)
        )

        # 3. Persistence & Provenance — Ethereum Sepolia Smart Contract & Cryptographic SHA-256
        try:
            reg_req = ReportRegisterRequest(
                report_id=report_id,
                target=hostname,
                scan_type="security_audit",
                findings_summary=ai_summary,
                risk_score=100 - score,
                risk_level=risk_level.upper(),
                canonical_data={
                    "report_id": report_id,
                    "target": hostname,
                    "scan_type": "security_audit",
                    "security_score": score,
                    "grade": grade,
                    "risk_level": risk_level.upper(),
                    "findings_count": len(all_findings),
                }
            )
            reg_res = await report_integrity_service.register_report(reg_req)
            response.report_hash = reg_res.report_hash
            response.tx_hash = reg_res.tx_hash
            response.blockchain_status = "Registered on Ethereum Sepolia"
            response.contract_address = reg_res.contract_address
            response.etherscan_url = reg_res.etherscan_url
        except Exception as reg_err:
            print(f"Audit report blockchain registration notice: {reg_err}")

        # 4. Save to MongoDB (security_audits + indicators collections)
        db = get_database()
        if db is not None:
            try:
                doc = response.model_dump()
                doc["_id"] = report_id
                await db.security_audits.insert_one(doc)

                if host_ip:
                    await db.indicators.insert_one({
                        "report_id": report_id,
                        "type": "audit_host",
                        "value": host_ip,
                        "hostname": hostname,
                        "created_at": datetime.now(timezone.utc)
                    })
            except Exception as e:
                print(f"MongoDB audit persistence notice: {e}")

        return response

    async def fetch_headers_and_cookies(self, url: str) -> Tuple[List[HeaderAuditDetail], List[AuditFinding], List[str], List[str], Optional[str], List[CookieAudit], List[AuditFinding]]:
        try:
            async with httpx.AsyncClient(timeout=6.0, follow_redirects=True) as client:
                resp = await client.get(url)
                details, findings, pres, miss, leak = audit_security_headers(resp.headers)
                cookie_audits, cookie_findings = audit_cookies(resp.cookies, resp.headers)
                return details, findings, pres, miss, leak, cookie_audits, cookie_findings
        except Exception as e:
            # Fallback if connection fails
            err_finding = AuditFinding(
                issue="Website Unreachable or TLS Connection Failure",
                technical_evidence=f"Failed to establish HTTP connection to {url}: {str(e)}",
                potential_impact="Website is inaccessible or rejecting connections",
                severity="high",
                remediation="Verify web server availability and domain DNS records",
                relevant_limitations="Auditor could not complete HTTP handshake"
            )
            return [], [err_finding], [], ["All Headers"], None, [], []


security_auditor_service = SecurityAuditorService()
