import React from 'react';
import type { IconProps } from './icons';

interface FeatureTileProps {
  title: string;
  description: string;
  Icon: React.FC<IconProps>;
  onClick: () => void;
}

export const FeatureTile: React.FC<FeatureTileProps> = ({ title, description, Icon, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="p-6 rounded-lg shadow-lg cursor-pointer transform hover:scale-[1.02] transition-transform duration-300 flex items-center gap-6 relative backdrop-blur-md border border-white/20 bg-gray-500/30 dark:bg-gray-700/50"
    >
      <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full bg-white/20">
        <Icon className="w-9 h-9 text-white" />
      </div>
      <div>
        <h3 className="text-2xl font-bold font-serif tracking-wide text-gray-800 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-white/80 mt-1">
          {description}
        </p>
      </div>
    </div>
  );
};
