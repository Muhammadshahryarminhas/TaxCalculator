import React, { ChangeEvent } from 'react';
import { DollarSign, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';
import { Month } from './types';

interface SalaryInputProps {
  monthlySalary: number;
  newSalary: number;
  medicalPercentage: number;
  isRevised: boolean;
  revisionMonth: number;
  months: Month[];
  onMonthlySalaryChange: (salary: number) => void;
  onNewSalaryChange: (salary: number) => void;
  onMedicalPercentageChange: (percentage: number) => void;
  onIsRevisedChange: (isRevised: boolean) => void;
  onRevisionMonthChange: (month: number) => void;
  formatCurrency: (amount: number) => string;
  getFinancialYearPosition: (month: number) => number;
}

const SalaryInput: React.FC<SalaryInputProps> = ({
  monthlySalary,
  newSalary,
  medicalPercentage,
  isRevised,
  revisionMonth,
  months,
  onMonthlySalaryChange,
  onNewSalaryChange,
  onMedicalPercentageChange,
  onIsRevisedChange,
  onRevisionMonthChange,
  formatCurrency,
  getFinancialYearPosition,
}) => {
  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-lg p-4 md:p-8 border border-slate-200 gap-4">
      <h2 className="text-xl font-semibold text-slate-700 flex items-center">
        <DollarSign className="w-6 h-6 mr-2" />
        Salary Information
      </h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {isRevised ? 'Initial Monthly Salary (PKR)' : 'Monthly Salary (PKR)'}
          </label>
          <input
            type="number"
            value={monthlySalary}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onMonthlySalaryChange(Number(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-lg font-semibold"
            placeholder="Enter Salary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Medical Allowance (%)
          </label>
          <input
            type="number"
            value={medicalPercentage}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onMedicalPercentageChange(Number(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-lg font-semibold"
            placeholder="5"
            min="0"
            max="100"
          />
        </div>
      </div>

      {/* Salary Revision Toggle */}
      <div className=" p-4 bg-slate-50 rounded-lg border border-slate-200 ">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-2">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-600" />
            <span className="text-lg font-medium text-slate-700">Salary Revision</span>
            <span className="text-sm text-slate-500">(Financial Year: July - June)</span>
          </div>
          <button
            onClick={() => onIsRevisedChange(!isRevised)}
            className="flex items-center space-x-2 transition-colors duration-200"
          >
            {isRevised ? (
              <ToggleRight className="w-8 h-8 text-blue-500" />
            ) : (
              <ToggleLeft className="w-8 h-8 text-slate-400" />
            )}
            <span className={`font-medium ${isRevised ? 'text-blue-600' : 'text-slate-500'}`}>
              Is salary increased?
            </span>
          </button>
        </div>
        
        {isRevised && (
          <div className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Revision Month (Financial Year Order)
              </label>
              <select
                value={revisionMonth}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => onRevisionMonthChange(Number(e.target.value))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg font-semibold bg-white"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label} (Month {month.order})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Monthly Salary
              </label>
              <input
                type="number"
                value={newSalary}
                onChange={(e: ChangeEvent<HTMLInputElement>) => onNewSalaryChange(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg font-semibold"
                placeholder="Enter Value greater then monthly salary"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Salary Summary */}
      {isRevised && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 font-medium">
            Salary revised from {months.find(m => m.value === revisionMonth)?.label} 
            ({formatCurrency(monthlySalary)} → {formatCurrency(newSalary)})
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {getFinancialYearPosition(revisionMonth) - 1} months at old salary, {12 - (getFinancialYearPosition(revisionMonth) - 1)} months at new salary
          </p>
        </div>
      )}
    </div>
  );
};

export default SalaryInput; 