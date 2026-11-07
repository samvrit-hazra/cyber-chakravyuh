from fastapi import APIRouter, HTTPException
from app.features.security_auditor.models import SecurityAuditRequest, SecurityAuditResponse
from app.features.security_auditor.service import security_auditor_service

router = APIRouter()


@router.post("/audit", response_model=SecurityAuditResponse)
async def audit_website_security(request: SecurityAuditRequest):
    if not request.url:
        raise HTTPException(status_code=400, detail="Target URL cannot be empty")
    return await security_auditor_service.audit_url(request.url)
