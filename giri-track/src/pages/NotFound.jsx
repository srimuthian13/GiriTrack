import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import logoAsset from '../assets/logo.png';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white/90 dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center shadow-2xl space-y-6 text-[#2B3542] dark:text-[#FAF3F3]">
        
        {/* Logo Graphic */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center rounded-3xl bg-[#FAF3F3] dark:bg-[#252C36] p-3 border border-[#E1E5EA] dark:border-[#2C3440] shadow-inner">
          <img src={logoAsset} alt="GiriTrack Logo" className="w-full h-full object-contain" />
          <Compass className="w-6 h-6 absolute -bottom-1 -right-1 text-[#DA7F8F] animate-spin" style={{ animationDuration: '10s' }} />
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-black text-[#DA7F8F] tracking-widest font-mono">
            404
          </h1>
          <h2 className="text-xl font-bold text-[#2B3542] dark:text-[#FAF3F3]">
            Jalur Terperosok / Halaman Tidak Ditemukan
          </h2>
          <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] max-w-sm mx-auto leading-relaxed">
            Maaf, halaman atau koordinat rute yang Anda tuju tidak ditemukan di GiriTrack. Mari kembali ke jalur utama!
          </p>
        </div>

        <div className="pt-4 flex justify-center">
          <Link
            to="/"
            className="px-6 py-3 rounded-2xl bg-[#DA7F8F] text-white hover:bg-[#c96c7d] font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
