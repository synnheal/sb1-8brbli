import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Search } from 'lucide-react';
import Sidebar from './components/Sidebar';
import MathCalculator from './components/Calculator';
import SearchBar from './components/SearchBar';
import History from './components/History';
import { CategoryType, ThemeType, HistoryItem } from './types';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('analysis');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<ThemeType>('light');
  const [showSearch, setShowSearch] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('calculatorHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
  }, [history]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  const addToHistory = (item: HistoryItem) => {
    setHistory(prev => [item, ...prev].slice(0, 10));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setSelectedCategory(item.category);
    // The calculator component will handle the rest
  };

  return (
    <div className={`flex min-h-screen ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-800'
    } transition-colors duration-200`}>
      <Sidebar 
        selectedCategory={selectedCategory} 
        onSelectCategory={setSelectedCategory}
        theme={theme}
      />
      
      <main className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto space-y-8"
        >
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Calculateur Mathématique Avancé
              </h1>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                Résolvez des problèmes mathématiques complexes de niveau lycée
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSearch(true)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-800' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-800' 
                    : 'hover:bg-gray-100'
                }`}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <MathCalculator 
                category={selectedCategory}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                theme={theme}
                onCalculation={addToHistory}
              />
            </div>
            <div>
              <History
                items={history}
                theme={theme}
                onClear={clearHistory}
                onItemClick={loadHistoryItem}
              />
            </div>
          </div>
        </motion.div>
      </main>

      {showSearch && (
        <SearchBar
          onSearch={(category) => {
            setSelectedCategory(category);
            setShowSearch(false);
          }}
          theme={theme}
          onClose={() => setShowSearch(false)}
        />
      )}
    </div>
  );
}

export default App;