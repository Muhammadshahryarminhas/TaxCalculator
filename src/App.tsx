import React, { useState, useMemo, ChangeEvent } from 'react';
import { Calculator, DollarSign, Receipt, Heart, ToggleLeft, ToggleRight, Calendar, BarChart3 } from 'lucide-react';

// Define types for tax slabs
type TaxSlab = {
  min: number;
  max: number;
  rate: number;
  minTax: number | null;
  maxTax?: number;
};

type TaxSlabs = {
  [key: string]: {
    slabs: TaxSlab[];
  };
};

// Tax calculation functions for different fiscal years
const taxSlabs: TaxSlabs = {
  '2024-25': {
    slabs: [
      { min: 0, max: 600000, rate: 0, minTax: 0 },
      { min: 600001, max: 1200000, rate: 0.05, minTax: 2500 },
      { min: 1200001, max: 2200000, rate: 0.15, minTax: null },
      { min: 2200001, max: 3200000, rate: 0.25, minTax: null },
      { min: 3200001, max: 4100000, rate: 0.30, minTax: null },
      { min: 4100001, max: Infinity, rate: 0.35, minTax: null }
    ]
  },
  '2025-26': {
    slabs: [
      { min: 0, max: 600000, rate: 0, minTax: 0 },
      { min: 600001, max: 1200000, rate: 0.01, minTax: null, maxTax: 6000 },
      { min: 1200001, max: 2200000, rate: 0.11, minTax: null },
      { min: 2200001, max: 3200000, rate: 0.23, minTax: null },
      { min: 3200001, max: 4100000, rate: 0.30, minTax: null },
      { min: 4100001, max: Infinity, rate: 0.35, minTax: null }
    ]
  }
};

const calculateTax = (annualSalary: number, fiscalYear: string): number => {
  if (fiscalYear === '2024-25') {
    // Using the updated Excel formula for 2024-25
    // =IF(B3<=600000,0,IF(B3<=1200000,MAX(2500,(B3-600000)*0.05),IF(B3<=2200000,30000+(B3-1200000)*0.15,IF(B3<=3200000,180000+(B3-2200000)*0.25,IF(B3<=4100000,430000+(B3-3200000)*0.3,700000+(B3-4100000)*0.35)))))
    if (annualSalary <= 600000) {
      return 0;
    } else if (annualSalary <= 1200000) {
      return Math.max(2500, (annualSalary - 600000) * 0.05);
    } else if (annualSalary <= 2200000) {
      return 30000 + (annualSalary - 1200000) * 0.15;
    } else if (annualSalary <= 3200000) {
      return 180000 + (annualSalary - 2200000) * 0.25;
    } else if (annualSalary <= 4100000) {
      return 430000 + (annualSalary - 3200000) * 0.3;
    } else {
      return 700000 + (annualSalary - 4100000) * 0.35;
    }
  } else {
    // 2025-26 calculation
    if (annualSalary <= 600000) {
      return 0;
    } else if (annualSalary <= 1200000) {
      return Math.min(6000, (annualSalary - 600000) * 0.01);
    } else if (annualSalary <= 2200000) {
      return 6000 + (annualSalary - 1200000) * 0.11;
    } else if (annualSalary <= 3200000) {
      return 116000 + (annualSalary - 2200000) * 0.23;
    } else if (annualSalary <= 4100000) {
      return 346000 + (annualSalary - 3200000) * 0.3;
    } else {
      return 616000 + (annualSalary - 4100000) * 0.35;
    }
  }
};

