import { X, CheckCircle, CreditCard, ShieldCheck, QrCode, Building2, Timer } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function RacePaymentModal({ isOpen, onClose, onConfirm, amount }) {
  const [paymentMethod, setPaymentMethod] = useState('qris'); // 'qris' | 'va'
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(false);
        setTimeLeft(15 * 60);
        setPaymentMethod('qris');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // 15 Minutes Countdown Timer
  useEffect(() => {
    if (!isOpen || isSuccess) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isSuccess]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onConfirm();
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1C2129] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-[#E1E5EA] dark:border-[#2C3440]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-[#E1E5EA] dark:border-[#2C3440]">
          <h3 className="font-bold text-base sm:text-lg text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-500" />
            <span>Pembayaran Registrasi Lomba</span>
          </h3>
          {!isProcessing && !isSuccess && (
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#2C3440] text-gray-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in slide-in-from-bottom-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <h4 className="text-xl font-bold text-[#2B3542] dark:text-[#FAF3F3] mb-2">Pembayaran Berhasil!</h4>
              <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7]">Status tiket diubah menjadi PAID. Menyiapkan nomor BIB digital Anda...</p>
            </div>
          ) : (
            <>
              {/* Total & Timer Banner */}
              <div className="bg-[#FAF3F3] dark:bg-[#14171C] rounded-2xl p-4 flex items-center justify-between border border-[#E1E5EA] dark:border-[#2C3440]">
                <div>
                  <span className="text-[11px] text-[#6B7C8C] dark:text-[#A7BBC7] block">Total Biaya</span>
                  <span className="text-2xl font-black text-[#DA7F8F]">
                    Rp {amount.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#6B7C8C] dark:text-[#A7BBC7] flex items-center gap-1 justify-end font-semibold">
                    <Timer className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    Batas Waktu
                  </span>
                  <span className="text-lg font-mono font-black text-amber-600 dark:text-amber-400">
                    {formattedTime}
                  </span>
                </div>
              </div>

              {/* Method Selector Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#FAF3F3] dark:bg-[#252C36] rounded-xl border border-[#E1E5EA] dark:border-[#2C3440]">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${paymentMethod === 'qris' ? 'bg-[#DA7F8F] text-white shadow-sm' : 'text-[#6B7C8C] dark:text-[#A7BBC7]'}`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>QRIS Instant</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('va')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${paymentMethod === 'va' ? 'bg-[#DA7F8F] text-white shadow-sm' : 'text-[#6B7C8C] dark:text-[#A7BBC7]'}`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Virtual Account</span>
                </button>
              </div>

              {/* Dynamic Payment Body */}
              {paymentMethod === 'qris' ? (
                <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-[#14171C] rounded-2xl border border-[#E1E5EA] dark:border-[#2C3440] text-center space-y-2">
                  <div className="w-40 h-40 bg-white p-2.5 rounded-xl border border-gray-300 shadow-md flex items-center justify-center">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=GIRITRACK_RACE_PAY_${amount}`} 
                      alt="QRIS Code" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-[11px] text-[#6B7C8C] dark:text-[#A7BBC7] font-medium">
                    Scan QRIS dengan GoPay, OVO, ShopeePay, DANA, atau M-Banking Anda
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-white dark:bg-[#14171C] rounded-2xl border border-[#E1E5EA] dark:border-[#2C3440] space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#6B7C8C] dark:text-[#A7BBC7]">Bank Mandiri / BCA VA</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">8807 0812 9901 2341</span>
                  </div>
                  <p className="text-[11px] text-[#6B7C8C] dark:text-[#A7BBC7]">
                    Transfer tepat ke nomor Rekening Virtual di atas. Sistem akan memverifikasi secara otomatis.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#6B7C8C] dark:text-[#A7BBC7]">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Simulasi Mode Pembayaran Langsung Tanpa Merchant Real</span>
              </div>

              {/* Simulasikan Bayar Berhasil Button */}
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex justify-center items-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memproses Verifikasi...</span>
                  </>
                ) : (
                  <span>Simulasikan Bayar Berhasil</span>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
