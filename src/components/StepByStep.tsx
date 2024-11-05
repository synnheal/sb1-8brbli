import React from 'react';
import { motion } from 'framer-motion';
import { Solution, ThemeType } from '../types';

interface StepByStepProps {
  solution: Solution;
  theme: ThemeType;
}

const StepByStep: React.FC<StepByStepProps> = ({ solution, theme }) => {
  return (
    <div className="space-y-4">
      {solution.steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <p className={`text-sm mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {step.description}
          </p>
          <p className={`font-mono text-lg ${
            theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
          }`}>
            {step.expression}
          </p>
        </motion.div>
      ))}
      
      <div className={`p-4 rounded-lg ${
        theme === 'dark' 
          ? 'bg-blue-500 bg-opacity-20' 
          : 'bg-blue-50'
      }`}>
        <p className={`text-sm mb-2 font-medium ${
          theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
        }`}>
          Résultat final
        </p>
        <p className={`font-mono text-lg font-bold ${
          theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
        }`}>
          {solution.finalResult}
        </p>
      </div>
    </div>
  );
};

export default StepByStep;