export type TaxSlab = {
  min: number;
  max: number;
  rate: number;
  minTax: number | null;
  maxTax?: number;
};

export type TaxSlabs = {
  [key: string]: {
    slabs: TaxSlab[];
  };
};

export type Month = {
  value: number;
  label: string;
  short: string;
  order: number;
};

export type MonthlyBreakdown = Month & {
  monthlyTax: number;
  isRevisionMonth: boolean;
  salary: number;
};

export type Calculations = {
  inputs: {
    monthlySalary: number;
    newSalary: number;
    medicalPercentage: number;
    isRevised: boolean;
    revisionMonth: number;
  };
  annualSalary: number;
  monthlyMedicalAllowance: number;
  monthlyTaxableSalary: number;
  annualTaxableSalary: number;
  taxWithoutMedical: number;
  monthlyTaxWithoutMedical: number;
  taxWithMedical: number;
  monthlyTaxWithMedical: number;
}; 