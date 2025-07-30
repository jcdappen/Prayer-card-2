import React, { useState, useEffect } from 'react';
import type { NotificationSettings } from '../types';
import { CloseIcon } from './icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSettings: NotificationSettings;
  onSave: (settings: NotificationSettings) => void;
}

const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, initialSettings, onSave }) => {
  const [settings, setSettings] = useState(initialSettings);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
        setPermission(Notification.permission);
    }
    setSettings(initialSettings);
  }, [initialSettings, isOpen]);

  const handleToggleDay = (dayIndex: number) => {
    const newDays = settings.days.includes(dayIndex)
      ? settings.days.filter(d => d !== dayIndex)
      : [...settings.days, dayIndex];
    setSettings(prev => ({ ...prev, days: newDays.sort() }));
  };

  const handleEnableToggle = async () => {
    if (!settings.enabled) {
      // User is trying to enable notifications
      if (permission === 'default') {
        const newPermission = await Notification.requestPermission();
        setPermission(newPermission);
        if (newPermission === 'granted') {
          setSettings(prev => ({ ...prev, enabled: true }));
        }
      } else if (permission === 'granted') {
        setSettings(prev => ({ ...prev, enabled: true }));
      }
    } else {
      setSettings(prev => ({ ...prev, enabled: false }));
    }
  };
  
  const handleSave = () => {
      onSave(settings);
  };

  if (!isOpen) return null;
  
  const isPermissionDenied = permission === 'denied';

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]" onClick={onClose} aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-8 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200" aria-label="Schließen">
          <CloseIcon className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold font-serif mb-6 text-gray-900 dark:text-gray-100">Erinnerungen</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label htmlFor="enable-notifications" className="text-lg font-semibold text-gray-800 dark:text-gray-200">Erinnerungen aktivieren</label>
            <button
              id="enable-notifications"
              role="switch"
              aria-checked={settings.enabled && !isPermissionDenied}
              onClick={handleEnableToggle}
              disabled={isPermissionDenied}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${settings.enabled && !isPermissionDenied ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.enabled && !isPermissionDenied ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {isPermissionDenied && (
             <p className="text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-md">
                Benachrichtigungen wurden in Ihrem Browser blockiert. Bitte ändern Sie die Seiteneinstellungen Ihres Browsers, um sie zu erlauben.
            </p>
          )}

          <div className={`space-y-4 transition-opacity ${settings.enabled && !isPermissionDenied ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div>
                <label htmlFor="notification-time" className="block text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Uhrzeit</label>
                <input 
                    type="time"
                    id="notification-time"
                    value={settings.time}
                    onChange={e => setSettings(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                />
            </div>
            <div>
                <span className="block text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Tage</span>
                <div className="flex justify-between gap-1 flex-wrap">
                    {dayNames.map((day, index) => (
                        <button 
                            key={index}
                            onClick={() => handleToggleDay(index)}
                            className={`px-3 py-2 text-sm font-bold rounded-lg transition-colors flex-1 min-w-[40px] ${settings.days.includes(index) ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition text-gray-800 dark:text-gray-200">
            Abbrechen
          </button>
          <button onClick={handleSave} className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50" disabled={isPermissionDenied && settings.enabled}>
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
};
