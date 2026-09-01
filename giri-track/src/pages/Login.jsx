import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mountain, Mail, Lock, ShieldAlert, UserCheck, LogIn, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import logoAsset from '../assets/logo.png';

export default function Login() {
  const { login, loginAsDemoAdmin, loginAsDemoUser, isLoggedIn, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // If user is already logged in, show status & redirect option
  if (isLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="bg-white dark:bg-[#2D1C1D] rounded-3xl p-8 border border-[#DBC4B6] dark:border-[#57595B]/40 shadow-xl text-center space-y-5 text-[#452829] dark:text-[#F3E8DF]">
          <div className="w-16 h-16 rounded-full bg-[#EFE4DC] dark:bg-[#3F2728] text-[#452829] dark:text-[#E8D1C5] flex items-center justify-center mx-auto shadow-inner">
            <UserCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black">Anda Sudah Masuk</h2>
            <p className="text-xs text-[#57595B] dark:text-[#E8D1C5] mt-1">
              Terautentikasi sebagai <strong className="text-[#452829] dark:text-[#F3E8DF]">{user.name || user.email}</strong> (
              <span className="capitalize font-semibold text-amber-700 dark:text-amber-300">{user.role}</span>)
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 rounded-2xl bg-[#452829] text-[#F3E8DF] dark:bg-[#E8D1C5] dark:text-[#452829] font-bold text-xs shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError(t('auth.errorRequired'));
      return;
    }

    // Call login from AuthContext
    login({ email, password, role });
    navigate('/');
  };

  const handleDemoAdmin = () => {
    loginAsDemoAdmin();
    navigate('/');
  };

  const handleDemoUser = () => {
    loginAsDemoUser();
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto my-8 sm:my-14 px-4">
      <div className="bg-white dark:bg-[#2D1C1D] rounded-3xl p-6 sm:p-8 border border-[#DBC4B6] dark:border-[#57595B]/40 shadow-xl space-y-6 text-[#452829] dark:text-[#F3E8DF] transition-colors duration-300">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-[#EFE4DC]/80 dark:bg-[#3F2728]/80 border border-[#DBC4B6]/60 dark:border-[#57595B]/40 flex items-center justify-center mx-auto shadow-md p-1.5 transform hover:scale-105 transition-transform duration-200">
            <img src={logoAsset} alt="GiriTrack Logo" className="w-full h-full object-contain rounded-xl" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#452829] dark:text-[#F3E8DF] tracking-tight">
            {t('auth.loginTitle')}
          </h1>
          <p className="text-xs text-[#57595B] dark:text-[#E8D1C5]">
            {t('auth.loginSubtitle')}
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#57595B] dark:text-[#E8D1C5]">
            {t('auth.roleLabel')}
          </label>
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#EFE4DC]/70 dark:bg-[#3F2728]/70 border border-[#DBC4B6]/60 dark:border-[#57595B]/40">
            <button
              type="button"
              onClick={() => setRole('user')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'user'
                  ? 'bg-white dark:bg-[#2D1C1D] text-[#452829] dark:text-[#F3E8DF] shadow-sm border border-[#DBC4B6] dark:border-[#57595B]/50'
                  : 'text-[#57595B] dark:text-[#E8D1C5] hover:text-[#452829]'
              }`}
            >
              <UserCheck className={`w-3.5 h-3.5 ${role === 'user' ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
              <span>{t('auth.roleUser')}</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'admin'
                  ? 'bg-white dark:bg-[#2D1C1D] text-[#452829] dark:text-[#F3E8DF] shadow-sm border border-[#DBC4B6] dark:border-[#57595B]/50'
                  : 'text-[#57595B] dark:text-[#E8D1C5] hover:text-[#452829]'
              }`}
            >
              <ShieldAlert className={`w-3.5 h-3.5 ${role === 'admin' ? 'text-amber-600 dark:text-amber-400' : ''}`} />
              <span>{t('auth.roleAdmin')}</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#57595B] dark:text-[#E8D1C5] mb-1">
              {t('auth.emailLabel')} *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#57595B] dark:text-[#E8D1C5]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#DBC4B6] dark:border-[#57595B]/40 bg-[#EFE4DC]/40 dark:bg-[#3F2728]/40 text-xs text-[#452829] dark:text-[#F3E8DF] focus:outline-none focus:ring-2 focus:ring-[#452829] transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#57595B] dark:text-[#E8D1C5] mb-1">
              {t('auth.passwordLabel')} *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#57595B] dark:text-[#E8D1C5]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-[#DBC4B6] dark:border-[#57595B]/40 bg-[#EFE4DC]/40 dark:bg-[#3F2728]/40 text-xs text-[#452829] dark:text-[#F3E8DF] focus:outline-none focus:ring-2 focus:ring-[#452829] transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#57595B] dark:text-[#E8D1C5] hover:text-[#452829] transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#452829] text-[#F3E8DF] hover:bg-[#341e1f] dark:bg-[#E8D1C5] dark:text-[#452829] font-bold text-xs shadow-md transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{t('auth.submitBtn')}</span>
          </button>
        </form>

        {/* Demo Quick Login Presets */}
        <div className="border-t border-[#DBC4B6]/60 dark:border-[#57595B]/40 pt-4 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs text-[#57595B] dark:text-[#E8D1C5] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Quick Login Demo (1-Klik):</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoAdmin}
              className="px-3 py-2 rounded-xl border border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 hover:bg-amber-100 text-xs font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('auth.demoAdmin')}</span>
            </button>

            <button
              type="button"
              onClick={handleDemoUser}
              className="px-3 py-2 rounded-xl border border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 text-xs font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('auth.demoUser')}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
