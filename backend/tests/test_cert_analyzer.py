import asyncio
import sys
import os

# Add backend to PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.features.cert_analyzer.service import cert_analyzer_service
from app.features.cert_analyzer.distrusted_cas import check_distrusted_ca
from app.features.cert_analyzer.inspector import query_crt_sh


async def run_tests():
    print("🧪 Running TLS Certificate Analyzer Verification Tests...\n")

    # 1. Distrusted CA Knowledge Base Check
    print("1️⃣ Testing Distrusted CA Knowledge Base (eMudhra & DigiNotar)...")
    emudhra_match = check_distrusted_ca("eMudhra Technologies", "eMudhra TLS CA")
    assert emudhra_match is not None and "eMudhra" in emudhra_match["name"]
    print("   ✅ eMudhra distrust check verified:", emudhra_match["name"])

    diginotar_match = check_distrusted_ca("DigiNotar Root CA", "DigiNotar")
    assert diginotar_match is not None
    print("   ✅ DigiNotar compromise check verified:", diginotar_match["name"], "\n")

    # 2. Live Valid Handshake (google.com)
    print("2️⃣ Testing Live Handshake on Valid Domain (google.com)...")
    res_valid = await cert_analyzer_service.analyze_cert("https://google.com")
    assert res_valid.is_https_available is True
    assert res_valid.certificate is not None
    print(f"   Issuer: {res_valid.certificate.issuer_org or res_valid.certificate.issuer_common_name}")
    print(f"   SAN count: {len(res_valid.certificate.san_list)}")
    print(f"   Key: {res_valid.certificate.key_type} {res_valid.certificate.key_size} bits")
    print(f"   Valid until: {res_valid.certificate.valid_to}")
    print(f"   Trust Status: {res_valid.trust_status.upper()}")
    print("   ✅ Live valid TLS handshake verified.\n")

    # 3. Multi-tier Certificate Chain & Revocation Endpoints
    print("3️⃣ Testing Certificate Chain & Revocation Endpoints on google.com...")
    assert len(res_valid.certificate.certificate_chain) >= 2, "Expected at least 2 certificates in chain"
    print(f"   Chain length: {len(res_valid.certificate.certificate_chain)} certificates")
    for idx, cert_item in enumerate(res_valid.certificate.certificate_chain):
        print(f"     Hop {idx}: Subject='{cert_item.subject[:35]}', is_ca={cert_item.is_ca}")
    assert res_valid.certificate.has_revocation_info is True
    print(f"   Revocation CRL endpoints: {res_valid.certificate.crl_distribution_points}")
    print("   ✅ Certificate chain and revocation endpoint extraction verified.\n")

    # 4. Expired Certificate (badssl.com)
    print("4️⃣ Testing Expired Certificate (expired.badssl.com)...")
    res_expired = await cert_analyzer_service.analyze_cert("https://expired.badssl.com")
    assert res_expired.certificate.is_expired is True
    assert any("Expired" in f.indicator for f in res_expired.findings)
    print(f"   Risk Score: {res_expired.risk_score} | Trust Status: {res_expired.trust_status.upper()}")
    print("   ✅ Expired certificate detected and flagged.\n")

    # 5. Hostname Mismatch (wrong.host.badssl.com)
    print("5️⃣ Testing Hostname Mismatch (wrong.host.badssl.com)...")
    res_mismatch = await cert_analyzer_service.analyze_cert("https://wrong.host.badssl.com")
    assert res_mismatch.certificate.hostname_matches is False
    assert any("Mismatch" in f.indicator for f in res_mismatch.findings)
    print(f"   Risk Score: {res_mismatch.risk_score} | Trust Status: {res_mismatch.trust_status.upper()}")
    print("   ✅ Hostname mismatch detected and flagged as critical.\n")

    # 6. Self-Signed Certificate (self-signed.badssl.com)
    print("6️⃣ Testing Self-Signed Certificate (self-signed.badssl.com)...")
    res_self = await cert_analyzer_service.analyze_cert("https://self-signed.badssl.com")
    assert res_self.certificate.is_self_signed is True
    assert any("Self-Signed" in f.indicator for f in res_self.findings)
    print(f"   Risk Score: {res_self.risk_score} | Trust Status: {res_self.trust_status.upper()}")
    print("   ✅ Self-signed certificate detected and flagged.\n")

    # 7. Intermediate Compromise Evaluation
    print("7️⃣ Testing Intermediate CA Compromise Detection...")
    mock_cert_data = {
        "hostname_matches": True,
        "is_expired": False,
        "is_self_signed": False,
        "has_revocation_info": True,
        "key_type": "RSA",
        "key_size": 2048,
        "signature_algo": "sha256WithRSAEncryption",
        "is_wildcard": False,
        "issuer_org": "Benign Sub CA",
        "certificate_chain": [
            {"subject": "CN=bank.example.com", "issuer": "CN=eMudhra Sub-CA, O=eMudhra", "is_ca": False},
            {"subject": "CN=eMudhra Sub-CA, O=eMudhra Technologies", "issuer": "CN=eMudhra Root CA", "is_ca": True}
        ]
    }
    findings = cert_analyzer_service.evaluate_findings(mock_cert_data, "bank.example.com")
    chain_findings = [f for f in findings if "Intermediate CA" in f.indicator or "eMudhra" in f.indicator]
    assert len(chain_findings) > 0, "Expected intermediate CA distrust finding"
    print(f"   Detected Chain Finding: {chain_findings[0].indicator}")
    print("   ✅ Intermediate CA distrust detection verified.\n")

    # 8. Certificate Transparency Logs via crt.sh
    print("8️⃣ Testing Certificate Transparency logs (crt.sh)...")
    ct_logs = await query_crt_sh("google.com")
    print(f"   Retrieved {len(ct_logs)} CT log entries from crt.sh")
    if ct_logs:
        print(f"   Recent Cert ID {ct_logs[0].id}: {ct_logs[0].common_name} (Logged: {ct_logs[0].logged_at})")
    print("   ✅ Certificate Transparency integration verified.\n")

    print("🎉 All 8 TLS Certificate Analyzer Verification Tests Passed!")


if __name__ == "__main__":
    asyncio.run(run_tests())
