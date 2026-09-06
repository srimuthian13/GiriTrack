export const initialUsers = [
  {
    id: 'user-admin',
    name: 'Admin GiriTrack',
    email: 'admin@giritrack.id',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'user-1',
    name: 'Rangga Explorer',
    email: 'rangga@giritrack.id',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'user-2',
    name: 'Srikandi Tektok',
    email: 'srikandi@giritrack.id',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'user-3',
    name: 'Budi Ultra Trail',
    email: 'budi@giritrack.id',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  }
];

export const initialLocations = [
  { id: 'loc-jabar', name: 'Jawa Barat' },
  { id: 'loc-jateng', name: 'Jawa Tengah' },
  { id: 'loc-jatim', name: 'Jawa Timur' },
  { id: 'loc-ntb', name: 'Nusa Tenggara Barat (NTB)' },
  { id: 'loc-bali', name: 'Bali' },
];

export const initialDifficultyLevels = [
  {
    id: 'diff-mudah',
    label: 'Mudah',
    colorBadge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300',
  },
  {
    id: 'diff-sedang',
    label: 'Sedang',
    colorBadge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300',
  },
  {
    id: 'diff-sulit',
    label: 'Sulit',
    colorBadge: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border-orange-300',
  },
  {
    id: 'diff-ekstrem',
    label: 'Ekstrem',
    colorBadge: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300',
  },
];

