import { useSearchParams, useNavigate } from 'react-router-dom';
import { Navigation, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import LiveTracker from '../../components/LiveTracker';

export default function TrackerPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const selectedTrailId = searchParams.get('trailId') || '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 pb-12 text-[#2B3542] dark:text-[#FAF3F3]">
      {/* Back Button */}
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#6B7C8C] dark:text-[#A7BBC7] hover:text-[#DA7F8F] dark:hover:text-[#DA7F8F] transition-all cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('btn.back') || 'Kembali'}</span>
        </button>
      </div>

      {/* Page Title Header */}
      <div className="border-b border-[#E1E5EA] dark:border-[#2C3440] pb-6">
        <h1 className="text-3xl font-black text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-3">
          <Navigation className="w-8 h-8 text-[#DA7F8F]" />
          <span>{t('tracker.title')}</span>
        </h1>
        <p className="text-sm text-[#6B7C8C] dark:text-[#A7BBC7] mt-1">
          {t('tracker.subtitle')}
        </p>
      </div>

      {/* Live GPS Tracker Component with Embedded Live Leaflet Map & Polyline */}
      <LiveTracker selectedTrailId={selectedTrailId} />
    </div>
  );
}
