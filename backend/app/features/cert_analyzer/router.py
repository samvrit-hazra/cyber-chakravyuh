from fastapi import APIRouter, HTTPException
from app.features.cert_analyzer.models import CertAnalyzeRequest, CertAnalyzeResponse
from app.features.cert_analyzer.service import cert_analyzer_service

router = APIRouter()


@router.post("/analyze", response_model=CertAnalyzeResponse)
async def analyze_cert(request: CertAnalyzeRequest):
    if not request.url:
        raise HTTPException(status_code=400, detail="Target URL/domain cannot be empty")
    return await cert_analyzer_service.analyze_cert(request.url)
