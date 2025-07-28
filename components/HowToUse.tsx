
import React, { useState } from 'react';
import { ChevronDownIcon } from './icons';

export const HowToUse: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl my-8 max-w-4xl mx-auto overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-6 md:p-8 text-left"
        aria-expanded={isOpen}
        aria-controls="how-to-use-content"
      >
        <h2 className="text-3xl font-bold font-serif text-gray-800 dark:text-gray-100">
          How to Use These Cards
        </h2>
        <ChevronDownIcon
          className={`w-6 h-6 text-gray-600 dark:text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        id="how-to-use-content"
        className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
        style={{ transitionProperty: 'max-height, opacity' }}
      >
        <div className="px-6 md:px-8 pb-8 pt-0">
          <div className="text-center mb-8 border-b pb-6 dark:border-gray-700">
            <h3 className="text-xl font-bold font-serif mb-3 text-gray-800 dark:text-gray-200">Bedienung</h3>
            <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Jede Karte hat eine Vorder- und eine Rückseite. Klicken Sie auf eine Karte oder das Symbol, um sie umzudrehen. Mit den Pfeilen links und rechts wechseln Sie zur nächsten oder vorherigen Karte.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="text-xl font-bold font-serif mb-3 text-gray-800 dark:text-gray-200">Practice</h3>
              <ul className="space-y-4 list-decimal list-inside">
                <li>
                  <span className="font-bold">Slower is better.</span> Slow down to experience, not just read. Let the words sink into your spirit.
                </li>
                <li>
                  <span className="font-bold">Practice the Rule of Five.</span> Read each verse and each line of each prayer five times.
                </li>
                <li>
                  <span className="font-bold">Practice posture.</span> Some prayers inspire raised hands or bent knees. Engage your heart, soul, mind, and body.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif mb-3 text-gray-800 dark:text-gray-200">Ideas to Get Started</h3>
              <ul className="space-y-4 list-disc list-inside">
                <li>Pick one of each prayer type/color.</li>
                <li>Create your own custom cards.</li>
                <li>Focus on one color/type of prayer each prayer time.</li>
                <li>Mark your favorite cards.</li>
              </ul>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
            Scriptures are taken from the NIV and TPT translations.
          </p>
        </div>
      </div>
    </div>
  );
};
