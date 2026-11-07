import asyncio
import sys
import os

# Add backend to PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.features.url_scanner.service import url_scanner_service
from app.features.url_scanner.heuristics import detect_typosquatting, detect_homoglyphs, inspect_url_structure


async def run_tests():
    print("🧪 Running URL Scanner Verification Tests...\n")

    # 1. SSRF Protection Test
    print("1️⃣ Testing SSRF Protection against localhost...")
    res_ssrf = await url_scanner_service.analyze_url("http://127.0.0.1:8000/admin")
    assert res_ssrf.risk_score >= 80, f"Expected high risk score for SSRF, got {res_ssrf.risk_score}"
    assert any("SSRF" in f.indicator for f in res_ssrf.findings), "SSRF finding missing"
    print("   ✅ SSRF successfully blocked and flagged as high risk.\n")

    # 2. Typosquatting / Brand Impersonation
    print("2️⃣ Testing Typosquatting Heuristics...")
    is_typo, target = detect_typosquatting("paypa1.com")
    print(f"   Domain 'paypa1.com' -> Typosquat: {is_typo}, Target: {target}")
    assert is_typo and target == "paypal.com", "Failed to detect paypa1.com typosquat"

    is_typo2, target2 = detect_typosquatting("paypal-security-update.com")
    print(f"   Domain 'paypal-security-update.com' -> Typosquat: {is_typo2}, Target: {target2}")
    assert is_typo2 and target2 == "paypal.com", "Failed to detect substring brand impersonation"
    print("   ✅ Typosquatting heuristics verified.\n")

    # 3. Homoglyph / Punycode
    print("3️⃣ Testing Homoglyph Punycode detection...")
    is_homo, evidence = detect_homoglyphs("xn--pple-43d.com")
    print(f"   Domain 'xn--pple-43d.com' -> Homoglyph: {is_homo}, Evidence: {evidence}")
    assert is_homo, "Failed to detect IDN Punycode"
    print("   ✅ Homoglyph detection verified.\n")

    # 4. Deceptive Structure, Subdomain Brand Spoofing & Credentials
    print("4️⃣ Testing Credentials & Keyword Deception...")
    struct_findings = inspect_url_structure(
        url="http://google.com@phishing-landing.com/login",
        hostname="phishing-landing.com",
        subdomain="verify.login",
        registered_domain="phishing-landing.com",
        suffix="com"
    )
    indicators = [f["indicator"] for f in struct_findings]
    print(f"   Findings: {indicators}")
    assert any("@" in ind for ind in indicators), "Failed to detect '@' credential deception"
    assert any("verify" in ind or "login" in ind for ind in indicators), "Failed to detect deceptive keywords"
    print("   ✅ URL structural deception checks verified.\n")

    # 5. Full Pipeline Test on Benign Domain (example.com)
    print("5️⃣ Testing Full Pipeline on Benign URL (https://example.com)...")
    res_benign = await url_scanner_service.analyze_url("https://example.com")
    print(f"   URL: {res_benign.normalized_url}")
    print(f"   Risk Level: {res_benign.risk_level.upper()}, Risk Score: {res_benign.risk_score}")
    print(f"   AI Explanation: {res_benign.ai_explanation}")
    assert res_benign.risk_level in ("low", "suspicious"), f"Benign URL flagged as {res_benign.risk_level}"
    print("   ✅ Full pipeline execution succeeded on benign URL.\n")

    print("🎉 All 5 URL Scanner Verification Tests Passed!")


if __name__ == "__main__":
    asyncio.run(run_tests())
