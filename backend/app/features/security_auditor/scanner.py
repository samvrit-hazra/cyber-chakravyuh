import re
import httpx
from typing import Tuple, List, Dict, Any, Optional
from urllib.parse import urlparse

from app.features.security_auditor.models import (
    HeaderAuditDetail,
    AuditFinding,
    ExposureProbeResult,
    CookieAudit
)

SENSITIVE_PORTS_MAP = {
    21: ("FTP", "Unencrypted file transfer service exposed to the internet", "high"),
    23: ("Telnet", "Legacy unencrypted remote login protocol", "critical"),
    445: ("SMB", "Windows file sharing / SMB exposed; highly targeted by ransomware and exploits", "critical"),
    3306: ("MySQL", "Directly accessible relational database port", "high"),
    3389: ("RDP", "Remote Desktop Protocol exposed to brute-force attacks", "high"),
    5432: ("PostgreSQL", "Directly accessible PostgreSQL database port", "high"),
    5900: ("VNC", "Virtual Network Computing remote desktop exposed", "high"),
    6379: ("Redis", "In-memory database exposed without network boundary protection", "critical"),
    9200: ("Elasticsearch", "Search cluster API exposed to unauthenticated indexing/leakage", "critical"),
    27017: ("MongoDB", "NoSQL database listening publicly on the internet", "critical")
}


