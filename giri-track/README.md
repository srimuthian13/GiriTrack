# 🏔️ GiriTrack - Website Informasi Pendakian & Pelacak Jalur

**GiriTrack** adalah aplikasi web informasi pendakian gunung dan pelacak jalur GPS real-time modern yang dibangun menggunakan **React JS**, **Vite**, **pnpm**, **Tailwind CSS**, dan **Leaflet Map** (tanpa backend/database server) sebagai proyek **UAS React Fundamental**.

---

## 🎨 Custom Color Palette

Aplikasi GiriTrack menggunakan tema warna alami pegunungan yang elegan:

| Nama Warna | Kode Hex | Pengunaan |
| :--- | :--- | :--- |
| **`giri-primary`** | `#452829` | Mahogany / Dark Earth (Primary Header, Buttons, Dark Accents) |
| **`giri-secondary`** | `#57595B` | Slate Mountain Grey (Secondary Controls, Subtitles) |
| **`giri-accent`** | `#E8D1C5` | Sand Beige (Highlights, Text Badges, Accent Buttons) |
| **`giri-base`** | `#F3E8DF` | Soft Cream Background (Base Light Theme Background) |

---

## ✨ Fitur Utama GiriTrack

1. **🌙 Fitur Theme System (Dark / Light Mode)**:
   - `ThemeContext.jsx` mengelola state tema gelap/terang dan secara aktif menyinkronkan class `'dark'` pada elemen `document.documentElement` (`<html>`) serta menyimpan pilihan di `localStorage` (`giri_theme`).
   - Komponen `ThemeToggle.jsx` dengan ikon Lucide (Sun & Moon).

2. **🔐 Simulasi Role Access Control (User & Admin)**:
   - `AuthContext.jsx` mengelola simulasi peran pengguna (`currentRole`: `'user'` atau `'admin'`) yang tersimpan di `localStorage` (`giri_role`).
   - Komponen `RoleToggle.jsx` memungkinkan peralihan peran secara instan.
   - **Mode Pendaki (User)**: Dapat menjelajahi jalur, melihat detail spesifikasi, peta rute, join/batal event tektok, merekam GPS tracker, dan melihat riwayat pendakian. Tombol Edit dan Hapus disembunyikan.
   - **Mode Pengelola (Admin)**: Memiliki hak akses penuh untuk menambah, mengedit, dan menghapus jalur pendakian (`/manage`), serta membuat event tektok baru.

3. **🗺️ E-Directory & CRUD Jalur Pendakian**:
   - Menampilkan daftar jalur gunung di Indonesia lengkap dengan elevasi (mdpl), jarak (km), estimasi waktu, deskripsi, dan rute peta Leaflet.
   - Fitur **Create**, **Read**, **Update**, dan **Delete** data jalur yang tersimpan secara persisten di `localStorage`.

4. **📍 Interactive Leaflet Route Map (`MapViewer`)**:
   - Peta interaktif `react-leaflet` yang menggambarkan rute garis (`Polyline`) serta titik awal (Basecamp) dan titik akhir (Puncak) menggunakan *custom SVG pins*.

5. **📡 Real-time GPS Tracker & Rumus Haversine (`LiveTracker`)**:
   - Melacak pergerakan pendaki secara real-time menggunakan API `navigator.geolocation.watchPosition`.
   - Mengkalkulasi jarak tempuh secara presisi menggunakan **Rumus Matematika Haversine**.
   - Menyimpan sesi pendakian ke riwayat aktivitas lokal.

6. **⚡ Event Tektok Muncak 1-Click Join**:
   - Komunitas pendaki tektok muncak sehari tanpa menginap.
   - Fitur 1-click **Ikut / Batal Event** dengan *counter* partisipan real-time dan indikator kuota penuh.

7. **🔍 Filter, Search & Sorting Dinamis**:
   - Pencarian real-time dengan method JavaScript `.filter()`.
   - Filter berdasarkan tingkat kesulitan (Mudah, Sedang, Sulit, Ekstrem).
   - Pengurutan dengan `.sort()` (Nama A-Z/Z-A, Jarak Terpendek/Terjauh, Elevasi Terendah/Tertinggi).

8. **📑 Komponen Pagination Dinamis**:
   - Navigasi halaman menggunakan kalkulasi `Math.ceil()` dengan status tombol Prev/Next otomatis *disabled* di batas halaman.

9. **🌐 Multilingual Support (ID / EN)**:
   - Dukungan Bahasa Indonesia & Bahasa Inggris melalui `LanguageContext` dan helper function `t()`.

