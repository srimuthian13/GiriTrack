// Mock data ekosistem Trail Running Race GiriTrack (Inspired by UTMB & Golden Trail Series)

export const races = [
  {
    id: "mount-lawu-2026",
    title: "Mount Lawu Ultra Trail 2026",
    tagline: "Menembus Batas Kaldera Mistis Lawu via Candi Cetho",
    date: "2026-10-24",
    location: "Candi Cetho, Karanganyar, Jawa Tengah",
    heroBanner: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=85",
    banner: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=85",
    statsSummary: {
      maxDistance: "50 KM",
      maxElevation: "3.200 M+",
      cutOffTime: "12 HOURS",
    },
    categories: [
      {
        id: "cat-15k",
        name: "15K Short Trail",
        distance: "15 km",
        elevationGain: "+850 m",
        cot: "4 Jam",
        price: 250000,
        quota: 150,
        slotsTaken: 98,
        difficulty: "Moderate",
        flagOff: "07:00 WIB",
        qualification: "Terbuka untuk Umum / Pemula Aktif",
        description: "Rute pengantar trail running yang melintasi perkebunan teh Kemuning dan hutan pinus lereng barat Lawu."
      },
      {
        id: "cat-30k",
        name: "30K Challenge",
        distance: "30 km",
        elevationGain: "+1.950 m",
        cot: "8 Jam",
        price: 450000,
        quota: 100,
        slotsTaken: 72,
        difficulty: "Demanding",
        flagOff: "06:00 WIB",
        qualification: "Pernah menyelesaikan Half Marathon / Trail 15K",
        description: "Pendakian teknikal melewati Pos Gupakan Menjangan dan sabana Bulak Peperangan dengan jalur berbatu tajam."
      },
      {
        id: "cat-50k",
        name: "50K Ultra",
        distance: "50 km",
        elevationGain: "+3.200 m",
        cot: "12 Jam",
        price: 650000,
        quota: 60,
        slotsTaken: 54,
        difficulty: "Extreme SkyRunning",
        flagOff: "04:00 WIB",
        qualification: "Finisher Marathon Road atau Trail 25K+ resmi",
        description: "Tantangan puncak kaldera Lawu (Hargo Dumilah 3.265 mdpl) dengan rute loop ekstrem melalui jalur Candi Cetho."
      }
    ],
    mandatoryGear: [
      { name: "Running Vest / Hydration Pack min 1L", icon: "vest", required: true },
      { name: "Emergency Blanket (Aluminium Foil)", icon: "blanket", required: true },
      { name: "Peluit Darurat (Emergency Whistle)", icon: "whistle", required: true },
      { name: "Headlamp 150+ Lumens + Baterai Cadangan", icon: "lamp", required: true },
      { name: "Windproof / Waterproof Jacket dengan tudung", icon: "jacket", required: true },
      { name: "Ponsel Aktif dengan Pulsa & Baterai Penuh", icon: "phone", required: true },
      { name: "Obat-obatan Pribadi & First Aid Kit Ringkas", icon: "medkit", required: true },
      { name: "Trekking Poles (Sangat Disarankan untuk 30K & 50K)", icon: "pole", required: false }
    ],
    schedule: [
      {
        day: "Jumat, 23 Okt 2026",
        events: [
          { time: "13.00 - 18.00 WIB", title: "Race Pack Collection (RPC) & Mandatary Gear Check", loc: "Pendopo Candi Cetho" },
          { time: "18.30 - 19.30 WIB", title: "Technical Meeting & Trail Condition Safety Briefing", loc: "Amphitheater Budaya Cetho" },
          { time: "20.00 WIB", title: "RPC Ditutup - Istirahat Peserta", loc: "Race Village" }
        ]
      },
      {
        day: "Sabtu, 24 Okt 2026",
        events: [
          { time: "03.00 - 03.45 WIB", title: "Drop Bag & Final Mandatory Check 50K Ultra", loc: "Start Arch Gate" },
          { time: "04.00 WIB", title: "🚩 Flag-Off Kategori 50K Ultra", loc: "Gerbang Candi Cetho" },
          { time: "06.00 WIB", title: "🚩 Flag-Off Kategori 30K Challenge", loc: "Gerbang Candi Cetho" },
          { time: "07.00 WIB", title: "🚩 Flag-Off Kategori 15K Short Trail", loc: "Gerbang Candi Cetho" },
          { time: "11.00 WIB", title: "Cut-Off Time (COT) 15K", loc: "Finish Arch Gate" },
          { time: "14.00 WIB", title: "Cut-Off Time (COT) 30K", loc: "Finish Arch Gate" },
          { time: "16.00 WIB", title: "Cut-Off Time (COT) 50K & Race Closes", loc: "Finish Arch Gate" },
          { time: "16.30 - 18.00 WIB", title: "Podium Awarding Ceremony & Closing Celebration", loc: "Panggung Budaya Cetho" }
        ]
      }
    ],
    checkpoints: [
      { name: "Start / Finish (Candi Cetho)", km: "0 KM / 50 KM", elevation: "1.496 mdpl", lat: -7.5954, lng: 111.1578, type: "start_finish" },
      { name: "WS 1 (Candi Kethek)", km: "4.5 KM", elevation: "1.650 mdpl", lat: -7.6012, lng: 111.1620, type: "water_station" },
      { name: "CP 1 (Pos 2 Brak Seng)", km: "11 KM", elevation: "2.100 mdpl", lat: -7.6089, lng: 111.1695, type: "checkpoint" },
      { name: "WS 2 (Pos 3 Gupakan Menjangan)", km: "18 KM", elevation: "2.650 mdpl", lat: -7.6165, lng: 111.1780, type: "water_station" },
      { name: "CP 2 (Pasar Dieng / Hargo Dalem)", km: "24 KM", elevation: "3.100 mdpl", lat: -7.6240, lng: 111.1870, type: "checkpoint" },
      { name: "Summit Check (Puncak Hargo Dumilah)", km: "27 KM", elevation: "3.265 mdpl", lat: -7.6280, lng: 111.1920, type: "summit" },
      { name: "WS 3 (Pos 4 Cemoro Kandang Junction)", km: "36 KM", elevation: "2.500 mdpl", lat: -7.6190, lng: 111.1730, type: "water_station" },
      { name: "CP 3 (Perkebunan Teh Tambak)", km: "44 KM", elevation: "1.700 mdpl", lat: -7.6040, lng: 111.1610, type: "checkpoint" }
    ],
    routeCoordinates: [
      [-7.5954, 111.1578], [-7.5980, 111.1595], [-7.6012, 111.1620], [-7.6045, 111.1650],
      [-7.6089, 111.1695], [-7.6125, 111.1735], [-7.6165, 111.1780], [-7.6200, 111.1825],
      [-7.6240, 111.1870], [-7.6280, 111.1920], [-7.6255, 111.1885], [-7.6220, 111.1830],
      [-7.6190, 111.1730], [-7.6110, 111.1660], [-7.6040, 111.1610], [-7.5990, 111.1585],
      [-7.5954, 111.1578]
    ],
    elevationProfileSvg: {
      viewBox: "0 0 800 240",
      path: "M 30 210 L 100 190 L 220 150 L 360 95 L 480 30 L 530 45 L 640 125 L 720 180 L 770 210",
      fillPath: "M 30 210 L 100 190 L 220 150 L 360 95 L 480 30 L 530 45 L 640 125 L 720 180 L 770 210 L 770 230 L 30 230 Z",
      peaks: [
        { km: "0 km", label: "Candi Cetho", alt: "1.496m", x: 30, y: 210 },
        { km: "11 km", label: "Pos 2", alt: "2.100m", x: 220, y: 150 },
        { km: "18 km", label: "Gupakan Menjangan", alt: "2.650m", x: 360, y: 95 },
        { km: "27 km", label: "Hargo Dumilah", alt: "3.265m", x: 480, y: 30 },
        { km: "36 km", label: "Pos 4", alt: "2.500m", x: 640, y: 125 },
        { km: "50 km", label: "Finish Cetho", alt: "1.496m", x: 770, y: 210 }
      ]
    },
    participants: [
      { bib: "BIB-50K-001", name: "Deni Ardiansyah", category: "50K Ultra", gender: "Male", city: "Bandung", status: "Finished", time: "06:48:12", pace: "8:09 min/km" },
      { bib: "BIB-30K-012", name: "Bagus Setiawan", category: "30K Challenge", gender: "Male", city: "Semarang", status: "Finished", time: "03:42:15", pace: "7:24 min/km" }
    ],
    leaderboard: [
      { rank: 1, bib: "BIB-50K-001", name: "Deni Ardiansyah", category: "50K Ultra", finishTime: "06:48:12", avgPace: "8:09 /km", country: "IDN" },
      { rank: 2, bib: "BIB-50K-002", name: "Arief Wicaksono", category: "50K Ultra", finishTime: "07:12:45", avgPace: "8:39 /km", country: "IDN" }
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80", caption: "Jalur bebatuan terjal" }
    ],
    news: [
      { date: "02 Sep 2026", title: "Pembaruan Lintasan", summary: "Marking rute sudah selesai dipasang." }
    ]
  },
  {
    id: "merbabu-skyrace-2026",
    title: "Merbabu SkyRace 2026",
    tagline: "Lomba Lari Melintasi Savana Merbabu",
    date: "2026-10-18",
    location: "Selo, Boyolali, Jawa Tengah",
    heroBanner: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85",
    banner: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    statsSummary: {
      maxDistance: "50 KM",
      maxElevation: "3.200 M+",
      cutOffTime: "16 HOURS",
    },
    categories: [
      {
        id: "cat-10k",
        name: "10K Discovery",
        distance: "10 km",
        elevationGain: "+650 m",
        cot: "4 Jam",
        price: 350000,
        quota: 100,
        slotsTaken: 45,
        difficulty: "Moderate",
        flagOff: "07:00 WIB",
        qualification: "Terbuka untuk Umum",
        description: "Rute pendek yang memperkenalkan pendaki pada indahnya kaki Merbabu."
      },
      {
        id: "cat-25k",
        name: "25K SkyRace",
        distance: "25 km",
        elevationGain: "+1800 m",
        cot: "9 Jam",
        price: 550000,
        quota: 150,
        slotsTaken: 120,
        difficulty: "Demanding",
        flagOff: "05:00 WIB",
        qualification: "Finisher Trail 15K",
        description: "Menyeberangi padang sabana dan memutari pos-pos ikonik Selo."
      },
      {
        id: "cat-50k",
        name: "50K Ultra",
        distance: "50 km",
        elevationGain: "+3200 m",
        cot: "16 Jam",
        price: 850000,
        quota: 50,
        slotsTaken: 50,
        difficulty: "Extreme SkyRunning",
        flagOff: "03:00 WIB",
        qualification: "Finisher Trail 25K",
        description: "Rute brutal melintasi puncak Kenteng Songo dan turun melalui jalur Suwanting."
      }
    ],
    mandatoryGear: [
      { name: "Running Vest / Hydration Pack min 1L", icon: "vest", required: true },
      { name: "Emergency Blanket", icon: "blanket", required: true },
      { name: "Peluit Darurat", icon: "whistle", required: true },
      { name: "Headlamp", icon: "lamp", required: true },
      { name: "Windproof Jacket", icon: "jacket", required: true },
      { name: "First aid kit", icon: "medkit", required: true }
    ],
    schedule: [],
    checkpoints: [],
    routeCoordinates: [],
    participants: [],
    leaderboard: [],
    gallery: [],
    news: []
  },
  {
    id: "gede-pangrango-100",
    title: "Gede Pangrango 100",
    tagline: "Satu Abad Jelajah Hutan Hujan Tropis",
    date: "2026-11-22",
    location: "Cibodas, Cianjur, Jawa Barat",
    heroBanner: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=85",
    banner: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    statsSummary: {
      maxDistance: "100 KM",
      maxElevation: "5.500 M+",
      cutOffTime: "32 HOURS",
    },
    categories: [
      {
        id: "cat-21k",
        name: "21K Half Marathon",
        distance: "21 km",
        elevationGain: "+1500 m",
        cot: "8 Jam",
        price: 450000,
        quota: 200,
        slotsTaken: 10,
        difficulty: "Demanding",
        flagOff: "06:00 WIB",
        qualification: "Terbuka untuk Umum",
        description: "Menjelajahi keindahan Alun-alun Suryakencana."
      },
      {
        id: "cat-100k",
        name: "100K Ultra Trail",
        distance: "100 km",
        elevationGain: "+5500 m",
        cot: "32 Jam",
        price: 1500000,
        quota: 100,
        slotsTaken: 25,
        difficulty: "Extreme",
        flagOff: "00:00 WIB",
        qualification: "Finisher Trail 50K",
        description: "Ujian ketahanan mengelilingi kawasan TNGGP."
      }
    ],
    mandatoryGear: [
      { name: "Running Vest / Hydration Pack min 1.5L", icon: "vest", required: true },
      { name: "Emergency Blanket", icon: "blanket", required: true },
      { name: "Headlamp with spare battery", icon: "lamp", required: true },
      { name: "Windproof Jacket", icon: "jacket", required: true },
      { name: "First aid kit", icon: "medkit", required: true }
    ],
    schedule: [],
    checkpoints: [],
    routeCoordinates: [],
    participants: [],
    leaderboard: [],
    gallery: [],
    news: []
  },
  {
    id: "bts-ultra-100-2026",
    title: "Bromo Tengger Semeru 100 Ultra 2026",
    tagline: "Lari Menembus Lautan Pasir dan Kaldera Vulkanik Megah",
    date: "2026-11-07",
    location: "Taman Nasional Bromo Tengger Semeru, Probolinggo, Jawa Timur",
    heroBanner: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1920&q=85",
    banner: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80",
    statsSummary: {
      maxDistance: "102 KM",
      maxElevation: "4.800 M+",
      cutOffTime: "30 HOURS",
    },
    categories: [
      {
        id: "cat-bts-30k",
        name: "30K Sea of Sand",
        distance: "30 km",
        elevationGain: "+1200 m",
        cot: "7 Jam",
        price: 475000,
        quota: 250,
        slotsTaken: 180,
        difficulty: "Moderate",
        flagOff: "06:00 WIB",
        qualification: "Terbuka untuk Umum",
        description: "Melintasi padang sabana Teletubbies dan lautan pasir berbisik Gunung Bromo."
      },
      {
        id: "cat-bts-70k",
        name: "70K Caldera Challenge",
        distance: "70 km",
        elevationGain: "+3100 m",
        cot: "18 Jam",
        price: 850000,
        quota: 120,
        slotsTaken: 95,
        difficulty: "Extreme",
        flagOff: "00:00 WIB",
        qualification: "Finisher Trail 25K",
        description: "Mendaki dinding kaldera Tengger dan puncak B29 dengan panorama matahari terbit."
      },
      {
        id: "cat-bts-102k",
        name: "102K Ultra",
        distance: "102 km",
        elevationGain: "+4800 m",
        cot: "30 Jam",
        price: 1350000,
        quota: 80,
        slotsTaken: 78,
        difficulty: "Extreme SkyRunning",
        flagOff: "22:00 WIB",
        qualification: "Finisher Trail 50K",
        description: "Ekspedisi ultra penuh mengelilingi kaldera purba Semeru dan Danau Ranu Kumbolo."
      }
    ],
    mandatoryGear: [
      { name: "Running Vest min 1.5L", icon: "vest", required: true },
      { name: "Emergency Foil Blanket", icon: "blanket", required: true },
      { name: "Headlamp 200 Lumens + Baterai", icon: "lamp", required: true },
      { name: "Masker/Buff Anti-Debu Pasir", icon: "mask", required: true },
      { name: "Jaket Windproof/Waterproof", icon: "jacket", required: true }
    ],
    schedule: [],
    checkpoints: [],
    routeCoordinates: [],
    participants: [],
    leaderboard: [],
    gallery: [],
    news: []
  },
  {
    id: "rinjani-sky-ultra-2026",
    title: "Rinjani 100 Sky Ultra 2026",
    tagline: "Tantangan Punggung Naga dan Kaldera Danau Segara Anak",
    date: "2026-05-16",
    location: "Sembalun, Lombok Timur, Nusa Tenggara Barat",
    heroBanner: "https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1920&q=85",
    banner: "https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1200&q=80",
    statsSummary: {
      maxDistance: "60 KM",
      maxElevation: "5.100 M+",
      cutOffTime: "24 HOURS",
    },
    categories: [
      {
        id: "cat-rinjani-27k",
        name: "27K Plawangan Express",
        distance: "27 km",
        elevationGain: "+2100 m",
        cot: "9 Jam",
        price: 600000,
        quota: 150,
        slotsTaken: 110,
        difficulty: "Demanding",
        flagOff: "05:00 WITA",
        qualification: "Finisher Trail 15K",
        description: "Pendakian legendaris Bukit Penyesalan hingga bibir kawah Plawangan Sembalun."
      },
      {
        id: "cat-rinjani-60k",
        name: "60K Summit Ultra",
        distance: "60 km",
        elevationGain: "+5100 m",
        cot: "24 Jam",
        price: 1100000,
        quota: 90,
        slotsTaken: 65,
        difficulty: "Extreme SkyRunning",
        flagOff: "01:00 WITA",
        qualification: "Finisher Trail 30K",
        description: "Menembus pasir puncak Rinjani 3.726 mdpl lalu turun curam menuju Danau Segara Anak."
      }
    ],
    mandatoryGear: [
      { name: "Hydration Pack min 2L", icon: "vest", required: true },
      { name: "Emergency Blanket & Peluit", icon: "blanket", required: true },
      { name: "2x Headlamp + Cadangan", icon: "lamp", required: true },
      { name: "Thermal Jacket & Glove", icon: "jacket", required: true }
    ],
    schedule: [],
    checkpoints: [],
    routeCoordinates: [],
    participants: [],
    leaderboard: [],
    gallery: [],
    news: []
  },
  {
    id: "merapi-volcano-trail-2026",
    title: "Merapi Volcano Trail Race 2026",
    tagline: "Menyusuri Jejak Lahar Dingin & Lembah Purba Merapi",
    date: "2026-08-09",
    location: "Kaliurang, Sleman, DI Yogyakarta",
    heroBanner: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=85",
    banner: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    statsSummary: {
      maxDistance: "25 KM",
      maxElevation: "1.600 M+",
      cutOffTime: "7 HOURS",
    },
    categories: [
      {
        id: "cat-mvt-10k",
        name: "10K Lava Fun Trail",
        distance: "10 km",
        elevationGain: "+550 m",
        cot: "3.5 Jam",
        price: 275000,
        quota: 300,
        slotsTaken: 140,
        difficulty: "Moderate",
        flagOff: "06:30 WIB",
        qualification: "Terbuka untuk Umum",
        description: "Lintasan lari asri melintasi hutan pinus Kaliurang dan bunker Kaliadem."
      },
      {
        id: "cat-mvt-25k",
        name: "25K Caldera Sky",
        distance: "25 km",
        elevationGain: "+1600 m",
        cot: "7 Jam",
        price: 450000,
        quota: 150,
        slotsTaken: 130,
        difficulty: "Demanding",
        flagOff: "05:30 WIB",
        qualification: "Finisher 10K",
        description: "Mendaki igir-igir terjal lereng selatan dengan latar asap solfatara Gunung Merapi."
      }
    ],
    mandatoryGear: [
      { name: "Hydration Pack min 1L", icon: "vest", required: true },
      { name: "Emergency Blanket & Peluit", icon: "blanket", required: true },
      { name: "Windproof Jacket", icon: "jacket", required: true }
    ],
    schedule: [],
    checkpoints: [],
    routeCoordinates: [],
    participants: [],
    leaderboard: [],
    gallery: [],
    news: []
  },
  {
    id: "bali-volcano-skyrace-2026",
    title: "Bali Volcano SkyRace 2026",
    tagline: "Menyusuri Danau Batur & Kaldera Geopark Dunia",
    date: "2026-07-12",
    location: "Kintamani, Bangli, Bali",
    heroBanner: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1920&q=85",
    banner: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80",
    statsSummary: {
      maxDistance: "42 KM",
      maxElevation: "2.800 M+",
      cutOffTime: "11 HOURS",
    },
    categories: [
      {
        id: "cat-bvs-21k",
        name: "21K Batur Ridge",
        distance: "21 km",
        elevationGain: "+1300 m",
        cot: "6 Jam",
        price: 500000,
        quota: 200,
        slotsTaken: 175,
        difficulty: "Moderate",
        flagOff: "06:00 WITA",
        qualification: "Terbuka untuk Umum",
        description: "Melintasi bebatuan lava hitam purba Black Lava dan puncak kawah Batur."
      },
      {
        id: "cat-bvs-42k",
        name: "42K Abang SkyMarathon",
        distance: "42 km",
        elevationGain: "+2800 m",
        cot: "11 Jam",
        price: 750000,
        quota: 100,
        slotsTaken: 62,
        difficulty: "Extreme SkyRunning",
        flagOff: "04:30 WITA",
        qualification: "Finisher Trail 21K",
        description: "Menghubungkan Kaldera Batur dengan jalur hutan lebat Gunung Abang di atas awan."
      }
    ],
    mandatoryGear: [
      { name: "Running Vest min 1.5L", icon: "vest", required: true },
      { name: "Headlamp 150 Lumens", icon: "lamp", required: true },
      { name: "Emergency Blanket & Peluit", icon: "blanket", required: true },
      { name: "Windproof Jacket", icon: "jacket", required: true }
    ],
    schedule: [],
    checkpoints: [],
    routeCoordinates: [],
    participants: [],
    leaderboard: [],
    gallery: [],
    news: []
  },
  {
    id: "toraja-highland-trail-2026",
    title: "Toraja Highland Ultra Trail 2026",
    tagline: "Lari Sakral Melintasi Rumah Adat Tongkonan & Tebing Karst",
    date: "2026-09-19",
    location: "Rantepao, Toraja Utara, Sulawesi Selatan",
    heroBanner: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85",
    banner: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    statsSummary: {
      maxDistance: "50 KM",
      maxElevation: "3.100 M+",
      cutOffTime: "14 HOURS",
    },
    categories: [
      {
        id: "cat-tht-25k",
        name: "25K Tongkonan Trail",
        distance: "25 km",
        elevationGain: "+1450 m",
        cot: "7 Jam",
        price: 450000,
        quota: 150,
        slotsTaken: 80,
        difficulty: "Moderate",
        flagOff: "06:00 WITA",
        qualification: "Terbuka untuk Umum",
        description: "Melintasi perbukitan negeri di atas awan Lolai dan perkampungan megalitikum Kete Kesu."
      },
      {
        id: "cat-tht-50k",
        name: "50K Sesean Ultra",
        distance: "50 km",
        elevationGain: "+3100 m",
        cot: "14 Jam",
        price: 800000,
        quota: 80,
        slotsTaken: 45,
        difficulty: "Extreme",
        flagOff: "04:00 WITA",
        qualification: "Finisher Trail 25K",
        description: "Mendaki puncak batu granit Gunung Sesean dengan panorama kabut magis Toraja."
      }
    ],
    mandatoryGear: [
      { name: "Running Vest min 1.5L", icon: "vest", required: true },
      { name: "Emergency Blanket & Peluit", icon: "blanket", required: true },
      { name: "Headlamp 150 Lumens", icon: "lamp", required: true },
      { name: "Jaket Tahan Air", icon: "jacket", required: true }
    ],
    schedule: [],
    checkpoints: [],
    routeCoordinates: [],
    participants: [],
    leaderboard: [],
    gallery: [],
    news: []
  }
];

export const flagshipRace = races[0];

