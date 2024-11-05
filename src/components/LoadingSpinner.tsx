import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
      <span className="ml-2">Calcul en cours...</span>
    </div>
  );
};

export default LoadingSpinner;