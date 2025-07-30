
import React, { useState, useMemo } from 'react';
import { CategoryGrid } from './components/CategoryGrid';
import { CardViewer } from './components/CardViewer';
import { CardEditor } from './components/CardEditor';
import { PersonCardEditor, NewOrExistingPersonCard } from './components/PersonCardEditor';
import { HowToUse } from './components/HowToUse';
import { CategoryOverview } from './components/CategoryOverview';
import { CATEGORIES } from './constants';
import { CARDS } from './data/cards';
import type { CategoryInfo, PrayerCardData, PersonCardData, AnyPrayerCard } from './types';
import { useCustomCards } from './hooks/useCustomCards';
import { usePersonCards } from './hooks/usePersonCards';
import { useFavorites } from './hooks/useFavorites';

type ViewState = 
  | { name: 'grid' }
  | { name: 'overview', category: CategoryInfo }
  | { name: 'viewer', category: CategoryInfo, initialIndex: number }
  | { name: 'editor', card: PrayerCardData | null }
  | { name: 'editor-person', card: PersonCardData | null };

const App: React.FC = () => {
  const { customCards, addCard, updateCard, deleteCard } = useCustomCards();
  const { personCards, addPersonCard, updatePersonCard, deletePersonCard } = usePersonCards();
  const { favoriteIds, toggleFavorite, isFavorite } = useFavorites();
  
  const allCards = useMemo(() => [...CARDS, ...customCards, ...personCards], [customCards, personCards]);
  
  const [view, setView] = useState<ViewState>({ name: 'grid' });

  const handleSelectCategory = (category: CategoryInfo) => {
    setView({ name: 'overview', category });
  };
  
  const handleSelectCard = (category: CategoryInfo, index: number) => {
    setView({ name: 'viewer', category, initialIndex: index });
  };
  
  const handleAddCard = (categoryName: string) => {
      if (categoryName === 'PERSONEN') {
        setView({ name: 'editor-person', card: null });
      } else {
        setView({ name: 'editor', card: null });
      }
  };

  const handleEditCard = (card: AnyPrayerCard) => {
      if (card.category === 'PERSONEN') {
        setView({ name: 'editor-person', card: card as PersonCardData });
      } else {
        setView({ name: 'editor', card: card as PrayerCardData });
      }
  };
  
  const handleDeleteCard = (cardId: string, categoryName: string) => {
    if (categoryName === 'PERSONEN') {
        deletePersonCard(cardId);
    } else {
        deleteCard(cardId);
    }

    if (view.name === 'viewer') {
        // After deleting, go back to the overview, which will have the updated card list
        setView({ name: 'overview', category: view.category });
    }
  }

  const handleSaveCustomCard = (cardData: PrayerCardData) => {
    if (cardData.isCustom && customCards.some(c => c.id === cardData.id)) {
      updateCard(cardData);
    } else {
      addCard(cardData);
    }
    const myCardsCategory = CATEGORIES["MEINE KARTEN"];
    setView({ name: 'overview', category: {...myCardsCategory, cardCount: customCards.length + 1} });
  };

  const handleSavePersonCard = (cardData: NewOrExistingPersonCard) => {
    const isExisting = 'id' in cardData && personCards.some(c => c.id === cardData.id);

    if (isExisting) {
        updatePersonCard(cardData as PersonCardData);
    } else {
        addPersonCard(cardData as Omit<PersonCardData, 'id' | 'category'>);
    }
    
    const personCategory = CATEGORIES["PERSONEN"];
    const newCount = isExisting ? personCards.length : personCards.length + 1;
    setView({ name: 'overview', category: {...personCategory, cardCount: newCount }});
  };

  const handleBack = () => {
    switch(view.name) {
        case 'overview':
            setView({ name: 'grid' });
            break;
        case 'viewer':
            setView({ name: 'overview', category: view.category });
            break;
        case 'editor':
        case 'editor-person':
             const categoryName = view.card?.category || (view.name === 'editor-person' ? 'PERSONEN' : 'MEINE KARTEN');
             const category = CATEGORIES[categoryName];
             setView({ name: 'overview', category });
             break;
        default:
            setView({ name: 'grid' });
    }
  };

  const renderContent = () => {
    switch (view.name) {
      case 'overview':
        let cardsForCategory;
        if (view.category.name === 'FAVORITEN') {
            cardsForCategory = allCards.filter(c => favoriteIds.has(c.id));
        } else {
            cardsForCategory = allCards.filter(c => c.category === view.category.name);
        }
        
        return <CategoryOverview
            category={view.category}
            cards={cardsForCategory}
            onSelectCard={(index) => handleSelectCard(view.category, index)}
            onBack={handleBack}
            onAddCard={handleAddCard}
        />;
      case 'viewer':
        return <CardViewer 
                  category={view.category} 
                  allCards={allCards}
                  initialIndex={view.initialIndex}
                  onBack={handleBack} 
                  onEdit={handleEditCard}
                  onDelete={handleDeleteCard}
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                />;
      case 'editor':
        return <CardEditor 
                  cardToEdit={view.card} 
                  onSave={handleSaveCustomCard} 
                  onCancel={handleBack} 
                />;
      case 'editor-person':
        return <PersonCardEditor
                  cardToEdit={view.card}
                  onSave={handleSavePersonCard}
                  onCancel={handleBack}
                />;
      case 'grid':
      default:
        return (
          <>
            <HowToUse />
            <CategoryGrid 
              onSelectCategory={handleSelectCategory} 
              onAddCard={handleAddCard}
              customCardCount={customCards.length}
              personCardCount={personCards.length}
              favoriteCardCount={favoriteIds.size}
            />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <header className="text-center py-8 bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl font-extrabold font-serif tracking-tight text-gray-900 dark:text-white">
                <span className="block">LEAD</span>
                <span className="block text-2xl tracking-widest text-gray-500 dark:text-gray-400 my-1">WITH</span>
                <span className="block">PRAYER</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Eine interaktive digitale Ressource für die Gebetskarten.
            </p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>

       <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
          <p>Eine zusätzliche Ressource, die zusammen mit Lead With Prayer von Ryan Skoog, Peter Greer und Cameron Doolittle erstellt wurde.</p>
          <p>&copy; 2024. Für den persönlichen und kirchlichen Gebrauch.</p>
      </footer>
    </div>
  );
};

export default App;
