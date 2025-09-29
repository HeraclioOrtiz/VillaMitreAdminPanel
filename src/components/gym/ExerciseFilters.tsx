import React, { useState, memo, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui';
import SearchInput from '@/components/ui/SearchInput';
import MultiSelect from '@/components/ui/MultiSelect';
import type { ExerciseFilters } from '@/types/exercise';
import {
  MUSCLE_GROUPS,
  EQUIPMENT_TYPES,
  DIFFICULTY_LEVELS,
  type MuscleGroup,
  type EquipmentType,
  type DifficultyLevel,
} from '@/types/exercise';
import {
  FunnelIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

interface ExerciseFiltersProps {
  filters: ExerciseFilters;
  onFiltersChange: (filters: ExerciseFilters) => void;
  onReset?: () => void;
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

const ExerciseFiltersComponent = memo<ExerciseFiltersProps>(function ExerciseFilters({
  filters,
  onFiltersChange,
  onReset,
  className = '',
  collapsible = true,
  defaultCollapsed = false,
}) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  // Memoizar opciones para los MultiSelect
  const muscleGroupOptions = useMemo(() => 
    MUSCLE_GROUPS.map((group) => ({
      value: group,
      label: getMuscleGroupLabel(group),
      group: 'Grupos Musculares',
    })), []
  );

  const equipmentOptions = useMemo(() => 
    EQUIPMENT_TYPES.map((equipment) => ({
      value: equipment,
      label: getEquipmentLabel(equipment),
      group: 'Equipamiento',
    })), []
  );

  const difficultyOptions = DIFFICULTY_LEVELS.map((difficulty) => ({
    value: difficulty,
    label: getDifficultyLabel(difficulty),
    group: 'Dificultad',
  }));

  // Etiquetas en español para los grupos musculares
  function getMuscleGroupLabel(group: MuscleGroup): string {
    const labels: Record<MuscleGroup, string> = {
      chest: 'Pecho',
      back: 'Espalda',
      shoulders: 'Hombros',
      biceps: 'Bíceps',
      triceps: 'Tríceps',
      legs: 'Piernas',
      glutes: 'Glúteos',
      core: 'Core',
      cardio: 'Cardio',
      'full-body': 'Cuerpo Completo',
    };
    return labels[group] || group;
  }

  // Etiquetas en español para el equipamiento
  function getEquipmentLabel(equipment: EquipmentType): string {
    const labels: Record<EquipmentType, string> = {
      barbell: 'Barra',
      dumbbell: 'Mancuernas',
      kettlebell: 'Kettlebell',
      cable: 'Polea',
      machine: 'Máquina',
      bodyweight: 'Peso Corporal',
      'resistance-band': 'Banda Elástica',
      'medicine-ball': 'Pelota Medicinal',
      suspension: 'Suspensión (TRX)',
      other: 'Otro',
    };
    return labels[equipment] || equipment;
  }

  // Etiquetas en español para la dificultad
  function getDifficultyLabel(difficulty: DifficultyLevel): string {
    const labels: Record<DifficultyLevel, string> = {
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado',
    };
    return labels[difficulty] || difficulty;
  }

  // Manejar cambios en los filtros
  const handleFilterChange = (key: keyof ExerciseFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  // Resetear filtros
  const handleReset = () => {
    const resetFilters: ExerciseFilters = {
      search: '',
      muscle_group: [],
      equipment: [],
      difficulty: [],
      tags: [],
    };
    onFiltersChange(resetFilters);
    onReset?.();
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = 
    filters.search ||
    filters.muscle_group.length > 0 ||
    filters.equipment.length > 0 ||
    filters.difficulty.length > 0 ||
    filters.tags.length > 0;

  // Contar filtros activos
  const activeFiltersCount = 
    (filters.search ? 1 : 0) +
    filters.muscle_group.length +
    filters.equipment.length +
    filters.difficulty.length +
    filters.tags.length;

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      {collapsible && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <FunnelIcon className="h-4 w-4" />
            <span>Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-villa-mitre-100 text-villa-mitre-800">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                leftIcon={<XMarkIcon className="h-4 w-4" />}
              >
                Limpiar
              </Button>
            )}
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-gray-400 hover:text-gray-600"
            >
              <AdjustmentsHorizontalIcon 
                className={`h-4 w-4 transition-transform duration-200 ${
                  isCollapsed ? 'rotate-0' : 'rotate-90'
                }`} 
              />
            </button>
          </div>
        </div>
      )}

      {/* Filters Content */}
      {(!collapsible || !isCollapsed) && (
        <div className="p-4 space-y-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar ejercicios
            </label>
            <SearchInput
              value={filters.search}
              onChange={(value) => handleFilterChange('search', value)}
              placeholder="Buscar por nombre de ejercicio..."
              className="w-full"
            />
          </div>

          {/* Muscle Groups */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grupos Musculares
            </label>
            <MultiSelect
              options={muscleGroupOptions}
              value={filters.muscle_group}
              onChange={(value) => handleFilterChange('muscle_group', value)}
              placeholder="Seleccionar grupos musculares..."
              groupBy={false}
              searchable={true}
              clearable={true}
            />
          </div>

          {/* Equipment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Equipamiento
            </label>
            <MultiSelect
              options={equipmentOptions}
              value={filters.equipment}
              onChange={(value) => handleFilterChange('equipment', value)}
              placeholder="Seleccionar equipamiento..."
              groupBy={false}
              searchable={true}
              clearable={true}
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dificultad
            </label>
            <MultiSelect
              options={difficultyOptions}
              value={filters.difficulty}
              onChange={(value) => handleFilterChange('difficulty', value)}
              placeholder="Seleccionar dificultad..."
              groupBy={false}
              searchable={false}
              clearable={true}
              maxSelections={3}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <SearchInput
              value={filters.tags.join(', ')}
              onChange={(value) => 
                handleFilterChange('tags', value.split(',').map(tag => tag.trim()).filter(Boolean))
              }
              placeholder="Ej: fuerza, hipertrofia, funcional..."
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separa múltiples tags con comas
            </p>
          </div>

          {/* Action Buttons */}
          {!collapsible && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                {activeFiltersCount > 0 && (
                  <span>{activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} activo{activeFiltersCount !== 1 ? 's' : ''}</span>
                )}
              </div>
              
              {hasActiveFilters && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleReset}
                  leftIcon={<XMarkIcon className="h-4 w-4" />}
                >
                  Limpiar Filtros
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default ExerciseFiltersComponent;
