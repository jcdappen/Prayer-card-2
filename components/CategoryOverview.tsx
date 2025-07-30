
import React from 'react';
import type { AnyPrayerCard, PrayerCardData, PersonCardData, CategoryInfo } from '../types';
import { HomeIcon, PlusIcon, UserIcon } from './icons';
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
      className="w-full text-center p-6 rounded-lg transition-transform transform hover:scale-105 duration-200"
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

interface PersonCardThumbnailProps {
  card: PersonCardData;
  onClick: () => void;
}

const PersonCardThumbnail: React.FC<PersonCardThumbnailProps> = ({ card, onClick }) => {
  const cardCategoryInfo = CATEGORIES[card.category];

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-lg flex items-center gap-4 transition-transform transform hover:scale-105 duration-200"
      style={{
        backgroundColor: cardCategoryInfo?.color || '#cccccc',
        color: cardCategoryInfo?.textColor || '#000000'
      }}
    >
        <div className="w-16 h-16 rounded-full overflow-hidden bg-white/30 flex items-center justify-center flex-shrink-0">
            {card.imageUrl ? (
                <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
            ) : (
                <UserIcon className="w-10 h-10 text-white/70" />
            )}
        </div>
        <h4 className="font-semibold text-xl leading-tight">
            {card.name}
        </h4>
    </button>
  );
};


interface CategoryOverviewProps {
  category: CategoryInfo;
  cards: AnyPrayerCard[];
  onSelectCard: (index: number) => void;
  onBack: () => void;
  onAddCard: (categoryName: string) => void;
}

export const CategoryOverview: React.FC<CategoryOverviewProps> = ({ category, cards, onSelectCard, onBack, onAddCard }) => {
  const isPersonCategory = category.name === 'PERSONEN';

  return (
    <div className="w-full animate-fade-in">
       <header className="flex justify-between items-center mb-8 sticky top-0 bg-gray-100 dark:bg-gray-900 py-4 z-20">
        <div className="w-48">
            <button onClick={onBack} aria-label="Zurück zur Startseite" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-2 rounded-full">
              <HomeIcon className="w-8 h-8" />
            </button>
        </div>
        <h2 className="text-3xl font-bold font-serif text-center px-4" style={{color: category.color}}>{category.name}</h2>
        <div className="w-48 flex justify-end">
        {category.isSpecial && category.name !== 'FAVORITEN' && (
           <button onClick={() => onAddCard(category.name)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
             <PlusIcon className="w-5 h-5" />
             <span>Neu</span>
           </button>
        )}
        </div>
      </header>

      {cards.length > 0 ? (
        <div className={`grid gap-4 max-w-2xl mx-auto ${isPersonCategory ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {cards.map((card, index) => (
            isPersonCategory ? (
                <PersonCardThumbnail 
                    key={card.id} 
                    card={card as PersonCardData} 
                    onClick={() => onSelectCard(index)}
                />
            ) : (
                <CardThumbnail 
                    key={card.id} 
                    card={card as PrayerCardData} 
                    onClick={() => onSelectCard(index)}
                />
            )
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">Diese Kategorie hat noch keine Karten.</p>
          {category.isSpecial && category.name !== 'FAVORITEN' ? (
             <button onClick={() => onAddCard(category.name)} className="mt-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition mx-auto">
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