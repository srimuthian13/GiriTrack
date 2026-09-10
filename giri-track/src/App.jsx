import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { TrailProvider } from './context/TrailContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { RaceProvider } from './context/RaceContext';
import Navbar from './components/Navbar';

// User Pages
import Home from './pages/user/Home';
import Trails from './pages/user/Trails';
import TrailDetail from './pages/user/TrailDetail';
import TrackerPage from './pages/user/TrackerPage';
import HistoryPage from './pages/user/HistoryPage';
import AuthModal from './components/AuthModal';
import { AnimatePresence, motion } from 'framer-motion';
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
import ScrollToTop from './components/ScrollToTop';

function Footer() {
  const { isAdmin } = useAuth();

  return (
    <footer className="bg-white/95 dark:bg-[#1C2129]/95 text-[#2B3542] dark:text-[#FAF3F3] border-t border-[#E1E5EA] dark:border-[#2C3440] transition-colors duration-200 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand & Description */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <Logo className="w-6 h-6" showText={true} textClassName="text-lg font-black tracking-wider" to={isAdmin ? "/admin" : "/"} />
            {isAdmin ? (
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#DA7F8F]/15 text-[#DA7F8F] border border-[#DA7F8F]/30">
                  Konsol Administrator
                </span>
                <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] leading-relaxed">
                  Pusat kendali administrator GiriTrack untuk pengawasan rute gunung, verifikasi kontribusi jalur, dan tata kelola event kompetisi lari lintas alam.
                </p>
              </div>
            ) : (
              <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] leading-relaxed">
                Platform manajemen dan pelacakan gunung terbaik di Indonesia. Jelajahi jalur, bergabung dalam acara, dan lacak petualangan Anda dengan mudah dan aman.
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-sm mb-4 text-[#2B3542] dark:text-[#FAF3F3]">
              {isAdmin ? 'Menu Administrator' : 'Jelajahi'}
            </h3>
            {isAdmin ? (
              <ul className="space-y-2.5 text-xs text-[#6B7C8C] dark:text-[#A7BBC7]">
                <li><Link to="/admin" className="hover:text-[#DA7F8F] font-semibold transition-colors">Dashboard Utama Admin</Link></li>
                <li><Link to="/admin/races" className="hover:text-[#DA7F8F] font-semibold transition-colors">Kelola Lomba & Peserta</Link></li>
                <li><Link to="/manage" className="hover:text-[#DA7F8F] font-semibold transition-colors">Kelola & Verifikasi Jalur</Link></li>
                <li><Link to="/trails" className="hover:text-[#DA7F8F] transition-colors">Katalog Publik Jalur</Link></li>
                <li><Link to="/profile" className="hover:text-[#DA7F8F] transition-colors">Pengaturan Profil Admin</Link></li>
              </ul>
            ) : (
              <ul className="space-y-2.5 text-xs text-[#6B7C8C] dark:text-[#A7BBC7]">
                <li><Link to="/trails" className="hover:text-[#DA7F8F] transition-colors">Jalur Pendakian</Link></li>
                <li><Link to="/races" className="hover:text-[#DA7F8F] transition-colors">Kompetisi Lari</Link></li>
                <li><Link to="/tracker" className="hover:text-[#DA7F8F] transition-colors">Pelacak Live</Link></li>
                <li><Link to="/history" className="hover:text-[#DA7F8F] transition-colors">Riwayat Saya</Link></li>
              </ul>
            )}
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-sm mb-4 text-[#2B3542] dark:text-[#FAF3F3]">
              {isAdmin ? 'Sistem & Moderasi' : 'Dukungan'}
            </h3>
            {isAdmin ? (
              <ul className="space-y-2.5 text-xs text-[#6B7C8C] dark:text-[#A7BBC7]">
                <li><Link to="/manage" className="hover:text-[#DA7F8F] transition-colors">Verifikasi Jalur Menunggu</Link></li>
                <li><Link to="/admin/races" className="hover:text-[#DA7F8F] transition-colors">Ekspor Data Pendaftar (CSV)</Link></li>
                <li><Link to="/admin" className="hover:text-[#DA7F8F] transition-colors">Master Wilayah & Kesulitan</Link></li>
                <li><Link to="/admin" className="hover:text-[#DA7F8F] transition-colors">Moderasi Ulasan Pendaki</Link></li>
              </ul>
            ) : (
              <ul className="space-y-2.5 text-xs text-[#6B7C8C] dark:text-[#A7BBC7]">
                <li><a href="#" className="hover:text-[#DA7F8F] transition-colors">Pusat Bantuan</a></li>
                <li><a href="#" className="hover:text-[#DA7F8F] transition-colors">Panduan Keselamatan</a></li>
                <li><a href="#" className="hover:text-[#DA7F8F] transition-colors">Syarat & Ketentuan</a></li>
                <li><a href="#" className="hover:text-[#DA7F8F] transition-colors">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-[#DA7F8F] transition-colors">FAQ</a></li>
              </ul>
            )}
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-sm mb-4 text-[#2B3542] dark:text-[#FAF3F3]">
              {isAdmin ? 'Pusat Bantuan IT' : 'Hubungi Kami'}
            </h3>
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
                <span>{isAdmin ? 'admin-ops@giritrack.id' : 'halo@giritrack.id'}</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-[#E1E5EA] dark:border-[#2C3440] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[#6B7C8C] dark:text-[#A7BBC7]">
            &copy; {new Date().getFullYear()} GiriTrack. {isAdmin ? 'Sesi Administrator Aktif • GiriTrack Console.' : 'Seluruh hak cipta dilindungi.'}
          </p>
          <p className="text-[10px] text-[#6B7C8C] dark:text-[#A7BBC7]/60 text-center md:text-right max-w-sm">
            {isAdmin ? 'Akses Terbatas: Pengelolaan Database, Lomba Trail, dan Moderasi Sistem.' : 'Dikembangkan untuk UAS React Fundamental menggunakan React, Vite, Tailwind, dan Leaflet.'}
          </p>
        </div>
      </div>
    </footer>
  );
}

function ProtectedRoute({ children, adminOnly = false }) {
  const { isLoggedIn, isAdmin, openAuthModal, isAuthModalOpen } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (!isLoggedIn) {
      openAuthModal();
    } else if (adminOnly && !isAdmin) {
      showToast('Halaman ini khusus untuk Administrator GiriTrack!', {
        type: 'error',
        title: 'Akses Ditolak'
      });
    }
  }, [isLoggedIn, adminOnly, isAdmin, showToast, openAuthModal]);

  if (!isLoggedIn) {
    if (!isAuthModalOpen) {
      return <Navigate to="/" replace />;
    }
    return <div className="min-h-screen" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppContent() {
  const { isAdmin } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-[#FAF3F3] via-[#FAF3F3] to-[#E1E5EA]/40 dark:from-[#14171C] dark:via-[#191E25] dark:to-[#13161B] text-[#2B3542] dark:text-[#FAF3F3] transition-colors duration-300 font-sans">
      <Navbar />
      <AuthModal />

      <main className="flex-1 pt-6 pb-20 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Routes location={location}>
          <Route path="/" element={isAdmin ? <Navigate to="/admin" replace /> : <Home />} />
          <Route path="/trails" element={<ProtectedRoute><Trails /></ProtectedRoute>} />
          <Route path="/trails/:id" element={<ProtectedRoute><TrailDetail /></ProtectedRoute>} />
          <Route path="/races" element={<ProtectedRoute><RaceCatalog /></ProtectedRoute>} />
          <Route path="/races/:id" element={<ProtectedRoute><RaceDetail /></ProtectedRoute>} />
          <Route path="/races/:id/register" element={<ProtectedRoute><RaceRegister /></ProtectedRoute>} />
          <Route path="/races/ticket/:id" element={<ProtectedRoute><RaceTicket /></ProtectedRoute>} />
          <Route path="/events" element={<Navigate to="/races" replace />} />
          <Route path="/tracker" element={<ProtectedRoute><TrackerPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          <Route path="/manage" element={<ProtectedRoute adminOnly><ManageTrail /></ProtectedRoute>} />
          <Route path="/my-tickets" element={<ProtectedRoute><MyTickets /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/races" element={<ProtectedRoute adminOnly><AdminRaceManager /></ProtectedRoute>} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/register" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <BackToTop />
    </div>
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
                  <ScrollToTop />
                  <AppContent />
                </BrowserRouter>
              </ToastProvider>
            </RaceProvider>
          </TrailProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}


