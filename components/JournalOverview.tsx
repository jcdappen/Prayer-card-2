import React from 'react';
import type { JournalEntry, AnyPrayerCard } from '../types';
import { HomeIcon, TrashIcon } from './icons';

interface JournalOverviewProps {
  entries: JournalEntry[];
  allCards: AnyPrayerCard[];
  onOpenJournal: (entry: JournalEntry) => void;
  onBack: () => void;
  onDeleteEntry: (entryId: string) => void;
}

const JOURNAL_COLOR = '#9B8BBA'; // A gentle, dusty lavender

export const JournalOverview: React.FC<JournalOverviewProps> = ({ entries, allCards, onOpenJournal, onBack, onDeleteEntry }) => {

  const getCardForEntry = (entry: JournalEntry): AnyPrayerCard | undefined => {
    return allCards.find(c => c.id === entry.cardId);
  }
  
  const handleDelete = (e: React.MouseEvent, entryId: string) => {
    e.stopPropagation();
    if (window.confirm("Möchten Sie diesen Journaleintrag wirklich löschen?")) {
        onDeleteEntry(entryId);
    }
  }

  return (
    <div className="w-full animate-fade-in">
       <header className="flex justify-between items-center mb-8 sticky top-0 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-md py-4 z-20">
        <div className="w-48">
            <button onClick={onBack} aria-label="Zurück zur Startseite" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-2 rounded-full">
              <HomeIcon className="w-8 h-8" />
            </button>
        </div>
        <h2 className="text-3xl font-bold font-serif text-center px-4" style={{ color: JOURNAL_COLOR }}>Mein Journal</h2>
        <div className="w-48" />
      </header>

      {entries.length > 0 ? (
        <div className="space-y-4 max-w-4xl mx-auto">
          {entries.map(entry => {
            const card = getCardForEntry(entry);
            const cardTitle = card ? ('frontTitle' in card ? card.frontTitle : card.name) : 'Gelöschte Karte';
            
            return (
                <div
                    key={entry.id}
                    onClick={() => onOpenJournal(entry)}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-xl transition-all duration-200 flex justify-between items-center group border-l-4"
                    style={{ borderColor: JOURNAL_COLOR }}
                >
                    <div className="flex-grow overflow-hidden mr-4">
                        <p className="text-xl font-bold font-serif text-gray-800 dark:text-gray-200 truncate" title={entry.title || "Ohne Titel"}>
                            {entry.title || "Ohne Titel"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                            <span className="font-semibold">Karte:</span> {cardTitle.replace(/\n/g, ' ')}
                            <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
                            {new Date(entry.date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <button 
                        onClick={(e) => handleDelete(e, entry.id)}
                        aria-label="Eintrag löschen"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 dark:hover:text-red-400 p-2 flex-shrink-0"
                    >
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">Du hast noch keine Journaleinträge.</p>
          <p className="mt-4 text-gray-400">Öffne eine Karte und klicke auf das Buch-Symbol, um deine erste Reflexion zu schreiben.</p>
        </div>
      )}
    </div>
  );
};
