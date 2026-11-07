from pydantic import BaseModel
from typing import List, Dict, Any


class RelatedReport(BaseModel):
    report_id: str
    shared_indicators: List[str]
    similarity_score: float


class ThreatCorrelateResponse(BaseModel):
    report_id: str
    related_reports: List[RelatedReport] = []
    campaign_summary: str
    total_related: int
