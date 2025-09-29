import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxSelections?: number;
  searchable?: boolean;
  clearable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  groupBy?: boolean;
  closeOnSelect?: boolean;
  renderChip?: (option: MultiSelectOption, onRemove: () => void) => React.ReactNode;
  renderOption?: (option: MultiSelectOption, isSelected: boolean) => React.ReactNode;
  emptyText?: string;
  selectAllText?: string;
  clearAllText?: string;
}

const MultiSelect = ({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar opciones...',
  disabled = false,
  className = '',
  maxSelections,
  searchable = true,
  clearable = true,
  size = 'md',
  groupBy = false,
  closeOnSelect = false,
  renderChip,
  renderOption,
  emptyText = 'No hay opciones disponibles',
  selectAllText = 'Seleccionar todo',
  clearAllText = 'Limpiar todo',
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group options if needed
  const groupedOptions = groupBy
    ? filteredOptions.reduce((groups, option) => {
        const group = option.group || 'Sin grupo';
        if (!groups[group]) {
          groups[group] = [];
        }
        groups[group].push(option);
        return groups;
      }, {} as Record<string, MultiSelectOption[]>)
    : { '': filteredOptions };

  // Get selected options
  const selectedOptions = options.filter((option) => value.includes(option.value));

  // Handle option selection
  const handleOptionClick = (option: MultiSelectOption) => {
    if (option.disabled) return;

    const isSelected = value.includes(option.value);
    let newValue: string[];

    if (isSelected) {
      newValue = value.filter((v) => v !== option.value);
    } else {
      if (maxSelections && value.length >= maxSelections) {
        return; // Don't allow more selections
      }
      newValue = [...value, option.value];
    }

    onChange(newValue);

    if (closeOnSelect && !isSelected) {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    const availableOptions = filteredOptions.filter((option) => !option.disabled);
    const allValues = availableOptions.map((option) => option.value);
    const newValue = [...new Set([...value, ...allValues])];
    
    if (maxSelections) {
      onChange(newValue.slice(0, maxSelections));
    } else {
      onChange(newValue);
    }
  };

  // Handle clear all
  const handleClearAll = () => {
    onChange([]);
  };

  // Remove chip
  const removeChip = (optionValue: string) => {
    onChange(value.filter((v) => v !== optionValue));
  };

  // Size classes
  const sizeClasses = {
    sm: 'min-h-[2rem] text-sm',
    md: 'min-h-[2.5rem] text-sm',
    lg: 'min-h-[3rem] text-base',
  };

  const chipSizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  // Default chip renderer
  const defaultRenderChip = (option: MultiSelectOption, onRemove: () => void) => (
    <span
      key={option.value}
      className={`inline-flex items-center gap-1 bg-villa-mitre-100 text-villa-mitre-800 rounded-md ${chipSizeClasses[size]} font-medium`}
    >
      {option.label}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="text-villa-mitre-600 hover:text-villa-mitre-800 focus:outline-none"
        disabled={disabled}
      >
        <XMarkIcon className="h-3 w-3" />
      </button>
    </span>
  );

  // Default option renderer
  const defaultRenderOption = (option: MultiSelectOption, isSelected: boolean) => (
    <div className="flex items-center justify-between">
      <span className={option.disabled ? 'text-gray-400' : ''}>{option.label}</span>
      {isSelected && (
        <svg className="h-4 w-4 text-villa-mitre-600" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </div>
  );

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Main input area */}
      <div
        className={`
          relative w-full border border-gray-300 rounded-md bg-white cursor-pointer
          ${sizeClasses[size]}
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:border-gray-400'}
          ${isOpen ? 'ring-1 ring-villa-mitre-500 border-villa-mitre-500' : ''}
          transition-colors duration-200
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap items-center gap-1 px-3 py-1">
          {/* Selected chips */}
          {selectedOptions.length > 0 ? (
            selectedOptions.map((option) =>
              renderChip
                ? renderChip(option, () => removeChip(option.value))
                : defaultRenderChip(option, () => removeChip(option.value))
            )
          ) : (
            <span className="text-gray-500 py-1">{placeholder}</span>
          )}

          {/* Search input */}
          {searchable && isOpen && (
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[100px] outline-none bg-transparent"
              placeholder="Buscar..."
              autoFocus
            />
          )}
        </div>

        {/* Dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {/* Header actions */}
          {(clearable || (filteredOptions.length > 0 && !maxSelections)) && (
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50">
              {filteredOptions.length > 0 && !maxSelections && (
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-sm text-villa-mitre-600 hover:text-villa-mitre-800 font-medium"
                >
                  {selectAllText}
                </button>
              )}
              {clearable && value.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  {clearAllText}
                </button>
              )}
            </div>
          )}

          {/* Options list */}
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">{emptyText}</div>
          ) : (
            Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
              <div key={groupName}>
                {/* Group header */}
                {groupBy && groupName && (
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border-b border-gray-200">
                    {groupName}
                  </div>
                )}

                {/* Group options */}
                {groupOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  const isDisabled = option.disabled || (maxSelections && value.length >= maxSelections && !isSelected);

                  return (
                    <div
                      key={option.value}
                      className={`
                        px-3 py-2 cursor-pointer select-none
                        ${isSelected ? 'bg-villa-mitre-50 text-villa-mitre-900' : 'text-gray-900'}
                        ${isDisabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50'}
                      `}
                      onClick={() => !isDisabled && handleOptionClick(option)}
                    >
                      {renderOption ? renderOption(option, isSelected) : defaultRenderOption(option, isSelected)}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
