from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional
from app.features.scam_detector.models import ScamAnalyzeRequest, ScamAnalyzeResponse
from app.features.scam_detector.service import scam_detector_service
from app.core.database import get_database

router = APIRouter()


@router.post("/analyze", response_model=ScamAnalyzeResponse)
async def analyze_scam_message(request: ScamAnalyzeRequest):
    """
    Analyzes submitted text (SMS, WhatsApp conversation export, raw Email, or DM)
    for social engineering tactics, credential harvesting, payment fraud, and threat intelligence.
    """
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message content cannot be empty")
    return await scam_detector_service.analyze_message(request.message, user_format=request.format or "auto")


@router.post("/analyze-file", response_model=ScamAnalyzeResponse)
async def analyze_scam_file(
    file: UploadFile = File(...),
    format: Optional[str] = Form("auto")
):
    """
    Accepts an uploaded file (.txt, .eml, .csv, WhatsApp chat export) and analyzes it for scam indicators.
    """
    content_bytes = await file.read()
    try:
        raw_text = content_bytes.decode("utf-8")
    except UnicodeDecodeError:
        raw_text = content_bytes.decode("latin-1", errors="replace")

    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    return await scam_detector_service.analyze_message(raw_text, user_format=format or "auto")


@router.get("/report/{report_id}", response_model=ScamAnalyzeResponse)
async def get_scam_report(report_id: str):
    """
    Retrieves a previously generated scam analysis report by ID.
    """
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    doc = await db.scam_analyses.find_one({"_id": report_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Scam analysis report not found")

    return ScamAnalyzeResponse(**doc)
