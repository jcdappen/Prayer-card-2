import React from 'react';
import type { PrayerPlan, PrayerPlanProgress } from '../types';
import { PRAYER_PLANS } from '../data/plans';
import { PrayerPlanTile } from './PrayerPlanTile';
import { HomeIcon } from './icons';

interface PrayerPlansOverviewProps {
  progress: PrayerPlanProgress;
  onSelectPlan: (plan: PrayerPlan) => void;
  onBack: () => void;
}

export const PrayerPlansOverview: React.FC<PrayerPlansOverviewProps> = ({ progress, onSelectPlan, onBack }) => {
  return (
    <div className="w-full animate-fade-in">
      <header className="flex justify-between items-center mb-8 sticky top-0 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-md py-4 z-20">
        <div className="w-48">
            <button onClick={onBack} aria-label="Zurück zur Startseite" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-2 rounded-full">
              <HomeIcon className="w-8 h-8" />
            </button>
        </div>
        <h2 className="text-3xl font-bold font-serif text-center px-4 text-gray-800 dark:text-gray-200">Thematische Gebetspläne</h2>
        <div className="w-48" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {PRAYER_PLANS.map(plan => (
          <PrayerPlanTile
            key={plan.id}
            plan={plan}
            progressDay={progress[plan.id]?.currentDay ?? -1}
            onClick={() => onSelectPlan(plan)}
          />
        ))}
      </div>
    </div>
  );
};
