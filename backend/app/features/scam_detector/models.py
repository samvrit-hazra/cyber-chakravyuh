from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime


class ScamAnalyzeRequest(BaseModel):
    message: str


class ExtractedIndicators(BaseModel):
    urls: List[str] = []
    emails: List[str] = []
    phone_numbers: List[str] = []


class ScamAnalyzeResponse(BaseModel):
    report_id: str
    risk_level: str  # low, suspicious, high, confirmed_malicious
    risk_score: int
    scam_type: Optional[str] = None
    extracted_indicators: ExtractedIndicators
    patterns_detected: List[str] = []
    ai_explanation: str
    recommended_actions: List[str] = []
    created_at: datetime
