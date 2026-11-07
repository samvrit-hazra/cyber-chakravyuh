import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.tsx';

export function NetworkGlobeVisual() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const strokeRingColor = isDark ? 'rgba(139, 92, 246, 0.22)' : 'rgba(112, 65, 216, 0.16)';
  const strokeLineColor = isDark ? 'rgba(41, 45, 69, 0.8)' : 'rgba(229, 228, 236, 0.9)';
  const dotColor = isDark ? '#C47A52' : '#A95636';

  return (
    <div className="relative w-full max-w-[500px] h-[380px] sm:h-[440px] mx-auto flex items-center justify-center select-none">
      {/* Background Radial Glow */}
      <div
        className={`absolute inset-0 rounded-full blur-3xl transition-opacity duration-500 pointer-events-none ${
          isDark
            ? 'bg-gradient-to-tr from-[#C47A52]/15 via-[#6366F1]/10 to-transparent opacity-80'
            : 'bg-gradient-to-tr from-[#A95636]/10 via-[#C47A52]/5 to-transparent opacity-60'
        }`}
      />

      {/* SVG Orthographic Vector Wireframe Globe */}
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full relative z-10 transition-colors duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Orbit Rings */}
        <circle cx="250" cy="250" r="190" stroke={strokeRingColor} strokeWidth="1.2" strokeDasharray="4 6" />
        <ellipse cx="250" cy="250" rx="225" ry="85" transform="rotate(-24 250 250)" stroke={strokeRingColor} strokeWidth="1.2" />
        <ellipse cx="250" cy="250" rx="235" ry="110" transform="rotate(32 250 250)" stroke={strokeRingColor} strokeWidth="0.8" strokeDasharray="6 8" />

        {/* Globe Main Sphere Outline */}
        <circle
          cx="250"
          cy="250"
          r="150"
          stroke={isDark ? '#304144' : '#D9DED7'}
          strokeWidth="1.5"
          fill={isDark ? '#19272A' : '#FFFFFF'}
          fillOpacity={isDark ? '0.45' : '0.6'}
        />

        {/* Latitude Arcs */}
        <ellipse cx="250" cy="180" rx="125" ry="38" stroke={strokeLineColor} strokeWidth="1" strokeDasharray="3 4" />
        <ellipse cx="250" cy="250" rx="150" ry="46" stroke={strokeLineColor} strokeWidth="1.2" />
        <ellipse cx="250" cy="320" rx="125" ry="38" stroke={strokeLineColor} strokeWidth="1" strokeDasharray="3 4" />

        {/* Longitude Arcs */}
        <ellipse cx="250" cy="250" rx="48" ry="150" stroke={strokeLineColor} strokeWidth="1" strokeDasharray="4 4" />
        <ellipse cx="250" cy="250" rx="100" ry="150" stroke={strokeLineColor} strokeWidth="1" />

        {/* Constellation Nodes & Signal Beacons */}
        <g className="animate-pulse">
          <circle cx="210" cy="170" r="3.5" fill={dotColor} />
          <circle cx="280" cy="190" r="3" fill={dotColor} />
          <circle cx="330" cy="235" r="4" fill={isDark ? '#79B69A' : '#36745F'} />
          <circle cx="170" cy="260" r="3.5" fill={isDark ? '#E17B70' : '#B64B46'} />
          <circle cx="260" cy="310" r="3" fill={dotColor} />
          <circle cx="295" cy="275" r="2.5" fill={dotColor} />
          <circle cx="180" cy="205" r="2.5" fill={dotColor} />
        </g>

        {/* Connecting Vector Telemetry Threads */}
        <line x1="210" y1="170" x2="280" y2="190" stroke={strokeRingColor} strokeWidth="1" />
        <line x1="280" y1="190" x2="330" y2="235" stroke={strokeRingColor} strokeWidth="1" strokeDasharray="2 3" />
        <line x1="170" y1="260" x2="260" y2="310" stroke={strokeRingColor} strokeWidth="1" strokeDasharray="2 3" />
        <line x1="180" y1="205" x2="210" y2="170" stroke={strokeRingColor} strokeWidth="1" />
      </svg>

      {/* Floating Interactive Callout Badge 1: Phishing Attempt Detected (Mid-Left) */}
      <div
        className={`absolute left-0 sm:-left-4 top-[28%] z-20 px-3 py-1.5 rounded-full border shadow-lg flex items-center gap-2 backdrop-blur-md transition-all duration-300 hover:scale-105 ${
          isDark
            ? 'bg-[#223336]/90 border-[#304144] text-[#E8E6DC] shadow-[#000000]/50'
            : 'bg-white/95 border-[#D9DED7] text-[#182629] shadow-black/5'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#C47A52] animate-ping" />
        <span className="w-2 h-2 rounded-full bg-[#C47A52] -ml-4" />
        <span className="text-[11px] font-medium font-sans whitespace-nowrap">
          Phishing Attempt Detected
        </span>
      </div>

      {/* Floating Interactive Callout Badge 2: Malicious Domain Blocked (Top-Right) */}
      <div
        className={`absolute right-2 sm:-right-2 top-[12%] z-20 px-3 py-1.5 rounded-full border shadow-lg flex items-center gap-2 backdrop-blur-md transition-all duration-300 hover:scale-105 ${
          isDark
            ? 'bg-[#223336]/90 border-[#E17B70]/40 text-[#E17B70] shadow-[#000000]/50'
            : 'bg-white/95 border-[#B64B46]/30 text-[#B64B46] shadow-black/5'
        }`}
      >
        <AlertTriangle className="w-3.5 h-3.5 text-[#E17B70] dark:text-[#E17B70] shrink-0" />
        <span className="text-[11px] font-medium font-sans whitespace-nowrap">
          Malicious Domain Blocked
        </span>
      </div>

      {/* Floating Interactive Callout Badge 3: Safe to Visit (Bottom-Right) */}
      <div
        className={`absolute right-4 sm:right-6 bottom-[18%] z-20 px-3 py-1.5 rounded-full border shadow-lg flex items-center gap-2 backdrop-blur-md transition-all duration-300 hover:scale-105 ${
          isDark
            ? 'bg-[#223336]/90 border-[#79B69A]/40 text-[#79B69A] shadow-[#000000]/50'
            : 'bg-white/95 border-[#36745F]/30 text-[#36745F] shadow-black/5'
        }`}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-[#79B69A] dark:text-[#79B69A] shrink-0" />
        <span className="text-[11px] font-medium font-sans whitespace-nowrap">
          Safe to Visit
        </span>
      </div>
    </div>
  );
}
