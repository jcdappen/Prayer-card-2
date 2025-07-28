
import React from 'react';
import type { PrayerCardData, CategoryInfo } from '../types';
import { HomeIcon, PlusIcon } from './icons';
import { CATEGORIES } from '../constants';

interface CardThumbnailProps {
  card: PrayerCardData;
  onClick: () => void;
}

const CardThumbnail: React.FC<CardThumbnailProps> = ({ card, onClick }) => {
  const title = card.frontTitle || "Unbenannte Karte";
  const cardCategoryInfo = CATEGORIES[card.category];

  return (
    <button
      onClick={onClick}
      className="w-full text-center p-6 rounded-lg transition-opacity duration-200 hover:opacity-90"
      style={{
        backgroundColor: cardCategoryInfo?.color || '#cccccc',
        color: cardCategoryInfo?.textColor || '#000000'
      }}
    >
      <h4 className="font-semibold text-lg leading-tight">
        {title.replace(/\n/g, ' ')}
      </h4>
    </button>
  );
};


interface CategoryOverviewProps {
  category: CategoryInfo;
  cards: PrayerCardData[];
  onSelectCard: (index: number) => void;
  onBack: () => void;
  onAddCard: () => void;
}

export const CategoryOverview: React.FC<CategoryOverviewProps> = ({ category, cards, onSelectCard, onBack, onAddCard }) => {
  return (
    <div className="w-full animate-fade-in">
       <header className="flex justify-between items-center mb-8 sticky top-0 bg-gray-100 dark:bg-gray-900 py-4 z-20">
        <div className="w-48">
            <button onClick={onBack} aria-label="Zurück zur Startseite" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-2 rounded-full">
              <HomeIcon className="w-8 h-8" />
            </button>
        </div>
        <h2 className="text-3xl font-bold font-serif text-center px-4" style={{color: category.color}}>{category.name}</h2>
        <div className="w-48 text-right"> {/* Spacer to balance title */}
        {category.isSpecial && category.name !== 'FAVORITEN' && (
           <button onClick={onAddCard} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
             <PlusIcon className="w-5 h-5" />
             <span>Neue Karte</span>
           </button>
        )}
        </div>
      </header>

      {cards.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          {cards.map((card, index) => (
            <CardThumbnail 
              key={card.id} 
              card={card} 
              onClick={() => onSelectCard(index)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">Diese Kategorie hat noch keine Karten.</p>
          {category.isSpecial ? (
             <button onClick={onAddCard} className="mt-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition mx-auto">
                <PlusIcon className="w-5 h-5" />
                <span>Erste Karte erstellen</span>
            </button>
          ) : category.name === 'FAVORITEN' && (
            <p className="mt-4 text-gray-400">Markieren Sie Karten mit einem Stern, um sie hier anzuzeigen.</p>
          )}
        </div>
      )}
    </div>
  );
};
