/**
 * FilterChips - Componente para mostrar filtros activos como chips
 * Optimizado con React.memo, useMemo y useCallback para máximo performance
 */

import React, { memo, useMemo, useCallback } from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { Button } from '@/components/ui';

interface FilterChip {
  id: string;
  label: string;
  value: any;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray' | 'indigo';
  removable?: boolean;
}

interface FilterChipsProps {
  chips: FilterChip[];
  onRemoveChip: (chipId: string) => void;
  onClearAll?: () => void;
  className?: string;
  maxVisible?: number;
  showClearAll?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'outlined';
}

/**
 * Configuración de colores para los chips
 */
const CHIP_COLORS = {
  blue: {
    filled: 'bg-blue-100 text-blue-800 border-blue-200',
    outlined: 'bg-white text-blue-700 border-blue-300',
    hover: 'hover:bg-blue-200',
    removeHover: 'hover:bg-blue-200 hover:text-blue-900',
  },
  green: {
    filled: 'bg-green-100 text-green-800 border-green-200',
    outlined: 'bg-white text-green-700 border-green-300',
    hover: 'hover:bg-green-200',
    removeHover: 'hover:bg-green-200 hover:text-green-900',
  },
  yellow: {
    filled: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    outlined: 'bg-white text-yellow-700 border-yellow-300',
    hover: 'hover:bg-yellow-200',
    removeHover: 'hover:bg-yellow-200 hover:text-yellow-900',
  },
  red: {
    filled: 'bg-red-100 text-red-800 border-red-200',
    outlined: 'bg-white text-red-700 border-red-300',
    hover: 'hover:bg-red-200',
    removeHover: 'hover:bg-red-200 hover:text-red-900',
  },
  purple: {
    filled: 'bg-purple-100 text-purple-800 border-purple-200',
    outlined: 'bg-white text-purple-700 border-purple-300',
    hover: 'hover:bg-purple-200',
    removeHover: 'hover:bg-purple-200 hover:text-purple-900',
  },
  gray: {
    filled: 'bg-gray-100 text-gray-800 border-gray-200',
    outlined: 'bg-white text-gray-700 border-gray-300',
    hover: 'hover:bg-gray-200',
    removeHover: 'hover:bg-gray-200 hover:text-gray-900',
  },
  indigo: {
    filled: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    outlined: 'bg-white text-indigo-700 border-indigo-300',
    hover: 'hover:bg-indigo-200',
    removeHover: 'hover:bg-indigo-200 hover:text-indigo-900',
  },
};

