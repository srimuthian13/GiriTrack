import { useState } from 'react';
import { Calendar, MapPin, Plus, CheckCircle2, UserCheck, X } from 'lucide-react';
import { useTrail } from '../context/TrailContext';
import { useLanguage } from '../context/LanguageContext';

export default function Events() {
  const { events, joinEvent, leaveEvent, addEvent } = useTrail();
  const { t } = useLanguage();

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    peak_target: '',
    max_quota: 10,
    organizer: '',
    meeting_point: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date || !formData.peak_target) return;

    addEvent({
      ...formData,
      max_quota: Number(formData.max_quota) || 10,
    });

    setModalOpen(false);
    setFormData({
      name: '',
      date: '',
      peak_target: '',
      max_quota: 10,
      organizer: '',
      meeting_point: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-giri-accent/20 pb-6">
        <div>
          <h1 className="text-3xl font-black text-giri-primary dark:text-stone-100 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-giri-primary dark:text-giri-accent" />
            <span>{t('event.title')}</span>
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            {t('event.subtitle')}
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-giri-primary text-giri-accent hover:bg-giri-primary/90 dark:bg-giri-accent dark:text-giri-primary font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Event Tektok Baru</span>
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((evt) => {
          const isFull = evt.current_participants >= evt.max_quota;

          return (
            <div
              key={evt.id}
              className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-giri-accent/30 dark:border-stone-800 shadow-md flex flex-col justify-between space-y-4 hover:shadow-xl transition"
            >
              <div className="space-y-3">
                
                {/* Date & Status Badge */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-giri-base/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                    {evt.date}
                  </span>

                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full border ${
                      evt.is_joined
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                        : isFull
                        ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {evt.is_joined
                      ? t('event.statusJoined')
                      : isFull
                      ? t('event.statusFull')
                      : t('event.statusOpen')}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-giri-primary dark:text-stone-100">
                  {evt.name}
                </h3>

                <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                  <p className="flex items-center gap-1.5">
                    <strong className="text-stone-800 dark:text-stone-100">Target Puncak:</strong>
                    <span>{evt.peak_target}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <strong className="text-stone-800 dark:text-stone-100">Penyelenggara:</strong>
                    <span>{evt.organizer || 'Komunitas GiriTrack'}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-giri-primary dark:text-giri-accent shrink-0" />
                    <span className="truncate">{evt.meeting_point || 'Basecamp Utama'}</span>
                  </p>
                </div>
              </div>

              {/* Real-time Participant Progress Bar & Action */}
              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-500 dark:text-stone-400">
                    {t('event.participants')}:
                  </span>
                  <span className="font-bold text-giri-primary dark:text-giri-accent">
                    {evt.current_participants} / {evt.max_quota} Peserta
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      evt.is_joined
                        ? 'bg-emerald-500'
                        : isFull
                        ? 'bg-rose-500'
                        : 'bg-giri-primary dark:bg-giri-accent'
                    }`}
                    style={{
                      width: `${Math.min(100, (evt.current_participants / evt.max_quota) * 100)}%`,
                    }}
                  />
                </div>

                {/* Join / Leave Buttons */}
                {evt.is_joined ? (
                  <button
                    onClick={() => leaveEvent(evt.id)}
                    className="w-full py-2.5 rounded-xl bg-stone-100 text-rose-600 hover:bg-rose-100 dark:bg-stone-800 dark:text-rose-400 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>{t('btn.leaveEvent')}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => joinEvent(evt.id)}
                    disabled={isFull}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      isFull
                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed dark:bg-stone-800 dark:text-stone-600'
                        : 'bg-giri-primary text-giri-accent hover:bg-giri-primary/90 dark:bg-giri-accent dark:text-giri-primary shadow-sm cursor-pointer'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isFull ? t('event.statusFull') : t('btn.joinEvent')}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add Custom Event */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 border border-giri-accent/30 dark:border-stone-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <h3 className="text-lg font-bold text-giri-primary dark:text-stone-100">
                Buat Event Tektok Baru
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Nama Event Tektok *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Contoh: Tektok Ceria Merbabu"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-giri-base/30 dark:bg-stone-800 text-stone-800 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Target Puncak *
                </label>
                <input
                  type="text"
                  name="peak_target"
                  required
                  value={formData.peak_target}
                  onChange={handleInputChange}
                  placeholder="Contoh: Puncak Kenteng Songo (3.145 mdpl)"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-giri-base/30 dark:bg-stone-800 text-stone-800 dark:text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Tanggal *
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-giri-base/30 dark:bg-stone-800 text-stone-800 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Kuota Maksimal *
                  </label>
                  <input
                    type="number"
                    name="max_quota"
                    value={formData.max_quota}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-giri-base/30 dark:bg-stone-800 text-stone-800 dark:text-stone-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Penyelenggara / Trip Lead
                </label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleInputChange}
                  placeholder="Contoh: Tim GiriTrack"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-giri-base/30 dark:bg-stone-800 text-stone-800 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Meeting Point & Jam Kumpul
                </label>
                <input
                  type="text"
                  name="meeting_point"
                  value={formData.meeting_point}
                  onChange={handleInputChange}
                  placeholder="Contoh: Basecamp Selo, 01:30 WIB"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-giri-base/30 dark:bg-stone-800 text-stone-800 dark:text-stone-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-stone-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-giri-primary text-giri-accent font-bold cursor-pointer"
                >
                  Simpan Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
