
import React from 'react';

export const HowToUse: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 my-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold font-serif text-gray-800 dark:text-gray-100 mb-6 text-center">How to Use These Cards</h2>
      
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
            <li>Create your own custom set for each day of the week.</li>
            <li>Arrange a set for morning, noon, and night.</li>
            <li>Focus on one color/type of prayer each prayer time.</li>
            <li>Shuffle and pray 5-7 cards at random.</li>
          </ul>
        </div>
      </div>
       <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
        Scriptures are taken from the NIV and TPT translations.
      </p>
    </div>
  );
};
