import { Link } from 'react-router-dom';
import { Mountain, Compass, Home } from 'lucide-react';
import logoAsset from '../assets/logo.png';

export default function NotFound() {

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white dark:bg-[#2D1C1D] border border-[#DBC4B6] dark:border-[#57595B]/40 rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center shadow-2xl space-y-6">
        
        {/* Logo Graphic */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center rounded-3xl bg-[#EFE4DC]/80 dark:bg-[#3F2728]/80 p-3 border border-[#DBC4B6]/60 dark:border-[#57595B]/40 shadow-inner">
          <img src={logoAsset} alt="GiriTrack Logo" className="w-full h-full object-contain" />
          <Compass className="w-6 h-6 absolute -bottom-1 -right-1 text-amber-600 animate-spin" style={{ animationDuration: '10s' }} />
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-black text-giri-primary dark:text-giri-accent tracking-widest font-mono">
            404
          </h1>
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">
            Jalur Terperosok / Halaman Tidak Ditemukan
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
            Maaf, halaman atau koordinat rute yang Anda tuju tidak ditemukan di GiriTrack. Mari kembali ke jalur utama!
          </p>
        </div>

        <div className="pt-4 flex justify-center">
          <Link
            to="/"
            className="px-6 py-3 rounded-2xl bg-giri-primary text-giri-accent hover:bg-giri-primary/90 dark:bg-giri-accent dark:text-giri-primary font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
