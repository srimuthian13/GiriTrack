export function TrailCardSkeleton() {
  return (
    <div className="bg-[#2B2D31]/80 dark:bg-[#1E2836]/90 rounded-3xl overflow-hidden shadow-md border border-[#E1E5EA]/40 dark:border-[#2C3440] flex flex-col animate-pulse">
      
      {/* Image Banner Placeholder */}
      <div className="h-56 w-full bg-stone-700/50 dark:bg-stone-800/60 relative">
        <div className="absolute top-3.5 left-3.5 w-14 h-7 rounded-full bg-stone-600/60 dark:bg-stone-700/60" />
        <div className="absolute top-3.5 right-3.5 w-20 h-6 rounded-full bg-stone-600/60 dark:bg-stone-700/60" />
        <div className="absolute bottom-3.5 left-4 w-36 h-4 rounded bg-stone-600/60 dark:bg-stone-700/60" />
      </div>

      {/* Card Body Placeholder */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4 bg-stone-800/40">
        <div className="space-y-2.5">
          {/* Guide Label Placeholder */}
          <div className="h-3.5 w-24 bg-stone-600/50 rounded-full" />
          {/* Title */}
          <div className="h-6 w-3/4 bg-stone-600/60 rounded-lg" />
          {/* Description Lines */}
          <div className="h-3 w-full bg-stone-600/40 rounded" />
          <div className="h-3 w-4/5 bg-stone-600/40 rounded" />
        </div>

        {/* 3-Column Key Metrics Box */}
        <div className="grid grid-cols-3 gap-2 py-3 px-2 rounded-2xl bg-black/20 border border-white/10">
          <div className="flex flex-col items-center space-y-1">
            <div className="h-2.5 w-8 bg-stone-600/50 rounded" />
            <div className="h-4 w-12 bg-stone-600/60 rounded-md" />
          </div>
          <div className="flex flex-col items-center space-y-1 border-x border-white/10">
            <div className="h-2.5 w-8 bg-stone-600/50 rounded" />
            <div className="h-4 w-12 bg-stone-600/60 rounded-md" />
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="h-2.5 w-8 bg-stone-600/50 rounded" />
            <div className="h-4 w-12 bg-stone-600/60 rounded-md" />
          </div>
        </div>

        {/* Action Button Placeholder */}
        <div className="flex items-center gap-2 pt-1">
          <div className="h-10 flex-1 bg-stone-600/50 rounded-full border border-white/20" />
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
