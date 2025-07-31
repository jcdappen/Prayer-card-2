
import React, { useState, useMemo } from 'react';
import { CategoryGrid } from './components/CategoryGrid';
import { CardViewer } from './components/CardViewer';
import { CardEditor } from './components/CardEditor';
import { PersonCardEditor, NewOrExistingPersonCard } from './components/PersonCardEditor';
import { HowToUse } from './components/HowToUse';
import { CategoryOverview } from './components/CategoryOverview';
import { CATEGORIES } from './constants';
import { CARDS } from './data/cards';
import type { CategoryInfo, PrayerCardData, PersonCardData, AnyPrayerCard, NotificationSettings, JournalEntry, PrayerPlan } from './types';
import { useCustomCards } from './hooks/useCustomCards';
import { usePersonCards } from './hooks/usePersonCards';
import { useFavorites } from './hooks/useFavorites';
import { useNotificationSettings } from './hooks/useNotificationSettings';
import { SettingsModal } from './components/SettingsModal';
import { SettingsIcon, BookOpenIcon, MapIcon } from './components/icons';
import { useJournal } from './hooks/useJournal';
import { JournalOverview } from './components/JournalOverview';
import { JournalModal } from './components/JournalModal';
import { usePrayerPlans } from './hooks/usePrayerPlans';
import { PrayerPlansOverview } from './components/PrayerPlansOverview';
import { PlanCardViewer } from './components/PlanCardViewer';
import { FeatureTile } from './components/FeatureTile';
import { PRAYER_PLANS } from './data/plans';


type ViewState = 
  | { name: 'grid' }
  | { name: 'overview', category: CategoryInfo }
  | { name: 'viewer', category: CategoryInfo, initialIndex: number }
  | { name: 'editor', card: PrayerCardData | null }
  | { name: 'editor-person', card: PersonCardData | null }
  | { name: 'journal' }
  | { name: 'plansOverview' }
  | { name: 'planViewer', plan: PrayerPlan };

