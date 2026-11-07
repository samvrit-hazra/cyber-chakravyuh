/**
 * CYBER CHAKRAVYUHA DESIGN SYSTEM TOKENS
 * Brand: Cyber Chakravyuha
 * Tagline: Navigate the Threat. Verify the Trust.
 * Category: AI Cybersecurity & Digital Trust Intelligence
 */

export const colors = {
  // Near-black and dark navy background surfaces
  background: {
    void: '#030712',          // Deepest terminal black
    canvas: '#060d1f',        // Main app background
    surface: '#0b152d',       // Elevated panel surface
    surfaceAlt: '#0f1d3d',    // Alternate higher contrast surface
    elevated: '#14254b',      // Dropdown/popover high elevation
    border: 'rgba(56, 189, 248, 0.14)',      // Default hairline cyber border
    borderSubtle: 'rgba(255, 255, 255, 0.08)',// Muted border
    borderHighlight: 'rgba(6, 182, 212, 0.4)', // Focused / hovered border
  },

  // Primary Accent: Electric Cyan
  cyan: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',          // Primary electric cyan
    600: '#0891b2',
    700: '#0e7490',
    electric: '#00f2fe',
    glow: 'rgba(6, 182, 212, 0.35)',
    glowStrong: 'rgba(0, 242, 254, 0.6)',
  },

  // Secondary Accent: Deep Purple & Electric Violet
  purple: {
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',          // Electric violet
    600: '#9333ea',
    700: '#7e22ce',
    glow: 'rgba(168, 85, 247, 0.35)',
  },

  // Digital Trust & Verified State: Subtle Emerald
  verified: {
    light: '#6ee7b7',
    primary: '#10b981',      // Subtle emerald
    dark: '#047857',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.35)',
    glow: 'rgba(16, 185, 129, 0.35)',
  },

  // Threat & Anomaly States: Crimson Red, Amber Warning, Threat Orange
  threat: {
    critical: '#ef4444',     // Crimson alert
    criticalBg: 'rgba(239, 68, 68, 0.12)',
    criticalBorder: 'rgba(239, 68, 68, 0.35)',
    criticalGlow: 'rgba(239, 68, 68, 0.35)',

    high: '#f97316',         // Threat orange
    highBg: 'rgba(249, 115, 22, 0.12)',
    highBorder: 'rgba(249, 115, 22, 0.35)',

    medium: '#f59e0b',       // Warning amber
    mediumBg: 'rgba(245, 158, 11, 0.12)',
    mediumBorder: 'rgba(245, 158, 11, 0.35)',

    low: '#38bdf8',          // Informational / low severity cyan
    lowBg: 'rgba(56, 189, 248, 0.12)',
    lowBorder: 'rgba(56, 189, 248, 0.35)',
  },

  // Text Hierarchy
  text: {
    primary: '#f8fafc',
    secondary: '#94a3b8',
    muted: '#64748b',
    subtle: '#475569',
    accent: '#22d3ee',
  },
} as const;

export const typography = {
  fontFamily: {
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "Cascadia Code", "Courier New", monospace',
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],     // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.015em' }], // 14px
    base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],          // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }], // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.015em' }], // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],   // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.025em' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.03em' }],    // 36px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export const spacing = {
  0: '0px',
  1: '0.25rem', // 4px
  2: '0.5rem',  // 8px
  3: '0.75rem', // 12px
  4: '1rem',    // 16px
  5: '1.25rem', // 20px
  6: '1.5rem',  // 24px
  8: '2rem',    // 32px
  10: '2.5rem', // 40px
  12: '3rem',   // 48px
  16: '4rem',   // 64px
} as const;

export const borderRadius = {
  none: '0px',
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const;

export const shadows = {
  card: '0 4px 20px -2px rgba(2, 6, 23, 0.7)',
  cardHover: '0 8px 30px -4px rgba(6, 182, 212, 0.15)',
  glowCyanSm: '0 0 10px rgba(6, 182, 212, 0.35)',
  glowCyanMd: '0 0 20px rgba(6, 182, 212, 0.5)',
  glowPurpleSm: '0 0 12px rgba(168, 85, 247, 0.35)',
  glowEmeraldSm: '0 0 12px rgba(16, 185, 129, 0.4)',
  glowThreatSm: '0 0 14px rgba(239, 68, 68, 0.45)',
} as const;

export const riskLevels = {
  low: {
    label: 'Low Risk',
    scoreRange: '0 - 25',
    color: colors.threat.low,
    bg: colors.threat.lowBg,
    border: colors.threat.lowBorder,
  },
  medium: {
    label: 'Guarded / Moderate',
    scoreRange: '26 - 50',
    color: colors.threat.medium,
    bg: colors.threat.mediumBg,
    border: colors.threat.mediumBorder,
  },
  high: {
    label: 'High Threat',
    scoreRange: '51 - 75',
    color: colors.threat.high,
    bg: colors.threat.highBg,
    border: colors.threat.highBorder,
  },
  critical: {
    label: 'Critical Vulnerability',
    scoreRange: '76 - 100',
    color: colors.threat.critical,
    bg: colors.threat.criticalBg,
    border: colors.threat.criticalBorder,
  },
} as const;

