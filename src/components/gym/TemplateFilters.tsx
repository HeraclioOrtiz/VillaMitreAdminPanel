import React, { memo, useMemo, useCallback } from 'react';
import { SearchInput, MultiSelect } from '@/components/ui';
import { TemplateFilters as TemplateFiltersType } from '@/types/template';
import { 
  PRIMARY_GOALS, 
  DIFFICULTY_LEVELS, 
  INTENSITY_LEVELS,
  MUSCLE_GROUPS,
  EQUIPMENT_OPTIONS
} from '@/types/template';

export interface TemplateFiltersProps {
  filters: TemplateFiltersType;
  onFiltersChange: (filters: TemplateFiltersType) => void;
  onReset: () => void;
  className?: string;
}

const TemplateFilters = memo<TemplateFiltersProps>(function TemplateFilters({
  filters,
  onFiltersChange,
  onReset,
  className = ''
}) {
  // Memoized options
  const goalOptions = useMemo(() => 
    PRIMARY_GOALS.map(goal => ({
      value: goal.value,
      label: goal.label
    })), []
  );

  const difficultyOptions = useMemo(() => 
    DIFFICULTY_LEVELS.map(level => ({
      value: level.value,
      label: level.label
    })), []
  );

  const intensityOptions = useMemo(() => 
    INTENSITY_LEVELS.map(level => ({
      value: level.value,
      label: level.label
    })), []
  );

  const muscleGroupOptions = useMemo(() => 
    MUSCLE_GROUPS.map((group: any) => ({
      value: group.value,
      label: group.label,
      description: group.description
    })), []
  );

  const equipmentOptions = useMemo(() => 
    EQUIPMENT_OPTIONS.map((equipment: any) => ({
      value: equipment.value,
      label: equipment.label,
      description: equipment.description
    })), []
  );

  // Handlers
  const handleSearchChange = useCallback((search: string) => {
    onFiltersChange({ ...filters, search: search.trim() || undefined });
  }, [filters, onFiltersChange]);

  const handleGoalChange = useCallback((values: string[]) => {
    onFiltersChange({ 
      ...filters, 
      primary_goal: values.length > 0 ? values : []
    });
  }, [filters, onFiltersChange]);

  const handleDifficultyChange = useCallback((values: string[]) => {
    onFiltersChange({ 
      ...filters, 
      difficulty: values.length > 0 ? values : []
    });
  }, [filters, onFiltersChange]);

  const handleIntensityChange = useCallback((values: string[]) => {
    onFiltersChange({ 
      ...filters, 
      intensity_level: values.length > 0 ? values : []
    });
  }, [filters, onFiltersChange]);

  const handleMuscleGroupsChange = useCallback((groups: string[]) => {
    onFiltersChange({ 
      ...filters, 
      target_muscle_groups: groups.length > 0 ? groups : []
    });
  }, [filters, onFiltersChange]);

  const handleEquipmentChange = useCallback((equipment: string[]) => {
    onFiltersChange({ 
      ...filters, 
      equipment_needed: equipment.length > 0 ? equipment : []
    });
  }, [filters, onFiltersChange]);

  const handlePublicChange = useCallback((checked: boolean) => {
    onFiltersChange({ 
      ...filters, 
      is_public: checked ? true : undefined
    });
  }, [filters, onFiltersChange]);

  const handleFavoriteChange = useCallback((checked: boolean) => {
    onFiltersChange({ 
      ...filters, 
      is_favorite: checked ? true : undefined
    });
  }, [filters, onFiltersChange]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.search ||
      (filters.primary_goal && filters.primary_goal.length > 0) ||
      (filters.difficulty && filters.difficulty.length > 0) ||
      (filters.intensity_level && filters.intensity_level.length > 0) ||
      (filters.target_muscle_groups && filters.target_muscle_groups.length > 0) ||
      (filters.equipment_needed && filters.equipment_needed.length > 0) ||
      filters.is_public ||
      filters.is_favorite
    );
  }, [filters]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search */}
      <div>
        <SearchInput
          placeholder="Buscar plantillas..."
          value={filters.search || ''}
          onChange={handleSearchChange}
        />
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Primary Goal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Objetivo Principal
          </label>
          <MultiSelect
            options={goalOptions}
            value={filters.primary_goal || []}
            onChange={handleGoalChange}
            placeholder="Seleccionar objetivo"
          />
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dificultad
          </label>
          <MultiSelect
            options={difficultyOptions}
            value={filters.difficulty || []}
            onChange={handleDifficultyChange}
            placeholder="Seleccionar dificultad"
          />
        </div>

        {/* Intensity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intensidad
          </label>
          <MultiSelect
            options={intensityOptions}
            value={filters.intensity_level || []}
            onChange={handleIntensityChange}
            placeholder="Seleccionar intensidad"
          />
        </div>

        {/* Muscle Groups */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grupos Musculares
          </label>
          <MultiSelect
            options={muscleGroupOptions}
            value={filters.target_muscle_groups || []}
            onChange={handleMuscleGroupsChange}
            placeholder="Seleccionar grupos"
          />
        </div>

        {/* Equipment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Equipamiento
          </label>
          <MultiSelect
            options={equipmentOptions}
            value={filters.equipment_needed || []}
            onChange={handleEquipmentChange}
            placeholder="Seleccionar equipos"
          />
        </div>
      </div>

      {/* Boolean Filters */}
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.is_public === true}
            onChange={(e) => handlePublicChange(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="ml-2 text-sm text-gray-700">Solo públicas</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.is_favorite === true}
            onChange={(e) => handleFavoriteChange(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="ml-2 text-sm text-gray-700">Solo favoritas</span>
        </label>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <button
            onClick={onReset}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
});

export default TemplateFilters;
