import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RaceContext } from '../../context/RaceContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Ticket, Calendar, QrCode, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function MyTickets() {
  const navigate = useNavigate();
  const { registrations } = useContext(RaceContext);
  const { currentUser, isAdmin } = useAuth();
  const { t, language } = useLanguage();

  // Filter tickets by current user email
  const myTickets = registrations.filter(t => (t.userEmail || t.email) === currentUser?.email);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 min-h-[70vh]">
      {/* Back Button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#6B7C8C] dark:text-[#A7BBC7] hover:text-[#DA7F8F] dark:hover:text-[#DA7F8F] transition-all cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('btn.back') || 'Kembali'}</span>
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#2B3542] dark:text-[#FAF3F3] mb-2 flex items-center gap-3">
          <Ticket className="w-8 h-8 text-[#DA7F8F]" />
          {t('myTickets.title')}
        </h1>
        <p className="text-[#6B7C8C] dark:text-[#A7BBC7] text-sm">
          {t('myTickets.subtitle')}
        </p>
      </div>

      {isAdmin && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
            👑 Anda masuk sebagai <strong>Admin GiriTrack</strong>. Sebagai admin, Anda dapat menambah dan mengelola event lomba trail.
          </p>
          <Link
            to="/admin/races"
            className="px-4 py-2 bg-[#DA7F8F] hover:bg-[#c96c7d] text-white text-xs font-bold rounded-xl transition shrink-0"
          >
            Kelola & Tambah Lomba
          </Link>
        </div>
      )}

      {myTickets.length === 0 ? (
        <div className="bg-white dark:bg-[#1C2129] rounded-3xl p-10 text-center border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm flex flex-col items-center justify-center min-h-[40vh]">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Ticket className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-[#2B3542] dark:text-[#FAF3F3] mb-2">{t('myTickets.noTicketsTitle')}</h2>
          <p className="text-[#6B7C8C] dark:text-[#A7BBC7] mb-6 max-w-md">
            {t('myTickets.noTicketsDesc')}
          </p>
          <Link 
            to={isAdmin ? "/admin/races" : "/races"}
            className="px-6 py-3 bg-[#452829] hover:bg-[#3A231C] text-white font-bold rounded-xl transition-colors flex items-center gap-2"
          >
            {isAdmin ? 'Kelola & Tambah Lomba' : t('btn.findRace')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {myTickets.map(ticket => (
            <div key={ticket.id} className="bg-white dark:bg-[#1C2129] rounded-2xl sm:rounded-3xl shadow-md border border-[#E1E5EA] dark:border-[#2C3440] overflow-hidden flex flex-col sm:flex-row group transition-all hover:shadow-lg">
              
              {/* Left Side (Info) */}
              <div className="flex-1 p-5 sm:p-7 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Ticket className="w-32 h-32 text-[#2B3542] dark:text-white" />
                </div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-4 border border-emerald-200 dark:border-emerald-800/50">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t('myTickets.statusPrefix')}: {ticket.status || 'PAID'}</span>
                  </div>
                  
                  <h2 className="text-xl sm:text-2xl font-black text-[#2B3542] dark:text-[#FAF3F3] mb-1 line-clamp-1">
                    {ticket.raceTitle || 'Trail Race Event'}
                  </h2>
                  <p className="text-[#DA7F8F] font-bold text-sm mb-4">
                    {t('myTickets.categoryLabel')}: {ticket.categoryName || '-'}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-6 pt-6 border-t border-[#E1E5EA] dark:border-[#2C3440]">
                    <div>
                      <p className="text-[10px] font-bold text-[#6B7C8C] dark:text-[#A7BBC7] uppercase tracking-wider mb-1">{t('myTickets.participantLabel')}</p>
                      <p className="font-bold text-[#2B3542] dark:text-[#FAF3F3] text-sm">{ticket.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#6B7C8C] dark:text-[#A7BBC7] uppercase tracking-wider mb-1">{t('myTickets.transactionDate')}</p>
                      <p className="font-bold text-[#2B3542] dark:text-[#FAF3F3] text-sm flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#DA7F8F]" />
                        {new Date(ticket.paymentDate || ticket.date).toLocaleDateString(
                          language === 'en' ? 'en-US' : 'id-ID',
                          { day: 'numeric', month: 'short', year: 'numeric' }
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#6B7C8C] dark:text-[#A7BBC7] uppercase tracking-wider mb-1">{t('myTickets.feeLabel')}</p>
                      <p className="font-bold text-[#2B3542] dark:text-[#FAF3F3] text-sm">
                        Rp {ticket.price ? ticket.price.toLocaleString('id-ID') : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Divider (Notches) */}
              <div className="hidden sm:flex flex-col justify-between items-center -mx-3 z-20 w-6">
                <div className="w-6 h-6 rounded-full bg-gray-50 dark:bg-[#14171C] -mt-3 border-b border-[#E1E5EA] dark:border-[#2C3440]" />
                <div className="h-full border-l-2 border-dashed border-[#E1E5EA] dark:border-[#2C3440]" />
                <div className="w-6 h-6 rounded-full bg-gray-50 dark:bg-[#14171C] -mb-3 border-t border-[#E1E5EA] dark:border-[#2C3440]" />
              </div>

              <div className="sm:hidden flex justify-between items-center -my-3 z-20 h-6">
                <div className="w-6 h-6 rounded-full bg-gray-50 dark:bg-[#14171C] -ml-3 border-r border-[#E1E5EA] dark:border-[#2C3440]" />
                <div className="w-full border-t-2 border-dashed border-[#E1E5EA] dark:border-[#2C3440]" />
                <div className="w-6 h-6 rounded-full bg-gray-50 dark:bg-[#14171C] -mr-3 border-l border-[#E1E5EA] dark:border-[#2C3440]" />
              </div>

              {/* Right Side (QR & Action) */}
              <div className="w-full sm:w-64 bg-[#FAF3F3] dark:bg-[#252C36] p-5 sm:p-7 flex flex-col items-center justify-center text-center">
                <p className="text-[10px] font-bold text-[#6B7C8C] dark:text-[#A7BBC7] uppercase tracking-widest mb-2">Race BIB</p>
                <h3 className="text-2xl font-black font-mono text-[#452829] dark:text-[#DA7F8F] mb-4">
                  {ticket.bibNumber || 'BIB-???'}
                </h3>
                
                <div className="w-24 h-24 bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm mb-4 flex items-center justify-center">
                  {ticket.bibNumber ? (
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=GIRITRACK_BIB_VERIFY_${ticket.id}_${ticket.bibNumber}`} 
                      alt="QR" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <QrCode className="w-12 h-12 text-gray-300" />
                  )}
                </div>

                <Link 
                  to={`/races/ticket/${ticket.ticketId || ticket.id}`}
                  className="w-full py-2.5 px-4 bg-[#DA7F8F] hover:bg-[#c96c7d] text-white font-bold text-xs rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  {t('btn.downloadBib')}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
