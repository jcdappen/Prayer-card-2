import React, { useState } from 'react';
import type { PrayerPlan, AnyPrayerCard, PersonCardData, PrayerCardData } from '../types';
import { PrayerCard } from './PrayerCard';
import { PersonCard } from './PersonCard';
import { CloseIcon } from './icons';
import { CATEGORIES } from '../constants';

interface PlanCardViewerProps {
  plan: PrayerPlan;
  currentDay: number;
  allCards: AnyPrayerCard[];
  onNextDay: () => void;
  onFinishPlan: () => void;
  onResetPlan: () => void;
  onClose: () => void;
}

export const PlanCardViewer: React.FC<PlanCardViewerProps> = ({ plan, currentDay, allCards, onNextDay, onFinishPlan, onResetPlan, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const totalDays = plan.cardIds.length;
  const isLastDay = currentDay >= totalDays - 1;

  const cardId = plan.cardIds[currentDay];
  const currentCard = allCards.find(c => c.id === cardId);

  if (!currentCard) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex flex-col items-center justify-center p-4 z-50 text-white">
        <p className="text-2xl mb-4">Karte für diesen Tag nicht gefunden.</p>
        <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Zurück zu den Plänen
        </button>
      </div>
    );
  }

  const cardCategoryInfo = CATEGORIES[currentCard.category];

  const renderCard = () => {
    if (currentCard.category === 'PERSONEN') {
        return <PersonCard card={currentCard as PersonCardData} category={cardCategoryInfo} isFlipped={isFlipped} onFlip={() => setIsFlipped(!isFlipped)} />
    }
    return <PrayerCard card={currentCard as PrayerCardData} category={cardCategoryInfo} isFlipped={isFlipped} onFlip={() => setIsFlipped(!isFlipped)} />
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex flex-col items-center justify-center p-4 z-50 overflow-hidden">
      <div className="absolute top-4 left-4 text-white/80 font-semibold text-lg max-w-[calc(100%-80px)] truncate">
        {plan.title}
      </div>
      <div className="absolute top-4 right-4">
        <button onClick={onClose} aria-label="Ansicht schließen" className="text-white p-2 rounded-full hover:bg-white/20 transition-colors">
          <CloseIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="w-full max-w-sm h-[600px] max-h-[75vh] aspect-[3/4.5] mx-auto">
        {renderCard()}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 w-full px-4">
        <div className="text-white font-bold text-xl">
          Tag {currentDay + 1} / {totalDays}
        </div>
        
        {isLastDay ? (
            <button
                onClick={onFinishPlan}
                className="w-full max-w-xs px-6 py-3 rounded-full bg-green-600 text-white font-bold text-lg hover:bg-green-700 transition-colors shadow-lg"
            >
                Plan abschließen
            </button>
        ) : (
            <button
                onClick={onNextDay}
                className="w-full max-w-xs px-6 py-3 rounded-full bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
                Nächster Tag
            </button>
        )}
        <button
            onClick={onResetPlan}
            className="text-white/60 hover:text-white underline text-sm"
        >
            Plan neu starten
        </button>
      </div>
    </div>
  );
};
