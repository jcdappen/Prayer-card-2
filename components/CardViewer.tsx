import React, { useState, useEffect, useMemo } from 'react';
import type { CategoryInfo, AnyPrayerCard, PrayerCardData, PersonCardData } from '../types';
import { PrayerCard } from './PrayerCard';
import { PersonCard } from './PersonCard';
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon, FlipIcon, EditIcon, TrashIcon, StarIconOutline, StarIconFilled } from './icons';
import { CATEGORIES } from '../constants';


interface CardViewerProps {
  category: CategoryInfo;
  allCards: AnyPrayerCard[];
  initialIndex: number;
  onBack: () => void;
  onEdit: (card: AnyPrayerCard) => void;
  onDelete: (cardId: string, categoryName: string) => void;
  isFavorite: (cardId: string) => boolean;
  onToggleFavorite: (cardId: string) => void;
}

export const CardViewer: React.FC<CardViewerProps> = ({ category, allCards, initialIndex, onBack, onEdit, onDelete, isFavorite, onToggleFavorite }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFlipped, setIsFlipped] = useState(false);

  // Swipe state
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const categoryCards = useMemo(() => {
    if (category.name === 'FAVORITEN') {
        return allCards.filter(card => isFavorite(card.id));
    }
    return allCards.filter(card => card.category === category.name);
  }, [category.name, allCards, isFavorite]);

  useEffect(() => {
    // If the category changes or the initial card is out of bounds, reset.
    if (initialIndex >= categoryCards.length) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(initialIndex);
    }
    setIsFlipped(false);
  }, [initialIndex, category.name, categoryCards.length]);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % categoryCards.length);
    setIsFlipped(false);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + categoryCards.length) % categoryCards.length);
    setIsFlipped(false);
  };

  const handleDelete = () => {
    const cardToDelete = categoryCards[currentIndex];
    if (window.confirm("Möchten Sie diese Karte wirklich löschen?")) {
        onDelete(cardToDelete.id, cardToDelete.category);
    }
  }

  // Swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) {
        setTouchStartX(null);
        return;
    }
    setTouchStartX(e.touches[0].clientX);
    setTouchDeltaX(0); 
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || e.touches.length !== 1) return;
    
    const currentX = e.touches[0].clientX;
    const delta = currentX - touchStartX;

    if (Math.abs(delta) > 10) {
      e.preventDefault();
    }
    
    setTouchDeltaX(delta);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null) return;

    const swipeThreshold = 50; 

    if (Math.abs(touchDeltaX) > swipeThreshold) {
        if (touchDeltaX < 0) {
            handleNext();
        } else {
            handlePrev();
        }
    }

    setIsSwiping(false);
    setTouchStartX(null);
    setTouchDeltaX(0);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        handleNext();
      } else if (event.key === 'ArrowLeft') {
        handlePrev();
      } else if (event.key === ' ' || event.key === 'f') {
        event.preventDefault();
        setIsFlipped(f => !f);
      } else if (event.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [categoryCards.length]);

  if (categoryCards.length === 0) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <p className="text-2xl mb-4">Keine Karten in dieser Kategorie gefunden.</p>
        <button onClick={onBack} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Zurück zu den Kategorien
        </button>
      </div>
    );
  }

  const currentCard = categoryCards[currentIndex];
  const isCurrentCardFavorite = isFavorite(currentCard.id);
  const cardCategoryInfo = CATEGORIES[currentCard.category] || category;
  
  // A card is editable if it's a person card or a custom prayer card
  const isEditable = currentCard.category === 'PERSONEN' || (currentCard as PrayerCardData).isCustom;

  const separatorClass = cardCategoryInfo.textColor === '#FFFFFF' ? 'bg-white/30' : 'bg-black/20';
  const hoverBgClass = cardCategoryInfo.textColor === '#FFFFFF' ? 'hover:bg-black/20' : 'hover:bg-white/30';

  const renderCard = () => {
    if (currentCard.category === 'PERSONEN') {
        return <PersonCard card={currentCard as PersonCardData} category={cardCategoryInfo} isFlipped={isFlipped} onFlip={() => setIsFlipped(!isFlipped)} />
    }
    return <PrayerCard card={currentCard as PrayerCardData} category={cardCategoryInfo} isFlipped={isFlipped} onFlip={() => setIsFlipped(!isFlipped)} />
  }

  return (
    // Main container with glassmorphism background
    <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center p-4 z-50 overflow-hidden">
      
      {/* Glassmorphic navigation buttons */}
      <button 
        onClick={handlePrev} 
        aria-label="Vorherige Karte" 
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-50 bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2 hidden sm:block transition-colors"
      >
        <ArrowLeftIcon className="w-6 h-6" />
      </button>
      
      <div 
        className="w-full max-w-sm h-[600px] max-h-[80vh] aspect-[3/4.5] mx-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
            className="w-full h-full relative"
            style={{ 
              transform: `translateX(${touchDeltaX}px)`, 
              transition: isSwiping ? 'none' : 'transform 0.3s ease-out' 
            }}
          >
          {renderCard()}
        </div>
      </div>

      <button 
        onClick={handleNext} 
        aria-label="Nächste Karte" 
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-50 bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2 hidden sm:block transition-colors"
      >
        <ArrowRightIcon className="w-6 h-6" />
      </button>
      
      {/* Glassmorphic control bar */}
      <div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center flex-nowrap px-2 py-1 rounded-full gap-1.5 transition-colors duration-300 backdrop-blur-md border border-white/20"
        style={{
          // Use hex color with appended opacity for a semi-transparent effect
          backgroundColor: cardCategoryInfo.color + 'BF', // 'BF' is ~75% opacity in hex
          color: cardCategoryInfo.textColor,
        }}
      >
        {/* Navigation */}
        <button onClick={handlePrev} aria-label="Vorherige Karte" className={`p-1 rounded-full ${hoverBgClass} transition-colors`}>
            <ArrowLeftIcon className="w-4 h-4" />
        </button>

        <span className="tabular-nums font-semibold text-xs select-none opacity-90 whitespace-nowrap">
            {currentIndex + 1} / {categoryCards.length}
        </span>

        <button onClick={handleNext} aria-label="Nächste Karte" className={`p-1 rounded-full ${hoverBgClass} transition-colors`}>
            <ArrowRightIcon className="w-4 h-4" />
        </button>

        {/* Separator */}
        <div className={`w-px h-4 ${separatorClass}`}></div>

        {/* Flip Button */}
        <button onClick={() => setIsFlipped(!isFlipped)} className={`p-1 rounded-full ${hoverBgClass} transition-colors`} aria-label="Karte umdrehen">
            <FlipIcon className="w-4 h-4" />
        </button>
        
        {/* Separator */}
        <div className={`w-px h-4 ${separatorClass}`}></div>

        {/* Favorite Action */}
        <button onClick={() => onToggleFavorite(currentCard.id)} className={`${isCurrentCardFavorite ? "text-yellow-400" : ""} p-1 rounded-full ${hoverBgClass} transition-colors`} aria-label="Als Favorit markieren">
            {isCurrentCardFavorite ? <StarIconFilled className="w-4 h-4" /> : <StarIconOutline className="w-4 h-4" />}
        </button>
        
        {/* Editable Actions */}
        {isEditable && (
            <>
                <div className={`w-px h-4 ${separatorClass}`}></div>
                <button onClick={() => onEdit(currentCard)} className={`p-1 rounded-full ${hoverBgClass} transition-colors`} aria-label="Karte bearbeiten">
                    <EditIcon className="w-4 h-4" />
                </button>
                <button onClick={handleDelete} className={`p-1 rounded-full ${hoverBgClass} transition-colors`} aria-label="Karte löschen">
                    <TrashIcon className="w-4 h-4" />
                </button>
            </>
        )}

        {/* Close Action */}
        <div className={`w-px h-4 ${separatorClass}`}></div>
        <button onClick={onBack} aria-label="Ansicht schließen" className={`p-1 rounded-full ${hoverBgClass} transition-colors`}>
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
