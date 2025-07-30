
import React from 'react';
import type { PrayerCardData, CategoryInfo } from '../types';

interface CardContentProps {
  title: string;
  taskText?: string;
  cardId: string;
  category: CategoryInfo;
  mainText?: string;
  frontContent?: PrayerCardData['frontContent'];
}

const CardContent: React.FC<CardContentProps> = ({ title, mainText, taskText, cardId, category, frontContent }) => {
  const renderContent = () => {
    if (frontContent) {
      const { text1, ref1, text2, ref2, text3, ref3 } = frontContent;
      const verses = [
        { text: text1, reference: ref1 },
        { text: text2, reference: ref2 },
        { text: text3, reference: ref3 },
      ];
      return (
        <div className="space-y-6">
          {verses.filter(v => v.text && v.text.trim()).map((verse, index) => (
            <div key={index}>
              <p className="text-lg whitespace-pre-line leading-relaxed italic">{verse.text}</p>
              {verse.reference && verse.reference.trim() && <p className="text-sm font-bold text-gray-500 mt-2 text-right">{verse.reference}</p>}
            </div>
          ))}
        </div>
      );
    }

    if (mainText) {
      // This is the old rendering logic for back text and custom cards
      const allBookNames = [
          'PSALM', 'GENESIS', 'REVELATION', 'LUKE', 'EXODUS', '1 THESSALONIANS', 
          '1 PETER', 'ZEPHANIAH', 'JOHN', '1 CHRONICLES', 'MATTHEW', 'HEBREWS', 
          '1 CORINTHIANS', '2 CORINTHIANS', 'PHILIPPIANS', 'PROVERBS', '2 TIMOTHY', 
          'ROMANS', '1 SAMUEL', 'COLOSSIANS', 'DEUTERONOMY', 'JEREMIAH', 'ISAIAH', 
          'HABAKKUK', 'NUMBERS', '2 CHRONICLES', 'MARK', 'GALATIANS', '1 JOHN', '2 PETER', 'JOSHUA'
      ];
      
      // This regex finds book names followed by chapter/verse numbers.
      const splittingRegex = new RegExp(`\\b(${allBookNames.join('|').replace(/\s/g, '\\s')})\\s+[\\d:,\\s-–]+`, 'gi');
      
      const scriptureMatches = [...mainText.matchAll(splittingRegex)];
      
      if (scriptureMatches.length === 0) {
        return <p className="text-lg whitespace-pre-line leading-relaxed">{mainText}</p>;
      }
  
      const elements: React.ReactNode[] = [];
      let lastIndex = 0;
  
      scriptureMatches.forEach((match, idx) => {
          if (match.index === undefined) return;
  
          const quoteText = mainText.substring(lastIndex, match.index).trim();
          if (quoteText) {
              elements.push(<p key={`quote-${idx}`} className="text-lg whitespace-pre-line leading-relaxed italic">{quoteText}</p>);
          }
  
          const scriptureText = match[0].trim().replace(/,$/, '');
          elements.push(<p key={`scripture-${idx}`} className="text-sm font-bold text-gray-500 mt-1">{scriptureText}</p>);
  
          lastIndex = match.index + match[0].length;
      });
  
      const remainingText = mainText.substring(lastIndex).trim();
      if (remainingText) {
          elements.push(<p key="remaining" className="text-lg whitespace-pre-line leading-relaxed">{remainingText}</p>);
      }
  
      return elements;
    }

    return null;
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
          {renderContent()}
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

  const handleCardClick = () => {
    onFlip();
  }

  return (
    <div className="w-full h-full [perspective:1000px] cursor-pointer" onClick={handleCardClick}>
      <div
        className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d]"
        style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Front Face */}
        <div className="absolute inset-0 [backface-visibility:hidden] shadow-2xl rounded-2xl overflow-hidden">
          <CardContent 
            title={card.frontTitle} 
            cardId={card.id} 
            category={category}
            frontContent={card.frontContent}
            mainText={card.frontText}
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
