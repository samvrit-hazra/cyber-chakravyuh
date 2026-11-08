import { useTheme } from '../../context/ThemeContext.tsx';

interface NetworkBackgroundProps {
  opacity?: number;
  nodeCount?: number;
}

export function NetworkBackground({ opacity = 0.15 }: NetworkBackgroundProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
      style={{
        opacity,
        backgroundImage: isDark
          ? `radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.08) 0%, transparent 60%), radial-gradient(circle at 100% 100%, rgba(99, 102, 241, 0.04) 0%, transparent 50%)`
          : `radial-gradient(circle at 50% 0%, rgba(112, 65, 216, 0.04) 0%, transparent 60%), radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.02) 0%, transparent 50%)`,
      }}
      aria-hidden="true"
    />
  );
}
