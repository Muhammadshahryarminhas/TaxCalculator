import React from 'react';
import { Receipt, Heart } from 'lucide-react';
import { TaxSlabs } from './types';

interface TaxCalculationCardProps {
  fiscalYear: string;
  taxSlabs: TaxSlabs;
  calculations: {
    taxWithoutMedical: number;
    monthlyTaxWithoutMedical: number;
    taxWithMedical: number;
    monthlyTaxWithMedical: number;
  };
  formatCurrency: (amount: number) => string;
}

const TaxCalculationCard: React.FC<TaxCalculationCardProps> = ({
  fiscalYear,
  taxSlabs,
  calculations,
  formatCurrency,
}) => {
  const getTaxSlabsDisplay = (fiscalYear: string): string[] => {
    const slabs = taxSlabs[fiscalYear].slabs;
    return slabs.map((slab, index) => {
      if (index === 0) return `Up to Rs ${slab.max.toLocaleString()}: ${(slab.rate * 100)}%`;
      if (index === 1 && fiscalYear === '2024-25') {
        return `Rs ${slab.min.toLocaleString()} - Rs ${slab.max.toLocaleString()}: ${(slab.rate * 100)}%`;
      }
      if (index === 1 && fiscalYear === '2025-26') {
        return `Rs ${slab.min.toLocaleString()} - Rs ${slab.max.toLocaleString()}: ${(slab.rate * 100)}%`;
      }
      if (slab.max === Infinity) {
        return `Above Rs ${slab.min.toLocaleString()}: ${(slab.rate * 100)}%`;
      }
      return `Rs ${slab.min.toLocaleString()} - Rs ${slab.max.toLocaleString()}: ${(slab.rate * 100)}%`;
    });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {/* Card 1: Tax Without Medical Deduction */}
      <div className="bg-white rounded-2xl shadow-lg border-t-4 border-t-red-500 overflow-hidden">
        <div className="bg-red-50 px-6 py-4 md:px-8 md:py-6 border-b border-red-100">
          <div>
            <h3 className="text-xl font-bold text-red-800 flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Tax Without Medical Deduction
            </h3>
            <p className="text-red-600 text-sm">Fiscal Year {fiscalYear}</p>
          </div>
        </div>
        <div className="p-4 md:p-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-slate-600">Annual Tax</span>
              <span className="font-bold text-lg text-red-600">{formatCurrency(calculations.taxWithoutMedical)}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-slate-600">Monthly Tax</span>
              <span className="font-bold text-lg text-red-600">{formatCurrency(calculations.monthlyTaxWithoutMedical)}</span>
            </div>
          </div>
          
          {/* Tax Slabs */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-3">Tax Slabs {fiscalYear}</h4>
            <div className="text-xs text-slate-600 space-y-1">
              {getTaxSlabsDisplay(fiscalYear).map((slab, index) => (
                <div key={index}>{slab}</div>
              ))}
              <div className="text-gray-500 text-sm mb-2">
                Source: <a href="https://www.pwc.com.pk/en/tax-memorandum/AFFs%20Tax%20Memorandum%20on%20Finance%20Bill%202025.pdf?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">PwC Tax Memorandum on Finance Bill 2025</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Tax With Medical Deduction */}
      <div className="bg-white rounded-2xl shadow-lg border-t-4 border-t-emerald-500 overflow-hidden">
        <div className="bg-emerald-50 px-6 py-4 md:px-8 md:py-6 border-b border-emerald-100">
          <div>
            <h3 className="text-xl font-bold text-emerald-800 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Tax With Medical Deduction
            </h3>
            <p className="text-emerald-600 text-sm">Fiscal Year {fiscalYear}</p>
          </div>
        </div>
        <div className="p-4 md:p-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-slate-600">Annual Tax After Medical</span>
              <span className="font-bold text-lg text-emerald-600">{formatCurrency(calculations.taxWithMedical)}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-slate-600">Monthly Tax After Medical</span>
              <span className="font-bold text-lg text-emerald-600">{formatCurrency(calculations.monthlyTaxWithMedical)}</span>
            </div>
          </div>
          
          {/* Savings Preview */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-3">Tax Savings</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Annual Savings</span>
                <span className="font-semibold text-emerald-600">
                  {formatCurrency(calculations.taxWithoutMedical - calculations.taxWithMedical)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Monthly Savings</span>
                <span className="font-semibold text-emerald-600">
                  {formatCurrency(calculations.monthlyTaxWithoutMedical - calculations.monthlyTaxWithMedical)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxCalculationCard; 