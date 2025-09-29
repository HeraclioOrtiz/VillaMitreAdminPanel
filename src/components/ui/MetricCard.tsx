import React from 'react';
import { Card } from '@/components/ui';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ReactNode;
  subtitle?: string;
}

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  subtitle 
}: MetricCardProps) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  const getChangeIcon = () => {
    if (changeType === 'increase') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
        </svg>
      );
    }
    if (changeType === 'decrease') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
        </svg>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {icon && (
            <div className="w-8 h-8 bg-villa-mitre-100 rounded-lg flex items-center justify-center">
              <div className="text-villa-mitre-600">{icon}</div>
            </div>
          )}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              {change !== undefined && (
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${getChangeColor()}`}>
                  {getChangeIcon()}
                  <span className="sr-only">
                    {changeType === 'increase' ? 'Aumentó' : 'Disminuyó'} en
                  </span>
                  {Math.abs(change)}%
                </div>
              )}
            </dd>
            {subtitle && (
              <dd className="text-sm text-gray-500 mt-1">{subtitle}</dd>
            )}
          </dl>
        </div>
      </div>
    </Card>
  );
};

export { MetricCard };
export default MetricCard;
