import React, { useState, useMemo } from 'react';
import { SearchInput, MultiSelect, Button } from '@/components/ui';
import { useExercises } from '@/hooks/useExercises';
import { useDragAndDrop, type DragItem } from '@/hooks/useDragAndDrop';
import type { Exercise, ExerciseFilters } from '@/types/exercise';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  XMarkIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';

interface ExerciseSelectorProps {
  onExerciseSelect: (exercise: Exercise) => void;
  selectedExerciseIds?: number[];
  className?: string;
  showFilters?: boolean;
  maxHeight?: string;
}

const ExerciseSelector = ({
  onExerciseSelect,
  selectedExerciseIds = [],
  className = '',
  showFilters = true,
  maxHeight = 'max-h-96',
}: ExerciseSelectorProps) => {
  
  const [filters, setFilters] = useState<ExerciseFilters>({
    search: '',
    muscle_group: [],
    equipment: [],
    difficulty: [],
    tags: [],
  });
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const dragAndDrop = useDragAndDrop();

  // Fetch exercises with filters
  const { data: exercisesData, isLoading } = useExercises({
    ...filters,
    per_page: 50, // Limit for performance
  });

  const exercises = exercisesData?.data || [];

  // Filter out already selected exercises
  const availableExercises = useMemo(() => {
    return exercises.filter(exercise => !selectedExerciseIds.includes(exercise.id));
  }, [exercises, selectedExerciseIds]);

  // Handle search
  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof ExerciseFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      muscle_group: [],
      equipment: [],
      difficulty: [],
      tags: [],
    });
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, exercise: Exercise) => {
    const dragItem: DragItem = {
      id: exercise.id,
      type: 'exercise',
      data: exercise,
    };
    
    dragAndDrop.handleDragStart(dragItem);
    
    // Set drag data for native drag & drop
    e.dataTransfer.setData('application/json', JSON.stringify(dragItem));
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Get difficulty badge styles
  const getDifficultyBadge = (difficulty: string) => {
    const styles: Record<string, string> = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800',
      'Principiante': 'bg-green-100 text-green-800',
      'Intermedio': 'bg-yellow-100 text-yellow-800',
      'Avanzado': 'bg-red-100 text-red-800',
    };

    const labels: Record<string, string> = {
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado',
      'Principiante': 'Principiante',
      'Intermedio': 'Intermedio',
      'Avanzado': 'Avanzado',
    };

    const styleClass = styles[difficulty] || 'bg-gray-100 text-gray-800';
    const label = labels[difficulty] || difficulty;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styleClass}`}>
        {label}
      </span>
    );
  };

  // Get muscle group colors
  const getMuscleGroupColor = (group: string) => {
    const colors: Record<string, string> = {
      chest: 'bg-red-100 text-red-700',
      back: 'bg-blue-100 text-blue-700',
      shoulders: 'bg-yellow-100 text-yellow-700',
      biceps: 'bg-purple-100 text-purple-700',
      triceps: 'bg-pink-100 text-pink-700',
      legs: 'bg-green-100 text-green-700',
      glutes: 'bg-indigo-100 text-indigo-700',
      core: 'bg-orange-100 text-orange-700',
      cardio: 'bg-teal-100 text-teal-700',
    };
    
    return colors[group] || 'bg-gray-100 text-gray-700';
  };

  // Filter options
  const MUSCLE_GROUP_OPTIONS = [
    { value: 'chest', label: 'Pecho' },
    { value: 'back', label: 'Espalda' },
    { value: 'shoulders', label: 'Hombros' },
    { value: 'biceps', label: 'Bíceps' },
    { value: 'triceps', label: 'Tríceps' },
    { value: 'legs', label: 'Piernas' },
    { value: 'glutes', label: 'Glúteos' },
    { value: 'core', label: 'Core' },
    { value: 'cardio', label: 'Cardio' },
  ];

  const EQUIPMENT_OPTIONS = [
    { value: 'barbell', label: 'Barra' },
    { value: 'dumbbell', label: 'Mancuernas' },
    { value: 'kettlebell', label: 'Kettlebell' },
    { value: 'cable', label: 'Polea' },
    { value: 'machine', label: 'Máquina' },
    { value: 'bodyweight', label: 'Peso Corporal' },
  ];

  const DIFFICULTY_OPTIONS = [
    { value: 'beginner', label: 'Principiante' },
    { value: 'intermediate', label: 'Intermedio' },
    { value: 'advanced', label: 'Avanzado' },
  ];

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Seleccionar Ejercicios
          </h3>
          
          {showFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              leftIcon={<FunnelIcon className="w-4 h-4" />}
            >
              Filtros
            </Button>
          )}
        </div>

        {/* Search */}
        <SearchInput
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Buscar ejercicios por nombre..."
          className="mb-4"
        />

        {/* Advanced Filters */}
        {showFilters && showAdvancedFilters && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MultiSelect
                value={filters.muscle_group}
                onChange={(values) => handleFilterChange('muscle_group', values)}
                options={MUSCLE_GROUP_OPTIONS}
                placeholder="Grupos musculares..."
              />
              
              <MultiSelect
                value={filters.equipment}
                onChange={(values) => handleFilterChange('equipment', values)}
                options={EQUIPMENT_OPTIONS}
                placeholder="Equipamiento..."
              />
              
              <MultiSelect
                value={filters.difficulty}
                onChange={(values) => handleFilterChange('difficulty', values)}
                options={DIFFICULTY_OPTIONS}
                placeholder="Dificultad..."
              />
            </div>
            
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
              >
                Limpiar filtros
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Exercise List */}
      <div className={`p-4 ${maxHeight} overflow-y-auto`}>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-villa-mitre-600"></div>
          </div>
        ) : availableExercises.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm">No se encontraron ejercicios</p>
            {Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="mt-2"
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {availableExercises.map((exercise) => (
              <div
                key={exercise.id}
                draggable
                onDragStart={(e) => handleDragStart(e, exercise)}
                onDragEnd={dragAndDrop.handleDragEnd}
                className={`
                  p-3 border border-gray-200 rounded-lg cursor-grab active:cursor-grabbing
                  hover:border-villa-mitre-300 hover:bg-villa-mitre-50 transition-colors
                  ${dragAndDrop.state.isDragging && dragAndDrop.state.draggedItem?.id === exercise.id 
                    ? 'opacity-50 transform scale-95' 
                    : ''
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <Bars3Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {exercise.name}
                      </h4>
                      {exercise.difficulty && getDifficultyBadge(exercise.difficulty)}
                    </div>
                    
                    {exercise.description && (
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {exercise.description}
                      </p>
                    )}
                    
                    {/* Muscle Groups */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {(() => {
                        // Manejar muscle_group como array o string
                        const mg = exercise.muscle_group;
                        let muscleGroups: string[] = [];
                        
                        if (Array.isArray(mg)) {
                          muscleGroups = mg;
                        } else if (mg) {
                          const mgString = String(mg);
                          muscleGroups = mgString.split(',').map(g => g.trim());
                        }
                        
                        return muscleGroups.slice(0, 3).map((group: string) => (
                          <span
                            key={group}
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getMuscleGroupColor(group)}`}
                          >
                            {MUSCLE_GROUP_OPTIONS.find(opt => opt.value === group)?.label || group}
                          </span>
                        ));
                      })()}
                      {(() => {
                        const mg = exercise.muscle_group;
                        let muscleGroups: string[] = [];
                        
                        if (Array.isArray(mg)) {
                          muscleGroups = mg;
                        } else if (mg) {
                          const mgString = String(mg);
                          muscleGroups = mgString.split(',');
                        }
                        
                        return muscleGroups.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{muscleGroups.length - 3} más
                          </span>
                        );
                      })()}
                    </div>

                    {/* Equipment */}
                    <div className="flex flex-wrap gap-1">
                      {(() => {
                        // Manejar equipment como array o string
                        const eq = exercise.equipment;
                        let equipmentList: string[] = [];
                        
                        if (Array.isArray(eq)) {
                          equipmentList = eq;
                        } else if (eq) {
                          const eqString = String(eq);
                          equipmentList = eqString.split(',').map(e => e.trim());
                        }
                        
                        return equipmentList.slice(0, 2).map((item: string) => (
                          <span
                            key={item}
                            className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                          >
                            {EQUIPMENT_OPTIONS.find(opt => opt.value === item)?.label || item}
                          </span>
                        ));
                      })()}
                      {(() => {
                        const eq = exercise.equipment;
                        let equipmentList: string[] = [];
                        
                        if (Array.isArray(eq)) {
                          equipmentList = eq;
                        } else if (eq) {
                          const eqString = String(eq);
                          equipmentList = eqString.split(',');
                        }
                        
                        return equipmentList.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{equipmentList.length - 2} más
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onExerciseSelect(exercise)}
                    className="ml-2 flex-shrink-0"
                    title="Agregar ejercicio"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {availableExercises.length} ejercicio(s) disponible(s)
          </span>
          <span>
            Arrastra o haz clic en + para agregar
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExerciseSelector;
