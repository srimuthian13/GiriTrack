import { Link } from 'react-router-dom';

export default function Logo({
  className = "h-9 w-auto",
  showText = true,
  textClassName = "text-xl",
}) {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2.5 select-none transition-opacity duration-200 hover:opacity-90 group"
      aria-label="GiriTrack Beranda"
    >
      {/* Gambar Aset Logo Asli (h-9 proporsional, seamless tanpa box kaku) */}
      <img
        src="/logo.png"
        alt="GiriTrack Logo"
        className={`${className} object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm`}
        loading="eager"
      />

      {/* Tipografi Brand AllTrails-Style */}
      {showText && (
        <span className={`inline-flex items-center tracking-tight leading-none ${textClassName}`}>
          <span className="font-extrabold text-[#452829] dark:text-[#F3E8DF]">
            Giri
          </span>
          <span className="font-medium text-[#57595B] dark:text-[#E8D1C5]">
            Track
          </span>
        </span>
      )}
    </Link>
  );
}
