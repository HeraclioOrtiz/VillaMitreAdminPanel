/**
 * DateRangePicker - Selector de rango de fechas optimizado
 * Implementa selección de fechas con performance optimizada usando React.memo y hooks
 */

import React, { useState, useCallback, useMemo, memo, useRef, useEffect } from 'react';
import { CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui';

interface DateRange {
  start: string | null;
  end: string | null;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  minDate?: string;
  maxDate?: string;
  presets?: Array<{
    label: string;
    value: DateRange;
  }>;
  clearable?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Presets predefinidos para rangos de fechas comunes
 */
const DEFAULT_PRESETS = [
  {
    label: 'Hoy',
    value: {
      start: new Date().toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },
  },
  {
    label: 'Últimos 7 días',
    value: {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },
  },
  {
    label: 'Últimos 30 días',
    value: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },
  },
  {
    label: 'Este mes',
    value: {
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },
  },
  {
    label: 'Mes anterior',
    value: {
      start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().split('T')[0],
      end: new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString().split('T')[0],
    },
  },
];

const DateRangePicker = memo<DateRangePickerProps>(function DateRangePicker({
  value,
  onChange,
  placeholder = 'Seleccionar rango de fechas',
  label,
  disabled = false,
  className = '',
  minDate,
  maxDate,
  presets = DEFAULT_PRESETS,
  clearable = true,
  size = 'md',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempRange, setTempRange] = useState<DateRange>(value || { start: null, end: null });
  const containerRef = useRef<HTMLDivElement>(null);

  // Memoizar clases de tamaño
  const sizeClasses = useMemo(() => {
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };
    return sizes[size];
  }, [size]);

  // Memoizar texto del valor actual
  const displayValue = useMemo(() => {
    if (!value?.start && !value?.end) return placeholder;
    
    if (value.start && value.end) {
      const startDate = new Date(value.start).toLocaleDateString('es-ES');
      const endDate = new Date(value.end).toLocaleDateString('es-ES');
      return `${startDate} - ${endDate}`;
    }
    
    if (value.start) {
      return `Desde ${new Date(value.start).toLocaleDateString('es-ES')}`;
    }
    
    if (value.end) {
      return `Hasta ${new Date(value.end).toLocaleDateString('es-ES')}`;
    }
    
    return placeholder;
  }, [value, placeholder]);

  // Memoizar si hay valor seleccionado
  const hasValue = useMemo(() => {
    return Boolean(value?.start || value?.end);
  }, [value]);

  // Handler para abrir/cerrar dropdown
  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen(prev => !prev);
      if (!isOpen) {
        setTempRange(value || { start: null, end: null });
      }
    }
  }, [disabled, isOpen, value]);

  // Handler para aplicar cambios
  const handleApply = useCallback(() => {
    onChange(tempRange);
    setIsOpen(false);
  }, [onChange, tempRange]);

  // Handler para cancelar cambios
  const handleCancel = useCallback(() => {
    setTempRange(value || { start: null, end: null });
    setIsOpen(false);
  }, [value]);

  // Handler para limpiar selección
  const handleClear = useCallback(() => {
    const emptyRange = { start: null, end: null };
    setTempRange(emptyRange);
    onChange(emptyRange);
    setIsOpen(false);
  }, [onChange]);

  // Handler para cambio de fecha de inicio
  const handleStartDateChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = event.target.value || null;
    setTempRange(prev => ({ ...prev, start: newStart }));
  }, []);

  // Handler para cambio de fecha de fin
  const handleEndDateChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = event.target.value || null;
    setTempRange(prev => ({ ...prev, end: newEnd }));
  }, []);

  // Handler para seleccionar preset
  const handlePresetSelect = useCallback((preset: { label: string; value: DateRange }) => {
    setTempRange(preset.value);
  }, []);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Memoizar validación de rango
  const isValidRange = useMemo(() => {
    if (!tempRange.start || !tempRange.end) return true;
    return new Date(tempRange.start) <= new Date(tempRange.end);
  }, [tempRange]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={`
            w-full text-left border border-gray-300 rounded-md shadow-sm
            focus:ring-2 focus:ring-villa-mitre-500 focus:border-villa-mitre-500
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            hover:border-gray-400 transition-colors
            ${sizeClasses}
            ${hasValue ? 'text-gray-900' : 'text-gray-500'}
          `}
        >
          <div className="flex items-center justify-between">
            <span className="truncate">{displayValue}</span>
            <div className="flex items-center space-x-2">
              {clearable && hasValue && !disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
              <CalendarIcon className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="p-4">
              {/* Presets */}
              {presets.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Rangos rápidos</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {presets.map((preset, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handlePresetSelect(preset)}
                        className="px-3 py-2 text-sm text-left border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Inputs de fechas */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de inicio
                  </label>
                  <input
                    type="date"
                    value={tempRange.start || ''}
                    onChange={handleStartDateChange}
                    min={minDate}
                    max={maxDate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-villa-mitre-500 focus:border-villa-mitre-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de fin
                  </label>
                  <input
                    type="date"
                    value={tempRange.end || ''}
                    onChange={handleEndDateChange}
                    min={tempRange.start || minDate}
                    max={maxDate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-villa-mitre-500 focus:border-villa-mitre-500"
                  />
                </div>

                {!isValidRange && (
                  <p className="text-sm text-red-600">
                    La fecha de inicio debe ser anterior a la fecha de fin
                  </p>
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-200">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleApply}
                  disabled={!isValidRange}
                >
                  Aplicar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default DateRangePicker;
export type { DateRange, DateRangePickerProps };
