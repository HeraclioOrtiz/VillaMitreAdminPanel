import React, { ButtonHTMLAttributes, forwardRef, memo, useMemo } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false,
    leftIcon,
    rightIcon,
    children, 
    disabled,
    ...props 
  }, ref) => {
    // Memoizar clases base (no cambian nunca)
    const baseClasses = useMemo(() => 
      'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
      []
    );
    
    // Memoizar variantes (no cambian nunca)
    const variants = useMemo(() => ({
      primary: 'bg-villa-mitre-600 hover:bg-villa-mitre-700 text-white focus:ring-villa-mitre-500',
      secondary: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 focus:ring-villa-mitre-500',
      danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
      ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-villa-mitre-500',
    }), []);

    // Memoizar tamaños (no cambian nunca)
    const sizes = useMemo(() => ({
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    }), []);

    // Memoizar clases finales
    const buttonClasses = useMemo(() => 
      clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      ),
      [baseClasses, variants, variant, sizes, size, className]
    );

    return (
      <button
        className={buttonClasses}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando...
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
));

Button.displayName = 'Button';

export { Button };
export default Button;
