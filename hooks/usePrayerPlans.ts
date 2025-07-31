import { useState, useEffect, useCallback } from 'react';
import type { PrayerPlanProgress } from '../types';

const STORAGE_KEY = 'prayer_cards_plans_progress_v1';

export const usePrayerPlans = () => {
  const [progress, setProgress] = useState<PrayerPlanProgress>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading prayer plan progress from localStorage", error);
    }
  }, []);

  const saveProgress = (newProgress: PrayerPlanProgress) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      setProgress(newProgress);
    } catch (error) {
      console.error("Error saving prayer plan progress to localStorage", error);
    }
  };

  const updatePlanProgress = useCallback((planId: string, dayIndex: number) => {
    const newProgress = { ...progress };
    newProgress[planId] = { currentDay: dayIndex };
    saveProgress(newProgress);
  }, [progress]);
  
  const resetPlan = useCallback((planId: string) => {
    const newProgress = { ...progress };
    delete newProgress[planId];
    saveProgress(newProgress);
  }, [progress]);

  return { progress, updatePlanProgress, resetPlan };
};
