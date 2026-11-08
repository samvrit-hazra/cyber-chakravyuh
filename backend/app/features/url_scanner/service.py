import uuid
import asyncio
from datetime import datetime, timezone
from urllib.parse import urlparse
import tldextract
import httpx

from app.features.url_scanner.models import (
    URLAnalyzeResponse,
    FindingItem,
    DomainDetails,
    ThreatIntelSummary
)
from app.core.security import is_safe_url
from app.core.groq_client import query_groq
from app.core.shodan_client import query_shodan_host
from app.core.database import get_database
from app.features.url_scanner.heuristics import (
    detect_typosquatting,
    detect_homoglyphs,
    inspect_url_structure
)
from app.features.url_scanner.threat_feeds import (
    query_virustotal,
    fetch_whois_info,
    fetch_dns_records
)


class URLScannerService:

    def normalize_url(self, raw_url: str) -> str:
        raw_url = raw_url.strip()
        if not raw_url.startswith(("http://", "https://")):
            raw_url = "https://" + raw_url
        return raw_url

    async def trace_redirects(self, initial_url: str) -> tuple[list[str], list[FindingItem]]:
        """
        Traces HTTP redirect hops safely and evaluates cross-domain & multi-hop redirect anomalies.
        """
        chain = [initial_url]
        redirect_findings: list[FindingItem] = []

        try:
            async with httpx.AsyncClient(timeout=4.0, follow_redirects=True, max_redirects=6) as client:
                resp = await client.head(initial_url)
                for r in resp.history:
                    chain.append(str(r.url))
                if str(resp.url) != chain[-1]:
                    chain.append(str(resp.url))
        except Exception:
            pass

        # Evaluate redirect chain anomalies
        if len(chain) > 1:
            initial_extracted = tldextract.extract(chain[0])
            final_extracted = tldextract.extract(chain[-1])

            initial_domain = initial_extracted.registered_domain
            final_domain = final_extracted.registered_domain

            # Cross-domain unexpected redirection
            if initial_domain and final_domain and initial_domain.lower() != final_domain.lower():
                redirect_findings.append(FindingItem(
                    category="redirect_chain",
                    indicator=f"Unexpected Cross-Domain Redirection: Starts at '{initial_domain}' but silently lands on '{final_domain}'",
                    severity="high",
                    evidence=f"Redirect path: {' -> '.join(chain[:3])}{'...' if len(chain) > 3 else ''}",
                    source="redirect_analyzer"
                ))

            # Excessive hops obfuscation
            hops = len(chain) - 1
            if hops >= 3:
                redirect_findings.append(FindingItem(
                    category="redirect_chain",
                    indicator=f"Obfuscated multi-hop redirect chain ({hops} hops)",
                    severity="medium",
                    evidence=f"Total hops: {hops}",
                    source="redirect_analyzer"
                ))

        return chain, redirect_findings

    def compute_risk(self, findings: list[FindingItem], vt_data: dict, shodan_data: dict, age_days: int | None) -> tuple[int, str]:
        score = 0
        confirmed_malicious = False

        # VirusTotal threat intel match
        if vt_data and vt_data.get("malicious_count", 0) > 0:
            mal_count = vt_data["malicious_count"]
            if mal_count >= 3:
                score += 80
                confirmed_malicious = True
            else:
                score += min(mal_count * 25, 60)

        # Shodan Vulnerabilities & Exposed Services
        if shodan_data and isinstance(shodan_data, dict):
            vulns = shodan_data.get("vulnerabilities", [])
            if vulns:
                score += min(len(vulns) * 15, 45)

            sensitive_ports = shodan_data.get("exposed_sensitive_ports", [])
            if sensitive_ports:
                score += min(len(sensitive_ports) * 10, 30)

        # Findings weight
        for f in findings:
            if f.severity == "critical":
                score += 40
            elif f.severity == "high":
                score += 25
            elif f.severity == "medium":
                score += 15
            elif f.severity == "low":
                score += 5

        # Domain age risk
        if age_days is not None:
            if age_days <= 7:
                score += 30
            elif age_days <= 30:
                score += 15

        final_score = min(score, 100)

        if confirmed_malicious or final_score >= 80:
            risk_level = "confirmed_malicious" if confirmed_malicious else "high"
        elif final_score >= 45:
            risk_level = "suspicious"
        elif final_score >= 10:
            risk_level = "low"
        else:
            risk_level = "low"

        return final_score, risk_level

    async def generate_ai_explanation(self, url: str, findings: list[FindingItem], risk_level: str, risk_score: int) -> tuple[str, list[str]]:
        findings_summary = "\n".join([f"- [{f.severity.upper()}] {f.indicator}: {f.evidence}" for f in findings]) or "No major threat indicators found."
        
        prompt = f"""
You are an expert cybersecurity threat analyst. Analyze the following URL investigation findings:

Target URL: {url}
Evaluated Risk Score: {risk_score}/100 ({risk_level.upper()})

Findings:
{findings_summary}

Please provide:
1. A concise, evidence-based threat explanation (2-3 sentences max) in plain English suitable for an end user.
2. A bulleted list of 2-3 specific, actionable precautions or next steps.

Format your output exactly as:
EXPLANATION: <your explanation>
PRECAUTIONS:
- <precaution 1>
- <precaution 2>
"""
        response_text = await query_groq(prompt)

        explanation = f"Evaluated as {risk_level} risk with a score of {risk_score}/100."
        precautions = ["Exercise caution before entering credentials.", "Verify the domain identity in your browser's address bar."]

        if "EXPLANATION:" in response_text:
            try:
                parts = response_text.split("PRECAUTIONS:")
                explanation_part = parts[0].replace("EXPLANATION:", "").strip()
                if explanation_part:
                    explanation = explanation_part

                if len(parts) > 1:
                    raw_precautions = [line.strip("- ").strip() for line in parts[1].strip().split("\n") if line.strip()]
                    if raw_precautions:
                        precautions = raw_precautions
            except Exception:
                pass

        return explanation, precautions

    async def analyze_url(self, raw_input_url: str) -> URLAnalyzeResponse:
        report_id = str(uuid.uuid4())
        normalized_url = self.normalize_url(raw_input_url)
        findings: list[FindingItem] = []

        # 1. SSRF Safety Check
        if not is_safe_url(normalized_url):
            findings.append(FindingItem(
                category="network_safety",
                indicator="Restricted or Private Network Destination (SSRF Warning)",
                severity="critical",
                evidence="Destination resolves to private, loopback, or invalid IP address space.",
                source="ssrf_guard"
            ))
            return URLAnalyzeResponse(
                report_id=report_id,
                url=raw_input_url,
                normalized_url=normalized_url,
                risk_level="high",
                risk_score=95,
                findings=findings,
                ai_explanation="The target URL resolves to an internal or restricted network address, posing a security hazard.",
                recommended_actions=["Do not navigate to private network destinations.", "Ensure URLs point to public web addresses."],
                redirect_chain=[normalized_url],
                domain_info=DomainDetails(domain=urlparse(normalized_url).hostname or raw_input_url),
                threat_intel=ThreatIntelSummary(),
                created_at=datetime.now(timezone.utc)
            )

        # 2. Domain Decomposition (tldextract)
        extracted = tldextract.extract(normalized_url)
        subdomain = extracted.subdomain
        domain_name = extracted.domain
        suffix = extracted.suffix
        registered_domain = extracted.registered_domain
        hostname = urlparse(normalized_url).hostname or ""

        # 3. Structural & Embedded Redirect Parameter Heuristics
        structure_findings = inspect_url_structure(normalized_url, hostname, subdomain, registered_domain, suffix)
        for sf in structure_findings:
            findings.append(FindingItem(
                category="url_structure",
                indicator=sf["indicator"],
                severity=sf["severity"],
                evidence=sf["evidence"],
                source="heuristic_engine"
            ))

        # 4. Typosquatting Check
        is_typo, typo_target = detect_typosquatting(registered_domain)
        if is_typo and typo_target:
            findings.append(FindingItem(
                category="phishing",
                indicator=f"Potential typosquatting / brand impersonation of '{typo_target}'",
                severity="high",
                evidence=f"Domain '{registered_domain}' closely mimics legitimate brand '{typo_target}'",
                source="typosquat_engine"
            ))

        # 5. Homoglyph / Punycode Check
        is_homoglyph, homoglyph_evidence = detect_homoglyphs(hostname)
        if is_homoglyph:
            findings.append(FindingItem(
                category="homoglyph",
                indicator="Punycode / IDN internationalized domain detected",
                severity="medium",
                evidence=homoglyph_evidence,
                source="homoglyph_engine"
            ))

        # 6. Parallel Gathering: Redirects, VirusTotal, WHOIS, DNS
        redirect_task = self.trace_redirects(normalized_url)
        vt_task = query_virustotal(normalized_url)
        loop = asyncio.get_event_loop()
        whois_task = loop.run_in_executor(None, fetch_whois_info, registered_domain)
        dns_task = loop.run_in_executor(None, fetch_dns_records, registered_domain)

        redirect_res, vt_data, whois_data, dns_records = await asyncio.gather(
            redirect_task, vt_task, whois_task, dns_task
        )
        redirect_chain, redirect_findings = redirect_res
        findings.extend(redirect_findings)

        # 7. Shodan Host Intelligence (Resolve IP and query Shodan)
        ip_addresses = dns_records.get("A", [])
        primary_ip = ip_addresses[0] if ip_addresses else None
        shodan_data = None
        if primary_ip:
            shodan_data = await query_shodan_host(primary_ip)

            # Evaluate Shodan Findings
            if shodan_data and isinstance(shodan_data, dict):
                # Exposed sensitive ports
                sensitive_ports = shodan_data.get("exposed_sensitive_ports", [])
                for sp in sensitive_ports:
                    findings.append(FindingItem(
                        category="infrastructure_exposure",
                        indicator=f"Publicly exposed sensitive service: {sp['service']} (Port {sp['port']})",
                        severity="high",
                        evidence=f"Shodan indexed service on host IP {primary_ip}",
                        source="shodan"
                    ))

                # Known CVEs
                vulns = shodan_data.get("vulnerabilities", [])
                if vulns:
                    top_vulns = ", ".join(vulns[:3])
                    findings.append(FindingItem(
                        category="vulnerabilities",
                        indicator=f"Host has {len(vulns)} known unpatched CVE vulnerability(ies)",
                        severity="critical" if len(vulns) >= 3 else "high",
                        evidence=f"Detected CVEs: {top_vulns}",
                        source="shodan"
                    ))

                # Org / ISP context
                org = shodan_data.get("org")
                if org:
                    findings.append(FindingItem(
                        category="infrastructure_attribution",
                        indicator=f"Hosted on network infrastructure: {org}",
                        severity="low",
                        evidence=f"ASN: {shodan_data.get('asn', 'N/A')}, ISP: {shodan_data.get('isp', 'N/A')}",
                        source="shodan"
                    ))

        # 8. Evaluate VirusTotal Threat Feed
        if vt_data and vt_data.get("malicious_count", 0) > 0:
            findings.append(FindingItem(
                category="threat_intel",
                indicator=f"Flagged malicious by {vt_data['malicious_count']} security vendor(s) on VirusTotal",
                severity="critical" if vt_data['malicious_count'] >= 3 else "high",
                evidence=f"VT Reputation: {vt_data.get('reputation', 0)}, Detections: {vt_data['malicious_count']}",
                source="virustotal"
            ))

        # 9. Evaluate WHOIS & Domain Age
        age_days = whois_data.get("age_days")
        if age_days is not None:
            if age_days <= 7:
                findings.append(FindingItem(
                    category="domain_age",
                    indicator=f"Extremely newly registered domain ({age_days} day(s) old)",
                    severity="high",
                    evidence=f"Created on: {whois_data.get('creation_date')}",
                    source="whois"
                ))
            elif age_days <= 30:
                findings.append(FindingItem(
                    category="domain_age",
                    indicator=f"Recently registered domain ({age_days} days old)",
                    severity="medium",
                    evidence=f"Created on: {whois_data.get('creation_date')}",
                    source="whois"
                ))

        # 10. Compute Risk Score & Classification (including Shodan and Redirects)
        risk_score, risk_level = self.compute_risk(findings, vt_data, shodan_data, age_days)

        # 11. AI Explanation via Groq
        explanation, precautions = await self.generate_ai_explanation(normalized_url, findings, risk_level, risk_score)

        # Domain details assembly
        domain_info = DomainDetails(
            domain=domain_name,
            subdomain=subdomain,
            suffix=suffix,
            registered_domain=registered_domain,
            ip_addresses=ip_addresses,
            dns_records=dns_records,
            registrar=whois_data.get("registrar"),
            creation_date=whois_data.get("creation_date"),
            age_days=age_days,
            is_idn_homoglyph=is_homoglyph,
            typosquat_target=typo_target
        )

        threat_intel = ThreatIntelSummary(
            virustotal=vt_data,
            shodan=shodan_data
        )

        response = URLAnalyzeResponse(
            report_id=report_id,
            url=raw_input_url,
            normalized_url=normalized_url,
            risk_level=risk_level,
            risk_score=risk_score,
            findings=findings,
            ai_explanation=explanation,
            recommended_actions=precautions,
            redirect_chain=redirect_chain,
            domain_info=domain_info,
            threat_intel=threat_intel,
            created_at=datetime.now(timezone.utc)
        )

        # 12. Async Save to MongoDB (non-blocking)
        db = get_database()
        if db is not None:
            try:
                report_doc = response.model_dump()
                report_doc["_id"] = report_id
                await db.reports.insert_one(report_doc)

                # Store indicators in indicators collection for threat correlation
                if registered_domain:
                    await db.indicators.insert_one({
                        "report_id": report_id,
                        "type": "domain",
                        "value": registered_domain,
                        "created_at": datetime.now(timezone.utc)
                    })
                for ip in ip_addresses:
                    await db.indicators.insert_one({
                        "report_id": report_id,
                        "type": "ip",
                        "value": ip,
                        "created_at": datetime.now(timezone.utc)
                    })
            except Exception as db_err:
                print(f"MongoDB persistence notice: {db_err}")

        return response


url_scanner_service = URLScannerService()
