import React from 'react';
import type { PrayerPlan } from '../types';

interface PrayerPlanTileProps {
  plan: PrayerPlan;
  progressDay: number; // 0-indexed, -1 if not started
  onClick: () => void;
}

export const PrayerPlanTile: React.FC<PrayerPlanTileProps> = ({ plan, progressDay, onClick }) => {
  const totalDays = plan.cardIds.length;
  const isCompleted = progressDay >= totalDays;
  const hasStarted = progressDay > -1;

  let progressText = "Plan starten";
  if (isCompleted) {
    progressText = "Abgeschlossen";
  } else if (hasStarted) {
    progressText = `Fortsetzen: Tag ${progressDay + 1}`;
  }

  return (
    <div
      onClick={onClick}
      className="p-6 rounded-lg shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300 flex flex-col justify-between relative backdrop-blur-md border border-white/20 bg-gray-700/50 text-white"
    >
      <div>
        <h3 className="text-2xl font-bold font-serif tracking-wide mb-2">
          {plan.title}
        </h3>
        <p className="text-white/80">
          {plan.description}
        </p>
      </div>
      <div className={`mt-4 self-start px-3 py-1 rounded-full text-sm font-semibold transition-colors ${isCompleted ? 'bg-green-600/90' : 'bg-blue-600/90'}`}>
        {progressText}
      </div>
    </div>
  );
};
