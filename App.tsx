
import React, { useState, useMemo, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabaseClient';
import { CategoryGrid } from './components/CategoryGrid';
import { CardViewer } from './components/CardViewer';
import { CardEditor } from './components/CardEditor';
import { HowToUse } from './components/HowToUse';
import { CategoryOverview } from './components/CategoryOverview';
import { CATEGORIES } from './constants';
import { CARDS } from './data/cards';
import type { CategoryInfo, PrayerCardData } from './types';
import { useCustomCards } from './hooks/useCustomCards';
import { useFavorites } from './hooks/useFavorites';
import { Auth } from './components/Auth';
import { UserIcon } from './components/icons';

type ViewState = 
  | { name: 'grid' }
  | { name: 'overview', category: CategoryInfo }
  | { name: 'viewer', category: CategoryInfo, initialIndex: number }
  | { name: 'editor', card: PrayerCardData | null };

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const { customCards, addCard, updateCard, deleteCard } = useCustomCards(session);
  const { favoriteIds, toggleFavorite, isFavorite } = useFavorites(session);
  
  const allCards = useMemo(() => [...CARDS, ...customCards], [customCards]);
  
  const [view, setView] = useState<ViewState>({ name: 'grid' });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event === 'SIGNED_IN') {
          setShowAuthModal(false);
          if (pendingAction) {
              pendingAction();
              setPendingAction(null);
          }
      }
    });

    return () => subscription.unsubscribe();
  }, [pendingAction]);
  
  const requireAuth = (action: () => void) => {
    if (!session) {
        setPendingAction(() => action);
        setShowAuthModal(true);
    } else {
        action();
    }
  };

  const handleSelectCategory = (category: CategoryInfo) => {
    setView({ name: 'overview', category });
  };
  
  const handleSelectCard = (category: CategoryInfo, index: number) => {
    setView({ name: 'viewer', category, initialIndex: index });
  };
  
  const handleAddCard = () => {
    requireAuth(() => {
        setView({ name: 'editor', card: null });
    });
  };

  const handleToggleFavorite = (cardId: string) => {
    requireAuth(() => {
        toggleFavorite(cardId);
    });
  }

  const handleEditCard = (card: PrayerCardData) => {
      // Editing is only possible for custom cards, which requires login anyway.
      if (!session) return;
      setView({ name: 'editor', card });
  };
  
  const handleDeleteCard = (cardId: string) => {
    if (!session) return;
    deleteCard(cardId);
    // After deletion, go back to the overview.
    if (view.name === 'viewer') {
        const category = view.category.name === 'MEINE KARTEN' 
          ? {...CATEGORIES['MEINE KARTEN'], cardCount: customCards.length - 1} 
          : view.category;
        setView({ name: 'overview', category });
    }
  }

  const handleSaveCard = (cardData: PrayerCardData) => {
    if (cardData.id && customCards.some(c => c.id === cardData.id)) {
      updateCard(cardData);
    } else {
      addCard(cardData);
    }
    const myCardsCategory = CATEGORIES["MEINE KARTEN"];
    setView({ name: 'overview', category: {...myCardsCategory, cardCount: customCards.length + (cardData.id ? 0 : 1) } });
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
            const wasEditing = !!view.card;
            if (wasEditing && view.card?.category) {
                 const category = CATEGORIES[view.card.category] || CATEGORIES['MEINE KARTEN'];
                 setView({ name: 'overview', category });
            } else {
                 setView({ name: 'overview', category: CATEGORIES['MEINE KARTEN']});
            }
            break;
    }
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView({ name: 'grid' });
  }

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
                  onToggleFavorite={handleToggleFavorite}
                />;
      case 'editor':
        return <CardEditor 
                  cardToEdit={view.card} 
                  onSave={handleSaveCard} 
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
              favoriteCardCount={favoriteIds.size}
            />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {showAuthModal && <Auth onClose={() => setShowAuthModal(false)} onLogin={(session) => setSession(session)} />}
      <header className="text-center py-6 bg-white dark:bg-gray-800 shadow-md relative">
        <div className="absolute top-4 right-4 z-10">
            {session ? (
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">{session.user.email}</span>
                    <button onClick={handleLogout} className="px-3 py-2 text-sm rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                        Abmelden
                    </button>
                </div>
            ) : (
                <button onClick={() => setShowAuthModal(true)} className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">
                    <UserIcon className="w-5 h-5" />
                    <span className="hidden sm:block">Anmelden / Registrieren</span>
                </button>
            )}
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:pt-0">
            <h1 className="text-5xl font-extrabold font-serif tracking-tight text-gray-900 dark:text-white pt-8 sm:pt-0">
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