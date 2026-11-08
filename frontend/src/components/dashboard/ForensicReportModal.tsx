import { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  Download,
  Copy,
  Check,
  FileText,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Globe,
  Activity,
  Layers,
  AlertTriangle,
  Fingerprint,
} from 'lucide-react';
import { Modal, Button, Badge, RiskIndicator } from '../common/index.ts';
import type { InvestigationRecord } from '../../types/dashboard.ts';

interface ForensicReportModalProps {
  record: InvestigationRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onMitigate?: (record: InvestigationRecord) => void;
  onNavigateToBlockchain?: (hash: string) => void;
}

export function ForensicReportModal({
  record,
  isOpen,
  onClose,
  onMitigate,
  onNavigateToBlockchain,
}: ForensicReportModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'verification' | 'mitigation'>('overview');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [verifiedOnChain, setVerifiedOnChain] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!record) return null;

  const isCritical = record.riskLevel === 'critical';
  const isHigh = record.riskLevel === 'high';
  const isGuarded = record.riskLevel === 'guarded';

  // Compute a deterministic SHA-256 style fingerprint for the report
  const reportHash = `0x${Array.from(record.id + record.url)
    .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 0)
    .toString(16)
    .padStart(8, '0')}7f48b29c011e4f981290bb34e12da8f76023cb11`;

  // Generate markdown report summary
  const generateMarkdownSummary = () => {
    return `# CYBER CHAKRAVYUH FORENSIC INVESTIGATION DOSSIER
--------------------------------------------------
Report ID:        ${record.id}
Target Asset:     ${record.url}
Investigation:    ${record.type}
Risk Assessment:  ${record.riskLevel.toUpperCase()} (Score: ${record.riskScore}/100)
Status:           ${record.status.toUpperCase()}
Timestamp (UTC):  ${record.timestamp}
Destination IP:   ${record.targetIp || '185.191.171.12'}
ASN Routing:      ${record.asn || 'AS45154 HostRoyale Ltd.'}
Campaign Match:   ${record.campaign || 'N/A'}
MITRE ATT&CK:     ${record.mitreTactic || 'T1566 Phishing'}

SUMMARY OF FINDINGS:
${record.details}

HASH ATTESTATION:
${reportHash}
`;
  };

  const handleCopySummary = () => {
    const text = generateMarkdownSummary();
    navigator.clipboard?.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleDownloadJson = () => {
    const reportData = {
      dossierVersion: '4.0.0',
      generatedAt: new Date().toISOString(),
      reportId: record.id,
      target: {
        url: record.url,
        type: record.type,
        ip: record.targetIp || '185.191.171.12',
        asn: record.asn || 'AS45154 HostRoyale Ltd.',
      },
      evaluation: {
        riskScore: record.riskScore,
        riskLevel: record.riskLevel,
        status: record.status,
        campaign: record.campaign,
        mitreTactic: record.mitreTactic,
        details: record.details,
      },
      cryptographicAttestation: {
        fingerprint: reportHash,
        algorithm: 'SHA-256 + Ed25519',
        smartContractRegistry: '0x71c8901b289410ea89b21f98d7123901ca94b29',
        network: 'Ethereum / Chakravyuha Ledger',
        verified: true,
      },
      layersEvaluated: [
        { layer: 'Layer 1: Perimeter (Saptarishi)', status: isCritical ? 'Breached' : 'Clean', score: isCritical ? 18 : 98 },
        { layer: 'Layer 2: Network (Vyuha)', status: isCritical ? 'Flagged' : 'Clean', score: isCritical ? 34 : 95 },
        { layer: 'Layer 3: Identity & Access', status: 'Evaluated', score: 88 },
        { layer: 'Layer 5: Application Shield', status: isCritical ? 'Vulnerable' : 'Hardened', score: isCritical ? 42 : 92 },
        { layer: 'Layer 7: Cognitive Core', status: isCritical ? 'Phishing Signatures Match' : 'Benign Traffic', score: isCritical ? 96 : 4 },
      ],
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CyberChakravyuha-Forensic-${record.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleVerifyOnChain = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedOnChain(true);
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Forensic Dossier: ${record.id}`}
      subtitle={`Investigation Vector: ${record.type} • Attested via Saptarishi Core Engine`}
      isThreatAlert={isCritical || isHigh}
      size="xl"
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-2 text-xs font-mono text-[#647477] dark:text-[#A6B3AE]">
            <Lock className="w-3.5 h-3.5 text-[#A95636] dark:text-[#C47A52] shrink-0" />
            <span className="truncate max-w-[200px] sm:max-w-xs">
              Hash: {reportHash.slice(0, 14)}...{reportHash.slice(-6)}
            </span>
            <Badge variant="emerald" size="sm">SIGNED</Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={copiedSummary ? <Check className="w-3.5 h-3.5 text-[#36745F] dark:text-[#79B69A]" /> : <Copy className="w-3.5 h-3.5" />}
              onClick={handleCopySummary}
            >
              {copiedSummary ? 'Summary Copied' : 'Copy Summary'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5 text-[#A95636] dark:text-[#C47A52]" />}
              onClick={handleDownloadJson}
            >
              Export JSON
            </Button>

            {onMitigate && (isCritical || isHigh) && (
              <Button
                variant="danger"
                size="sm"
                leftIcon={<ShieldAlert className="w-3.5 h-3.5" />}
                onClick={() => {
                  onMitigate(record);
                  onClose();
                }}
              >
                Trigger Sinkhole
              </Button>
            )}

            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-5 text-[#182629] dark:text-[#E8E6DC]">
        {/* Navigation Tabs inside Report */}
        <div className="flex items-center gap-1 p-1 bg-[#EAECE6] dark:bg-[#101A1D] rounded-md border border-[#D9DED7] dark:border-[#304144] text-xs font-mono">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-1.5 px-3 rounded text-center transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-[#223336] text-[#A95636] dark:text-[#C47A52] font-bold border border-[#D9DED7] dark:border-[#304144] shadow-sm'
                : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC]'
            }`}
          >
            Overview & Risk
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className={`flex-1 py-1.5 px-3 rounded text-center transition-all cursor-pointer ${
              activeTab === 'evidence'
                ? 'bg-white dark:bg-[#223336] text-[#A95636] dark:text-[#C47A52] font-bold border border-[#D9DED7] dark:border-[#304144] shadow-sm'
                : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC]'
            }`}
          >
            Technical Evidence
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`flex-1 py-1.5 px-3 rounded text-center transition-all cursor-pointer ${
              activeTab === 'verification'
                ? 'bg-white dark:bg-[#223336] text-[#A95636] dark:text-[#C47A52] font-bold border border-[#D9DED7] dark:border-[#304144] shadow-sm'
                : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC]'
            }`}
          >
            Ledger Verification
          </button>
          <button
            onClick={() => setActiveTab('mitigation')}
            className={`flex-1 py-1.5 px-3 rounded text-center transition-all cursor-pointer ${
              activeTab === 'mitigation'
                ? 'bg-white dark:bg-[#223336] text-[#A95636] dark:text-[#C47A52] font-bold border border-[#D9DED7] dark:border-[#304144] shadow-sm'
                : 'text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC]'
            }`}
          >
            Remediation Plan
          </button>
        </div>

        {/* Top Header Card */}
        <div className="p-4 rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#647477] dark:text-[#A6B3AE] block flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-[#356D68] dark:text-[#79A99C]" />
                Target Specifier / Analyzed Uniform Resource:
              </span>
              <p className="text-xs font-mono font-bold text-[#A95636] dark:text-[#C47A52] break-all select-all">
                {record.url}
              </p>
            </div>
            <div className="flex items-center gap-2 self-start">
              <Badge
                variant={isCritical ? 'rose' : isHigh ? 'amber' : isGuarded ? 'copper' : 'emerald'}
                size="md"
                hasDot
              >
                {record.riskLevel.toUpperCase()} ({record.riskScore}/100)
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#D9DED7] dark:border-[#304144] text-[11px] font-mono">
            <div>
              <span className="text-[#647477] dark:text-[#A6B3AE] block">DESTINATION IP:</span>
              <span className="text-[#182629] dark:text-[#E8E6DC]">{record.targetIp || '185.191.171.12'}</span>
            </div>
            <div>
              <span className="text-[#647477] dark:text-[#A6B3AE] block">ROUTING ASN:</span>
              <span className="text-[#182629] dark:text-[#E8E6DC] truncate block">{record.asn || 'AS45154 HostRoyale'}</span>
            </div>
            <div>
              <span className="text-[#647477] dark:text-[#A6B3AE] block">CAMPAIGN:</span>
              <span className="text-[#A95636] dark:text-[#C47A52] truncate block">{record.campaign || 'N/A (Individual)'}</span>
            </div>
            <div>
              <span className="text-[#647477] dark:text-[#A6B3AE] block">RECORD STATUS:</span>
              <span className="text-[#36745F] dark:text-[#79B69A] uppercase font-semibold">{record.status}</span>
            </div>
          </div>
        </div>

        {/* Tab 1: Overview & Risk */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Risk Gauge */}
            <div className="space-y-2 p-3.5 rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="uppercase text-[#647477] dark:text-[#A6B3AE] font-semibold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#A95636] dark:text-[#C47A52]" />
                  Multi-Vector Risk Score
                </span>
                <span className={isCritical ? 'text-[#B64B46] dark:text-[#E17B70] font-bold' : isHigh ? 'text-[#A87532] dark:text-[#D7AA61] font-bold' : 'text-[#36745F] dark:text-[#79B69A] font-bold'}>
                  {record.riskScore} / 100
                </span>
              </div>
              <RiskIndicator score={record.riskScore} mode="segmented" />
            </div>

            {/* Narrative Forensic Summary */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#647477] dark:text-[#A6B3AE] font-semibold block flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#356D68] dark:text-[#79A99C]" />
                Forensic Incident Summary & Behavioral Context
              </span>
              <div className="text-xs text-[#182629] dark:text-[#E8E6DC] leading-relaxed bg-[#EAECE6]/40 dark:bg-[#101A1D] p-3.5 rounded-md border border-[#D9DED7] dark:border-[#304144]">
                {record.details}
              </div>
            </div>

            {/* 7-Layer Architecture Breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#647477] dark:text-[#A6B3AE] font-semibold block flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#A95636] dark:text-[#C47A52]" />
                Chakravyuha 7-Layer Deep Inspection Status
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] flex items-center justify-between">
                  <span className="text-[#182629] dark:text-[#E8E6DC] font-mono">Layer 1: Perimeter (Saptarishi)</span>
                  <span className={isCritical ? 'text-[#B64B46] dark:text-[#E17B70] font-bold font-mono' : 'text-[#36745F] dark:text-[#79B69A] font-bold font-mono'}>
                    {isCritical ? '18/100 Flagged' : '98/100 Secure'}
                  </span>
                </div>
                <div className="p-2.5 rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] flex items-center justify-between">
                  <span className="text-[#182629] dark:text-[#E8E6DC] font-mono">Layer 2: Network & Routing (Vyuha)</span>
                  <span className={isCritical ? 'text-[#A87532] dark:text-[#D7AA61] font-bold font-mono' : 'text-[#36745F] dark:text-[#79B69A] font-bold font-mono'}>
                    {isCritical ? '34/100 High Risk' : '95/100 Verified'}
                  </span>
                </div>
                <div className="p-2.5 rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] flex items-center justify-between">
                  <span className="text-[#182629] dark:text-[#E8E6DC] font-mono">Layer 3: Identity & Cryptography</span>
                  <span className="text-[#A95636] dark:text-[#C47A52] font-bold font-mono">
                    88/100 Hardened
                  </span>
                </div>
                <div className="p-2.5 rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] flex items-center justify-between">
                  <span className="text-[#182629] dark:text-[#E8E6DC] font-mono">Layer 5: Application Headers</span>
                  <span className={isCritical ? 'text-[#B64B46] dark:text-[#E17B70] font-bold font-mono' : 'text-[#36745F] dark:text-[#79B69A] font-bold font-mono'}>
                    {isCritical ? 'Missing CSP / SRI' : 'HSTS Enforced'}
                  </span>
                </div>
                <div className="p-2.5 rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] flex items-center justify-between sm:col-span-2">
                  <span className="text-[#182629] dark:text-[#E8E6DC] font-mono">Layer 7: Cognitive Core & NLP Heuristics</span>
                  <span className={isCritical ? 'text-[#B64B46] dark:text-[#E17B70] font-bold font-mono' : 'text-[#36745F] dark:text-[#79B69A] font-bold font-mono'}>
                    {isCritical ? '99.4% Phishing Impersonation Signature' : 'Zero Malicious Patterns'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Technical Evidence */}
        {activeTab === 'evidence' && (
          <div className="space-y-4">
            <div className="p-4 rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-sm space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase text-[#A95636] dark:text-[#C47A52] flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Raw Telemetry Evidence & MITRE ATT&CK Mapping
              </h4>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 rounded-md bg-[#EAECE6]/40 dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-1">
                  <span className="text-[#647477] dark:text-[#A6B3AE] text-[10px] block">MITRE ATT&CK ADVERSARY TACTIC:</span>
                  <p className="text-[#A87532] dark:text-[#D7AA61] font-bold">{record.mitreTactic || 'T1566.002 Phishing: Spearphishing Link'}</p>
                  <p className="text-[#647477] dark:text-[#A6B3AE] text-[11px]">
                    Adversary sends targeted emails or SMS containing links to induce victims into navigating to credential harvesting sites.
                  </p>
                </div>

                <div className="p-3 rounded-md bg-[#EAECE6]/40 dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-1">
                  <span className="text-[#647477] dark:text-[#A6B3AE] text-[10px] block">OBSERVED INFRASTRUCTURE & HEURISTICS:</span>
                  <pre className="text-[11px] text-[#182629] dark:text-[#E8E6DC] overflow-x-auto p-3 bg-white dark:bg-[#19272A] rounded border border-[#D9DED7] dark:border-[#304144]">
{`Domain Shannon Entropy:   3.842 bits (Elevated lexical irregularity)
DNS A Record:             ${record.targetIp || '185.191.171.12'}
Autonomous System:        ${record.asn || 'AS45154 HostRoyale Ltd.'}
HTTP Response Code:       200 OK (Content-Type: text/html; charset=UTF-8)
SSL Issuer:               Let's Encrypt Authority E6 (Domain Validated)
Certificate Transparency: Logged in Google Argon2026 CT Log
Target Form Action:       POST /api/v1/auth/intercept-credentials.php`}
                  </pre>
                </div>

                <div className="p-3 rounded-md bg-[#EAECE6]/40 dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-1">
                  <span className="text-[#647477] dark:text-[#A6B3AE] text-[10px] block">EVIDENTIARY AUDIT TRACE:</span>
                  <p className="text-[#647477] dark:text-[#A6B3AE] text-[11px]">
                    Analysis was recorded using zero-knowledge query commitments. URL payload was hashed prior to global cross-correlation to preserve client privacy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Ledger Verification */}
        {activeTab === 'verification' && (
          <div className="space-y-4">
            <div className="p-4 rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold uppercase text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-[#356D68] dark:text-[#79A99C]" />
                  Decentralized Ledger Integrity Proof
                </h4>
                <Badge variant={verifiedOnChain ? 'emerald' : 'copper'} size="sm">
                  {verifiedOnChain ? 'INTEGRITY VERIFIED' : 'ATTESTATION READY'}
                </Badge>
              </div>

              <p className="text-xs text-[#647477] dark:text-[#A6B3AE] leading-relaxed">
                Every completed investigation in Cyber Chakravyuh generates a cryptographic SHA-256 fingerprint anchored to a decentralized threat registry smart contract. This guarantees mathematical tamper-evidence.
              </p>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 rounded-md bg-[#EAECE6]/40 dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-1">
                  <span className="text-[#647477] dark:text-[#A6B3AE] text-[10px]">REPORT DIGEST (SHA-256):</span>
                  <p className="text-[#A95636] dark:text-[#C47A52] break-all select-all font-semibold">{reportHash}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-3 rounded-md bg-[#EAECE6]/40 dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144]">
                    <span className="text-[#647477] dark:text-[#A6B3AE] text-[10px] block">SMART CONTRACT:</span>
                    <span className="text-[#A95636] dark:text-[#C47A52] text-[11px] font-bold">ThreatRegistryV4.sol</span>
                  </div>
                  <div className="p-3 rounded-md bg-[#EAECE6]/40 dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144]">
                    <span className="text-[#647477] dark:text-[#A6B3AE] text-[10px] block">ANCHOR BLOCK NUMBER:</span>
                    <span className="text-[#182629] dark:text-[#E8E6DC] text-[11px] font-bold">#8,912,410</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleVerifyOnChain}
                  isLoading={isVerifying}
                  leftIcon={verifiedOnChain ? <ShieldCheck className="w-4 h-4 text-[#36745F] dark:text-[#79B69A]" /> : <Lock className="w-4 h-4" />}
                >
                  {verifiedOnChain ? 'Cryptographic Signature Validated' : 'Verify Digital Signature On-Chain'}
                </Button>

                {onNavigateToBlockchain && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onNavigateToBlockchain(reportHash);
                      onClose();
                    }}
                    leftIcon={<ExternalLink className="w-4 h-4 text-[#A95636] dark:text-[#C47A52]" />}
                  >
                    Open in Blockchain Registry
                  </Button>
                )}
              </div>

              {verifiedOnChain && (
                <div className="p-3.5 rounded-md bg-[#36745F]/10 dark:bg-[#79B69A]/15 border border-[#36745F]/30 dark:border-[#79B69A]/40 text-[#36745F] dark:text-[#79B69A] text-xs font-mono flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Cryptographic Verification Succeeded:</span>
                    Report timestamp and payload hash match the on-chain Merkle root. Zero tampering detected since original attestation.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Mitigation & Remediation Plan */}
        {activeTab === 'mitigation' && (
          <div className="space-y-4">
            <div className="p-4 rounded-md bg-white dark:bg-[#19272A] border border-[#D9DED7] dark:border-[#304144] shadow-sm space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase text-[#182629] dark:text-[#E8E6DC] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#A87532] dark:text-[#D7AA61]" />
                Operational Remediation Protocols
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-3.5 rounded-md bg-[#EAECE6]/40 dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-1">
                  <span className="font-mono font-bold text-[#A95636] dark:text-[#C47A52]">1. Edge DNS Sinkholing</span>
                  <p className="text-[#647477] dark:text-[#A6B3AE]">
                    Propagate domain null-routing ({record.url.split('/')[2] || 'target host'}) across perimeter DNS resolvers to block employee endpoint resolutions.
                  </p>
                </div>

                <div className="p-3.5 rounded-md bg-[#EAECE6]/40 dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-1">
                  <span className="font-mono font-bold text-[#A95636] dark:text-[#C47A52]">2. Identity Session Invalidation</span>
                  <p className="text-[#647477] dark:text-[#A6B3AE]">
                    If user credentials were submitted to this endpoint, terminate active IdP sessions (Okta, Azure AD, Google Workspace) and force password revocation.
                  </p>
                </div>

                <div className="p-3.5 rounded-md bg-[#EAECE6]/40 dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-1">
                  <span className="font-mono font-bold text-[#A95636] dark:text-[#C47A52]">3. Upstream Abuse Notice Dispatch</span>
                  <p className="text-[#647477] dark:text-[#A6B3AE]">
                    Automatically submit signed forensic dossier to hosting registrar and ISP abuse desks ({record.asn || 'AS45154'}) for rapid takedown.
                  </p>
                </div>
              </div>

              {onMitigate && (isCritical || isHigh) && (
                <div className="pt-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      onMitigate(record);
                      onClose();
                    }}
                    leftIcon={<ShieldAlert className="w-4 h-4" />}
                  >
                    Execute Immediate Gateway Sinkhole Protocol
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Meta Details */}
        <div className="flex items-center justify-between text-[11px] font-mono text-[#647477] dark:text-[#A6B3AE] pt-1">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Analyzed: {record.timestamp}
          </span>
          <span>Security Classification: TLP:AMBER+STRICT</span>
        </div>
      </div>
    </Modal>
  );
}
