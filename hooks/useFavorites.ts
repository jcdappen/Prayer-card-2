
import { useState, useEffect, useCallback } from 'react';
import type { PrayerCardData } from '../types';

const STORAGE_KEY_FAVORITES = 'prayer_cards_favorites_v1';

export const useFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(STORAGE_KEY_FAVORITES);
      if (storedFavorites) {
        setFavoriteIds(new Set(JSON.parse(storedFavorites)));
      }
    } catch (error) {
      console.error("Fehler beim Laden der Favoriten aus dem localStorage", error);
    }
  }, []);

  const saveFavorites = (ids: Set<string>) => {
    try {
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(Array.from(ids)));
      setFavoriteIds(ids);
    } catch (error) {
      console.error("Fehler beim Speichern der Favoriten im localStorage", error);
    }
  };

  const toggleFavorite = useCallback((cardId: string) => {
    const newFavorites = new Set(favoriteIds);
    if (newFavorites.has(cardId)) {
      newFavorites.delete(cardId);
    } else {
      newFavorites.add(cardId);
    }
    saveFavorites(newFavorites);
  }, [favoriteIds]);

  const isFavorite = useCallback((cardId: string) => {
    return favoriteIds.has(cardId);
  }, [favoriteIds]);

  return { favoriteIds, toggleFavorite, isFavorite };
};
