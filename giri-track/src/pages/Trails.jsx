import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, Compass, Plus, RotateCcw, AlertCircle, Heart } from 'lucide-react';
import { useTrail } from '../context/TrailContext';
import { useLanguage } from '../context/LanguageContext';
import TrailCard from '../components/TrailCard';
import Pagination from '../components/Pagination';
import ModalConfirm from '../components/ModalConfirm';
import { TrailGridSkeleton } from '../components/skeleton/TrailCardSkeleton';

export default function Trails() {
  const { trails, deleteTrail, resetTrails, favorites, isFavorite } = useTrail();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State Loading Simulation
  const [loading, setLoading] = useState(true);

  // State Filters & Sorting (initialize with URL search param if present)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  // Synchronize when URL search param changes
  useEffect(() => {
    const urlQuery = searchParams.get('search');
    if (urlQuery !== null) {
      setSearchTerm(urlQuery);
      setCurrentPage(1);
    }
  }, [searchParams]);

  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState('DEFAULT');

  // State Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // State Modal Delete
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTrailIdToDelete, setSelectedTrailIdToDelete] = useState(null);

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
  }, [trails, searchTerm, difficultyFilter, showOnlyFavorites, isFavorite]);

  // 2. Sorting using JavaScript Array .sort()
  const sortedTrails = useMemo(() => {
    const trailsCopy = [...filteredTrails];
    switch (sortBy) {
      case 'LIKES_DESC':
        return trailsCopy.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 pb-12 text-[#452829] dark:text-[#F3E8DF] transition-colors duration-300 ease-in-out">
      
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DBC4B6] dark:border-[#57595B]/40 pb-6">
        <div>
          <h1 className="text-3xl font-black text-[#452829] dark:text-[#F3E8DF] flex items-center gap-3">
            <Compass className="w-8 h-8 text-[#452829] dark:text-[#E8D1C5]" />
            <span>{t('nav.trails')}</span>
          </h1>
          <p className="text-sm text-[#57595B] dark:text-[#E8D1C5] mt-1">
            Temukan dan jelajahi berbagai rute gunung di Indonesia.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Favorite Only Filter Tab Toggle */}
          <button
            onClick={() => {
              setLoading(true);
              setShowOnlyFavorites(!showOnlyFavorites);
              setCurrentPage(1);
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 active:scale-95 flex items-center gap-2 cursor-pointer shadow-sm border ${
              showOnlyFavorites
                ? 'bg-rose-500 text-white border-rose-600 dark:bg-rose-600'
                : 'bg-white dark:bg-[#2D1C1D] border-[#DBC4B6] dark:border-[#57595B]/40 text-[#452829] dark:text-[#F3E8DF] hover:bg-[#EFE4DC] dark:hover:bg-[#3F2728]'
            }`}
          >
            <Heart className={`w-4 h-4 ${showOnlyFavorites ? 'fill-white' : 'text-rose-500'}`} />
            <span>{showOnlyFavorites ? 'Favorit Saya' : 'Lihat Favorit'}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/10 dark:bg-white/10 font-mono">
              {favorites.length}
            </span>
          </button>

          <button
            onClick={() => navigate('/manage')}
            className="px-5 py-2.5 rounded-2xl bg-[#452829] text-[#F3E8DF] hover:bg-[#341e1f] dark:bg-[#E8D1C5] dark:text-[#452829] font-bold shadow-md transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t('btn.add')}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#2D1C1D] rounded-3xl p-5 shadow-sm border border-[#DBC4B6] dark:border-[#57595B]/40 space-y-4 transition-colors duration-300 ease-in-out">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#57595B] dark:text-[#E8D1C5]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setLoading(true);
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t('filterSort.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#DBC4B6] dark:border-[#57595B]/40 bg-[#EFE4DC]/40 dark:bg-[#3F2728]/40 text-sm text-[#452829] dark:text-[#F3E8DF] focus:outline-none focus:ring-2 focus:ring-[#452829] transition-all duration-200"
            />
          </div>

          {/* Difficulty Filter Dropdown */}
          <div className="md:col-span-3 relative">
            <Filter className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#57595B] dark:text-[#E8D1C5]" />
            <select
              value={difficultyFilter}
              onChange={(e) => {
                setLoading(true);
                setDifficultyFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#DBC4B6] dark:border-[#57595B]/40 bg-[#EFE4DC]/40 dark:bg-[#3F2728]/40 text-sm text-[#452829] dark:text-[#F3E8DF] focus:outline-none focus:ring-2 focus:ring-[#452829] transition-all duration-200 cursor-pointer appearance-none"
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
            <ArrowUpDown className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#57595B] dark:text-[#E8D1C5]" />
            <select
              value={sortBy}
              onChange={(e) => {
                setLoading(true);
                setSortBy(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#DBC4B6] dark:border-[#57595B]/40 bg-[#EFE4DC]/40 dark:bg-[#3F2728]/40 text-sm text-[#452829] dark:text-[#F3E8DF] focus:outline-none focus:ring-2 focus:ring-[#452829] transition-all duration-200 cursor-pointer appearance-none"
            >
              <option value="DEFAULT">{t('filterSort.defaultSort')}</option>
              <option value="LIKES_DESC">Disukai Terbanyak</option>
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
          <div className="flex items-center justify-between pt-2 text-xs border-t border-[#DBC4B6]/50 dark:border-[#57595B]/30">
            <span className="text-[#57595B] dark:text-[#E8D1C5] font-medium">
              Ditemukan <strong className="text-[#452829] dark:text-[#F3E8DF]">{sortedTrails.length}</strong> jalur pendakian
              {showOnlyFavorites ? ' (Mode Favorit Saya)' : ''}
            </span>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-[#452829] dark:text-[#E8D1C5] hover:underline font-bold cursor-pointer transition-transform duration-150 active:scale-95"
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
          {paginatedTrails.map((trail) => (
            <TrailCard
              key={trail.id}
              trail={trail}
              onDetail={handleDetail}
              onEdit={handleEdit}
              onDelete={handleDeletePrompt}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#2D1C1D] rounded-3xl p-12 text-center border border-[#DBC4B6] dark:border-[#57595B]/40 shadow-sm space-y-4 max-w-md mx-auto transition-all duration-300">
          <div className="w-16 h-16 rounded-full bg-[#EFE4DC] dark:bg-[#3F2728] text-[#452829] dark:text-[#E8D1C5] flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#452829] dark:text-[#F3E8DF]">
            {showOnlyFavorites ? 'Belum Ada Jalur Favorit' : t('common.noData')}
          </h3>
          <p className="text-xs text-[#57595B] dark:text-[#E8D1C5]">
            {showOnlyFavorites
              ? 'Anda belum menyukai jalur pendakian apapun. Klik ikon Hati pada kartu jalur untuk menambahkannya ke favorit.'
              : 'Tidak ada jalur pendakian yang cocok dengan kata kunci pencarian atau filter Anda.'}
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-[#452829] text-[#F3E8DF] hover:bg-[#341e1f] dark:bg-[#E8D1C5] dark:text-[#452829] cursor-pointer transition-transform duration-150 active:scale-95"
            >
              {t('btn.resetFilter')}
            </button>
            <button
              onClick={resetTrails}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#DBC4B6] dark:border-[#57595B]/40 text-[#452829] dark:text-[#E8D1C5] hover:bg-[#EFE4DC] dark:hover:bg-[#3F2728] cursor-pointer transition-transform duration-150 active:scale-95"
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
