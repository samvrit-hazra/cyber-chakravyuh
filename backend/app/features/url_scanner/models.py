from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Dict, Any
from datetime import datetime


class URLAnalyzeRequest(BaseModel):
    url: str


class FindingItem(BaseModel):
    category: str
    indicator: str
    severity: str  # low, medium, high, critical
    evidence: str
    source: str


class URLAnalyzeResponse(BaseModel):
    report_id: str
    url: str
    risk_level: str  # low, suspicious, high, confirmed_malicious, inconclusive
    risk_score: int  # 0 to 100
    findings: List[FindingItem] = []
    ai_explanation: Optional[str] = None
    redirect_chain: List[str] = []
    domain_info: Dict[str, Any] = {}
    created_at: datetime
