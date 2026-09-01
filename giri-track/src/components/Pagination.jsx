import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems,
  itemsPerPage,
}) {
  // If totalItems & itemsPerPage are provided, calculate totalPages using Math.ceil()
  const computedTotalPages =
    totalItems && itemsPerPage
      ? Math.max(1, Math.ceil(totalItems / itemsPerPage))
      : totalPages;

  if (computedTotalPages <= 1) return null;

  // Generate array of page numbers
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= computedTotalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < computedTotalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 my-8 select-none">
      {/* Previous Page Button */}
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={`flex items-center justify-center p-2 rounded-xl border transition-all ${
          currentPage === 1
            ? 'opacity-40 cursor-not-allowed border-stone-200 text-stone-400 dark:border-stone-800 dark:text-stone-600'
            : 'border-giri-accent bg-white text-giri-primary hover:bg-giri-accent hover:text-giri-primary dark:bg-stone-900 dark:text-giri-accent dark:border-stone-700 dark:hover:bg-stone-800 cursor-pointer shadow-sm'
        }`}
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1.5">
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              page === currentPage
                ? 'bg-giri-primary text-giri-accent dark:bg-giri-accent dark:text-giri-primary shadow-md scale-105'
                : 'bg-white text-stone-700 hover:bg-giri-base/80 border border-stone-200 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-800 dark:hover:bg-stone-800'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Page Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === computedTotalPages}
        className={`flex items-center justify-center p-2 rounded-xl border transition-all ${
          currentPage === computedTotalPages
            ? 'opacity-40 cursor-not-allowed border-stone-200 text-stone-400 dark:border-stone-800 dark:text-stone-600'
            : 'border-giri-accent bg-white text-giri-primary hover:bg-giri-accent hover:text-giri-primary dark:bg-stone-900 dark:text-giri-accent dark:border-stone-700 dark:hover:bg-stone-800 cursor-pointer shadow-sm'
        }`}
        aria-label="Next Page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
