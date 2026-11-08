from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.features.web3_threat.models import (
    WalletAnalysisRequest,
    Web3ThreatAnalysisResponse,
    GraphTraceData,
    DemoWalletItem,
)
from app.features.web3_threat.service import web3_threat_service
from app.features.web3_threat.ml.model_loader import load_structuring_model, load_illicit_model

router = APIRouter()


@router.post("/analyze", response_model=Web3ThreatAnalysisResponse)
async def analyze_wallet(request: WalletAnalysisRequest):
    """
    Perform deep Web3 threat intelligence analysis on an Ethereum/EVM wallet.
    Extracts 9 behavioral features, executes XGBoost ML structuring classifier,
    evaluates AML heuristic rules, queries OSINT attribution, and builds an
    interactive multi-hop transaction network graph.
    """
    try:
        return await web3_threat_service.analyze_wallet(request)
    except ValueError as val_err:
        raise HTTPException(status_code=400, detail=str(val_err))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Web3 Threat Analysis Error: {str(exc)}")


@router.get("/trace/{address}", response_model=GraphTraceData)
async def trace_wallet_graph(
    address: str,
    depth: int = Query(2, ge=1, le=4, description="Graph traversal hop depth"),
):
    """
    Generate an interactive transaction graph for visualization with hop depth 1-4.
    """
    try:
        req = WalletAnalysisRequest(address=address, depth=depth)
        res = await web3_threat_service.analyze_wallet(req)
        return res.graph
    except ValueError as val_err:
        raise HTTPException(status_code=400, detail=str(val_err))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Graph Tracing Error: {str(exc)}")


@router.get("/demo-wallets", response_model=List[DemoWalletItem])
async def get_demo_wallets():
    """
    Retrieve curated real-world threat actors and test cases for one-click demo testing.
    """
    return await web3_threat_service.get_demo_wallets()


@router.get("/health")
async def web3_ml_health():
    """
    Verify XGBoost ML models load status and memory footprint.
    """
    structuring_model = load_structuring_model()
    illicit_model = load_illicit_model()
    return {
        "status": "healthy",
        "structuring_model_loaded": structuring_model is not None,
        "illicit_model_loaded": illicit_model is not None,
        "features_expected": 9,
    }
