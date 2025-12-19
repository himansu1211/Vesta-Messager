import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = "Loading Vesta..." }) => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-orange-50">
      <div className="bg-orange-500 p-4 rounded-3xl mb-6 shadow-lg shadow-orange-200 animate-spin">
        <Loader2 size={40} className="text-white" />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2 animate-pulse">{message}</h1>
    </div>
  );
};

export default LoadingSpinner;
