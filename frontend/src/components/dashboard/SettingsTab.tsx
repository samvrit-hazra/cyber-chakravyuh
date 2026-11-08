import { useState } from 'react';
import {
  Settings,
  User,
  Bell,
  Eye,
  Shield,
  Key,
  Check,
  RefreshCw,
  Copy,
  Lock,
  Smartphone,
  Sliders,
  Terminal,
  Laptop,
  RotateCcw,
} from 'lucide-react';
import {
  Card,
  Button,
  Input,
  Badge,
  Dropdown,
  LoadingState,
  EmptyState,
  AlertBanner,
  Modal,
} from '../common/index.ts';
import type {
  UserSettingsState,
  ThemeOption,
  RetentionPeriod,
  AuditLevel,
} from '../../types/historyAndSettings.ts';

const initialSettings: UserSettingsState = {
  profile: {
    fullName: 'Commander Vikram Malhotra',
    email: 'v.malhotra@cyberchakravyuha.gov.in',
    organization: 'National Cyber Threat Response Command (NCTRC)',
    clearanceLevel: 'Level 5: Saptarishi Cosmic Top Secret',
    role: 'Lead Threat Hunter & AI Forensic Auditor',
    callSign: 'CHAKRA-ALPHA-01',
    timezone: 'UTC+05:30 (IST - New Delhi)',
    avatarSeed: 'saptarishi-shield',
  },
  notifications: {
    criticalThreatAlerts: true,
    dailyDigest: true,
    smsEmergencyDispatches: true,
    emailAlertFrequency: 'instant',
    webhookUrl: 'https://hooks.slack.com/services/T00/B00/X00EXAMPLESECURE',
    webhookEnabled: true,
    desktopPushEnabled: true,
    soundAlertsEnabled: false,
  },
  display: {
    theme: 'dark-navy',
    density: 'comfortable',
    showShannonEntropy: true,
    animationsEnabled: true,
    monospaceFont: true,
    highContrastHighlights: false,
  },
  privacy: {
    telemetryRetentionDays: '90',
    anonymizeSubmittedDomains: true,
    zeroKnowledgeCommitments: true,
    auditLoggingLevel: 'forensic-deep',
    allowThreatSharing: true,
  },
  security: {
    apiKey: 'cky_live_892fc04819a82e9d28af01c4e91823ab',
    apiKeyCreated: '2026-10-01 08:30:00 UTC',
    apiKeyLastUsed: 'Just now (Telemetry sync)',
    twoFactorEnabled: true,
    hardwareKeyEnrolled: true,
    autoBlockThreshold: 85,
    activeSessions: [
      {
        id: 'sess-1',
        device: 'Workstation ThinkPad P1 Gen 7',
        browser: 'Chrome 131.0 (Linux x86_64)',
        ipAddress: '103.21.244.18 (Encrypted VPN)',
        location: 'New Delhi, India',
        lastActive: 'Active now (Current Session)',
        isCurrent: true,
      },
      {
        id: 'sess-2',
        device: 'Secure Tablet Pixel Fold',
        browser: 'Mobile Safari 18.1 (Android 15)',
        ipAddress: '103.21.244.92 (NCTRC Intranet)',
        location: 'New Delhi, India',
        lastActive: '2 hours ago',
        isCurrent: false,
      },
    ],
  },
};

