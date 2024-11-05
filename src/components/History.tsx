import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X } from 'lucide-react';
import { HistoryItem, ThemeType } from '../types';

interface HistoryProps {
  items: HistoryItem[];
  theme: ThemeType;
  onClear: () => void;
  onItemClick: (item: HistoryItem) => void;
}

const History: React.FC<HistoryProps> = ({ items, theme, onClear, onItemClick }) => {
  if (items.length === 0) return null;

  return (
    <div className={`rounded-xl shadow-lg p-6 ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <h3 className="text-lg font-medium">Historique</h3>
        </div>
        <button
          onClick={onClear}
          className="text-red-500 hover:text-red-600 p-2 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence>
        <div className="space-y-3">
          {items.map((item) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={() => onItemClick(item)}
              className={`w-full text-left p-4 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">{item.operation}</span>
                <span className="text-sm opacity-60">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="font-mono text-sm opacity-80">{item.input}</p>
              <p className={`font-mono text-sm mt-2 ${
                theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
              }`}>
                {item.solution.finalResult}
              </p>
            </motion.button>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default History;