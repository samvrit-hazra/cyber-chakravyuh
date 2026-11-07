import asyncio
import sys
import os

# Add backend to PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.features.security_auditor.service import security_auditor_service
from app.features.security_auditor.scanner import (
    audit_security_headers,
    correlate_shodan_host,
    check_http_enforcement
)
import httpx


async def run_tests():
    print("🧪 Running Website Security Assessment (Module 5) Verification Tests...\n")

    # 1. SSRF Protection Test
    print("1️⃣ Testing SSRF Protection against internal IP (127.0.0.1)...")
    res_ssrf = await security_auditor_service.audit_url("http://127.0.0.1:8000")
    assert res_ssrf.grade == "F"
    assert res_ssrf.security_score == 0
    assert any("SSRF" in f.issue or "Internal" in f.issue for f in res_ssrf.findings)
    print("   ✅ SSRF blocked and flagged as critical.\n")

    # 2. Hardened Site Audit (github.com)
    print("2️⃣ Testing Live Audit on Hardened Domain (github.com)...")
    res_github = await security_auditor_service.audit_url("https://github.com")
    assert res_github.https_enforced is True
    assert "Strict-Transport-Security" in res_github.headers_present
    assert "X-Frame-Options" in res_github.headers_present or "X-Frame-Options (via CSP frame-ancestors)" in res_github.headers_present
    assert res_github.security_score >= 70
    assert res_github.grade in ["A+", "A", "B"]
    print(f"   Score: {res_github.security_score}/100 | Grade: {res_github.grade}")
    print(f"   Headers present ({len(res_github.headers_present)}): {res_github.headers_present[:4]}")
    print(f"   AI Summary: {res_github.ai_posture_summary[:140]}...")
    print("   ✅ Hardened site audit verified.\n")

    # 3. Missing Headers & HTTP Redirection on example.com
    print("3️⃣ Testing Missing Headers & Plain HTTP on example.com...")
    res_example = await security_auditor_service.audit_url("http://example.com")
    assert "Content-Security-Policy" in res_example.headers_missing
    assert "Strict-Transport-Security" in res_example.headers_missing
    print(f"   Score: {res_example.security_score}/100 | Grade: {res_example.grade}")
    print(f"   Missing Headers ({len(res_example.headers_missing)}): {res_example.headers_missing}")
    print("   ✅ Missing headers accurately detected.\n")

    # 4. Sensitive Shodan Port Correlation Simulation
    print("4️⃣ Testing Shodan Dangerous Open Port Correlation (MongoDB, Redis, SMB)...")
    mock_shodan = {
        "ip": "203.0.113.5",
        "ports": [80, 443, 27017, 6379, 445],
        "vulnerabilities": ["CVE-2021-44228"]
    }
    shodan_findings = correlate_shodan_host(mock_shodan)
    port_issues = [f.issue for f in shodan_findings]
    assert any("MongoDB" in issue for issue in port_issues)
    assert any("Redis" in issue for issue in port_issues)
    assert any("SMB" in issue for issue in port_issues)
    assert any("CVE" in issue for issue in port_issues)
    print(f"   Detected Findings from Shodan ({len(shodan_findings)}):")
    for f in shodan_findings[:3]:
        print(f"     - [{f.severity.upper()}] {f.issue}")
    print("   ✅ Shodan dangerous port and CVE correlation verified.\n")

    # 5. Header Analysis Unit Logic (CSP, HSTS, XFO)
    print("5️⃣ Testing Header Analysis Logic Unit Test...")
    mock_headers = httpx.Headers({
        "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'",
        "Strict-Transport-Security": "max-age=3600",
        "Server": "Apache/2.4.41 (Ubuntu)",
        "X-Powered-By": "PHP/7.4.3"
    })
    details, findings, pres, miss, leak = audit_security_headers(mock_headers)
    assert "Strict-Transport-Security" in pres
    assert "X-Frame-Options" in miss
    assert leak is not None and "Apache" in leak
    assert any("unsafe-inline" in f.technical_evidence or "Permissive" in f.issue for f in findings)
    print(f"   Detected Leak: {leak}")
    print("   ✅ Security header inspection logic verified.\n")

    # 6. Groq AI Remediation Priorities Verification
    print("6️⃣ Testing AI Prioritized Remediations Output...")
    assert len(res_github.remediation_priorities) >= 1
    print(f"   Top Remediations: {res_github.remediation_priorities}")
    print("   ✅ Groq AI prioritized remediations verified.\n")

    print("🎉 All 6 Website Security Assessment Verification Tests Passed!")


if __name__ == "__main__":
    asyncio.run(run_tests())
