import React from 'react';
import { motion } from 'framer-motion';
import { FunctionSquare, Grid, PieChart, Binary, ListOrdered } from 'lucide-react';
import { CategoryType, ThemeType } from '../types';

interface SidebarProps {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  theme: ThemeType;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedCategory, onSelectCategory, theme }) => {
  const categories = [
    { id: 'analysis', name: 'Analyse', icon: FunctionSquare },
    { id: 'algebra', name: 'Algèbre', icon: Grid },
    { id: 'probability', name: 'Probabilités', icon: PieChart },
    { id: 'algorithms', name: 'Algorithmes', icon: Binary },
    { id: 'sequences', name: 'Suites', icon: ListOrdered },
  ] as const;

  return (
    <nav className={`w-72 p-6 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-white text-gray-800'
    } shadow-lg`}>
      <h2 className="text-xl font-bold mb-6">Catégories</h2>
      <div className="space-y-2">
        {categories.map(({ id, name, icon: Icon }) => (
          <motion.button
            key={id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCategory(id)}
            className={`w-full flex items-center p-4 rounded-lg transition-all ${
              selectedCategory === id
                ? 'bg-blue-500 text-white shadow-lg'
                : theme === 'dark'
                ? 'text-gray-300 hover:bg-gray-800'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-5 h-5 mr-3" />
            <span className="text-lg">{name}</span>
          </motion.button>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;