import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserCheck, KeyRound, Mail, ArrowRight,
  Eye, EyeOff, User, UserPlus, ChevronRight, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import logoAsset from '../assets/logo.png';
import heroBromo from '../assets/hero-bromo.jpg';

export default function AuthModal() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { 
    login, registerUser, 
    isLoggedIn, user,
    isAuthModalOpen, closeAuthModal
  } = useAuth();

  const [isLoginView, setIsLoginView] = useState(true);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isAuthModalOpen) {
      // Prevent scroll jump on mobile browsers by avoiding overflow: hidden
      // document.body.style.overflow = 'hidden'; 
      setTimeout(() => setIsLoginView(true), 0); // default to login
    } else {
      // document.body.style.overflow = 'unset';
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoginEmail('');
      setLoginPassword('');
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
      setShowLoginPassword(false);
      setShowRegPassword(false);
    }
    return () => {
      // document.body.style.overflow = 'unset';
    };
  }, [isAuthModalOpen]);

  // If user is already logged in, show status & redirect option
  if (isLoggedIn && isAuthModalOpen) {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuthModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white/90 dark:bg-[#1C2129] rounded-3xl p-6 sm:p-8 border border-[#E1E5EA] dark:border-[#2C3440] shadow-xl text-center space-y-5 text-[#2B3542] dark:text-[#FAF3F3] max-w-md w-full"
          >
            <button onClick={closeAuthModal} className="absolute top-4 right-4 text-[#A7BBC7] hover:text-[#DA7F8F]">
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FAF3F3] dark:bg-[#252C36] text-[#DA7F8F] flex items-center justify-center mx-auto shadow-inner">
              <UserCheck className="w-7 h-7 sm:w-8 sm:h-8 text-[#DA7F8F]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black">{t('auth.alreadyLoggedIn') || 'Anda Sudah Masuk'}</h2>
              <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] mt-1 break-words">
                {t('auth.authenticatedAs') || 'Terautentikasi sebagai'}{' '}
                <strong className="text-[#2B3542] dark:text-[#FAF3F3]">{user.name || user.email}</strong>{' '}
                (<span className="capitalize font-semibold text-[#DA7F8F]">{user.role}</span>)
              </p>
            </div>
            <button
              onClick={() => {
                closeAuthModal();
                navigate(user.role === 'admin' ? '/admin' : '/');
              }}
              className="w-full py-3 rounded-2xl bg-[#DA7F8F] text-white hover:bg-[#c96c7d] font-bold text-xs shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
            >
              {user.role === 'admin' ? (t('nav.adminDashboard') || 'Menuju Panel Admin') : (t('auth.backToHome') || 'Kembali ke Beranda')}
            </button>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  const handleRedirectAfterAuth = (loggedInUser) => {
    closeAuthModal();
    if (loggedInUser?.role === 'admin') {
      navigate('/admin');
      return;
    }
    const intended = localStorage.getItem('giritrack_intended_path');
    if (intended) {
      localStorage.removeItem('giritrack_intended_path');
      navigate(intended);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      return;
    }
    try {
      const loggedIn = login({ email: loginEmail, password: loginPassword });
      setLoginEmail('');
      setLoginPassword('');
      showToast(`${t('auth.welcomeBack') || 'Selamat datang kembali'}, ${loggedIn.name || 'Pengguna'}!`, { 
        type: 'success', 
        title: t('auth.loginSuccess') || 'Berhasil Masuk' 
      });
      handleRedirectAfterAuth(loggedIn);
    } catch (err) {
      console.error(err);
      showToast('Email atau Password yang Anda masukkan salah. Silakan coba lagi!', { 
        type: 'error', 
        title: t('common.error') || 'Gagal Masuk' 
      });
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim() || !regConfirmPassword.trim()) {
      return;
    }
    if (regPassword !== regConfirmPassword) {
      const msg = 'Konfirmasi kata sandi tidak cocok!';
      showToast(msg, { type: 'error', title: t('common.error') || 'Kata Sandi Tidak Cocok' });
      return;
    }
    try {
      registerUser({ name: regName, email: regEmail, password: regPassword });
      setRegName(''); setRegEmail(''); setRegPassword(''); setRegConfirmPassword('');
      setIsLoginView(true);
      showToast(t('auth.registerSuccess') || 'Pendaftaran akun berhasil! Silakan masuk dengan email Anda.', { 
        type: 'success', 
        title: t('auth.accountCreated') || 'Akun Dibuat' 
      });
    } catch (err) {
      const errMsg = err.message || 'Gagal mendaftar, silakan coba lagi.';
      showToast(errMsg, { type: 'error', title: t('common.error') || 'Gagal Mendaftar' });
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 lg:p-8">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuthModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="w-full max-w-3xl bg-white dark:bg-[#1C2129] rounded-[1.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-[#E1E5EA] dark:border-[#2C3440] relative z-10 min-h-[380px]"
          >
            {/* Close Button */}
            <button 
              onClick={closeAuthModal}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-[#252C36] shadow-md hover:scale-105 active:scale-95 text-[#2B3542] dark:text-[#FAF3F3] transition-all border border-[#E1E5EA] dark:border-[#2C3440]"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left/Right Side Background Image */}
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

            {/* Login View */}
            <div className={`w-full md:w-1/2 relative p-4 sm:p-5 lg:p-6 overflow-y-auto custom-scrollbar flex-col justify-center transition-opacity duration-500 z-10 ${isLoginView ? 'flex opacity-100 pointer-events-auto' : 'hidden md:flex opacity-0 pointer-events-none'}`}>
              <div className="flex flex-col items-center text-center space-y-1 mb-4 mt-1 md:mt-0">
                <div className="w-12 h-12 bg-white dark:bg-[#1C2129] p-2 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm mb-0.5">
                  <img src={logoAsset} alt="GiriTrack Logo" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-xl font-black text-[#2B3542] dark:text-[#FAF3F3] tracking-tight">
                  {t('auth.loginTitle')}
                </h1>
                <p className="text-[11px] text-[#6B7C8C] dark:text-[#A7BBC7] max-w-[250px]">
                  {t('auth.loginSubtitle')}
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-2.5">
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
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3]/50 dark:bg-[#252C36]/50 text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40 transition-all duration-200"
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
                      className="w-full pl-8 pr-8 py-1.5 rounded-lg border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3]/50 dark:bg-[#252C36]/50 text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40 transition-all duration-200"
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
                  className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 px-4 bg-[#DA7F8F] text-white rounded-lg text-xs font-bold shadow-md hover:bg-[#c96c7d] hover:shadow-lg transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  <span>{t('auth.submitBtn')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              <p className="mt-4 text-center text-[10px] text-[#6B7C8C] dark:text-[#A7BBC7]">
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={() => setIsLoginView(false)}
                  className="font-bold text-[#DA7F8F] hover:text-[#c96c7d] hover:underline transition-colors cursor-pointer"
                >
                  Daftar Sekarang
                </button>
              </p>
            </div>

            {/* Register View */}
            <div className={`w-full md:w-1/2 relative p-4 sm:p-5 lg:p-6 overflow-y-auto custom-scrollbar flex-col justify-center transition-opacity duration-500 z-10 ${!isLoginView ? 'flex opacity-100 pointer-events-auto' : 'hidden md:flex opacity-0 pointer-events-none'}`}>
              <div className="flex flex-col items-center text-center space-y-1 mb-4 mt-1 md:mt-0">
                <div className="w-12 h-12 bg-white dark:bg-[#1C2129] p-2 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm mb-0.5">
                  <img src={logoAsset} alt="GiriTrack Logo" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-xl font-black text-[#2B3542] dark:text-[#FAF3F3] tracking-tight">
                  Buat Akun Baru
                </h1>
                <p className="text-[11px] text-[#6B7C8C] dark:text-[#A7BBC7] max-w-[250px]">
                  Bergabunglah dengan komunitas pendaki kami
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-2">
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
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3]/50 dark:bg-[#252C36]/50 text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40 transition-all duration-200"
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
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3]/50 dark:bg-[#252C36]/50 text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40 transition-all duration-200"
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
                        className="w-full pl-7 pr-7 py-1.5 rounded-lg border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3]/50 dark:bg-[#252C36]/50 text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40 transition-all duration-200"
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
                        className="w-full pl-7 pr-7 py-1.5 rounded-lg border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3]/50 dark:bg-[#252C36]/50 text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40 transition-all duration-200"
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
                  className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 px-4 bg-[#DA7F8F] text-white rounded-lg text-xs font-bold shadow-md hover:bg-[#c96c7d] hover:shadow-lg transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Daftar Akun Baru</span>
                  <ChevronRight className="w-3 h-3 ml-auto opacity-70" />
                </button>
              </form>

              <p className="mt-4 text-center text-[10px] text-[#6B7C8C] dark:text-[#A7BBC7]">
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => setIsLoginView(true)}
                  className="font-bold text-[#DA7F8F] hover:text-[#c96c7d] hover:underline transition-colors cursor-pointer"
                >
                  Masuk di sini
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
