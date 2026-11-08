import { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  AlertTriangle,
  Lock,
  Layers,
  Zap,
  Sliders,
  Radio,
  Eye,
  ArrowLeft,
} from 'lucide-react';
import {
  Button,
  Input,
  Textarea,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Modal,
  Sidebar,
  Navbar,
  Badge,
  Dropdown,
  Tabs,
  RadialProgress,
  RiskIndicator,
  AlertBanner,
  DataTable,
  EmptyState,
  CardSkeleton,
  TableSkeleton,
  LoadingState,
  NetworkBackground,
} from '../components/common/index.ts';
import { colors } from '../styles/tokens.ts';
import type { ThreatAlert } from '../types/threats.ts';

// Empty Initial Threats (No synthetic data)
const initialThreats: ThreatAlert[] = [];

interface DesignSystemShowcaseProps {
  onBackToLanding: () => void;
}

export function DesignSystemShowcase({ onBackToLanding }: DesignSystemShowcaseProps) {
  const [activeNav, setActiveNav] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Threat score & simulator state
  const [simulatedScore, setSimulatedScore] = useState(68);
  const [threats, setThreats] = useState<ThreatAlert[]>(initialThreats);
  const [selectedThreatIds, setSelectedThreatIds] = useState<string[]>([]);
  const [activeModalThreat] = useState<ThreatAlert | null>(null);
  const [isThreatModalOpen, setIsThreatModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // Interactive controls state
  const [activeTab, setActiveTab] = useState('buttons');
  const [demoInput, setDemoInput] = useState('');
  const [demoPassword, setDemoPassword] = useState('4a9f#c82_token');
  const [showDemoPassword, setShowDemoPassword] = useState(false);
  const [demoTextarea, setDemoTextarea] = useState('// Monospace security notes\nCVE-2026-4419 under Saptarishi perimeter isolation.');
  const [selectedDropdownItem, setSelectedDropdownItem] = useState('saptarishi');
  const [btnLoading, setBtnLoading] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [showEmptyDemo, setShowEmptyDemo] = useState(false);

  const currentThreatLevel =
    simulatedScore >= 76
      ? 'CRITICAL'
      : simulatedScore >= 51
      ? 'HIGH'
      : simulatedScore >= 26
      ? 'ELEVATED'
      : 'LOW';

  const copyToClipboard = (hex: string) => {
    navigator.clipboard?.writeText(hex);
  };

  const handleSimulateAttack = () => {
    setBtnLoading(true);
    setTimeout(() => {
      setSimulatedScore((prev) => Math.min(100, prev + 15));
      const newThreat: ThreatAlert = {
        id: `THR-${Math.floor(8900 + Math.random() * 99)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        title: 'Cognitive Core Invariant Violation',
        description: 'AI Trust verification agent flagged an unconfirmed inference prompt override.',
        severity: 'critical',
        layer: 'Cognitive Core',
        sourceIp: '185.191.171.12',
        targetAsset: 'brain-agent-v2',
        status: 'investigating',
        riskScore: 91,
      };
      setThreats((prev) => [newThreat, ...prev]);
      setBtnLoading(false);
    }, 600);
  };

  const handleResolveAlerts = () => {
    setSimulatedScore(18);
    setThreats((prev) =>
      prev.map((t) => ({ ...t, status: 'mitigated' }))
    );
  };

  return (
    <div className="min-h-screen bg-[#F3F1E9] dark:bg-[#101A1D] text-slate-100 flex flex-col relative selection:bg-cyan-500/30 selection:text-cyan-200">
      <NetworkBackground opacity={0.4} nodeCount={40} />

      <Navbar
        unreadAlertCount={threats.filter((t) => t.status === 'active' || t.status === 'investigating').length}
        threatLevel={currentThreatLevel}
        onToggleMobileMenu={() => setIsMobileNavOpen(!isMobileNavOpen)}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
      />

      <div className="flex-1 flex relative z-10 w-full">
        <Sidebar
          activeId={activeNav}
          onSelect={setActiveNav}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileNavOpen}
          onMobileClose={() => setIsMobileNavOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={onBackToLanding}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Landing Portal
            </Button>
            <Badge variant="cyan" size="sm">
              PHASE 1 DESIGN SYSTEM BENCHMARK
            </Badge>
          </div>

          <section className="relative rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-white/90 dark:from-[#19272A]/90 via-[#0b152d]/85 to-[#060d1f]/90 backdrop-blur-xl p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.6)] overflow-hidden">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="cyan" size="md" hasDot pulseDot>
                    AI Cybersecurity
                  </Badge>
                  <Badge variant="copper" size="md">
                    Digital Trust Intelligence
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">Phase 1 Design System</span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                  <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
                    Cyber Chakravyuha
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                  <strong className="text-cyan-400 font-semibold">Navigate the Threat. Verify the Trust.</strong>
                  <br />
                  A next-generation cybersecurity command-centre design system with electric cyan telemetry,
                  multi-layered defense telemetry, and digital trust verification.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#EAECE6] dark:bg-[#223336]/80 border border-white/[0.08] p-4 rounded-xl shrink-0">
                <RadialProgress
                  value={simulatedScore}
                  size={100}
                  strokeWidth={8}
                  label="Threat Score"
                  variant="threat"
                />
                <div className="space-y-2 text-center sm:text-left">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-mono text-slate-400">Defense Integrity</span>
                    <p className="text-base font-bold font-mono text-emerald-400">99.98% VERIFIED</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="xs"
                      variant="danger"
                      onClick={handleSimulateAttack}
                      isLoading={btnLoading}
                      leftIcon={<Zap className="w-3 h-3" />}
                    >
                      Trigger Vector
                    </Button>
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={handleResolveAlerts}
                      leftIcon={<ShieldCheck className="w-3 h-3" />}
                    >
                      Neutralize All
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {!alertDismissed && (
            <AlertBanner
              variant={simulatedScore > 75 ? 'danger' : simulatedScore > 50 ? 'warning' : 'info'}
              title={`Security Advisory [DEFCON-${currentThreatLevel}]: Active Saptarishi Perimeter Surveillance`}
              description="Continuous adversarial simulation and cryptographic trust verification active. Zero-trust token authentication enforced across all ingress gateways."
              action={
                <div className="flex items-center gap-2">
                  <Button
                    size="xs"
                    variant={simulatedScore > 75 ? 'danger' : 'outline'}
                    onClick={() => setIsNotificationModalOpen(true)}
                  >
                    Inspect Vectors ({threats.length})
                  </Button>
                </div>
              }
              onDismiss={() => setAlertDismissed(true)}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card variant="interactive" className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-mono">Defense Layers</p>
                  <p className="text-xl font-bold text-white mt-1">7 of 7 Active</p>
                </div>
                <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Layers className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card variant="interactive" className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-mono">Active Threats</p>
                  <p className="text-xl font-bold text-rose-400 mt-1">
                    {threats.filter((t) => t.status === 'active' || t.status === 'investigating').length}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card variant="interactive" className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-mono">Digital Trust Index</p>
                  <p className="text-xl font-bold text-emerald-400 mt-1">94.8 / 100</p>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card variant="interactive" className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-mono">AI Confidence</p>
                  <p className="text-xl font-bold text-[#C47A52] mt-1">98.2%</p>
                </div>
                <div className="p-2.5 rounded-lg bg-[#A95636]/10 border border-[#A95636]/30 text-[#C47A52]">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
            </Card>
          </div>

          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-cyan-400" />
                  Component Library & Interactive Playground
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  All 17 reusable design system components rendered with precision micro-interactions.
                </p>
              </div>

              <Tabs
                variant="pill"
                activeTab={activeTab}
                onChange={setActiveTab}
                tabs={[
                  { id: 'buttons', label: 'Buttons' },
                  { id: 'inputs', label: 'Inputs' },
                  { id: 'cards', label: 'Cards' },
                  { id: 'indicators', label: 'Indicators & Risk' },
                  { id: 'tables', label: 'Data Table' },
                  { id: 'states', label: 'States & Skeletons' },
                  { id: 'tokens', label: 'Design Tokens' },
                ]}
              />
            </div>

            {activeTab === 'buttons' && (
              <Card variant="default">
                <CardHeader>
                  <CardTitle>Button Variants</CardTitle>
                  <CardDescription>Primary electric cyan, secondary copper, outline hairline, ghost, threat alert red, and verified trust emerald.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="primary">Primary Cyan</Button>
                    <Button variant="secondary">Secondary Copper</Button>
                    <Button variant="outline">Outline Hairline</Button>
                    <Button variant="ghost">Ghost Neutral</Button>
                    <Button variant="danger" leftIcon={<ShieldAlert className="w-4 h-4" />}>Threat Alert</Button>
                    <Button variant="success" leftIcon={<ShieldCheck className="w-4 h-4" />}>Verified Trust</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'inputs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card variant="default">
                  <CardHeader>
                    <CardTitle>Input Field Variants</CardTitle>
                    <CardDescription>Cyber inputs with icons, monospace support, and clear buttons.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      label="Asset Search Ingress"
                      placeholder="e.g. 192.168.1.1"
                      value={demoInput}
                      onChange={(e) => setDemoInput(e.target.value)}
                      isClearable
                      onClear={() => setDemoInput('')}
                    />
                    <Input
                      label="Monospace Crypto Token"
                      isMonospace
                      type={showDemoPassword ? 'text' : 'password'}
                      value={demoPassword}
                      onChange={(e) => setDemoPassword(e.target.value)}
                      leftIcon={<Lock className="w-4 h-4" />}
                      rightIcon={
                        <button type="button" onClick={() => setShowDemoPassword(!showDemoPassword)} className="hover:text-cyan-400">
                          <Eye className="w-4 h-4" />
                        </button>
                      }
                    />
                  </CardContent>
                </Card>

                <Card variant="default">
                  <CardHeader>
                    <CardTitle>Textarea & Dropdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Dropdown
                      label="Select Defense Layer"
                      selectedId={selectedDropdownItem}
                      onSelect={(item) => setSelectedDropdownItem(item.id)}
                      searchable
                      items={[
                        { id: 'saptarishi', label: 'Perimeter (Saptarishi)', badge: 'Layer 1' },
                        { id: 'vyuha', label: 'Network (Vyuha Gateway)', badge: 'Layer 2' },
                        { id: 'identity', label: 'Identity & Access', badge: 'Layer 3' },
                        { id: 'cognitive', label: 'Cognitive Core', badge: 'Layer 7' },
                      ]}
                    />
                    <Textarea
                      label="Forensic Incident Log"
                      value={demoTextarea}
                      onChange={(e) => setDemoTextarea(e.target.value)}
                      isMonospace
                      showCount
                      maxLength={300}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'cards' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card variant="default">
                  <CardHeader><CardTitle>Default Card</CardTitle></CardHeader>
                  <CardContent><p className="text-xs text-slate-300">Dark navy with subtle border.</p></CardContent>
                </Card>
                <Card variant="interactive">
                  <CardHeader><CardTitle className="text-cyan-400">Interactive Card</CardTitle></CardHeader>
                  <CardContent><p className="text-xs text-slate-300">Hover lift and cyan glow.</p></CardContent>
                </Card>
                <Card variant="threat">
                  <CardHeader><CardTitle className="text-rose-400">Threat Alert Card</CardTitle></CardHeader>
                  <CardContent><p className="text-xs text-slate-300">Crimson perimeter indicator.</p></CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'indicators' && (
              <div className="space-y-4">
                <Card variant="default" className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <CardTitle>Dynamic Risk Indicator</CardTitle>
                    <span className="font-mono text-cyan-400 font-bold">{simulatedScore} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={simulatedScore}
                    onChange={(e) => setSimulatedScore(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <RiskIndicator score={simulatedScore} mode="detailed" />
                    <div className="p-4 rounded-xl border border-white/10 bg-white dark:bg-[#19272A]">
                      <RiskIndicator score={simulatedScore} mode="segmented" />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'tables' && (
              <DataTable<ThreatAlert>
                columns={[
                  { key: 'id', header: 'Incident ID', sortable: true, width: '120px' },
                  { key: 'title', header: 'Threat Descriptor', sortable: true },
                  { key: 'severity', header: 'Severity', sortable: true, render: (row) => <Badge variant={row.severity === 'critical' ? 'rose' : 'amber'} size="sm">{row.severity}</Badge> },
                  { key: 'layer', header: 'Defense Layer', sortable: true },
                  { key: 'riskScore', header: 'Score', sortable: true, align: 'right', render: (row) => <span className="font-mono font-bold text-rose-400">{row.riskScore}</span> },
                ]}
                data={threats}
                keyExtractor={(row) => row.id}
                selectable
                selectedRowKeys={selectedThreatIds}
                onSelectionChange={setSelectedThreatIds}
              />
            )}

            {activeTab === 'states' && (
              <div className="space-y-4">
                <Button size="sm" variant="outline" onClick={() => setShowEmptyDemo(!showEmptyDemo)}>
                  {showEmptyDemo ? 'Show Skeletons' : 'Show Empty State'}
                </Button>
                {showEmptyDemo ? (
                  <EmptyState
                    title="No Unverified Anomalies"
                    description="The 7-layer shield is currently holding full perimeter integrity."
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <LoadingState message="SCANNING MESH TELEMETRY..." />
                    <CardSkeleton />
                    <div className="sm:col-span-2">
                      <TableSkeleton rows={2} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tokens' && (
              <Card variant="default" className="p-6 space-y-4">
                <CardTitle>Design Tokens Swatches</CardTitle>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { name: 'Copper Accent', hex: colors.copper.primary },
                    { name: 'Spruce Accent', hex: colors.spruce.primary },
                    { name: 'Verified Emerald', hex: colors.verified.primary },
                    { name: 'Critical Crimson', hex: colors.danger.primary },
                  ].map((s) => (
                    <div
                      key={s.name}
                      onClick={() => copyToClipboard(s.hex)}
                      className="p-3 rounded-lg border border-white/10 bg-[#F3F1E9] dark:bg-[#101A1D] cursor-pointer hover:border-cyan-400"
                    >
                      <div className="h-8 rounded mb-2" style={{ backgroundColor: s.hex }} />
                      <p className="text-xs font-semibold">{s.name}</p>
                      <span className="text-[10px] font-mono text-slate-400">{s.hex}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#C47A52]" />
              7-Layer Chakravyuha Architecture
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { layer: 'Layer 1: Perimeter (Saptarishi)', desc: 'Adaptive AI Ingress Firewall', health: 100 },
                { layer: 'Layer 2: Network (Vyuha Gateway)', desc: 'Encrypted Mesh Routing', health: 99 },
                { layer: 'Layer 3: Identity & Access', desc: 'Zero-Trust Ephemeral Credential', health: 97 },
                { layer: 'Layer 4: Endpoint Intel', desc: 'Heuristic Behavioral EDR', health: 98 },
                { layer: 'Layer 5: Application Shield', desc: 'WAF & Runtime Protection', health: 100 },
                { layer: 'Layer 6: Data Vault', desc: 'Post-Quantum Encrypted Storage', health: 100 },
                { layer: 'Layer 7: Cognitive Core', desc: 'Threat Hunting Deception Mesh', health: 96 },
              ].map((item, idx) => (
                <Card key={idx} variant="interactive" className="p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{item.layer.split(':')[0]}</span>
                    <span className="font-mono text-emerald-400">{item.health}%</span>
                  </div>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </Card>
              ))}
            </div>
          </section>
        </main>
      </div>

      <Modal
        isOpen={isThreatModalOpen}
        onClose={() => setIsThreatModalOpen(false)}
        title={activeModalThreat ? `Incident Analysis: ${activeModalThreat.id}` : 'Manual Threat Simulator'}
        size="md"
      >
        <p className="text-xs text-slate-300">
          {activeModalThreat?.description || 'Simulate zero-day threat ingress vector.'}
        </p>
      </Modal>

      <Modal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        title="SecOps Alert Feed"
        size="md"
      >
        <div className="space-y-2">
          {threats.map((t) => (
            <div key={t.id} className="p-2.5 rounded bg-slate-900 text-xs">
              <span className="text-cyan-400 font-mono font-bold">{t.id}</span> — {t.title}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
