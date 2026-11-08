from fastapi import APIRouter, Query
from typing import Optional, List
from app.features.threat_intel.models import (
    ThreatDashboardResponse,
    ThreatIndicator,
    ThreatCampaign,
    MitreTechniqueRecord,
    DeepScanRequest,
    DeepScanResponse,
    ThreatFeedStatus,
    ThreatCorrelateResponse
)
from app.features.threat_intel.service import threat_intel_service
from app.features.threat_intel.storage import threat_intel_storage

router = APIRouter()


@router.get("/dashboard", response_model=ThreatDashboardResponse)
async def get_threat_dashboard():
    """
    Returns live threat intelligence metrics aggregated directly from MongoDB indicators.
    """
    return await threat_intel_service.get_dashboard()


@router.get("/stream", response_model=List[ThreatIndicator])
async def get_threat_stream(
    limit: int = Query(50, ge=1, le=200),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    """
    Returns real adversary IOCs from synchronized threat feeds.
    """
    return await threat_intel_service.get_stream(limit=limit, category=category, search=search)


@router.get("/campaigns", response_model=List[ThreatCampaign])
async def get_threat_campaigns():
    """
    Returns evidence-backed threat campaign clusters grouped by malware family and infrastructure.
    """
    return await threat_intel_service.get_campaigns()


@router.get("/distribution")
async def get_threat_distribution():
    """
    Returns threat category distributions and defense ring allocations.
    """
    return await threat_intel_service.get_distribution()


@router.get("/mitre", response_model=List[MitreTechniqueRecord])
async def get_mitre_matrix():
    """
    Returns MITRE ATT&CK Enterprise techniques correlated with observed telemetry.
    """
    return await threat_intel_service.get_mitre_matrix()


@router.post("/deep-scan", response_model=DeepScanResponse)
async def deep_scan_ioc(request: DeepScanRequest):
    """
    Investigates an individual IOC against synchronized threat intelligence with SSRF protection.
    """
    return await threat_intel_service.deep_scan(request.target)


@router.get("/feeds/status", response_model=List[ThreatFeedStatus])
async def get_feed_status():
    """
    Returns synchronization health and counts for all configured threat intelligence feeds.
    """
    return await threat_intel_storage.get_all_feeds()


@router.post("/feeds/sync")
async def trigger_feed_sync():
    """
    Triggers an immediate background synchronization across OpenPhish, FeodoTracker, and ThreatFox.
    """
    return await threat_intel_service.sync_all_feeds()


@router.get("/correlate/{report_id}", response_model=ThreatCorrelateResponse)
async def correlate_threat_report(report_id: str):
    """
    Legacy correlation endpoint for existing integrations.
    """
    return await threat_intel_service.correlate_threats(report_id)
