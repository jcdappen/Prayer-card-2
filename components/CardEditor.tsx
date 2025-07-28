
import React, { useState, useEffect } from 'react';
import type { PrayerCardData, CategoryInfo } from '../types';
import { PrayerCard } from './PrayerCard';
import { CATEGORIES } from '../constants';

interface CardEditorProps {
    cardToEdit: PrayerCardData | null;
    onSave: (card: PrayerCardData) => void;
    onCancel: () => void;
}

const emptyCard: PrayerCardData = {
    id: '',
    frontTitle: 'Titel der Vorderseite',
    frontText: 'Text der Vorderseite...',
    backTitle: 'Titel der Rückseite',
    backTask: 'Aufgabe für die Rückseite...',
    backText: 'Text der Rückseite...',
    category: 'MEINE KARTEN',
    isCustom: true,
};

export const CardEditor: React.FC<CardEditorProps> = ({ cardToEdit, onSave, onCancel }) => {
    const [cardData, setCardData] = useState<PrayerCardData>(emptyCard);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        if (cardToEdit) {
            setCardData(cardToEdit);
        } else {
            setCardData(emptyCard);
        }
    }, [cardToEdit]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCardData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (cardData.frontTitle.trim() === '' || cardData.frontText.trim() === '') {
            alert('Titel und Text der Vorderseite dürfen nicht leer sein.');
            return;
        }
        onSave(cardData);
    };

    const categoryInfo = CATEGORIES[cardData.category] as CategoryInfo;

    return (
        <div className="fixed inset-0 bg-gray-100 dark:bg-gray-900 z-50 p-4 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold font-serif text-center mb-6">
                    {cardToEdit ? 'Karte bearbeiten' : 'Neue Karte erstellen'}
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Editor Form */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold border-b pb-2">Vorderseite</h3>
                        <div>
                            <label htmlFor="frontTitle" className="block text-lg font-semibold mb-1">Titel</label>
                            <input
                                type="text"
                                id="frontTitle"
                                name="frontTitle"
                                value={cardData.frontTitle}
                                onChange={handleInputChange}
                                className="w-full p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="Titel der Vorderseite"
                            />
                        </div>
                        <div>
                            <label htmlFor="frontText" className="block text-lg font-semibold mb-1">Text</label>
                            <textarea
                                id="frontText"
                                name="frontText"
                                value={cardData.frontText}
                                onChange={handleInputChange}
                                rows={8}
                                className="w-full p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="Text der Vorderseite..."
                            />
                        </div>

                        <h3 className="text-xl font-semibold border-b pb-2 pt-4">Rückseite</h3>
                        <div>
                            <label htmlFor="backTitle" className="block text-lg font-semibold mb-1">Titel</label>
                            <input
                                type="text"
                                id="backTitle"
                                name="backTitle"
                                value={cardData.backTitle}
                                onChange={handleInputChange}
                                className="w-full p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="Titel der Rückseite"
                            />
                        </div>
                         <div>
                            <label htmlFor="backTask" className="block text-lg font-semibold mb-1">Aufgabe (optional)</label>
                            <textarea
                                id="backTask"
                                name="backTask"
                                value={cardData.backTask}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="Aufgabe für die Rückseite..."
                            />
                        </div>
                        <div>
                            <label htmlFor="backText" className="block text-lg font-semibold mb-1">Text</label>
                            <textarea
                                id="backText"
                                name="backText"
                                value={cardData.backText}
                                onChange={handleInputChange}
                                rows={5}
                                className="w-full p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="Text der Rückseite..."
                            />
                        </div>

                         <div className="flex justify-end gap-4 mt-6">
                            <button onClick={onCancel} className="px-6 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                                Abbrechen
                            </button>
                            <button onClick={handleSave} className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">
                                Speichern
                            </button>
                        </div>
                    </div>
                    
                    {/* Live Preview */}
                    <div className="space-y-4">
                         <h3 className="text-lg font-semibold text-center">Live-Vorschau</h3>
                         <div 
                           className="w-full max-w-sm h-[600px] mx-auto cursor-pointer"
                           onClick={() => setIsFlipped(!isFlipped)}
                           title="Klicken zum Umdrehen"
                         >
                            <PrayerCard card={cardData} category={categoryInfo} isFlipped={isFlipped} onFlip={() => setIsFlipped(!isFlipped)} />
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