export function SettingsTab() {
  // Evaluator state tester: 'ready' | 'loading' | 'empty' | 'error'
  const [stateMode, setStateMode] = useState<'ready' | 'loading' | 'empty' | 'error'>('ready');

  // Active settings tab
  const [activeSection, setActiveSection] = useState<'profile' | 'notifications' | 'display' | 'privacy' | 'security'>('profile');

  // Main state
  const [settings, setSettings] = useState<UserSettingsState>(initialSettings);

  // Micro-state
  const [isSaved, setIsSaved] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookTested, setWebhookTested] = useState(false);

  // Password Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Save changes handler
  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Reset to default
  const handleResetDefaults = () => {
    setSettings(initialSettings);
    setStateMode('ready');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Copy API Key
  const handleCopyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(settings.security.apiKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } catch {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  // Regenerate API Key
  const handleRegenerateKey = () => {
    const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setSettings((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        apiKey: `cky_live_${randomHex}`,
        apiKeyCreated: 'Just now',
        apiKeyLastUsed: 'Never',
      },
    }));
    alert('Cryptographic API token has been regenerated. Existing integrations must update their authorization headers.');
  };

  // Test webhook
  const handleTestWebhook = () => {
    setIsTestingWebhook(true);
    setTimeout(() => {
      setIsTestingWebhook(false);
      setWebhookTested(true);
      setTimeout(() => setWebhookTested(false), 3000);
    }, 1000);
  };

  // Revoke session
  const handleRevokeSession = (sessionId: string) => {
    setSettings((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        activeSessions: prev.security.activeSessions.filter((s) => s.id !== sessionId),
      },
    }));
  };

  // Handle Password Change
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || newPassword !== confirmPassword) {
      alert('Please fill all password fields correctly and ensure new passwords match.');
      return;
    }
    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setIsPasswordModalOpen(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top SOC Settings Banner */}
      <Card variant="glass" className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Security Operations Centre Configurations & Preferences
            </h3>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Manage analyst credentials, multi-channel threat dispatch integrations, visual display telemetry,
              zero-knowledge privacy safeguards, and automated Saptarishi gateway policies.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5 text-slate-400" />}
              onClick={handleResetDefaults}
            >
              Reset Defaults
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={isSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Settings className="w-4 h-4" />}
              onClick={handleSave}
            >
              {isSaved ? 'Settings Saved' : 'Save Configurations'}
            </Button>
          </div>
        </div>

        {/* State Tester Toolbar */}
        <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Badge variant="cyan" size="sm">FIPS 140-2 LEVEL 3</Badge>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Active Profile: <strong className="text-slate-200">{settings.profile.callSign}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-500 text-[11px] mr-1">State Tester:</span>
            {(['ready', 'loading', 'empty', 'error'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setStateMode(mode)}
                className={`px-2 py-0.5 rounded text-[11px] uppercase transition-colors cursor-pointer ${
                  stateMode === mode
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/40'
                    : 'bg-[#F3F1E9] dark:bg-[#101A1D] text-[#647477] dark:text-[#A6B3AE] hover:text-[#182629] dark:hover:text-[#E8E6DC] border border-[#D9DED7] dark:border-[#304144]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* State Mode: Loading */}
      {stateMode === 'loading' && (
        <Card variant="default" className="p-12">
          <LoadingState
            message="SYNCHRONIZING USER SECURITY PROFILE..."
            submessage="Verifying asymmetric credentials against Saptarishi Key Vault"
          />
        </Card>
      )}

      {/* State Mode: Error */}
      {stateMode === 'error' && (
        <Card variant="default" className="p-6">
          <AlertBanner
            variant="danger"
            title="Profile Configuration Sync Failed"
            description="Could not synchronize local preferences with the encrypted configuration store. The configuration service responded with error code 503 Service Unavailable."
            action={
              <Button
                variant="danger"
                size="sm"
                onClick={() => setStateMode('ready')}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Retry Configuration Sync
              </Button>
            }
          />
        </Card>
      )}

      {/* State Mode: Empty */}
      {stateMode === 'empty' && (
        <EmptyState
          icon={<Settings className="w-8 h-8 text-cyan-400" />}
          title="No Profile Settings Found"
          description="Your analyst profile and SOC telemetry preferences are currently uninitialized. Load standard defaults to configure your security station."
          action={
            <Button variant="primary" size="sm" onClick={handleResetDefaults} leftIcon={<RotateCcw className="w-4 h-4" />}>
              Restore Default Settings
            </Button>
          }
        />
      )}

      {/* State Mode: Ready */}
      {stateMode === 'ready' && (
        <div className="space-y-6">
          {/* Settings Section Navigation Pills */}
          <div className="flex items-center gap-2 p-1.5 bg-[#F3F1E9] dark:bg-[#101A1D] rounded-xl border border-[#D9DED7] dark:border-[#304144] overflow-x-auto">
            <button
              onClick={() => setActiveSection('profile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                activeSection === 'profile'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <User className="w-4 h-4" />
              Profile Settings
            </button>

            <button
              onClick={() => setActiveSection('notifications')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                activeSection === 'notifications'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Bell className="w-4 h-4" />
              Notifications & Alerts
            </button>

            <button
              onClick={() => setActiveSection('display')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                activeSection === 'display'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Eye className="w-4 h-4" />
              Display & Theme
            </button>

            <button
              onClick={() => setActiveSection('privacy')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                activeSection === 'privacy'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Shield className="w-4 h-4" />
              Privacy & Zero-Knowledge
            </button>

            <button
              onClick={() => setActiveSection('security')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                activeSection === 'security'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Key className="w-4 h-4" />
              Account & Credentials
            </button>
          </div>

          {/* SECTION 1: PROFILE SETTINGS */}
          {activeSection === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card / Badge */}
              <Card variant="glass" className="p-6 space-y-4 text-center flex flex-col items-center">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-[#8F472C]/20 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.4)]">
                    <Shield className="w-10 h-10 text-cyan-300 animate-pulse" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-[#19272A] flex items-center justify-center" title="Active Clearance Status">
                    <Check className="w-3.5 h-3.5 text-black font-bold" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white font-mono">{settings.profile.fullName}</h4>
                  <p className="text-xs text-cyan-300 font-mono">{settings.profile.callSign}</p>
                  <p className="text-[11px] text-slate-400 font-mono max-w-[220px]">{settings.profile.role}</p>
                </div>

                <Badge variant="cyan" size="md">
                  {settings.profile.clearanceLevel.split(':')[0]}
                </Badge>

                <div className="w-full pt-4 border-t border-white/5 space-y-2 text-left text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>AGENCY:</span>
                    <span className="text-slate-200">NCTRC</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>TIMEZONE:</span>
                    <span className="text-slate-200">UTC+05:30</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>STATUS:</span>
                    <span className="text-emerald-400 font-semibold">AUTHORIZED</span>
                  </div>
                </div>
              </Card>

              {/* Profile Form */}
              <Card variant="default" className="lg:col-span-2 p-6 space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <h4 className="text-xs font-mono font-bold uppercase text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-400" />
                    Analyst Identification & Operational Role
                  </h4>
                  <Badge variant="copper" size="sm">CONFIDENTIAL</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Analyst Full Name"
                    value={settings.profile.fullName}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, fullName: e.target.value },
                      }))
                    }
                  />

                  <Input
                    label="Official Email Address"
                    value={settings.profile.email}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, email: e.target.value },
                      }))
                    }
                    type="email"
                  />

                  <Input
                    label="Operational Organization / Unit"
                    value={settings.profile.organization}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, organization: e.target.value },
                      }))
                    }
                  />

                  <Input
                    label="Tactical Call Sign / Badge ID"
                    value={settings.profile.callSign}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, callSign: e.target.value },
                      }))
                    }
                    isMonospace
                  />

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-mono uppercase text-slate-300 font-semibold block">
                      Security Clearance Level
                    </label>
                    <Dropdown
                      selectedId={settings.profile.clearanceLevel}
                      onSelect={(item) =>
                        setSettings((prev) => ({
                          ...prev,
                          profile: { ...prev.profile, clearanceLevel: item.label },
                        }))
                      }
                      items={[
                        { id: 'l5', label: 'Level 5: Saptarishi Cosmic Top Secret' },
                        { id: 'l4', label: 'Level 4: National Cyber Command' },
                        { id: 'l3', label: 'Level 3: Senior Forensic Analyst' },
                        { id: 'l2', label: 'Level 2: SOC Tier-2 Operator' },
                      ]}
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-mono uppercase text-slate-300 font-semibold block">
                      Operational Responsibility / Role
                    </label>
                    <Dropdown
                      selectedId={settings.profile.role}
                      onSelect={(item) =>
                        setSettings((prev) => ({
                          ...prev,
                          profile: { ...prev.profile, role: item.label },
                        }))
                      }
                      items={[
                        { id: 'r1', label: 'Lead Threat Hunter & AI Forensic Auditor' },
                        { id: 'r2', label: 'Cognitive Malware Reverse Engineer' },
                        { id: 'r3', label: 'Incident Response & Gatekeeper Commander' },
                        { id: 'r4', label: 'Zero-Trust Policy & Cryptographic Architect' },
                      ]}
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* SECTION 2: NOTIFICATIONS & ALERTS */}
          {activeSection === 'notifications' && (
            <Card variant="default" className="p-6 space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-mono font-bold uppercase text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-cyan-400" />
                    Threat Alert Dispatches & Integrations
                  </h4>
                  <p className="text-xs text-slate-400">
                    Configure real-time communication channels for high-risk findings and sinkhole actions.
                  </p>
                </div>
                <Badge variant="cyan" size="sm">TELEMETRY PIPELINE</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Critical Threat Alert Toggle */}
                <div className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-white block">Critical Threat Broadcasts</span>
                    <p className="text-[11px] text-slate-400">
                      Trigger instant priority alerts when any asset scores &ge; 85/100 (confirmed malware / phish).
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.criticalThreatAlerts}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, criticalThreatAlerts: e.target.checked },
                      }))
                    }
                    className="w-5 h-5 accent-cyan-400 rounded cursor-pointer mt-0.5"
                  />
                </div>

                {/* Daily Digest Toggle */}
                <div className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-white block">Daily Threat Intelligence Briefing</span>
                    <p className="text-[11px] text-slate-400">
                      Receive an automated 08:00 UTC summary of emerging campaigns and sinkholed assets.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.dailyDigest}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, dailyDigest: e.target.checked },
                      }))
                    }
                    className="w-5 h-5 accent-cyan-400 rounded cursor-pointer mt-0.5"
                  />
                </div>

                {/* SMS Emergency Dispatches */}
                <div className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-white block">Emergency SMS / Satellite Dispatches</span>
                    <p className="text-[11px] text-slate-400">
                      Send authenticated SMS warnings to on-duty commanders when zero-day sinkholes trigger.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.smsEmergencyDispatches}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, smsEmergencyDispatches: e.target.checked },
                      }))
                    }
                    className="w-5 h-5 accent-cyan-400 rounded cursor-pointer mt-0.5"
                  />
                </div>

                {/* Desktop Push Notifications */}
                <div className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-white block">Desktop Browser Push Notifications</span>
                    <p className="text-[11px] text-slate-400">
                      Show OS-level native notification cards during background investigation execution.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.desktopPushEnabled}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, desktopPushEnabled: e.target.checked },
                      }))
                    }
                    className="w-5 h-5 accent-cyan-400 rounded cursor-pointer mt-0.5"
                  />
                </div>
              </div>

              {/* SIEM / Slack Webhook Integration */}
              <div className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-mono font-bold uppercase text-white flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#C47A52]" />
                      SIEM / Incident Response Ingress Webhook
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Forward verified forensic JSON dossiers to Slack, Microsoft Teams, Splunk, or custom webhook endpoints.
                    </p>
                  </div>
                  <Badge variant={settings.notifications.webhookEnabled ? 'emerald' : 'neutral'} size="sm">
                    {settings.notifications.webhookEnabled ? 'ACTIVE' : 'DISABLED'}
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1">
                    <Input
                      label="Webhook Ingress Endpoint URL"
                      value={settings.notifications.webhookUrl}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          notifications: { ...prev.notifications, webhookUrl: e.target.value },
                        }))
                      }
                      isMonospace
                      placeholder="https://hooks.slack.com/services/..."
                    />
                  </div>
                  <div className="self-end sm:mb-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTestWebhook}
                      isLoading={isTestingWebhook}
                      leftIcon={webhookTested ? <Check className="w-4 h-4 text-emerald-400" /> : <Terminal className="w-4 h-4" />}
                    >
                      {webhookTested ? 'Ping Delivered' : 'Send Test Payload'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* SECTION 3: DISPLAY & THEME PREFERENCES */}
          {activeSection === 'display' && (
            <Card variant="default" className="p-6 space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-mono font-bold uppercase text-white flex items-center gap-2">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    Display, Density & Visual Telemetry Preferences
                  </h4>
                  <p className="text-xs text-slate-400">
                    Customize the cybersecurity command-centre aesthetic, typography, and table density.
                  </p>
                </div>
                <Badge variant="cyan" size="sm">SOC THEME</Badge>
              </div>

              {/* Theme Variants */}
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase text-slate-300 font-semibold block">
                  Color Theme Palette
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Option 1: Dark Navy */}
                  <div
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        display: { ...prev.display, theme: 'dark-navy' as ThemeOption },
                      }))
                    }
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      settings.display.theme === 'dark-navy'
                        ? 'bg-white dark:bg-[#19272A] border-[#A95636] dark:border-[#C47A52] ring-1 ring-[#A95636] dark:ring-[#C47A52]'
                        : 'bg-[#F3F1E9] dark:bg-[#101A1D] border-[#D9DED7] dark:border-[#304144] hover:border-[#A95636]/40 dark:hover:border-[#C47A52]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-cyan-300">Dark Navy (Default)</span>
                      {settings.display.theme === 'dark-navy' && <Check className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Standard Cyber Chakravyuha command center with navy backdrops and copper/spruce accents.
                    </p>
                    <div className="mt-3 flex gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-[#030712] border border-white/20" />
                      <div className="w-4 h-4 rounded-full bg-cyan-400" />
                      <div className="w-4 h-4 rounded-full bg-[#A95636]" />
                    </div>
                  </div>

                  {/* Option 2: Cyber Midnight */}
                  <div
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        display: { ...prev.display, theme: 'cyber-midnight' as ThemeOption },
                      }))
                    }
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      settings.display.theme === 'cyber-midnight'
                        ? 'bg-white dark:bg-[#19272A] border-[#A95636] dark:border-[#C47A52] ring-1 ring-[#A95636] dark:ring-[#C47A52]'
                        : 'bg-[#F3F1E9] dark:bg-[#101A1D] border-[#D9DED7] dark:border-[#304144] hover:border-[#A95636]/40 dark:hover:border-[#C47A52]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-cyan-300">Cyber Midnight</span>
                      {settings.display.theme === 'cyber-midnight' && <Check className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Deeper dark-space contrast optimized for low-light nocturnal operations rooms.
                    </p>
                    <div className="mt-3 flex gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-[#01040a] border border-white/20" />
                      <div className="w-4 h-4 rounded-full bg-cyan-300" />
                      <div className="w-4 h-4 rounded-full bg-indigo-500" />
                    </div>
                  </div>

                  {/* Option 3: AMOLED Matrix */}
                  <div
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        display: { ...prev.display, theme: 'amoled-matrix' as ThemeOption },
                      }))
                    }
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      settings.display.theme === 'amoled-matrix'
                        ? 'bg-white dark:bg-[#19272A] border-[#356D68] dark:border-[#79A99C] ring-1 ring-[#356D68] dark:ring-[#79A99C]'
                        : 'bg-[#F3F1E9] dark:bg-[#101A1D] border-[#D9DED7] dark:border-[#304144] hover:border-[#356D68]/40 dark:hover:border-[#79A99C]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-emerald-400">AMOLED Matrix</span>
                      {settings.display.theme === 'amoled-matrix' && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Pure #000000 black canvas with neon emerald and cyan phosphor glyphs.
                    </p>
                    <div className="mt-3 flex gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-black border border-white/20" />
                      <div className="w-4 h-4 rounded-full bg-emerald-400" />
                      <div className="w-4 h-4 rounded-full bg-cyan-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-white block">Shannon Entropy Analysis Column</span>
                    <p className="text-[11px] text-slate-400">
                      Display calculated randomness score (bits) for target hostnames directly in investigation tables.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.display.showShannonEntropy}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        display: { ...prev.display, showShannonEntropy: e.target.checked },
                      }))
                    }
                    className="w-5 h-5 accent-cyan-400 rounded cursor-pointer mt-0.5"
                  />
                </div>

                <div className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-white block">Subtle Network Particle Background</span>
                    <p className="text-[11px] text-slate-400">
                      Render animated constellation network canvas behind cards and operational workspaces.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.display.animationsEnabled}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        display: { ...prev.display, animationsEnabled: e.target.checked },
                      }))
                    }
                    className="w-5 h-5 accent-cyan-400 rounded cursor-pointer mt-0.5"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* SECTION 4: PRIVACY & ZERO-KNOWLEDGE */}
          {activeSection === 'privacy' && (
            <Card variant="default" className="p-6 space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-mono font-bold uppercase text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    Zero-Knowledge Guarantees & Privacy Controls
                  </h4>
                  <p className="text-xs text-slate-400">
                    Control data retention windows, HMAC-SHA256 query masking, and audit compliance logging.
                  </p>
                </div>
                <Badge variant="emerald" size="sm">PRIVACY BY DESIGN</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Retention Period Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-slate-300 font-semibold block">
                    Telemetry Ingress Retention Window
                  </label>
                  <Dropdown
                    selectedId={settings.privacy.telemetryRetentionDays}
                    onSelect={(item) =>
                      setSettings((prev) => ({
                        ...prev,
                        privacy: { ...prev.privacy, telemetryRetentionDays: item.id as RetentionPeriod },
                      }))
                    }
                    items={[
                      { id: '30', label: '30 Days (Ephemeral SOC Cycle)' },
                      { id: '90', label: '90 Days (Recommended Operational Window)' },
                      { id: '180', label: '180 Days (Financial / Defense Compliance)' },
                      { id: '365', label: '365 Days (Full Forensic Year)' },
                      { id: '0', label: 'Zero-Persistence (Strict In-Memory Ephemeral)' },
                    ]}
                  />
                  <p className="text-[11px] text-slate-500 font-mono">
                    After expiration, raw investigation artifacts are mathematically purged from local indexes.
                  </p>
                </div>

                {/* Audit Logging Level */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-slate-300 font-semibold block">
                    Audit Logging Fidelity
                  </label>
                  <Dropdown
                    selectedId={settings.privacy.auditLoggingLevel}
                    onSelect={(item) =>
                      setSettings((prev) => ({
                        ...prev,
                        privacy: { ...prev.privacy, auditLoggingLevel: item.id as AuditLevel },
                      }))
                    }
                    items={[
                      { id: 'forensic-deep', label: 'Full Deep Forensic Trace (Headers, Entropy, AST)' },
                      { id: 'aggregated', label: 'Aggregated Threat Scores Only (Privacy Preserved)' },
                      { id: 'ephemeral', label: 'Ephemeral Session Logging' },
                    ]}
                  />
                  <p className="text-[11px] text-slate-500 font-mono">
                    Governs granularity of data recorded to the local SQLite and indexed memory cache.
                  </p>
                </div>

                {/* Zero Knowledge Toggle */}
                <div className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-white block">Zero-Knowledge Query Commitments</span>
                    <p className="text-[11px] text-slate-400">
                      Never transmit raw scanned URLs across the network. Query hashes with HMAC-SHA256 salting.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.privacy.zeroKnowledgeCommitments}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        privacy: { ...prev.privacy, zeroKnowledgeCommitments: e.target.checked },
                      }))
                    }
                    className="w-5 h-5 accent-cyan-400 rounded cursor-pointer mt-0.5"
                  />
                </div>

                {/* Anonymize Domains Toggle */}
                <div className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-white block">Anonymize Internal FQDNs</span>
                    <p className="text-[11px] text-slate-400">
                      Mask RFC 1918 internal hostnames prior to threat correlation engine processing.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.privacy.anonymizeSubmittedDomains}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        privacy: { ...prev.privacy, anonymizeSubmittedDomains: e.target.checked },
                      }))
                    }
                    className="w-5 h-5 accent-cyan-400 rounded cursor-pointer mt-0.5"
                  />
                </div>
              </div>

              {/* Data Compliance & Export Actions */}
              <div className="p-4 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-1 text-xs">
                  <span className="font-mono font-bold text-cyan-300 block">NIST CSF & GDPR Article 30 Audit Compliance</span>
                  <p className="text-slate-400 text-[11px]">
                    Export certified compliance log of all data processing activities and analyst investigations.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert('Generating cryptographic compliance audit bundle (JSON/PDF)...')}
                >
                  Export Compliance Log
                </Button>
              </div>
            </Card>
          )}

          {/* SECTION 5: ACCOUNT & SECURITY CREDENTIALS */}
          {activeSection === 'security' && (
            <div className="space-y-6">
              {/* API Token Card */}
              <Card variant="default" className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-mono font-bold uppercase text-white flex items-center gap-2">
                      <Key className="w-4 h-4 text-cyan-400" />
                      Live API & Ingress Ingestion Token
                    </h4>
                    <p className="text-xs text-slate-400">
                      Cryptographic bearer token used by CLI tools, SIEM agents, and automated scanners.
                    </p>
                  </div>
                  <Badge variant="cyan" size="sm">ACTIVE TOKEN</Badge>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      label="API Key"
                      value={showApiKey ? settings.security.apiKey : '•'.repeat(32) + settings.security.apiKey.slice(-6)}
                      readOnly
                      isMonospace
                      helperText={`Issued: ${settings.security.apiKeyCreated} • Last used: ${settings.security.apiKeyLastUsed}`}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      {showApiKey ? 'Hide Token' : 'Reveal Token'}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyApiKey}
                      leftIcon={copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    >
                      {copiedKey ? 'Token Copied' : 'Copy Key'}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRegenerateKey}
                      leftIcon={<RefreshCw className="w-3.5 h-3.5 text-[#C47A52]" />}
                    >
                      Regenerate
                    </Button>
                  </div>
                </div>
              </Card>

              {/* MFA & Authentication Credentials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card variant="default" className="p-5 space-y-4">
                  <h4 className="text-xs font-mono font-bold uppercase text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    Multi-Factor Authentication (2FA)
                  </h4>
                  <div className="space-y-3 text-xs font-mono">
                    <div className="p-3 rounded-lg bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-white font-bold block">FIDO2 / Hardware Security Key</span>
                        <span className="text-slate-400 text-[11px]">Enrolled: Yubikey 5C NFC</span>
                      </div>
                      <Badge variant="emerald" size="sm">ENROLLED</Badge>
                    </div>

                    <div className="p-3 rounded-lg bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-white font-bold block">Authenticator App (TOTP)</span>
                        <span className="text-slate-400 text-[11px]">SHA-256 6-digit passcode</span>
                      </div>
                      <Badge variant="emerald" size="sm">ACTIVE</Badge>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setIsPasswordModalOpen(true)}
                      leftIcon={<Lock className="w-3.5 h-3.5 text-cyan-400" />}
                    >
                      Change Master Passphrase
                    </Button>
                  </div>
                </Card>

                {/* Automated Gateway Sinkhole Threshold */}
                <Card variant="default" className="p-5 space-y-4">
                  <h4 className="text-xs font-mono font-bold uppercase text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#C47A52]" />
                    Automated Gateway Intercept Threshold
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">Auto-quarantine trigger score:</span>
                      <span className="text-rose-400 font-bold">{settings.security.autoBlockThreshold} / 100</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="95"
                      value={settings.security.autoBlockThreshold}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          security: { ...prev.security, autoBlockThreshold: Number(e.target.value) },
                        }))
                      }
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Target URLs and domains scoring above {settings.security.autoBlockThreshold} will automatically trigger DNS null-routing and perimeter edge firewall drops.
                    </p>
                  </div>
                </Card>
              </div>

              {/* Active Security Sessions */}
              <Card variant="default" className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-mono font-bold uppercase text-white flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-cyan-400" />
                      Active Security & SOC Sessions
                    </h4>
                    <p className="text-xs text-slate-400">
                      Signed device sessions currently authorized to access Chakravyuha forensic telemetry.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSettings((prev) => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          activeSessions: prev.security.activeSessions.filter((s) => s.isCurrent),
                        },
                      }));
                      alert('Terminated all other active sessions.');
                    }}
                  >
                    Revoke Other Sessions
                  </Button>
                </div>

                <div className="space-y-3">
                  {settings.security.activeSessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-3.5 rounded-xl bg-[#F3F1E9] dark:bg-[#101A1D] border border-[#D9DED7] dark:border-[#304144] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{session.device}</span>
                          {session.isCurrent && (
                            <Badge variant="cyan" size="sm">THIS DEVICE</Badge>
                          )}
                        </div>
                        <div className="text-slate-400 text-[11px] flex flex-wrap gap-x-3 gap-y-1">
                          <span>Browser: {session.browser}</span>
                          <span>IP: {session.ipAddress}</span>
                          <span>Location: {session.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <span className="text-slate-500 text-[11px]">{session.lastActive}</span>
                        {!session.isCurrent && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRevokeSession(session.id)}
                            className="text-rose-400 hover:text-rose-300"
                          >
                            Revoke
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Update SOC Master Passphrase"
        subtitle="Enforce cryptographic entropy standards (min 14 characters + FIDO2 verification)"
        size="md"
      >
        <form onSubmit={handleChangePassword} className="space-y-4 text-xs font-mono">
          <Input
            label="Current Passphrase"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="••••••••••••••••"
            required
          />

          <Input
            label="New Passphrase"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••••••••••"
            helperText="Requires uppercase, lowercase, numbers, and symbols"
            required
          />

          <Input
            label="Confirm New Passphrase"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••••••••••"
            required
          />

          {passwordSuccess && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              Master passphrase successfully updated and synced across FIDO2 credentials.
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsPasswordModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Apply New Passphrase
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
