from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime


class SecurityAuditRequest(BaseModel):
    url: str


class AuditFinding(BaseModel):
    issue: str
    severity: str  # low, medium, high
    evidence: str
    impact: str
    remediation: str


class SecurityAuditResponse(BaseModel):
    report_id: str
    url: str
    risk_level: str
    findings: List[AuditFinding] = []
    headers_present: List[str] = []
    headers_missing: List[str] = []
    created_at: datetime
