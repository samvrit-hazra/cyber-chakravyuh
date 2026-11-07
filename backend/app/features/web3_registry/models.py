from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class Web3SubmitRequest(BaseModel):
    report_id: str


class Web3SubmitResponse(BaseModel):
    report_hash: str
    tx_hash: str
    contract_address: str
    chain: str
    block_number: Optional[int] = None
    verified: bool
    created_at: datetime


class Web3VerifyResponse(BaseModel):
    report_hash: str
    exists_on_chain: bool
    submitted_at: Optional[datetime] = None
    tx_hash: Optional[str] = None
    integrity_match: bool
