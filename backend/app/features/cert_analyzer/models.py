from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime


class CertAnalyzeRequest(BaseModel):
    url: str


class CertFinding(BaseModel):
    category: str  # "validity", "trust_chain", "cryptography", "hostname_match", "ct_log", "revocation"
    indicator: str
    severity: str  # "low", "medium", "high", "critical"
    evidence: str
    impact: Optional[str] = None
    remediation: Optional[str] = None


class CertChainItem(BaseModel):
    subject: str
    issuer: str
    not_before: Optional[datetime] = None
    not_after: Optional[datetime] = None
    is_expired: bool = False
    is_ca: bool = False
    key_type: Optional[str] = None
    key_size: Optional[int] = None
    serial_number: Optional[str] = None


class CertificateDetails(BaseModel):
    common_name: Optional[str] = None
    san_list: List[str] = []
    issuer_org: Optional[str] = None
    issuer_common_name: Optional[str] = None
    valid_from: Optional[datetime] = None
    valid_to: Optional[datetime] = None
    is_expired: bool = False
    days_to_expiry: Optional[int] = None
    key_type: Optional[str] = None  # e.g. "RSA", "ECDSA"
    key_size: Optional[int] = None  # e.g. 2048, 4096
    signature_algo: Optional[str] = None
    tls_version: Optional[str] = None
    cipher_suite: Optional[str] = None
    sha256_fingerprint: Optional[str] = None
    is_self_signed: bool = False
    hostname_matches: bool = True
    is_wildcard: bool = False
    serial_number: Optional[str] = None
    ocsp_urls: List[str] = []
    crl_distribution_points: List[str] = []
    has_revocation_info: bool = False
    system_trust_valid: bool = True
    system_trust_error: Optional[str] = None
    is_revoked: bool = False
    revocation_date: Optional[str] = None
    revocation_url: Optional[str] = None
    certificate_chain: List[CertChainItem] = []


class CTLogEntry(BaseModel):
    id: Optional[int] = None
    logged_at: Optional[str] = None
    not_before: Optional[str] = None
    not_after: Optional[str] = None
    common_name: Optional[str] = None
    issuer_name: Optional[str] = None


class CertAnalyzeResponse(BaseModel):
    report_id: str
    domain: str
    url: str
    risk_level: str  # "low", "suspicious", "high", "critical"
    risk_score: int  # 0 to 100
    trust_score: int = 100  # 0 to 100 (where 0-20 = High/Critical Risk, 90-100 = Grade A)
    grade: str = "A"  # "A+", "A", "B", "C", "D", "F"
    status: str = "Valid & Trusted"
    is_https_available: bool = True
    trust_status: str  # "trusted", "suspicious", "untrusted", "compromised"
    certificate: Optional[CertificateDetails] = None
    certificate_details: Optional[CertificateDetails] = None  # Backward compatibility alias
    findings: List[CertFinding] = []
    ct_logs: List[CTLogEntry] = []
    ai_explanation: Optional[str] = None
    recommended_actions: List[str] = []
    created_at: datetime
