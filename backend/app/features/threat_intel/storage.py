import json
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from app.core.database import get_database
from app.features.threat_intel.models import (
    ThreatIndicator,
    ThreatCampaign,
    ThreatFeedStatus,
    MitreTechniqueRecord
)
from app.features.threat_intel.collectors import (
    get_curated_baseline_indicators,
    get_default_mitre_techniques
)

DATA_FILE = Path(__file__).parent.parent.parent.parent / "data" / "threat_intel_store.json"


class ThreatIntelStorage:
    def __init__(self):
        self._indicators: Dict[str, Dict[str, Any]] = {}
        self._campaigns: Dict[str, Dict[str, Any]] = {}
        self._feeds: Dict[str, Dict[str, Any]] = {}
        self._mitre: Dict[str, Dict[str, Any]] = {}
        self._load_local_store()

    def _load_local_store(self):
        try:
            if DATA_FILE.exists():
                with open(DATA_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self._indicators = data.get("indicators", {})
                    self._campaigns = data.get("campaigns", {})
                    self._feeds = data.get("feeds", {})
                    self._mitre = data.get("mitre", {})
        except Exception as e:
            print(f"Notice loading threat store: {e}")

        # Seed defaults if empty
        if not self._indicators:
            for ind in get_curated_baseline_indicators():
                key = f"{ind.source}:{ind.ioc}".lower()
                self._indicators[key] = ind.model_dump(mode="json")

        if not self._mitre:
            for m in get_default_mitre_techniques():
                self._mitre[m.technique_id] = m.model_dump(mode="json")

        if not self._feeds:
            default_feeds = [
                ThreatFeedStatus(feed_name="OpenPhish Community", status="synchronized", ioc_count=len(self._indicators), frequency="12 Hours", source_url="https://openphish.com/feed.txt"),
                ThreatFeedStatus(feed_name="abuse.ch FeodoTracker", status="synchronized", ioc_count=len(self._indicators), frequency="15 Minutes", source_url="https://feodotracker.abuse.ch"),
                ThreatFeedStatus(feed_name="abuse.ch ThreatFox", status="configured", ioc_count=0, frequency="15 Minutes", source_url="https://threatfox.abuse.ch"),
                ThreatFeedStatus(feed_name="abuse.ch URLhaus", status="configured", ioc_count=0, frequency="15 Minutes", source_url="https://urlhaus.abuse.ch"),
                ThreatFeedStatus(feed_name="MITRE ATT&CK Enterprise", status="synchronized", ioc_count=len(self._mitre), frequency="Daily", source_url="https://attack.mitre.org")
            ]
            for f in default_feeds:
                self._feeds[f.feed_name] = f.model_dump(mode="json")

        self._save_local_store()

    def _save_local_store(self):
        try:
            DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
            with open(DATA_FILE, "w", encoding="utf-8") as f:
                json.dump({
                    "indicators": self._indicators,
                    "campaigns": self._campaigns,
                    "feeds": self._feeds,
                    "mitre": self._mitre,
                    "last_saved": datetime.now(timezone.utc).isoformat()
                }, f, indent=2, default=str)
        except Exception as e:
            print(f"Notice saving threat store: {e}")

    async def upsert_indicators(self, indicators: List[ThreatIndicator]) -> int:
        """
        Deduplicates and stores indicators. Returns number of new indicators added.
        """
        added_count = 0
        db = get_database()

        for ind in indicators:
            key = f"{ind.source}:{ind.ioc}".lower()
            is_new = key not in self._indicators
            self._indicators[key] = ind.model_dump(mode="json")
            if is_new:
                added_count += 1

            if db is not None:
                try:
                    doc = ind.model_dump(mode="json")
                    doc["_id"] = key
                    await db.threat_iocs.replace_one({"_id": key}, doc, upsert=True)
                except Exception:
                    pass

        self._save_local_store()
        return added_count

    async def get_all_indicators(self) -> List[ThreatIndicator]:
        db = get_database()
        if db is not None:
            try:
                cursor = db.threat_iocs.find({})
                docs = await cursor.to_list(length=1000)
                if docs:
                    return [ThreatIndicator(**d) for d in docs]
            except Exception:
                pass

        return [ThreatIndicator(**d) for d in self._indicators.values()]

    async def save_campaigns(self, campaigns: List[ThreatCampaign]):
        db = get_database()
        for c in campaigns:
            self._campaigns[c.campaign_id] = c.model_dump(mode="json")
            if db is not None:
                try:
                    doc = c.model_dump(mode="json")
                    doc["_id"] = c.campaign_id
                    await db.threat_campaigns.replace_one({"_id": c.campaign_id}, doc, upsert=True)
                except Exception:
                    pass
        self._save_local_store()

    async def get_campaigns(self) -> List[ThreatCampaign]:
        db = get_database()
        if db is not None:
            try:
                cursor = db.threat_campaigns.find({})
                docs = await cursor.to_list(length=50)
                if docs:
                    return [ThreatCampaign(**d) for d in docs]
            except Exception:
                pass

        return [ThreatCampaign(**d) for d in self._campaigns.values()]

    async def save_feed_status(self, feed: ThreatFeedStatus):
        self._feeds[feed.feed_name] = feed.model_dump(mode="json")
        db = get_database()
        if db is not None:
            try:
                doc = feed.model_dump(mode="json")
                doc["_id"] = feed.feed_name
                await db.threat_feeds.replace_one({"_id": feed.feed_name}, doc, upsert=True)
            except Exception:
                pass
        self._save_local_store()

    async def get_all_feeds(self) -> List[ThreatFeedStatus]:
        db = get_database()
        if db is not None:
            try:
                cursor = db.threat_feeds.find({})
                docs = await cursor.to_list(length=20)
                if docs:
                    return [ThreatFeedStatus(**d) for d in docs]
            except Exception:
                pass

        return [ThreatFeedStatus(**d) for d in self._feeds.values()]

    async def save_mitre_techniques(self, techniques: List[MitreTechniqueRecord]):
        db = get_database()
        for m in techniques:
            self._mitre[m.technique_id] = m.model_dump(mode="json")
            if db is not None:
                try:
                    doc = m.model_dump(mode="json")
                    doc["_id"] = m.technique_id
                    await db.mitre_techniques.replace_one({"_id": m.technique_id}, doc, upsert=True)
                except Exception:
                    pass
        self._save_local_store()

    async def get_mitre_techniques(self) -> List[MitreTechniqueRecord]:
        db = get_database()
        if db is not None:
            try:
                cursor = db.mitre_techniques.find({})
                docs = await cursor.to_list(length=50)
                if docs:
                    return [MitreTechniqueRecord(**d) for d in docs]
            except Exception:
                pass

        return [MitreTechniqueRecord(**d) for d in self._mitre.values()]


threat_intel_storage = ThreatIntelStorage()
