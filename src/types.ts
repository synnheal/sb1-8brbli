export type CategoryType = 'analysis' | 'algebra' | 'probability' | 'algorithms' | 'sequences';

export type ThemeType = 'light' | 'dark';

export interface Step {
  description: string;
  expression: string;
}

export interface Solution {
  steps: Step[];
  finalResult: string;
  variables?: Record<string, number>;
}

export interface HistoryItem {
  id: string;
  category: CategoryType;
  operation: string;
  input: string;
  solution: Solution;
  timestamp: number;
}