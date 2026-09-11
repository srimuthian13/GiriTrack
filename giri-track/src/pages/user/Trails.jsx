import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, Compass, Plus, RotateCcw, AlertCircle, Heart, Settings, ArrowLeft } from 'lucide-react';
import { useTrail } from '../../context/TrailContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import TrailCard from '../../components/TrailCard';
import Pagination from '../../components/Pagination';
import ModalConfirm from '../../components/ModalConfirm';
import { TrailGridSkeleton } from '../../components/skeleton/TrailCardSkeleton';

export default function Trails() {
  const { trails, deleteTrail, resetTrails, favorites, isFavorite } = useTrail();
  const { isAdmin, isLoggedIn } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State Loading Simulation
  const [loading, setLoading] = useState(true);

  // State Filters & Sorting (initialize with URL search param if present)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [prevSearchParam, setPrevSearchParam] = useState(searchParams.get('search'));
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState('DEFAULT');

  // State Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Synchronize when URL search param changes without effect cascade
  const urlQuery = searchParams.get('search');
  if (urlQuery !== prevSearchParam) {
    setPrevSearchParam(urlQuery);
    setSearchTerm(urlQuery || '');
    setCurrentPage(1);
  }

  // State Modal Delete
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTrailIdToDelete, setSelectedTrailIdToDelete] = useState(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Simulated Loading Effect on Mount or Filter Change
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [searchTerm, difficultyFilter, showOnlyFavorites, sortBy]);

  // 1. Filtering using JavaScript Array .filter()
  const filteredTrails = useMemo(() => {
    return trails.filter((trail) => {
      // Visibility Filter: Public only sees verified trails, Admin sees all
      const isVisible = trail.status === 'verified' || !trail.status || isAdmin;
      if (!isVisible) return false;

      // Search match
      const matchesSearch =
        trail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trail.location.toLowerCase().includes(searchTerm.toLowerCase());

      // Difficulty match
      const matchesDifficulty =
        difficultyFilter === 'ALL' ||
        String(trail.difficulty).toUpperCase() === difficultyFilter.toUpperCase();

      // Favorite match
      const matchesFavorite = !showOnlyFavorites || isFavorite(trail.id);

      return matchesSearch && matchesDifficulty && matchesFavorite;
    });
  }, [trails, searchTerm, difficultyFilter, showOnlyFavorites, isFavorite, isAdmin]);

  // 2. Sorting using JavaScript Array .sort()
  const sortedTrails = useMemo(() => {
    const trailsCopy = [...filteredTrails];
    switch (sortBy) {
      case 'LIKES_DESC':
        return trailsCopy.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
      case 'RATING_DESC':
        return trailsCopy.sort((a, b) => (Number(b.ratingAvg) || 0) - (Number(a.ratingAvg) || 0));
      case 'NAME_ASC':
        return trailsCopy.sort((a, b) => a.name.localeCompare(b.name));
      case 'NAME_DESC':
        return trailsCopy.sort((a, b) => b.name.localeCompare(a.name));
      case 'DISTANCE_ASC':
        return trailsCopy.sort((a, b) => a.distance_km - b.distance_km);
      case 'DISTANCE_DESC':
        return trailsCopy.sort((a, b) => b.distance_km - a.distance_km);
      case 'ELEVATION_ASC':
        return trailsCopy.sort((a, b) => a.elevation_m - b.elevation_m);
      case 'ELEVATION_DESC':
        return trailsCopy.sort((a, b) => b.elevation_m - a.elevation_m);
      default:
        return trailsCopy;
    }
  }, [filteredTrails, sortBy]);

  // 3. Pagination slicing
  const totalPages = Math.max(1, Math.ceil(sortedTrails.length / itemsPerPage));
  const paginatedTrails = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedTrails.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedTrails, currentPage, itemsPerPage]);

  // Handlers
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDetail = (trail) => {
    navigate(`/trails/${trail.id}`);
  };

  const handleEdit = (trail) => {
    navigate(`/manage?editId=${trail.id}`);
  };

  const handleDeletePrompt = (id) => {
    setSelectedTrailIdToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTrailIdToDelete) {
      deleteTrail(selectedTrailIdToDelete);
      setDeleteModalOpen(false);
      setSelectedTrailIdToDelete(null);
    }
  };

  const handleResetFilters = () => {
    setLoading(true);
    setSearchTerm('');
    setDifficultyFilter('ALL');
    setShowOnlyFavorites(false);
    setSortBy('DEFAULT');
    setCurrentPage(1);
  };

  const validFavoritesCount = favorites.filter(id => trails.some(t => String(t.id) === id)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4 pb-10 text-[#2B3542] dark:text-[#FAF3F3] transition-colors duration-300 ease-in-out">
      
      {/* Back Button */}
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#6B7C8C] dark:text-[#A7BBC7] hover:text-[#DA7F8F] dark:hover:text-[#DA7F8F] transition-all cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('btn.back') || 'Kembali'}</span>
        </button>
      </div>

      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E1E5EA] dark:border-[#2C3440] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-[#DA7F8F]" />
            <span>{t('nav.trails')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7C8C] dark:text-[#A7BBC7] mt-0.5">
            Temukan dan jelajahi berbagai rute gunung di Indonesia.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Favorite Only Filter Tab Toggle */}
          <button
            onClick={() => {
              setLoading(true);
              setShowOnlyFavorites(!showOnlyFavorites);
              setCurrentPage(1);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 flex items-center gap-2 cursor-pointer shadow-sm border ${
              showOnlyFavorites
                ? 'bg-[#DA7F8F] text-white border-[#DA7F8F]'
                : 'bg-white dark:bg-[#1C2129] border-[#E1E5EA] dark:border-[#2C3440] text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#FAF3F3] dark:hover:bg-[#252C36]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-white' : 'text-[#DA7F8F]'}`} />
            <span>{showOnlyFavorites ? 'Favorit Saya' : 'Lihat Favorit'}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/10 dark:bg-white/10 font-mono">
              {validFavoritesCount}
            </span>
          </button>

          <button
            onClick={() => {
              if (!isLoggedIn) {
                localStorage.setItem('giritrack_intended_path', '/manage');
                navigate('/login');
              } else {
                navigate('/manage');
              }
            }}
            className="px-4 py-2 rounded-xl bg-[#DA7F8F] text-white hover:bg-[#c96c7d] font-bold shadow-md transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer text-xs"
          >
            {isAdmin ? <Settings className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{isAdmin ? 'Kelola Jalur' : 'Ajukan Jalur Baru'}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div id="cari-gunung-dan-jalur" className="bg-white/90 dark:bg-[#1C2129] rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-sm border border-[#E1E5EA] dark:border-[#2C3440] space-y-3 transition-colors duration-300 ease-in-out">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A7BBC7]" />
            <input
              id="search-gunung-jalur-input"
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setLoading(true);
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t('filterSort.searchPlaceholder')}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3]/80 dark:bg-[#252C36] text-xs text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40 transition-all duration-200"
            />
          </div>

          {/* Difficulty Filter Dropdown */}
          <div className="md:col-span-3 relative">
            <Filter className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A7BBC7]" />
            <select
              value={difficultyFilter}
              onChange={(e) => {
                setLoading(true);
                setDifficultyFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3]/80 dark:bg-[#252C36] text-sm text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40 transition-all duration-200 cursor-pointer appearance-none"
            >
              <option value="ALL">{t('filterSort.allDifficulties')}</option>
              <option value="MUDAH">{t('filterSort.easy')}</option>
              <option value="SEDANG">{t('filterSort.moderate')}</option>
              <option value="SULIT">{t('filterSort.hard')}</option>
              <option value="EKSTREM">{t('filterSort.extreme')}</option>
            </select>
          </div>

          {/* Sorting Dropdown */}
          <div className="md:col-span-4 relative">
            <ArrowUpDown className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A7BBC7]" />
            <select
              value={sortBy}
              onChange={(e) => {
                setLoading(true);
                setSortBy(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E1E5EA] dark:border-[#2C3440] bg-[#FAF3F3]/80 dark:bg-[#252C36] text-sm text-[#2B3542] dark:text-[#FAF3F3] focus:outline-none focus:ring-2 focus:ring-[#DA7F8F]/40 transition-all duration-200 cursor-pointer appearance-none"
            >
              <option value="DEFAULT">{t('filterSort.defaultSort')}</option>
              <option value="LIKES_DESC">Disukai Terbanyak</option>
              <option value="RATING_DESC">Rating Tertinggi ⭐</option>
              <option value="NAME_ASC">{t('filterSort.nameAsc')}</option>
              <option value="DISTANCE_ASC">{t('filterSort.distanceAsc')}</option>
              <option value="DISTANCE_DESC">{t('filterSort.distanceDesc')}</option>
              <option value="ELEVATION_ASC">{t('filterSort.elevationAsc')}</option>
              <option value="ELEVATION_DESC">{t('filterSort.elevationDesc')}</option>
            </select>
          </div>

        </div>

        {/* Active Filter Chips / Reset */}
        {(searchTerm || difficultyFilter !== 'ALL' || showOnlyFavorites || sortBy !== 'DEFAULT') && (
          <div className="flex items-center justify-between pt-2 text-xs border-t border-[#E1E5EA] dark:border-[#2C3440]">
            <span className="text-[#6B7C8C] dark:text-[#A7BBC7] font-medium">
              Ditemukan <strong className="text-[#2B3542] dark:text-[#FAF3F3]">{sortedTrails.length}</strong> jalur pendakian
              {showOnlyFavorites ? ' (Mode Favorit Saya)' : ''}
            </span>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-[#DA7F8F] hover:underline font-bold cursor-pointer transition-transform duration-150 active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('btn.resetFilter')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Conditional Rendering: Skeleton vs Real Trail Cards */}
      {loading ? (
        <TrailGridSkeleton count={6} />
      ) : paginatedTrails.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 opacity-100">
          {paginatedTrails.map((trail, index) => (
            <TrailCard
              key={trail.id}
              trail={trail}
              index={(currentPage - 1) * itemsPerPage + index}
              onDetail={handleDetail}
              onEdit={handleEdit}
              onDelete={handleDeletePrompt}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white/90 dark:bg-[#1C2129] rounded-3xl p-12 text-center border border-[#E1E5EA] dark:border-[#2C3440] shadow-sm space-y-4 max-w-md mx-auto transition-all duration-300">
          <div className="w-16 h-16 rounded-full bg-[#FAF3F3] dark:bg-[#252C36] text-[#DA7F8F] flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#2B3542] dark:text-[#FAF3F3]">
            {showOnlyFavorites ? 'Belum Ada Jalur Favorit' : t('common.noData')}
          </h3>
          <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7]">
            {showOnlyFavorites
              ? 'Anda belum menyukai jalur pendakian apapun. Klik ikon Hati pada kartu jalur untuk menambahkannya ke favorit.'
              : 'Tidak ada jalur pendakian yang cocok dengan kata kunci pencarian atau filter Anda.'}
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-[#DA7F8F] text-white hover:bg-[#c96c7d] cursor-pointer transition-transform duration-150 active:scale-95"
            >
              {t('btn.resetFilter')}
            </button>
            <button
              onClick={resetTrails}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E1E5EA] dark:border-[#2C3440] text-[#2B3542] dark:text-[#FAF3F3] hover:bg-[#FAF3F3] dark:hover:bg-[#252C36] cursor-pointer transition-transform duration-150 active:scale-95"
            >
              Reset Data Awal
            </button>
          </div>
        </div>
      )}

      {/* Integrated Pagination Component */}
      {!loading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Delete Modal Confirmation */}
      <ModalConfirm
        isOpen={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

    </div>
  );
}
