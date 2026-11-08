from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any
from app.features.reports.models import (
    ReportRegisterRequest,
    ReportRegisterResponse,
    ReportVerifyRequest,
    ReportVerifyResponse,
)
from app.features.reports.service import report_integrity_service

router = APIRouter()


@router.post("/register", response_model=ReportRegisterResponse)
async def register_report(request: ReportRegisterRequest):
    """
    Registers a new security assessment report on the Ethereum Sepolia ledger.
    Generates an immutable RFC canonical SHA-256 fingerprint and on-chain commitment.
    """
    try:
        return await report_integrity_service.register_report(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(exc)}")


@router.post("/verify", response_model=ReportVerifyResponse)
async def verify_report(request: ReportVerifyRequest):
    """
    Verifies report authenticity and tamper status via query string, SHA-256, or uploaded payload.
    """
    try:
        return await report_integrity_service.verify_report(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(exc)}")


@router.get("/verify/id/{report_id}", response_model=ReportVerifyResponse)
async def verify_by_report_id(report_id: str):
    """
    Lookup and verify report authenticity by its Report ID (e.g. CCR-2026-000124).
    """
    return await report_integrity_service.verify_report(ReportVerifyRequest(query=report_id))


@router.get("/verify/hash/{report_hash}", response_model=ReportVerifyResponse)
async def verify_by_hash(report_hash: str):
    """
    Lookup and verify report authenticity by its SHA-256 fingerprint.
    """
    return await report_integrity_service.verify_report(ReportVerifyRequest(query=report_hash))


@router.get("/verify/tx/{tx_hash}", response_model=ReportVerifyResponse)
async def verify_by_tx(tx_hash: str):
    """
    Lookup and verify report registration by Ethereum Sepolia transaction hash.
    """
    return await report_integrity_service.verify_report(ReportVerifyRequest(query=tx_hash))


@router.get("/all", response_model=List[Dict[str, Any]])
async def get_all_reports():
    """
    Retrieves all committed security reports recorded in the decentralized registry.
    """
    return report_integrity_service.get_all_reports()


@router.get("/network")
async def get_network_info():
    """
    Returns live Ethereum Sepolia network status, chain ID, and current block height.
    """
    block_num = await report_integrity_service.get_latest_block_number()
    return {
        "network": "Ethereum Sepolia",
        "chain_id": 11155111,
        "connected": True,
        "latest_block": block_num,
        "provider": "QuickNode Dedicated RPC",
        "hash_algorithm": "SHA-256 (RFC-compliant Canonical JSON)"
    }