def audit_security_headers(headers: httpx.Headers) -> Tuple[List[HeaderAuditDetail], List[AuditFinding], List[str], List[str], Optional[str]]:
    """
    Evaluates HTTP response headers against OWASP secure configuration baselines.
    """
    details: List[HeaderAuditDetail] = []
    findings: List[AuditFinding] = []
    present: List[str] = []
    missing: List[str] = []

    # 1. Content-Security-Policy (CSP)
    csp_val = headers.get("content-security-policy")
    if csp_val:
        present.append("Content-Security-Policy")
        is_weak = any(w in csp_val for w in ["'unsafe-inline'", "'unsafe-eval'", "default-src *"])
        if is_weak:
            details.append(HeaderAuditDetail(
                header="Content-Security-Policy",
                status="present_weak",
                value=csp_val[:120] + "..." if len(csp_val) > 120 else csp_val,
                description="Prevents Cross-Site Scripting (XSS) and data injection attacks",
                recommendation="Remove 'unsafe-inline' and 'unsafe-eval' directives; use strict nonces or hashes"
            ))
            findings.append(AuditFinding(
                issue="Permissive Content-Security-Policy Directives",
                technical_evidence=f"CSP contains permissive keyword: {csp_val[:80]}...",
                potential_impact="Reduces browser protection against XSS and malicious script execution",
                severity="low",
                remediation="Adopt a nonce-based or hash-based strict Content-Security-Policy",
                relevant_limitations="Static header analysis only; inline policy exceptions may be deliberate"
            ))
        else:
            details.append(HeaderAuditDetail(
                header="Content-Security-Policy",
                status="present_valid",
                value=csp_val[:120] + "..." if len(csp_val) > 120 else csp_val,
                description="Strict Content-Security-Policy configured"
            ))
    else:
        missing.append("Content-Security-Policy")
        details.append(HeaderAuditDetail(
            header="Content-Security-Policy",
            status="missing",
            description="Prevents Cross-Site Scripting (XSS) and code injection attacks",
            recommendation="Configure a Content-Security-Policy restricting allowed script and asset origins"
        ))
        findings.append(AuditFinding(
            issue="Missing Content-Security-Policy (CSP) Header",
            technical_evidence="Response lacks Content-Security-Policy header",
            potential_impact="Vulnerable to client-side injection and cross-site scripting (XSS) attacks",
            severity="medium",
            remediation="Implement a Content-Security-Policy header enforcing safe origin boundaries",
            relevant_limitations="Absence of CSP does not mean XSS is exploitable; it indicates missing defense-in-depth"
        ))

    # 2. Strict-Transport-Security (HSTS)
    hsts_val = headers.get("strict-transport-security")
    if hsts_val:
        present.append("Strict-Transport-Security")
        hsts_lower = hsts_val.lower()
        max_age_match = re.search(r'max-age=(\d+)', hsts_lower)
        max_age = int(max_age_match.group(1)) if max_age_match else 0

        if max_age < 15552000:  # < 180 days
            details.append(HeaderAuditDetail(
                header="Strict-Transport-Security",
                status="present_weak",
                value=hsts_val,
                description="Forces browsers to only communicate over encrypted HTTPS connections",
                recommendation="Increase max-age to at least 31536000 (1 year) and includeSubDomains"
            ))
            findings.append(AuditFinding(
                issue="Short HSTS max-age Duration",
                technical_evidence=f"HSTS configured with max-age={max_age} seconds (recommended >= 31536000)",
                potential_impact="Short expiration window leaves clients exposed to SSL-stripping MITM attacks after expiry",
                severity="low",
                remediation="Extend HSTS max-age to 31536000 and enable includeSubDomains",
                relevant_limitations="Requires continuous HTTPS availability across all hostnames"
            ))
        else:
            details.append(HeaderAuditDetail(
                header="Strict-Transport-Security",
                status="present_valid",
                value=hsts_val,
                description="Strong HTTP Strict Transport Security enforced"
            ))
    else:
        missing.append("Strict-Transport-Security")
        details.append(HeaderAuditDetail(
            header="Strict-Transport-Security",
            status="missing",
            description="Enforces HTTPS connections and blocks SSL stripping attacks",
            recommendation="Set Strict-Transport-Security: max-age=31536000; includeSubDomains; preload"
        ))
        findings.append(AuditFinding(
            issue="Missing HTTP Strict Transport Security (HSTS) Header",
            technical_evidence="Response lacks Strict-Transport-Security header",
            potential_impact="Users connecting over insecure networks can be downgraded to unencrypted HTTP via SSL stripping",
            severity="medium",
            remediation="Add Strict-Transport-Security header with max-age of at least 1 year",
            relevant_limitations="Applies only to HTTPS responses"
        ))

    # 3. X-Frame-Options (Clickjacking)
    xfo_val = headers.get("x-frame-options")
    csp_has_frame = "frame-ancestors" in (csp_val or "").lower()
    if xfo_val:
        present.append("X-Frame-Options")
        details.append(HeaderAuditDetail(
            header="X-Frame-Options",
            status="present_valid",
            value=xfo_val,
            description="Controls whether the site can be embedded in frames / iframes"
        ))
    elif csp_has_frame:
        present.append("X-Frame-Options (via CSP frame-ancestors)")
        details.append(HeaderAuditDetail(
            header="X-Frame-Options",
            status="present_valid",
            value="Covered by CSP frame-ancestors",
            description="Clickjacking mitigated via Content-Security-Policy frame-ancestors"
        ))
    else:
        missing.append("X-Frame-Options")
        details.append(HeaderAuditDetail(
            header="X-Frame-Options",
            status="missing",
            description="Protects users against Clickjacking attacks",
            recommendation="Set X-Frame-Options: DENY or SAMEORIGIN (or CSP frame-ancestors 'self')"
        ))
        findings.append(AuditFinding(
            issue="Missing Clickjacking Defense (X-Frame-Options)",
            technical_evidence="Neither X-Frame-Options nor CSP frame-ancestors is configured",
            potential_impact="Attacker can embed this webpage inside an invisible iframe to hijack user clicks",
            severity="medium",
            remediation="Configure X-Frame-Options: DENY or SAMEORIGIN",
            relevant_limitations="Modern browsers prioritize CSP frame-ancestors over X-Frame-Options"
        ))

    # 4. X-Content-Type-Options
    xcto_val = headers.get("x-content-type-options")
    if xcto_val and "nosniff" in xcto_val.lower():
        present.append("X-Content-Type-Options")
        details.append(HeaderAuditDetail(
            header="X-Content-Type-Options",
            status="present_valid",
            value=xcto_val,
            description="Prevents MIME-type sniffing by browsers"
        ))
    else:
        missing.append("X-Content-Type-Options")
        details.append(HeaderAuditDetail(
            header="X-Content-Type-Options",
            status="missing",
            description="Prevents browsers from MIME-sniffing a response away from declared content-type",
            recommendation="Set X-Content-Type-Options: nosniff"
        ))
        findings.append(AuditFinding(
            issue="Missing X-Content-Type-Options Header",
            technical_evidence="Response lacks X-Content-Type-Options: nosniff header",
            potential_impact="Browsers may execute uploaded user files (like images) as HTML or JavaScript via MIME-sniffing",
            severity="low",
            remediation="Add X-Content-Type-Options: nosniff to all responses",
            relevant_limitations="Mainly impacts endpoints that serve user-uploaded static files"
        ))

    # 5. Referrer-Policy
    ref_val = headers.get("referrer-policy")
    if ref_val:
        present.append("Referrer-Policy")
        details.append(HeaderAuditDetail(
            header="Referrer-Policy",
            status="present_valid",
            value=ref_val,
            description="Controls amount of referrer information sent with outbound requests"
        ))
    else:
        missing.append("Referrer-Policy")
        details.append(HeaderAuditDetail(
            header="Referrer-Policy",
            status="missing",
            description="Protects sensitive URL query parameters from leaking to third parties",
            recommendation="Set Referrer-Policy: strict-origin-when-cross-origin"
        ))
        findings.append(AuditFinding(
            issue="Missing Referrer-Policy Header",
            technical_evidence="Response lacks Referrer-Policy header",
            potential_impact="Internal URLs, session IDs, or tokens embedded in query strings may leak in HTTP Referer headers",
            severity="low",
            remediation="Configure Referrer-Policy: strict-origin-when-cross-origin",
            relevant_limitations="Modern browsers default to strict-origin-when-cross-origin if omitted"
        ))

    # 6. Permissions-Policy
    perm_val = headers.get("permissions-policy")
    if perm_val:
        present.append("Permissions-Policy")
        details.append(HeaderAuditDetail(
            header="Permissions-Policy",
            status="present_valid",
            value=perm_val[:80] + "..." if len(perm_val) > 80 else perm_val,
            description="Controls browser features like camera, microphone, and geolocation"
        ))
    else:
        missing.append("Permissions-Policy")

    # 7. Information Disclosure (Server / X-Powered-By)
    server_leak = None
    server_val = headers.get("server")
    powered_val = headers.get("x-powered-by")
    aspnet_val = headers.get("x-aspnet-version")

    leaks = []
    if server_val and re.search(r'\d+\.\d+', server_val):
        leaks.append(f"Server: {server_val}")
    if powered_val:
        leaks.append(f"X-Powered-By: {powered_val}")
    if aspnet_val:
        leaks.append(f"X-AspNet-Version: {aspnet_val}")

    if leaks:
        server_leak = ", ".join(leaks)
        findings.append(AuditFinding(
            issue="Server Technology & Version Banner Disclosure",
            technical_evidence=f"Exposed headers: {server_leak}",
            potential_impact="Discloses exact server and framework version, simplifying reconnaissance for attackers looking for known CVEs",
            severity="low",
            remediation="Configure web server to suppress or genericize Server and X-Powered-By banners",
            relevant_limitations="Header masking is defense-in-depth, not a substitute for patching"
        ))

    return details, findings, present, missing, server_leak


