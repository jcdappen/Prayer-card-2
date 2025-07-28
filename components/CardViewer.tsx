
import React, { useState, useEffect, useMemo } from 'react';
import type { CategoryInfo, PrayerCardData } from '../types';
import { PrayerCard } from './PrayerCard';
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon, FlipIcon, EditIcon, TrashIcon, StarIconOutline, StarIconFilled } from './icons';

interface CardViewerProps {
  category: CategoryInfo;
  allCards: PrayerCardData[];
  initialIndex: number;
  onBack: () => void;
  onEdit: (card: PrayerCardData) => void;
  onDelete: (cardId: string) => void;
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
    setCurrentIndex(initialIndex);
    setIsFlipped(false);
  }, [initialIndex, category.name]);

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
        onDelete(cardToDelete.id);
    }
  }

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 1) {
        setTouchStartX(null);
        return;
    }
    setTouchStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || e.touches.length > 1) return;
    
    const currentX = e.touches[0].clientX;
    const delta = currentX - touchStartX;

    // Prevent click on swipe
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

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-hidden">
      <button onClick={onBack} aria-label="Zurück" className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 bg-black/30 rounded-full p-2">
        <CloseIcon className="w-8 h-8" />
      </button>

      <button onClick={handlePrev} aria-label="Vorherige Karte" className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-50 bg-black/30 rounded-full p-2">
        <ArrowLeftIcon className="w-8 h-8" />
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
          <PrayerCard card={currentCard} category={category} isFlipped={isFlipped} onFlip={() => setIsFlipped(!isFlipped)} />
          <button 
            aria-label="Karte umdrehen"
            className="absolute bottom-4 right-4 z-20 text-white bg-black bg-opacity-30 rounded-full p-2 transform hover:scale-110 transition-transform"
            onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(!isFlipped);
            }}>
             <FlipIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      <button onClick={handleNext} aria-label="Nächste Karte" className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-50 bg-black/30 rounded-full p-2">
        <ArrowRightIcon className="w-8 h-8" />
      </button>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg font-bold flex items-center gap-4 bg-black/30 px-3 py-1 rounded-full">
        <button onClick={() => onToggleFavorite(currentCard.id)} className={isCurrentCardFavorite ? "text-yellow-400 hover:text-yellow-300" : "hover:text-yellow-300"} aria-label="Als Favorit markieren">
            {isCurrentCardFavorite ? <StarIconFilled className="w-5 h-5" /> : <StarIconOutline className="w-5 h-5" />}
        </button>
        <div className="w-px h-5 bg-white/50"></div>
        {currentCard.isCustom && (
            <>
                <button onClick={() => onEdit(currentCard)} className="hover:text-yellow-300" aria-label="Karte bearbeiten">
                    <EditIcon className="w-5 h-5" />
                </button>
                <button onClick={handleDelete} className="hover:text-red-400" aria-label="Karte löschen">
                    <TrashIcon className="w-5 h-5" />
                </button>
                <div className="w-px h-5 bg-white/50"></div>
            </>
        )}
        <span>{currentIndex + 1} / {categoryCards.length}</span>
      </div>
    </div>
  );
};
