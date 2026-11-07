/**
 * CYBER CHAKRAVYUH — SIGNAL & SLATE ART-DIRECTED DESIGN SYSTEM
 * Master Design Tokens Specification
 */

export const themes = {
  light: {
    name: 'light',
    background: '#F3F1E9',
    surfacePrimary: '#FFFFFF',
    surfaceSecondary: '#EAECE6',
    surfaceElevated: '#FFFFFF',
    textPrimary: '#182629',
    textSecondary: '#647477',
    border: '#D9DED7',
    accent: '#A95636',
    accentHover: '#8F462A',
    accentSecondary: '#356D68',
    accentSecondaryHover: '#2A5753',
    success: '#36745F',
    warning: '#A87532',
    danger: '#B64B46',
    accentSubtle: 'rgba(169, 86, 54, 0.08)',
    accentSecondarySubtle: 'rgba(53, 109, 104, 0.08)',
    successSubtle: 'rgba(54, 116, 95, 0.08)',
    warningSubtle: 'rgba(168, 117, 50, 0.08)',
    dangerSubtle: 'rgba(182, 75, 70, 0.08)',
  },
  dark: {
    name: 'dark',
    background: '#101A1D',
    surfacePrimary: '#19272A',
    surfaceSecondary: '#223336',
    surfaceElevated: '#293A3C',
    textPrimary: '#E8E6DC',
    textSecondary: '#A6B3AE',
    border: '#304144',
    accent: '#C47A52',
    accentHover: '#B26943',
    accentSecondary: '#79A99C',
    accentSecondaryHover: '#669387',
    success: '#79B69A',
    warning: '#D7AA61',
    danger: '#E17B70',
    accentSubtle: 'rgba(196, 122, 82, 0.12)',
    accentSecondarySubtle: 'rgba(121, 169, 156, 0.12)',
    successSubtle: 'rgba(121, 182, 154, 0.12)',
    warningSubtle: 'rgba(215, 170, 97, 0.12)',
    dangerSubtle: 'rgba(225, 123, 112, 0.12)',
  },
} as const;

export const typography = {
  fontHeading: "'Space Grotesk', system-ui, sans-serif",
  fontSans: "'Inter', system-ui, sans-serif",
  fontMono: "'IBM Plex Mono', 'JetBrains Mono', ui-monospace, monospace",
  fontBrand: "'Aloevera', 'Space Grotesk', sans-serif",
};

export const semanticStatus = {
  danger: {
    dark: { text: '#E17B70', bg: 'rgba(225, 123, 112, 0.12)', border: 'rgba(225, 123, 112, 0.3)' },
    light: { text: '#B64B46', bg: 'rgba(182, 75, 70, 0.08)', border: 'rgba(182, 75, 70, 0.25)' },
  },
  warning: {
    dark: { text: '#D7AA61', bg: 'rgba(215, 170, 97, 0.12)', border: 'rgba(215, 170, 97, 0.3)' },
    light: { text: '#A87532', bg: 'rgba(168, 117, 50, 0.08)', border: 'rgba(168, 117, 50, 0.25)' },
  },
  success: {
    dark: { text: '#79B69A', bg: 'rgba(121, 182, 154, 0.12)', border: 'rgba(121, 182, 154, 0.3)' },
    light: { text: '#36745F', bg: 'rgba(54, 116, 95, 0.08)', border: 'rgba(54, 116, 95, 0.25)' },
  },
  neutral: {
    dark: { text: '#A6B3AE', bg: 'rgba(166, 179, 174, 0.12)', border: 'rgba(166, 179, 174, 0.3)' },
    light: { text: '#647477', bg: 'rgba(100, 116, 119, 0.08)', border: 'rgba(100, 116, 119, 0.25)' },
  },
};

// Legacy compatibility object
export const colors = {
  background: {
    canvas: '#101A1D',
    subtle: '#19272A',
    surface: '#223336',
    elevated: '#293A3C',
    border: '#304144',
    borderFocus: '#79A99C',
  },
  copper: {
    primary: '#A95636',
    dark: '#C47A52',
    hover: '#8F462A',
    subtle: 'rgba(169, 86, 54, 0.08)',
  },
  spruce: {
    primary: '#356D68',
    dark: '#79A99C',
    hover: '#2A5753',
    subtle: 'rgba(53, 109, 104, 0.08)',
  },
  verified: {
    primary: '#36745F',
    dark: '#79B69A',
  },
  warning: {
    primary: '#A87532',
    dark: '#D7AA61',
  },
  danger: {
    primary: '#B64B46',
    dark: '#E17B70',
  },
};
