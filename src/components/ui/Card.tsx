import React, { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

const Card = ({ 
  className, 
  variant = 'default', 
  padding = 'md',
  children, 
  ...props 
}: CardProps) => {
  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm',
    outlined: 'bg-white border-2 border-gray-200',
    elevated: 'bg-white shadow-lg border border-gray-100',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={clsx(
        'rounded-lg',
        variants[variant],
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ 
  className, 
  title, 
  subtitle, 
  actions, 
  children, 
  ...props 
}: CardHeaderProps) => {
  return (
    <div
      className={clsx(
        'flex items-start justify-between',
        className
      )}
      {...props}
    >
      <div className="flex-1">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        )}
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        )}
        {children}
      </div>
      {actions && (
        <div className="ml-4 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};

const CardContent = ({ className, children, ...props }: CardContentProps) => {
  return (
    <div
      className={clsx('mt-4', className)}
      {...props}
    >
      {children}
    </div>
  );
};

const CardFooter = ({ className, children, ...props }: CardFooterProps) => {
  return (
    <div
      className={clsx(
        'mt-6 pt-4 border-t border-gray-200 flex items-center justify-between',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export { Card };
export default Card;
