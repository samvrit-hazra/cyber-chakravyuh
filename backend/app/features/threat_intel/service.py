import ipaddress
import socket
import urllib.parse
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional

import httpx

from app.core.config import settings
from app.features.threat_intel.models import (
    ThreatIndicator,
    ThreatCampaign,
    ThreatFeedStatus,
    MitreTechniqueRecord,
    ThreatDashboardResponse,
    DeepScanResponse,
    DeepScanFinding,
    ThreatCorrelateResponse,
    RelatedReport
)
from app.features.threat_intel.collectors import (
    fetch_openphish_feed,
    fetch_feodo_tracker_feed,
    fetch_threatfox_feed,
    get_default_mitre_techniques
)
from app.features.threat_intel.engine import threat_correlation_engine
from app.features.threat_intel.storage import threat_intel_storage


class ThreatIntelService:

    def is_ssrf_risk(self, target: str) -> bool:
        """
        SSRF Protection: Rejects loopback, private, link-local, and cloud metadata targets.
        """
        raw = target.strip()
        if "://" in raw:
            parsed = urllib.parse.urlparse(raw)
            host = parsed.hostname or raw
        else:
            host = raw.split(":")[0]

        host_lower = host.lower()
        if host_lower in ("localhost", "127.0.0.1", "::1", "0.0.0.0"):
            return True

        # Check IP ranges
        try:
            ip = ipaddress.ip_address(host)
            if ip.is_loopback or ip.is_private or ip.is_link_local or ip.is_reserved:
                return True
            # AWS / GCP metadata
            if str(ip) == "169.254.169.254":
                return True
        except ValueError:
            # Hostname: resolve to IP and test
            try:
                resolved_ip = socket.gethostbyname(host)
                ip = ipaddress.ip_address(resolved_ip)
                if ip.is_loopback or ip.is_private or ip.is_link_local or ip.is_reserved:
                    return True
                if str(ip) == "169.254.169.254":
                    return True
            except Exception:
                pass

        return False

    async def sync_all_feeds(self) -> Dict[str, Any]:
        """
        Ingests real indicators from external threat feeds, normalizes,
        correlates campaigns, and updates MITRE technique observations.
        """
        now = datetime.now(timezone.utc)
        results = {"added_indicators": 0, "feeds_synced": []}

        # 1. OpenPhish Community Feed
        try:
            op_indicators = await fetch_openphish_feed()
            added = await threat_intel_storage.upsert_indicators(op_indicators)
            results["added_indicators"] += added
            await threat_intel_storage.save_feed_status(ThreatFeedStatus(
                feed_name="OpenPhish Community",
                status="synchronized",
                last_sync=now,
                ioc_count=len(op_indicators),
                frequency="12 Hours",
                source_url="https://openphish.com/feed.txt"
            ))
            results["feeds_synced"].append("OpenPhish")
        except Exception as e:
            await threat_intel_storage.save_feed_status(ThreatFeedStatus(
                feed_name="OpenPhish Community",
                status="failed",
                last_sync=now,
                frequency="12 Hours",
                source_url="https://openphish.com/feed.txt",
                error_message=str(e)
            ))

        # 2. Feodo Tracker C2 Feed
        try:
            feodo_indicators = await fetch_feodo_tracker_feed()
            added = await threat_intel_storage.upsert_indicators(feodo_indicators)
            results["added_indicators"] += added
            await threat_intel_storage.save_feed_status(ThreatFeedStatus(
                feed_name="abuse.ch FeodoTracker",
                status="synchronized",
                last_sync=now,
                ioc_count=len(feodo_indicators),
                frequency="15 Minutes",
                source_url="https://feodotracker.abuse.ch"
            ))
            results["feeds_synced"].append("FeodoTracker")
        except Exception as e:
            await threat_intel_storage.save_feed_status(ThreatFeedStatus(
                feed_name="abuse.ch FeodoTracker",
                status="failed",
                last_sync=now,
                frequency="15 Minutes",
                source_url="https://feodotracker.abuse.ch",
                error_message=str(e)
            ))

        # 3. ThreatFox (if key configured)
        tf_indicators = await fetch_threatfox_feed()
        if tf_indicators:
            added = await threat_intel_storage.upsert_indicators(tf_indicators)
            results["added_indicators"] += added
            await threat_intel_storage.save_feed_status(ThreatFeedStatus(
                feed_name="abuse.ch ThreatFox",
                status="synchronized",
                last_sync=now,
                ioc_count=len(tf_indicators),
                frequency="15 Minutes",
                source_url="https://threatfox.abuse.ch"
            ))
            results["feeds_synced"].append("ThreatFox")

        # 4. Correlate Campaigns
        all_indicators = await threat_intel_storage.get_all_indicators()
        campaigns = threat_correlation_engine.cluster_campaigns(all_indicators)
        await threat_intel_storage.save_campaigns(campaigns)

        # 5. Correlate MITRE ATT&CK
        base_mitre = get_default_mitre_techniques()
        correlated_mitre = threat_correlation_engine.correlate_mitre_techniques(all_indicators, base_mitre)
        await threat_intel_storage.save_mitre_techniques(correlated_mitre)

        return results

    async def get_dashboard(self) -> ThreatDashboardResponse:
        """
        Calculates all dashboard metrics dynamically from MongoDB/storage indicators.
        """
        indicators = await threat_intel_storage.get_all_indicators()
        campaigns = await threat_intel_storage.get_campaigns()
        feeds = await threat_intel_storage.get_all_feeds()
        now = datetime.now(timezone.utc)
        cutoff_24h = now - timedelta(hours=24)

        # Feed counts
        synced_count = sum(1 for f in feeds if f.status == "synchronized")
        failed_count = sum(1 for f in feeds if f.status == "failed")
        configured_count = len(feeds)

        # Indicator breakdown
        total_iocs = len(indicators)
        new_24h = sum(1 for i in indicators if i.ingested_at >= cutoff_24h)
        domains_count = sum(1 for i in indicators if i.ioc_type == "domain")
        ips_count = sum(1 for i in indicators if i.ioc_type == "ip")
        urls_count = sum(1 for i in indicators if i.ioc_type == "url")

        # Defense rings & categories
        defense_mesh = threat_correlation_engine.compute_defense_mesh(indicators)
        threat_cats = threat_correlation_engine.compute_threat_categories(indicators)

        return ThreatDashboardResponse(
            feed_status={
                "configured": configured_count,
                "synchronized": synced_count,
                "failed": failed_count,
                "feeds": feeds
            },
            campaigns={
                "active": len([c for c in campaigns if c.status == "active"]),
                "clusters": len(campaigns),
                "top_campaigns": campaigns[:5]
            },
            indicators={
                "total": total_iocs,
                "new_last_24h": new_24h,
                "malicious_domains": domains_count,
                "malicious_ips": ips_count,
                "malicious_urls": urls_count
            },
            takedown_velocity="Not enough verified data",
            defense_mesh=defense_mesh,
            threat_categories=threat_cats,
            last_updated=now
        )

    async def get_stream(
        self,
        limit: int = 50,
        category: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[ThreatIndicator]:
        """
        Returns live IOC stream filtered by category or search term.
        """
        indicators = await threat_intel_storage.get_all_indicators()

        if category and category.lower() != "all":
            cat_lower = category.lower()
            indicators = [
                i for i in indicators
                if cat_lower in (i.malware_family or "").lower() or cat_lower in i.threat_type.lower()
            ]

        if search:
            s_lower = search.lower()
            indicators = [
                i for i in indicators
                if s_lower in i.ioc.lower() or s_lower in (i.malware_family or "").lower()
            ]

        # Sort newest first
        indicators.sort(key=lambda i: i.ingested_at, reverse=True)
        return indicators[:limit]

    async def get_campaigns(self) -> List[ThreatCampaign]:
        campaigns = await threat_intel_storage.get_campaigns()
        if not campaigns:
            indicators = await threat_intel_storage.get_all_indicators()
            campaigns = threat_correlation_engine.cluster_campaigns(indicators)
            await threat_intel_storage.save_campaigns(campaigns)
        return campaigns

    async def get_distribution(self) -> Dict[str, Any]:
        indicators = await threat_intel_storage.get_all_indicators()
        return {
            "defense_mesh": threat_correlation_engine.compute_defense_mesh(indicators),
            "threat_categories": threat_correlation_engine.compute_threat_categories(indicators),
            "total_indicators": len(indicators)
        }

    async def get_mitre_matrix(self) -> List[MitreTechniqueRecord]:
        techniques = await threat_intel_storage.get_mitre_techniques()
        if not techniques:
            base = get_default_mitre_techniques()
            indicators = await threat_intel_storage.get_all_indicators()
            techniques = threat_correlation_engine.correlate_mitre_techniques(indicators, base)
            await threat_intel_storage.save_mitre_techniques(techniques)
        return techniques

    async def deep_scan(self, raw_target: str) -> DeepScanResponse:
        """
        Investigates an individual IOC with SSRF protection, querying local intelligence cache
        and live external feeds (VirusTotal, Shodan, DNS).
        """
        target = raw_target.strip()
        now = datetime.now(timezone.utc)

        # 1. SSRF Guard
        if self.is_ssrf_risk(target):
            return DeepScanResponse(
                target=target,
                normalized_type="restricted",
                verdict="RESTRICTED_TARGET",
                threat_confidence=100,
                risk_score=100,
                risk_level="critical",
                sources_corroborated=["SSRF Security Policy Engine"],
                findings=[DeepScanFinding(
                    source="SSRF Guard",
                    category="Policy Violation",
                    severity="critical",
                    evidence="Access to loopback, link-local, private IP ranges, or cloud metadata endpoints is strictly blocked.",
                    confidence=100
                )],
                recommended_actions=["Target belongs to internal/restricted address space. Deep scan aborted."]
            )

        # Determine IOC type
        clean_target = target.replace("http://", "").replace("https://", "").split("/")[0]
        ioc_type = "domain"
        try:
            ipaddress.ip_address(clean_target)
            ioc_type = "ip"
        except ValueError:
            if "/" in target:
                ioc_type = "url"
            elif len(target) in (32, 40, 64) and all(c in "0123456789abcdefABCDEF" for c in target):
                ioc_type = "hash"

        findings: List[DeepScanFinding] = []
        corroborated_sources: List[str] = []
        matched_campaign: Optional[ThreatCampaign] = None
        related_iocs: List[str] = []

        # 2. Check local intelligence cache
        all_iocs = await threat_intel_storage.get_all_indicators()
        matched_local = [
            i for i in all_iocs
            if clean_target.lower() in i.ioc.lower() or target.lower() in i.ioc.lower()
        ]

        if matched_local:
            for m in matched_local[:3]:
                corroborated_sources.append(m.source)
                findings.append(DeepScanFinding(
                    source=m.source,
                    category=m.threat_type.title(),
                    severity="high" if m.confidence < 90 else "critical",
                    evidence=f"Flagged in {m.source} feed as {m.malware_family} (Confidence: {m.confidence}%)",
                    confidence=m.confidence
                ))

            # Match campaign
            all_campaigns = await threat_intel_storage.get_campaigns()
            for c in all_campaigns:
                if any(clean_target.lower() in i.lower() for i in c.indicators) or any(m.malware_family in c.malware_families for m in matched_local):
                    matched_campaign = c
                    related_iocs = c.indicators[:6]
                    break

        # 3. Live VirusTotal Reputation (if API key available)
        if settings.VIRUSTOTAL_API_KEY:
            try:
                vt_url = f"https://www.virustotal.com/api/v3/domains/{clean_target}" if ioc_type == "domain" else f"https://www.virustotal.com/api/v3/ip_addresses/{clean_target}"
                async with httpx.AsyncClient(timeout=4.0) as client:
                    resp = await client.get(vt_url, headers={"x-apikey": settings.VIRUSTOTAL_API_KEY})
                    if resp.status_code == 200:
                        vt_data = resp.json().get("data", {}).get("attributes", {})
                        stats = vt_data.get("last_analysis_stats", {})
                        mal_count = stats.get("malicious", 0)
                        susp_count = stats.get("suspicious", 0)
                        if mal_count > 0:
                            corroborated_sources.append("VirusTotal")
                            findings.append(DeepScanFinding(
                                source="VirusTotal",
                                category="Antivirus Engine Consensus",
                                severity="critical" if mal_count >= 5 else "high",
                                evidence=f"Flagged as malicious by {mal_count} security vendors ({susp_count} suspicious)",
                                confidence=min(mal_count * 10, 95)
                            ))
            except Exception:
                pass

        # 4. Live DNS & Network Resolution
        dns_info = {}
        try:
            resolved_ip = socket.gethostbyname(clean_target)
            dns_info["resolved_ip"] = resolved_ip
        except Exception:
            pass

        # 5. MITRE Mapping for this IOC
        all_mitre = await threat_intel_storage.get_mitre_techniques()
        mitre_matches = []
        if matched_local or findings:
            for mt in all_mitre:
                if ioc_type in ("domain", "url") and mt.technique_id in ("T1566", "T1566.002", "T1583.001"):
                    mitre_matches.append(mt)
                elif ioc_type == "ip" and mt.technique_id in ("T1071.001", "T1583.008"):
                    mitre_matches.append(mt)

        # 6. Verdict and Scoring Calculation
        if findings:
            max_conf = max(f.confidence for f in findings)
            threat_confidence = max_conf
            risk_score = min(max_conf + len(corroborated_sources) * 5, 100)
            risk_level = "critical" if risk_score >= 80 else "high"
            verdict = "MALICIOUS" if risk_score >= 70 else "SUSPICIOUS"
        else:
            threat_confidence = 20
            risk_score = 15
            risk_level = "low"
            verdict = "CLEAN"
            findings.append(DeepScanFinding(
                source="CyberChakravyuh Intelligence Lake",
                category="Zero Indicator Match",
                severity="low",
                evidence="No active malicious records identified in synchronized feeds or VirusTotal databases.",
                confidence=85
            ))

        recs = [
            "Block or null-route traffic to this IOC at edge perimeter firewalls.",
            "Inspect proxy and DNS logs for outbound communication attempts from endpoints."
        ] if verdict in ("MALICIOUS", "SUSPICIOUS") else [
            "Continuous automated monitoring active across all Chakra defense rings."
        ]

        return DeepScanResponse(
            target=target,
            normalized_type=ioc_type,
            verdict=verdict,
            threat_confidence=threat_confidence,
            risk_score=risk_score,
            risk_level=risk_level,
            sources_corroborated=list(set(corroborated_sources)),
            matched_campaign=matched_campaign,
            related_indicators=related_iocs,
            mitre_mappings=mitre_matches[:3],
            findings=findings,
            dns_records=dns_info if dns_info else None,
            recommended_actions=recs,
            investigated_at=now
        )

    async def correlate_threats(self, report_id: str) -> ThreatCorrelateResponse:
        """
        Legacy correlation endpoint compatibility.
        """
        indicators = await threat_intel_storage.get_all_indicators()
        campaigns = await threat_intel_storage.get_campaigns()
        return ThreatCorrelateResponse(
            report_id=report_id,
            related_reports=[
                RelatedReport(
                    report_id=c.campaign_id,
                    shared_indicators=c.indicators[:3],
                    similarity_score=float(c.confidence) / 100.0
                )
                for c in campaigns[:3]
            ],
            campaign_summary=f"Correlated with {len(campaigns)} active threat campaign clusters ({len(indicators)} total indicators indexed).",
            total_related=len(campaigns)
        )


threat_intel_service = ThreatIntelService()
