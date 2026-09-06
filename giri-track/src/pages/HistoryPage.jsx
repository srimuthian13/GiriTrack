import { useState } from 'react';
import { History, Trash2, MapPin, Trophy } from 'lucide-react';
import { useTrail } from '../context/TrailContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import HistoryMapModal from '../components/HistoryMapModal';

export default function HistoryPage() {
  const { history, deleteHistoryRecord, clearHistory, calculateTotalSummary } = useTrail();
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [selectedRecordIdForMap, setSelectedRecordIdForMap] = useState(null);
  const [mapModalOpen, setMapModalOpen] = useState(false);

  // Filter history for current user
  const userHistory = history.filter(item => item.userEmail === user?.email);

  // Derive active record from context so photo additions/deletions immediately update
  const selectedRecordForMap = userHistory.find((item) => String(item.id) === String(selectedRecordIdForMap)) || null;

  // ES6 Rest Parameter calculation call
  const summary = calculateTotalSummary(...userHistory);

  const handleOpenMap = (record) => {
    setSelectedRecordIdForMap(record.id);
    setMapModalOpen(true);
  };

  const formatSecondsToMinutes = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const hrs = (mins / 60).toFixed(1);
    const unit = t('common.hours');
    return `${mins} min (${hrs} ${unit})`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 pb-12 text-[#2B3542] dark:text-[#FAF3F3]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E1E5EA] dark:border-[#2C3440] pb-6">
        <div>
          <h1 className="text-3xl font-black text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-3">
            <History className="w-8 h-8 text-[#DA7F8F]" />
            <span>{t('history.title')}</span>
          </h1>
          <p className="text-sm text-[#6B7C8C] dark:text-[#A7BBC7] mt-1">
            {t('history.subtitle')}
          </p>
        </div>

        {userHistory.length > 0 && (
          <button
            onClick={clearHistory}
            className="px-4 py-2 rounded-xl bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-950 dark:text-rose-300 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 self-start md:self-auto shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('btn.clearHistory')}</span>
          </button>
        )}
      </div>

      {/* Summary Box Container */}
      <div className="bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E1E5EA] dark:border-[#2C3440] pb-3">
          <h2 className="text-lg font-bold text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#DA7F8F]" />
            <span>{t('history.summary')}</span>
          </h2>
          <span className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] font-mono">
            {summary.totalHikesCount} {t('history.sessionCount')}
          </span>
        </div>

        {/* Sub-cards / Stat Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] text-[#2B3542] dark:text-[#FAF3F3] border border-[#E1E5EA] dark:border-[#2C3440]">
            <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] font-medium">{t('history.totalHikes')}</p>
            <p className="text-2xl font-black">{summary.totalHikesCount}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] text-[#2B3542] dark:text-[#FAF3F3] border border-[#E1E5EA] dark:border-[#2C3440]">
            <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] font-medium">{t('history.totalDistance')}</p>
            <p className="text-2xl font-black">{summary.totalDistanceKm} km</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] text-[#2B3542] dark:text-[#FAF3F3] border border-[#E1E5EA] dark:border-[#2C3440]">
            <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] font-medium">{t('history.avgSpeed')}</p>
            <p className="text-2xl font-black">{summary.avgSpeedKmh} km/j</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF3F3] dark:bg-[#252C36] text-[#2B3542] dark:text-[#FAF3F3] border border-[#E1E5EA] dark:border-[#2C3440]">
            <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] font-medium">{t('common.elevation')}</p>
            <p className="text-2xl font-black">{summary.highestElevationM} mdpl</p>
          </div>
        </div>
      </div>

      {/* History Log Cards / Table */}
      <div className="bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-[#2B3542] dark:text-[#FAF3F3]">
          {t('history.logTitle')} ({userHistory.length})
        </h2>

        {userHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E1E5EA] dark:border-[#2C3440] text-[#6B7C8C] dark:text-[#A7BBC7]">
                  <th className="py-3 px-3">{t('history.hikeDate')}</th>
                  <th className="py-3 px-3">{t('history.trailName')}</th>
                  <th className="py-3 px-3">{t('history.duration')}</th>
                  <th className="py-3 px-3">{t('history.distance')}</th>
                  <th className="py-3 px-3">{t('history.speed')}</th>
                  <th className="py-3 px-3 text-right">{t('history.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1E5EA] dark:divide-[#2C3440]">
                {userHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF3F3] dark:hover:bg-[#252C36] transition">
                    <td className="py-3 px-3 text-[#6B7C8C] dark:text-[#A7BBC7] font-mono">
                      {new Date(item.date).toLocaleDateString(
                        language === 'en' ? 'en-US' : 'id-ID',
                        { day: 'numeric', month: 'short', year: 'numeric' }
                      )}
                    </td>
                    <td className="py-3 px-3 font-bold text-[#2B3542] dark:text-[#FAF3F3]">
                      {item.trail_name || t('history.defaultTrail')}
                    </td>
                    <td className="py-3 px-3 text-[#6B7C8C] dark:text-[#A7BBC7]">
                      {formatSecondsToMinutes(item.duration_seconds || 0)}
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#2B3542] dark:text-[#FAF3F3]">
                      {item.distance_km} km
                    </td>
                    <td className="py-3 px-3 text-[#6B7C8C] dark:text-[#A7BBC7]">
                      {item.avg_speed_kmh} {t('common.kmh')}
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      {/* View Route Map Button */}
                      <button
                        onClick={() => handleOpenMap(item)}
                        className="px-3 py-1.5 rounded-xl bg-[#DA7F8F] text-white hover:bg-[#c96c7d] font-bold text-xs transition cursor-pointer shadow-sm inline-flex items-center gap-1"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{t('btn.viewMap')}</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => deleteHistoryRecord(item.id)}
                        className="p-1.5 rounded-xl bg-[#E1E5EA] text-rose-600 dark:bg-[#252C36] dark:text-rose-400 hover:bg-rose-100 cursor-pointer inline-flex items-center"
                        title={t('history.deleteTooltip')}
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
          <div className="p-8 text-center text-xs text-[#6B7C8C] dark:text-[#A7BBC7] bg-[#FAF3F3]/50 dark:bg-[#252C36]/50 rounded-2xl border border-dashed border-[#E1E5EA] dark:border-[#2C3440]">
            {t('history.empty')}
          </div>
        )}
      </div>

      {/* History Recorded Map Modal with Photo Gallery Attachment */}
      <HistoryMapModal
        isOpen={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        record={selectedRecordForMap}
      />

    </div>
  );
}