def audit_cookies(cookies: httpx.Cookies, raw_headers: httpx.Headers) -> Tuple[List[CookieAudit], List[AuditFinding]]:
    """
    Inspects Set-Cookie headers for Secure, HttpOnly, and SameSite attributes.
    """
    cookie_audits: List[CookieAudit] = []
    findings: List[AuditFinding] = []

    set_cookie_headers = raw_headers.get_list("set-cookie")
    for raw in set_cookie_headers:
        parts = [p.strip() for p in raw.split(";")]
        if not parts:
            continue
        cookie_name = parts[0].split("=")[0].strip()

        secure = any(p.lower() == "secure" for p in parts)
        http_only = any(p.lower() == "httponly" for p in parts)

        same_site = None
        for p in parts:
            if p.lower().startswith("samesite="):
                same_site = p.split("=")[-1].strip()

        issues = []
        if not secure:
            issues.append("Missing 'Secure' flag (can transmit in plaintext HTTP)")
        if not http_only:
            issues.append("Missing 'HttpOnly' flag (accessible to JavaScript / XSS theft)")
        if not same_site:
            issues.append("Missing 'SameSite' attribute (CSRF exposure)")

        cookie_audits.append(CookieAudit(
            name=cookie_name,
            secure=secure,
            http_only=http_only,
            same_site=same_site,
            issues=issues
        ))

        if issues:
            findings.append(AuditFinding(
                issue=f"Insecure Cookie Configuration: {cookie_name}",
                technical_evidence=f"Cookie '{cookie_name}' attributes: {', '.join(issues)}",
                potential_impact="Session cookies could be intercepted over plaintext HTTP or stolen via Cross-Site Scripting (XSS)",
                severity="medium" if not http_only and not secure else "low",
                remediation=f"Set 'Secure; HttpOnly; SameSite=Lax' on cookie '{cookie_name}'",
                relevant_limitations="Only cookies sent in the initial HTTP response are inspected"
            ))

    return cookie_audits, findings


