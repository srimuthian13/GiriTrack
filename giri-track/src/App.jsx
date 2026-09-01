
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { TrailProvider } from './context/TrailContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Trails from './pages/Trails';
import TrailDetail from './pages/TrailDetail';
import ManageTrail from './pages/ManageTrail';
import Events from './pages/Events';
import TrackerPage from './pages/TrackerPage';
import HistoryPage from './pages/HistoryPage';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Logo from './components/Logo';

function Footer() {
  return (
    <footer className="bg-white/80 dark:bg-[#2D1C1D]/80 text-[#452829] dark:text-[#E8D1C5] py-8 border-t border-[#DBC4B6] dark:border-[#57595B]/40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-3 flex flex-col items-center">
        <div className="flex items-center gap-2">
          <Logo className="w-5 h-5" showText={true} textClassName="text-sm font-black tracking-wider" />
          <span className="text-xs text-[#57595B] dark:text-[#E8D1C5]/70">&copy; {new Date().getFullYear()} - Informasi Pendakian & Pelacak Jalur</span>
        </div>
        <p className="text-xs text-[#57595B] dark:text-[#E8D1C5]/80 max-w-xl mx-auto">
          Dikembangkan untuk UAS React Fundamental. Dibuat dengan React JS, Vite, Tailwind CSS, dan Leaflet Map tanpa backend server.
        </p>
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
            <BrowserRouter>
              <div className="min-h-screen flex flex-col justify-between bg-[#F3E8DF] dark:bg-[#1C1314] text-[#452829] dark:text-[#F3E8DF] transition-colors duration-200 font-sans">
                
                <Navbar />

                <main className="flex-1 pt-6">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/trails" element={<Trails />} />
                    <Route path="/trails/:id" element={<TrailDetail />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/tracker" element={<TrackerPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/manage" element={<ManageTrail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>

                <Footer />

              </div>
            </BrowserRouter>
          </TrailProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
