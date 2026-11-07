from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime


class CertAnalyzeRequest(BaseModel):
    url: str


class CertificateDetails(BaseModel):
    issuer: str
    valid_from: Optional[datetime] = None
    valid_to: Optional[datetime] = None
    key_size: Optional[int] = None
    signature_algo: Optional[str] = None
    san_list: List[str] = []
    chain_valid: bool = False


class CertAnalyzeResponse(BaseModel):
    report_id: str
    domain: str
    risk_level: str
    certificate: Optional[CertificateDetails] = None
    findings: List[Dict[str, Any]] = []
    ct_logs: List[Dict[str, Any]] = []
    created_at: datetime
