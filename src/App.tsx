import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import SalaryInput from './components/SalaryInput';
import TaxCalculationCard from './components/TaxCalculationCard';
import MonthlyBreakdown from './components/MonthlyBreakdown';
import Footer from './components/Footer';
import { TaxSlabs, Month, Calculations } from './components/types';

// Tax calculation functions for different fiscal years
const taxSlabs: TaxSlabs = {
  '2024-25': {
    slabs: [
      { min: 0, max: 600000, rate: 0, minTax: 0 },
      { min: 600001, max: 1200000, rate: 0.05, minTax: null },
      { min: 1200001, max: 2200000, rate: 0.15, minTax: null },
      { min: 2200001, max: 3200000, rate: 0.25, minTax: null },
      { min: 3200001, max: 4100000, rate: 0.30, minTax: null },
      { min: 4100001, max: Infinity, rate: 0.35, minTax: null }
    ]
  },
  '2025-26': {
    slabs: [
      { min: 0, max: 600000, rate: 0, minTax: 0 },
      { min: 600001, max: 1200000, rate: 0.01, minTax: null },
      { min: 1200001, max: 2200000, rate: 0.11, minTax: null },
      { min: 2200001, max: 3200000, rate: 0.23, minTax: null },
      { min: 3200001, max: 4100000, rate: 0.30, minTax: null },
      { min: 4100001, max: Infinity, rate: 0.35, minTax: null }
    ]
  }
};

const calculateTax = (annualSalary: number, fiscalYear: string): number => {
  if (fiscalYear === '2024-25') {
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

  const months: Month[] = [
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

  const calculations = useMemo<Calculations>(() => {
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
      <div className="flex flex-col gap-4 md:gap-8 max-w-7xl mx-auto">
        <Header fiscalYear={fiscalYear} onFiscalYearChange={setFiscalYear} />
        
        <div>
          <SalaryInput
            monthlySalary={monthlySalary}
            newSalary={newSalary}
            medicalPercentage={medicalPercentage}
            isRevised={isRevised}
            revisionMonth={revisionMonth}
            months={months}
            onMonthlySalaryChange={setMonthlySalary}
            onNewSalaryChange={setNewSalary}
            onMedicalPercentageChange={setMedicalPercentage}
            onIsRevisedChange={setIsRevised}
            onRevisionMonthChange={setRevisionMonth}
            formatCurrency={formatCurrency}
            getFinancialYearPosition={getFinancialYearPosition}
          />
        </div>

        <TaxCalculationCard
          fiscalYear={fiscalYear}
          taxSlabs={taxSlabs}
          calculations={calculations}
          formatCurrency={formatCurrency}
        />

        <div className="grid lg:grid-cols-2 gap-4">
          <MonthlyBreakdown
            title="Monthly Breakdown (No Medical)"
            description="Month-wise tax distribution"
            borderColor="border-blue-500"
            textColor="text-blue-600"
            bgColor="bg-blue-50"
            monthlyData={getMonthlyBreakdown(false)}
            totalTax={calculations.taxWithoutMedical}
            totalSalary={calculations.annualSalary}
            formatCurrency={formatCurrency}
          />

          <MonthlyBreakdown
            title="Monthly Breakdown (With Medical)"
            description="Month-wise tax after medical deduction"
            borderColor="border-purple-500"
            textColor="text-purple-600"
            bgColor="bg-purple-50"
            monthlyData={getMonthlyBreakdown(true)}
            totalTax={calculations.taxWithMedical}
            totalSalary={calculations.annualTaxableSalary}
            formatCurrency={formatCurrency}
          />
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default App;