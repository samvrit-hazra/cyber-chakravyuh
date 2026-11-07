from fastapi import APIRouter, HTTPException
from app.features.scam_detector.models import ScamAnalyzeRequest, ScamAnalyzeResponse
from app.features.scam_detector.service import scam_detector_service

router = APIRouter()


@router.post("/analyze", response_model=ScamAnalyzeResponse)
async def analyze_scam_message(request: ScamAnalyzeRequest):
    if not request.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    return await scam_detector_service.analyze_message(request.message)
