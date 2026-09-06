import { useContext, useState } from 'react';
import { RaceContext } from '../context/RaceContext';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Users, Activity, Target, Search, Download, ShieldAlert, PhoneCall } from 'lucide-react';

export default function AdminRaceManager() {
  const { races, registrations } = useContext(RaceContext);
  const { user, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const filteredRegistrations = registrations.filter(reg => 
    reg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    reg.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    if (registrations.length === 0) return;

    const headers = ['No Reg', 'BIB', 'Nama', 'Email', 'No HP', 'Gol Darah', 'Jersey', 'Event', 'Kategori', 'Kontak Darurat', 'Hp Darurat', 'Status', 'Tanggal'];
    const rows = registrations.map(reg => {
      const race = races.find(r => r.id === reg.raceId);
      const cat = race?.categories.find(c => c.id === reg.categoryId);
      const catCode = cat?.name ? cat.name.split(' ')[0].toUpperCase() : 'RUN';
      const bib = `BIB-${catCode}-${String(reg.id || '001').slice(-3).padStart(3, '0')}`;

      return [
        reg.id,
        bib,
        `"${reg.name}"`,
        reg.email,
        reg.phone,
        reg.bloodType || '-',
        reg.jerseySize || 'M',
        `"${race?.title || '-'}"`,
        `"${cat?.name || '-'}"`,
        `"${reg.emergencyContactName || '-'}"`,
        reg.emergencyContactPhone || '-',
        reg.status,
        new Date(reg.date).toLocaleString('id-ID')
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `giritrack-race-registrations-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#2B3542] dark:text-[#FAF3F3] mb-2 drop-shadow-sm flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-emerald-600 dark:text-emerald-500" />
          Admin Race Manager
        </h1>
        <p className="text-[#6B7C8C] dark:text-[#A7BBC7] max-w-2xl text-sm sm:text-base">
          Kelola event lari lintas alam, pantau pendaftaran, dan kapasitas peserta.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Events & Quota Overview */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-bold text-[#2B3542] dark:text-[#FAF3F3] mb-4">Ringkasan Event</h2>
          {races.map(race => {
            const totalQuota = race.categories.reduce((sum, cat) => sum + cat.quota, 0);
            const totalSlotsTaken = race.categories.reduce((sum, cat) => sum + cat.slotsTaken, 0);
            const percentFilled = Math.round((totalSlotsTaken / totalQuota) * 100);

            return (
              <div key={race.id} className="bg-white dark:bg-[#1C2129] rounded-2xl p-5 border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm">
                <h3 className="font-bold text-[#2B3542] dark:text-[#FAF3F3] mb-1">{race.title}</h3>
                <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] mb-4">{new Date(race.date).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-[#2B3542] dark:text-[#FAF3F3]">Kapasitas Total</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{totalSlotsTaken} / {totalQuota}</span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-[#2C3440] rounded-full h-2 mb-4">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${percentFilled}%` }}></div>
                </div>

                <div className="space-y-3">
                  {race.categories.map(cat => (
                    <div key={cat.id} className="flex justify-between items-center text-xs">
                      <span className="text-[#6B7C8C] dark:text-[#A7BBC7]">{cat.name}</span>
                      <span className="font-semibold text-[#2B3542] dark:text-[#FAF3F3]">{cat.slotsTaken} / {cat.quota}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Registrations List */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#1C2129] rounded-2xl border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm overflow-hidden flex flex-col h-full">
            
            <div className="p-5 border-b border-[#E1E5EA] dark:border-[#2C3440] flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <h2 className="text-xl font-bold text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Data Pendaftar ({registrations.length})
              </h2>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Cari nama, ID, email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-[#E1E5EA] dark:border-[#2C3440] bg-gray-50 dark:bg-[#14171C] text-[#2B3542] dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button 
                  onClick={handleExportCSV}
                  className="px-3 py-2 bg-[#DA7F8F] hover:bg-[#c96c7d] text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer" 
                  title="Export Data ke CSV"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 dark:bg-[#14171C] text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3 font-medium">BIB & Reg ID</th>
                    <th className="px-6 py-3 font-medium">Peserta</th>
                    <th className="px-6 py-3 font-medium">Event & Kategori</th>
                    <th className="px-6 py-3 font-medium">Kontak Darurat</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Aksi Waktu Finish</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E1E5EA] dark:divide-[#2C3440] text-[#2B3542] dark:text-[#FAF3F3]">
                  {filteredRegistrations.length > 0 ? (
                    filteredRegistrations.map(reg => {
                      const race = races.find(r => r.id === reg.raceId);
                      const cat = race?.categories.find(c => c.id === reg.categoryId);
                      const catCode = cat?.name ? cat.name.split(' ')[0].toUpperCase() : 'RUN';
                      const bibNumber = `BIB-${catCode}-${String(reg.id || '001').slice(-3).padStart(3, '0')}`;

                      return (
                        <tr key={reg.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-black font-mono text-xs text-[#DA7F8F]">{bibNumber}</div>
                            <div className="text-[10px] text-[#6B7C8C] dark:text-[#A7BBC7] font-mono">{reg.id}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold">{reg.name}</div>
                            <div className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7]">{reg.email} • {reg.phone}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-xs">{race?.title || 'Unknown Event'}</div>
                            <div className="text-[10px] uppercase tracking-wide text-[#DA7F8F] font-bold">{cat?.name || 'Unknown Category'} ({reg.jerseySize || 'M'})</div>
                          </td>
                          <td className="px-6 py-4 text-xs">
                            <div className="font-medium flex items-center gap-1">
                              <PhoneCall className="w-3 h-3 text-rose-500" />
                              <span>{reg.emergencyContactName || '-'}</span>
                            </div>
                            <div className="text-[10px] text-[#6B7C8C] dark:text-[#A7BBC7]">{reg.emergencyContactPhone || '-'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                              {reg.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingRunner({
                                  bib: bibNumber,
                                  name: reg.name,
                                  category: cat?.name || 'Trail Run',
                                  finishTime: '',
                                  avgPace: ''
                                });
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#DA7F8F]/15 hover:bg-[#DA7F8F] text-[#DA7F8F] hover:text-white font-bold text-xs transition-colors cursor-pointer"
                            >
                              Catat Finish
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        {searchTerm ? 'Pendaftar tidak ditemukan.' : 'Belum ada pendaftar.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
