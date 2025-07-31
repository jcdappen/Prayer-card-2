import React, { useState, useEffect } from 'react';
import { CloseIcon } from './icons';
import type { AnyPrayerCard } from '../types';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, content: string) => void;
  card: AnyPrayerCard;
  initialTitle: string;
  initialContent: string;
  onGoToCard?: () => void;
  showGoToCardLink?: boolean;
}

export const JournalModal: React.FC<JournalModalProps> = ({ isOpen, onClose, onSave, card, initialTitle, initialContent, onGoToCard, showGoToCardLink }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      setContent(initialContent);
    }
  }, [initialTitle, initialContent, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(title, content);
    onClose();
  };

  const cardTitle = 'frontTitle' in card ? card.frontTitle : card.name;
  
  const cardTitleElement = showGoToCardLink && onGoToCard ? (
    <button onClick={onGoToCard} className="font-semibold underline hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-left">
        {cardTitle.replace(/\n/g, ' ')}
    </button>
  ) : (
    <span className="font-semibold">{cardTitle.replace(/\n/g, ' ')}</span>
  );


  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-[70]" onClick={onClose} aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative flex flex-col" style={{maxHeight: '90vh'}} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200" aria-label="Schließen">
          <CloseIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold font-serif mb-2 text-gray-900 dark:text-gray-100">Journal-Eintrag</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Karte: {cardTitleElement}</p>
        
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Gib deiner Reflexion einen Titel..."
          className="w-full p-3 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition mb-4"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Schreibe deine Gedanken, Gebete oder das, was dich bewegt hat..."
          className="w-full flex-grow p-3 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition resize-none"
          rows={15}
        />

        <div className="mt-6 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition text-gray-800 dark:text-gray-200">
            Abbrechen
          </button>
          <button onClick={handleSave} className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
};