const FilterChips = memo<FilterChipsProps>(function FilterChips({
  chips,
  onRemoveChip,
  onClearAll,
  className = '',
  maxVisible = 10,
  showClearAll = true,
  size = 'md',
  variant = 'filled',
}) {
  // Memoizar chips visibles y ocultos
  const { visibleChips, hiddenCount } = useMemo(() => {
    if (chips.length <= maxVisible) {
      return { visibleChips: chips, hiddenCount: 0 };
    }
    return {
      visibleChips: chips.slice(0, maxVisible),
      hiddenCount: chips.length - maxVisible,
    };
  }, [chips, maxVisible]);

  // Memoizar clases de tamaño
  const sizeClasses = useMemo(() => {
    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base',
    };
    return sizes[size];
  }, [size]);

  // Handler para remover chip individual
  const handleRemoveChip = useCallback((chipId: string) => {
    return (event: React.MouseEvent) => {
      event.stopPropagation();
      onRemoveChip(chipId);
    };
  }, [onRemoveChip]);

  // Handler para limpiar todos los filtros
  const handleClearAll = useCallback(() => {
    onClearAll?.();
  }, [onClearAll]);

  // Memoizar función para obtener clases de chip
  const getChipClasses = useCallback((chip: FilterChip) => {
    const colorConfig = CHIP_COLORS[chip.color || 'blue'];
    const baseClasses = `
      inline-flex items-center gap-1.5 border rounded-full font-medium
      transition-colors duration-200 ${sizeClasses}
    `;
    
    const variantClasses = colorConfig[variant];
    const hoverClasses = chip.removable !== false ? colorConfig.hover : '';
    
    return `${baseClasses} ${variantClasses} ${hoverClasses}`.trim();
  }, [variant, sizeClasses]);

  // Memoizar función para obtener clases del botón de remover
  const getRemoveButtonClasses = useCallback((chip: FilterChip) => {
    const colorConfig = CHIP_COLORS[chip.color || 'blue'];
    return `
      inline-flex items-center justify-center w-4 h-4 rounded-full
      transition-colors duration-200 ${colorConfig.removeHover}
    `;
  }, []);

  // Si no hay chips, no renderizar nada
  if (chips.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* Chips visibles */}
      {visibleChips.map((chip) => (
        <div
          key={chip.id}
          className={getChipClasses(chip)}
        >
          <span className="truncate max-w-xs" title={chip.label}>
            {chip.label}
          </span>
          
          {chip.removable !== false && (
            <button
              type="button"
              onClick={handleRemoveChip(chip.id)}
              className={getRemoveButtonClasses(chip)}
              aria-label={`Remover filtro ${chip.label}`}
            >
              <XMarkIcon className="w-3 h-3" />
            </button>
          )}
        </div>
      ))}

      {/* Indicador de chips ocultos */}
      {hiddenCount > 0 && (
        <div className={`
          inline-flex items-center gap-1.5 border rounded-full font-medium
          bg-gray-100 text-gray-600 border-gray-200 ${sizeClasses}
        `}>
          <span>+{hiddenCount} más</span>
        </div>
      )}

      {/* Botón para limpiar todos */}
      {showClearAll && onClearAll && chips.length > 1 && (
        <Button
          variant="ghost"
          size={size}
          onClick={handleClearAll}
          className="text-gray-500 hover:text-gray-700"
        >
          Limpiar todo
        </Button>
      )}
    </div>
  );
});

/**
 * Hook para generar chips a partir de filtros
 */
export const useFilterChips = () => {
  // Función para crear chip de texto
  const createTextChip = useCallback((
    id: string,
    label: string,
    value: string,
    color: FilterChip['color'] = 'blue'
  ): FilterChip => ({
    id,
    label: `${label}: ${value}`,
    value,
    color,
    removable: true,
  }), []);

  // Función para crear chip de array
  const createArrayChip = useCallback((
    id: string,
    label: string,
    values: string[],
    color: FilterChip['color'] = 'green'
  ): FilterChip => ({
    id,
    label: `${label}: ${values.length} seleccionado${values.length > 1 ? 's' : ''}`,
    value: values,
    color,
    removable: true,
  }), []);

  // Función para crear chip de rango de fechas
  const createDateRangeChip = useCallback((
    id: string,
    label: string,
    startDate: string | null,
    endDate: string | null,
    color: FilterChip['color'] = 'purple'
  ): FilterChip | null => {
    if (!startDate && !endDate) return null;

    let displayValue = '';
    if (startDate && endDate) {
      const start = new Date(startDate).toLocaleDateString('es-ES');
      const end = new Date(endDate).toLocaleDateString('es-ES');
      displayValue = `${start} - ${end}`;
    } else if (startDate) {
      displayValue = `Desde ${new Date(startDate).toLocaleDateString('es-ES')}`;
    } else if (endDate) {
      displayValue = `Hasta ${new Date(endDate).toLocaleDateString('es-ES')}`;
    }

    return {
      id,
      label: `${label}: ${displayValue}`,
      value: { start: startDate, end: endDate },
      color,
      removable: true,
    };
  }, []);

  // Función para crear chip booleano
  const createBooleanChip = useCallback((
    id: string,
    label: string,
    value: boolean,
    color: FilterChip['color'] = 'yellow'
  ): FilterChip => ({
    id,
    label,
    value,
    color,
    removable: true,
  }), []);

  return useMemo(() => ({
    createTextChip,
    createArrayChip,
    createDateRangeChip,
    createBooleanChip,
  }), [createTextChip, createArrayChip, createDateRangeChip, createBooleanChip]);
};

