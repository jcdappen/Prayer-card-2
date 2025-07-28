
import { useState, useEffect } from 'react';
import type { PrayerCardData } from '../types';

const STORAGE_KEY = 'prayer_cards_custom_v1';

export const useCustomCards = () => {
  const [customCards, setCustomCards] = useState<PrayerCardData[]>([]);

  useEffect(() => {
    try {
      const storedCards = localStorage.getItem(STORAGE_KEY);
      if (storedCards) {
        setCustomCards(JSON.parse(storedCards));
      }
    } catch (error) {
      console.error("Fehler beim Laden der benutzerdefinierten Karten aus dem localStorage", error);
    }
  }, []);

  const saveCards = (cards: PrayerCardData[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
      setCustomCards(cards);
    } catch (error) {
      console.error("Fehler beim Speichern der benutzerdefinierten Karten im localStorage", error);
    }
  };

  const addCard = (cardData: PrayerCardData) => {
    const newCard: PrayerCardData = {
      frontTitle: cardData.frontTitle,
      frontText: cardData.frontText,
      backTitle: cardData.backTitle,
      backTask: cardData.backTask,
      backText: cardData.backText,
      id: crypto.randomUUID(),
      isCustom: true,
      category: 'MEINE KARTEN',
    };
    saveCards([...customCards, newCard]);
  };

  const updateCard = (updatedCard: PrayerCardData) => {
    const updatedCards = customCards.map(card =>
      card.id === updatedCard.id ? updatedCard : card
    );
    saveCards(updatedCards);
  };

  const deleteCard = (cardId: string) => {
    const updatedCards = customCards.filter(card => card.id !== cardId);
    saveCards(updatedCards);
  };

  return { customCards, addCard, updateCard, deleteCard };
};
