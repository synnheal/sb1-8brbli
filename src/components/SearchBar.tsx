import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { CategoryType, ThemeType } from '../types';

interface SearchBarProps {
  onSearch: (category: CategoryType) => void;
  theme: ThemeType;
  onClose: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, theme, onClose }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const categories = {
    'analyse': 'analysis',
    'dérivée': 'analysis',
    'intégrale': 'analysis',
    'limite': 'analysis',
    'algèbre': 'algebra',
    'équation': 'algebra',
    'matrice': 'algebra',
    'probabilité': 'probability',
    'statistique': 'probability',
    'algorithme': 'algorithms',
    'tri': 'algorithms',
    'suite': 'sequences',
    'série': 'sequences',
  } as const;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const lowercaseQuery = query.toLowerCase();
    const matches = Object.keys(categories).filter(key =>
      key.toLowerCase().includes(lowercaseQuery)
    );
    setSuggestions(matches);
  }, [query]);

  const handleSelect = (key: string) => {
    const category = categories[key as keyof typeof categories];
    onSearch(category);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 ${
        theme === 'dark' ? 'bg-gray-900/90' : 'bg-gray-50/90'
      }`}
    >
      <div className={`w-full max-w-2xl rounded-xl shadow-2xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une fonction mathématique..."
            className={`w-full pl-12 pr-4 py-4 rounded-t-xl border-b ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-200'
            } focus:outline-none`}
          />
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-h-96 overflow-y-auto"
            >
              {suggestions.map((key) => (
                <button
                  key={key}
                  onClick={() => handleSelect(key)}
                  className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-200 hover:bg-gray-700'
                      : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {key}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SearchBar;