
export interface PrayerCardData {
  id: string;
  category: string;
  frontTitle: string;
  frontText?: string; // For custom cards
  frontContent?: { // For predefined cards from CSV
      text1: string;
      ref1: string;
      text2: string;
      ref2: string;
      text3: string;
      ref3: string;
  };
  backTitle: string;
  backTask: string;
  backText: string;
  isCustom?: boolean;
}

export interface CategoryInfo {
  name: string;
  color: string;
  textColor: string;
  cardCount: number;
  isSpecial?: boolean; // For "MEINE KARTEN" tile
}
