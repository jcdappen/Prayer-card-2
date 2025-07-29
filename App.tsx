import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
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

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Temporär: Standard-Karten bis Custom Cards implementiert sind
  const allCards = useMemo(() => CARDS, []);
  const [view, setView] = useState<ViewState>({ name: 'grid' });

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session loaded:', session);
      setSession(session);
      setLoading(false);
    });

    // Auth state change listener mit verbessertem Event Handling
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, 'Session:', session);
      
      // Verwende setTimeout wie in der Dokumentation empfohlen
      setTimeout(async () => {
        if (event === 'INITIAL_SESSION') {
          console.log('Handling initial session');
          setSession(session);
        } else if (event === 'SIGNED_IN') {
          console.log('User signed in');
          setSession(session);
          setShowAuthModal(false);
          if (pendingAction) {
            pendingAction();
            setPendingAction(null);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setSession(null);
          setView({ name: 'grid' });
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed');
          setSession(session);
        } else if (event === 'USER_UPDATED') {
          console.log('User updated');
          setSession(session);
        } else if (event === 'PASSWORD_RECOVERY') {
          console.log('Password recovery');
          // Handle password recovery if needed
        }
      }, 0);
    });

    // Cleanup function
    return () => {
      console.log('Cleaning up auth listener');
      data.subscription.unsubscribe();
    };
  }, [pendingAction]);

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
};

export default App;
