import { AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ModalConfirm({
  isOpen,
  onConfirm,
  onCancel,
  title,
  subtitle,
  message,
  confirmText,
  type = 'danger',
}) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in">
      <div className="bg-white dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative text-[#2B3542] dark:text-[#FAF3F3] transform transition-all duration-200 scale-100 ease-out">
        
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#A7BBC7] hover:text-[#2B3542] dark:hover:text-white hover:bg-[#FAF3F3] dark:hover:bg-[#252C36] transition duration-200 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl border shrink-0 ${
            type === 'warning' 
              ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900'
              : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900'
          }`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#2B3542] dark:text-[#FAF3F3]">
              {title || t('modal.deleteTitle')}
            </h3>
            <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7]">
              {subtitle || (type === 'danger' ? t('modal.deleteWarning') : '')}
            </p>
          </div>
        </div>

        {/* Modal Description Body */}
        <p className="text-xs text-[#2B3542]/90 dark:text-[#FAF3F3]/90 leading-relaxed bg-[#FAF3F3] dark:bg-[#252C36] p-3.5 rounded-2xl border border-[#E1E5EA] dark:border-[#2C3440]">
          {message || t('modal.deleteMessage')}
        </p>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2.5 pt-2">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#FAF3F3] dark:hover:bg-[#252C36] transition duration-200 text-xs font-bold cursor-pointer active:scale-95 text-center"
          >
            {t('btn.cancel')}
          </button>
          
          <button
            onClick={onConfirm}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-white text-xs transition duration-200 cursor-pointer shadow-md active:scale-95 text-center ${
              type === 'warning'
                ? 'bg-amber-500 hover:bg-amber-600'
                : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            {confirmText || (type === 'danger' ? t('btn.confirmDelete') : 'Konfirmasi')}
          </button>
        </div>

      </div>
    </div>
  );
}
