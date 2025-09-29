import React, { useCallback } from 'react';
import { FormField, Button } from '@/components/ui';
import type { SetConfiguration } from '@/types/template';
import {
  PlusIcon,
  XMarkIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  HashtagIcon,
} from '@heroicons/react/24/outline';

interface SetEditorProps {
  sets: SetConfiguration[];
  onSetsChange: (sets: SetConfiguration[]) => void;
  exerciseName?: string;
  disabled?: boolean;
  className?: string;
}

const SetEditor = ({
  sets,
  onSetsChange,
  exerciseName,
  disabled = false,
  className = '',
}: SetEditorProps) => {

  // Agregar nueva serie
  const addSet = useCallback(() => {
    const newSet: SetConfiguration = {
      id: `set-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      reps: 12,
      weight: undefined,
      duration: undefined,
      distance: undefined,
      rest_time: 60,
      notes: '',
      rpe: undefined,
      tempo: '',
    };

    onSetsChange([...sets, newSet]);
  }, [sets, onSetsChange]);

  // Eliminar serie
  const removeSet = useCallback((setId: string) => {
    onSetsChange(sets.filter(set => set.id !== setId));
  }, [sets, onSetsChange]);

  // Actualizar serie específica
  const updateSet = useCallback((setId: string, updates: Partial<SetConfiguration>) => {
    onSetsChange(
      sets.map(set =>
        set.id === setId ? { ...set, ...updates } : set
      )
    );
  }, [sets, onSetsChange]);

  // Duplicar serie
  const duplicateSet = useCallback((setIndex: number) => {
    const setToDuplicate = sets[setIndex];
    const duplicatedSet: SetConfiguration = {
      ...setToDuplicate,
      id: `set-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    const newSets = [...sets];
    newSets.splice(setIndex + 1, 0, duplicatedSet);
    onSetsChange(newSets);
  }, [sets, onSetsChange]);

  // Copiar configuración a todas las series
  const copyToAllSets = useCallback((sourceSetId: string, field: keyof SetConfiguration) => {
    const sourceSet = sets.find(set => set.id === sourceSetId);
    if (!sourceSet) return;

    const value = sourceSet[field];
    // Solo copiar si el valor no es undefined
    if (value !== undefined) {
      onSetsChange(
        sets.map(set => ({ ...set, [field]: value }))
      );
    }
  }, [sets, onSetsChange]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">
            Configuración de Series
            {exerciseName && (
              <span className="text-gray-500 font-normal"> - {exerciseName}</span>
            )}
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            {sets.length} serie(s) configurada(s)
          </p>
        </div>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={addSet}
          disabled={disabled}
          leftIcon={<PlusIcon className="w-4 h-4" />}
        >
          Agregar Serie
        </Button>
      </div>

      {/* Sets List */}
      {sets.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <HashtagIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 mb-2">No hay series configuradas</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={addSet}
            disabled={disabled}
            leftIcon={<PlusIcon className="w-4 h-4" />}
          >
            Agregar Primera Serie
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {sets.map((set, index) => (
            <div
              key={set.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              {/* Set Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-villa-mitre-100 text-villa-mitre-700 text-xs font-medium rounded-full">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    Serie {index + 1}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => duplicateSet(index)}
                    disabled={disabled}
                    title="Duplicar serie"
                    className="p-1"
                  >
                    <ArrowPathIcon className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSet(set.id!)}
                    disabled={disabled || sets.length === 1}
                    title="Eliminar serie"
                    className="p-1 text-red-600 hover:text-red-700"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Set Configuration Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Repeticiones */}
                <div>
                  <FormField label="Reps">
                    <div className="relative">
                      <input
                        type="number"
                        value={set.reps || ''}
                        onChange={(e) => updateSet(set.id!, { reps: parseInt(e.target.value) || undefined })}
                        placeholder="12"
                        min="1"
                        max="100"
                        disabled={disabled}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-villa-mitre-500 focus:border-villa-mitre-500 disabled:bg-gray-100"
                      />
                      {sets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => copyToAllSets(set.id!, 'reps')}
                          disabled={disabled}
                          className="absolute right-1 top-1 p-1 text-xs text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          title="Copiar a todas las series"
                        >
                          ↓
                        </button>
                      )}
                    </div>
                  </FormField>
                </div>

                {/* Peso */}
                <div>
                  <FormField label="Peso (kg)">
                    <div className="relative">
                      <input
                        type="number"
                        value={set.weight || ''}
                        onChange={(e) => updateSet(set.id!, { weight: parseFloat(e.target.value) || undefined })}
                        placeholder="20"
                        min="0"
                        step="0.5"
                        disabled={disabled}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-villa-mitre-500 focus:border-villa-mitre-500 disabled:bg-gray-100"
                      />
                      {sets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => copyToAllSets(set.id!, 'weight')}
                          disabled={disabled}
                          className="absolute right-1 top-1 p-1 text-xs text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          title="Copiar a todas las series"
                        >
                          ↓
                        </button>
                      )}
                    </div>
                  </FormField>
                </div>

                {/* Duración */}
                <div>
                  <FormField label="Duración (seg)">
                    <div className="relative">
                      <input
                        type="number"
                        value={set.duration || ''}
                        onChange={(e) => updateSet(set.id!, { duration: parseInt(e.target.value) || undefined })}
                        placeholder="30"
                        min="1"
                        disabled={disabled}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-villa-mitre-500 focus:border-villa-mitre-500 disabled:bg-gray-100"
                      />
                      {sets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => copyToAllSets(set.id!, 'duration')}
                          disabled={disabled}
                          className="absolute right-1 top-1 p-1 text-xs text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          title="Copiar a todas las series"
                        >
                          ↓
                        </button>
                      )}
                    </div>
                  </FormField>
                </div>

                {/* Descanso */}
                <div>
                  <FormField label="Descanso (seg)">
                    <div className="relative">
                      <input
                        type="number"
                        value={set.rest_time || ''}
                        onChange={(e) => updateSet(set.id!, { rest_time: parseInt(e.target.value) || undefined })}
                        placeholder="60"
                        min="0"
                        disabled={disabled}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-villa-mitre-500 focus:border-villa-mitre-500 disabled:bg-gray-100"
                      />
                      {sets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => copyToAllSets(set.id!, 'rest_time')}
                          disabled={disabled}
                          className="absolute right-1 top-1 p-1 text-xs text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          title="Copiar a todas las series"
                        >
                          ↓
                        </button>
                      )}
                    </div>
                  </FormField>
                </div>
              </div>

              {/* Advanced Configuration */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* RPE */}
                  <div>
                    <FormField label="RPE (1-10)" helperText="Esfuerzo percibido">
                      <select
                        value={set.rpe || ''}
                        onChange={(e) => updateSet(set.id!, { rpe: parseInt(e.target.value) || undefined })}
                        disabled={disabled}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-villa-mitre-500 focus:border-villa-mitre-500 disabled:bg-gray-100"
                      >
                        <option value="">Sin RPE</option>
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} - {i + 1 <= 3 ? 'Muy Fácil' : i + 1 <= 6 ? 'Fácil' : i + 1 <= 8 ? 'Moderado' : 'Difícil'}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  </div>

                  {/* Tempo */}
                  <div>
                    <FormField label="Tempo" helperText="Ej: 2-1-2-1">
                      <input
                        type="text"
                        value={set.tempo || ''}
                        onChange={(e) => updateSet(set.id!, { tempo: e.target.value || undefined })}
                        placeholder="2-1-2-1"
                        disabled={disabled}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-villa-mitre-500 focus:border-villa-mitre-500 disabled:bg-gray-100"
                      />
                    </FormField>
                  </div>

                  {/* Distancia */}
                  <div>
                    <FormField label="Distancia (m)" helperText="Para cardio">
                      <input
                        type="number"
                        value={set.distance || ''}
                        onChange={(e) => updateSet(set.id!, { distance: parseInt(e.target.value) || undefined })}
                        placeholder="100"
                        min="1"
                        disabled={disabled}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-villa-mitre-500 focus:border-villa-mitre-500 disabled:bg-gray-100"
                      />
                    </FormField>
                  </div>
                </div>

                {/* Notas */}
                <div className="mt-4">
                  <FormField label="Notas de la Serie" helperText="Instrucciones específicas">
                    <textarea
                      value={set.notes || ''}
                      onChange={(e) => updateSet(set.id!, { notes: e.target.value || undefined })}
                      placeholder="Ej: Enfocarse en la técnica, pausa de 2 segundos en la parte baja..."
                      rows={2}
                      disabled={disabled}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-villa-mitre-500 focus:border-villa-mitre-500 disabled:bg-gray-100 resize-vertical"
                    />
                  </FormField>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {sets.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Usa el botón ↓ para copiar valores a todas las series
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={addSet}
              disabled={disabled}
              leftIcon={<PlusIcon className="w-4 h-4" />}
            >
              Agregar Serie
            </Button>
          </div>
        </div>
      )}

      {/* Help Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start">
          <InformationCircleIcon className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-xs text-blue-700">
            <p className="font-medium mb-1">Configuración de Series:</p>
            <ul className="list-disc list-inside space-y-0.5 text-xs">
              <li><strong>Reps:</strong> Número de repeticiones por serie</li>
              <li><strong>Peso:</strong> Carga en kilogramos (opcional)</li>
              <li><strong>Duración:</strong> Tiempo en segundos para ejercicios isométricos</li>
              <li><strong>RPE:</strong> Esfuerzo percibido del 1 al 10</li>
              <li><strong>Tempo:</strong> Ritmo de ejecución (excéntrico-pausa-concéntrico-pausa)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetEditor;