const App: React.FC = () => {
  const { customCards, addCard, updateCard, deleteCard } = useCustomCards();
  const { personCards, addPersonCard, updatePersonCard, deletePersonCard } = usePersonCards();
  const { favoriteIds, toggleFavorite, isFavorite } = useFavorites();
  const { notificationSettings, saveNotificationSettings } = useNotificationSettings();
  const { entries, addEntry, updateEntry, deleteEntry, getLatestEntryForCard } = useJournal();
  const { progress: prayerPlanProgress, updatePlanProgress, resetPlan } = usePrayerPlans();

  
  const allCards = useMemo(() => [...CARDS, ...customCards, ...personCards], [customCards, personCards]);
  
  const [view, setView] = useState<ViewState>({ name: 'grid' });
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [activeJournal, setActiveJournal] = useState<{entry: JournalEntry | null, card: AnyPrayerCard} | null>(null);


  const handleSelectCategory = (category: CategoryInfo) => {
    setView({ name: 'overview', category });
  };
  
  const handleSelectCard = (category: CategoryInfo, index: number) => {
    setView({ name: 'viewer', category, initialIndex: index });
  };
  
  const handleAddCard = (categoryName: string) => {
      if (categoryName === 'PERSONEN') {
        setView({ name: 'editor-person', card: null });
      } else if (categoryName === 'MEINE KARTEN') {
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

  const handleSaveSettings = (newSettings: NotificationSettings) => {
    saveNotificationSettings(newSettings);
    setIsSettingsModalOpen(false);
  };

  const handleOpenJournal = (data: AnyPrayerCard | JournalEntry) => {
    if ('content' in data) { // It's a JournalEntry from JournalOverview
        const card = allCards.find(c => c.id === data.cardId);
        if (card) {
            setActiveJournal({ entry: data, card: card });
        } else {
            alert("Zugehörige Karte nicht gefunden. Sie wurde möglicherweise gelöscht.");
        }
    } else { // It's an AnyPrayerCard from CardViewer
        const latestEntry = getLatestEntryForCard(data.id);
        setActiveJournal({ entry: latestEntry || null, card: data });
    }
  };

  const handleSaveJournal = (title: string, content: string) => {
    if (!activeJournal) return;
    const { entry, card } = activeJournal;
    if (entry) { // Existing entry
        updateEntry(entry.id, title, content);
    } else { // New entry
        addEntry(card.id, title, content);
    }
    setActiveJournal(null); // Close after saving
  };
  
  const handleGoToCardFromJournal = () => {
    if (!activeJournal) return;
    const { card } = activeJournal;
    const category = CATEGORIES[card.category];
    
    // Use the native category of the card to find the index
    const categoryCards = allCards.filter(c => c.category === card.category);
    const cardIndex = categoryCards.findIndex(c => c.id === card.id);

    if (category && cardIndex !== -1) {
        setActiveJournal(null); // Close modal
        // Open viewer with the card's native category
        setView({ name: 'viewer', category, initialIndex: cardIndex });
    } else {
        alert('Karte konnte nicht gefunden werden.');
        setActiveJournal(null);
    }
  };
  
  const handleSelectPlan = (plan: PrayerPlan) => {
    const currentDay = prayerPlanProgress[plan.id]?.currentDay ?? -1;
    if (currentDay === -1) {
      updatePlanProgress(plan.id, 0);
    }
    setView({ name: 'planViewer', plan });
  };

  const handlePlanNextDay = (planId: string) => {
    const currentDay = prayerPlanProgress[planId]?.currentDay ?? -1;
    updatePlanProgress(planId, currentDay + 1);
  };

  const handlePlanFinish = (planId: string) => {
    const plan = PRAYER_PLANS.find(p => p.id === planId);
    if (plan) {
      updatePlanProgress(planId, plan.cardIds.length);
    }
    setView({ name: 'plansOverview' });
  };

  const handlePlanReset = (planId: string) => {
    if (window.confirm("Möchten Sie den Fortschritt für diesen Plan wirklich zurücksetzen?")) {
      resetPlan(planId);
      setView({ name: 'plansOverview' });
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
        case 'editor-person':
             const categoryName = view.card?.category || (view.name === 'editor-person' ? 'PERSONEN' : 'MEINE KARTEN');
             const category = CATEGORIES[categoryName];
             setView({ name: 'overview', category });
             break;
        case 'journal':
        case 'plansOverview':
            setView({ name: 'grid' });
            break;
        case 'planViewer':
            setView({ name: 'plansOverview' });
            break;
        default:
            setView({ name: 'grid' });
    }
  };

  const renderContent = () => {
    switch (view.name) {
      case 'journal':
        return <JournalOverview
            entries={entries}
            allCards={allCards}
            onOpenJournal={handleOpenJournal}
            onBack={handleBack}
            onDeleteEntry={deleteEntry}
        />;
      case 'plansOverview':
        return <PrayerPlansOverview
            progress={prayerPlanProgress}
            onSelectPlan={handleSelectPlan}
            onBack={handleBack}
        />;
      case 'planViewer':
        const currentDay = prayerPlanProgress[view.plan.id]?.currentDay ?? 0;
        if (currentDay >= view.plan.cardIds.length) {
            setView({ name: 'plansOverview' });
            return null;
        }
        return <PlanCardViewer
            plan={view.plan}
            currentDay={currentDay}
            allCards={allCards}
            onNextDay={() => handlePlanNextDay(view.plan.id)}
            onFinishPlan={() => handlePlanFinish(view.plan.id)}
            onResetPlan={() => handlePlanReset(view.plan.id)}
            onClose={() => setView({name: 'plansOverview'})}
        />;
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
                  onOpenJournal={handleOpenJournal}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
                  <FeatureTile
                      title="Thematische Gebetspläne"
                      description="Geführte Reisen, um Ihr Gebetsleben zu vertiefen."
                      Icon={MapIcon}
                      onClick={() => setView({ name: 'plansOverview' })}
                  />
                </div>
            </div>
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
      <header className="text-center py-8 bg-white dark:bg-gray-800 shadow-md relative">
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
        <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
                onClick={() => setView({ name: 'journal' })}
                className="text-gray-600 dark:text-gray-400 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                aria-label="Mein Journal öffnen"
            >
                <BookOpenIcon className="w-8 h-8" />
            </button>
            <button 
                onClick={() => setIsSettingsModalOpen(true)} 
                className="text-gray-600 dark:text-gray-400 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                aria-label="Einstellungen für Erinnerungen"
            >
                <SettingsIcon className="w-8 h-8" />
            </button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>

      {activeJournal && (
        <JournalModal
          isOpen={!!activeJournal}
          onClose={() => setActiveJournal(null)}
          onSave={handleSaveJournal}
          card={activeJournal.card}
          initialTitle={activeJournal.entry?.title || ''}
          initialContent={activeJournal.entry?.content || ''}
          onGoToCard={handleGoToCardFromJournal}
          showGoToCardLink={!!activeJournal.entry}
        />
      )}

      {isSettingsModalOpen && (
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          initialSettings={notificationSettings}
          onSave={handleSaveSettings}
        />
      )}

       <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
          <p>Eine zusätzliche Ressource, die zusammen mit Lead With Prayer von Ryan Skoog, Peter Greer und Cameron Doolittle erstellt wurde.</p>
          <p>&copy; 2024. Für den persönlichen und kirchlichen Gebrauch.</p>
      </footer>
    </div>
  );
};

export default App;
