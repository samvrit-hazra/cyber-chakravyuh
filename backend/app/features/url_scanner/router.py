from fastapi import APIRouter, HTTPException
from app.features.url_scanner.models import URLAnalyzeRequest, URLAnalyzeResponse
from app.features.url_scanner.service import url_scanner_service
from app.core.database import get_database

router = APIRouter()


@router.post("/analyze", response_model=URLAnalyzeResponse)
async def analyze_url(request: URLAnalyzeRequest):
    if not request.url or not request.url.strip():
        raise HTTPException(status_code=400, detail="URL cannot be empty")
    return await url_scanner_service.analyze_url(request.url)


@router.get("/report/{report_id}")
async def get_url_report(report_id: str):
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database connection not available")

    report = await db.reports.find_one({"_id": report_id})
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    return report
