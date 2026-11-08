from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime


class URLAnalyzeRequest(BaseModel):
    url: str


class FindingItem(BaseModel):
    category: str
    indicator: str
    severity: str  # "low", "medium", "high", "critical"
    evidence: str
    source: str


class DomainDetails(BaseModel):
    domain: str
    subdomain: Optional[str] = None
    suffix: Optional[str] = None
    registered_domain: Optional[str] = None
    ip_addresses: List[str] = []
    dns_records: Dict[str, List[str]] = {}
    registrar: Optional[str] = None
    creation_date: Optional[str] = None
    age_days: Optional[int] = None
    is_idn_homoglyph: bool = False
    typosquat_target: Optional[str] = None


class ThreatIntelSummary(BaseModel):
    virustotal: Optional[Dict[str, Any]] = None
    shodan: Optional[Dict[str, Any]] = None


class URLAnalyzeResponse(BaseModel):
    report_id: str
    url: str
    normalized_url: str
    risk_level: str  # "low", "suspicious", "high", "confirmed_malicious", "inconclusive"
    risk_score: int  # 0 to 100
    findings: List[FindingItem] = []
    ai_explanation: Optional[str] = None
    recommended_actions: List[str] = []
    redirect_chain: List[str] = []
    domain_info: DomainDetails
    threat_intel: ThreatIntelSummary
    report_hash: Optional[str] = None
    tx_hash: Optional[str] = None
    blockchain_status: Optional[str] = None
    contract_address: Optional[str] = None
    etherscan_url: Optional[str] = None
    created_at: datetime