/**
 * Componente especializado para chips de filtros de usuario
 */
export const UserFilterChips = memo<{
  filters: any;
  onRemoveFilter: (filterKey: string) => void;
  onClearAllFilters: () => void;
  className?: string;
}>(function UserFilterChips({
  filters,
  onRemoveFilter,
  onClearAllFilters,
  className,
}) {
  const { createTextChip, createArrayChip, createDateRangeChip, createBooleanChip } = useFilterChips();

  // Memoizar chips generados a partir de filtros
  const chips = useMemo(() => {
    const chipList: FilterChip[] = [];

    // Búsqueda
    if (filters.search) {
      chipList.push(createTextChip('search', 'Búsqueda', filters.search, 'blue'));
    }

    // Roles
    if (filters.role && filters.role.length > 0) {
      chipList.push(createArrayChip('role', 'Roles', filters.role, 'green'));
    }

    // Estados
    if (filters.status && filters.status.length > 0) {
      chipList.push(createArrayChip('status', 'Estados', filters.status, 'yellow'));
    }

    // Estados de membresía
    if (filters.membership_status && filters.membership_status.length > 0) {
      chipList.push(createArrayChip('membership_status', 'Membresía', filters.membership_status, 'purple'));
    }

    // Estados de semáforo
    if (filters.traffic_light_status && filters.traffic_light_status.length > 0) {
      chipList.push(createArrayChip('traffic_light_status', 'Semáforo', filters.traffic_light_status, 'red'));
    }

    // Género
    if (filters.gender && filters.gender.length > 0) {
      chipList.push(createArrayChip('gender', 'Género', filters.gender, 'indigo'));
    }

    // Profesor asignado
    if (filters.assigned_professor_id) {
      chipList.push(createTextChip('assigned_professor_id', 'Profesor', `ID: ${filters.assigned_professor_id}`, 'gray'));
    }

    // Fechas de creación
    const createdDateChip = createDateRangeChip(
      'created_date',
      'Fecha creación',
      filters.created_from,
      filters.created_to,
      'purple'
    );
    if (createdDateChip) chipList.push(createdDateChip);

    // Fechas de vencimiento de membresía
    const membershipDateChip = createDateRangeChip(
      'membership_date',
      'Vence membresía',
      filters.membership_expires_from,
      filters.membership_expires_to,
      'red'
    );
    if (membershipDateChip) chipList.push(membershipDateChip);

    // Fechas de última actividad
    const activityDateChip = createDateRangeChip(
      'activity_date',
      'Última actividad',
      filters.last_activity_from,
      filters.last_activity_to,
      'blue'
    );
    if (activityDateChip) chipList.push(activityDateChip);

    // Filtros booleanos
    if (filters.has_phone) {
      chipList.push(createBooleanChip('has_phone', 'Con teléfono', true, 'green'));
    }

    if (filters.has_emergency_contact) {
      chipList.push(createBooleanChip('has_emergency_contact', 'Con contacto emergencia', true, 'yellow'));
    }

    if (filters.has_medical_notes) {
      chipList.push(createBooleanChip('has_medical_notes', 'Con notas médicas', true, 'red'));
    }

    if (filters.email_verified) {
      chipList.push(createBooleanChip('email_verified', 'Email verificado', true, 'blue'));
    }

    if (filters.phone_verified) {
      chipList.push(createBooleanChip('phone_verified', 'Teléfono verificado', true, 'green'));
    }

    return chipList;
  }, [filters, createTextChip, createArrayChip, createDateRangeChip, createBooleanChip]);

  return (
    <FilterChips
      chips={chips}
      onRemoveChip={onRemoveFilter}
      onClearAll={onClearAllFilters}
      className={className}
      maxVisible={8}
      showClearAll={true}
      size="md"
      variant="filled"
    />
  );
});

export default FilterChips;
export type { FilterChip, FilterChipsProps };
