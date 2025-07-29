
import { useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { PrayerCardData } from '../types';
import { supabase } from '../lib/supabaseClient';
import type { Database } from '../lib/database.types';

type CardsInsert = Database['public']['Tables']['cards']['Insert'];
type CardsUpdate = Database['public']['Tables']['cards']['Update'];

export const useCustomCards = (session: Session | null) => {
  const [customCards, setCustomCards] = useState<PrayerCardData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCards = useCallback(async () => {
    if (!session?.user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) {
        throw error;
      }

      const formattedCards: PrayerCardData[] = data.map((card: any) => ({
        id: card.id,
        frontTitle: card.front_title,
        frontText: card.front_text,
        backTitle: card.back_title,
        backTask: card.back_task,
        backText: card.back_text,
        category: card.category,
        isCustom: true,
      }));
      setCustomCards(formattedCards);
    } catch (error) {
      console.error("Error fetching custom cards:", error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchCards();
    } else {
      setCustomCards([]); // Clear cards on logout
    }
  }, [session, fetchCards]);

  const addCard = async (cardData: PrayerCardData) => {
    if (!session?.user) throw new Error("User must be logged in to add a card.");
    
    setLoading(true);
    const cardToInsert: CardsInsert = {
      user_id: session.user.id,
      front_title: cardData.frontTitle,
      front_text: cardData.frontText,
      back_title: cardData.backTitle,
      back_task: cardData.backTask,
      back_text: cardData.backText,
      category: 'MEINE KARTEN',
    };

    try {
        const { data, error } = await supabase
            .from('cards')
            .insert(cardToInsert)
            .select()
            .single();
        
        if (error) throw error;

        const newCard: PrayerCardData = {
            id: data.id,
            frontTitle: data.front_title,
            frontText: data.front_text,
            backTitle: data.back_title,
            backTask: data.back_task,
            backText: data.back_text,
            category: data.category,
            isCustom: true,
        };
        
        setCustomCards(prev => [...prev, newCard]);
        return newCard;
    } catch (error) {
        console.error("Error adding card:", error);
    } finally {
        setLoading(false);
    }
  };

  const updateCard = async (updatedCard: PrayerCardData) => {
    if (!session?.user) throw new Error("User must be logged in to update a card.");

    setLoading(true);
    const cardToUpdate: CardsUpdate = {
      front_title: updatedCard.frontTitle,
      front_text: updatedCard.frontText,
      back_title: updatedCard.backTitle,
      back_task: updatedCard.backTask,
      back_text: updatedCard.backText,
    };

    try {
        const { error } = await supabase
            .from('cards')
            .update(cardToUpdate)
            .eq('id', updatedCard.id)
            .eq('user_id', session.user.id);

        if (error) throw error;
        
        setCustomCards(prev => prev.map(card => card.id === updatedCard.id ? updatedCard : card));
    } catch(error) {
        console.error("Error updating card:", error);
    } finally {
        setLoading(false);
    }
  };

  const deleteCard = async (cardId: string) => {
    if (!session?.user) throw new Error("User must be logged in to delete a card.");

    setLoading(true);
    try {
        const { error } = await supabase
            .from('cards')
            .delete()
            .eq('id', cardId)
            .eq('user_id', session.user.id);
            
        if (error) throw error;

        setCustomCards(prev => prev.filter(card => card.id !== cardId));
    } catch(error) {
        console.error("Error deleting card:", error);
    } finally {
        setLoading(false);
    }
  };

  return { customCards, addCard, updateCard, deleteCard, loading };
};