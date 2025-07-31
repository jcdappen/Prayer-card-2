
import type { CategoryInfo } from './types';

export const CATEGORIES: Record<string, CategoryInfo> = {
  "PRAISE & GRATITUDE": {
    name: "PRAISE & GRATITUDE",
    color: "#D98A6C",
    textColor: "#FFFFFF",
    cardCount: 11,
  },
  "ABIDING & PRESENCE": {
    name: "ABIDING & PRESENCE",
    color: "#D5A76C",
    textColor: "#FFFFFF",
    cardCount: 9,
  },
  "CHARACTER & CONFESSION": {
    name: "CHARACTER & CONFESSION",
    color: "#6CB5D9",
    textColor: "#FFFFFF",
    cardCount: 5,
  },
  "THE LORD’S PRAYER": {
    name: "THE LORD’S PRAYER",
    color: "#A1DDF0",
    textColor: "#333333",
    cardCount: 11,
  },
  "PETITIONS": {
    name: "PETITIONS",
    color: "#5A7081",
    textColor: "#FFFFFF",
    cardCount: 6,
  },
  "BIBLICAL PRAYERS": {
    name: "BIBLICAL PRAYERS",
    color: "#808080",
    textColor: "#FFFFFF",
    cardCount: 8,
  },
  "MEDITATIONS": {
    name: "MEDITATIONS",
    color: "#EBD3B9",
    textColor: "#333333",
    cardCount: 6,
  },
  "ONE-SENTENCE PRAYERS": {
    name: "ONE-SENTENCE PRAYERS",
    color: "#F0C4B8",
    textColor: "#333333",
    cardCount: 5,
  },
    "FAVORITEN": {
    name: "FAVORITEN",
    color: "#FFD700", // Gold color
    textColor: "#333333",
    cardCount: 0, // This will be updated dynamically
  },
  "MEINE KARTEN": {
    name: "MEINE KARTEN",
    color: "#607D8B",
    textColor: "#FFFFFF",
    cardCount: 0, // This will be updated dynamically
    isSpecial: true,
  },
  "PERSONEN": {
    name: "PERSONEN",
    color: "#4DB6AC", // A gentle teal/green
    textColor: "#FFFFFF",
    cardCount: 0, // This will be updated dynamically
    isSpecial: true,
  },
};