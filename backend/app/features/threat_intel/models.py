from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class ThreatIndicator(BaseModel):
    ioc: str
    ioc_type: str  # "domain", "url", "ip", "hash"
    threat_type: str  # "phishing", "malware", "c2", "botnet", "credential_harvesting"
    malware_family: Optional[str] = "Generic Phishing"
    confidence: int = 80  # 0 to 100
    source: str  # "OpenPhish", "ThreatFox", "URLhaus", "FeodoTracker", "CyberChakravyuh Sensor"
    source_id: Optional[str] = None
    reference: Optional[str] = None
    defense_layer: str = "Layer 1 (Perimeter & DNS)"
    first_seen: datetime = Field(default_factory=datetime.utcnow)
    last_seen: datetime = Field(default_factory=datetime.utcnow)
    ingested_at: datetime = Field(default_factory=datetime.utcnow)
    tags: List[str] = []


class ThreatCampaign(BaseModel):
    campaign_id: str
    name: str
    status: str = "active"  # "active", "mitigated", "monitoring"
    malware_families: List[str] = []
    ioc_count: int = 0
    confidence: int = 85
    sources: List[str] = []
    first_seen: datetime = Field(default_factory=datetime.utcnow)
    last_seen: datetime = Field(default_factory=datetime.utcnow)
    attribution: str = "Unassigned Cybercrime Cluster"
    indicators: List[str] = []


class ThreatFeedStatus(BaseModel):
    feed_name: str
    status: str = "synchronized"  # "synchronized", "syncing", "failed", "configured"
    last_sync: datetime = Field(default_factory=datetime.utcnow)
    ioc_count: int = 0
    frequency: str = "12 Hours"
    source_url: str = ""
    error_message: Optional[str] = None


class MitreTechniqueRecord(BaseModel):
    technique_id: str  # e.g. "T1566.002"
    name: str  # e.g. "Spearphishing Link"
    tactic: str  # "Initial Access", "Execution", "Command and Control", etc.
    description: str
    observed_count: int = 0
    confidence: int = 85
    evidence_sources: List[str] = []
    sample_indicators: List[str] = []
    mitigations: str
    severity: str = "High"


class DefenseLayerMetric(BaseModel):
    layer: str
    name: str
    count: int
    percentage: float


class ThreatCategoryMetric(BaseModel):
    category: str
    count: int
    percentage: float


class ThreatDashboardResponse(BaseModel):
    feed_status: Dict[str, Any]
    campaigns: Dict[str, Any]
    indicators: Dict[str, Any]
    takedown_velocity: str = "Not enough verified data"
    defense_mesh: List[DefenseLayerMetric] = []
    threat_categories: List[ThreatCategoryMetric] = []
    last_updated: datetime = Field(default_factory=datetime.utcnow)


class DeepScanRequest(BaseModel):
    target: str


class DeepScanFinding(BaseModel):
    source: str
    category: str
    severity: str
    evidence: str
    confidence: int


class DeepScanResponse(BaseModel):
    target: str
    normalized_type: str  # "domain", "url", "ip", "hash"
    verdict: str  # "MALICIOUS", "SUSPICIOUS", "CLEAN", "UNKNOWN"
    threat_confidence: int  # 0 to 100
    risk_score: int
    risk_level: str  # "low", "medium", "high", "critical"
    sources_corroborated: List[str] = []
    matched_campaign: Optional[ThreatCampaign] = None
    related_indicators: List[str] = []
    mitre_mappings: List[MitreTechniqueRecord] = []
    findings: List[DeepScanFinding] = []
    first_seen: Optional[datetime] = None
    last_seen: Optional[datetime] = None
    dns_records: Optional[Dict[str, Any]] = None
    recommended_actions: List[str] = []
    investigated_at: datetime = Field(default_factory=datetime.utcnow)


class RelatedReport(BaseModel):
    report_id: str
    shared_indicators: List[str]
    similarity_score: float


class ThreatCorrelateResponse(BaseModel):
    report_id: str
    related_reports: List[RelatedReport] = []
    campaign_summary: str
    total_related: int
