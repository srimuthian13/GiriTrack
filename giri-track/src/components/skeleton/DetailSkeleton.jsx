export default function DetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 pb-12 animate-pulse">
      
      {/* Top Navigation Back Button Placeholder */}
      <div className="flex items-center justify-between">
        <div className="h-5 w-24 bg-[#EFE4DC] dark:bg-[#3F2728] rounded-lg" />
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-[#EFE4DC] dark:bg-[#3F2728] rounded-xl" />
          <div className="h-8 w-16 bg-[#EFE4DC] dark:bg-[#3F2728] rounded-xl" />
        </div>
      </div>

      {/* Hero Banner Placeholder */}
      <div className="relative rounded-3xl overflow-hidden bg-[#EFE4DC] dark:bg-[#3F2728] h-64 sm:h-96 w-full">
        <div className="absolute bottom-6 left-6 right-6 space-y-3">
          <div className="h-5 w-28 bg-[#DBC4B6] dark:bg-[#57595B]/50 rounded-full" />
          <div className="h-10 w-2/3 bg-[#DBC4B6] dark:bg-[#57595B]/50 rounded-xl" />
          <div className="h-4 w-40 bg-[#DBC4B6] dark:bg-[#57595B]/50 rounded" />
        </div>
      </div>

      {/* 4 Technical Stat Box Placeholders */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white dark:bg-[#2D1C1D] border border-[#DBC4B6] dark:border-[#57595B]/40 text-center space-y-2 shadow-sm"
          >
            <div className="h-3 w-16 bg-[#EFE4DC] dark:bg-[#3F2728] rounded mx-auto" />
            <div className="h-6 w-20 bg-[#EFE4DC] dark:bg-[#3F2728] rounded-lg mx-auto" />
          </div>
        ))}
      </div>

      {/* Track GPS Banner Placeholder */}
      <div className="p-6 rounded-3xl bg-[#EFE4DC] dark:bg-[#3F2728] border border-[#DBC4B6]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-2 w-full sm:w-auto">
          <div className="h-5 w-48 bg-[#DBC4B6] dark:bg-[#57595B]/50 rounded-lg" />
          <div className="h-3 w-64 bg-[#DBC4B6] dark:bg-[#57595B]/50 rounded" />
        </div>
        <div className="h-10 w-full sm:w-48 bg-[#DBC4B6] dark:bg-[#57595B]/50 rounded-2xl shrink-0" />
      </div>

      {/* Description Section Placeholder */}
      <div className="bg-white dark:bg-[#2D1C1D] rounded-3xl p-6 sm:p-8 border border-[#DBC4B6] dark:border-[#57595B]/40 space-y-3">
        <div className="h-6 w-48 bg-[#EFE4DC] dark:bg-[#3F2728] rounded-lg" />
        <div className="h-4 w-full bg-[#EFE4DC] dark:bg-[#3F2728] rounded" />
        <div className="h-4 w-11/12 bg-[#EFE4DC] dark:bg-[#3F2728] rounded" />
        <div className="h-4 w-4/5 bg-[#EFE4DC] dark:bg-[#3F2728] rounded" />
      </div>

      {/* Map Box Placeholder */}
      <div className="bg-white dark:bg-[#2D1C1D] rounded-3xl p-6 sm:p-8 border border-[#DBC4B6] dark:border-[#57595B]/40 space-y-4">
        <div className="h-6 w-60 bg-[#EFE4DC] dark:bg-[#3F2728] rounded-lg" />
        <div className="h-[350px] sm:h-[450px] w-full rounded-2xl bg-[#EFE4DC] dark:bg-[#3F2728]" />
      </div>

    </div>
  );
}
