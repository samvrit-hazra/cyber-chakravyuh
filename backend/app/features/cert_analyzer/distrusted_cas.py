from typing import Optional, Dict

# Knowledge base of revoked, distrusted, or historically compromised Certificate Authorities
DISTRUSTED_CAS = {
    "emudhra": {
        "name": "eMudhra TLS CA",
        "severity": "critical",
        "reason": "Cryptographic key generation vulnerabilities identified, raising risks of unauthorized impersonation certs.",
        "reference": "eMudhra TLS Trust Incident"
    },
    "diginotar": {
        "name": "DigiNotar Root CA",
        "severity": "critical",
        "reason": "Complete Certificate Authority infrastructure compromise; rogue certificates were issued for high-profile domains.",
        "reference": "DigiNotar Trust Revocation"
    },
    "wosign": {
        "name": "WoSign CA",
        "severity": "high",
        "reason": "Distrusted by major browser vendors (Mozilla, Google) for backdating SHA-1 certificates and issuance anomalies.",
        "reference": "Mozilla WoSign & StartCom Distrust"
    },
    "startcom": {
        "name": "StartCom / StartSSL",
        "severity": "high",
        "reason": "Acquired by WoSign; distrusted by browser root stores due to failure to maintain CA baseline requirements.",
        "reference": "Browser Root Store Distrust"
    },
    "darkmatter": {
        "name": "DarkMatter",
        "severity": "high",
        "reason": "Rejected from browser root stores over surveillance and operational integrity concerns.",
        "reference": "Mozilla CA Program Decision"
    }
}


def check_distrusted_ca(issuer_org: Optional[str], issuer_cn: Optional[str]) -> Optional[Dict[str, str]]:
    """
    Checks if an issuing CA matches any known compromised or distrusted root/intermediate CA.
    """
    issuer_text = f"{issuer_org or ''} {issuer_cn or ''}".lower()

    for key, data in DISTRUSTED_CAS.items():
        if key in issuer_text:
            return data

    return None
