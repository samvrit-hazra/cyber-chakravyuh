from fastapi import APIRouter
from app.features.threat_intel.models import ThreatCorrelateResponse
from app.features.threat_intel.service import threat_intel_service

router = APIRouter()


@router.get("/correlate/{report_id}", response_model=ThreatCorrelateResponse)
async def correlate_threat_report(report_id: str):
    return await threat_intel_service.correlate_threats(report_id)
