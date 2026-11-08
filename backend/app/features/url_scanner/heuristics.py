import math
import re
from typing import Tuple, Optional, List
from urllib.parse import urlparse, parse_qs, unquote
import tldextract

# High-profile targets often impersonated in phishing campaigns
TARGET_DOMAINS = [
    "google.com", "microsoft.com", "apple.com", "amazon.com", "paypal.com",
    "netflix.com", "facebook.com", "instagram.com", "whatsapp.com", "twitter.com",
    "linkedin.com", "chase.com", "wellsfargo.com", "bankofamerica.com",
    "sbi.co.in", "hdfcbank.com", "icicibank.com", "axisbank.com", "paytm.com",
    "binance.com", "coinbase.com", "metamask.io", "github.com", "dropbox.com",
    "steamcommunity.com", "discord.com", "telegram.org"
]

SUSPICIOUS_KEYWORDS = [
    "login", "verify", "verification", "account", "update", "security", "secure",
    "banking", "signin", "support", "wallet", "recovery", "password", "confirm",
    "kyc", "auth", "portal", "billing", "invoice", "claim", "reward", "airdrop"
]

# TLDs frequently abused in low-cost, disposable phishing campaigns
HIGH_RISK_TLDS = {
    "xyz", "top", "icu", "buzz", "cam", "rest", "surf", "fit", "tk", "ml", "ga", "cf", "gq"
}

# Parameter keys commonly used in Open Redirect and Phishing forwarding attacks
REDIRECT_PARAM_KEYS = {
    "url", "redirect", "redirect_url", "redirect_to", "next", "dest", "destination",
    "target", "link", "return", "return_to", "r", "u", "to", "goto", "forward", "out"
}


def calculate_entropy(text: str) -> float:
    """Calculates Shannon entropy of a given string."""
    if not text:
        return 0.0
    probabilities = [text.count(c) / len(text) for c in set(text)]
    return -sum(p * math.log2(p) for p in probabilities)


def levenshtein_distance(s1: str, s2: str) -> int:
    """Calculates minimum edit distance between two strings."""
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row

    return previous_row[-1]


def detect_typosquatting(registered_domain: str) -> Tuple[bool, Optional[str]]:
    """
    Checks if a domain is a lookalike/typosquat of high-profile target brands.
    """
    if not registered_domain:
        return False, None

    reg_lower = registered_domain.lower()

    if reg_lower in TARGET_DOMAINS:
        return False, None

    domain_part = reg_lower.split(".")[0]

    for target in TARGET_DOMAINS:
        target_part = target.split(".")[0]
        if len(target_part) <= 3:
            continue

        # Substring impersonation check (e.g. paypal-security.com)
        if target_part in domain_part and target_part != domain_part:
            return True, target

        # Distance check
        dist = levenshtein_distance(domain_part, target_part)
        if dist in (1, 2) and len(domain_part) >= 4:
            return True, target

    return False, None


def detect_homoglyphs(domain: str) -> Tuple[bool, str]:
    """
    Detects Punycode (IDN) or mixed-script homoglyphs used in spoofing attacks.
    """
    if "xn--" in domain.lower():
        try:
            decoded = domain.encode("ascii").decode("idna")
            return True, f"Internationalized domain (Punycode): {decoded}"
        except Exception:
            return True, "Suspicious punycode encoding in domain"
    return False, ""


