import React from 'react';
import { ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface FormFieldProps {
  label?: string;
  children: React.ReactNode;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  helperClassName?: string;
  id?: string;
}

const FormField = ({
  label,
  children,
  error,
  helperText,
  required = false,
  className = '',
  labelClassName = '',
  errorClassName = '',
  helperClassName = '',
  id,
}: FormFieldProps) => {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={fieldId}
          className={`block text-sm font-medium text-gray-700 ${labelClassName}`}
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="Campo requerido">
              *
            </span>
          )}
        </label>
      )}

      {/* Input/Content */}
      <div className="relative">
        {React.isValidElement(children) 
          ? React.cloneElement(children as React.ReactElement<any>, {
              id: fieldId,
              'aria-invalid': error ? 'true' : 'false',
              'aria-describedby': error
                ? `${fieldId}-error`
                : helperText
                ? `${fieldId}-helper`
                : undefined,
            })
          : children}

        {/* Error icon */}
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div
          id={`${fieldId}-error`}
          className={`flex items-center mt-2 text-sm text-red-600 ${errorClassName}`}
          role="alert"
        >
          <ExclamationCircleIcon className="h-4 w-4 mr-1 flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <div
          id={`${fieldId}-helper`}
          className={`flex items-center mt-1 text-sm text-gray-500 ${helperClassName}`}
        >
          <InformationCircleIcon className="h-4 w-4 mr-1 flex-shrink-0" aria-hidden="true" />
          <span>{helperText}</span>
        </div>
      )}
    </div>
  );
};

// Componente Input específico para usar con FormField
export const FormInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    error?: boolean;
  }
>(({ className = '', error, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`
        block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400
        focus:outline-none focus:ring-1 focus:ring-villa-mitre-500 focus:border-villa-mitre-500
        disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
        ${
          error
            ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 text-gray-900'
        }
        ${className}
      `}
      {...props}
    />
  );
});

FormInput.displayName = 'FormInput';

// Componente Textarea específico para usar con FormField
export const FormTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    error?: boolean;
  }
>(({ className = '', error, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`
        block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400
        focus:outline-none focus:ring-1 focus:ring-villa-mitre-500 focus:border-villa-mitre-500
        disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
        resize-vertical
        ${
          error
            ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 text-gray-900'
        }
        ${className}
      `}
      {...props}
    />
  );
});

FormTextarea.displayName = 'FormTextarea';

// Componente Select específico para usar con FormField
export const FormSelect = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    error?: boolean;
    placeholder?: string;
  }
>(({ className = '', error, placeholder, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={`
        block w-full px-3 py-2 border rounded-md shadow-sm
        focus:outline-none focus:ring-1 focus:ring-villa-mitre-500 focus:border-villa-mitre-500
        disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
        ${
          error
            ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 text-gray-900'
        }
        ${className}
      `}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {children}
    </select>
  );
});

FormSelect.displayName = 'FormSelect';

export default FormField;
