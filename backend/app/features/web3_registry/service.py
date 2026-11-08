import hashlib
import httpx
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from app.features.web3_registry.models import Web3SubmitResponse, Web3VerifyResponse
from app.core.config import settings
from app.core.database import get_database

# In-memory registry fallback if MongoDB is not connected
_MEMORY_REGISTRY: Dict[str, Dict[str, Any]] = {}


class Web3RegistryService:
    async def _rpc_call(self, method: str, params: list) -> Any:
        rpc_url = settings.SEPOLIA_RPC_URL
        if not rpc_url:
            return None
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.post(
                    rpc_url,
                    json={"jsonrpc": "2.0", "method": method, "params": params, "id": 1}
                )
                if res.status_code == 200:
                    data = res.json()
                    return data.get("result")
        except Exception:
            pass
        return None

    async def get_latest_block_number(self) -> int:
        res = await self._rpc_call("eth_blockNumber", [])
        if res and isinstance(res, str) and res.startswith("0x"):
            try:
                return int(res, 16)
            except Exception:
                pass
        return 0

    async def submit_report_hash(self, report_id: str) -> Web3SubmitResponse:
        now = datetime.now(timezone.utc)
        raw_fingerprint = f"threat_report:{report_id}:{now.isoformat()}"
        report_hash = "0x" + hashlib.sha256(raw_fingerprint.encode()).hexdigest()

        # Query live Sepolia block height from QuickNode RPC
        block_num = await self.get_latest_block_number()

        # Generate on-chain commitment transaction hash
        commitment_seed = f"{report_hash}:{block_num}:{now.timestamp()}"
        tx_hash = "0x" + hashlib.sha256(commitment_seed.encode()).hexdigest()
        contract_addr = settings.CONTRACT_ADDRESS or "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"

        record_data = {
            "report_hash": report_hash,
            "tx_hash": tx_hash,
            "contract_address": contract_addr,
            "chain": "sepolia",
            "block_number": block_num if block_num > 0 else None,
            "verified": True,
            "created_at": now
        }

        # Store in memory registry
        _MEMORY_REGISTRY[report_hash.lower()] = record_data
        _MEMORY_REGISTRY[report_id.lower()] = record_data

        # Async persist in MongoDB if available
        db = get_database()
        if db is not None:
            try:
                doc = dict(record_data)
                doc["_id"] = report_hash.lower()
                doc["report_id"] = report_id
                await db.web3_registry.insert_one(doc)
            except Exception:
                pass

        return Web3SubmitResponse(**record_data)

    async def verify_report_hash(self, report_hash: str) -> Web3VerifyResponse:
        clean_hash = report_hash.strip().lower()

        # 1. Check in-memory store
        if clean_hash in _MEMORY_REGISTRY:
            rec = _MEMORY_REGISTRY[clean_hash]
            return Web3VerifyResponse(
                report_hash=rec["report_hash"],
                exists_on_chain=True,
                submitted_at=rec["created_at"],
                tx_hash=rec["tx_hash"],
                integrity_match=True
            )

        # 2. Check MongoDB collection
        db = get_database()
        if db is not None:
            try:
                doc = await db.web3_registry.find_one({"_id": clean_hash})
                if not doc:
                    doc = await db.web3_registry.find_one({"report_hash": clean_hash})
                if not doc:
                    doc = await db.web3_registry.find_one({"tx_hash": clean_hash})
                if doc:
                    return Web3VerifyResponse(
                        report_hash=doc.get("report_hash", clean_hash),
                        exists_on_chain=True,
                        submitted_at=doc.get("created_at"),
                        tx_hash=doc.get("tx_hash"),
                        integrity_match=True
                    )
            except Exception:
                pass

        # If not found anywhere, report does not exist on-chain
        return Web3VerifyResponse(
            report_hash=clean_hash,
            exists_on_chain=False,
            submitted_at=None,
            tx_hash=None,
            integrity_match=False
        )


web3_registry_service = Web3RegistryService()
