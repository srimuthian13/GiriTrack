/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from 'react';
import { races as importedRaces, flagshipRace } from '../data/raceData';

export const RaceContext = createContext();

export function RaceProvider({ children }) {
  const [races, setRaces] = useState(() => {
    const saved = localStorage.getItem('giritrack_races');
    let loadedRaces = saved ? JSON.parse(saved) : [];
    
    if (loadedRaces.length === 0) {
      loadedRaces = [...importedRaces];
    } else {
      // Merge imported updates to local storage data
      loadedRaces = loadedRaces.map(lr => {
        const matchingImport = importedRaces.find(ir => ir.id === lr.id);
        if (matchingImport) {
          return { ...matchingImport, ...lr, categories: lr.categories || matchingImport.categories };
        }
        return lr;
      });
      // Add any new imported races not in local storage
      importedRaces.forEach(ir => {
        if (!loadedRaces.some(lr => lr.id === ir.id)) {
          loadedRaces.push(ir);
        }
      });
    }
    return loadedRaces;
  });

  const [registrations, setRegistrations] = useState(() => {
    const saved = localStorage.getItem('giritrack_race_registrations');
    return saved ? JSON.parse(saved) : [];
  });

  const [liveLeaderboard, setLiveLeaderboard] = useState(() => {
    const saved = localStorage.getItem('giritrack_live_leaderboard');
    return saved ? JSON.parse(saved) : (flagshipRace.leaderboard || []);
  });

  useEffect(() => {
    localStorage.setItem('giritrack_races', JSON.stringify(races));
  }, [races]);

  useEffect(() => {
    localStorage.setItem('giritrack_race_registrations', JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem('giritrack_live_leaderboard', JSON.stringify(liveLeaderboard));
  }, [liveLeaderboard]);

  const registerForRace = (raceId, categoryId, participantData) => {
    // Generate id and bib
    const generatedId = `reg-${Date.now()}`;
    
    // Find race info for ticket
    const race = races.find(r => r.id === raceId) || flagshipRace;
    const category = race.categories.find(c => c.id === categoryId);
    
    const catCode = category?.name ? category.name.split(' ')[0].toUpperCase() : 'RUN';
    const bibNumber = `BIB-${catCode}-${String(generatedId).slice(-3).padStart(3, '0')}`;

    const newReg = {
      id: generatedId,
      raceId,
      categoryId,
      ...participantData,
      // Additional fields for Ticket
      userEmail: participantData.email,
      ticketId: generatedId,
      bibNumber: bibNumber,
      raceTitle: race.title,
      categoryName: category?.name,
      price: category?.price,
      paymentDate: new Date().toISOString(),
      status: 'PAID', // overriding 'paid' to 'PAID'
      date: new Date().toISOString(),
    };

    setRegistrations(prev => [...prev, newReg]);

    // Update slots taken
    setRaces(prevRaces => prevRaces.map(race => {
      if (race.id === raceId) {
        return {
          ...race,
          categories: race.categories.map(cat => {
            if (cat.id === categoryId) {
              return { ...cat, slotsTaken: (cat.slotsTaken || 0) + 1 };
            }
            return cat;
          })
        };
      }
      return race;
    }));

    return newReg.id;
  };

  const updateLeaderboardTime = (entry) => {
    setLiveLeaderboard(prev => {
      const existsIndex = prev.findIndex(item => item.bib === entry.bib);
      let updated;
      if (existsIndex >= 0) {
        updated = prev.map((item, idx) => idx === existsIndex ? { ...item, ...entry } : item);
      } else {
        updated = [...prev, { ...entry, rank: prev.length + 1 }];
      }
      // Re-sort by finishTime if available
      return updated.sort((a, b) => (a.finishTime || '99:99:99').localeCompare(b.finishTime || '99:99:99')).map((item, idx) => ({ ...item, rank: idx + 1 }));
    });
  };

  const addRace = (newRaceData) => {
    const newRaceId = newRaceData.id || `race-${Date.now()}`;
    const categories = newRaceData.categories && newRaceData.categories.length > 0
      ? newRaceData.categories.map(c => ({
          ...c,
          quota: Number(c.quota) || 100,
          slotsTaken: Number(c.slotsTaken) || 0,
          price: Number(c.price) || 250000,
        }))
      : [
          {
            id: `cat-${Date.now()}-1`,
            name: '15K Short Trail',
            distance: '15 km',
            elevationGain: '+850 m',
            cot: '4 Jam',
            price: 250000,
            quota: 100,
            slotsTaken: 0,
            difficulty: 'Moderate',
            flagOff: '06:30 WIB',
            qualification: 'Terbuka untuk Umum',
            description: 'Rute pengantar trail running yang mempesona.'
          }
        ];

    const maxDistance = categories[categories.length - 1]?.distance || '30 KM';
    const maxElevation = categories[categories.length - 1]?.elevationGain || '2.200 M+';
    const cutOffTime = categories[categories.length - 1]?.cot || '10 HOURS';

    const createdRace = {
      id: newRaceId,
      title: newRaceData.title.trim(),
      tagline: newRaceData.tagline?.trim() || 'Event Lari Lintas Alam Resmi GiriTrack',
      date: newRaceData.date,
      location: newRaceData.location.trim(),
      heroBanner: newRaceData.banner || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=85',
      banner: newRaceData.banner || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      description: newRaceData.description || 'Tantang diri Anda melintasi keindahan alam dan rute savana pegunungan.',
      statsSummary: newRaceData.statsSummary || {
        maxDistance: maxDistance.toUpperCase(),
        maxElevation: maxElevation,
        cutOffTime: cutOffTime.toUpperCase(),
      },
      categories: categories,
      mandatoryGear: [
        { name: "Running Vest / Hydration Pack min 1L", icon: "vest", required: true },
        { name: "Emergency Blanket", icon: "blanket", required: true },
        { name: "Headlamp + Baterai", icon: "lamp", required: true },
        { name: "Windproof Jacket", icon: "jacket", required: true }
      ],
      schedule: [
        { time: '04:00 WIB', title: 'Open Race Village & Bag Drop', desc: 'Registrasi ulang dan penitipan tas peserta' },
        { time: '05:00 WIB', title: 'Line Up & Briefing', desc: 'Pemeriksaan perlengkapan wajib (mandatory gear check)' },
        { time: '05:30 WIB', title: 'Flag-Off Start', desc: 'Pelepasan start peserta trail running' }
      ],
      checkpoints: [
        { name: "Start / Finish Basecamp", type: "start_finish", km: "0 KM", elevation: "1.400 mdpl", lat: -7.5954, lng: 111.1578 },
        { name: "Water Station 1 (Pos 2)", type: "water_station", km: "7.5 KM", elevation: "2.100 mdpl", lat: -7.6012, lng: 111.1620 },
        { name: "Puncak Summit Checkpoint", type: "summit", km: "15 KM", elevation: "2.800 mdpl", lat: -7.6250, lng: 111.1850 }
      ],
      routeCoordinates: [
        [-7.5954, 111.1578],
        [-7.6012, 111.1620],
        [-7.6150, 111.1730],
        [-7.6250, 111.1850],
        [-7.6150, 111.1730],
        [-7.5954, 111.1578]
      ],
      participants: [],
      leaderboard: [],
      gallery: [],
      news: []
    };

    setRaces(prev => [createdRace, ...prev]);
    return createdRace;
  };

  const updateRace = (id, updatedData) => {
    setRaces(prev => prev.map(r => r.id === id ? { ...r, ...updatedData } : r));
  };

  const deleteRace = (id) => {
    setRaces(prev => prev.filter(r => r.id !== id));
  };

  const getRaceById = (id) => {
    if (id === flagshipRace.id) {
      const found = races.find(r => r.id === id);
      return { ...flagshipRace, ...found };
    }
    return races.find(r => r.id === id);
  };

  const getRegistrationById = (id) => registrations.find(r => r.id === id);

  return (
    <RaceContext.Provider value={{
      races,
      registrations,
      liveLeaderboard,
      updateLeaderboardTime,
      registerForRace,
      addRace,
      updateRace,
      deleteRace,
      getRaceById,
      getRegistrationById
    }}>
      {children}
    </RaceContext.Provider>
  );
}

export const useRace = () => useContext(RaceContext);
