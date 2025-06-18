import React, { ChangeEvent } from 'react';

interface HeaderProps {
  fiscalYear: string;
  onFiscalYearChange: (year: string) => void;
}

const Header: React.FC<HeaderProps> = ({ fiscalYear, onFiscalYearChange }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between">
      <div className="flex items-center mb-8 md:mb-0">
        <img src="/favicon.png" alt="Tax Calculator" className="w-12 h-12 mr-3" />
        <h1 className="text-3xl font-bold text-slate-800">Pakistan Salary Tax Calculator {fiscalYear}</h1>
      </div>
      
      <div className="flex justify-end w-full">
        <select
          value={fiscalYear}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onFiscalYearChange(e.target.value)}
          className="md:w-auto w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-lg font-semibold bg-white"
        >
          <option value="2024-25">2024-25</option>
          <option value="2025-26">2025-26</option>
        </select>
      </div>
    </div>
  );
};

export default Header; 