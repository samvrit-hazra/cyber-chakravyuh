import hashlib
from datetime import datetime, timezone
from app.features.web3_registry.models import Web3SubmitResponse, Web3VerifyResponse
from app.core.config import settings


class Web3RegistryService:
    async def submit_report_hash(self, report_id: str) -> Web3SubmitResponse:
        # Generate off-chain SHA-256 fingerprint of the report
        raw_fingerprint = f"report:{report_id}:{datetime.now(timezone.utc).isoformat()}"
        report_hash = "0x" + hashlib.sha256(raw_fingerprint.encode()).hexdigest()

        # TODO: Send transaction to Sepolia Ethereum testnet via Web3.py
        return Web3SubmitResponse(
            report_hash=report_hash,
            tx_hash="0x_mock_tx_hash_ready_for_sepolia_contract_interaction",
            contract_address=settings.CONTRACT_ADDRESS or "0x_contract_pending_deployment",
            chain="sepolia",
            block_number=0,
            verified=True,
            created_at=datetime.now(timezone.utc)
        )

    async def verify_report_hash(self, report_hash: str) -> Web3VerifyResponse:
        # TODO: Query contract getter verifyReport(reportHash)
        return Web3VerifyResponse(
            report_hash=report_hash,
            exists_on_chain=True,
            submitted_at=datetime.now(timezone.utc),
            tx_hash="0x_mock_tx_hash",
            integrity_match=True
        )


web3_registry_service = Web3RegistryService()