def inspect_embedded_redirect_params(url: str, registered_domain: str) -> List[dict]:
    """
    Detects embedded open redirect parameters pointing to external, unrelated domains.
    Example: https://service.com/login?redirect_to=https://evil-hacker.com
    """
    indicators = []
    try:
        parsed = urlparse(url)
        query_params = parse_qs(parsed.query)

        for param_name, param_values in query_params.items():
            param_lower = param_name.lower()
            if param_lower in REDIRECT_PARAM_KEYS or "redirect" in param_lower or "url" in param_lower:
                for val in param_values:
                    decoded_val = unquote(val).strip()
                    # Check if value looks like a URL or external domain
                    if decoded_val.startswith(("http://", "https://", "//")) or re.match(r"^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}", decoded_val):
                        # Extract domain of the redirect target
                        target_extracted = tldextract.extract(decoded_val)
                        target_reg = target_extracted.registered_domain

                        if target_reg and registered_domain and target_reg.lower() != registered_domain.lower():
                            indicators.append({
                                "indicator": f"Suspicious Open Redirect parameter '{param_name}' points to external domain '{target_reg}'",
                                "severity": "high",
                                "evidence": f"Parameter: {param_name}={decoded_val} | Destination: {target_reg}"
                            })
    except Exception:
        pass

    return indicators


def inspect_url_structure(url: str, hostname: str, subdomain: str, registered_domain: str, suffix: str) -> List[dict]:
    """
    Inspects structural URL indicators like keywords in subdomain, IP hostnames, credentials,
    embedded redirect parameters, and brand spoofing in subdomains.
    """
    indicators = []

    # 1. Check for IP address in place of hostname
    if re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", hostname):
        indicators.append({
            "indicator": "IP address used as hostname instead of legitimate domain",
            "severity": "high",
            "evidence": hostname
        })

    # 2. Check for Target Brands disguised in Subdomain (CRITICAL)
    if subdomain and registered_domain:
        sub_lower = subdomain.lower()
        for target in TARGET_DOMAINS:
            brand = target.split(".")[0]
            if len(brand) >= 4:
                sub_tokens = re.split(r"[.\-_]", sub_lower)
                if brand in sub_tokens and brand not in registered_domain.lower():
                    indicators.append({
                        "indicator": f"Critical Brand Impersonation: '{brand}' disguised inside subdomain of unrelated domain '{registered_domain}'",
                        "severity": "critical",
                        "evidence": f"Subdomain: {subdomain} | Actual Host: {registered_domain}"
                    })
                    break

    # 3. Check for Suspicious Security/Financial Keywords inside Subdomains
    if subdomain:
        sub_tokens = re.split(r"[.\-_]", subdomain.lower())
        matched_kws = [kw for kw in SUSPICIOUS_KEYWORDS if kw in sub_tokens]
        if matched_kws:
            indicators.append({
                "indicator": f"Deceptive security keyword(s) {matched_kws} found in subdomain",
                "severity": "high",
                "evidence": f"Keywords: {', '.join(matched_kws)} in subdomain '{subdomain}'"
            })

    # 4. Check for Embedded Open Redirect Parameters (?url=, ?redirect=)
    redirect_param_findings = inspect_embedded_redirect_params(url, registered_domain)
    indicators.extend(redirect_param_findings)

    # 5. Check for credentials in URL format (e.g. http://google.com@evil.com)
    if "@" in url.split("/")[2] if len(url.split("/")) > 2 else False:
        indicators.append({
            "indicator": "URL contains '@' user-info deception pattern",
            "severity": "critical",
            "evidence": "Credentials or redirected destination embedded in hostname"
        })

    # 6. Subdomain nesting depth
    sub_count = len(subdomain.split(".")) if subdomain else 0
    if sub_count >= 3:
        indicators.append({
            "indicator": f"Excessive subdomain nesting ({sub_count} levels)",
            "severity": "medium",
            "evidence": subdomain
        })

    # 7. High-Risk TLD with Deceptive Subdomains
    if suffix and suffix.lower() in HIGH_RISK_TLDS and indicators:
        indicators.append({
            "indicator": f"Disreputable or heavily abused TLD (.{suffix}) hosting suspicious content",
            "severity": "medium",
            "evidence": f"Suffix .{suffix}"
        })

    # 8. Entropy check
    entropy = calculate_entropy(hostname)
    if entropy > 4.2 and len(hostname) > 15:
        indicators.append({
            "indicator": "Unusually high hostname entropy (potential DGA or auto-generated domain)",
            "severity": "medium",
            "evidence": f"Shannon Entropy: {entropy:.2f}"
        })

    return indicators
