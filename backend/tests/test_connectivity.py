import os
import sys
from pathlib import Path

# Ensure backend root is in sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

import asyncio
import httpx
from app.main import app

async def run_checks():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        # 1. Health
        r = await client.get("/health")
        print(f"/health: {r.status_code} -> {r.json()}")
        assert r.status_code == 200

        # 2. Web3 Threat Health
        r = await client.get("/api/web3-threat/health")
        print(f"/api/web3-threat/health: {r.status_code} -> {r.json()}")
        assert r.status_code == 200

        # 3. Web3 Demo Wallets
        r = await client.get("/api/web3-threat/demo-wallets")
        resp_data = r.json()
        wallets = resp_data if isinstance(resp_data, list) else resp_data.get("demo_wallets", [])
        print(f"/api/web3-threat/demo-wallets: {r.status_code} -> count={len(wallets)}")
        assert r.status_code == 200

        # 4. Web3 Analyze
        r = await client.post("/api/web3-threat/analyze", json={"address": "0x71C8fb42377485c216A9d00634f590772DEcD9A3"})
        data = r.json()
        print(f"/api/web3-threat/analyze: {r.status_code} -> risk_level={data.get('risk_level')}, score={data.get('overall_risk_score')}, features={len(data.get('ml_features', []))}")
        assert r.status_code == 200

        # 5. Web3 Trace
        r = await client.get("/api/web3-threat/trace/0x71C8fb42377485c216A9d00634f590772DEcD9A3?max_depth=2")
        g = r.json().get("graph", {})
        print(f"/api/web3-threat/trace: {r.status_code} -> nodes={len(g.get('nodes', []))}, edges={len(g.get('edges', []))}")
        assert r.status_code == 200

        # 6. URL Analyze
        r = await client.post("/api/url/analyze", json={"url": "https://google.com"})
        print(f"/api/url/analyze: {r.status_code} -> status={r.json().get('status')}")
        assert r.status_code == 200

        # 7. Scam Analyze
        r = await client.post("/api/scam/analyze", json={"message": "Urgent: Click here to verify your account or be suspended in 24 hours!"})
        scam_data = r.json()
        print(f"/api/scam/analyze: {r.status_code} -> risk={scam_data.get('risk_level')}, score={scam_data.get('risk_score')}")
        assert r.status_code == 200

        # 8. Cert Analyze
        r = await client.post("/api/cert/analyze", json={"url": "https://google.com"})
        print(f"/api/cert/analyze: {r.status_code} -> status={r.json().get('status')}")
        assert r.status_code == 200

        # 9. Security Audit
        r = await client.post("/api/security/audit", json={"url": "https://google.com"})
        print(f"/api/security/audit: {r.status_code} -> status={r.json().get('status')}")
        assert r.status_code == 200

    print("ALL 9 CORE ENDPOINTS RESPONDED WITH HTTP 200 OK!")

if __name__ == "__main__":
    asyncio.run(run_checks())
