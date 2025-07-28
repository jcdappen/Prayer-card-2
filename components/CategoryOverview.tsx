
import React from 'react';
import type { PrayerCardData, CategoryInfo } from '../types';
import { ArrowLeftIcon, PlusIcon } from './icons';

interface CardThumbnailProps {
  card: PrayerCardData;
  category: CategoryInfo;
  onClick: () => void;
}

const CardThumbnail: React.FC<CardThumbnailProps> = ({ card, category, onClick }) => {
  const title = card.frontTitle || "Unbenannte Karte";
  const actualCategory = card.category !== "FAVORITEN" ? category : undefined;

  return (
    <div 
      onClick={onClick} 
      className="cursor-pointer group rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105 aspect-[3/4.5] flex items-center justify-center p-1 text-center"
      style={{ backgroundColor: actualCategory?.color || '#cccccc' }}
    >
      <h4 
        className="font-serif font-bold text-sm leading-tight"
        style={{ color: actualCategory?.textColor || '#000000' }}
      >
        {title.replace(/\n/g, ' ')}
      </h4>
    </div>
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
       <header className="flex justify-between items-center mb-6 sticky top-0 bg-gray-100 dark:bg-gray-900 py-4 z-20">
        <button onClick={onBack} className="flex items-center gap-2 text-lg font-semibold hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
          <ArrowLeftIcon className="w-6 h-6" />
          <span>Alle Kategorien</span>
        </button>
        <h2 className="text-3xl font-bold font-serif text-center" style={{color: category.color}}>{category.name}</h2>
        <div className="w-48 text-right"> {/* Spacer to balance title */}
        {category.isSpecial && (
           <button onClick={onAddCard} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
             <PlusIcon className="w-5 h-5" />
             <span>Neue Karte</span>
           </button>
        )}
        </div>
      </header>

      {cards.length > 0 ? (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-10 gap-3">
          {cards.map((card, index) => (
            <CardThumbnail 
              key={card.id} 
              card={card} 
              category={category} 
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
