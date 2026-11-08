from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class SecurityAuditRequest(BaseModel):
    url: str


class HeaderAuditDetail(BaseModel):
    header: str
    status: str  # "present_valid", "present_weak", "missing"
    value: Optional[str] = None
    description: str
    recommendation: Optional[str] = None


class ExposureProbeResult(BaseModel):
    path: str
    status_code: int
    exposed: bool
    summary: str


class CookieAudit(BaseModel):
    name: str
    secure: bool
    http_only: bool
    same_site: Optional[str] = None
    issues: List[str] = []


class AuditFinding(BaseModel):
    issue: str
    technical_evidence: str
    potential_impact: str
    severity: str  # "info", "low", "medium", "high", "critical"
    remediation: str
    relevant_limitations: str


class SecurityAuditResponse(BaseModel):
    report_id: str
    target_url: str
    normalized_url: str
    host_ip: Optional[str] = None
    security_score: int  # 0 to 100 (100 is hardened, 0 is severely exposed)
    risk_level: str  # "hardened", "low_risk", "moderate_risk", "high_risk", "critical_risk"
    grade: str  # "A+", "A", "B", "C", "D", "F"
    https_enforced: bool = True
    server_info_leak: Optional[str] = None
    headers_present: List[str] = []
    headers_missing: List[str] = []
    header_details: List[HeaderAuditDetail] = []
    exposure_probes: List[ExposureProbeResult] = []
    cookie_audits: List[CookieAudit] = []
    shodan_intel: Optional[Dict[str, Any]] = None
    findings: List[AuditFinding] = []
    ai_posture_summary: str
    remediation_priorities: List[str] = []
    report_hash: Optional[str] = None
    tx_hash: Optional[str] = None
    blockchain_status: Optional[str] = None
    contract_address: Optional[str] = None
    etherscan_url: Optional[str] = None
    created_at: datetime
