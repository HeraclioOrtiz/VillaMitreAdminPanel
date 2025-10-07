/**
 * Componente de filtros avanzados para asignaciones
 * Reutiliza patrones del sistema de filtros de usuarios
 */

import React, { memo, useMemo, useCallback } from 'react';
import {
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import type { AssignmentFilters as AssignmentFiltersType, AssignmentStatus } from '@/types/assignment';
import { ASSIGNMENT_STATUSES } from '@/types/assignment';
import type { User } from '@/types/user';
import { SearchInput, MultiSelect, DateRangePicker, Button, FilterChips } from '@/components/ui';
import { useFilterChips } from '@/components/ui/FilterChips';

interface AssignmentFiltersProps {
  filters: AssignmentFiltersType;
  onFiltersChange: (filters: AssignmentFiltersType) => void;
  onReset?: () => void;
  availableProfessors?: User[];
  availableStudents?: User[];
  collapsible?: boolean;
  showChips?: boolean;
  className?: string;
}

/**
 * Componente de chips de filtros específico para asignaciones
 */
const AssignmentFilterChips = memo<{
  filters: AssignmentFiltersType;
  onRemoveFilter: (filterKey: string) => void;
  onClearAllFilters: () => void;
  availableProfessors?: User[];
  availableStudents?: User[];
}>(function AssignmentFilterChips({ 
  filters, 
  onRemoveFilter, 
  onClearAllFilters,
  availableProfessors = [],
  availableStudents = [],
}) {
  const { createTextChip, createArrayChip, createDateRangeChip } = useFilterChips();

  const chips = useMemo(() => {
    const chipList = [];

    // Búsqueda general
    if (filters.search) {
      chipList.push(createTextChip('search', 'Búsqueda', filters.search, 'blue'));
    }

    // Profesor
    if (filters.professor_id) {
      const professor = availableProfessors.find(p => p.id === filters.professor_id);
      const professorName = professor ? `${professor.first_name} ${professor.last_name}` : `ID: ${filters.professor_id}`;
      chipList.push(createTextChip('professor_id', 'Profesor', professorName, 'green'));
    }

    // Estudiante
    if (filters.student_id) {
      const student = availableStudents.find(s => s.id === filters.student_id);
      const studentName = student ? `${student.first_name} ${student.last_name}` : `ID: ${filters.student_id}`;
      chipList.push(createTextChip('student_id', 'Estudiante', studentName, 'purple'));
    }

    // Estado
    if (filters.status) {
      const statusConfig = ASSIGNMENT_STATUSES.find(s => s.value === filters.status);
      chipList.push(createTextChip('status', 'Estado', statusConfig?.label || filters.status, 'yellow'));
    }

    // Rango de fechas
    if (filters.start_date_from || filters.start_date_to) {
      const dateChip = createDateRangeChip(
        'date_range',
        'Fecha de inicio',
        filters.start_date_from,
        filters.start_date_to,
        'indigo'
      );
      if (dateChip) chipList.push(dateChip);
    }

    return chipList.filter(Boolean);
  }, [filters, availableProfessors, availableStudents, createTextChip, createArrayChip, createDateRangeChip]);

  if (chips.length === 0) return null;

  return (
    <FilterChips
      chips={chips}
      onRemoveChip={onRemoveFilter}
      onClearAll={onClearAllFilters}
      maxVisible={5}
      className="mb-4"
    />
  );
});

/**
 * Componente principal de filtros de asignaciones
 */
export const AssignmentFilters: React.FC<AssignmentFiltersProps> = memo(function AssignmentFilters({
  filters,
  onFiltersChange,
  onReset,
  availableProfessors = [],
  availableStudents = [],
  collapsible = false,
  showChips = true,
  className = '',
}) {
  const [isExpanded, setIsExpanded] = React.useState(!collapsible);

  // Opciones memoizadas para MultiSelect
  const statusOptions = useMemo(() =>
    ASSIGNMENT_STATUSES.map((status) => ({
      value: status.value,
      label: status.label,
      description: `Asignaciones en estado ${status.label.toLowerCase()}`,
      group: 'Estados de Asignación',
    })), []
  );

  const professorOptions = useMemo(() =>
    availableProfessors.map((professor) => ({
      value: professor.id.toString(),
      label: `${professor.first_name} ${professor.last_name}`,
      description: professor.email,
      group: 'Profesores Disponibles',
    })), [availableProfessors]
  );

  const studentOptions = useMemo(() =>
    availableStudents.map((student) => ({
      value: student.id.toString(),
      label: `${student.first_name} ${student.last_name}`,
      description: student.email,
      group: 'Estudiantes',
    })), [availableStudents]
  );

  // Handlers optimizados
  const handleSearchChange = useCallback((search: string) => {
    onFiltersChange({ ...filters, search: search || undefined });
  }, [filters, onFiltersChange]);

  const handleProfessorChange = useCallback((professorIds: string[]) => {
    const professorId = professorIds.length > 0 ? parseInt(professorIds[0]) : undefined;
    onFiltersChange({ ...filters, professor_id: professorId });
  }, [filters, onFiltersChange]);

  const handleStudentChange = useCallback((studentIds: string[]) => {
    const studentId = studentIds.length > 0 ? parseInt(studentIds[0]) : undefined;
    onFiltersChange({ ...filters, student_id: studentId });
  }, [filters, onFiltersChange]);

  const handleStatusChange = useCallback((statuses: string[]) => {
    const status = statuses.length > 0 ? statuses[0] as AssignmentStatus : undefined;
    onFiltersChange({ ...filters, status });
  }, [filters, onFiltersChange]);

  const handleDateRangeChange = useCallback((dateRange: { start?: string; end?: string }) => {
    onFiltersChange({
      ...filters,
      start_date_from: dateRange.start || undefined,
      start_date_to: dateRange.end || undefined,
    });
  }, [filters, onFiltersChange]);

  const handleRemoveFilter = useCallback((filterKey: string) => {
    const newFilters = { ...filters };
    
    switch (filterKey) {
      case 'search':
        delete newFilters.search;
        break;
      case 'professor_id':
        delete newFilters.professor_id;
        break;
      case 'student_id':
        delete newFilters.student_id;
        break;
      case 'status':
        delete newFilters.status;
        break;
      case 'date_range':
        delete newFilters.start_date_from;
        delete newFilters.start_date_to;
        break;
    }
    
    onFiltersChange(newFilters);
  }, [filters, onFiltersChange]);

  const handleClearAllFilters = useCallback(() => {
    onFiltersChange({});
  }, [onFiltersChange]);

  const handleReset = useCallback(() => {
    onReset?.();
  }, [onReset]);

  // Contar filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.professor_id) count++;
    if (filters.student_id) count++;
    if (filters.status) count++;
    if (filters.start_date_from || filters.start_date_to) count++;
    return count;
  }, [filters]);

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Header con toggle si es collapsible */}
      {collapsible && (
        <div className="px-6 py-4 border-b border-gray-200">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <span className="text-lg font-medium text-gray-900">Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            {isExpanded ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      )}

      {/* Chips de filtros activos */}
      {showChips && isExpanded && (
        <div className="px-6 pt-4">
          <AssignmentFilterChips
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
            onClearAllFilters={handleClearAllFilters}
            availableProfessors={availableProfessors}
            availableStudents={availableStudents}
          />
        </div>
      )}

      {/* Contenido de filtros */}
      {isExpanded && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Búsqueda general */}
            <div className="lg:col-span-3">
              <SearchInput
                placeholder="Buscar por nombre de profesor, estudiante o notas..."
                value={filters.search || ''}
                onChange={handleSearchChange}
                className="w-full"
              />
            </div>

            {/* Profesor */}
            <div>
              <MultiSelect
                label="Profesor"
                placeholder="Seleccionar profesor"
                options={professorOptions}
                value={filters.professor_id ? [filters.professor_id.toString()] : []}
                onChange={handleProfessorChange}
                maxSelections={1}
                searchable
              />
            </div>

            {/* Estudiante */}
            <div>
              <MultiSelect
                label="Estudiante"
                placeholder="Seleccionar estudiante"
                options={studentOptions}
                value={filters.student_id ? [filters.student_id.toString()] : []}
                onChange={handleStudentChange}
                maxSelections={1}
                searchable
              />
            </div>

            {/* Estado */}
            <div>
              <MultiSelect
                label="Estado"
                placeholder="Seleccionar estado"
                options={statusOptions}
                value={filters.status ? [filters.status] : []}
                onChange={handleStatusChange}
                maxSelections={1}
              />
            </div>

            {/* Rango de fechas */}
            <div className="lg:col-span-2">
              <DateRangePicker
                label="Fecha de Inicio"
                value={{
                  start: filters.start_date_from,
                  end: filters.start_date_to,
                }}
                onChange={handleDateRangeChange}
                placeholder="Seleccionar rango de fechas"
                clearable
              />
            </div>

            {/* Botón de reset */}
            <div className="flex items-end">
              <Button
                variant="secondary"
                onClick={handleReset}
                disabled={activeFiltersCount === 0}
                leftIcon={<XMarkIcon className="w-4 h-4" />}
                className="w-full"
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default AssignmentFilters;
