import type { InvestigationType, DashboardRiskLevel } from './dashboard.ts';

export type DateFilterOption = 'all' | 'today' | '7days' | '30days';
export type RiskFilterOption = 'all' | DashboardRiskLevel | 'inconclusive';
export type TypeFilterOption = 'all' | InvestigationType;
export type SortOption =
  | 'date-desc'
  | 'date-asc'
  | 'score-desc'
  | 'score-asc'
  | 'url-asc'
  | 'url-desc';

export interface InvestigationFilterState {
  searchQuery: string;
  dateFilter: DateFilterOption;
  riskFilter: RiskFilterOption;
  typeFilter: TypeFilterOption;
  sortBy: SortOption;
  currentPage: number;
  pageSize: number;
}

export type ThemeOption = 'dark-navy' | 'cyber-midnight' | 'amoled-matrix';
export type DensityOption = 'comfortable' | 'compact';
export type EmailFrequency = 'instant' | 'hourly' | 'daily' | 'off';
export type RetentionPeriod = '30' | '90' | '180' | '365' | '0'; // 0 = zero-persistence
export type AuditLevel = 'forensic-deep' | 'aggregated' | 'ephemeral';

export interface UserProfileSettings {
  fullName: string;
  email: string;
  organization: string;
  clearanceLevel: string;
  role: string;
  callSign: string;
  timezone: string;
  avatarSeed: string;
}

export interface NotificationPreferences {
  criticalThreatAlerts: boolean;
  dailyDigest: boolean;
  smsEmergencyDispatches: boolean;
  emailAlertFrequency: EmailFrequency;
  webhookUrl: string;
  webhookEnabled: boolean;
  desktopPushEnabled: boolean;
  soundAlertsEnabled: boolean;
}

export interface DisplayPreferences {
  theme: ThemeOption;
  density: DensityOption;
  showShannonEntropy: boolean;
  animationsEnabled: boolean;
  monospaceFont: boolean;
  highContrastHighlights: boolean;
}

export interface PrivacySettings {
  telemetryRetentionDays: RetentionPeriod;
  anonymizeSubmittedDomains: boolean;
  zeroKnowledgeCommitments: boolean;
  auditLoggingLevel: AuditLevel;
  allowThreatSharing: boolean;
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface AccountSecuritySettings {
  apiKey: string;
  apiKeyCreated: string;
  apiKeyLastUsed: string;
  twoFactorEnabled: boolean;
  hardwareKeyEnrolled: boolean;
  autoBlockThreshold: number;
  activeSessions: ActiveSession[];
}

export interface UserSettingsState {
  profile: UserProfileSettings;
  notifications: NotificationPreferences;
  display: DisplayPreferences;
  privacy: PrivacySettings;
  security: AccountSecuritySettings;
}
