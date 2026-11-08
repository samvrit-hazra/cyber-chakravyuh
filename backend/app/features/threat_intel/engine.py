from typing import List, Dict, Any
from datetime import datetime, timezone
from collections import defaultdict
from app.features.threat_intel.models import (
    ThreatIndicator,
    ThreatCampaign,
    MitreTechniqueRecord,
    DefenseLayerMetric,
    ThreatCategoryMetric
)

DEFENSE_LAYERS = [
    ("Layer 1", "Perimeter & DNS Filtering"),
    ("Layer 2", "Transport & Cryptographic Trust (TLS)"),
    ("Layer 3", "Application Protocol & HTTP Security"),
    ("Layer 4", "Content & DOM Payload Inspection"),
    ("Layer 5", "Cryptographic Shield & Ledger Committal"),
    ("Layer 6", "Immutable Data Vault & Merkle Audit"),
    ("Layer 7", "AI Behavioral Threat Reasoning"),
]


class ThreatCorrelationEngine:

    def cluster_campaigns(self, indicators: List[ThreatIndicator]) -> List[ThreatCampaign]:
        """
        Correlates indicators into evidence-backed adversary campaigns.
        Groups by malware family, shared infrastructure patterns, or campaign tags.
        """
        family_groups: Dict[str, List[ThreatIndicator]] = defaultdict(list)

        for ind in indicators:
            fam = ind.malware_family or "Uncategorized Threat"
            family_groups[fam].append(ind)

        campaigns: List[ThreatCampaign] = []
        campaign_idx = 101

        for fam, group in family_groups.items():
            if len(group) == 0:
                continue

            # Compute campaign metrics
            campaign_id = f"CMP-2026-{campaign_idx:04d}"
            campaign_idx += 1

            sources = sorted(list(set(i.source for i in group)))
            avg_conf = int(sum(i.confidence for i in group) / len(group))
            earliest = min((i.first_seen for i in group), default=datetime.now(timezone.utc))
            latest = max((i.last_seen for i in group), default=datetime.now(timezone.utc))
            iocs = [i.ioc for i in group[:15]]

            # Attribution heuristics based on confirmed adversary telemetry
            attribution = "Unassigned Cybercrime Actor"
            fam_lower = fam.lower()
            if "emotet" in fam_lower:
                attribution = "TA542 (Mealybug / Mummy Spider)"
            elif "asyncrat" in fam_lower:
                attribution = "Commodity Malware Operators"
            elif "web3 drainer" in fam_lower or "drainer" in fam_lower:
                attribution = "Decentralized Wallet Drainer Sybil Rings"
            elif "banking" in fam_lower:
                attribution = "Phishing-as-a-Service (PhaaS) Syndicates"
            elif "office365" in fam_lower or "harvester" in fam_lower:
                attribution = "Business Email Compromise (BEC) Staging Networks"

            campaign_name = f"{fam} Infrastructure Cluster" if "Campaign" not in fam else fam

            campaigns.append(ThreatCampaign(
                campaign_id=campaign_id,
                name=campaign_name,
                status="active",
                malware_families=[fam],
                ioc_count=len(group),
                confidence=avg_conf,
                sources=sources,
                first_seen=earliest,
                last_seen=latest,
                attribution=attribution,
                indicators=iocs
            ))

        # Sort campaigns by indicator volume descending
        campaigns.sort(key=lambda c: c.ioc_count, reverse=True)
        return campaigns

    def correlate_mitre_techniques(
        self,
        indicators: List[ThreatIndicator],
        base_techniques: List[MitreTechniqueRecord]
    ) -> List[MitreTechniqueRecord]:
        """
        Maps observed indicators to MITRE ATT&CK techniques with verified evidence trails.
        """
        results: List[MitreTechniqueRecord] = []

        for bt in base_techniques:
            t_id = bt.technique_id
            matched_indicators: List[ThreatIndicator] = []

            for ind in indicators:
                fam = (ind.malware_family or "").lower()
                ttype = ind.threat_type.lower()
                ioc_lower = ind.ioc.lower()

                if t_id == "T1566" or t_id == "T1566.002":
                    if ttype in ("phishing", "credential_harvesting") or ind.ioc_type == "url":
                        matched_indicators.append(ind)
                elif t_id == "T1583.001":
                    if ind.ioc_type == "domain" or ".pages.dev" in ioc_lower or ".cc" in ioc_lower or "login" in ioc_lower:
                        matched_indicators.append(ind)
                elif t_id == "T1071.001":
                    if ttype in ("c2", "botnet") or "emotet" in fam or "asyncrat" in fam or ind.ioc_type == "ip":
                        matched_indicators.append(ind)
                elif t_id == "T1204.001":
                    if ind.ioc_type == "url" and ttype == "phishing":
                        matched_indicators.append(ind)
                elif t_id == "T1539":
                    if "harvester" in fam or "session" in fam or ttype == "credential_harvesting":
                        matched_indicators.append(ind)
                elif t_id == "T1059.007":
                    if "drainer" in fam or "wallet" in fam:
                        matched_indicators.append(ind)

            obs_count = len(matched_indicators)
            evidence_srcs = sorted(list(set(i.source for i in matched_indicators))) or bt.evidence_sources
            samples = [i.ioc for i in matched_indicators[:4]]

            results.append(MitreTechniqueRecord(
                technique_id=bt.technique_id,
                name=bt.name,
                tactic=bt.tactic,
                description=bt.description,
                observed_count=obs_count,
                confidence=bt.confidence if obs_count > 0 else 50,
                evidence_sources=evidence_srcs,
                sample_indicators=samples,
                mitigations=bt.mitigations,
                severity=bt.severity
            ))

        return results

    def compute_defense_mesh(self, indicators: List[ThreatIndicator]) -> List[DefenseLayerMetric]:
        """
        Maps indicators to Chakravyuha's 7 concentric perimeter defense rings.
        """
        total = max(len(indicators), 1)
        layer_counts: Dict[str, int] = defaultdict(int)

        for ind in indicators:
            layer_str = ind.defense_layer or "Layer 1 (Perimeter & DNS)"
            # Extract just the layer key e.g. "Layer 1"
            prefix = layer_str.split("(")[0].strip()
            layer_counts[prefix] += 1

        mesh: List[DefenseLayerMetric] = []
        for l_key, l_name in DEFENSE_LAYERS:
            count = layer_counts.get(l_key, 0)
            pct = round((count / total) * 100, 1)
            mesh.append(DefenseLayerMetric(
                layer=l_key,
                name=f"{l_key}: {l_name}",
                count=count,
                percentage=pct
            ))

        return mesh

    def compute_threat_categories(self, indicators: List[ThreatIndicator]) -> List[ThreatCategoryMetric]:
        """
        Computes distribution of verified threat indicators across operational categories.
        """
        total = max(len(indicators), 1)
        cat_counts: Dict[str, int] = defaultdict(int)

        for ind in indicators:
            cat = ind.malware_family or ind.threat_type.title()
            cat_counts[cat] += 1

        metrics: List[ThreatCategoryMetric] = []
        for cat, count in cat_counts.items():
            pct = round((count / total) * 100, 1)
            metrics.append(ThreatCategoryMetric(
                category=cat,
                count=count,
                percentage=pct
            ))

        metrics.sort(key=lambda m: m.count, reverse=True)
        return metrics[:8]


threat_correlation_engine = ThreatCorrelationEngine()
