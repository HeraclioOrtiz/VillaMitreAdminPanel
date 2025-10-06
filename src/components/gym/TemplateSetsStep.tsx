import React, { useState, useEffect } from 'react';
import SetEditor from './SetEditor';
import TemplatePreview from './TemplatePreview';
import { Button } from '@/components/ui';
import type { TemplateFormData, TemplateExercise, SetConfiguration } from '@/types/template';
import {
  CogIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

interface TemplateSetsStepProps {
  data: Partial<TemplateFormData>;
  onDataChange: (data: Partial<TemplateFormData>) => void;
  onValidationChange?: (isValid: boolean) => void;
  errors?: string[];
  isLoading?: boolean;
}

const TemplateSetsStep = ({
  data,
  onDataChange,
  onValidationChange,
  errors = [],
  isLoading = false,
}: TemplateSetsStepProps) => {

  const [currentView, setCurrentView] = useState<'editor' | 'preview'>('editor');
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(0);
  
  // Extraer ejercicios de la estructura correcta
  // El paso 2 guarda { exercises: [...] } bajo la clave 'exercises'
  // Entonces data.exercises = { exercises: [...] }
  const getExercises = () => {
    // Si data.exercises es un objeto con propiedad exercises
    if (data.exercises && typeof data.exercises === 'object' && 'exercises' in data.exercises) {
      return Array.isArray(data.exercises.exercises) ? data.exercises.exercises : [];
    }
    // Si data.exercises ya es un array
    if (Array.isArray(data.exercises)) {
      return data.exercises;
    }
    // Fallback a array vacío
    return [];
  };

  const initialExercises = getExercises();
  const [exercises, setExercises] = useState<any[]>(initialExercises);

  // Sincronizar con datos externos cuando cambian
  useEffect(() => {
    const newExercises = getExercises();
    if (newExercises.length > 0 && newExercises.length !== exercises.length) {
      setExercises(newExercises);
    }
  }, [data.exercises]);

  // Validate step
  const validateStep = () => {
    const hasExercises = exercises.length > 0;
    const allExercisesHaveSets = exercises.every(exercise => 
      exercise.sets && exercise.sets.length > 0
    );
    const isValid = hasExercises && allExercisesHaveSets;
    
    onValidationChange?.(isValid);
    return isValid;
  };

  // Update parent data when exercises change
  useEffect(() => {
    onDataChange({
      exercises: exercises,
    });
    validateStep();
  }, [exercises]);

  // Update sets for specific exercise
  const updateExerciseSets = (exerciseIndex: number, sets: any[]) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex] = {
      ...updatedExercises[exerciseIndex],
      sets: sets,
    };
    setExercises(updatedExercises);
  };

  // Update exercise notes and rest time
  const updateExerciseConfig = (exerciseIndex: number, config: any) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex] = {
      ...updatedExercises[exerciseIndex],
      ...config,
    };
    setExercises(updatedExercises);
  };

  // Copy sets configuration to other exercises
  const copySetsToExercise = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    const sourceSets = exercises[fromIndex].sets;
    if (!sourceSets || sourceSets.length === 0) return;

    // Create new sets with unique IDs
    const copiedSets = sourceSets.map((set: any) => ({
      ...set,
      id: `set-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));

    updateExerciseSets(toIndex, copiedSets);
  };

  // Apply same configuration to all exercises
  const applyToAllExercises = () => {
    if (exercises.length === 0 || selectedExerciseIndex >= exercises.length) return;
    
    const sourceExercise = exercises[selectedExerciseIndex];
    const sourceSets = sourceExercise.sets;
    const sourceConfig = {
      rest_between_sets: sourceExercise.rest_between_sets,
      notes: sourceExercise.notes,
    };

    if (!sourceSets || sourceSets.length === 0) return;

    const updatedExercises = exercises.map((exercise, index) => {
      if (index === selectedExerciseIndex) return exercise;

      // Create new sets with unique IDs
      const copiedSets = sourceSets.map((set: any) => ({
        ...set,
        id: `set-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
      }));

      return {
        ...exercise,
        sets: copiedSets,
        ...sourceConfig,
      };
    });

    setExercises(updatedExercises);
  };

  // Get completion status
  const getCompletionStatus = () => {
    const totalExercises = exercises.length;
    const completedExercises = exercises.filter(ex => ex.sets && ex.sets.length > 0).length;
    return { completed: completedExercises, total: totalExercises };
  };

  const { completed, total } = getCompletionStatus();
  const currentExercise = exercises[selectedExerciseIndex];

  if (exercises.length === 0) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay ejercicios seleccionados
        </h3>
        <p className="text-gray-600 mb-4">
          Debes seleccionar al menos un ejercicio en el paso anterior para configurar las series.
        </p>
        <Button
          variant="secondary"
          leftIcon={<ArrowLeftIcon className="w-4 h-4" />}
          onClick={() => window.history.back()}
        >
          Volver al Paso Anterior
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Configuración de Series
            </h3>
            <p className="text-sm text-gray-600">
              Configura las series, repeticiones y descansos para cada ejercicio
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Progress */}
            <div className="text-sm text-gray-600">
              {completed} de {total} ejercicios configurados
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCurrentView('editor')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  currentView === 'editor'
                    ? 'bg-white text-villa-mitre-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <CogIcon className="w-4 h-4 mr-1.5 inline" />
                Editor
              </button>
              <button
                onClick={() => setCurrentView('preview')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  currentView === 'preview'
                    ? 'bg-white text-villa-mitre-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <EyeIcon className="w-4 h-4 mr-1.5 inline" />
                Vista Previa
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-villa-mitre-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      {currentView === 'editor' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Exercise List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-4">
                Ejercicios ({exercises.length})
              </h4>
              
              <div className="space-y-2">
                {exercises.map((exercise, index) => (
                  <button
                    key={exercise.exercise_id}
                    onClick={() => setSelectedExerciseIndex(index)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedExerciseIndex === index
                        ? 'border-villa-mitre-300 bg-villa-mitre-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-gray-500">
                            #{index + 1}
                          </span>
                          {exercise.sets && exercise.sets.length > 0 ? (
                            <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate mt-1">
                          {exercise.exercise?.name || `Ejercicio ${exercise.exercise_id}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {exercise.sets?.length || 0} serie(s)
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              {exercises.length > 1 && currentExercise?.sets && currentExercise.sets.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={applyToAllExercises}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Aplicar a Todos
                  </Button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Copia la configuración actual a todos los ejercicios
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Set Editor */}
          <div className="lg:col-span-3">
            {currentExercise ? (
              <div className="space-y-6">
                {/* Exercise Header */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {currentExercise.exercise?.name || `Ejercicio ${currentExercise.exercise_id}`}
                      </h4>
                      {currentExercise.exercise?.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {currentExercise.exercise.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedExerciseIndex(Math.max(0, selectedExerciseIndex - 1))}
                        disabled={selectedExerciseIndex === 0}
                        leftIcon={<ArrowLeftIcon className="w-4 h-4" />}
                      >
                        Anterior
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedExerciseIndex(Math.min(exercises.length - 1, selectedExerciseIndex + 1))}
                        disabled={selectedExerciseIndex === exercises.length - 1}
                        rightIcon={<ArrowRightIcon className="w-4 h-4" />}
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>

                  {/* Exercise Configuration */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descanso entre series (segundos)
                      </label>
                      <input
                        type="number"
                        value={currentExercise.rest_between_sets || ''}
                        onChange={(e) => updateExerciseConfig(selectedExerciseIndex, {
                          rest_between_sets: parseInt(e.target.value) || undefined
                        })}
                        placeholder="60"
                        min="0"
                        disabled={isLoading}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-villa-mitre-500 focus:border-villa-mitre-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notas del ejercicio
                      </label>
                      <input
                        type="text"
                        value={currentExercise.notes || ''}
                        onChange={(e) => updateExerciseConfig(selectedExerciseIndex, {
                          notes: e.target.value
                        })}
                        placeholder="Instrucciones específicas..."
                        disabled={isLoading}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-villa-mitre-500 focus:border-villa-mitre-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Set Editor */}
                <SetEditor
                  sets={currentExercise.sets || []}
                  onSetsChange={(sets) => updateExerciseSets(selectedExerciseIndex, sets)}
                  exerciseName={currentExercise.exercise?.name}
                  disabled={isLoading}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <CogIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Selecciona un ejercicio para configurar sus series</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Preview Mode */
        <TemplatePreview data={{ ...data, exercises }} />
      )}

      {/* Help Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <InformationCircleIcon className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Configuración de Series:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Configura al menos una serie para cada ejercicio para continuar</li>
              <li>Usa "Aplicar a Todos" para copiar la configuración a todos los ejercicios</li>
              <li>El botón ↓ en cada campo copia el valor a todas las series del ejercicio</li>
              <li>Usa la vista previa para revisar la plantilla completa antes de crear</li>
              <li>Los campos opcionales (peso objetivo, rango de peso, RPE, duración, distancia) pueden dejarse vacíos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSetsStep;
