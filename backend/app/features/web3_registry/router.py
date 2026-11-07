from fastapi import APIRouter, HTTPException
from app.features.web3_registry.models import Web3SubmitRequest, Web3SubmitResponse, Web3VerifyResponse
from app.features.web3_registry.service import web3_registry_service

router = APIRouter()


@router.post("/submit", response_model=Web3SubmitResponse)
async def submit_threat_report_onchain(request: Web3SubmitRequest):
    if not request.report_id:
        raise HTTPException(status_code=400, detail="Report ID cannot be empty")
    return await web3_registry_service.submit_report_hash(request.report_id)


@router.get("/verify/{report_hash}", response_model=Web3VerifyResponse)
async def verify_threat_report_onchain(report_hash: str):
    if not report_hash:
        raise HTTPException(status_code=400, detail="Report hash cannot be empty")
    return await web3_registry_service.verify_report_hash(report_hash)
