import asyncio
from typing import List
from app.features.scam_detector.models import ExtractedIndicators, CorrelatedThreat
from app.features.url_scanner.service import url_scanner_service


SUSPICIOUS_EMAIL_KEYWORDS = [
    "tempmail", "guerrillamail", "10minutemail", "trashmail",
    "stealer", "phish", "fake", "spoof", "verify-account", "security-update"
]


async def correlate_indicators(indicators: ExtractedIndicators) -> List[CorrelatedThreat]:
    """
    Cross-references extracted indicators with live threat intelligence feeds:
    - Analyzes extracted URLs via the Module 1 URL Scanner (VirusTotal, Shodan, Typosquatting heuristics)
    - Checks email domains against disposable / high-risk threat indicators
    """
    correlated: List[CorrelatedThreat] = []

    # 1. URL Intelligence Correlation (Module 1 cross-invocation)
    # Check up to 2 extracted URLs asynchronously
    target_urls = indicators.urls[:2]
    if target_urls:
        tasks = [url_scanner_service.analyze_url(u) for u in target_urls]
        try:
            results = await asyncio.gather(*tasks, return_exceptions=True)
            for url, res in zip(target_urls, results):
                if isinstance(res, Exception):
                    correlated.append(CorrelatedThreat(
                        indicator_type="url",
                        value=url,
                        verdict="unscanned",
                        details={"error": str(res)}
                    ))
                    continue

                # Determine verdict based on Module 1 findings
                vt = res.threat_intel.virustotal if res.threat_intel else None
                vt_malicious = vt.malicious_count if vt and not vt.error else 0
                typosquat = res.domain_info.typosquat_target if res.domain_info else None

                verdict = "benign"
                if res.risk_level in ["confirmed_malicious", "high"] or vt_malicious > 0 or typosquat:
                    verdict = "malicious"
                elif res.risk_level == "suspicious":
                    verdict = "suspicious"

                correlated.append(CorrelatedThreat(
                    indicator_type="url",
                    value=url,
                    verdict=verdict,
                    details={
                        "risk_score": res.risk_score,
                        "risk_level": res.risk_level,
                        "virustotal_malicious_count": vt_malicious,
                        "typosquat_target": typosquat,
                        "ai_explanation": res.ai_explanation[:200] if res.ai_explanation else None
                    }
                ))
        except Exception as e:
            pass

    # 2. Email Indicator Correlation
    for em in indicators.emails[:3]:
        em_lower = em.lower()
        domain = em_lower.split("@")[-1] if "@" in em_lower else ""
        is_suspicious_domain = any(kw in domain for kw in SUSPICIOUS_EMAIL_KEYWORDS)

        if is_suspicious_domain:
            correlated.append(CorrelatedThreat(
                indicator_type="email",
                value=em,
                verdict="suspicious",
                details={"reason": f"Email domain '{domain}' matches disposable or high-risk pattern"}
            ))

    return correlated
