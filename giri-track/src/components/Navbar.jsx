import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  Compass,
  Calendar,
  Navigation,
  History,
  Settings,
  LogIn,
  LogOut,
  User as UserIcon,
  Languages,
  Menu,
  X,
  XCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import RoleToggle from './RoleToggle';
import ModalConfirm from './ModalConfirm';
import Logo from './Logo';

export default function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const { isAdmin, user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Search Bar State
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dropdown States
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsExploreOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown and mobile menu when route changes
  useEffect(() => {
    setIsExploreOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle Global Quick Search Submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
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
    setMobileMenuOpen(false);
    navigate('/login');
  };

  // Sub-items for "Jelajah / Explore" Dropdown
  const exploreItems = [
    {
      path: '/trails',
      label: t('nav.trails') || 'Katalog Jalur',
      icon: Compass,
      desc: 'Daftar rute pendakian lengkap'
    },
    {
      path: '/events',
      label: t('nav.events') || 'Event Tektok',
      icon: Calendar,
      desc: 'Agenda muncak bareng komunitas'
    },
    {
      path: '/tracker',
      label: t('nav.tracker') || 'GPS Tracker',
      icon: Navigation,
      desc: 'Pelacak rute & navigasi live'
    },
    {
      path: '/history',
      label: t('nav.history') || 'Riwayat',
      icon: History,
      desc: 'Log & statistik track pendakian'
    },
  ];

  if (isAdmin) {
    exploreItems.push({
      path: '/manage',
      label: t('nav.manage') || 'Kelola Jalur',
      icon: Settings,
      desc: 'Panel manajemen admin & rute'
    });
  }

  const isExploreActive = exploreItems.some((item) => location.pathname === item.path);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#2D1C1D]/90 backdrop-blur-md border-b border-[#DBC4B6] dark:border-[#57595B]/40 text-[#452829] dark:text-[#F3E8DF] transition-colors duration-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3 md:gap-6">
            
            {/* 1. Brand Logo (Kiri) */}
            <div className="shrink-0">
              <Logo
                className="h-9 w-auto"
                showText={true}
                textClassName="text-xl font-bold tracking-tight"
              />
            </div>

            {/* 2. Global Quick Search Bar (Tengah) */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden sm:flex flex-1 max-w-xs md:max-w-md lg:max-w-lg items-center relative"
            >
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#E8D1C5]/70 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari jalur, gunung, event..."
                  className="w-full pl-9 pr-8 py-2 text-xs md:text-sm rounded-full bg-slate-100 dark:bg-[#3F2728] border border-slate-200 dark:border-slate-700 text-[#1E293B] dark:text-[#F3E8DF] placeholder-slate-400 dark:placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#2C6E49] focus:bg-white dark:focus:bg-[#4A2F30] transition-all duration-200 shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-stone-200 p-0.5 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>

            {/* 3. Ringkas Navigation & Controls (Kanan) */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-3 shrink-0">
              
              {/* Home Quick Link */}
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#2C6E49] text-white dark:bg-[#E8D1C5] dark:text-[#452829] shadow-sm'
                      : 'text-[#452829] dark:text-[#F3E8DF] hover:bg-slate-100 dark:hover:bg-[#3F2728]'
                  }`
                }
              >
                {t('nav.home') || 'Beranda'}
              </NavLink>

              {/* Jelajah / Explore Dropdown Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsExploreOpen(!isExploreOpen)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isExploreActive || isExploreOpen
                      ? 'bg-[#2C6E49] text-white dark:bg-[#E8D1C5] dark:text-[#452829] shadow-sm'
                      : 'text-[#452829] dark:text-[#F3E8DF] hover:bg-slate-100 dark:hover:bg-[#3F2728]'
                  }`}
                >
                  <span>Jelajah</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isExploreOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu Flyout */}
                {isExploreOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#2D1C1D] border border-slate-200 dark:border-[#57595B]/40 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-stone-400 border-b border-slate-100 dark:border-slate-800">
                      Menu Eksplorasi
                    </div>
                    <div className="p-1.5 space-y-0.5">
                      {exploreItems.map((item) => {
                        const Icon = item.icon;
                        const active = location.pathname === item.path;
                        return (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsExploreOpen(false)}
                            className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                              active
                                ? 'bg-[#2C6E49]/10 dark:bg-[#E8D1C5]/15 text-[#2C6E49] dark:text-[#E8D1C5] font-bold'
                                : 'text-[#452829] dark:text-[#F3E8DF] hover:bg-slate-100 dark:hover:bg-[#3F2728]'
                            }`}
                          >
                            <div className={`p-1.5 rounded-lg shrink-0 ${
                              active
                                ? 'bg-[#2C6E49] text-white dark:bg-[#E8D1C5] dark:text-[#452829]'
                                : 'bg-slate-100 dark:bg-[#3F2728] text-slate-600 dark:text-stone-300'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold leading-tight">{item.label}</span>
                              <span className="text-[10px] text-slate-500 dark:text-stone-400 font-normal leading-tight mt-0.5">
                                {item.desc}
                              </span>
                            </div>
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Language Switcher */}
              <button
                type="button"
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold uppercase border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-[#3F2728] text-[#452829] dark:text-[#F3E8DF] hover:bg-slate-200 dark:hover:bg-[#57595B]/60 transition-all cursor-pointer"
                title={t('nav.language') || 'Ganti Bahasa'}
              >
                <Languages className="w-3.5 h-3.5 text-[#2C6E49] dark:text-[#E8D1C5]" />
                <span>{language}</span>
              </button>

              {/* Theme Toggle Component */}
              <ThemeToggle />

              {/* Role Switcher */}
              <RoleToggle />

              {/* Authentication Status Badge / Login Button */}
              {isLoggedIn ? (
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#3F2728] p-1 pl-2.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <UserIcon className="w-3.5 h-3.5 text-[#2C6E49] dark:text-[#E8D1C5]" />
                    <span className="max-w-[90px] truncate text-[#452829] dark:text-[#F3E8DF]">
                      {user.name || user.email}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] uppercase font-mono ${
                      user.role === 'admin'
                        ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </div>

                  {/* Logout Button */}
                  <button
                    type="button"
                    onClick={() => setLogoutModalOpen(true)}
                    className="p-1.5 rounded-full text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950 transition-all cursor-pointer"
                    title={t('auth.logoutBtn') || 'Keluar'}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className="px-4 py-1.5 rounded-full bg-[#2C6E49] text-white hover:bg-[#23583a] dark:bg-[#E8D1C5] dark:text-[#452829] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Masuk</span>
                </NavLink>
              )}

            </div>

            {/* Mobile Header Controls */}
            <div className="flex items-center gap-1.5 md:hidden">
              {!isLoggedIn && (
                <NavLink
                  to="/login"
                  className="px-3 py-1.5 rounded-full bg-[#2C6E49] text-white dark:bg-[#E8D1C5] dark:text-[#452829] text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <LogIn className="w-3 h-3" />
                  <span>Masuk</span>
                </NavLink>
              )}
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-[#452829] dark:text-[#F3E8DF] hover:bg-slate-100 dark:hover:bg-[#3F2728] focus:outline-none cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-[#57595B]/40 bg-white dark:bg-[#2D1C1D] px-4 pt-3 pb-5 space-y-4 shadow-lg">
            
            {/* Mobile Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari jalur, gunung, event..."
                className="w-full pl-9 pr-8 py-2 text-xs rounded-full bg-slate-100 dark:bg-[#3F2728] border border-slate-200 dark:border-slate-700 text-[#1E293B] dark:text-[#F3E8DF] focus:outline-none focus:ring-2 focus:ring-[#2C6E49]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 p-0.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Mobile User & Role info */}
            <div className="flex flex-col gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <RoleToggle />
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-slate-100 dark:bg-[#3F2728] border border-slate-200 dark:border-slate-700 text-[#452829] dark:text-[#F3E8DF]"
                >
                  {language}
                </button>
              </div>

              {isLoggedIn ? (
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-100 dark:bg-[#3F2728]">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <UserIcon className="w-4 h-4 text-[#2C6E49] dark:text-[#E8D1C5]" />
                    <span className="truncate">{user.name || user.email}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-mono bg-black/10 dark:bg-white/10">
                      {user.role}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLogoutModalOpen(true)}
                    className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-full bg-[#2C6E49] text-white dark:bg-[#E8D1C5] dark:text-[#452829] text-xs font-bold flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t('auth.loginTitle') || 'Masuk'}</span>
                </NavLink>
              )}
            </div>

            {/* Mobile Nav Links */}
            <div className="space-y-1">
              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-[#2C6E49] text-white dark:bg-[#E8D1C5] dark:text-[#452829]'
                      : 'text-[#452829] dark:text-[#F3E8DF] hover:bg-slate-100 dark:hover:bg-[#3F2728]'
                  }`
                }
              >
                <span>{t('nav.home') || 'Beranda'}</span>
              </NavLink>

              {exploreItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                        isActive
                          ? 'bg-[#2C6E49] text-white dark:bg-[#E8D1C5] dark:text-[#452829]'
                          : 'text-[#452829] dark:text-[#F3E8DF] hover:bg-slate-100 dark:hover:bg-[#3F2728]'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

          </div>
        )}
      </header>

      {/* Logout Modal Confirmation */}
      <ModalConfirm
        isOpen={logoutModalOpen}
        onCancel={() => setLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}