---

## 📐 Arsitektur Folder Proyek

```text
giri-track/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── LiveTracker.jsx       # Perekam GPS real-time & rumus Haversine
│   │   ├── MapViewer.jsx         # Map interaktif react-leaflet & polyline
│   │   ├── ModalConfirm.jsx      # Modal konfirmasi aksi hapus
│   │   ├── Navbar.jsx            # Top navbar responsif & controls
│   │   ├── Pagination.jsx        # Komponen pagination Math.ceil()
│   │   ├── RoleToggle.jsx        # Switcher Role (User vs Admin)
│   │   ├── ThemeToggle.jsx       # Switcher Tema (Dark vs Light)
│   │   └── TrailCard.jsx         # Kartu informasi jalur pendakian
│   ├── context/
│   │   ├── AuthContext.jsx       # State & pembatasan hak akses role
│   │   ├── LanguageContext.jsx   # State & kamus multibahasa ID/EN
│   │   ├── ThemeContext.jsx      # State mode gelap/terang HTML class
│   │   └── TrailContext.jsx      # CRUD Jalur, Event & Rest Parameter calculation
│   ├── data/
│   │   ├── initialData.js        # Mock dataset jalur, event, & history
│   │   └── translations.js       # Kamus terjemahan ID & EN
│   ├── pages/
│   │   ├── Events.jsx            # Agenda Tektok Muncak
│   │   ├── Home.jsx              # Landing page & statistik
│   │   ├── ManageTrail.jsx       # Form Tambah/Edit & Tabel Jalur (Admin)
│   │   ├── NotFound.jsx          # Halaman Error 404
│   │   ├── TrackerPage.jsx       # Halaman GPS Tracker & History Log
│   │   ├── TrailDetail.jsx       # Detail spesifikasi teknis & peta rute
│   │   └── Trails.jsx            # E-Directory, Search, Filter, Sort, Pagination
│   ├── App.css
│   ├── App.jsx                   # BrowserRouter, Layout, & Context Providers
│   ├── index.css                 # Tailwind CSS directives & GiriTrack variables
│   └── main.jsx                  # Entry point React DOM
├── eslint.config.js
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tailwind.config.js            # Tailwind custom palette & darkMode class
├── vercel.json                   # Fallback SPA routing Vercel
└── vite.config.js                # Vite configuration with @tailwindcss/vite
```

---

## 🚀 Panduan Instalasi & Menjalankan Proyek

### Prasyarat
- Node.js versi 18 atau lebih baru.
- `pnpm` (disarankan) atau `npm`.

### Langkah-langkah
1. **Clone / Buka Proyek**:
   ```bash
   cd giri-track
   ```

2. **Instal Dependensi**:
   ```bash
   pnpm install
   ```

3. **Jalankan Development Server**:
   ```bash
   pnpm dev
   ```
   Buka peramban di `http://localhost:5173`.

4. **Build untuk Produksi**:
   ```bash
   pnpm build
   ```

---

## 📋 Checklist Pemenuhan Rubrik UAS React Fundamental

- [x] **React JS + Vite + pnpm**: Inisialisasi proyek cepat dengan bundling modern.
- [x] **Tailwind CSS Custom Palette**: Mendaftarkan `giri-primary`, `giri-secondary`, `giri-accent`, `giri-base` di `tailwind.config.js`.
- [x] **Dark Mode (`darkMode: 'class'`)**: Memodifikasi class `'dark'` pada elemen HTML dan tersimpan di `localStorage`.
- [x] **Role Simulation (Admin/User)**: Pembatasan hak akses tombol Edit & Hapus serta tab Manage via `AuthContext.jsx`.
- [x] **Multi-Context State Management**: `ThemeContext.jsx`, `AuthContext.jsx`, `LanguageContext.jsx`, `TrailContext.jsx`.
- [x] **ES6 Rest Parameter Function**: Fungsi `calculateTotalSummary(...hikeRecords)` di `TrailContext.jsx`.
- [x] **Routing SPA React Router v7**: Konfigurasi `BrowserRouter`, `NavLink`, `useParams`, `useSearchParams`, dan fallback `vercel.json`.
- [x] **Interaktivitas Maps (Leaflet)**: Peta rute `Polyline` dan *custom markers* pada `MapViewer.jsx`.
- [x] **Geolocation Tracker & Haversine Formula**: Perekaman posisi GPS pada `LiveTracker.jsx`.
- [x] **Array Operations**: Penggunaan `.filter()`, `.sort()`, `.slice()`, `.map()`, dan `.reduce()`.
