from fastapi import APIRouter, HTTPException
from app.features.cert_analyzer.models import CertAnalyzeRequest, CertAnalyzeResponse
from app.features.cert_analyzer.service import cert_analyzer_service
from app.core.database import get_database

router = APIRouter()


@router.post("/analyze", response_model=CertAnalyzeResponse)
async def analyze_cert(request: CertAnalyzeRequest):
    if not request.url or not request.url.strip():
        raise HTTPException(status_code=400, detail="Target URL/domain cannot be empty")
    return await cert_analyzer_service.analyze_cert(request.url)


@router.get("/report/{report_id}")
async def get_cert_report(report_id: str):
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection not available")

    report = await db.cert_analyses.find_one({"_id": report_id})
    if not report:
        raise HTTPException(status_code=404, detail="Certificate report not found")

    return report
