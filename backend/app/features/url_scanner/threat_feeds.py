import httpx
import dns.resolver
import whois
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
import base64
from app.core.config import settings


def is_valid_key(key: Optional[str]) -> bool:
    """Checks whether an API key is actually set and not an empty or template string."""
    if not key:
        return False
    k = key.strip().lower()
    if not k or k.startswith("your_") or "here" in k:
        return False
    return True


async def query_virustotal(url: str) -> Optional[Dict[str, Any]]:
    """
    Queries VirusTotal v3 API for URL analysis.
    Gracefully returns None if API key is not configured or on rate limits.
    """
    if not is_valid_key(settings.VIRUSTOTAL_API_KEY):
        return None

    try:
        # VirusTotal v3 URL ID is base64 encoded URL without padding
        url_id = base64.urlsafe_b64encode(url.encode()).decode().strip("=")
        endpoint = f"https://www.virustotal.com/api/v3/urls/{url_id}"

        headers = {
            "x-apikey": settings.VIRUSTOTAL_API_KEY,
            "Accept": "application/json"
        }

        async with httpx.AsyncClient(timeout=6.0) as client:
            resp = await client.get(endpoint, headers=headers)
            if resp.status_code == 200:
                data = resp.json().get("data", {}).get("attributes", {})
                stats = data.get("last_analysis_stats", {})
                return {
                    "malicious_count": stats.get("malicious", 0),
                    "suspicious_count": stats.get("suspicious", 0),
                    "harmless_count": stats.get("harmless", 0),
                    "undetected_count": stats.get("undetected", 0),
                    "reputation": data.get("reputation", 0),
                    "categories": data.get("categories", {})
                }
            elif resp.status_code == 404:
                return {"status": "unscanned_by_virustotal"}
            else:
                return {"error": f"VirusTotal returned status {resp.status_code}"}
    except Exception as e:
        return {"error": f"VirusTotal query failed: {str(e)}"}


def fetch_whois_info(domain: str) -> Dict[str, Any]:
    """
    Fetches WHOIS registration details and computes domain age.
    """
    try:
        w = whois.whois(domain)
        creation_date = w.creation_date
        if isinstance(creation_date, list):
            creation_date = creation_date[0]

        age_days = None
        creation_str = None
        if isinstance(creation_date, datetime):
            if creation_date.tzinfo is None:
                creation_date = creation_date.replace(tzinfo=timezone.utc)
            now = datetime.now(timezone.utc)
            age_days = max(0, (now - creation_date).days)
            creation_str = creation_date.strftime("%Y-%m-%d")

        registrar = w.registrar
        if isinstance(registrar, list):
            registrar = ", ".join(registrar)

        return {
            "registrar": registrar,
            "creation_date": creation_str,
            "age_days": age_days,
            "raw_available": True
        }
    except Exception:
        return {
            "registrar": None,
            "creation_date": None,
            "age_days": None,
            "raw_available": False
        }


def fetch_dns_records(domain: str) -> Dict[str, List[str]]:
    """
    Resolves A, MX, NS, and TXT DNS records for a given domain.
    """
    records = {"A": [], "MX": [], "NS": [], "TXT": []}
    resolver = dns.resolver.Resolver()
    resolver.lifetime = 4.0

    for rtype in ("A", "MX", "NS", "TXT"):
        try:
            answers = resolver.resolve(domain, rtype)
            for rdata in answers:
                records[rtype].append(str(rdata))
        except Exception:
            pass

    return records
