import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface FinancialReportCardProps {
  title: string;
  total: number | undefined;
  isLoading: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const calculateGrowth = (current: number, previous: number) => {
  if (previous === 0) return 100;
  return ((current - previous) / previous) * 100;
};

const FinancialReportCard: React.FC<FinancialReportCardProps> = ({
  title,
  total,
  isLoading
}) => {
  const formatValue = () => {
    if (isLoading) return '...';
    if (total === undefined) return 'Non disponible';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(total);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-gray-900">
        {formatValue()}
      </p>
    </div>
  );
};

export default FinancialReportCard; 