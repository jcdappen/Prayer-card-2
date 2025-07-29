
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { CloseIcon } from './icons';
import type { Session } from '@supabase/supabase-js';

interface AuthProps {
  onClose: () => void;
  onLogin: (session: Session) => void;
}

export const Auth: React.FC<AuthProps> = ({ onClose, onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const authMethod = isSignUp ? supabase.auth.signUp : supabase.auth.signInWithPassword;

    const { data, error } = await authMethod({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      if (isSignUp && data.user && !data.session) {
        setMessage('Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mails, um Ihr Konto zu bestätigen.');
      } else if (isSignUp && data.session) {
        setMessage('Registrierung erfolgreich! Sie sind nun angemeldet.');
        onLogin(data.session);
      } else if (!isSignUp && data.session) {
         onLogin(data.session);
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="relative bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md text-gray-800 dark:text-gray-200">
        <button onClick={onClose} aria-label="Schließen" className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          <CloseIcon className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold font-serif mb-4 text-center">{isSignUp ? 'Konto erstellen' : 'Anmelden'}</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          {isSignUp ? 'Erstellen Sie ein Konto, um Ihre eigenen Gebetskarten und Favoriten zu speichern.' : 'Melden Sie sich an, um auf Ihre Daten zuzugreifen.'}
        </p>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
        {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{message}</div>}

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-Mail Adresse</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">Passwort (mind. 6 Zeichen)</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              minLength={6}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition"
            >
              {loading ? 'Laden...' : (isSignUp ? 'Registrieren' : 'Anmelden')}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm">
          {isSignUp ? 'Haben Sie bereits ein Konto? ' : 'Haben Sie noch kein Konto? '}
          <button onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); }} className="font-medium text-blue-600 hover:text-blue-500">
            {isSignUp ? 'Anmelden' : 'Registrieren'}
          </button>
        </p>
      </div>
    </div>
  );
};