export const initialTrails = [
  {
    id: 'trail-1',
    name: 'Gunung Gede via Cibodas',
    location: 'Cianjur, Jawa Barat',
    locationId: 'loc-jabar',
    difficulty: 'Sedang',
    difficultyId: 'diff-sedang',
    status: 'verified',
    distance_km: 13.5,
    elevation_m: 2958,
    estimated_time: '7-8 Jam',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop',
    description: 'Jalur favorit pendaki dengan pemandangan Telaga Biru, Air Terjun Cibeureum, Kandang Batu, dan Alun-Alun Suryakencana yang ditumbuhi bunga Edelweis.',
    likes_count: 142,
    ratingAvg: 4.8,
    coordinates: [
      [-6.74610, 106.99420], // Pintu Masuk Cibodas
      [-6.75320, 106.98980], // Telaga Biru
      [-6.75940, 106.98610], // Rawa Gayonggong
      [-6.76610, 106.98230], // Pos Panyancangan
      [-6.77280, 106.98010], // Rawa Denok 1
      [-6.77940, 106.97850], // Pos Air Panas
      [-6.78450, 106.97920], // Kandang Batu
      [-6.78910, 106.98140], // Kandang Badak
      [-6.79320, 106.98390], // Tanjakan Rantai
      [-6.79780, 106.98520]  // Puncak Gede 2958 MDPL
    ],
    reviews: [
      {
        id: 'rev-101',
        userId: 'user-1',
        userName: 'Rangga Explorer',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
        rating: 5,
        comment: 'Alun-Alun Suryakencana sangat indah saat matahari terbit! Sumber air melimpah di Kandang Badak.',
        date: '2026-08-25',
      },
      {
        id: 'rev-102',
        userId: 'user-2',
        userName: 'Srikandi Tektok',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
        rating: 4.5,
        comment: 'Hati-hati saat melintasi Tanjakan Rantai, tumpuan batu lumayan licin saat hujan turun.',
        date: '2026-08-28',
      }
    ],
    comments: [
      {
        id: 'c-101',
        user: 'Rangga Explorer',
        text: 'Alun-Alun Suryakencana sangat indah saat matahari terbit! Sumber air melimpah di Kandang Badak.',
        date: '2026-08-25',
      },
      {
        id: 'c-102',
        user: 'Srikandi Tektok',
        text: 'Hati-hati saat melintasi Tanjakan Rantai, tumpuan batu lumayan licin saat hujan turun.',
        date: '2026-08-28',
      }
    ]
  },
  {
    id: 'trail-2',
    name: 'Gunung Prau via Patakbanteng',
    location: 'Wonosobo, Jawa Tengah',
    locationId: 'loc-jateng',
    difficulty: 'Mudah',
    difficultyId: 'diff-mudah',
    status: 'verified',
    distance_km: 4.2,
    elevation_m: 2565,
    estimated_time: '3-4 Jam',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop',
    description: 'Jalur paling populer menuju Puncak Prau. Jalur ini ramah bagi pendaki pemula dengan trek anak tangga tanah dan pemandangan golden sunrise terbaik di Asia Tenggara.',
    likes_count: 289,
    ratingAvg: 4.9,
    coordinates: [
      [-7.21850, 109.91920], // Basecamp Patakbanteng (Point A)
      [-7.21710, 109.91980], // Area perkampungan & batas ladang
      [-7.21530, 109.92040], // Pos 1 (Sikut Genthong)
      [-7.21380, 109.92110], // Jalur tangga batu
      [-7.21190, 109.92180], // Pos 2 (Canggal Walangan)
      [-7.20980, 109.92290], // Pos 3 (Cacingan - Trek Terjal)
      [-7.20790, 109.92380], // Pintu Masuk Hutan Semak
      [-7.20580, 109.92490], // Plawangan Patakbanteng
      [-7.20410, 109.92610], // Bukit Teletubbies
      [-7.20250, 109.92720]  // Puncak Prau 2565 MDPL (Point B)
    ],
    reviews: [
      {
        id: 'rev-201',
        userId: 'user-3',
        userName: 'Budi Ultra Trail',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        rating: 5,
        comment: 'Trek singkat 3.5 jam muncak! Sangat cocok untuk tektok pagi bersama teman-teman.',
        date: '2026-08-20',
      }
    ],
    comments: [
      {
        id: 'c-201',
        user: 'Pendaki Pemula',
        text: 'Trek singkat 3.5 jam muncak! Sangat cocok untuk tektok pagi bersama teman-teman.',
        date: '2026-08-20',
      }
    ]
  },
  {
    id: 'trail-3',
    name: 'Gunung Merbabu via Selo',
    location: 'Boyolali, Jawa Tengah',
    locationId: 'loc-jateng',
    difficulty: 'Sedang',
    difficultyId: 'diff-sedang',
    status: 'verified',
    distance_km: 9.8,
    elevation_m: 3145,
    estimated_time: '6-7 Jam',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop',
    description: 'Menyuguhkan panorama padang savana yang sangat luas dan pemandangan megah Gunung Merapi tepat di seberangnya.',
    likes_count: 195,
    ratingAvg: 4.7,
    coordinates: [
      [-7.50290, 110.45780], // Basecamp Selo
      [-7.49810, 110.45420], // Gerbang Taman Nasional
      [-7.49320, 110.45190], // Pos 1 (Dok-Dok-An)
      [-7.48780, 110.44910], // Pos 2 (Pandean)
      [-7.47950, 110.44680], // Pos 3 (Watu Tulis)
      [-7.46980, 110.44420], // Sabana 1
      [-7.46120, 110.44290], // Sabana 2
      [-7.45680, 110.44180], // Pos 4 (Samarantu)
      [-7.45210, 110.44050]  // Puncak Kenteng Songo 3142 MDPL
    ],
    reviews: [
      {
        id: 'rev-301',
        userId: 'user-1',
        userName: 'Rangga Explorer',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
        rating: 4.8,
        comment: 'Savana 1 dan Sabana 2 tempat terbaik untuk melepas lelah. Pemandangan Merapi terpampang nyata.',
        date: '2026-08-15',
      }
    ],
    comments: [
      {
        id: 'c-301',
        user: 'SavanaLover',
        text: 'Savana 1 dan Sabana 2 tempat terbaik untuk melepas lelah. Pemandangan Merapi terpampang nyata.',
        date: '2026-08-15',
      }
    ]
  },
  {
    id: 'trail-4',
    name: 'Gunung Rinjani via Sembalun',
    location: 'Lombok Timur, NTB',
    locationId: 'loc-ntb',
    difficulty: 'Ekstrem',
    difficultyId: 'diff-ekstrem',
    status: 'verified',
    distance_km: 21.0,
    elevation_m: 3726,
    estimated_time: '12-14 Jam',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1000&auto=format&fit=crop',
    description: 'Trek terpanjang dan paling menantang menyeberangi Bukit Penyesalan menuju puncak tertinggi kedua di Indonesia dengan pemandangan Danau Segara Anak.',
    likes_count: 310,
    ratingAvg: 4.9,
    coordinates: [
      [-8.36200, 116.53100], // Basecamp Sembalun
      [-8.37100, 116.52400], // Pos 1 Pemantauan
      [-8.37900, 116.51200], // Pos 2 Tengengean
      [-8.38800, 116.49800], // Pos 3 Pada Balong
      [-8.39700, 116.48500], // Bukit Penyesalan
      [-8.40600, 116.47100], // Plawangan Sembalun
      [-8.41400, 116.46200], // Trek Pasir Puncak
      [-8.41700, 116.45800]  // Puncak Rinjani 3726 MDPL
    ],
    reviews: [],
    comments: []
  },
  {
    id: 'trail-5',
    name: 'Gunung Sindoro via Kledung',
    location: 'Temanggung, Jawa Tengah',
    locationId: 'loc-jateng',
    difficulty: 'Sulit',
    difficultyId: 'diff-sulit',
    status: 'verified',
    distance_km: 8.7,
    elevation_m: 3153,
    estimated_time: '6-8 Jam',
    image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1000&auto=format&fit=crop',
    description: 'Jalur berbatu yang lumayan terjal melintasi hutan pinus dan pos perkemahan sebelum sampai di kawah aktif dengan bidang puncak yang sangat lapang.',
    likes_count: 118,
    ratingAvg: 4.6,
    coordinates: [
      [-7.33200, 110.02100], // Basecamp Kledung
      [-7.32700, 110.01700], // Pos 1 Watu Tumpeng
      [-7.32100, 110.01300], // Pos 2 Kebun Kopi
      [-7.31500, 110.00900], // Pos 3 Srikandi
      [-7.30900, 110.00400], // Pos 4 Watu Gede
      [-7.30300, 110.00100]  // Puncak Sindoro 3153 MDPL
    ],
    reviews: [],
    comments: []
  },
  {
    id: 'trail-6-pending',
    name: 'Gunung Lawu via Candi Cetho',
    location: 'Karanganyar, Jawa Tengah',
    locationId: 'loc-jateng',
    difficulty: 'Sulit',
    difficultyId: 'diff-sulit',
    status: 'pending',
    distance_km: 14.2,
    elevation_m: 3265,
    estimated_time: '8-9 Jam',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000&auto=format&fit=crop',
    description: 'Jalur eksotis penuh nuansa mistis dan sejarah melintasi Candi Cetho, Pos Bulak Peperangan, hingga Pasar Dieng dan Hargo Dumilah.',
    likes_count: 45,
    ratingAvg: 0,
    coordinates: [
      [-7.59500, 111.15600],
      [-7.60800, 111.16800],
      [-7.62500, 111.18900],
      [-7.63200, 111.19600]
    ],
    reviews: [],
    comments: []
  }
];

