from fastapi import APIRouter, HTTPException
from app.features.security_auditor.models import SecurityAuditRequest, SecurityAuditResponse
from app.features.security_auditor.service import security_auditor_service
from app.core.database import get_database

router = APIRouter()


@router.post("/audit", response_model=SecurityAuditResponse)
async def audit_website_security(request: SecurityAuditRequest):
    """
    Performs a safe, non-intrusive security configuration audit for a website:
    - HTTP security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
    - Cookie security flags (Secure, HttpOnly, SameSite)
    - Plaintext HTTP to HTTPS redirection
    - Sensitive file exposure probes (robots.txt, security.txt, .git/HEAD, .env)
    - Shodan open ports and known CVE correlation
    - Groq AI security posture evaluation and prioritized remediation
    """
    if not request.url or not request.url.strip():
        raise HTTPException(status_code=400, detail="Target URL cannot be empty")
    return await security_auditor_service.audit_url(request.url)


@router.get("/report/{report_id}", response_model=SecurityAuditResponse)
async def get_security_audit_report(report_id: str):
    """
    Retrieves a previously generated website security audit report by ID.
    """
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    doc = await db.security_audits.find_one({"_id": report_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Security audit report not found")

    return SecurityAuditResponse(**doc)
