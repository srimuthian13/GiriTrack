import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  Compass,
  Navigation,
  History,
  Settings,
  ShieldCheck,
  LogIn,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  XCircle,
  Sun,
  Moon,
  Activity,
  Ticket,
  Home as HomeIcon
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import ModalConfirm from './ModalConfirm';
import Logo from './Logo';

export default function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const { isAdmin, user, isLoggedIn, logout, openAuthModal } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Search Bar State
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dropdown States
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const exploreDropdownRef = useRef(null);
  const adminDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const handleGuestClick = (e) => {
    if (!isLoggedIn) {
      if (e) e.preventDefault();
      openAuthModal();
      setIsExploreOpen(false);
      setIsAdminOpen(false);
      setMobileMenuOpen(false);
      return false;
    }
    return true;
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        exploreDropdownRef.current &&
        !exploreDropdownRef.current.contains(event.target)
      ) {
        setIsExploreOpen(false);
      }
      if (
        adminDropdownRef.current &&
        !adminDropdownRef.current.contains(event.target)
      ) {
        setIsAdminOpen(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsExploreOpen(false);
    setIsAdminOpen(false);
    setIsProfileOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle Global Search Submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      showToast('Silakan login atau registrasi terlebih dahulu untuk mencari jalur!', {
        type: 'error',
        title: 'Akses Terbatas'
      });
      openAuthModal();
      setMobileMenuOpen(false);
      return;
    }
    if (searchQuery.trim()) {
      navigate(`/trails?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    } else {
      navigate('/trails');
      setMobileMenuOpen(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleConfirmLogout = () => {
    logout();
    setLogoutModalOpen(false);
    setIsProfileOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  // Sub-items for "Jelajah" Dropdown
  const baseExploreItems = [
    {
      path: '/trails',
      label: t('nav.trails') || 'Katalog Jalur',
      icon: Compass,
      desc: 'Daftar rute & gunung di Indonesia',
    },
    {
      path: '/races',
      label: t('nav.races') || 'Lomba Lari Gunung',
      icon: Activity,
      desc: 'Registrasi event lari lintas alam',
    },
  ];

  if (!isAdmin) {
    baseExploreItems.push(
      {
        path: '/tracker',
        label: t('nav.tracker') || 'GPS Tracker',
        icon: Navigation,
        desc: 'Pelacak rute live & elevasi',
      },
      {
        path: '/history',
        label: t('nav.history') || 'Riwayat',
        icon: History,
        desc: 'Log & statistik track pendakian',
      }
    );
  }

  const exploreItems = baseExploreItems;

  const isExploreActive = exploreItems.some((item) => location.pathname === item.path);

  // Short display name for user
  const displayName = user?.name
    ? user.name.split(' ')[0]
    : user?.email
    ? user.email.split('@')[0]
    : 'Pendaki';

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FAF3F3]/90 dark:bg-[#1C2129]/90 border-b border-[#E1E5EA] dark:border-[#2C3440] text-[#2B3542] dark:text-[#FAF3F3] transition-colors duration-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3 md:gap-4">
            
            {/* ========================================================= */}
            {/* 1. SISI KIRI: BRAND LOGO */}
            {/* ========================================================= */}
            <div className="shrink-0">
              <Logo
                className="h-8 sm:h-9 w-auto"
                showText={true}
                textClassName="text-lg sm:text-xl font-black tracking-tight"
                to={isAdmin ? "/admin" : "/"}
              />
            </div>

            {/* ========================================================= */}
            {/* 2. SISI TENGAH: SEARCH BAR PROPORSIONAL */}
            {/* ========================================================= */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex items-center relative w-full max-w-xs lg:max-w-sm"
            >
              <Search className="w-3.5 h-3.5 absolute left-3.5 text-[#A7BBC7] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari gunung atau jalur..."
                className="w-full h-9 pl-9 pr-8 rounded-full bg-[#E1E5EA]/60 dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440] text-xs text-[#2B3542] dark:text-[#FAF3F3] placeholder-[#A7BBC7] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40 focus:border-[#DA7F8F] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2.5 text-[#A7BBC7] hover:text-[#2B3542] dark:hover:text-[#FAF3F3] p-0.5 cursor-pointer"
                  title="Hapus pencarian"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* ========================================================= */}
            {/* 3. SISI KANAN: NAVIGATION & STREAMLINED CONTROLS */}
            {/* ========================================================= */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              
              {/* Nav Link: Admin Dropdown or User Navigation */}
              {isAdmin ? (
                <div className="relative" ref={adminDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsAdminOpen(!isAdminOpen)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                      isAdminOpen || location.pathname.startsWith('/admin') || location.pathname === '/manage'
                        ? 'text-[#DA7F8F] bg-[#DA7F8F]/10 dark:bg-[#DA7F8F]/15 border-[#DA7F8F]/40 shadow-sm'
                        : 'text-[#2B3542] dark:text-[#FAF3F3] hover:text-[#DA7F8F] border-[#E1E5EA] dark:border-[#2C3440] bg-[#E1E5EA]/40 dark:bg-[#252C36]/50'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#DA7F8F]" />
                    <span>Menu Administrator</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isAdminOpen ? 'rotate-180 text-[#DA7F8F]' : ''
                      }`}
                    />
                  </button>

                  {/* Admin Dropdown Menu */}
                  {isAdminOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#A7BBC7] flex items-center gap-1.5 border-b border-[#E1E5EA] dark:border-[#2C3440] mb-1 pb-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#DA7F8F]" />
                        <span>Pengelolaan Sistem</span>
                      </div>

                      <Link
                        to="/admin"
                        onClick={() => setIsAdminOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 text-xs transition-colors ${
                          location.pathname === '/admin'
                            ? 'bg-[#DA7F8F]/10 text-[#DA7F8F] font-bold'
                            : 'text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#FAF3F3] dark:hover:bg-[#252C36]'
                        }`}
                      >
                        <HomeIcon className="w-4 h-4 text-[#DA7F8F] shrink-0" />
                        <div>
                          <p className="font-bold">Dashboard Admin</p>
                          <p className="text-[10px] text-[#A7BBC7] font-normal">Panel statistik & ringkasan</p>
                        </div>
                      </Link>

                      <Link
                        to="/admin/races"
                        onClick={() => setIsAdminOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 text-xs transition-colors ${
                          location.pathname === '/admin/races'
                            ? 'bg-[#DA7F8F]/10 text-[#DA7F8F] font-bold'
                            : 'text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#FAF3F3] dark:hover:bg-[#252C36]'
                        }`}
                      >
                        <Activity className="w-4 h-4 text-[#DA7F8F] shrink-0" />
                        <div>
                          <p className="font-bold">Kelola Lomba</p>
                          <p className="text-[10px] text-[#A7BBC7] font-normal">Event lari & catat finish</p>
                        </div>
                      </Link>

                      <Link
                        to="/manage"
                        onClick={() => setIsAdminOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 text-xs transition-colors ${
                          location.pathname === '/manage'
                            ? 'bg-[#DA7F8F]/10 text-[#DA7F8F] font-bold'
                            : 'text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#FAF3F3] dark:hover:bg-[#252C36]'
                        }`}
                      >
                        <Settings className="w-4 h-4 text-[#DA7F8F] shrink-0" />
                        <div>
                          <p className="font-bold">Kelola Jalur</p>
                          <p className="text-[10px] text-[#A7BBC7] font-normal">Verifikasi & edit data rute</p>
                        </div>
                      </Link>

                      <div className="border-t border-[#E1E5EA] dark:border-[#2C3440] my-1" />

                      <Link
                        to="/trails"
                        onClick={() => setIsAdminOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 text-xs transition-colors ${
                          location.pathname === '/trails'
                            ? 'bg-[#DA7F8F]/10 text-[#DA7F8F] font-bold'
                            : 'text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#FAF3F3] dark:hover:bg-[#252C36]'
                        }`}
                      >
                        <Compass className="w-4 h-4 text-[#DA7F8F] shrink-0" />
                        <div>
                          <p className="font-bold">Katalog Publik</p>
                          <p className="text-[10px] text-[#A7BBC7] font-normal">Tampilan jalur versi pengguna</p>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                        isActive
                          ? 'text-[#DA7F8F] bg-[#DA7F8F]/10 dark:bg-[#DA7F8F]/15'
                          : 'text-[#2B3542] dark:text-[#FAF3F3] hover:text-[#DA7F8F] dark:hover:text-[#DA7F8F]'
                      }`
                    }
                  >
                    {t('nav.home') || 'Beranda'}
                  </NavLink>

                  {/* Nav Link: Jelajah Dropdown (Khusus User) */}
                  <div className="relative" ref={exploreDropdownRef}>
                    <button
                      type="button"
                      onClick={(e) => {
                        if (!isLoggedIn) {
                          handleGuestClick(e, '/trails');
                          return;
                        }
                        setIsExploreOpen(!isExploreOpen);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isExploreActive || isExploreOpen
                          ? 'text-[#DA7F8F] bg-[#DA7F8F]/10 dark:bg-[#DA7F8F]/15'
                          : 'text-[#2B3542] dark:text-[#FAF3F3] hover:text-[#DA7F8F] dark:hover:text-[#DA7F8F]'
                      }`}
                    >
                      <span>{t('nav.explore') || 'Jelajah'}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isExploreOpen ? 'rotate-180 text-[#DA7F8F]' : ''
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu Popup */}
                    {isExploreOpen && (
                      <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#A7BBC7]">
                          Fitur Jelajah
                        </div>
                        {exploreItems.map((item) => {
                          const Icon = item.icon;
                          const isActive = location.pathname === item.path;
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={(e) => {
                                if (!handleGuestClick(e, item.path)) return;
                                setIsExploreOpen(false);
                              }}
                              className={`flex items-start gap-3 px-3.5 py-2.5 text-xs transition-colors ${
                                isActive
                                  ? 'bg-[#DA7F8F]/10 text-[#DA7F8F]'
                                  : 'text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#FAF3F3] dark:hover:bg-[#252C36]'
                              }`}
                            >
                              <Icon className="w-4 h-4 mt-0.5 text-[#DA7F8F] shrink-0" />
                              <div>
                                <p className="font-bold">{item.label}</p>
                                <p className="text-[10px] text-[#A7BBC7] font-normal leading-tight">
                                  {item.desc}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Vertical Divider */}
              <div className="h-4 w-px bg-[#E1E5EA] dark:bg-[#2C3440] mx-0.5" />

              {/* Quick Utility 1: Theme Toggle (Icon-only) */}
              <button
                type="button"
                onClick={toggleTheme}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[#E1E5EA]/70 dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440] text-[#2B3542] dark:text-[#FAF3F3] hover:scale-105 active:scale-95 transition cursor-pointer shadow-sm"
                title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90" />
                ) : (
                  <Moon className="w-4 h-4 text-[#DA7F8F]" />
                )}
              </button>

              {/* Quick Utility 2: Language Toggle (Small Pill ID | EN) */}
              <button
                type="button"
                onClick={toggleLanguage}
                className="h-8 px-2.5 rounded-full flex items-center justify-center bg-[#E1E5EA]/70 dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440] text-[11px] font-bold font-mono tracking-wider text-[#2B3542] dark:text-[#FAF3F3] hover:scale-105 active:scale-95 transition cursor-pointer shadow-sm"
                title="Ganti Bahasa (ID / EN)"
              >
                <span className={language === 'id' ? 'text-[#DA7F8F] font-black' : 'text-[#A7BBC7]'}>
                  ID
                </span>
                <span className="mx-1 text-[#A7BBC7] font-normal">|</span>
                <span className={language === 'en' ? 'text-[#DA7F8F] font-black' : 'text-[#A7BBC7]'}>
                  EN
                </span>
              </button>

              {/* Vertical Divider */}
              <div className="h-4 w-px bg-[#E1E5EA] dark:bg-[#2C3440] mx-0.5" />

              {/* User Profile / Auth Action */}
              {isLoggedIn ? (
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-[#E1E5EA]/70 dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440] hover:border-[#DA7F8F]/50 transition cursor-pointer shadow-sm"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#DA7F8F] text-white flex items-center justify-center text-[11px] font-black uppercase overflow-hidden shrink-0">
                      {user.avatar ? (
                        <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
                      ) : (
                        displayName.charAt(0)
                      )}
                    </div>
                    
                    {/* User Display Name */}
                    <span className="text-xs font-bold text-[#2B3542] dark:text-[#FAF3F3] max-w-[90px] truncate">
                      {displayName}
                    </span>

                    <ChevronDown className="w-3.5 h-3.5 text-[#A7BBC7]" />
                  </button>

                  {/* Profile Menu Popup Card */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#1C2129] border border-[#E1E5EA] dark:border-[#2C3440] shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-[#E1E5EA] dark:border-[#2C3440]">
                        <p className="text-xs font-bold text-[#2B3542] dark:text-white truncate">
                          {user.name || displayName}
                        </p>
                        <p className="text-[10px] text-[#A7BBC7] truncate">
                          {user.email || 'Akun GiriTrack'}
                        </p>
                      </div>

                      <div className="py-1">
                        {/* Global Profile Links */}
                        {!isAdmin && (
                          <Link
                            to="/my-tickets"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#FAF3F3] dark:hover:bg-[#252C36] transition"
                          >
                            <Ticket className="w-4 h-4 text-[#DA7F8F]" />
                            <span>{t('nav.myTickets') || 'Tiket Lomba Saya'}</span>
                          </Link>
                        )}
                        <Link
                          to="/profile"
                          onClick={() => {
                            setIsProfileOpen(false);
                            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                          }}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#FAF3F3] dark:hover:bg-[#252C36] transition"
                        >
                          <UserIcon className="w-4 h-4 text-[#DA7F8F]" />
                          <span>{t('nav.profileSettings') || 'Pengaturan Profil'}</span>
                        </Link>

                        {!isAdmin && (
                          <Link
                            to="/manage"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#FAF3F3] dark:hover:bg-[#252C36] transition"
                          >
                            <Settings className="w-4 h-4 text-[#DA7F8F]" />
                            <span>Ajukan Jalur Baru</span>
                          </Link>
                        )}

                        {isAdmin && (
                          <div className="mt-1 pt-1 border-t border-[#E1E5EA] dark:border-[#2C3440]">
                            <Link
                              to="/admin"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#DA7F8F] hover:bg-[#DA7F8F]/10 transition"
                            >
                              <ShieldCheck className="w-4 h-4" />
                              <span>Admin Dashboard</span>
                            </Link>
                            <Link
                              to="/admin/races"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#DA7F8F] hover:bg-[#DA7F8F]/10 transition"
                            >
                              <Activity className="w-4 h-4" />
                              <span>Kelola & Tambah Lomba</span>
                            </Link>
                            <Link
                              to="/manage"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#DA7F8F] hover:bg-[#DA7F8F]/10 transition"
                            >
                              <Settings className="w-4 h-4" />
                              <span>Kelola & Verifikasi Jalur</span>
                            </Link>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-[#E1E5EA] dark:border-[#2C3440] pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            setLogoutModalOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Keluar / Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={openAuthModal}
                  className="px-4 py-1.5 rounded-full bg-[#DA7F8F] hover:bg-[#c96c7d] text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t('auth.loginTitle') || 'Masuk'}</span>
                </button>
              )}

            </div>

            {/* ========================================================= */}
            {/* 4. MOBILE HAMBURGER BUTTON */}
            {/* ========================================================= */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[#E1E5EA]/70 dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440] text-[#2B3542] dark:text-[#FAF3F3]"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#DA7F8F]" />}
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-[#E1E5EA]/70 dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440] text-[#2B3542] dark:text-[#FAF3F3] cursor-pointer"
                aria-label="Toggle Mobile Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE DRAWER MENU */}
        {/* ========================================================= */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3]/95 dark:bg-[#1C2129]/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-2">
            
            {/* Mobile Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A7BBC7] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari gunung atau jalur..."
                className="w-full pl-9 pr-8 py-2 text-xs rounded-full bg-[#E1E5EA]/70 dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440] text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A7BBC7] p-0.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Mobile User Block */}
            <div className="pb-3 border-b border-[#E1E5EA] dark:border-[#2C3440]">
              {isLoggedIn ? (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#DA7F8F] text-white flex items-center justify-center text-xs font-black uppercase">
                      {displayName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#2B3542] dark:text-white leading-tight">
                        {displayName}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setLogoutModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs font-bold text-rose-500 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal();
                  }}
                  className="w-full py-2.5 rounded-full bg-[#DA7F8F] hover:bg-[#c96c7d] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t('auth.loginTitle') || 'Masuk / Login'}</span>
                </button>
              )}
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              {!isAdmin && (
                <NavLink
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                      isActive
                        ? 'bg-[#DA7F8F] text-white'
                        : 'text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#E1E5EA]/50 dark:hover:bg-[#252C36]'
                    }`
                  }
                >
                  <HomeIcon className="w-4 h-4 text-[#DA7F8F]" />
                  <span>{t('nav.home') || 'Beranda'}</span>
                </NavLink>
              )}

              {isAdmin ? (
                /* Admin Specific Mobile Drawer Links */
                <>
                  <div className="px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#DA7F8F]">
                    Menu Administrator
                  </div>
                  <NavLink
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                        isActive
                          ? 'bg-[#DA7F8F] text-white'
                          : 'text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#DA7F8F]/10'
                      }`
                    }
                  >
                    <ShieldCheck className="w-4 h-4 text-[#DA7F8F]" />
                    <span>Admin Dashboard</span>
                  </NavLink>
                  <NavLink
                    to="/admin/races"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                        isActive
                          ? 'bg-[#DA7F8F] text-white'
                          : 'text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#DA7F8F]/10'
                      }`
                    }
                  >
                    <Activity className="w-4 h-4 text-[#DA7F8F]" />
                    <span>Kelola & Tambah Lomba</span>
                  </NavLink>
                  <NavLink
                    to="/manage"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                        isActive
                          ? 'bg-[#DA7F8F] text-white'
                          : 'text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#DA7F8F]/10'
                      }`
                    }
                  >
                    <Settings className="w-4 h-4 text-[#DA7F8F]" />
                    <span>Kelola & Verifikasi Jalur</span>
                  </NavLink>

                  <div className="pt-2 border-t border-[#E1E5EA] dark:border-[#2C3440] my-1" />
                  <div className="px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#6B7C8C] dark:text-[#A7BBC7]">
                    Katalog & Publik
                  </div>
                  <NavLink
                    to="/trails"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                        isActive
                          ? 'bg-[#DA7F8F] text-white'
                          : 'text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#E1E5EA]/50 dark:hover:bg-[#252C36]'
                      }`
                    }
                  >
                    <Compass className="w-4 h-4 text-[#DA7F8F]" />
                    <span>{t('nav.trails') || 'Katalog Jalur'}</span>
                  </NavLink>
                  <NavLink
                    to="/races"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                        isActive
                          ? 'bg-[#DA7F8F] text-white'
                          : 'text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#E1E5EA]/50 dark:hover:bg-[#252C36]'
                      }`
                    }
                  >
                    <Activity className="w-4 h-4 text-[#DA7F8F]" />
                    <span>{t('nav.races') || 'Lomba Lari Gunung'}</span>
                  </NavLink>
                  <NavLink
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                        isActive
                          ? 'bg-[#DA7F8F] text-white'
                          : 'text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#E1E5EA]/50 dark:hover:bg-[#252C36]'
                      }`
                    }
                  >
                    <UserIcon className="w-4 h-4 text-[#DA7F8F]" />
                    <span>{t('nav.profileSettings') || 'Pengaturan Profil'}</span>
                  </NavLink>
                </>
              ) : (
                /* Regular User Mobile Drawer Links */
                <>
                  {exploreItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={(e) => {
                          if (!handleGuestClick(e, item.path)) return;
                          setMobileMenuOpen(false);
                        }}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                            isActive
                              ? 'bg-[#DA7F8F] text-white'
                              : 'text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#E1E5EA]/50 dark:hover:bg-[#252C36]'
                          }`
                        }
                      >
                        <Icon className="w-4 h-4 text-[#DA7F8F]" />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}

                  {isLoggedIn && (
                    <>
                      <NavLink
                        to="/my-tickets"
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                            isActive
                              ? 'bg-[#DA7F8F] text-white'
                              : 'text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#E1E5EA]/50 dark:hover:bg-[#252C36]'
                          }`
                        }
                      >
                        <Ticket className="w-4 h-4 text-[#DA7F8F]" />
                        <span>{t('nav.myTickets') || 'Tiket Lomba Saya'}</span>
                      </NavLink>
                      <NavLink
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                            isActive
                              ? 'bg-[#DA7F8F] text-white'
                              : 'text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#E1E5EA]/50 dark:hover:bg-[#252C36]'
                          }`
                        }
                      >
                        <UserIcon className="w-4 h-4 text-[#DA7F8F]" />
                        <span>{t('nav.profileSettings') || 'Pengaturan Profil'}</span>
                      </NavLink>
                      <NavLink
                        to="/manage"
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                            isActive
                              ? 'bg-[#DA7F8F] text-white'
                              : 'text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#FAF3F3] dark:hover:bg-[#252C36]'
                          }`
                        }
                      >
                        <Settings className="w-4 h-4 text-[#DA7F8F]" />
                        <span>Ajukan Jalur Baru</span>
                      </NavLink>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Language Toggle in Mobile */}
            <div className="pt-2 flex items-center justify-between border-t border-[#E1E5EA] dark:border-[#2C3440] text-xs font-bold">
              <span className="text-[#A7BBC7]">Bahasa / Language</span>
              <button
                type="button"
                onClick={toggleLanguage}
                className="px-3 py-1 rounded-full bg-[#E1E5EA]/70 dark:bg-[#252C36] border border-[#E1E5EA] dark:border-[#2C3440] text-xs font-mono font-bold uppercase cursor-pointer"
              >
                {language}
              </button>
            </div>

          </div>
        )}
      </header>

      {/* Logout Confirmation Modal */}
      <ModalConfirm
        isOpen={logoutModalOpen}
        onCancel={() => setLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Konfirmasi Keluar Akun"
        subtitle="Sesi GiriTrack Anda"
        message="Apakah Anda yakin ingin keluar dari akun GiriTrack Anda saat ini?"
        confirmText="Keluar Akun"
      />

      {/* ========================================================= */}
      {/* MOBILE BOTTOM NAVIGATION BAR (KHUSUS LAYAR HP / MOBILE) */}
      {/* ========================================================= */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#FAF3F3]/95 dark:bg-[#1C2129]/95 backdrop-blur-xl border-t border-[#E1E5EA] dark:border-[#2C3440] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.4)] transition-colors duration-200"
      >
        <div className="grid grid-cols-5 items-center py-1.5 px-1 max-w-lg mx-auto">
          
          {isAdmin ? (
            /* ADMIN MOBILE BOTTOM NAV */
            <>
              {/* 1. Admin Dashboard */}
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all duration-200 active:scale-90 ${
                    isActive
                      ? 'text-[#DA7F8F] font-black'
                      : 'text-[#57595B] dark:text-[#A7BBC7] hover:text-[#DA7F8F] dark:hover:text-[#DA7F8F]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-1 rounded-full transition-colors ${isActive ? 'bg-[#DA7F8F]/15 text-[#DA7F8F]' : ''}`}>
                      <ShieldCheck className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
                    </div>
                    <span className="text-[10px] tracking-tight mt-0.5 truncate text-center leading-tight">
                      Dashboard
                    </span>
                  </>
                )}
              </NavLink>

              {/* 2. Katalog Jalur */}
              <NavLink
                to="/trails"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all duration-200 active:scale-90 ${
                    isActive
                      ? 'text-[#DA7F8F] font-black'
                      : 'text-[#57595B] dark:text-[#A7BBC7] hover:text-[#DA7F8F] dark:hover:text-[#DA7F8F]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-1 rounded-full transition-colors ${isActive ? 'bg-[#DA7F8F]/15 text-[#DA7F8F]' : ''}`}>
                      <Compass className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
                    </div>
                    <span className="text-[10px] tracking-tight mt-0.5 truncate text-center leading-tight">
                      Katalog
                    </span>
                  </>
                )}
              </NavLink>

              {/* 3. Kelola Jalur */}
              <NavLink
                to="/manage"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all duration-200 active:scale-90 ${
                    isActive
                      ? 'text-[#DA7F8F] font-black'
                      : 'text-[#57595B] dark:text-[#A7BBC7] hover:text-[#DA7F8F] dark:hover:text-[#DA7F8F]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-1 rounded-full transition-colors ${isActive ? 'bg-[#DA7F8F]/15 text-[#DA7F8F]' : ''}`}>
                      <Settings className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
                    </div>
                    <span className="text-[10px] tracking-tight mt-0.5 truncate text-center leading-tight">
                      Kelola Jalur
                    </span>
                  </>
                )}
              </NavLink>

              {/* 4. Kelola Lomba */}
              <NavLink
                to="/admin/races"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all duration-200 active:scale-90 ${
                    isActive
                      ? 'text-[#DA7F8F] font-black'
                      : 'text-[#57595B] dark:text-[#A7BBC7] hover:text-[#DA7F8F] dark:hover:text-[#DA7F8F]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-1 rounded-full transition-colors ${isActive ? 'bg-[#DA7F8F]/15 text-[#DA7F8F]' : ''}`}>
                      <Activity className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
                    </div>
                    <span className="text-[10px] tracking-tight mt-0.5 truncate text-center leading-tight">
                      Kelola Lomba
                    </span>
                  </>
                )}
              </NavLink>

              {/* 5. Profil Admin */}
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all duration-200 active:scale-90 ${
                    isActive
                      ? 'text-[#DA7F8F] font-black'
                      : 'text-[#57595B] dark:text-[#A7BBC7] hover:text-[#DA7F8F] dark:hover:text-[#DA7F8F]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-1 rounded-full transition-colors ${isActive ? 'bg-[#DA7F8F]/15 text-[#DA7F8F]' : ''}`}>
                      <UserIcon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
                    </div>
                    <span className="text-[10px] tracking-tight mt-0.5 truncate text-center leading-tight">
                      Profil
                    </span>
                  </>
                )}
              </NavLink>
            </>
          ) : (
            /* REGULAR USER MOBILE BOTTOM NAV */
            <>
              {/* 1. Beranda */}
              <NavLink
                to="/"
                end
                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all duration-200 active:scale-90 ${
                    isActive
                      ? 'text-[#DA7F8F] font-black'
                      : 'text-[#57595B] dark:text-[#A7BBC7] hover:text-[#DA7F8F] dark:hover:text-[#DA7F8F]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-1 rounded-full transition-colors ${isActive ? 'bg-[#DA7F8F]/15 text-[#DA7F8F]' : ''}`}>
                      <HomeIcon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
                    </div>
                    <span className="text-[10px] tracking-tight mt-0.5 truncate text-center leading-tight">
                      Beranda
                    </span>
                  </>
                )}
              </NavLink>

              {/* 2. Cari Gunung dan Jalur */}
              <NavLink
                to="/trails"
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault();
                    openAuthModal();
                  } else {
                    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  }
                }}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all duration-200 active:scale-90 ${
                    isActive
                      ? 'text-[#DA7F8F] font-black'
                      : 'text-[#57595B] dark:text-[#A7BBC7] hover:text-[#DA7F8F] dark:hover:text-[#DA7F8F]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-1 rounded-full transition-colors ${isActive ? 'bg-[#DA7F8F]/15 text-[#DA7F8F]' : ''}`}>
                      <Compass className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
                    </div>
                    <span className="text-[10px] tracking-tight mt-0.5 truncate text-center leading-tight">
                      Cari Jalur
                    </span>
                  </>
                )}
              </NavLink>

              {/* 3. Rekam Jejak Anda */}
              <NavLink
                to="/tracker"
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault();
                    openAuthModal();
                  } else {
                    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  }
                }}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all duration-200 active:scale-90 ${
                    isActive
                      ? 'text-[#DA7F8F] font-black'
                      : 'text-[#57595B] dark:text-[#A7BBC7] hover:text-[#DA7F8F] dark:hover:text-[#DA7F8F]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-1 rounded-full transition-colors ${isActive ? 'bg-[#DA7F8F]/15 text-[#DA7F8F]' : ''}`}>
                      <Navigation className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
                    </div>
                    <span className="text-[10px] tracking-tight mt-0.5 truncate text-center leading-tight">
                      Rekam Jejak
                    </span>
                  </>
                )}
              </NavLink>

              {/* 4. Catatan Pendakian Saya */}
              <NavLink
                to="/history"
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault();
                    openAuthModal();
                  } else {
                    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  }
                }}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all duration-200 active:scale-90 ${
                    isActive
                      ? 'text-[#DA7F8F] font-black'
                      : 'text-[#57595B] dark:text-[#A7BBC7] hover:text-[#DA7F8F] dark:hover:text-[#DA7F8F]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-1 rounded-full transition-colors ${isActive ? 'bg-[#DA7F8F]/15 text-[#DA7F8F]' : ''}`}>
                      <History className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
                    </div>
                    <span className="text-[10px] tracking-tight mt-0.5 truncate text-center leading-tight">
                      Catatan Saya
                    </span>
                  </>
                )}
              </NavLink>

              {/* 5. Profil */}
              <NavLink
                to="/profile"
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault();
                    openAuthModal();
                  } else {
                    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  }
                }}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all duration-200 active:scale-90 ${
                    isActive
                      ? 'text-[#DA7F8F] font-black'
                      : 'text-[#57595B] dark:text-[#A7BBC7] hover:text-[#DA7F8F] dark:hover:text-[#DA7F8F]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-1 rounded-full transition-colors ${isActive ? 'bg-[#DA7F8F]/15 text-[#DA7F8F]' : ''}`}>
                      <UserIcon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
                    </div>
                    <span className="text-[10px] tracking-tight mt-0.5 truncate text-center leading-tight">
                      Profil
                    </span>
                  </>
                )}
              </NavLink>
            </>
          )}

        </div>
      </nav>
    </>
  );
}
