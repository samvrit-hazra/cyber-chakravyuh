import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.tsx';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md';
}

export function ThemeToggle({ className = '', size = 'md' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const sizeClasses =
    size === 'sm'
      ? 'w-8 h-8 p-1.5'
      : 'w-9 h-9 p-2';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`relative inline-flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer select-none border active:scale-[0.92] ${
        isDark
          ? 'bg-[#223336] hover:bg-[#293A3C] border-[#304144] text-[#A6B3AE] hover:text-[#E8E6DC]'
          : 'bg-[#EAECE6] hover:bg-[#D9DED7] border-[#D9DED7] text-[#647477] hover:text-[#182629]'
      } ${sizeClasses} ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-[#D7AA61] transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-[#A95636] transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}
