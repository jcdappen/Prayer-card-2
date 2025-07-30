
import { useState, useEffect } from 'react';
import type { PersonCardData } from '../types';

const STORAGE_KEY = 'prayer_cards_people_v1';

export const usePersonCards = () => {
  const [personCards, setPersonCards] = useState<PersonCardData[]>([]);

  useEffect(() => {
    try {
      const storedCards = localStorage.getItem(STORAGE_KEY);
      if (storedCards) {
        setPersonCards(JSON.parse(storedCards));
      }
    } catch (error) {
      console.error("Fehler beim Laden der Personenkarten aus dem localStorage", error);
    }
  }, []);

  const saveCards = (cards: PersonCardData[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
      setPersonCards(cards);
    } catch (error) {
      console.error("Fehler beim Speichern der Personenkarten im localStorage", error);
    }
  };

  const addPersonCard = (cardData: Omit<PersonCardData, 'id' | 'category'>) => {
    const newCard: PersonCardData = {
      ...cardData,
      id: crypto.randomUUID(),
      category: 'PERSONEN',
    };
    saveCards([...personCards, newCard]);
  };

  const updatePersonCard = (updatedCard: PersonCardData) => {
    const updatedCards = personCards.map(card =>
      card.id === updatedCard.id ? updatedCard : card
    );
    saveCards(updatedCards);
  };

  const deletePersonCard = (cardId: string) => {
    const updatedCards = personCards.filter(card => card.id !== cardId);
    saveCards(updatedCards);
  };

  return { personCards, addPersonCard, updatePersonCard, deletePersonCard };
};