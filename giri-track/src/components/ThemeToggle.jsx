import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();

  const isLight = theme === 'light';

  return (
    <button
      onClick={toggleTheme}
      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center gap-1.5 ${
        isLight
          ? 'bg-[#EFE4DC] text-[#452829] border-[#DBC4B6] hover:bg-[#DBC4B6]'
          : 'dark:bg-[#3F2728] dark:text-[#E8D1C5] dark:border-[#57595B]/60 dark:hover:bg-[#4a2e2f]'
      } ${className}`}
      title={isLight ? 'Mode Terang (Klik untuk beralih ke Mode Gelap)' : 'Mode Gelap (Klik untuk beralih ke Mode Terang)'}
      aria-label="Toggle Theme Mode"
    >
      {isLight ? (
        <>
          <Sun className="w-4 h-4 text-amber-600 fill-amber-500/30 shrink-0" />
          <span className="hidden sm:inline text-[#452829]">Mode Terang</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-amber-300 fill-amber-300/20 shrink-0" />
          <span className="hidden sm:inline text-[#E8D1C5]">Mode Gelap</span>
        </>
      )}
    </button>
  );
}