async def check_http_enforcement(domain: str) -> Tuple[bool, Optional[AuditFinding]]:
    """
    Verifies whether plain unencrypted HTTP automatically redirects to HTTPS.
    """
    try:
        async with httpx.AsyncClient(timeout=5.0, follow_redirects=False) as client:
            resp = await client.get(f"http://{domain}")
            loc = resp.headers.get("location", "")
            if resp.status_code in [301, 302, 307, 308] and loc.startswith("https://"):
                return True, None

            if resp.status_code == 200:
                finding = AuditFinding(
                    issue="Insecure Plaintext HTTP Allowed (No HTTPS Redirect)",
                    technical_evidence=f"http://{domain} returned HTTP 200 OK without redirecting to https://",
                    potential_impact="Users may inadvertently browse over unencrypted HTTP, exposing sessions to packet sniffing and MITM attacks",
                    severity="high",
                    remediation="Configure a permanent HTTP 301 redirect from http:// to https://",
                    relevant_limitations="Checked only the root index path"
                )
                return False, finding
    except Exception:
        pass

    return True, None


async def run_exposure_probes(base_url: str) -> Tuple[List[ExposureProbeResult], List[AuditFinding]]:
    """
    Safely probes public exposure of standard configuration files without exploitation.
    """
    parsed = urlparse(base_url)
    root = f"{parsed.scheme}://{parsed.netloc}"

    probe_paths = [
        ("/robots.txt", "Search engine indexing directive file"),
        ("/.well-known/security.txt", "RFC 9116 Responsible Vulnerability Disclosure policy"),
        ("/.git/HEAD", "Exposed Git Version Control repository"),
        ("/.env", "Exposed application environment & secret configuration file")
    ]

    results: List[ExposureProbeResult] = []
    findings: List[AuditFinding] = []

    async with httpx.AsyncClient(timeout=4.0, follow_redirects=False) as client:
        for path, desc in probe_paths:
            probe_url = root + path
            try:
                resp = await client.get(probe_url)
                status = resp.status_code
                content = resp.text[:300] if resp.status_code == 200 else ""

                if path == "/.git/HEAD" and status == 200 and "ref:" in content:
                    results.append(ExposureProbeResult(
                        path=path,
                        status_code=status,
                        exposed=True,
                        summary="CRITICAL: Publicly accessible Git repository HEAD detected!"
                    ))
                    findings.append(AuditFinding(
                        issue="Critical Source Code Exposure: Public .git Directory",
                        technical_evidence=f"GET {probe_url} returned HTTP 200 with content: '{content.strip()}'",
                        potential_impact="Attackers can download the entire source code repository, history, and embedded API keys",
                        severity="critical",
                        remediation="Block access to all dotfiles (.*) and delete public .git directories immediately",
                        relevant_limitations="Passive GET probe on .git/HEAD only"
                    ))
                elif path == "/.env" and status == 200 and any(k in content for k in ["=", "KEY", "SECRET", "DB_"]):
                    results.append(ExposureProbeResult(
                        path=path,
                        status_code=status,
                        exposed=True,
                        summary="CRITICAL: Publicly accessible environment (.env) file detected!"
                    ))
                    findings.append(AuditFinding(
                        issue="Critical Secret Exposure: Public .env File",
                        technical_evidence=f"GET {probe_url} returned HTTP 200 containing configuration keys",
                        potential_impact="Database passwords, API keys, and internal secrets directly exposed to anyone on the internet",
                        severity="critical",
                        remediation="Remove .env from the web server public docroot and revoke all exposed credentials immediately",
                        relevant_limitations="Passive GET probe on .env only"
                    ))
                elif path == "/robots.txt" and status == 200:
                    disallows = re.findall(r'Disallow:\s*([^\r\n]+)', resp.text)
                    sensitive_disallows = [d for d in disallows if any(s in d.lower() for s in ["admin", "api", "backup", "secret", "internal", "config", "private"])]
                    summary = f"robots.txt found with {len(disallows)} directives"
                    if sensitive_disallows:
                        summary += f" (Exposes sensitive paths: {', '.join(sensitive_disallows[:3])})"
                        findings.append(AuditFinding(
                            issue="Sensitive Administrative Paths Disclosed in robots.txt",
                            technical_evidence=f"robots.txt Disallow entries: {', '.join(sensitive_disallows[:4])}",
                            potential_impact="Gives attackers a direct map of unpublished administrative and internal endpoints",
                            severity="low",
                            remediation="Do not rely on robots.txt for security; restrict access to admin portals with authentication and IP whitelists",
                            relevant_limitations="robots.txt is public by design"
                        ))
                    results.append(ExposureProbeResult(path=path, status_code=status, exposed=False, summary=summary))
                elif path == "/.well-known/security.txt" and status == 200:
                    results.append(ExposureProbeResult(
                        path=path,
                        status_code=status,
                        exposed=False,
                        summary="Positive Security Indicator: RFC 9116 security.txt policy is published"
                    ))
                else:
                    results.append(ExposureProbeResult(
                        path=path,
                        status_code=status,
                        exposed=False,
                        summary=f"Path not exposed (HTTP {status})"
                    ))
            except Exception as e:
                results.append(ExposureProbeResult(
                    path=path,
                    status_code=0,
                    exposed=False,
                    summary=f"Probe failed or connection refused"
                ))

    return results, findings


