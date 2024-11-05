import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as math from 'mathjs';
import { CategoryType, ThemeType, Solution } from '../types';
import LoadingSpinner from './LoadingSpinner';
import StepByStep from './StepByStep';
import { ChevronDown, ChevronUp, Calculator } from 'lucide-react';

interface CalculatorProps {
  category: CategoryType;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  theme: ThemeType;
}

const operations = {
  analysis: [
    { id: 'limit', name: 'Limite', placeholder: 'Ex: lim(x -> 0, sin(x)/x)' },
    { id: 'derivative', name: 'Dérivée', placeholder: 'Ex: x^2 + 2*x + 1' },
    { id: 'integral', name: 'Intégrale', placeholder: 'Ex: x^2 + 2*x + 1' },
    { id: 'differential', name: 'Équation différentielle', placeholder: 'Ex: y\' = 2*x' }
  ],
  algebra: [
    { id: 'matrix', name: 'Calcul matriciel', placeholder: 'Ex: [1, 2; 3, 4]' },
    { id: 'linear', name: 'Système linéaire', placeholder: 'Ex: 2*x + y = 10' },
    { id: 'vector', name: 'Calcul vectoriel', placeholder: 'Ex: [1, 2, 3] * [4, 5, 6]' }
  ],
  probability: [
    { id: 'distribution', name: 'Lois de probabilité', placeholder: 'Ex: random(1, 6)' },
    { id: 'confidence', name: 'Intervalle de confiance', placeholder: 'Ex: std([1,2,3,4,5])' },
    { id: 'hypothesis', name: 'Test d\'hypothèse', placeholder: 'Ex: mean([1,2,3,4,5])' }
  ],
  algorithms: [
    { id: 'sort', name: 'Algorithmes de tri', placeholder: 'Ex: [3, 1, 4, 1, 5]' },
    { id: 'search', name: 'Recherche', placeholder: 'Ex: index([1,2,3,4,5], 3)' },
    { id: 'recursion', name: 'Récursivité', placeholder: 'Ex: factorial(5)' }
  ],
  sequences: [
    { id: 'sequence', name: 'Suite numérique', placeholder: 'Ex: range(1, 10)' },
    { id: 'series', name: 'Série', placeholder: 'Ex: sum(range(1, 10))' },
    { id: 'convergence', name: 'Convergence', placeholder: 'Ex: sum(1 ./ range(1, 100))' }
  ]
};

const MathCalculator: React.FC<CalculatorProps> = ({ 
  category, 
  isLoading, 
  setIsLoading,
  theme 
}) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedOperation, setSelectedOperation] = useState('');
  const [showSteps, setShowSteps] = useState(false);

  const validateInput = (input: string): boolean => {
    if (!input.trim()) {
      setError('Veuillez entrer une expression mathématique');
      return false;
    }

    try {
      if (selectedOperation === 'linear') {
        const parts = input.split('=').map(p => p.trim());
        if (parts.length !== 2) {
          throw new Error('Format incorrect pour l\'équation linéaire');
        }
        math.parse(parts[0]);
        math.parse(parts[1]);
      } else {
        math.parse(input);
      }
      return true;
    } catch (e) {
      setError('Expression mathématique invalide');
      return false;
    }
  };

  const getPlaceholder = () => {
    const operation = operations[category].find(op => op.id === selectedOperation);
    return operation?.placeholder || 'Entrez votre expression...';
  };

  const generateSteps = (input: string, operation: string): Solution => {
    const steps: Solution = {
      steps: [],
      finalResult: ''
    };

    switch (operation) {
      case 'linear':
        const [leftSide, rightSide] = input.split('=').map(p => p.trim());
        steps.steps.push({
          description: "Déplacer tous les termes vers la gauche",
          expression: `${leftSide} - (${rightSide}) = 0`
        });
        
        const expr = math.parse(`${leftSide}-(${rightSide})`);
        const simplified = math.simplify(expr);
        
        steps.steps.push({
          description: "Simplifier l'expression",
          expression: `${simplified.toString()} = 0`
        });
        
        steps.finalResult = `${simplified.toString()} = 0`;
        break;

      case 'derivative':
        steps.steps.push({
          description: "Expression initiale",
          expression: input
        });
        
        const derivative = math.derivative(input, 'x');
        steps.steps.push({
          description: "Appliquer les règles de dérivation",
          expression: derivative.toString()
        });
        
        steps.finalResult = derivative.toString();
        break;

      default:
        steps.steps.push({
          description: "Calcul direct",
          expression: input
        });
        steps.finalResult = math.evaluate(input).toString();
    }

    return steps;
  };

  const calculateResult = async () => {
    if (!validateInput(input)) {
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const solution = generateSteps(input, selectedOperation);
      setSolution(solution);
      setResult(solution.finalResult);
      setShowSteps(true);
    } catch (error) {
      console.error('Calculation error:', error);
      setError(
        error instanceof Error 
          ? `Erreur: ${error.message}` 
          : 'Une erreur est survenue lors du calcul.'
      );
      setResult(null);
      setSolution(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`rounded-xl shadow-lg p-8 space-y-8 ${
      theme === 'dark' 
        ? 'bg-gray-800' 
        : 'bg-white'
    }`}>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {operations[category].map((op) => (
          <motion.button
            key={op.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedOperation(op.id);
              setResult(null);
              setError(null);
              setSolution(null);
              setInput('');
            }}
            className={`p-6 rounded-lg text-left transition-all ${
              selectedOperation === op.id
                ? 'bg-blue-500 text-white shadow-lg'
                : theme === 'dark'
                ? 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="block font-medium text-lg mb-2">{op.name}</span>
            <span className="block text-sm opacity-80">
              {op.placeholder}
            </span>
          </motion.button>
        ))}
      </div>

      <div className="space-y-6">
        <div>
          <label className={`block text-lg font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Expression mathématique
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                calculateResult();
              }
            }}
            className={`w-full p-4 text-lg rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              error 
                ? 'border-red-500' 
                : theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'border-gray-300 bg-white'
            }`}
            placeholder={getPlaceholder()}
          />
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={calculateResult}
          className="w-full bg-blue-500 text-white py-4 rounded-lg text-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          disabled={isLoading || !selectedOperation}
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <Calculator className="w-5 h-5" />
              <span>Calculer</span>
            </>
          )}
        </motion.button>

        <AnimatePresence>
          {solution && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mt-6 rounded-lg overflow-hidden ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <button
                onClick={() => setShowSteps(!showSteps)}
                className={`w-full p-4 flex items-center justify-between text-lg font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}
              >
                <span>Solution détaillée</span>
                {showSteps ? <ChevronUp /> : <ChevronDown />}
              </button>
              
              {showSteps && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-600">
                  <StepByStep solution={solution} theme={theme} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MathCalculator;