export const initialEvents = [
  {
    id: 'event-1',
    name: 'Tektok Ceria Prau Sunrise',
    date: '2026-09-15',
    peak_target: 'Puncak Prau (2.565 mdpl)',
    max_quota: 12,
    current_participants: 8,
    organizer: 'Rangga Explorer',
    meeting_point: 'Basecamp Patakbanteng, 01:00 WIB',
    is_joined: false,
  },
  {
    id: 'event-2',
    name: 'Tektok Muncak Gede via Cibodas',
    date: '2026-09-20',
    peak_target: 'Puncak Gede (2.958 mdpl)',
    max_quota: 10,
    current_participants: 10,
    organizer: 'Srikandi Tektok',
    meeting_point: 'Basecamp Cibodas, 02:00 WIB',
    is_joined: false,
  },
  {
    id: 'event-3',
    name: 'Weekend Speed Hike Merbabu',
    date: '2026-09-28',
    peak_target: 'Puncak Kenteng Songo (3.145 mdpl)',
    max_quota: 8,
    current_participants: 5,
    organizer: 'Giri Track Squad',
    meeting_point: 'Basecamp Selo, 01:30 WIB',
    is_joined: true,
  },
  {
    id: 'event-4',
    name: 'Tektok Training Sindoro Fast',
    date: '2026-10-05',
    peak_target: 'Puncak Sindoro (3.153 mdpl)',
    max_quota: 6,
    current_participants: 3,
    organizer: 'Ultra Trail ID',
    meeting_point: 'Basecamp Kledung, 00:30 WIB',
    is_joined: false,
  }
];

