import { useState, useEffect, useCallback } from 'react';
import type { NotificationSettings } from '../types';

const STORAGE_KEY = 'prayer_cards_notification_settings_v1';
const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  time: '08:00',
  days: [1, 2, 3, 4, 5], // Mo-Fr default
};

function getStoredSettings(): NotificationSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Basic validation
      if (typeof parsed.enabled === 'boolean' && typeof parsed.time === 'string' && Array.isArray(parsed.days)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error reading notification settings from localStorage', error);
  }
  return DEFAULT_SETTINGS;
}

export const useNotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings>(getStoredSettings);

  const notifyServiceWorker = useCallback((newSettings: NotificationSettings) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'UPDATE_SETTINGS',
        settings: newSettings,
      });
    }
  }, []);
  
  useEffect(() => {
    const swReady = async () => {
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.ready;
            if (registration.active) {
                notifyServiceWorker(getStoredSettings());
            }
        }
    }
    swReady();
  }, [notifyServiceWorker]);


  const saveSettings = useCallback((newSettings: NotificationSettings) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
      notifyServiceWorker(newSettings);
    } catch (error) {
      console.error('Error saving notification settings to localStorage', error);
    }
  }, [notifyServiceWorker]);

  return { notificationSettings: settings, saveNotificationSettings: saveSettings };
};
