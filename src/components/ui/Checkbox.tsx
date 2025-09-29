/**
 * Componente Checkbox reutilizable
 * Checkbox con estilos consistentes y soporte para estados
 */

import React, { forwardRef } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, indeterminate, className = '', ...props }, ref) => {
    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            type="checkbox"
            className={`
              h-4 w-4 rounded border-gray-300 text-blue-600 
              focus:ring-blue-500 focus:ring-2 focus:ring-offset-2
              disabled:cursor-not-allowed disabled:opacity-50
              ${error ? 'border-red-300 text-red-600 focus:ring-red-500' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        
        {(label || description) && (
          <div className="ml-3 text-sm">
            {label && (
              <label 
                htmlFor={props.id}
                className={`
                  font-medium cursor-pointer
                  ${error ? 'text-red-900' : 'text-gray-700'}
                  ${props.disabled ? 'cursor-not-allowed opacity-50' : ''}
                `}
              >
                {label}
              </label>
            )}
            
            {description && (
              <p className={`
                text-gray-500 mt-1
                ${props.disabled ? 'opacity-50' : ''}
              `}>
                {description}
              </p>
            )}
            
            {error && (
              <p className="text-red-600 text-xs mt-1">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