export const initialHistory = [
  {
    id: 'hist-1',
    trail_id: 'trail-2',
    trail_name: 'Gunung Prau via Patakbanteng',
    date: '2026-08-10T04:30:00.000Z',
    duration_seconds: 12600, // 3.5 jam
    distance_km: 4.2,
    avg_speed_kmh: 1.2,
    coordinates: [
      [-7.21850, 109.91920],
      [-7.21710, 109.91980],
      [-7.21530, 109.92040],
      [-7.21380, 109.92110],
      [-7.21190, 109.92180],
      [-7.20980, 109.92290],
      [-7.20790, 109.92380],
      [-7.20580, 109.92490],
      [-7.20410, 109.92610],
      [-7.20250, 109.92720]
    ]
  },
  {
    id: 'hist-2',
    trail_id: 'trail-1',
    trail_name: 'Gunung Gede via Cibodas',
    date: '2026-08-22T02:00:00.000Z',
    duration_seconds: 25200, // 7 jam
    distance_km: 13.5,
    avg_speed_kmh: 1.93,
    coordinates: [
      [-6.74610, 106.99420],
      [-6.75320, 106.98980],
      [-6.75940, 106.98610],
      [-6.76610, 106.98230],
      [-6.77280, 106.98010],
      [-6.77940, 106.97850],
      [-6.78450, 106.97920],
      [-6.78910, 106.98140],
      [-6.79320, 106.98390],
      [-6.79780, 106.98520]
    ]
  }
];

export const initialRaces = [
  {
    id: "race-merbabu-2026",
    title: "Merbabu SkyRace Ultra 2026",
    location: "Selo, Boyolali, Jawa Tengah",
    date: "2026-10-18",
    banner: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    mandatoryGear: ["Hydration pack min 1L", "Headlamp", "Emergency whistle", "Windproof jacket", "First aid kit"],
    categories: [
      { id: "cat-10k", name: "10K Discovery", distance: "10 km", elevationGain: "+650 m", cot: "4 Jam", price: 350000, quota: 100, slotsTaken: 45 },
      { id: "cat-25k", name: "25K SkyRace", distance: "25 km", elevationGain: "+1800 m", cot: "9 Jam", price: 550000, quota: 150, slotsTaken: 120 },
      { id: "cat-50k", name: "50K Ultra", distance: "50 km", elevationGain: "+3200 m", cot: "16 Jam", price: 850000, quota: 50, slotsTaken: 50 }
    ]
  },
  {
    id: "race-gede-2026",
    title: "Gede Pangrango 100",
    location: "Cibodas, Jawa Barat",
    date: "2026-11-22",
    banner: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    mandatoryGear: ["Hydration pack min 1.5L", "Headlamp with spare battery", "Emergency blanket", "Windproof jacket", "First aid kit"],
    categories: [
      { id: "cat-21k", name: "21K Half Marathon", distance: "21 km", elevationGain: "+1500 m", cot: "8 Jam", price: 450000, quota: 200, slotsTaken: 10 },
      { id: "cat-100k", name: "100K Ultra Trail", distance: "100 km", elevationGain: "+5500 m", cot: "32 Jam", price: 1500000, quota: 100, slotsTaken: 25 }
    ]
  }
];

