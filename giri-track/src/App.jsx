import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { TrailProvider } from './context/TrailContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { RaceProvider } from './context/RaceContext';
import Navbar from './components/Navbar';

// User Pages
import Home from './pages/user/Home';
import Trails from './pages/user/Trails';
import TrailDetail from './pages/user/TrailDetail';
import TrackerPage from './pages/user/TrackerPage';
import HistoryPage from './pages/user/HistoryPage';
import AuthPage from './pages/user/AuthPage';
import MyTickets from './pages/user/MyTickets';
import Profile from './pages/user/Profile';
import NotFound from './pages/user/NotFound';
import RaceCatalog from './pages/user/RaceCatalog';
import RaceDetail from './pages/user/RaceDetail';
import RaceRegister from './pages/user/RaceRegister';
import RaceTicket from './pages/user/RaceTicket';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageTrail from './pages/admin/ManageTrail';
import AdminRaceManager from './pages/admin/AdminRaceManager';

import Logo from './components/Logo';
import BackToTop from './components/BackToTop';

function Footer() {
  return (
    <footer className="bg-white/95 dark:bg-[#1C2129]/95 text-[#2B3542] dark:text-[#FAF3F3] border-t border-[#E1E5EA] dark:border-[#2C3440] transition-colors duration-200 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand & Description */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <Logo className="w-6 h-6" showText={true} textClassName="text-lg font-black tracking-wider" />
            <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] leading-relaxed">
              Platform manajemen dan pelacakan gunung terbaik di Indonesia. Jelajahi jalur, bergabung dalam acara, dan lacak petualangan Anda dengan mudah dan aman.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-sm mb-4 text-[#2B3542] dark:text-[#FAF3F3]">Jelajahi</h3>
            <ul className="space-y-2.5 text-xs text-[#6B7C8C] dark:text-[#A7BBC7]">
              <li><Link to="/trails" className="hover:text-[#DA7F8F] transition-colors">Jalur Pendakian</Link></li>
              <li><Link to="/races" className="hover:text-[#DA7F8F] transition-colors">Kompetisi Lari</Link></li>
              <li><Link to="/tracker" className="hover:text-[#DA7F8F] transition-colors">Pelacak Live</Link></li>
              <li><Link to="/history" className="hover:text-[#DA7F8F] transition-colors">Riwayat Saya</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-sm mb-4 text-[#2B3542] dark:text-[#FAF3F3]">Dukungan</h3>
            <ul className="space-y-2.5 text-xs text-[#6B7C8C] dark:text-[#A7BBC7]">
              <li><a href="#" className="hover:text-[#DA7F8F] transition-colors">Pusat Bantuan</a></li>
              <li><a href="#" className="hover:text-[#DA7F8F] transition-colors">Panduan Keselamatan</a></li>
              <li><a href="#" className="hover:text-[#DA7F8F] transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="#" className="hover:text-[#DA7F8F] transition-colors">Kebijakan Privasi</a></li>
              <li><a href="#" className="hover:text-[#DA7F8F] transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-sm mb-4 text-[#2B3542] dark:text-[#FAF3F3]">Hubungi Kami</h3>
            <ul className="space-y-3 text-xs text-[#6B7C8C] dark:text-[#A7BBC7]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 shrink-0 text-[#DA7F8F]" />
                <span>Gedung GiriTrack, Jl. Pendaki No. 1, Jakarta, Indonesia</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 shrink-0 text-[#DA7F8F]" />
                <span>+62 811 2233 4455</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 shrink-0 text-[#DA7F8F]" />
                <span>halo@giritrack.id</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-[#E1E5EA] dark:border-[#2C3440] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[#6B7C8C] dark:text-[#A7BBC7]">
            &copy; {new Date().getFullYear()} GiriTrack. Seluruh hak cipta dilindungi.
          </p>
          <p className="text-[10px] text-[#6B7C8C] dark:text-[#A7BBC7]/60 text-center md:text-right max-w-sm">
            Dikembangkan untuk UAS React Fundamental menggunakan React, Vite, Tailwind, dan Leaflet.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <TrailProvider>
            <RaceProvider>
              <ToastProvider>
                <BrowserRouter>
                  <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-[#FAF3F3] via-[#FAF3F3] to-[#E1E5EA]/40 dark:from-[#14171C] dark:via-[#191E25] dark:to-[#13161B] text-[#2B3542] dark:text-[#FAF3F3] transition-colors duration-300 font-sans">
                    
                    <Navbar />

                    <main className="flex-1 pt-6 pb-20 md:pb-0">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/trails" element={<Trails />} />
                        <Route path="/trails/:id" element={<TrailDetail />} />
                        <Route path="/races" element={<RaceCatalog />} />
                        <Route path="/races/:id" element={<RaceDetail />} />
                        <Route path="/races/:id/register" element={<RaceRegister />} />
                        <Route path="/races/ticket/:id" element={<RaceTicket />} />
                        <Route path="/events" element={<Navigate to="/races" replace />} />
                        <Route path="/tracker" element={<TrackerPage />} />
                        <Route path="/history" element={<HistoryPage />} />
                        <Route path="/manage" element={<ManageTrail />} />
                        <Route path="/my-tickets" element={<MyTickets />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/races" element={<AdminRaceManager />} />
                        <Route path="/login" element={<AuthPage />} />
                        <Route path="/register" element={<AuthPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>

                    <Footer />

                    <BackToTop />

                  </div>
                </BrowserRouter>
              </ToastProvider>
            </RaceProvider>
          </TrailProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}


