export interface MLFeature {
  key: string;
  name: string;
  value: number;
  benchmark: string;
  description: string;
  is_suspicious: boolean;
}

export interface AMLFlag {
  type: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  triggered: boolean;
  reason: string;
}

export interface AttributionSource {
  title: string;
  snippet: string;
  link: string;
  domain: string;
}

export interface AttributionInfo {
  is_identified: boolean;
  entity_name: string | null;
  category: string;
  tags: string[];
  sources: AttributionSource[];
}

export interface GraphNode {
  id: string;
  address: string;
  short_address: string;
  classification: string;
  risk_score: number;
  risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';
  is_flagged: boolean;
  is_root: boolean;
  balance_eth: number;
  tx_count: number;
  hop_distance: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  amount_eth: number;
  tx_hash: string;
  timestamp: string;
  is_flagged: boolean;
  risk_level: string;
  is_trace_path: boolean;
}

export interface GraphTraceData {
  root_address: string;
  depth: number;
  total_nodes: number;
  total_edges: number;
  total_volume_eth: number;
  flagged_nodes_count: number;
  nodes: GraphNode[];
  edges: GraphEdge[];
  suspicious_paths: string[][];
}

export interface Web3ThreatAnalysisResult {
  address: string;
  normalized_address: string;
  chain: string;
  overall_risk_score: number; // 0.0 to 1.0
  risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';
  overall_flagged: boolean;
  ml_structuring_score: number | null;
  ml_features: MLFeature[];
  aml_flags: AMLFlag[];
  attribution: AttributionInfo;
  graph: GraphTraceData;
  executive_summary: string;
  recommended_actions: string[];
  analyzed_at: string;
}

export interface DemoWallet {
  address: string;
  label: string;
  category: string;
  expected_risk: string;
  description: string;
}
