from fastapi import APIRouter, HTTPException
from app.features.url_scanner.models import URLAnalyzeRequest, URLAnalyzeResponse
from app.features.url_scanner.service import url_scanner_service

router = APIRouter()


@router.post("/analyze", response_model=URLAnalyzeResponse)
async def analyze_url(request: URLAnalyzeRequest):
    if not request.url:
        raise HTTPException(status_code=400, detail="URL cannot be empty")
    return await url_scanner_service.analyze_url(request.url)
