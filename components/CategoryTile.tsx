
import React from 'react';
import type { CategoryInfo } from '../types';
import { PlusIcon } from './icons';

interface CategoryTileProps {
  category: CategoryInfo;
  onClick: () => void;
  onAdd?: () => void;
}

export const CategoryTile: React.FC<CategoryTileProps> = ({ category, onClick, onAdd }) => {
  
  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd?.();
  }

  return (
    <div
      onClick={onClick}
      className="p-4 rounded-lg shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300 flex flex-col justify-between relative"
      style={{ backgroundColor: category.color }}
    >
      <h3 
        className="text-2xl font-bold font-serif tracking-wide"
        style={{ color: category.textColor }}
      >
        {category.name}
      </h3>
      <p 
        className="text-sm font-semibold mt-2 self-end"
        style={{ color: category.textColor, opacity: 0.8 }}
      >
        {category.cardCount} Karten
      </p>
      {category.isSpecial && (
        <button 
          onClick={handleAddClick}
          aria-label="Neue Karte erstellen"
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/40 transition-colors"
        >
          <PlusIcon className="w-6 h-6" style={{ color: category.textColor }} />
        </button>
      )}
    </div>
  );
};
