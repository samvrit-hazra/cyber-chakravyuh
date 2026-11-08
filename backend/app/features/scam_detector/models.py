from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class ScamAnalyzeRequest(BaseModel):
    message: str
    format: Optional[str] = "auto"  # "auto", "plain_text", "whatsapp_chat", "email_raw"


class ExtractedIndicators(BaseModel):
    urls: List[str] = []
    emails: List[str] = []
    phone_numbers: List[str] = []
    crypto_addresses: List[str] = []
    payment_handles: List[str] = []  # UPI IDs, wire/IBAN handles


class ParsedContext(BaseModel):
    detected_format: str = "plain_text"  # "plain_text", "whatsapp_chat", "email_raw"
    sender: Optional[str] = None
    recipient: Optional[str] = None
    subject: Optional[str] = None
    timestamp: Optional[str] = None
    headers: Dict[str, str] = {}
    message_count: int = 1
    participants: List[str] = []
    spoofing_indicators: List[str] = []


class CorrelatedThreat(BaseModel):
    indicator_type: str  # "url", "domain", "email"
    value: str
    verdict: str  # "malicious", "suspicious", "benign", "unscanned"
    details: Dict[str, Any] = {}


class ScamFinding(BaseModel):
    category: str  # "social_engineering", "spoofing", "credential_harvesting", "threat_intelligence", "payment_fraud"
    indicator: str
    severity: str  # "low", "medium", "high", "critical"
    evidence: str
    impact: Optional[str] = None
    remediation: Optional[str] = None


class ScamAnalyzeResponse(BaseModel):
    report_id: str
    risk_level: str  # "low", "suspicious", "high", "confirmed_fraud"
    risk_score: int  # 0 to 100
    scam_type: Optional[str] = None  # e.g. "Bank Impersonation / KYC Scam", "Courier Delivery Phishing", "Crypto Doubler Scam"
    confidence: float = 0.85
    parsed_context: ParsedContext
    extracted_indicators: ExtractedIndicators
    correlated_threats: List[CorrelatedThreat] = []
    findings: List[ScamFinding] = []
    social_engineering_tactics: List[str] = []
    ai_explanation: str
    recommended_actions: List[str] = []
    created_at: datetime
