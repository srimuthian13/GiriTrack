/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { initialTrails, initialEvents, initialHistory } from '../data/initialData';

const TrailContext = createContext();

export const TrailProvider = ({ children }) => {
  // State 1: Daftar Jalur Pendakian (CRUD + Comments)
  const [trails, setTrails] = useState(() => {
    const savedTrails = localStorage.getItem('giri_trails');
    if (savedTrails) {
      const parsed = JSON.parse(savedTrails);
      return parsed.map((tr) => ({
        ...tr,
        comments: Array.isArray(tr.comments) ? tr.comments : [],
        likes_count: Number(tr.likes_count) || 0,
      }));
    }
    return initialTrails;
  });

  // State 2: Favorites / Disukai (Bookmark IDs)
  const [favorites, setFavorites] = useState(() => {
    const savedFavs = localStorage.getItem('giritrack_favorites');
    return savedFavs ? JSON.parse(savedFavs) : ['trail-1', 'trail-2'];
  });

  // State 3: Daftar Event Tektok
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('giri_events');
    return savedEvents ? JSON.parse(savedEvents) : initialEvents;
  });

  // State 4: Riwayat Log GPS Tracking
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('giri_history');
    return savedHistory ? JSON.parse(savedHistory) : initialHistory;
  });

  // Persist State ke LocalStorage
  useEffect(() => {
    localStorage.setItem('giri_trails', JSON.stringify(trails));
  }, [trails]);

  useEffect(() => {
    localStorage.setItem('giritrack_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('giri_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('giri_history', JSON.stringify(history));
  }, [history]);

  // ==========================================
  // 1. FAVORITE / LIKE TOGGLE ACTIONS
  // ==========================================

  /**
   * Check whether a trail is favorited
   */
  const isFavorite = (trailId) => {
    return favorites.includes(String(trailId));
  };

  /**
   * Toggle favorite status of a trail
   */
  const toggleFavorite = (trailId) => {
    const targetIdStr = String(trailId);

    setFavorites((prevFavs) => {
      const isAlreadyFav = prevFavs.includes(targetIdStr);
      let updatedFavs;

      if (isAlreadyFav) {
        updatedFavs = prevFavs.filter((id) => id !== targetIdStr);
      } else {
        updatedFavs = [...prevFavs, targetIdStr];
      }

      // Also adjust likes_count on trail
      setTrails((prevTrails) =>
        prevTrails.map((tr) => {
          if (String(tr.id) === targetIdStr) {
            const currentLikes = Number(tr.likes_count) || 0;
            return {
              ...tr,
              likes_count: isAlreadyFav ? Math.max(0, currentLikes - 1) : currentLikes + 1,
            };
          }
          return tr;
        })
      );

      return updatedFavs;
    });
  };

  // ==========================================
  // 2. CRUD JALUR PENDAKIAN (TRAILS)
  // ==========================================

  const addTrail = (newTrailData) => {
    const createdTrail = {
      ...newTrailData,
      id: `trail-${Date.now()}`,
      distance_km: Number(newTrailData.distance_km) || 0,
      elevation_m: Number(newTrailData.elevation_m) || 0,
      likes_count: 0,
      coordinates: Array.isArray(newTrailData.coordinates)
        ? newTrailData.coordinates
        : [[-6.7912, 106.9825]],
      comments: [],
    };
    setTrails((prevTrails) => [createdTrail, ...prevTrails]);
    return createdTrail;
  };

  const getTrailById = (id) => {
    return trails.find((t) => String(t.id) === String(id)) || null;
  };

  const updateTrail = (id, updatedData) => {
    setTrails((prevTrails) =>
      prevTrails.map((trail) =>
        String(trail.id) === String(id)
          ? {
              ...trail,
              ...updatedData,
              distance_km: Number(updatedData.distance_km) || trail.distance_km,
              elevation_m: Number(updatedData.elevation_m) || trail.elevation_m,
            }
          : trail
      )
    );
  };

  const deleteTrail = (id) => {
    const targetIdStr = String(id);
    setTrails((prevTrails) => prevTrails.filter((t) => String(t.id) !== targetIdStr));
    setFavorites((prevFavs) => prevFavs.filter((favId) => favId !== targetIdStr));
  };

  const resetTrails = () => {
    setTrails(initialTrails);
    setFavorites(['trail-1', 'trail-2']);
  };

  // ==========================================
  // 3. FITUR KOMENTAR & ULASAN JALUR
  // ==========================================

  const addComment = (trailId, commentData) => {
    if (!trailId || !commentData.text) return;

    const newCommentObj = {
      id: `c-${Date.now()}`,
      user: commentData.user.trim() || 'Pendaki Anonim',
      text: commentData.text.trim(),
      date: new Date().toISOString().split('T')[0],
    };

    setTrails((prevTrails) =>
      prevTrails.map((tr) => {
        if (String(tr.id) === String(trailId)) {
          const currentComments = Array.isArray(tr.comments) ? tr.comments : [];
          return {
            ...tr,
            comments: [newCommentObj, ...currentComments],
          };
        }
        return tr;
      })
    );

    return newCommentObj;
  };

  // ==========================================
  // 4. TEKTOK EVENT ACTIONS
  // ==========================================

  const joinEvent = (eventId) => {
    setEvents((prevEvents) =>
      prevEvents.map((evt) => {
        if (String(evt.id) === String(eventId)) {
          if (evt.is_joined) return evt;
          if (evt.current_participants >= evt.max_quota) return evt;
          return {
            ...evt,
            current_participants: evt.current_participants + 1,
            is_joined: true,
          };
        }
        return evt;
      })
    );
  };

  const leaveEvent = (eventId) => {
    setEvents((prevEvents) =>
      prevEvents.map((evt) => {
        if (String(evt.id) === String(eventId)) {
          if (!evt.is_joined) return evt;
          return {
            ...evt,
            current_participants: Math.max(0, evt.current_participants - 1),
            is_joined: false,
          };
        }
        return evt;
      })
    );
  };

  const addEvent = (newEventData) => {
    const createdEvent = {
      ...newEventData,
      id: `event-${Date.now()}`,
      current_participants: 1,
      is_joined: true,
      max_quota: Number(newEventData.max_quota) || 10,
    };
    setEvents((prevEvents) => [createdEvent, ...prevEvents]);
    return createdEvent;
  };

  // ==========================================
  // 5. RIWAYAT GPS TRACKER ACTIONS
  // ==========================================

  const addHistoryRecord = (recordData) => {
    const newRecord = {
      ...recordData,
      id: `hist-${Date.now()}`,
      date: new Date().toISOString(),
      photos: Array.isArray(recordData.photos) ? recordData.photos : [],
    };
    setHistory((prevHistory) => [newRecord, ...prevHistory]);
    return newRecord;
  };

  const updateHistoryRecord = (id, updatedData) => {
    setHistory((prevHistory) =>
      prevHistory.map((item) =>
        String(item.id) === String(id) ? { ...item, ...updatedData } : item
      )
    );
  };

  const addHistoryPhoto = (historyId, photoBase64) => {
    setHistory((prevHistory) =>
      prevHistory.map((item) => {
        if (String(item.id) === String(historyId)) {
          const currentPhotos = Array.isArray(item.photos) ? item.photos : [];
          return {
            ...item,
            photos: [...currentPhotos, photoBase64],
          };
        }
        return item;
      })
    );
  };

  const deleteHistoryPhoto = (historyId, photoIndex) => {
    setHistory((prevHistory) =>
      prevHistory.map((item) => {
        if (String(item.id) === String(historyId)) {
          const currentPhotos = Array.isArray(item.photos) ? item.photos : [];
          return {
            ...item,
            photos: currentPhotos.filter((_, idx) => idx !== photoIndex),
          };
        }
        return item;
      })
    );
  };

  const deleteHistoryRecord = (id) => {
    setHistory((prevHistory) => prevHistory.filter((item) => String(item.id) !== String(id)));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  // ==========================================
  // 6. ES6 REST PARAMETER FUNCTION
  // ==========================================
  const calculateTotalSummary = (...hikeRecords) => {
    const flatRecords = hikeRecords.flat(Infinity).filter(Boolean);

    if (flatRecords.length === 0) {
      return {
        totalHikesCount: 0,
        totalDistanceKm: 0,
        totalDurationSeconds: 0,
        avgSpeedKmh: 0,
        highestElevationM: 0,
      };
    }

    const totalHikesCount = flatRecords.length;

    const totalDistanceKm = flatRecords.reduce((acc, curr) => {
      const dist = Number(curr.distance_km) || Number(curr.distance) || 0;
      return acc + dist;
    }, 0);

    const totalDurationSeconds = flatRecords.reduce((acc, curr) => {
      const dur = Number(curr.duration_seconds) || Number(curr.duration) || 0;
      return acc + dur;
    }, 0);

    const totalHours = totalDurationSeconds / 3600;
    const avgSpeedKmh = totalHours > 0 ? totalDistanceKm / totalHours : 0;

    const highestElevationM = flatRecords.reduce((max, curr) => {
      const elev = Number(curr.elevation_m) || Number(curr.elevation) || 0;
      return elev > max ? elev : max;
    }, 0);

    return {
      totalHikesCount,
      totalDistanceKm: Number(totalDistanceKm.toFixed(2)),
      totalDurationSeconds,
      avgSpeedKmh: Number(avgSpeedKmh.toFixed(2)),
      highestElevationM,
    };
  };

  return (
    <TrailContext.Provider
      value={{
        trails,
        addTrail,
        getTrailById,
        updateTrail,
        deleteTrail,
        resetTrails,
        addComment,

        // Favorites / Love System
        favorites,
        toggleFavorite,
        isFavorite,

        events,
        joinEvent,
        leaveEvent,
        addEvent,

        history,
        addHistoryRecord,
        updateHistoryRecord,
        addHistoryPhoto,
        deleteHistoryPhoto,
        deleteHistoryRecord,
        clearHistory,

        calculateTotalSummary,
      }}
    >
      {children}
    </TrailContext.Provider>
  );
};

export const useTrail = () => {
  const context = useContext(TrailContext);
  if (!context) {
    throw new Error('useTrail must be used within a TrailProvider');
  }
  return context;
};
