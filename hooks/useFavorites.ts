
import { useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import type { Database } from '../lib/database.types';

type UserFavoritesInsert = Database['public']['Tables']['user_favorites']['Insert'];


export const useFavorites = (session: Session | null) => {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!session?.user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('card_id')
        .eq('user_id', session.user.id);

      if (error) throw error;
      
      setFavoriteIds(new Set(data.map(fav => fav.card_id)));
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchFavorites();
    } else {
      setFavoriteIds(new Set()); // Clear on logout
    }
  }, [session, fetchFavorites]);

  const toggleFavorite = useCallback(async (cardId: string) => {
    if (!session?.user) {
        console.error("User must be logged in to manage favorites.");
        return;
    }

    const isCurrentlyFavorite = favoriteIds.has(cardId);
    const newFavorites = new Set(favoriteIds);

    // Optimistic update
    if (isCurrentlyFavorite) {
        newFavorites.delete(cardId);
    } else {
        newFavorites.add(cardId);
    }
    setFavoriteIds(newFavorites);

    try {
      if (isCurrentlyFavorite) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .match({ user_id: session.user.id, card_id: cardId });
        
        if (error) throw error;

      } else {
        const favoriteToInsert: UserFavoritesInsert = { user_id: session.user.id, card_id: cardId };
        const { error } = await supabase
          .from('user_favorites')
          .insert(favoriteToInsert);

        if (error) throw error;
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Revert state on error
      const revertedFavorites = new Set(favoriteIds);
      if(isCurrentlyFavorite) {
        revertedFavorites.add(cardId);
      } else {
        revertedFavorites.delete(cardId);
      }
      setFavoriteIds(revertedFavorites);
    }
  }, [favoriteIds, session]);
  
  const isFavorite = useCallback((cardId: string) => {
    return favoriteIds.has(cardId);
  }, [favoriteIds]);

  return { favoriteIds, toggleFavorite, isFavorite, loading, fetchFavorites };
};