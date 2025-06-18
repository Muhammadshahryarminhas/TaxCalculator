import React from 'react';
import { BarChart3 } from 'lucide-react';
import { MonthlyBreakdown as MonthlyBreakdownType } from './types';

interface MonthlyBreakdownProps {
  title: string;
  description: string;
  borderColor: string;
  textColor: string;
  bgColor: string;
  monthlyData: MonthlyBreakdownType[];
  totalTax: number;
  totalSalary: number;
  formatCurrency: (amount: number) => string;
}

const MonthlyBreakdown: React.FC<MonthlyBreakdownProps> = ({
  title,
  description,
  borderColor,
  textColor,
  bgColor,
  monthlyData,
  totalTax,
  totalSalary,
  formatCurrency,
}) => {
  return (
    <div className={`bg-white rounded-2xl shadow-lg border-t-4 ${borderColor} overflow-hidden`}>
      <div className={`${bgColor} px-8 py-6 border-b ${bgColor}`}>
        <div>
          <h3 className={`text-xl font-bold ${textColor} flex items-center`}>
            <BarChart3 className="w-5 h-5 mr-2" />
            {title}
          </h3>
          <p className={`${textColor} text-sm`}>{description}</p>
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
              {monthlyData.map((month) => (
                <tr 
                  key={month.value}
                  className={`border-b border-slate-100 ${
                    month.isRevisionMonth ? bgColor : ''
                  }`}
                >
                  <td className="py-2 px-3">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-slate-700">{month.short}</span>
                      {month.isRevisionMonth && (
                        <span className={`ml-2 text-xs ${textColor}`}>(Revision)</span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <span className={`text-sm font-bold ${textColor}`}>{formatCurrency(month.monthlyTax)}</span>
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
                  <span className={`text-sm font-bold ${textColor}`}>{formatCurrency(totalTax)}</span>
                </td>
                <td className="py-3 px-3 text-right">
                  <span className="text-sm font-semibold text-slate-700">{formatCurrency(totalSalary - totalTax)}</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonthlyBreakdown; 