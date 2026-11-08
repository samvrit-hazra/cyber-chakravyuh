import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.features.web3_threat.ml.model_loader import load_structuring_model, predict_structuring_risk


def test_ml_model_loads():
    model = load_structuring_model()
    assert model is not None, "XGBoost structuring classifier model should be loaded"
    
    # 9-feature dummy vector
    dummy_features = [12.0, 5.5, 10.2, 0.45, 120.0, 50.0, 0.85, 0.20, 0.65]
    score = predict_structuring_risk(dummy_features)
    assert score is not None
    assert 0.0 <= score <= 1.0


@pytest.mark.asyncio
async def test_web3_threat_health():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/web3-threat/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["structuring_model_loaded"] is True
        assert data["features_expected"] == 9


@pytest.mark.asyncio
async def test_demo_wallets_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/web3-threat/demo-wallets")
        assert response.status_code == 200
        wallets = response.json()
        assert len(wallets) >= 5
        addresses = [w["address"] for w in wallets]
        assert "0x098b716b8aaf21512996dc57eb0615e2383e2f96" in addresses  # Ronin Lazarus


@pytest.mark.asyncio
async def test_analyze_lazarus_wallet():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "address": "0x098b716b8aaf21512996dc57eb0615e2383e2f96",
            "chain": "ethereum",
            "depth": 2
        }
        response = await client.post("/api/web3-threat/analyze", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["overall_flagged"] is True
        assert data["risk_level"] == "CRITICAL"
        assert data["attribution"]["is_identified"] is True
        assert "lazarus" in [t.lower() for t in data["attribution"]["tags"]]
        assert len(data["graph"]["nodes"]) >= 2
        assert len(data["ml_features"]) == 9


@pytest.mark.asyncio
async def test_analyze_clean_vitalik_wallet():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "address": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
            "chain": "ethereum",
            "depth": 2
        }
        response = await client.post("/api/web3-threat/analyze", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["risk_level"] in ["SAFE", "LOW"]
        assert data["overall_flagged"] is False
