import httpx
from typing import Optional, Dict, Any, List
from app.core.config import settings

# Ports that represent databases, internal services, or administrative interfaces
SENSITIVE_PORTS = {
    21: "FTP (Plaintext)",
    22: "SSH Remote Access",
    23: "Telnet (Insecure)",
    3389: "RDP (Remote Desktop)",
    27017: "MongoDB Database",
    6379: "Redis In-Memory Store",
    3306: "MySQL Database",
    5432: "PostgreSQL Database",
    9200: "Elasticsearch Cluster",
    2375: "Docker Daemon (Unauthenticated)",
    2376: "Docker Daemon",
    8080: "Alternative HTTP / Proxy"
}


def is_valid_key(key: Optional[str]) -> bool:
    if not key:
        return False
    k = key.strip().lower()
    return not (not k or k.startswith("your_") or "here" in k)


async def query_shodan_host(ip: str) -> Optional[Dict[str, Any]]:
    """
    Queries Shodan Host API for an IP address:
    Returns open ports, ISP/organization, running banners, vulnerabilities (CVEs), and host tags.
    """
    if not is_valid_key(settings.SHODAN_API_KEY):
        return None

    if not ip or ip.startswith(("127.", "10.", "192.168.", "172.16.")):
        return None

    endpoint = f"https://api.shodan.io/shodan/host/{ip}?key={settings.SHODAN_API_KEY}"

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.get(endpoint)
            if resp.status_code == 200:
                data = resp.json()
                ports = data.get("ports", [])
                vulns = list(data.get("vulns", [])) if "vulns" in data else []
                os_detected = data.get("os")
                org = data.get("org")
                isp = data.get("isp")
                asn = data.get("asn")
                tags = data.get("tags", [])
                hostnames = data.get("hostnames", [])

                # Inspect sensitive ports
                exposed_sensitive = []
                for p in ports:
                    if p in SENSITIVE_PORTS:
                        exposed_sensitive.append({"port": p, "service": SENSITIVE_PORTS[p]})

                return {
                    "ip": ip,
                    "ports": ports,
                    "exposed_sensitive_ports": exposed_sensitive,
                    "vulnerabilities": vulns,
                    "vuln_count": len(vulns),
                    "os": os_detected,
                    "org": org,
                    "isp": isp,
                    "asn": asn,
                    "tags": tags,
                    "hostnames": hostnames
                }
            elif resp.status_code == 404:
                return {"ip": ip, "status": "unindexed_by_shodan", "ports": []}
            else:
                return {"error": f"Shodan API returned status {resp.status_code}"}
    except Exception as e:
        return {"error": f"Shodan query failed: {str(e)}"}
