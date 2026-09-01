export function TrailCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#2D1C1D] rounded-2xl overflow-hidden shadow-sm border border-[#DBC4B6] dark:border-[#57595B]/40 flex flex-col animate-pulse">
      
      {/* Image Banner Placeholder */}
      <div className="h-48 sm:h-52 w-full bg-[#EFE4DC] dark:bg-[#3F2728] relative">
        <div className="absolute top-3 left-3 w-10 h-8 rounded-full bg-[#DBC4B6] dark:bg-[#57595B]/50" />
        <div className="absolute top-3 right-3 w-16 h-6 rounded-full bg-[#DBC4B6] dark:bg-[#57595B]/50" />
        <div className="absolute bottom-3 left-3 w-32 h-4 rounded bg-[#DBC4B6] dark:bg-[#57595B]/50" />
      </div>

      {/* Card Body Placeholder */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Title */}
          <div className="h-6 w-3/4 bg-[#EFE4DC] dark:bg-[#3F2728] rounded-lg" />
          {/* Description Lines */}
          <div className="h-3 w-full bg-[#EFE4DC] dark:bg-[#3F2728] rounded" />
          <div className="h-3 w-4/5 bg-[#EFE4DC] dark:bg-[#3F2728] rounded" />
        </div>

        {/* 3-Column Key Metrics Box */}
        <div className="grid grid-cols-3 gap-2 py-3 px-2 rounded-xl bg-[#EFE4DC]/60 dark:bg-[#3F2728]/50 border border-[#DBC4B6]/40 dark:border-[#57595B]/30">
          <div className="flex flex-col items-center space-y-1">
            <div className="h-3 w-10 bg-[#DBC4B6] dark:bg-[#57595B]/50 rounded" />
            <div className="h-4 w-12 bg-[#DBC4B6] dark:bg-[#57595B]/50 rounded-md" />
          </div>
          <div className="flex flex-col items-center space-y-1 border-x border-[#DBC4B6]/50 dark:border-[#57595B]/30">
            <div className="h-3 w-10 bg-[#DBC4B6] dark:bg-[#57595B]/50 rounded" />
            <div className="h-4 w-12 bg-[#DBC4B6] dark:bg-[#57595B]/50 rounded-md" />
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="h-3 w-10 bg-[#DBC4B6] dark:bg-[#57595B]/50 rounded" />
            <div className="h-4 w-12 bg-[#DBC4B6] dark:bg-[#57595B]/50 rounded-md" />
          </div>
        </div>

        {/* Action Button Placeholder */}
        <div className="flex items-center gap-2 pt-1">
          <div className="h-9 flex-1 bg-[#EFE4DC] dark:bg-[#3F2728] rounded-xl" />
          <div className="h-9 w-9 bg-[#EFE4DC] dark:bg-[#3F2728] rounded-xl" />
        </div>
      </div>

    </div>
  );
}

export function TrailGridSkeleton({ count = 6 }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <TrailCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export default TrailCardSkeleton;
