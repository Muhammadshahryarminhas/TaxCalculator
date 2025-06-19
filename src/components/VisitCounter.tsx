import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

const API_URL = 'http://localhost:5000/visit';

const VisitCounter: React.FC = () => {
  const [visitCount, setVisitCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const hasCounted = sessionStorage.getItem('hasCounted');

    const fetchVisitCount = async () => {
      try {
        // Always POST, since the backend only supports POST
        const response = await fetch(API_URL, { method: 'POST' });
        const data = await response.json();
        setVisitCount(data.totalVisits);
      } catch (error) {
        setVisitCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    if (!hasCounted) {
      // First visit in this session: count and fetch
      fetchVisitCount();
      sessionStorage.setItem('hasCounted', 'true');
    } else {
      // Already counted in this session: just fetch (POST again)
      fetchVisitCount();
    }
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
