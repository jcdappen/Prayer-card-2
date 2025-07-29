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

  useEffect(() => {
    console.log('Starting auth setup...');
    
    // Initial session check
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('Initial session:', { session, error });
      if (error) {
        console.error('Initial session error:', error);
      } else {
        setUser(session?.user ?? null);
      }
      setLoading(false);
    }).catch((err) => {
      console.error('Initial auth error:', err);
      setLoading(false);
    });

    // Auth state listener
    console.log('Setting up auth listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', { event, session });
      try {
        setUser(session?.user ?? null);
      } catch (err) {
        console.error('Error in auth state change:', err);
      }
    });

    return () => {
      console.log('Cleaning up auth listener...');
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading Auth...</p>
        </div>
      </div>
    );
  }

  // Simple sign in test function
  const handleTestSignIn = async () => {
    console.log('Testing sign in...');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'testpassword'
      });
      console.log('Sign in result:', { data, error });
    } catch (err) {
      console.error('Sign in error:', err);
    }
  };

  const handleSelectCategory = (category: CategoryInfo) => {
    setView({ name: 'overview', category });
  };
  
  const handleSelectCard = (category: CategoryInfo, index: number) => {
    setView({ name: 'viewer', category, initialIndex: index });
  };
  
  const handleAddCard = () => {
    alert('Add card - User: ' + (user ? user.email : 'not logged in'));
  };

  const handleEditCard = (card: PrayerCardData) => {
    alert('Edit card - User: ' + (user ? user.email : 'not logged in'));
  };
  
  const handleDeleteCard = (cardId: string) => {
    alert('Delete card - User: ' + (user ? user.email : 'not logged in'));
  };

  const handleSaveCard = (cardData: PrayerCardData) => {
    alert('Save card - User: ' + (user ? user.email : 'not logged in'));
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
          onToggleFavorite={() => alert('Favorites test')}
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
          <div className="mt-2 flex items-center justify-center gap-4">
            <p className="text-sm text-blue-600">
              User: {user ? user.email : 'Not logged in'}
            </p>
            <button 
              onClick={handleTestSignIn}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test Sign In
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>

      <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
        <p>Eine zusätztige Ressource, die zusammen mit Lead With Prayer von Ryan Skoog, Peter Greer und Cameron Doolittle erstellt wurde.</p>
        <p>&copy; 2024. Für den persönlichen und kirchlichen Gebrauch.</p>
      </footer>
    </div>
  );
};

export default App;
