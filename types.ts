
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

export interface PersonCardData {
  id: string;
  category: "PERSONEN";
  name: string;
  imageUrl: string; // Base64 data URL
  thankfulFor: string;
  prayerPoints: string;
}


export type AnyPrayerCard = PrayerCardData | PersonCardData;


export interface CategoryInfo {
  name: string;
  color: string;
  textColor: string;
  cardCount: number;
  isSpecial?: boolean; // For "MEINE KARTEN" and "PERSONEN" tiles
}

export interface NotificationSettings {
  enabled: boolean;
  time: string; // e.g., "08:00"
  days: number[]; // 0 for Sunday, 1 for Monday, etc.
}

export interface JournalEntry {
  id: string;      // UUID for the entry itself
  cardId: string;  // ID of the card it's associated with
  date: string;    // ISO 8601 date string
  title: string;   // The user's title for the reflection
  content: string; // The user's reflection
}