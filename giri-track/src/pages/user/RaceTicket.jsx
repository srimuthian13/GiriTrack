import { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RaceContext } from '../../context/RaceContext';
import { CheckCircle2, Calendar, MapPin, Printer, ChevronLeft, Award, Shirt, HeartPulse } from 'lucide-react';

export default function RaceTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRegistrationById, getRaceById } = useContext(RaceContext);

  const registration = getRegistrationById(id);
  const race = registration ? getRaceById(registration.raceId) : null;

  useEffect(() => {
    if (!registration || !race) {
      navigate('/races');
    }
  }, [registration, race, navigate]);

  if (!registration || !race) return null;

  const category = race.categories.find(c => c.id === registration.categoryId);
  
  // Format BIB number e.g. BIB-25K-019
  const catCode = category?.name ? category.name.split(' ')[0].toUpperCase() : 'RUN';
  const regNumber = String(registration.id || '001').slice(-3);
  const bibNumber = `BIB-${catCode}-${regNumber.padStart(3, '0')}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
      
      {/* Print CSS Injection */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-e-bib, #printable-e-bib * {
            visibility: visible;
          }
          #printable-e-bib {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="mb-6 no-print">
        <button 
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#6B7C8C] dark:text-[#A7BBC7] hover:text-[#DA7F8F] dark:hover:text-[#DA7F8F] transition-all cursor-pointer active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
      </div>

      <div 
        id="printable-e-bib"
        className="bg-white dark:bg-[#1C2129] rounded-3xl shadow-2xl border border-[#E1E5EA] dark:border-[#2C3440] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-500"
      >
        
        {/* E-BIB Header */}
        <div className="bg-[#452829] p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-15 pointer-events-none">
            <Award className="w-32 h-32 text-white" />
          </div>
          <div className="relative z-10 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>TIKET E-BIB RESMI (STATUS: PAID)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">{race.title}</h1>
            <p className="text-white/80 text-xs flex items-center justify-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#DA7F8F]" />
              <span>{race.location}</span>
            </p>
          </div>
        </div>

        {/* Notches */}
        <div className="flex justify-between items-center -mt-3 -mb-3 z-20">
          <div className="w-6 h-6 rounded-full bg-[#FAF3F3] dark:bg-[#14171C] -ml-3 border-r border-[#E1E5EA] dark:border-[#2C3440]" />
          <div className="flex-1 border-t-2 border-dashed border-[#E1E5EA] dark:border-[#2C3440]" />
          <div className="w-6 h-6 rounded-full bg-[#FAF3F3] dark:bg-[#14171C] -mr-3 border-l border-[#E1E5EA] dark:border-[#2C3440]" />
        </div>

        {/* BIB Number Big Display Card */}
        <div className="p-6 bg-[#FAF3F3] dark:bg-[#14171C] text-center border-b border-[#E1E5EA] dark:border-[#2C3440]">
          <span className="text-xs font-bold uppercase tracking-widest text-[#6B7C8C] dark:text-[#A7BBC7] block mb-1">
            NOMOR DADA (RACE BIB)
          </span>
          <div className="text-4xl sm:text-5xl font-black font-mono tracking-widest text-[#452829] dark:text-[#DA7F8F] drop-shadow-sm">
            {bibNumber}
          </div>
          <div className="inline-block mt-3 px-4 py-1 rounded-full bg-[#DA7F8F]/15 text-[#DA7F8F] font-bold text-xs border border-[#DA7F8F]/30">
            Kategori: {category?.name || 'Trail Run'} ({category?.distance})
          </div>
        </div>

        {/* Ticket Details Body */}
        <div className="p-6 space-y-5 bg-white dark:bg-[#1C2129]">
          
          <div className="grid grid-cols-2 gap-4 text-xs border-b border-[#E1E5EA] dark:border-[#2C3440] pb-4">
            <div>
              <p className="text-[10px] font-bold text-[#6B7C8C] dark:text-[#A7BBC7] uppercase">Nama Peserta</p>
              <p className="font-black text-sm text-[#2B3542] dark:text-[#FAF3F3] truncate">{registration.name}</p>
              {registration.nik && (
                <p className="text-[10px] font-mono text-[#6B7C8C] dark:text-[#A7BBC7] mt-0.5">NIK: {registration.nik}</p>
              )}
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#6B7C8C] dark:text-[#A7BBC7] uppercase">Tanggal Pelaksanaan</p>
              <p className="font-bold text-[#2B3542] dark:text-[#FAF3F3]">
                {new Date(race.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-[#FAF3F3] dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440]">
              <Shirt className="w-4 h-4 mx-auto text-[#DA7F8F] mb-1" />
              <p className="text-[9px] text-[#6B7C8C] dark:text-[#A7BBC7] uppercase font-bold">Jersey</p>
              <p className="text-xs font-black text-[#2B3542] dark:text-[#FAF3F3]">{registration.jerseySize || 'M'}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#FAF3F3] dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440]">
              <HeartPulse className="w-4 h-4 mx-auto text-rose-500 mb-1" />
              <p className="text-[9px] text-[#6B7C8C] dark:text-[#A7BBC7] uppercase font-bold">Gol. Darah</p>
              <p className="text-xs font-black text-[#2B3542] dark:text-[#FAF3F3]">{registration.bloodType || 'A'}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#FAF3F3] dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440]">
              <Calendar className="w-4 h-4 mx-auto text-amber-500 mb-1" />
              <p className="text-[9px] text-[#6B7C8C] dark:text-[#A7BBC7] uppercase font-bold">COT</p>
              <p className="text-xs font-black text-[#2B3542] dark:text-[#FAF3F3]">{category?.cot || '8 Jam'}</p>
            </div>
          </div>

          {/* QR Verification Barcode */}
          <div className="flex flex-col items-center justify-center p-4 bg-[#FAF3F3]/60 dark:bg-[#14171C] rounded-2xl border border-[#E1E5EA] dark:border-[#2C3440] text-center">
            <div className="w-32 h-32 bg-white p-2 rounded-xl border border-gray-300 shadow-inner flex items-center justify-center mb-2">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=GIRITRACK_BIB_VERIFY_${registration.id}_${bibNumber}`} 
                alt="BIB Verification QR" 
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-[10px] text-[#6B7C8C] dark:text-[#A7BBC7] font-mono font-bold tracking-wider">
              VERIFICATION CODE: {bibNumber}
            </p>
            <p className="text-[9px] text-[#6B7C8C] dark:text-[#A7BBC7]">
              Tunjukkan E-BIB ini saat pengambilan Race Pack (RPC) di Basecamp Event
            </p>
          </div>

        </div>

        {/* Actions Button */}
        <div className="no-print p-4 bg-[#FAF3F3] dark:bg-[#14171C] border-t border-[#E1E5EA] dark:border-[#2C3440]">
          <button 
            onClick={handlePrint}
            className="w-full py-3 rounded-xl bg-[#DA7F8F] hover:bg-[#c96c7d] text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak E-BIB / Simpan PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
}
