from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection

# Feature Routers
from app.features.url_scanner.router import router as url_router
from app.features.cert_analyzer.router import router as cert_router
from app.features.scam_detector.router import router as scam_router
from app.features.security_auditor.router import router as security_router
from app.features.threat_intel.router import router as threat_router
from app.features.web3_registry.router import router as web3_router
from app.features.web3_threat.router import router as web3_threat_router
from app.features.reports.router import router as reports_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB
    await connect_to_mongo()
    yield
    # Shutdown: Close MongoDB
    await close_mongo_connection()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan,
    description="AI-Powered Web Threat Detection & Digital Trust Intelligence API"
)

# CORS Middleware — Permissive for local testing (file://, localhost, custom ports) + Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows file:// (origin: null) and all local/remote test environments
    allow_credentials=False,  # Set to False when allow_origins is wildcard
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Feature Routers (Plug-and-play vertical slices)
app.include_router(url_router, prefix="/api/url", tags=["URL & Phishing Analysis"])
app.include_router(cert_router, prefix="/api/cert", tags=["TLS & Digital Trust"])
app.include_router(scam_router, prefix="/api/scam", tags=["AI Scam Analysis"])
app.include_router(security_router, prefix="/api/security", tags=["Website Security Audit"])
app.include_router(threat_router, prefix="/api/threats", tags=["Threat Correlation"])
app.include_router(web3_router, prefix="/api/web3", tags=["Web3 Threat Registry"])
app.include_router(web3_threat_router, prefix="/api/web3-threat", tags=["Web3 Threat & ML Graph Tracer"])
app.include_router(reports_router, prefix="/api/reports", tags=["Blockchain Report Integrity & Verification"])


@app.get("/", tags=["Root"])
async def root():
    return {
        "status": "online",
        "project": "Cyber Chakravyuh API Backend",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "frontend_url": "http://localhost:5173",
        "active_services": {
            "threat_intelligence": "/api/threats/dashboard",
            "report_integrity": "/api/reports/network",
            "web3_threat": "/api/web3-threat/health",
            "web3_registry": "/api/web3/network-status",
            "url_analysis": "/api/url/analyze",
            "scam_analysis": "/api/scam/analyze",
            "cert_analysis": "/api/cert/analyze",
            "security_audit": "/api/security/audit"
        }
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": "render" if settings.PORT != 8000 else "development"
    }
