import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

const VisitCounter: React.FC = () => {
  const [visitCount, setVisitCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get stored visit count
    const storedCount = localStorage.getItem('visitCount');
    const count = storedCount ? parseInt(storedCount) : 0;
    
    // Increment count
    const newCount = count + 1;
    localStorage.setItem('visitCount', newCount.toString());
    setVisitCount(newCount);
    setIsLoading(false);
  }, []);

  return (
    <div className="fixed bottom-0 left-6 z-50 bg-white rounded-t-lg shadow-lg p-4 flex items-center space-x-3 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <Users className="w-6 h-6 text-blue-500" />
      <div className="flex items-center space-x-3">
        <p className="text-sm text-gray-600">Total Visits</p>
        <p className="text-xl font-bold text-gray-900">
          {isLoading ? '...' : visitCount.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default VisitCounter; 
