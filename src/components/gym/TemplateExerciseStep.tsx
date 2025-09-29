import React, { useState, useEffect } from 'react';
import ExerciseSelector from './ExerciseSelector';
import { useSortableList, type DragItem, type DropZone } from '@/hooks/useDragAndDrop';
import type { Exercise } from '@/types/exercise';
import type { TemplateExercise, TemplateFormData } from '@/types/template';
import { Button } from '@/components/ui';
import {
  Bars3Icon,
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  InformationCircleIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';

interface TemplateExerciseStepProps {
  data: Partial<TemplateFormData>;
  onDataChange: (data: Partial<TemplateFormData>) => void;
  onValidationChange?: (isValid: boolean) => void;
  errors?: string[];
  isLoading?: boolean;
}

const TemplateExerciseStep = ({
  data,
  onDataChange,
  onValidationChange,
  errors = [],
  isLoading = false,
}: TemplateExerciseStepProps) => {

  const [selectedExercises, setSelectedExercises] = useState<any[]>(
    data.exercises || []
  );

  // Sortable list for selected exercises with proper id mapping
  const sortableExercises = selectedExercises.map(ex => ({
    ...ex,
    id: ex.exercise_id, // Use exercise_id as the required id
  }));

  const {
    items: sortableItems,
    setItems: setSortableItems,
    handleReorder,
    addItem,
    removeItem,
    dragAndDrop,
  } = useSortableList(sortableExercises, (newItems) => {
    // Convert back to TemplateExercise format
    const templateExercises = newItems.map(({ id, ...rest }) => rest as TemplateExercise);
    setSelectedExercises(templateExercises);
  });

  // Validate step
  const validateStep = () => {
    const isValid = selectedExercises.length > 0;
    onValidationChange?.(isValid);
    return isValid;
  };

  // Update parent data when exercises change
  useEffect(() => {
    onDataChange({
      exercises: selectedExercises,
    });
    validateStep();
  }, [selectedExercises]);

  // Handle exercise selection from selector
  const handleExerciseSelect = (exercise: Exercise) => {
    const newTemplateExercise: any = {
      exercise_id: exercise.id,
      exercise: exercise,
      order: selectedExercises.length + 1,
      sets: [
        {
          id: `temp-${Date.now()}`,
          reps: 12,
          rest_time: 60,
        } as any,
      ],
      rest_between_sets: 60,
    };

    // Add with proper id for sortable list
    const sortableItem = { ...newTemplateExercise, id: newTemplateExercise.exercise_id };
    addItem(sortableItem);
  };

  // Handle drag and drop from selector
  const handleDropFromSelector = (dragItem: DragItem, targetIndex?: number) => {
    if (dragItem.type === 'exercise' && dragItem.data) {
      const exercise = dragItem.data as Exercise;
      
      // Check if exercise is already selected
      if (selectedExercises.some(ex => ex.exercise_id === exercise.id)) {
        return;
      }

      const newTemplateExercise: any = {
        exercise_id: exercise.id,
        exercise: exercise,
        order: targetIndex !== undefined ? targetIndex + 1 : selectedExercises.length + 1,
        sets: [
          {
            id: `temp-${Date.now()}`,
            reps: 12,
            rest_time: 60,
          } as any,
        ],
        rest_between_sets: 60,
      };

      if (targetIndex !== undefined) {
        const newExercises = [...selectedExercises];
        newExercises.splice(targetIndex, 0, newTemplateExercise);
        // Update order for all exercises
        const reorderedExercises = newExercises.map((ex, index) => ({
          ...ex,
          order: index + 1,
        }));
        setSelectedExercises(reorderedExercises);
        setSortableItems(reorderedExercises.map(ex => ({ ...ex, id: ex.exercise_id })));
      } else {
        const sortableItem = { ...newTemplateExercise, id: newTemplateExercise.exercise_id };
        addItem(sortableItem);
      }
    }
  };

  // Handle reordering within selected list
  const handleInternalReorder = (fromIndex: number, toIndex: number) => {
    handleReorder(fromIndex, toIndex);
  };

  // Remove exercise
  const handleRemoveExercise = (exerciseId: number) => {
    const templateExercise = selectedExercises.find(ex => ex.exercise_id === exerciseId);
    if (templateExercise) {
      removeItem(templateExercise.exercise_id);
    }
  };

  // Move exercise up/down
  const moveExercise = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < selectedExercises.length) {
      handleInternalReorder(index, newIndex);
    }
  };

  // Drop zone configuration
  const selectedListDropZone: DropZone = {
    id: 'selected-exercises',
    accepts: ['exercise'],
    onDrop: handleDropFromSelector,
  };

  // Get selected exercise IDs for selector
  const selectedExerciseIds = selectedExercises.map(ex => ex.exercise_id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Exercise Selector */}
      <div className="space-y-4">
        <ExerciseSelector
          onExerciseSelect={handleExerciseSelect}
          selectedExerciseIds={selectedExerciseIds}
          showFilters={true}
          maxHeight="max-h-[600px]"
        />
      </div>

      {/* Selected Exercises */}
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ListBulletIcon className="w-5 h-5 text-villa-mitre-600" />
                <h3 className="text-lg font-medium text-gray-900">
                  Ejercicios Seleccionados
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-villa-mitre-100 text-villa-mitre-800">
                  {selectedExercises.length}
                </span>
              </div>
            </div>
          </div>

          {/* Drop Zone */}
          <div
            data-drop-zone="selected-exercises"
            onDragOver={(e) => dragAndDrop.handleDragOver(e, 'selected-exercises')}
            onDragLeave={dragAndDrop.handleDragLeave}
            onDrop={(e) => dragAndDrop.handleDrop(e, selectedListDropZone)}
            className={`
              min-h-[400px] max-h-[600px] overflow-y-auto p-4
              ${dragAndDrop.isValidDropTarget('selected-exercises') 
                ? 'bg-villa-mitre-50 border-2 border-dashed border-villa-mitre-300' 
                : ''
              }
            `}
          >
            {selectedExercises.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <ListBulletIcon className="w-12 h-12 mb-4 text-gray-300" />
                <p className="text-sm font-medium mb-2">No hay ejercicios seleccionados</p>
                <p className="text-xs text-center">
                  Arrastra ejercicios desde la izquierda o haz clic en el botón +
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedExercises.map((templateExercise, index) => (
                  <div
                    key={templateExercise.exercise_id}
                    draggable
                    onDragStart={(e) => {
                      const dragItem: DragItem = {
                        id: templateExercise.exercise_id,
                        type: 'template-exercise',
                        data: { ...templateExercise, index },
                      };
                      dragAndDrop.handleDragStart(dragItem);
                      e.dataTransfer.setData('application/json', JSON.stringify(dragItem));
                    }}
                    onDragEnd={dragAndDrop.handleDragEnd}
                    className={`
                      p-4 border border-gray-200 rounded-lg bg-white
                      hover:border-villa-mitre-300 transition-colors cursor-grab active:cursor-grabbing
                      ${dragAndDrop.state.isDragging && dragAndDrop.state.draggedItem?.id === templateExercise.exercise_id
                        ? 'opacity-50 transform scale-95'
                        : ''
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {/* Drag Handle */}
                        <div className="flex flex-col items-center space-y-1 pt-1">
                          <Bars3Icon className="w-4 h-4 text-gray-400" />
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center">
                            {index + 1}
                          </span>
                        </div>

                        {/* Exercise Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">
                            {templateExercise.exercise?.name}
                          </h4>
                          
                          {templateExercise.exercise?.description && (
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                              {templateExercise.exercise.description}
                            </p>
                          )}

                          {/* Sets Preview */}
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{templateExercise.sets.length} serie(s)</span>
                            <span>
                              {templateExercise.sets[0]?.reps || 12} reps
                            </span>
                            <span>
                              {templateExercise.rest_between_sets || 60}s descanso
                            </span>
                          </div>

                          {/* Muscle Groups */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {templateExercise.exercise?.muscle_group.slice(0, 2).map((group: any) => (
                              <span
                                key={group}
                                className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                              >
                                {group}
                              </span>
                            ))}
                            {(templateExercise.exercise?.muscle_group.length || 0) > 2 && (
                              <span className="text-xs text-gray-500">
                                +{(templateExercise.exercise?.muscle_group.length || 0) - 2} más
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveExercise(index, 'up')}
                          disabled={index === 0}
                          className="p-1"
                          title="Mover arriba"
                        >
                          <ArrowUpIcon className="w-3 h-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveExercise(index, 'down')}
                          disabled={index === selectedExercises.length - 1}
                          className="p-1"
                          title="Mover abajo"
                        >
                          <ArrowDownIcon className="w-3 h-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveExercise(templateExercise.exercise_id)}
                          className="p-1 text-red-600 hover:text-red-700"
                          title="Eliminar"
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {selectedExercises.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  {selectedExercises.length} ejercicio(s) seleccionado(s)
                </span>
                <span>
                  Arrastra para reordenar
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Information Panel */}
      <div className="lg:col-span-2">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <InformationCircleIcon className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Consejos para seleccionar ejercicios:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Selecciona al menos un ejercicio para continuar</li>
                <li>Arrastra ejercicios para cambiar el orden de ejecución</li>
                <li>Usa los filtros para encontrar ejercicios específicos</li>
                <li>El orden de los ejercicios afecta el flujo del entrenamiento</li>
                <li>Considera alternar grupos musculares para mejor recuperación</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateExerciseStep;
