
import React from 'react';
import { CATEGORIES } from '../constants';
import { CategoryTile } from './CategoryTile';
import type { CategoryInfo } from '../types';

interface CategoryGridProps {
  onSelectCategory: (category: CategoryInfo) => void;
  onAddCard: (categoryName: string) => void;
  customCardCount: number;
  personCardCount: number;
  favoriteCardCount: number;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory, onAddCard, customCardCount, personCardCount, favoriteCardCount }) => {
  const categories = Object.values(CATEGORIES).map(cat => {
    if (cat.name === "MEINE KARTEN") {
      return { ...cat, cardCount: customCardCount };
    }
    if (cat.name === "PERSONEN") {
      return { ...cat, cardCount: personCardCount };
    }
    if (cat.name === "FAVORITEN") {
      return { ...cat, cardCount: favoriteCardCount };
    }
    return cat;
  }).filter(cat => {
    // Hide favorites category if there are no favorites
    if (cat.name === 'FAVORITEN') return favoriteCardCount > 0;
    return true;
  });


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {categories.map(cat => (
        <CategoryTile 
          key={cat.name} 
          category={cat} 
          onClick={() => onSelectCategory(cat)}
          onAdd={cat.isSpecial ? () => onAddCard(cat.name) : undefined}
        />
      ))}
    </div>
  );
};