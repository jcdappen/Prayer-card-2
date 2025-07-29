import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import { CategoryGrid } from './components/CategoryGrid';
import { CardViewer } from './components/CardViewer';
import { CardEditor } from './components/CardEditor';
import { HowToUse } from './components/HowToUse';
import { CategoryOverview } from './components/CategoryOverview';
import { CATEGORIES } from './constants';
import { CARDS } from './data/cards';
import type { CategoryInfo, PrayerCardData } from './types';

type ViewState = 
  | { name: 'grid' }
  | { name: 'overview', category: CategoryInfo }
  | { name: 'viewer', category: CategoryInfo, initialIndex: number }
  | { name: 'editor', card: PrayerCardData | null };

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const allCards = useMemo(() => CARDS, []);
  const [view, setView] = useState<ViewState>({ name: 'grid' });

  // Minimal Auth Test
  useEffect(() => {
    console.log('Starting auth check...');
    
    // Teste nur die Session ohne onAuthStateChange
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('Session check:', { session, error });
      if (error) {
        console.error('Session error:', error);
      } else {
        setUser(session?.user ?? null);
      }
      setLoading(false);
    }).catch((err) => {
      console.error('Auth error:', err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Testing Auth...</p>
        </div>
      </div>
    );
  }

  const handleSelectCategory = (category: CategoryInfo) => {
    setView({ name: 'overview', category });
  };
  
  const handleSelectCard = (category: CategoryInfo, index: number) => {
    setView({ name: 'viewer', category, initialIndex: index });
  };
  
  const handleAddCard = () => {
    alert('Add card feature - user: ' + (user ? user.email : 'not logged in'));
  };

  const handleEditCard = (card: PrayerCardData) => {
    alert('Edit card feature - user: ' + (user ? user.email : 'not logged in'));
  };
  
  const handleDeleteCard = (cardId: string) => {
    alert('Delete card feature - user: ' + (user ? user.email : 'not logged in'));
  };

  const handleSaveCard = (cardData: PrayerCardData) => {
    alert('Save card feature - user: ' + (user ? user.email : 'not logged in'));
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
        setView({ name: 'grid' });
        break;
    }
  };

  const renderContent = () => {
    switch (view.name) {
      case 'overview':
        const cardsForCategory = allCards.filter(c => c.category === view.category.name);
        
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
          isFavorite={() => false}
          onToggleFavorite={() => alert('Favorites feature')}
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
              customCardCount={0}
              favoriteCardCount={0}
            />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <header className="text-center py-6 bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-extrabold font-serif tracking-tight text-gray-900 dark:text-white">
            <span className="block">LEAD</span>
            <span className="block text-2xl tracking-widest text-gray-500 dark:text-gray-400 my-1">WITH</span>
            <span className="block">PRAYER</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Eine interaktive digitale Ressource für die Gebetskarten.
          </p>
          <p className="mt-2 text-sm text-blue-600">
            AUTH TEST - User: {user ? user.email : 'Not logged in'}
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