function App() {
  const [fiscalYear, setFiscalYear] = useState<string>('2025-26');
  const [monthlySalary, setMonthlySalary] = useState<number>(60000);
  const [medicalPercentage, setMedicalPercentage] = useState<number>(10);
  const [isRevised, setIsRevised] = useState<boolean>(false);
  const [revisionMonth, setRevisionMonth] = useState<number>(7);
  const [newSalary, setNewSalary] = useState<number>(60000);

  const months = [
    { value: 7, label: 'July', short: 'Jul', order: 1 },
    { value: 8, label: 'August', short: 'Aug', order: 2 },
    { value: 9, label: 'September', short: 'Sep', order: 3 },
    { value: 10, label: 'October', short: 'Oct', order: 4 },
    { value: 11, label: 'November', short: 'Nov', order: 5 },
    { value: 12, label: 'December', short: 'Dec', order: 6 },
    { value: 1, label: 'January', short: 'Jan', order: 7 },
    { value: 2, label: 'February', short: 'Feb', order: 8 },
    { value: 3, label: 'March', short: 'Mar', order: 9 },
    { value: 4, label: 'April', short: 'Apr', order: 10 },
    { value: 5, label: 'May', short: 'May', order: 11 },
    { value: 6, label: 'June', short: 'Jun', order: 12 }
  ];

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getFinancialYearPosition = (month: number): number => {
    if (month >= 7) {
      return month - 6;
    } else {
      return month + 6;
    }
  };

  const calculations = useMemo(() => {
    let annualSalary, monthlyMedicalAllowance, monthlyTaxableSalary, annualTaxableSalary;

    if (isRevised) {
      const revisionPosition = getFinancialYearPosition(revisionMonth);
      const monthsWithOldSalary = revisionPosition - 1;
      const monthsWithNewSalary = 12 - monthsWithOldSalary;
      
      annualSalary = (monthlySalary * monthsWithOldSalary) + (newSalary * monthsWithNewSalary);
      
      monthlyMedicalAllowance = (newSalary * medicalPercentage) / 100;
      monthlyTaxableSalary = newSalary - monthlyMedicalAllowance;
      
      const oldMedical = (monthlySalary * medicalPercentage) / 100;
      const oldTaxable = monthlySalary - oldMedical;
      const newMedical = (newSalary * medicalPercentage) / 100;
      const newTaxable = newSalary - newMedical;
      
      annualTaxableSalary = (oldTaxable * monthsWithOldSalary) + (newTaxable * monthsWithNewSalary);
    } else {
      annualSalary = monthlySalary * 12;
      monthlyMedicalAllowance = (monthlySalary * medicalPercentage) / 100;
      monthlyTaxableSalary = monthlySalary - monthlyMedicalAllowance;
      annualTaxableSalary = monthlyTaxableSalary * 12;
    }

    const taxWithoutMedical = Math.round(calculateTax(annualSalary, fiscalYear));
    const taxWithMedical = Math.round(calculateTax(annualTaxableSalary, fiscalYear));

    return {
      inputs: { monthlySalary, newSalary, medicalPercentage, isRevised, revisionMonth },
      annualSalary,
      monthlyMedicalAllowance,
      monthlyTaxableSalary,
      annualTaxableSalary,
      taxWithoutMedical,
      monthlyTaxWithoutMedical: Math.round(taxWithoutMedical / 12),
      taxWithMedical,
      monthlyTaxWithMedical: Math.round(taxWithMedical / 12),
    };
  }, [fiscalYear, monthlySalary, medicalPercentage, isRevised, revisionMonth, newSalary]);

  const getTaxSlabsDisplay = (fiscalYear: string): string[] => {
    const slabs = taxSlabs[fiscalYear].slabs;
    return slabs.map((slab, index) => {
      if (index === 0) return `Up to Rs ${slab.max.toLocaleString()}: ${(slab.rate * 100)}%`;
      if (index === 1 && fiscalYear === '2024-25') {
        return `Rs ${slab.min.toLocaleString()} - Rs ${slab.max.toLocaleString()}: Max(Rs ${slab.minTax?.toLocaleString() ?? '0'}, ${(slab.rate * 100)}%)`;
      }
      if (index === 1 && fiscalYear === '2025-26') {
        return `Rs ${slab.min.toLocaleString()} - Rs ${slab.max.toLocaleString()}: Min(Rs ${slab.maxTax?.toLocaleString() ?? '0'}, ${(slab.rate * 100)}%)`;
      }
      if (slab.max === Infinity) {
        return `Above Rs ${slab.min.toLocaleString()}: ${(slab.rate * 100)}%`;
      }
      return `Rs ${slab.min.toLocaleString()} - Rs ${slab.max.toLocaleString()}: ${(slab.rate * 100)}%`;
    });
  };

  const getMonthlyBreakdown = (withMedical: boolean) => {
    return months.map((month) => {
      const monthPosition = getFinancialYearPosition(month.value);
      let monthlyTax;
      let salary;

      if (isRevised) {
        const revisionPosition = getFinancialYearPosition(revisionMonth);
        if (monthPosition < revisionPosition) {
          salary = monthlySalary;
        } else {
          salary = newSalary;
        }
      } else {
        salary = monthlySalary;
      }

      if (withMedical) {
        const medical = (salary * medicalPercentage) / 100;
        const taxableSalary = salary - medical;
        monthlyTax = Math.round(calculateTax(taxableSalary * 12, fiscalYear) / 12);
      } else {
        monthlyTax = Math.round(calculateTax(salary * 12, fiscalYear) / 12);
      }

      const isRevisionMonth = isRevised && monthPosition === getFinancialYearPosition(revisionMonth);

      return {
        ...month,
        monthlyTax,
        isRevisionMonth,
        salary
      };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center">
            <Calculator className="w-12 h-12 text-slate-700 mr-3" />
            <h1 className="text-4xl font-bold text-slate-800">Pakistan Income Tax Calculator {fiscalYear}</h1>
          </div>
          
          {/* Fiscal Year Selector */}
          <div className="flex items-center">
            <select
              value={fiscalYear}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setFiscalYear(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-lg font-semibold bg-white"
            >
              <option value="2024-25">2024-25</option>
              <option value="2025-26">2025-26</option>
            </select>
          </div>
        </div>

        {/* Input Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-700 mb-6 flex items-center">
              <DollarSign className="w-6 h-6 mr-2" />
              Salary Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 my-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {isRevised ? 'Initial Monthly Salary (PKR)' : 'Monthly Salary (PKR)'}
                </label>
                <input
                  type="number"
                  value={monthlySalary}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setMonthlySalary(Number(e.target.value) || 0)}
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
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setMedicalPercentage(Number(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-lg font-semibold"
                  placeholder="5"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* Salary Revision Toggle */}
            <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-slate-600 mr-2" />
                  <span className="text-lg font-medium text-slate-700">Salary Revision</span>
                  <span className="ml-2 text-sm text-slate-500">(Financial Year: July - June)</span>
                </div>
                <button
                  onClick={() => setIsRevised(!isRevised)}
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
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setRevisionMonth(Number(e.target.value))}
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
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setNewSalary(Number(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg font-semibold"
                      placeholder="Enter Value greater then monthly salary"
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Salary Summary */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              {isRevised && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 font-medium">
                    Salary revised from {months.find(m => m.value === revisionMonth)?.label} 
                    ({formatCurrency(monthlySalary)} → {formatCurrency(newSalary)})
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {getFinancialYearPosition(revisionMonth) - 1} months at old salary, {12 - (getFinancialYearPosition(revisionMonth) - 1)} months at new salary
                  </p>
                </div>
              )}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-slate-600">
                    {isRevised ? 'Prorated Annual Salary' : 'Annual Salary'}
                  </p>
                  <p className="text-lg font-bold text-slate-800">{formatCurrency(calculations.annualSalary)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-600">
                    {isRevised ? 'Current Monthly Medical' : 'Monthly Medical'}
                  </p>
                  <p className="text-lg font-bold text-slate-800">{formatCurrency(calculations.monthlyMedicalAllowance)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-600">
                    {isRevised ? 'Current Monthly Taxable' : 'Monthly Taxable'}
                  </p>
                  <p className="text-lg font-bold text-slate-800">{formatCurrency(calculations.monthlyTaxableSalary)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-600">
                    {isRevised ? 'Prorated Annual Taxable' : 'Annual Taxable'}
                  </p>
                  <p className="text-lg font-bold text-slate-800">{formatCurrency(calculations.annualTaxableSalary)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Calculations Grid - 4 Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Card 1: Tax Without Medical Deduction */}
          <div className="bg-white rounded-2xl shadow-lg border-t-4 border-t-red-500 overflow-hidden">
            <div className="bg-red-50 px-8 py-6 border-b border-red-100">
              <div>
                <h3 className="text-xl font-bold text-red-800 flex items-center">
                  <Receipt className="w-5 h-5 mr-2" />
                  Tax Without Medical Deduction
                </h3>
                <p className="text-red-600 text-sm">Fiscal Year {fiscalYear}</p>
              </div>
            </div>
            <div className="p-8">
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
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Tax With Medical Deduction */}
          <div className="bg-white rounded-2xl shadow-lg border-t-4 border-t-emerald-500 overflow-hidden">
            <div className="bg-emerald-50 px-8 py-6 border-b border-emerald-100">
              <div>
                <h3 className="text-xl font-bold text-emerald-800 flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Tax With Medical Deduction
                </h3>
                <p className="text-emerald-600 text-sm">Fiscal Year {fiscalYear}</p>
              </div>
            </div>
            <div className="p-8">
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

          {/* Card 3: Monthly Tax Breakdown Without Medical */}
          <div className="bg-white rounded-2xl shadow-lg border-t-4 border-t-blue-500 overflow-hidden">
            <div className="bg-blue-50 px-8 py-6 border-b border-blue-100">
              <div>
                <h3 className="text-xl font-bold text-blue-800 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Monthly Breakdown (No Medical)
                </h3>
                <p className="text-blue-600 text-sm">Month-wise tax distribution</p>
              </div>
            </div>
            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 px-3 text-xs font-medium text-slate-600">Month</th>
                      <th className="text-right py-2 px-3 text-xs font-medium text-slate-600">Tax</th>
                      <th className="text-right py-2 px-3 text-xs font-medium text-slate-600">Remaining</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getMonthlyBreakdown(false).map((month) => (
                      <tr 
                        key={month.value}
                        className={`border-b border-slate-100 ${
                          month.isRevisionMonth ? 'bg-blue-50' : ''
                        }`}
                      >
                        <td className="py-2 px-3">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-slate-700">{month.short}</span>
                            {month.isRevisionMonth && (
                              <span className="ml-2 text-xs text-blue-600">(Revision)</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className="text-sm font-bold text-blue-600">{formatCurrency(month.monthlyTax)}</span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className="text-sm text-slate-600">{formatCurrency(month.salary - month.monthlyTax)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-200 bg-slate-50">
                      <td className="py-3 px-3">
                        <span className="text-sm font-semibold text-slate-700">Total</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="text-sm font-bold text-blue-600">{formatCurrency(calculations.taxWithoutMedical)}</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="text-sm font-semibold text-slate-700">{formatCurrency(calculations.annualSalary - calculations.taxWithoutMedical)}</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
            </div>
          </div>

          {/* Card 4: Monthly Tax Breakdown With Medical */}
          <div className="bg-white rounded-2xl shadow-lg border-t-4 border-t-purple-500 overflow-hidden">
            <div className="bg-purple-50 px-8 py-6 border-b border-purple-100">
              <div>
                <h3 className="text-xl font-bold text-purple-800 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Monthly Breakdown (With Medical)
                </h3>
                <p className="text-purple-600 text-sm">Month-wise tax after medical deduction</p>
              </div>
            </div>
            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 px-3 text-xs font-medium text-slate-600">Month</th>
                      <th className="text-right py-2 px-3 text-xs font-medium text-slate-600">Tax</th>
                      <th className="text-right py-2 px-3 text-xs font-medium text-slate-600">Remaining</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getMonthlyBreakdown(true).map((month) => (
                      <tr 
                        key={month.value}
                        className={`border-b border-slate-100 ${
                          month.isRevisionMonth ? 'bg-purple-50' : ''
                        }`}
                      >
                        <td className="py-2 px-3">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-slate-700">{month.short}</span>
                            {month.isRevisionMonth && (
                              <span className="ml-2 text-xs text-purple-600">(Revision)</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className="text-sm font-bold text-purple-600">{formatCurrency(month.monthlyTax)}</span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className="text-sm text-slate-600">{formatCurrency(month.salary - month.monthlyTax)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-200 bg-slate-50">
                      <td className="py-3 px-3">
                        <span className="text-sm font-semibold text-slate-700">Total</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="text-sm font-bold text-purple-600">{formatCurrency(calculations.taxWithMedical)}</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="text-sm font-semibold text-slate-700">{formatCurrency(calculations.annualTaxableSalary - calculations.taxWithMedical)}</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border rounded-2xl border-gray-200 py-8 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Work With Smart People, Save Time and Budget.
        </h2>
        <p className="text-gray-500 mb-6">
          Whether you're looking to start a project or need consultation, feel free to contact me.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex flex-row text-left gap-4">
          <img
            src="https://framerusercontent.com/images/JYthbEKlRhiEUox0ac0JfUpbnyU.jpg?scale-down-to=512"
            alt="Shahryar Minhas"
            className="w-12 h-12 rounded-full border-2 border-gray-300"
          />
          <div>
            <div className="font-medium text-gray-900">Shahryar Minhas</div>
            <div className="text-sm text-gray-500">graphy918@gmail.com</div>
          </div>
          </div>
          <div className="flex gap-3 mt-3 sm:mt-0">
            <a
              href="https://www.linkedin.com/in/shahryarminhas/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-900 transition"
              aria-label="LinkedIn"
            >
              {/* LinkedIn SVG */}
              <img src="/linkedin.svg" alt="Twitter" className="w-7 h-7" />
            </a>
            <a
              href="https://twitter.com/shahryrminhas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-600 transition"
              aria-label="Twitter"
            >
              {/* Twitter SVG */}
              <img src="/twitter.svg" alt="Twitter" className="w-7 h-7" />
            </a>
            <a
              href="https://github.com/shahryrminhas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:text-black transition"
              aria-label="GitHub"
            >
              {/* GitHub SVG */}
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </a>
          </div>
        </div>
        <hr className="my-6 border-gray-200" />
        <div className="text-gray-500 text-sm">
          Created with <span className="text-red-500">♥</span> by{" "}
          <a href="https://www.linkedin.com/in/shahryarminhas/" className="text-blue-600 hover:underline">@shahryrminhas</a>
          {" "}at{" "}
          <a href="https://solux.studio" className="text-[# FF6A12] hover:underline">SoluxStudio</a>
        </div>
      </div>
    </footer>
      </div>
    </div>
  );
}

export default App;