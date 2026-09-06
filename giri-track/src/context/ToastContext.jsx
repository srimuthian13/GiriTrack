/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, Heart, Star, Sparkles, X, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, options = {}) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const type = options.type || 'success'; // 'success' | 'favorite' | 'star' | 'info' | 'error'
    const duration = options.duration || 3200;

    const newToast = {
      id,
      message,
      type,
      title: options.title || '',
    };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);

    return id;
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Floating Animated Toast Container (Top Right) */}
      <div className="fixed top-20 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          let icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
          let bgStyle = 'bg-white/95 dark:bg-[#1C2129]/95 border-emerald-500/40 text-[#2B3542] dark:text-[#FAF3F3] shadow-xl';

          if (toast.type === 'favorite') {
            icon = <Heart className="w-5 h-5 text-[#DA7F8F] fill-[#DA7F8F] shrink-0 animate-pulse" />;
            bgStyle = 'bg-white/95 dark:bg-[#1C2129]/95 border-[#DA7F8F]/50 text-[#2B3542] dark:text-[#FAF3F3] shadow-xl';
          } else if (toast.type === 'star') {
            icon = <Star className="w-5 h-5 text-amber-500 fill-amber-500 shrink-0 animate-bounce" />;
            bgStyle = 'bg-white/95 dark:bg-[#1C2129]/95 border-amber-400/50 text-[#2B3542] dark:text-[#FAF3F3] shadow-xl';
          } else if (toast.type === 'error') {
            icon = <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
            bgStyle = 'bg-white/95 dark:bg-[#1C2129]/95 border-rose-500/50 text-[#2B3542] dark:text-[#FAF3F3] shadow-xl';
          } else if (toast.type === 'info') {
            icon = <Info className="w-5 h-5 text-[#3D5A70] dark:text-[#A7BBC7] shrink-0" />;
            bgStyle = 'bg-white/95 dark:bg-[#1C2129]/95 border-[#A7BBC7]/50 text-[#2B3542] dark:text-[#FAF3F3] shadow-xl';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 animate-in fade-in slide-in-from-top-4 ${bgStyle}`}
            >
              <div className="flex items-center gap-3">
                {icon}
                <div>
                  {toast.title && (
                    <p className="text-xs font-black tracking-tight">{toast.title}</p>
                  )}
                  <p className="text-xs font-semibold leading-snug">{toast.message}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer transition shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
