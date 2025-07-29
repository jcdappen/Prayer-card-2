
export interface PrayerCardData {
  id: string;
  category: string;
  frontTitle: string;
  frontText: string;
  backTitle: string;
  backTask: string;
  backText: string;
  isCustom: boolean;
}

export interface CategoryInfo {
  name: string;
  color: string;
  textColor: string;
  cardCount: number;
  isSpecial?: boolean; // For "MEINE KARTEN" tile
}