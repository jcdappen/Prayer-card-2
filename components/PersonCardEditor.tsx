
import React, { useState, useEffect, useRef } from 'react';
import type { PersonCardData, CategoryInfo } from '../types';
import { PersonCard } from './PersonCard';
import { CATEGORIES } from '../constants';
import { UserIcon } from './icons';

export type NewOrExistingPersonCard = PersonCardData | Omit<PersonCardData, 'id' | 'category'>;

interface PersonCardEditorProps {
    cardToEdit: PersonCardData | null;
    onSave: (card: NewOrExistingPersonCard) => void;
    onCancel: () => void;
}

const emptyCard: Omit<PersonCardData, 'id' | 'category'> = {
    name: '',
    imageUrl: '',
    thankfulFor: '',
    prayerPoints: '',
};

export const PersonCardEditor: React.FC<PersonCardEditorProps> = ({ cardToEdit, onSave, onCancel }) => {
    const [cardData, setCardData] = useState<NewOrExistingPersonCard>(emptyCard);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            setIsCompressing(true);

            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        setCardData(prev => ({ ...prev, imageUrl: img.src }));
                        setIsCompressing(false);
                        return;
                    }
                    ctx.drawImage(img, 0, 0, width, height);

                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

                    setCardData(prev => ({ ...prev, imageUrl: dataUrl }));
                    setIsCompressing(false);
                };
                img.onerror = () => {
                    console.error("Image could not be loaded.");
                    setIsCompressing(false);
                    alert("Das Bild konnte nicht geladen werden. Bitte versuchen Sie es mit einer anderen Datei.");
                };
            };
            
            reader.onerror = () => {
                console.error("File could not be read.");
                setIsCompressing(false);
                alert("Die Datei konnte nicht gelesen werden.");
            };

            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (cardData.name.trim() === '') {
            alert('Der Name der Person darf nicht leer sein.');
            return;
        }
        onSave(cardData);
    };

    const categoryInfo = CATEGORIES['PERSONEN'];
    
    const previewCardData: PersonCardData = {
        id: 'id' in cardData ? cardData.id : 'preview',
        category: 'PERSONEN',
        ...cardData,
    };

    return (
        <div className="fixed inset-0 bg-gray-100 dark:bg-gray-900 z-50 p-4 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold font-serif text-center mb-6">
                    {cardToEdit ? 'Person bearbeiten' : 'Neue Person hinzufügen'}
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Editor Form */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold border-b pb-2">Informationen</h3>
                        <div>
                            <label htmlFor="name" className="block text-lg font-semibold mb-1">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={cardData.name}
                                onChange={handleInputChange}
                                className="w-full p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="Name der Person"
                            />
                        </div>

                        <div>
                            <label className="block text-lg font-semibold mb-1">Bild</label>
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative">
                                     {isCompressing && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </div>
                                     )}
                                     {cardData.imageUrl ? (
                                        <img src={cardData.imageUrl} alt="Vorschau" className="w-full h-full object-cover"/>
                                     ) : (
                                        <UserIcon className="w-14 h-14 text-gray-400" />
                                     )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                    disabled={isCompressing}
                                />
                                <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50" disabled={isCompressing}>
                                    {isCompressing ? 'Verarbeite...' : 'Bild auswählen'}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="thankfulFor" className="block text-lg font-semibold mb-1">Dankbar für</label>
                            <textarea
                                id="thankfulFor"
                                name="thankfulFor"
                                value={cardData.thankfulFor}
                                onChange={handleInputChange}
                                rows={5}
                                className="w-full p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="Wofür sind Sie bei dieser Person dankbar?"
                            />
                        </div>

                        <div>
                            <label htmlFor="prayerPoints" className="block text-lg font-semibold mb-1">Gebetspunkte</label>
                            <textarea
                                id="prayerPoints"
                                name="prayerPoints"
                                value={cardData.prayerPoints}
                                onChange={handleInputChange}
                                rows={8}
                                className="w-full p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="Konkrete Gebetsanliegen..."
                            />
                        </div>

                         <div className="flex justify-end gap-4 mt-6">
                            <button onClick={onCancel} className="px-6 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                                Abbrechen
                            </button>
                            <button onClick={handleSave} className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50" disabled={isCompressing}>
                                {isCompressing ? 'Bild wird geladen...' : 'Speichern'}
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
                            <PersonCard card={previewCardData} category={categoryInfo} isFlipped={isFlipped} onFlip={() => setIsFlipped(!isFlipped)} />
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
