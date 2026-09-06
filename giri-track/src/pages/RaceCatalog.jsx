import React, { useState, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { RaceContext } from '../context/RaceContext';
import { MapPin, Calendar, Users, Target, ArrowRight, Activity, Filter, RotateCcw, AlertCircle, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const EARTH_TONES = ['#452829', '#233729', '#1E2836', '#3A231C'];

// Daftar 12 Bulan Lengkap
const ALL_MONTHS = [
  { value: '1', idLabel: 'Januari', enLabel: 'January' },
  { value: '2', idLabel: 'Februari', enLabel: 'February' },
  { value: '3', idLabel: 'Maret', enLabel: 'March' },
  { value: '4', idLabel: 'April', enLabel: 'April' },
  { value: '5', idLabel: 'Mei', enLabel: 'May' },
  { value: '6', idLabel: 'Juni', enLabel: 'June' },
  { value: '7', idLabel: 'Juli', enLabel: 'July' },
  { value: '8', idLabel: 'Agustus', enLabel: 'August' },
  { value: '9', idLabel: 'September', enLabel: 'September' },
  { value: '10', idLabel: 'Oktober', enLabel: 'October' },
  { value: '11', idLabel: 'November', enLabel: 'November' },
  { value: '12', idLabel: 'Desember', enLabel: 'December' },
];

// Daftar Wilayah / Provinsi Indonesia
const INDONESIAN_PROVINCES = [
  'Bali',
  'DI Yogyakarta',
  'DKI Jakarta',
  'Jawa Barat',
  'Jawa Tengah',
  'Jawa Timur',
  'Nusa Tenggara Barat',
  'Nusa Tenggara Timur',
  'Sulawesi Selatan',
  'Sulawesi Utara',
  'Sumatera Barat',
  'Sumatera Utara',
  'Papua'
];

export default function RaceCatalog() {
  const { races } = useContext(RaceContext);
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  // State filter
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [showNoResultModal, setShowNoResultModal] = useState(true);

  // Daftar provinsi unik yang digabungkan dari races dan daftar provinsi utama
  const provinces = useMemo(() => {
    const provSet = new Set(INDONESIAN_PROVINCES);
    races.forEach((race) => {
      if (race.location) {
        const parts = race.location.split(',');
        const prov = parts[parts.length - 1]?.trim();
        if (prov) provSet.add(prov);
      }
    });
    return Array.from(provSet).sort((a, b) => a.localeCompare(b));
  }, [races]);

  // Hasil filter
  const filteredRaces = useMemo(() => {
    return races.filter((race) => {
      // Filter Wilayah/Provinsi
      const matchesProvince =
        selectedProvince === 'all' ||
        race.location?.toLowerCase().includes(selectedProvince.toLowerCase());

      // Filter Bulan (1-12)
      let matchesMonth = true;
      if (selectedMonth !== 'all') {
        const raceDate = new Date(race.date);
        const monthNum = (raceDate.getMonth() + 1).toString();
        matchesMonth = monthNum === selectedMonth;
      }

      return matchesProvince && matchesMonth;
    });
  }, [races, selectedProvince, selectedMonth]);

  const isFiltered = selectedMonth !== 'all' || selectedProvince !== 'all';

  const handleResetFilter = () => {
    setSelectedMonth('all');
    setSelectedProvince('all');
  };

  const getSelectedMonthName = () => {
    if (selectedMonth === 'all') return language === 'id' ? 'Semua Bulan' : 'All Months';
    const found = ALL_MONTHS.find(m => m.value === selectedMonth);
    return found ? (language === 'id' ? found.idLabel : found.enLabel) : selectedMonth;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Sejajar dengan Kontrol Filter Dropdown */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-stone-200 dark:border-stone-800/80">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#2B3542] dark:text-[#FAF3F3] mb-2 drop-shadow-sm tracking-tight">
            {t('races.catalogTitle') || 'GiriTrack Races'}
          </h1>
          <p className="text-[#6B7C8C] dark:text-[#A7BBC7] max-w-xl text-sm sm:text-base">
            {t('races.catalogSubtitle') || 'Tantang batas kemampuanmu di event lari lintas alam resmi kami.'}
          </p>
        </div>

        {/* Dropdown Filter Bulan dan Wilayah Sejajar dengan React Icons */}
        <div className="flex flex-wrap items-center gap-3 bg-stone-900/70 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-stone-800 shadow-md">
          {/* Filter Bulan (12 Bulan Lengkap dengan React Icon Calendar) */}
          <div className="relative flex items-center">
            <Calendar className="w-4 h-4 text-rose-400 absolute left-3 pointer-events-none z-10" />
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setShowNoResultModal(true);
              }}
              className="bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-200 rounded-xl pl-9 pr-8 py-2 text-sm focus:outline-none focus:border-rose-500 transition-colors cursor-pointer appearance-none font-medium"
            >
              <option value="all">
                {language === 'id' ? 'Semua Bulan' : 'All Months'}
              </option>
              {ALL_MONTHS.map((m) => (
                <option key={m.value} value={m.value} className="bg-stone-900 text-stone-200">
                  {language === 'id' ? m.idLabel : m.enLabel}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 pointer-events-none" />
          </div>

          {/* Filter Provinsi / Wilayah dengan React Icon MapPin */}
          <div className="relative flex items-center">
            <MapPin className="w-4 h-4 text-rose-400 absolute left-3 pointer-events-none z-10" />
            <select
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setShowNoResultModal(true);
              }}
              className="bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-200 rounded-xl pl-9 pr-8 py-2 text-sm focus:outline-none focus:border-rose-500 transition-colors cursor-pointer appearance-none font-medium"
            >
              <option value="all">
                {language === 'id' ? 'Semua Wilayah' : 'All Regions'}
              </option>
              {provinces.map((prov) => (
                <option key={prov} value={prov} className="bg-stone-900 text-stone-200">
                  {prov}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 pointer-events-none" />
          </div>

          {/* Tombol Reset Filter jika ada filter aktif */}
          {isFiltered && (
            <button
              onClick={handleResetFilter}
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-stone-800 hover:bg-stone-700 text-rose-400 hover:text-rose-300 border border-stone-700 hover:border-rose-500/50 transition-all duration-200 active:scale-95 cursor-pointer shadow-sm"
              title="Reset Filter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* POP-UP / TOAST NOTIFIKASI KECIL DI ATAS LAYAR KETIKA TIDAK ADA HASIL */}
      {filteredRaces.length === 0 && showNoResultModal && (
        <div className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-auto min-w-[320px] max-w-lg transition-all duration-300 ease-out">
          <div className="bg-stone-900/95 backdrop-blur-md border border-rose-500/30 text-white rounded-2xl p-3 sm:px-4 sm:py-3 shadow-2xl shadow-black/70 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="truncate text-left">
                <p className="text-xs font-bold text-rose-300">
                  {language === 'id' ? 'Tidak Ada Event' : 'No Events Found'}
                </p>
                <p className="text-[11px] text-stone-300 truncate">
                  {selectedProvince === 'all' ? (language === 'id' ? 'Semua Wilayah' : 'All Regions') : selectedProvince} • {getSelectedMonthName()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleResetFilter}
                type="button"
                className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-all active:scale-95 cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
              <button
                onClick={() => setShowNoResultModal(false)}
                type="button"
                className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors"
                title="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid Kartu Lomba ATAU Tampilan Box Kosong */}
      {filteredRaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-stone-900/40 dark:bg-stone-900/60 rounded-3xl border border-dashed border-stone-750 text-center max-w-xl mx-auto my-6">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4 text-rose-400">
            <Filter className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {language === 'id' ? 'Event Tidak Ditemukan' : 'No Events Found'}
          </h3>
          <p className="text-stone-400 text-sm max-w-md mb-6 leading-relaxed">
            {language === 'id' 
              ? 'Tidak ada event lomba pada filter wilayah atau bulan yang Anda pilih saat ini.'
              : 'No race events match the selected region or month filters.'}
          </p>
          <button
            onClick={handleResetFilter}
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{language === 'id' ? 'Reset Filter' : 'Reset Filter'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredRaces.map((race, index) => {
            const colorIndex = Math.abs(index);
            const cardBgColor = EARTH_TONES[colorIndex % EARTH_TONES.length];

            // Calculate total quota and slots taken
            const totalQuota = race.categories.reduce((acc, cat) => acc + cat.quota, 0);
            const totalSlotsTaken = race.categories.reduce((acc, cat) => acc + cat.slotsTaken, 0);
            const isSoldOut = totalSlotsTaken >= totalQuota;

            return (
              <div
                key={race.id}
                onClick={() => navigate(`/races/${race.id}`)}
                className="group relative flex flex-col rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-[#E1E5EA]/60 dark:border-[#2C3440]/80 cursor-pointer select-none"
              >
                {/* ATAS: Foto */}
                <div className="relative h-56 w-full overflow-hidden bg-stone-900">
                  <img
                    src={race.banner}
                    alt={race.title}
                    className="h-56 object-cover w-full group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20" />
                  
                  {/* Date Badge */}
                  <div className="absolute top-3.5 right-3.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/25 text-white shadow-md flex items-center gap-1.5 z-20">
                    <Calendar className="w-3.5 h-3.5 text-[#E8D1C5]" />
                    <span className="text-xs font-bold">
                      {new Date(race.date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="absolute bottom-3.5 left-4 right-4 flex items-center gap-1.5 text-xs font-medium text-white/90 drop-shadow-md z-10">
                    <MapPin className="w-3.5 h-3.5 text-[#DA7F8F] shrink-0" />
                    <span className="truncate">{race.location}</span>
                  </div>
                </div>

                {/* BAWAH: Info */}
                <div
                  style={{ backgroundColor: cardBgColor }}
                  className="p-5 sm:p-6 flex-1 flex flex-col justify-between text-white relative transition-colors duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/15 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/70">
                      <Activity className="w-3.5 h-3.5 text-[#E8D1C5]" />
                      <span>{t('races.cardBadge') || 'Trail Race Event'}</span>
                    </div>

                    <h3 className="font-bold text-white text-xl line-clamp-2 mt-1 leading-tight drop-shadow-sm group-hover:text-[#FAF3F3] transition-colors">
                      {race.title}
                    </h3>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {race.categories.map(cat => (
                        <span key={cat.id} className="px-2 py-0.5 rounded-md bg-white/10 border border-white/20 text-[10px] font-semibold">
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="relative z-10 grid grid-cols-2 gap-2 py-2.5 px-3 my-4 rounded-2xl bg-black/25 backdrop-blur-sm border border-white/15 text-center text-white">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1 text-white/70 text-[11px] mb-0.5">
                        <Target className="w-3 h-3 text-[#E8D1C5]" />
                        <span>{t('races.categoryLabel') || 'Kategori'}</span>
                      </div>
                      <span className="text-xs sm:text-sm font-black text-white">
                        {race.categories.length} <span className="text-[10px] font-normal text-white/80">{t('races.categoryLabel') || 'Kategori'}</span>
                      </span>
                    </div>

                    <div className="flex flex-col items-center border-l border-white/15">
                      <div className="flex items-center gap-1 text-white/70 text-[11px] mb-0.5">
                        <Users className="w-3 h-3 text-[#E8D1C5]" />
                        <span>{t('races.slotLabel') || 'Slot'}</span>
                      </div>
                      <span className="text-xs sm:text-sm font-black text-white">
                        {totalQuota - totalSlotsTaken} <span className="text-[10px] font-normal text-white/80">{t('races.slotRemaining') || 'Sisa'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center gap-2 pt-1">
                    <button
                      disabled={isSoldOut}
                      type="button"
                      className={`flex-1 py-2.5 px-5 rounded-full border-2 ${isSoldOut ? 'border-white/30 text-white/50 bg-black/20' : 'border-white/70 text-white bg-transparent hover:bg-white hover:text-stone-900 hover:border-white hover:shadow-lg'} font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 cursor-pointer`}
                    >
                      <span>{isSoldOut ? (t('registration.soldOut') || 'Sold Out') : (language === 'id' ? 'Daftar Sekarang' : 'Register Now')}</span>
                      {!isSoldOut && <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


