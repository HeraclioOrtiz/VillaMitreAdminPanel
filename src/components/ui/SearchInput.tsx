import React, { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showClearButton?: boolean;
  onClear?: () => void;
  autoFocus?: boolean;
}

const SearchInput = ({
  value = '',
  onChange,
  placeholder = 'Buscar...',
  debounceMs = 300,
  className = '',
  disabled = false,
  loading = false,
  size = 'md',
  showClearButton = true,
  onClear,
  autoFocus = false,
}: SearchInputProps) => {
  const [internalValue, setInternalValue] = useState(value);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (internalValue !== value) {
        onChange(internalValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [internalValue, debounceMs, onChange, value]);

  // Sync with external value changes
  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setInternalValue('');
    onChange('');
    onClear?.();
  }, [onChange, onClear]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  }, [handleClear]);

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const clearButtonSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search icon */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <MagnifyingGlassIcon
          className={`${iconSizeClasses[size]} ${
            disabled ? 'text-gray-300' : 'text-gray-400'
          }`}
          aria-hidden="true"
        />
      </div>

      {/* Input field */}
      <input
        type="text"
        value={internalValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className={`
          block w-full pl-10 pr-10 border border-gray-300 rounded-md
          ${sizeClasses[size]}
          ${
            disabled
              ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
              : 'bg-white text-gray-900'
          }
          placeholder-gray-500
          focus:outline-none focus:ring-1 focus:ring-villa-mitre-500 focus:border-villa-mitre-500
          transition-colors duration-200
        `}
      />

      {/* Loading spinner or clear button */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
        {loading ? (
          <div
            className={`animate-spin rounded-full border-2 border-gray-300 border-t-villa-mitre-600 ${clearButtonSizeClasses[size]}`}
          />
        ) : (
          showClearButton &&
          internalValue &&
          !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200"
              aria-label="Limpiar búsqueda"
            >
              <XMarkIcon className={clearButtonSizeClasses[size]} aria-hidden="true" />
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default SearchInput;
