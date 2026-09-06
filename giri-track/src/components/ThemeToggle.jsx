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
          ? 'bg-white text-[#2B3542] border-[#E1E5EA] hover:bg-[#FAF3F3]'
          : 'bg-[#252C36] text-[#FAF3F3] border-[#2C3440] hover:bg-[#2C3440]'
      } ${className}`}
      title={isLight ? 'Mode Terang (Klik untuk beralih ke Mode Gelap)' : 'Mode Gelap (Klik untuk beralih ke Mode Terang)'}
      aria-label="Toggle Theme Mode"
    >
      {isLight ? (
        <>
          <Sun className="w-4 h-4 text-[#DA7F8F] fill-[#DA7F8F]/30 shrink-0" />
          <span className="hidden sm:inline text-[#2B3542]">Mode Terang</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-amber-300 fill-amber-300/20 shrink-0" />
          <span className="hidden sm:inline text-[#FAF3F3]">Mode Gelap</span>
        </>
      )}
    </button>
  );
}
