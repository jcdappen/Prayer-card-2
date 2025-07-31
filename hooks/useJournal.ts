
import { useState, useEffect, useCallback } from 'react';
import type { JournalEntry } from '../types';

const STORAGE_KEY = 'prayer_cards_journal_v1';

export const useJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedEntries: JournalEntry[] = JSON.parse(stored);
        // Sort by date descending on load
        parsedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setEntries(parsedEntries);
      }
    } catch (error) {
      console.error("Error loading journal entries from localStorage", error);
    }
  }, []);

  const saveEntries = (updatedEntries: JournalEntry[]) => {
    try {
      // Ensure entries are always sorted before saving and setting state
      updatedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
      setEntries(updatedEntries);
    } catch (error) {
      console.error("Error saving journal entries to localStorage", error);
    }
  };

  const addEntry = useCallback((cardId: string, title: string, content: string) => {
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      cardId,
      title,
      content,
      date: new Date().toISOString(),
    };
    saveEntries([...entries, newEntry]);
  }, [entries]);

  const updateEntry = useCallback((entryId: string, title: string, content: string) => {
    const updatedEntries = entries.map(entry =>
      entry.id === entryId ? { ...entry, title, content, date: new Date().toISOString() } : entry
    );
    saveEntries(updatedEntries);
  }, [entries]);

  const deleteEntry = useCallback((entryId: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== entryId);
    saveEntries(updatedEntries);
  }, [entries]);

  const getLatestEntryForCard = useCallback((cardId: string): JournalEntry | undefined => {
    // Since entries are sorted by date descending, the first one found is the latest
    return entries.find(entry => entry.cardId === cardId);
  }, [entries]);

  return { entries, addEntry, updateEntry, deleteEntry, getLatestEntryForCard };
};