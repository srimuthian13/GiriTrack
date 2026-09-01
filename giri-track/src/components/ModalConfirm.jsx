import { AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ModalConfirm({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
}) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in">
      <div className="bg-white dark:bg-[#2D1C1D] border border-[#DBC4B6] dark:border-[#57595B]/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative text-[#452829] dark:text-[#F3E8DF] transform transition-all duration-200 scale-100 ease-out">
        
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-[#EFE4DC] dark:hover:bg-[#3F2728] transition duration-200 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#452829] dark:text-[#F3E8DF]">
              {title || t('modal.confirmDeleteTitle')}
            </h3>
            <p className="text-xs text-[#57595B] dark:text-[#E8D1C5]">
              {t('modal.cannotUndo')}
            </p>
          </div>
        </div>

        {/* Modal Description Body */}
        <p className="text-xs text-[#452829]/90 dark:text-[#F3E8DF]/90 leading-relaxed bg-[#EFE4DC]/50 dark:bg-[#3F2728]/40 p-3.5 rounded-2xl border border-[#DBC4B6]/40 dark:border-[#57595B]/30">
          {message || t('modal.confirmDeleteMsg')}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-[#DBC4B6] dark:border-[#57595B]/40 text-[#452829] dark:text-[#E8D1C5] hover:bg-[#EFE4DC] dark:hover:bg-[#3F2728] transition duration-200 text-xs font-bold cursor-pointer active:scale-95"
          >
            {t('btn.cancel')}
          </button>
          
          <button
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 font-bold text-xs transition duration-200 cursor-pointer shadow-md active:scale-95"
          >
            {t('btn.deleteConfirm')}
          </button>
        </div>

      </div>
    </div>
  );
}
