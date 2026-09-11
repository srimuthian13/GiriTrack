# GiriTrack

- **Live Demo:** [https://giri-track.vercel.app/](https://giri-track.vercel.app/)
- **Video Presentasi:** [Google Drive](https://drive.google.com/drive/folders/1T3O2BUQTbMgvneL_Nmb7pLLxXebY09Yn?usp=sharing)
## a. Nama dan Deskripsi Aplikasi
**GiriTrack** adalah aplikasi web manajemen pendakian gunung dan kompetisi lari *trail*. Aplikasi ini dirancang untuk membantu para pendaki dan pelari alam (*trail runners*) menemukan rute pendakian populer, melihat jadwal kompetisi *trail run*, mencatat riwayat pendakian, dan berbagi *review* (ulasan) dengan komunitas. Dilengkapi dengan fitur khusus untuk Admin dalam mengelola (CRUD) master data jalur pendakian, kompetisi, dan tingkat kesulitan rute.

## b. Daftar Fitur
- **Beranda (Dashboard Utama):** Menampilkan banner *hero*, statistik dinamis (*marquee*), rekomendasi rute populer, serta cuplikan kompetisi lari mendatang dan yang telah lalu.
- **Katalog Jalur Pendakian:** Menampilkan daftar seluruh jalur pendakian dengan fitur **Pencarian (Search)**, **Filter** (berdasarkan tingkat kesulitan dan favorit), **Pengurutan (Sorting)** (berdasarkan A-Z, Jarak, Elevasi, dan Rating), serta **Pagination**.
- **Katalog Kompetisi (Race Catalog):** Menampilkan daftar lomba lari gunung (Trail Run) yang akan datang, sedang berlangsung, dan telah selesai dengan fitur navigasi dan pencarian.
- **Detail Jalur & Kompetisi:** Menampilkan informasi mendetail dari suatu entitas menggunakan Dynamic Route (URL params).
- **Manajemen Riwayat:** Pengguna dapat mencatat dan melihat rekam jejak riwayat pendakian yang pernah diselesaikan (menggunakan State Management).
- **CRUD & Admin Dashboard (Pengelolaan Data):** Fitur lengkap (Tambah, Baca, Ubah, Hapus) beserta form validasi sederhana dan konfirmasi penghapusan (menggunakan Modal) untuk mengelola data jalur pendakian dan jadwal lomba.
- **Autentikasi Sederhana:** Terdapat sistem login simulasi dengan peran (User biasa atau Admin) tanpa perlu melakukan *refresh* browser.
- **Responsivitas Tinggi:** Antarmuka disesuaikan secara otomatis dan mulus (*seamless*) untuk perangkat *mobile* (HP), tablet, maupun *desktop* (Laptop).

## c. Teknologi yang Digunakan
Proyek ini dibangun secara modern tanpa *template*, menggunakan tumpukan teknologi (Stack) berikut:
- **Core Library:** React JS (v19) dengan Vite
- **Styling:** Tailwind CSS (v4) untuk antarmuka yang cepat dan modern
- **Routing:** React Router DOM (v7) untuk *Single Page Application* tanpa *reload*
- **State Management:** React Context API & React Hooks (`useState`, `useContext`, `useEffect`, `useMemo`)
- **Package Manager:** `pnpm`
- **Modern JavaScript:** Ekstensif menggunakan ES6 (let/const, Arrow Functions, Template Literals, Destructuring, Spread Operator, dan Rest Parameters).
- **Simulasi Database:** Array Object statis dan manipulasi Context State (berlaku dinamis di *runtime*)

## d. Struktur Folder Proyek
Proyek ini sepenuhnya berbasis *frontend* (tidak ada repositori *backend* terpisah).
```text
giri-track/
├── public/                 # Aset statis publik (gambar, ikon)
├── src/
│   ├── assets/             # Aset internal pendukung komponen
│   ├── components/         # Komponen React yang dapat digunakan ulang (Navbar, Card, Pagination, AuthModal)
│   ├── context/            # Pengelola State Global (AuthContext, TrailContext, RaceContext, dll)
│   ├── data/               # Data dummy simulasi database dan konstanta (JSON / Array of Object)
│   ├── pages/              # Komponen level Halaman (Rute Utama)
│   │   ├── admin/          # Halaman khusus peran Administrator (Dashboard, CRUD Form)
│   │   └── user/           # Halaman publik (Beranda, Trails, RaceCatalog, History)
│   ├── App.jsx             # Entry point Aplikasi (Konfigurasi Route BrowserRouter)
│   ├── index.css           # Global Style & Tailwind Inject
│   └── main.jsx            # React DOM Render Setup
├── package.json            # Daftar dependensi aplikasi dan script (vite, pnpm)
├── tailwind.config.js      # (Opsional/Internal) Pengaturan tema Tailwind
├── vite.config.js          # Konfigurasi bundler Vite
└── README.md               # Dokumentasi proyek
```

## e. Cara Instalasi dan Menjalankan Aplikasi
1. Pastikan **Node.js** dan **pnpm** sudah terinstal di komputer/laptop Anda.
2. Salin *repository* proyek ini ke lokal (*clone* atau *download zip*).
3. Buka terminal/Command Prompt, arahkan ke folder utama proyek (`giri-track`).
4. Instalasi semua dependensi dengan perintah:
   ```bash
   pnpm install
   ```
5. Jalankan lokal server untuk mode *development*:
   ```bash
   pnpm dev
   ```
6. Buka URL yang muncul di terminal (misal: `http://localhost:5173`) menggunakan *browser*.

## f. Informasi Endpoint / Konfigurasi Backend
*Aplikasi ini tidak mewajibkan penggunaan backend khusus. Data disimulasikan menggunakan **Context API** dan manipulasi State (Array Objects) di bagian Frontend. Sehingga aplikasi berjalan penuh secara mandiri (Standalone Client).*

## g. Screenshot Aplikasi
*(Tambahkan gambar screenshot aplikasi dengan melampirkan tautan gambar repo Anda di bawah ini)*
- **Beranda (Desktop):** `![Beranda](link-gambar-beranda.png)`
- **Katalog (Pencarian & Filter):** `![Katalog](link-gambar-katalog.png)`
- **Mobile View & Navigasi:** `![Mobile View](link-gambar-mobile.png)`
- **Admin Panel (CRUD):** `![Admin Panel](link-gambar-admin.png)`
