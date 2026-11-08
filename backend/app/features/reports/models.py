from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime


class ReportRegisterRequest(BaseModel):
    report_id: Optional[str] = Field(None, description="Optional custom ID. Auto-generated as CCR-2026-XXXXXX if omitted.")
    target: str = Field(..., description="Target domain, URL, IP, or wallet address analyzed")
    scan_type: str = Field("url_analysis", description="Analysis type: url_analysis | security_audit | scam_detection | web3_threat")
    findings_summary: str = Field(..., description="Evidentiary summary of detected security findings")
    risk_score: int = Field(..., ge=0, le=100, description="Risk score 0 to 100")
    risk_level: str = Field("LOW", description="Risk classification: SAFE | LOW | MEDIUM | HIGH | CRITICAL")
    canonical_data: Optional[Dict[str, Any]] = Field(None, description="Raw structural payload for strict canonical hashing")


class ReportRegisterResponse(BaseModel):
    report_id: str
    report_hash: str
    tx_hash: str
    network: str = "sepolia"
    chain_id: int = 11155111
    contract_address: str
    block_number: int
    status: str = "registered"
    created_at: str
    etherscan_url: str


class ReportVerifyRequest(BaseModel):
    query: Optional[str] = Field(None, description="Report ID, SHA-256 fingerprint, or Transaction Hash")
    report_data: Optional[Dict[str, Any]] = Field(None, description="Uploaded JSON payload to canonicalize and audit for tampering")
    report_id: Optional[str] = Field(None, description="Report ID when verifying an uploaded modified file")


class ReportVerifyResponse(BaseModel):
    verified: bool
    status: str  # "GENUINE" | "TAMPERED" | "UNREGISTERED" | "INVALID_TRANSACTION"
    integrity: str  # "MATCH" | "MISMATCH" | "NOT_FOUND"
    network: str = "Ethereum Sepolia"
    chain_id: int = 11155111
    issuer_verified: bool
    blockchain_registered: bool
    report_id: Optional[str] = None
    report_hash: Optional[str] = None
    recalculated_hash: Optional[str] = None
    tx_hash: Optional[str] = None
    contract_address: Optional[str] = None
    block_number: Optional[int] = None
    timestamp: Optional[str] = None
    target: Optional[str] = None
    scan_type: Optional[str] = None
    risk_score: Optional[int] = None
    risk_level: Optional[str] = None
    etherscan_url: Optional[str] = None
    audit_details: Optional[Dict[str, Any]] = None
