import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './lib/supabaseClient'; // Korrigierter Pfad
import { CategoryGrid } from './components/CategoryGrid';
import { CardViewer } from './components/CardViewer';
import { CardEditor } from './components/CardEditor';
import { HowToUse } from './components/HowToUse';
import { CategoryOverview } from './components/CategoryOverview';
import { Auth } from './components/Auth';
import { CATEGORIES } from './constants';
import { CARDS } from './data/cards';
import type { CategoryInfo, PrayerCardData } from './types';
import type { Session } from '@supabase/supabase-js';
import { UserIcon } from './components/icons';

type ViewState = 
  | { name: 'grid' }
  | { name: 'overview', category: CategoryInfo }
  | { name: 'viewer', category: CategoryInfo, initialIndex: number }
  | { name: 'editor', card: PrayerCardData | null };

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Deine bestehende App-Logik
  const allCards = useMemo(() => CARDS, []);
  const [view, setView] = useState<ViewState>({ name: 'grid' });

  useEffect(() => {
    // Get initial session first - Das ist der Fix!
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        console.log('Initial session loaded:', session);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up listener with proper cleanup - Das ist der verbesserte Teil!
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event);
        setSession(session);
        
        if (event === 'SIGNED_IN') {
          setShowAuthModal(false);
          if (pendingAction) {
            pendingAction();
            setPendingAction(null);
          }
        } else if (event === 'SIGNED_OUT') {
          setView({ name: 'grid' });
        }
      }
    );

    // Critical: Always return cleanup function
    return () => subscription.unsubscribe();
  }, []); // Empty dependency array is essential

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Deine bestehenden Handler-Funktionen
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

  const handleEditCard = (card: PrayerCardData) => {
    requireAuth(() => {
      setView({ name: 'editor', card });
    });
  };
  
  const handleDeleteCard = (cardId: string) => {
    requireAuth(() => {
      alert(`Delete card ${cardId} - Feature coming soon!`);
    });
  };

  const handleSaveCard = (cardData: PrayerCardData) => {
    requireAuth(() => {
      alert('Save card - Feature coming soon!');
      setView({ name: 'grid' });
    });
  };

  const handleToggleFavorite = (cardId: string) => {
    requireAuth(() => {
      alert(`Toggle favorite ${cardId} - Feature coming soon!`);
    });
  };

  const handleLogout = async () => {
    console.log('Signing out...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
    }
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
              customCardCount={0}
              favoriteCardCount={0}
            />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {showAuthModal && (
        <Auth 
          onClose={() => setShowAuthModal(false)} 
          onLogin={(session) => setSession(session)} 
        />
      )}
      
      <header className="text-center py-6 bg-white dark:bg-gray-800 shadow-md relative">
        <div className="absolute top-4 right-4 z-10">
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                {session.user.email}
              </span>
              <button 
                onClick={handleLogout} 
                className="px-3 py-2 text-sm rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Abmelden
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)} 
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <UserIcon className="w-5 h-5" />
              <span className="hidden sm:block">Anmelden</span>
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
          {session && (
            <p className="mt-2 text-sm text-green-600">
              ✅ Angemeldet als {session.user.email}
            </p>
          )}
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
}

export default App;
