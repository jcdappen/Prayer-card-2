import React from 'react';
import type { PrayerCardData, CategoryInfo } from '../types';

interface CardContentProps {
  title: string;
  mainText: string;
  taskText?: string;
  cardId: string;
  category: CategoryInfo;
}

const CardContent: React.FC<CardContentProps> = ({ title, mainText, taskText, cardId, category }) => {
  const renderMainText = () => {
    if (!mainText) return null;

    const allBookNames = [
        'PSALM', 'GENESIS', 'REVELATION', 'LUKE', 'EXODUS', '1 THESSALONIANS', 
        '1 PETER', 'ZEPHANIAH', 'JOHN', '1 CHRONIC LES', '1 CHRONICLES', 'MATTHEW', 'HEBREWS', 
        '1 CORINTHIANS', '2 CORINTHIANS', 'PHILIPPIANS', 'PROVERBS', '2 TIMOTHY', 
        'ROMANS', '1 SAMUEL', 'C OLOSSIANS', 'COLOSSIANS', 'DEUTERONOMY', 'JEREMIAH', 'ISAIAH', 
        'HABAKKUK', 'NUMBERS', '2 CHRONICLES', 'MARK', 'GALATIANS'
    ];
    
    // This regex finds book names followed by chapter/verse numbers, anywhere in the text.
    // It's designed to handle multiple references, including those on the same line.
    const splittingRegex = new RegExp(`\\b(${allBookNames.join('|')})\\s+[\\d:,\\s-–]+`, 'gi');
    
    const scriptureMatches = [...mainText.matchAll(splittingRegex)];
    
    if (scriptureMatches.length === 0) {
      // No scriptures found, render text as-is.
      return <p className="text-lg whitespace-pre-line leading-relaxed">{mainText}</p>;
    }

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    scriptureMatches.forEach((match, idx) => {
        // Type guard for match.index
        if (match.index === undefined) return;

        // Extract the text that comes *before* the scripture reference
        const quoteText = mainText.substring(lastIndex, match.index).trim();
        if (quoteText) {
            elements.push(<p key={`quote-${idx}`} className="text-lg whitespace-pre-line leading-relaxed italic">{quoteText}</p>);
        }

        // The scripture reference itself. Trim trailing commas for cleaner display.
        const scriptureText = match[0].trim().replace(/,$/, '');
        elements.push(<p key={`scripture-${idx}`} className="text-sm font-bold text-gray-500 mt-1">{scriptureText}</p>);

        // Update the index for the next slice of text
        lastIndex = match.index + match[0].length;
    });

    // Add any remaining text after the last scripture reference
    const remainingText = mainText.substring(lastIndex).trim();
    if (remainingText) {
        elements.push(<p key="remaining" className="text-lg whitespace-pre-line leading-relaxed">{remainingText}</p>);
    }

    return elements;
  };
  
  const cardIdentifier = category.isSpecial ? '' : cardId;

  return (
    <div className="w-full h-full flex flex-col">
      <div style={{ backgroundColor: category.color, color: category.textColor }} className="py-3 px-4 text-center font-bold text-lg tracking-wider font-serif">
        {title.replace(/\n/g, ' ')}
      </div>
      <div className="flex-grow bg-white p-6 text-gray-800 flex flex-col justify-center items-center text-center overflow-y-auto">
        <div className="space-y-4 w-full">
          {taskText && <p className="text-xl font-bold italic text-gray-700 whitespace-pre-line">{taskText}</p>}
          {renderMainText()}
        </div>
      </div>
      <div style={{ backgroundColor: category.color, color: category.textColor }} className="py-2 px-4 text-center text-xs font-bold">
        {category.name} {cardIdentifier}
      </div>
    </div>
  );
};

interface PrayerCardProps {
  card: PrayerCardData;
  category: CategoryInfo;
}

export const PrayerCard: React.FC<PrayerCardProps & { isFlipped: boolean; onFlip: () => void; }> = ({ card, category, isFlipped, onFlip }) => {

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // We only want to flip the card if the click is on the background, not on buttons inside it
    if (e.target === e.currentTarget) {
        onFlip();
    }
  }

  return (
    <div className="w-full h-full [perspective:1000px]" onClick={handleCardClick}>
      <div
        className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d]"
        style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Front Face */}
        <div className="absolute inset-0 [backface-visibility:hidden] shadow-2xl rounded-2xl overflow-hidden">
          <CardContent 
            title={card.frontTitle} 
            mainText={card.frontText} 
            cardId={card.id} 
            category={category} 
          />
        </div>
        
        {/* Back Face */}
        <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-2xl rounded-2xl overflow-hidden">
          <CardContent 
            title={card.backTitle} 
            mainText={card.backText}
            taskText={card.backTask}
            cardId={card.id} 
            category={category} 
          />
        </div>
      </div>
    </div>
  );
};
