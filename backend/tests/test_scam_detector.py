import asyncio
import sys
import os

# Add backend to PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.features.scam_detector.service import scam_detector_service
from app.features.scam_detector.parsers import detect_format, parse_email_raw, parse_whatsapp_export
from app.features.scam_detector.extractors import extract_indicators


async def run_tests():
    print("🧪 Running AI Scam & Message Detector Verification Tests...\n")

    # 1. Format Detection Tests
    print("1️⃣ Testing Automatic Format Detection...")
    wa_sample = """[12/05/23, 10:15:23 AM] ~ John: Hey are you free?
[12/05/23, 10:16:01 AM] Me: Yes what is it?
[12/05/23, 10:17:15 AM] ~ John: Urgent favor needed!
"""
    email_sample = """From: Netflix Billing <support@mail-verify99.ru>
To: user@example.com
Subject: Account Suspended - Action Required
Date: Sat, 7 Nov 2026 10:00:00 +0000

Dear user, your payment failed. Update now.
"""
    sms_sample = "Your SBI account is blocked. Update your PAN immediately at https://sbi-kyc-update.com/pan or account will close."

    fmt_wa = detect_format(wa_sample)
    assert fmt_wa == "whatsapp_chat", f"Expected whatsapp_chat, got {fmt_wa}"
    print("   ✅ WhatsApp format recognized:", fmt_wa)

    fmt_email = detect_format(email_sample)
    assert fmt_email == "email_raw", f"Expected email_raw, got {fmt_email}"
    print("   ✅ Raw Email format recognized:", fmt_email)

    fmt_sms = detect_format(sms_sample)
    assert fmt_sms == "plain_text", f"Expected plain_text, got {fmt_sms}"
    print("   ✅ Plain text / SMS format recognized:", fmt_sms, "\n")

    # 2. Indicator Extraction Test
    print("2️⃣ Testing Entity & Indicator Extraction (URLs, Crypto, UPI, Phones)...")
    text_with_entities = """
    URGENT NOTICE: Call +91 98765 43210 or 1-800-555-0199.
    Wire 2500 INR to merchant.desk@oksbi or support@paytm.
    Send 0.05 BTC to 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa or bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq.
    Pay ETH to 0x71C7656EC7ab88b098defB751B7401B5f6d8976F or visit https://paypal-security-update.com/login.
    Contact billing@support-portal.xyz
    """
    indicators = extract_indicators(text_with_entities)
    assert len(indicators.urls) >= 1
    assert "https://paypal-security-update.com/login" in indicators.urls
    assert len(indicators.emails) >= 1
    assert "billing@support-portal.xyz" in indicators.emails
    assert len(indicators.phone_numbers) >= 2
    assert len(indicators.crypto_addresses) >= 2
    assert any("oksbi" in u for u in indicators.payment_handles)
    print(f"   URLs extracted: {indicators.urls}")
    print(f"   Phones extracted: {indicators.phone_numbers}")
    print(f"   Crypto extracted: {indicators.crypto_addresses}")
    print(f"   Payment handles extracted: {indicators.payment_handles}")
    print("   ✅ Entity extraction verified.\n")

    # 3. Email Spoofing & Header Inspection Test
    print("3️⃣ Testing Raw Email Parser & Header Spoofing Detection...")
    spoofed_email = """From: "PayPal Security Team" <alert@payment-notice-fake38.xyz>
To: victim@company.com
Reply-To: phisher-drop@darknetmail.ru
Subject: Immediate Action Required: Unauthorized login attempt detected
Date: Sat, 7 Nov 2026 12:00:00 +0000

Dear Customer,
We detected a suspicious login from Russia. Please verify your credentials immediately to avoid account lock:
https://paypal.account-verify.com.evil.xyz/login
"""
    email_ctx, email_body = parse_email_raw(spoofed_email)
    assert email_ctx.detected_format == "email_raw"
    assert len(email_ctx.spoofing_indicators) >= 2, "Expected brand impersonation and reply-to mismatch"
    print(f"   Spoofing indicators: {email_ctx.spoofing_indicators}")
    print("   ✅ Email header spoofing detected and flagged.\n")

    # 4. WhatsApp Conversation Export Pipeline Test
    print("4️⃣ Testing WhatsApp Chat Export Analysis (Hospital / Urgent UPI Scam)...")
    wa_conversation = """[12/05/26, 14:20:10] ~ Rahul: Bro, are you free right now?
[12/05/26, 14:20:45] Me: Yeah bro, what's up?
[12/05/26, 14:21:30] ~ Rahul: Urgent emergency! My mom is in hospital and my UPI daily limit reached.
[12/05/26, 14:22:00] ~ Rahul: Please transfer 10000 rupees to the doctor directly on doc.sharma@okhdfcbank
[12/05/26, 14:22:30] ~ Rahul: I will repay you tomorrow morning first thing, please hurry!
"""
    wa_res = await scam_detector_service.analyze_message(wa_conversation)
    assert wa_res.parsed_context.detected_format == "whatsapp_chat"
    assert any("okhdfcbank" in h for h in wa_res.extracted_indicators.payment_handles)
    assert wa_res.risk_score >= 40
    print(f"   Scam Type: {wa_res.scam_type}")
    print(f"   Risk Level: {wa_res.risk_level.upper()} (Score: {wa_res.risk_score}/100)")
    print(f"   Tactics Detected: {wa_res.social_engineering_tactics}")
    print("   ✅ WhatsApp conversation analysis verified.\n")

    # 5. Phishing SMS with Typosquatted Link & Threat Feed Correlation
    print("5️⃣ Testing SMS Phishing with Cross-Module Threat Correlation (paypa1)...")
    sms_phishing = "URGENT: Your PayPal account has been limited due to suspicious activity. Log in at http://paypa1-security.com/login to restore access."
    sms_res = await scam_detector_service.analyze_message(sms_phishing)
    assert len(sms_res.extracted_indicators.urls) >= 1
    assert sms_res.risk_level in ["high", "confirmed_fraud"]
    assert sms_res.risk_score >= 65
    print(f"   Scam Type: {sms_res.scam_type}")
    print(f"   Risk Score: {sms_res.risk_score}/100 | Risk Level: {sms_res.risk_level.upper()}")
    print(f"   Correlated Threats: {len(sms_res.correlated_threats)} threat feed hits")
    print(f"   AI Explanation: {sms_res.ai_explanation[:160]}...")
    print("   ✅ Cross-module threat correlation and phishing detection verified.\n")

    # 6. Golden Rule Test: Legitimate Message with Urgent Language
    print("6️⃣ Testing Golden Rule: Legitimate Urgent Notification (Should NOT be confirmed fraud)...")
    benign_urgent = "Hi Team, please submit your timesheets immediately before 5 PM today for payroll processing. Let me know if any blockers."
    benign_res = await scam_detector_service.analyze_message(benign_urgent)
    assert benign_res.risk_level in ["low", "suspicious"]
    assert benign_res.risk_score < 50
    print(f"   Risk Score: {benign_res.risk_score}/100 | Risk Level: {benign_res.risk_level.upper()}")
    print("   ✅ Golden rule verified: benign message with urgency was NOT falsely labeled fraud.\n")

    print("🎉 All 6 AI Scam & Message Detector Verification Tests Passed!")


if __name__ == "__main__":
    asyncio.run(run_tests())
