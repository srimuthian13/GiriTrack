import { useState } from 'react';
import { History, Trash2, MapPin, Trophy } from 'lucide-react';
import { useTrail } from '../context/TrailContext';
import { useLanguage } from '../context/LanguageContext';
import HistoryMapModal from '../components/HistoryMapModal';

export default function HistoryPage() {
  const { history, deleteHistoryRecord, clearHistory, calculateTotalSummary } = useTrail();
  const { t } = useLanguage();

  const [selectedRecordIdForMap, setSelectedRecordIdForMap] = useState(null);
  const [mapModalOpen, setMapModalOpen] = useState(false);

  // Derive active record from context so photo additions/deletions immediately update
  const selectedRecordForMap = history.find((item) => String(item.id) === String(selectedRecordIdForMap)) || null;

  // ES6 Rest Parameter calculation call
  const summary = calculateTotalSummary(...history);

  const handleOpenMap = (record) => {
    setSelectedRecordIdForMap(record.id);
    setMapModalOpen(true);
  };

  const formatSecondsToMinutes = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const hrs = (mins / 60).toFixed(1);
    return `${mins} min (${hrs} jam)`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 pb-12 text-[#452829] dark:text-[#F3E8DF]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DBC4B6] dark:border-[#57595B]/40 pb-6">
        <div>
          <h1 className="text-3xl font-black text-[#452829] dark:text-[#F3E8DF] flex items-center gap-3">
            <History className="w-8 h-8 text-[#452829] dark:text-[#E8D1C5]" />
            <span>{t('history.title')}</span>
          </h1>
          <p className="text-sm text-[#57595B] dark:text-[#E8D1C5] mt-1">
            {t('history.subtitle')}
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="px-4 py-2 rounded-xl bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-950 dark:text-rose-300 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 self-start md:self-auto shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('btn.clearHistory')}</span>
          </button>
        )}
      </div>

      {/* Summary Box Container (Clean Text: Ringkasan Statistik Aktivitas) */}
      <div className="bg-white dark:bg-[#2D1C1D] border border-[#DBC4B6] dark:border-[#57595B]/40 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#DBC4B6]/60 dark:border-[#57595B]/40 pb-3">
          <h2 className="text-lg font-bold text-[#452829] dark:text-[#F3E8DF] flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#452829] dark:text-[#E8D1C5]" />
            <span>{t('history.summary')}</span>
          </h2>
          <span className="text-xs text-[#57595B] dark:text-[#E8D1C5] font-mono">
            {summary.totalHikesCount} Sesi Terakumulasi
          </span>
        </div>

        {/* Sub-cards / Stat Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#EFE4DC] dark:bg-[#3F2728] text-[#452829] dark:text-[#F3E8DF] border border-[#DBC4B6]/50 dark:border-[#57595B]/30">
            <p className="text-xs text-[#57595B] dark:text-[#E8D1C5] font-medium">{t('history.totalHikes')}</p>
            <p className="text-2xl font-black">{summary.totalHikesCount}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EFE4DC] dark:bg-[#3F2728] text-[#452829] dark:text-[#F3E8DF] border border-[#DBC4B6]/50 dark:border-[#57595B]/30">
            <p className="text-xs text-[#57595B] dark:text-[#E8D1C5] font-medium">{t('history.totalDistance')}</p>
            <p className="text-2xl font-black">{summary.totalDistanceKm} km</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EFE4DC] dark:bg-[#3F2728] text-[#452829] dark:text-[#F3E8DF] border border-[#DBC4B6]/50 dark:border-[#57595B]/30">
            <p className="text-xs text-[#57595B] dark:text-[#E8D1C5] font-medium">{t('history.avgSpeed')}</p>
            <p className="text-2xl font-black">{summary.avgSpeedKmh} km/j</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EFE4DC] dark:bg-[#3F2728] text-[#452829] dark:text-[#F3E8DF] border border-[#DBC4B6]/50 dark:border-[#57595B]/30">
            <p className="text-xs text-[#57595B] dark:text-[#E8D1C5] font-medium">{t('common.elevation')}</p>
            <p className="text-2xl font-black">{summary.highestElevationM} mdpl</p>
          </div>
        </div>
      </div>

      {/* History Log Cards / Table */}
      <div className="bg-white dark:bg-[#2D1C1D] border border-[#DBC4B6] dark:border-[#57595B]/40 rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-[#452829] dark:text-[#F3E8DF]">
          Daftar Log Pendakian ({history.length})
        </h2>

        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#DBC4B6] dark:border-[#57595B]/40 text-[#57595B] dark:text-[#E8D1C5]">
                  <th className="py-3 px-3">Tanggal</th>
                  <th className="py-3 px-3">Nama Jalur / Sesi</th>
                  <th className="py-3 px-3">Durasi</th>
                  <th className="py-3 px-3">Jarak</th>
                  <th className="py-3 px-3">Kecepatan Rerata</th>
                  <th className="py-3 px-3 text-right">Peta & Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DBC4B6]/40 dark:divide-[#57595B]/30">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-[#EFE4DC]/50 dark:hover:bg-[#3F2728]/50 transition">
                    <td className="py-3 px-3 text-[#57595B] dark:text-[#E8D1C5] font-mono">
                      {new Date(item.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-3 font-bold text-[#452829] dark:text-[#F3E8DF]">
                      {item.trail_name || 'Jalur Pendakian'}
                    </td>
                    <td className="py-3 px-3 text-[#57595B] dark:text-[#E8D1C5]">
                      {formatSecondsToMinutes(item.duration_seconds || 0)}
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#452829] dark:text-[#E8D1C5]">
                      {item.distance_km} km
                    </td>
                    <td className="py-3 px-3 text-[#57595B] dark:text-[#E8D1C5]">
                      {item.avg_speed_kmh} km/jam
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      {/* View Route Map Button */}
                      <button
                        onClick={() => handleOpenMap(item)}
                        className="px-3 py-1.5 rounded-xl bg-[#452829] text-[#F3E8DF] hover:bg-[#341e1f] dark:bg-[#E8D1C5] dark:text-[#452829] font-bold text-xs transition cursor-pointer shadow-sm inline-flex items-center gap-1"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{t('btn.viewMap')}</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => deleteHistoryRecord(item.id)}
                        className="p-1.5 rounded-xl bg-[#EFE4DC] text-rose-700 dark:bg-[#3F2728] dark:text-rose-300 hover:bg-rose-100 cursor-pointer inline-flex items-center"
                        title="Hapus Catatan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-[#57595B] dark:text-[#E8D1C5] py-8 text-center">
            {t('history.empty')}
          </p>
        )}
      </div>

      {/* History Route Map Modal */}
      <HistoryMapModal
        isOpen={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        record={selectedRecordForMap}
      />

    </div>
  );
}
