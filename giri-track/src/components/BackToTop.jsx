import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Kembali ke atas"
      title="Kembali ke Atas"
      className="fixed bottom-20 md:bottom-8 right-4 sm:right-6 z-40 p-3 rounded-full bg-[#DA7F8F] hover:bg-[#c96c7d] text-white shadow-xl shadow-[#DA7F8F]/30 hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 backdrop-blur-md border border-white/20 cursor-pointer flex items-center justify-center animate-in fade-in zoom-in-75 duration-200 group"
    >
      <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
    </button>
  );
}