def correlate_shodan_host(shodan_intel: Optional[Dict[str, Any]]) -> List[AuditFinding]:
    """
    Evaluates Shodan Host intelligence for open database/administrative ports and CVEs.
    """
    findings: List[AuditFinding] = []
    if not shodan_intel or shodan_intel.get("error"):
        return findings

    ports = shodan_intel.get("ports", [])
    for p in ports:
        if p in SENSITIVE_PORTS_MAP:
            service_name, desc, sev = SENSITIVE_PORTS_MAP[p]
            findings.append(AuditFinding(
                issue=f"Dangerous Public Service Exposed: Port {p} ({service_name})",
                technical_evidence=f"Shodan indexed open port {p} on host IP {shodan_intel.get('ip')}: {desc}",
                potential_impact=f"Attackers can attempt direct authentication bypass, denial of service, or exploit known vulnerabilities in {service_name}",
                severity=sev,
                remediation=f"Block inbound access to port {p} via firewall/security groups; bind {service_name} to 127.0.0.1 or internal VPC only",
                relevant_limitations="Based on Shodan OSINT scan data; may reflect cached results"
            ))

    vulns = shodan_intel.get("vulnerabilities", [])
    if vulns:
        findings.append(AuditFinding(
            issue=f"Known Unpatched CVE Vulnerabilities Detected ({len(vulns)} CVEs)",
            technical_evidence=f"Shodan identified CVEs on host: {', '.join(vulns[:5])}",
            potential_impact="Publicly disclosed vulnerabilities with available exploit code may allow remote code execution or data theft",
            severity="high" if len(vulns) < 5 else "critical",
            remediation="Patch host operating system packages and web server dependencies to latest security releases",
            relevant_limitations="Passive OSINT correlation; actual exploitability depends on service patch level"
        ))

    return findings
