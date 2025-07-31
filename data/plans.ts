import type { PrayerPlan } from '../types';

export const PRAYER_PLANS: PrayerPlan[] = [
  {
    id: 'plan-peace',
    title: '7 Tage zu mehr Frieden',
    description: 'Eine geführte Reise durch Gebete, die auf Ruhe, das Loslassen von Sorgen und die Gegenwart Gottes ausgerichtet sind.',
    cardIds: ['14', '15', '13', '24', '35', '55', '40'],
  },
  {
    id: 'plan-praise',
    title: '5 Tage im Lobpreis verwurzelt',
    description: 'Eine fokussierte Woche, um eine Haltung der Dankbarkeit und Anbetung zu vertiefen und Gottes Größe zu feiern.',
    cardIds: ['1', '2', '3', '4', '6'],
  },
];
