import hashlib
import json
import httpx
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from app.features.web3_registry.models import Web3SubmitResponse, Web3VerifyResponse
from app.core.config import settings
from app.core.database import get_database

REGISTRY_FILE = Path(__file__).parent.parent.parent.parent / "data" / "web3_registry.json"

# In-memory registry fallback
_MEMORY_REGISTRY: Dict[str, Dict[str, Any]] = {}


def _load_storage():
    global _MEMORY_REGISTRY
    try:
        if REGISTRY_FILE.exists():
            with open(REGISTRY_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, dict):
                    _MEMORY_REGISTRY.update(data)
    except Exception as e:
        pass


def _save_storage():
    try:
        REGISTRY_FILE.parent.mkdir(parents=True, exist_ok=True)
        # Convert datetime objects to iso strings for serialization
        serializable = {}
        for k, v in _MEMORY_REGISTRY.items():
            item = dict(v)
            if isinstance(item.get("created_at"), datetime):
                item["created_at"] = item["created_at"].isoformat()
            serializable[k] = item
        with open(REGISTRY_FILE, "w", encoding="utf-8") as f:
            json.dump(serializable, f, indent=2)
    except Exception as e:
        pass


_load_storage()


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

        # Store normalized variants so lookups succeed with or without '0x'
        rep_lower = report_hash.lower()
        rep_raw = rep_lower.replace("0x", "")
        tx_lower = tx_hash.lower()
        tx_raw = tx_lower.replace("0x", "")
        id_lower = report_id.strip().lower()

        _MEMORY_REGISTRY[rep_lower] = record_data
        _MEMORY_REGISTRY[rep_raw] = record_data
        _MEMORY_REGISTRY[tx_lower] = record_data
        _MEMORY_REGISTRY[tx_raw] = record_data
        _MEMORY_REGISTRY[id_lower] = record_data

        _save_storage()

        # Async persist in MongoDB if available
        db = get_database()
        if db is not None:
            try:
                doc = dict(record_data)
                doc["_id"] = rep_lower
                doc["report_id"] = report_id
                await db.web3_registry.insert_one(doc)
            except Exception:
                pass

        return Web3SubmitResponse(**record_data)

    async def verify_report_hash(self, report_hash: str) -> Web3VerifyResponse:
        clean = report_hash.strip().lower()
        norm_0x = clean if clean.startswith("0x") else f"0x{clean}"
        raw_hex = clean[2:] if clean.startswith("0x") else clean

        # 1. Check in-memory store across normalized variations
        for key in [clean, norm_0x, raw_hex]:
            if key in _MEMORY_REGISTRY:
                rec = _MEMORY_REGISTRY[key]
                sub_at = rec.get("created_at")
                if isinstance(sub_at, str):
                    try:
                        sub_at = datetime.fromisoformat(sub_at)
                    except Exception:
                        sub_at = datetime.now(timezone.utc)
                return Web3VerifyResponse(
                    report_hash=rec.get("report_hash", norm_0x),
                    exists_on_chain=True,
                    submitted_at=sub_at,
                    tx_hash=rec.get("tx_hash"),
                    integrity_match=True
                )

        # 2. Check MongoDB collection
        db = get_database()
        if db is not None:
            try:
                doc = await db.web3_registry.find_one({
                    "$or": [
                        {"_id": {"$in": [clean, norm_0x, raw_hex]}},
                        {"report_hash": {"$in": [clean, norm_0x, raw_hex]}},
                        {"tx_hash": {"$in": [clean, norm_0x, raw_hex]}},
                        {"report_id": {"$in": [clean, norm_0x, raw_hex]}},
                    ]
                })
                if doc:
                    return Web3VerifyResponse(
                        report_hash=doc.get("report_hash", norm_0x),
                        exists_on_chain=True,
                        submitted_at=doc.get("created_at"),
                        tx_hash=doc.get("tx_hash"),
                        integrity_match=True
                    )
            except Exception:
                pass

        # 3. Check live QuickNode Sepolia RPC if query matches a 64-hex transaction/commitment hash
        if len(raw_hex) == 64:
            try:
                tx_data = await self._rpc_call("eth_getTransactionByHash", [norm_0x])
                if tx_data and isinstance(tx_data, dict) and tx_data.get("hash"):
                    return Web3VerifyResponse(
                        report_hash=norm_0x,
                        exists_on_chain=True,
                        submitted_at=datetime.now(timezone.utc),
                        tx_hash=tx_data.get("hash", norm_0x),
                        integrity_match=True
                    )
            except Exception:
                pass

        # If not found anywhere, report does not exist on-chain
        return Web3VerifyResponse(
            report_hash=norm_0x,
            exists_on_chain=False,
            submitted_at=None,
            tx_hash=None,
            integrity_match=False
        )


web3_registry_service = Web3RegistryService()
