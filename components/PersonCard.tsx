
import React from 'react';
import type { PersonCardData, CategoryInfo } from '../types';
import { UserIcon } from './icons';

interface PersonCardFrontProps {
    card: PersonCardData;
    category: CategoryInfo;
}

const PersonCardFront: React.FC<PersonCardFrontProps> = ({ card, category }) => {
    return (
        <div className="w-full h-full flex flex-col" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="flex-grow flex flex-col items-center justify-start p-6 text-gray-800 space-y-4">
                <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shadow-lg border-4 border-white">
                    {card.imageUrl ? (
                        <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                    ) : (
                        <UserIcon className="w-28 h-28 text-gray-400" />
                    )}
                </div>
                <h3 className="text-3xl font-bold font-serif text-center mt-4">{card.name}</h3>
                <div className="w-full text-center p-4 bg-white rounded-lg shadow-inner">
                    <h4 className="font-semibold text-gray-500 mb-2">Dankbar für:</h4>
                    <p className="whitespace-pre-line text-lg italic">{card.thankfulFor || "..."}</p>
                </div>
            </div>
             <div style={{ backgroundColor: category.color, color: category.textColor }} className="py-2 px-4 text-center text-xs font-bold">
                {category.name}
            </div>
        </div>
    );
};


interface PersonCardBackProps {
    card: PersonCardData;
    category: CategoryInfo;
}

const PersonCardBack: React.FC<PersonCardBackProps> = ({ card, category }) => {
    return (
        <div className="w-full h-full flex flex-col" style={{ backgroundColor: '#F9FAFB' }}>
            <div style={{ backgroundColor: category.color, color: category.textColor }} className="py-3 px-4 text-center font-bold text-lg tracking-wider font-serif">
                {card.name}
            </div>
            <div className="flex-grow flex flex-col justify-start p-6 text-gray-800 overflow-y-auto">
                 <h4 className="text-xl font-bold italic text-gray-700 mb-4 text-center">Gebetspunkte</h4>
                 <p className="whitespace-pre-line text-lg leading-relaxed">{card.prayerPoints || "..."}</p>
            </div>
            <div style={{ backgroundColor: category.color, color: category.textColor }} className="py-2 px-4 text-center text-xs font-bold">
                {category.name}
            </div>
        </div>
    );
};


interface PersonCardProps {
  card: PersonCardData;
  category: CategoryInfo;
  isFlipped: boolean;
  onFlip: () => void;
}

export const PersonCard: React.FC<PersonCardProps> = ({ card, category, isFlipped, onFlip }) => {
  const handleCardClick = () => {
    onFlip();
  }

  return (
    <div className="w-full h-full [perspective:1000px] cursor-pointer" onClick={handleCardClick}>
      <div
        className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d]"
        style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Front Face */}
        <div className="absolute inset-0 [backface-visibility:hidden] shadow-2xl rounded-2xl overflow-hidden">
            <PersonCardFront card={card} category={category} />
        </div>
        
        {/* Back Face */}
        <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-2xl rounded-2xl overflow-hidden">
            <PersonCardBack card={card} category={category} />
        </div>
      </div>
    </div>
  );
};
