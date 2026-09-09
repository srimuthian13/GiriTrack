import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  UserCheck, KeyRound, Mail, ArrowRight, ArrowLeft,
  Eye, EyeOff, AlertCircle, User, UserPlus, ChevronRight, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import logoAsset from '../../assets/logo.png';
import heroBromo from '../../assets/hero-bromo.jpg';

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { 
    login, registerUser, 
    isLoggedIn, user 
  } = useAuth();

  // Determine initial view based on route
  const [isLoginView, setIsLoginView] = useState(location.pathname !== '/register');
  const [prevPathname, setPrevPathname] = useState(location.pathname);

  // Update view if location changes (e.g. user clicks browser back/forward)
  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    setIsLoginView(location.pathname !== '/register');
  }

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [error, setError] = useState('');

  // If user is already logged in, show status & redirect option
  if (isLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-16 px-4 animate-in fade-in zoom-in duration-300">
        <div className="bg-white/90 dark:bg-[#1C2129] rounded-3xl p-8 border border-[#E1E5EA] dark:border-[#2C3440] shadow-xl text-center space-y-5 text-[#2B3542] dark:text-[#FAF3F3]">
          <div className="w-16 h-16 rounded-full bg-[#FAF3F3] dark:bg-[#252C36] text-[#DA7F8F] flex items-center justify-center mx-auto shadow-inner">
            <UserCheck className="w-8 h-8 text-[#DA7F8F]" />
          </div>
          <div>
            <h2 className="text-2xl font-black">Anda Sudah Masuk</h2>
            <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] mt-1">
              Terautentikasi sebagai <strong className="text-[#2B3542] dark:text-[#FAF3F3]">{user.name || user.email}</strong> (
              <span className="capitalize font-semibold text-[#DA7F8F]">{user.role}</span>)
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 rounded-2xl bg-[#DA7F8F] text-white hover:bg-[#c96c7d] font-bold text-xs shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const handleRedirectAfterAuth = () => {
    const intended = localStorage.getItem('giritrack_intended_path');
    if (intended) {
      localStorage.removeItem('giritrack_intended_path');
      navigate(intended);
    } else {
      navigate('/');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!loginEmail.trim() || !loginPassword.trim()) {
      const msg = t('auth.errorRequired') || 'Semua kolom wajib diisi!';
      setError(msg);
      showToast(msg, { type: 'error', title: 'Input Belum Lengkap' });
      return;
    }
    try {
      const loggedIn = login({ email: loginEmail, password: loginPassword });
      showToast(`Selamat datang kembali, ${loggedIn.name || 'Pengguna'}!`, { 
        type: 'success', 
        title: 'Berhasil Masuk' 
      });
      handleRedirectAfterAuth();
    } catch (err) {
      const errMsg = err.message || 'Gagal masuk, periksa kredensial Anda.';
      setError(errMsg);
      showToast(errMsg, { type: 'error', title: 'Gagal Masuk' });
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim() || !regConfirmPassword.trim()) {
      const msg = 'Semua kolom wajib diisi!';
      setError(msg);
      showToast(msg, { type: 'error', title: 'Input Belum Lengkap' });
      return;
    }
    if (regPassword !== regConfirmPassword) {
      const msg = 'Konfirmasi kata sandi tidak cocok!';
      setError(msg);
      showToast(msg, { type: 'error', title: 'Kata Sandi Tidak Cocok' });
      return;
    }
    try {
      registerUser({ name: regName, email: regEmail, password: regPassword });
      setRegName(''); setRegEmail(''); setRegPassword(''); setRegConfirmPassword('');
      toggleView(true);
      setError('');
      showToast('Pendaftaran akun berhasil! Silakan masuk dengan email Anda.', { 
        type: 'success', 
        title: 'Akun Dibuat' 
      });
    } catch (err) {
      const errMsg = err.message || 'Gagal mendaftar, silakan coba lagi.';
      setError(errMsg);
      showToast(errMsg, { type: 'error', title: 'Gagal Mendaftar' });
    }
  };

  const toggleView = (toLogin) => {
    setError('');
    setIsLoginView(toLogin);
    window.history.pushState(null, '', toLogin ? '/login' : '/register');
  };

  return (
    <div className="min-h-[85vh] flex flex-col relative w-full py-4">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 mb-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#6B7C8C] dark:text-[#A7BBC7] hover:text-[#DA7F8F] dark:hover:text-[#DA7F8F] transition-all cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative w-full">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#DA7F8F]/10 rounded-full blur-3xl pointer-events-none hidden md:block" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#A7BBC7]/10 rounded-full blur-3xl pointer-events-none hidden md:block" />

        <div className="w-full max-w-4xl bg-white dark:bg-[#1C2129] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-[#E1E5EA] dark:border-[#2C3440] relative z-10 min-h-[480px]">
          <button 
            onClick={() => navigate('/')}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-[#252C36] shadow-md hover:scale-105 active:scale-95 text-[#2B3542] dark:text-[#FAF3F3] transition-all border border-[#E1E5EA] dark:border-[#2C3440]"
          >
            <X className="w-4 h-4" />
          </button>

          <div className={`hidden md:flex absolute top-0 left-0 w-1/2 h-full z-20 transition-transform duration-700 ease-in-out ${isLoginView ? 'translate-x-full' : 'translate-x-0'}`}>
            <div className="relative w-full h-full overflow-hidden shadow-2xl">
              <img src={heroBromo} alt="Mountain View" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 lg:p-8">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md p-2 mb-3 border border-white/20">
                  <img src={logoAsset} alt="GiriTrack Logo" className="w-full h-full object-contain drop-shadow-md" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
                  Eksplorasi Tanpa<br/><span className="text-[#DA7F8F]">Batas</span>
                </h2>
                <p className="text-white/80 mt-1.5 text-[11px] font-medium leading-relaxed max-w-sm">
                  Bergabunglah dengan ribuan pendaki lainnya di platform manajemen dan pelacakan gunung terbaik di Indonesia.
                </p>
              </div>
            </div>
          </div>

          <div className={`w-full md:w-1/2 relative p-5 sm:p-7 lg:p-8 overflow-y-auto custom-scrollbar flex-col justify-center transition-opacity duration-500 z-10 ${isLoginView ? 'flex opacity-100 pointer-events-auto' : 'hidden md:flex opacity-0 pointer-events-none'}`}>
            <div className="text-center md:text-left space-y-1 mb-5 mt-3 md:mt-0">
              <h1 className="text-xl font-black text-[#2B3542] dark:text-[#FAF3F3] tracking-tight">
                {t('auth.loginTitle')}
              </h1>
              <p className="text-[11px] text-[#6B7C8C] dark:text-[#A7BBC7]">
                {t('auth.loginSubtitle')}
              </p>
            </div>

            {error && isLoginView && (
              <div className="mb-3 p-2 rounded-xl bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800 text-[10px] font-bold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-[#6B7C8C] dark:text-[#A7BBC7] mb-1">
                  {t('auth.emailLabel')} *
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A7BBC7]" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder={t('auth.emailPlaceholder')}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3]/50 dark:bg-[#252C36]/50 text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#6B7C8C] dark:text-[#A7BBC7] mb-1">
                  {t('auth.passwordLabel')} *
                </label>
                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A7BBC7]" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder={t('auth.passwordPlaceholder')}
                    className="w-full pl-8 pr-8 py-2 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3]/50 dark:bg-[#252C36]/50 text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A7BBC7] hover:text-[#2B3542] dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 flex items-center justify-center gap-1.5 py-2.5 px-4 bg-[#DA7F8F] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#c96c7d] hover:shadow-lg transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <span>{t('auth.submitBtn')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <p className="mt-5 text-center text-[10px] text-[#6B7C8C] dark:text-[#A7BBC7]">
              Belum punya akun?{' '}
              <button
                onClick={() => toggleView(false)}
                className="font-bold text-[#DA7F8F] hover:text-[#c96c7d] hover:underline transition-colors cursor-pointer"
              >
                Daftar Sekarang
              </button>
            </p>
          </div>

          <div className={`w-full md:w-1/2 relative p-5 sm:p-7 lg:p-8 overflow-y-auto custom-scrollbar flex-col justify-center transition-opacity duration-500 z-10 ${!isLoginView ? 'flex opacity-100 pointer-events-auto' : 'hidden md:flex opacity-0 pointer-events-none'}`}>
            <div className="text-center md:text-left space-y-1 mb-4 mt-3 md:mt-0">
              <h1 className="text-xl font-black text-[#2B3542] dark:text-[#FAF3F3] tracking-tight">
                Buat Akun Baru
              </h1>
              <p className="text-[11px] text-[#6B7C8C] dark:text-[#A7BBC7]">
                Bergabunglah dengan komunitas pendaki kami
              </p>
            </div>

            {error && !isLoginView && (
              <div className="mb-3 p-2 rounded-xl bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800 text-[10px] font-bold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-2.5">
              <div>
                <label className="block text-[10px] font-bold text-[#6B7C8C] dark:text-[#A7BBC7] mb-1">
                  Nama Lengkap *
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A7BBC7]" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3]/50 dark:bg-[#252C36]/50 text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#6B7C8C] dark:text-[#A7BBC7] mb-1">
                  Alamat Email *
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A7BBC7]" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="nama@domain.com"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3]/50 dark:bg-[#252C36]/50 text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-[#6B7C8C] dark:text-[#A7BBC7] mb-1">
                    Kata Sandi *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#A7BBC7]" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 karakter"
                      className="w-full pl-7 pr-7 py-2 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3]/50 dark:bg-[#252C36]/50 text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A7BBC7] hover:text-[#2B3542] dark:hover:text-white transition-colors cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#6B7C8C] dark:text-[#A7BBC7] mb-1">
                    Konfirmasi Sandi *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#A7BBC7]" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Ulangi sandi"
                      className="w-full pl-7 pr-7 py-2 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3]/50 dark:bg-[#252C36]/50 text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A7BBC7] hover:text-[#2B3542] dark:hover:text-white transition-colors cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 flex items-center justify-center gap-1.5 py-2.5 px-4 bg-[#DA7F8F] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#c96c7d] hover:shadow-lg transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Daftar Akun Baru</span>
                <ChevronRight className="w-3 h-3 ml-auto opacity-70" />
              </button>
            </form>

            <p className="mt-4 text-center text-[10px] text-[#6B7C8C] dark:text-[#A7BBC7]">
              Sudah punya akun?{' '}
              <button
                onClick={() => toggleView(true)}
                className="font-bold text-[#DA7F8F] hover:text-[#c96c7d] hover:underline transition-colors cursor-pointer"
              >
                Masuk di sini
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
