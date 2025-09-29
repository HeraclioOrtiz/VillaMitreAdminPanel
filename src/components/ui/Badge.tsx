import React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';

const badgeVariants = {
  default: 'border-transparent bg-villa-mitre-600 text-white hover:bg-villa-mitre-700',
  secondary: 'border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200',
  destructive: 'border-transparent bg-red-500 text-white hover:bg-red-600',
  outline: 'text-gray-900 border-gray-300',
  success: 'border-transparent bg-green-100 text-green-800 hover:bg-green-200',
  warning: 'border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  info: 'border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div 
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-villa-mitre-500 focus:ring-offset-2',
        badgeVariants[variant],
        className
      )} 
      {...props} 
    />
  );
}

export { Badge };
