from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class WalletAnalysisRequest(BaseModel):
    address: str = Field(..., description="Target Ethereum / EVM wallet address to analyze")
    chain: Optional[str] = Field("ethereum", description="Blockchain network (e.g., ethereum, polygon, arbitrum)")
    depth: Optional[int] = Field(2, ge=1, le=4, description="Transaction network graph traversal depth (hops 1-4)")


class FeatureItem(BaseModel):
    key: str
    name: str
    value: float
    benchmark: str
    description: str
    is_suspicious: bool


class AMLFlagItem(BaseModel):
    type: str
    title: str
    severity: str  # "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
    triggered: bool
    reason: Optional[str] = None


class AttributionSource(BaseModel):
    title: str
    snippet: str
    link: str
    domain: str


class AttributionInfo(BaseModel):
    is_identified: bool = False
    entity_name: Optional[str] = None
    category: str = "Unknown Wallet"
    tags: List[str] = []
    sources: List[AttributionSource] = []


class GraphNode(BaseModel):
    id: str
    address: str
    short_address: str
    classification: str
    risk_score: float
    risk_level: str
    is_flagged: bool
    is_root: bool = False
    balance_eth: float = 0.0
    tx_count: int = 0
    hop_distance: int = 0


class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    amount_eth: float
    tx_hash: str
    timestamp: str
    is_flagged: bool = False
    risk_level: str = "LOW"
    is_trace_path: bool = False


class GraphTraceData(BaseModel):
    root_address: str
    depth: int
    total_nodes: int
    total_edges: int
    total_volume_eth: float
    flagged_nodes_count: int
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    suspicious_paths: List[List[str]] = []


class Web3ThreatAnalysisResponse(BaseModel):
    address: str
    normalized_address: str
    chain: str = "ethereum"
    overall_risk_score: float  # 0.0 to 1.0
    risk_level: str  # "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SAFE"
    overall_flagged: bool
    ml_structuring_score: Optional[float] = None
    ml_features: List[FeatureItem] = []
    aml_flags: List[AMLFlagItem] = []
    attribution: AttributionInfo
    graph: GraphTraceData
    executive_summary: str
    recommended_actions: List[str] = []
    analyzed_at: str


class DemoWalletItem(BaseModel):
    address: str
    label: str
    category: str
    expected_risk: str
    description: str
