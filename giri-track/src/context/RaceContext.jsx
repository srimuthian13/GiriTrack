/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from 'react';
import { initialRaces } from '../data/initialData';
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
      getRaceById,
      getRegistrationById
    }}>
      {children}
    </RaceContext.Provider>
  );
}

export const useRace = () => useContext(RaceContext);
