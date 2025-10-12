import React, { useEffect, useState, memo, useCallback, useRef } from 'react';
import { FormField } from '@/components/ui';
import { 
  PRIMARY_GOALS, 
  DIFFICULTY_LEVELS,
  type TemplateFormData 
} from '@/types/template';
import {
  ClockIcon,
  TagIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

interface TemplateBasicInfoStepProps {
  data: Partial<TemplateFormData>;
  onDataChange: (data: Partial<TemplateFormData>) => void;
  onValidationChange?: (isValid: boolean) => void;
  errors?: string[];
  isLoading?: boolean;
}

// Opciones eliminadas: MUSCLE_GROUP_OPTIONS, EQUIPMENT_OPTIONS, SECONDARY_GOALS_OPTIONS
// Motivo: Campos que no existen en el backend

const TemplateBasicInfoStep = memo<TemplateBasicInfoStepProps>(function TemplateBasicInfoStep({
  data,
  onDataChange,
  onValidationChange,
  errors = [],
  isLoading = false,
}) {

  // Ref para trackear si ya inicializamos con datos externos
  const isInitializedFromProps = useRef(false);

  const [formData, setFormData] = useState<Partial<TemplateFormData>>({
    name: '',
    description: '',
    estimated_duration: 60,
    difficulty: 'intermediate',
    target_muscle_groups: [],
    equipment_needed: [],
    primary_goal: 'hypertrophy',
    secondary_goals: [],
    intensity_level: 'moderate',
    tags: [],
    is_public: false,
    warm_up_notes: '',
    cool_down_notes: '',
    progression_notes: '',
    ...data,
  });

  // Actualizar formData cuando data cambia (modo edición) - solo una vez
  useEffect(() => {
    if (!isInitializedFromProps.current && data && Object.keys(data).length > 0 && data.name) {
      console.log('📝 TemplateBasicInfoStep: Inicializando con datos:', data);
      setFormData(prev => ({
        ...prev,
        ...data,
      }));
      isInitializedFromProps.current = true;
    }
  }, [data.name]); // Solo cuando llega el nombre (indica datos válidos)

  // Validar formulario - SOLO validar campos que EXISTEN en el backend
  const validateForm = useCallback(() => {
    const isValid = !!(
      formData.name?.trim() &&  // ✅ Backend: title (requerido)
      formData.estimated_duration &&  // ✅ Backend: estimated_duration_min
      formData.estimated_duration > 0 &&
      formData.difficulty &&  // ✅ Backend: level (requerido)
      formData.primary_goal  // ✅ Backend: goal (requerido)
      // ❌ NO validar intensity_level (no existe en backend)
      // ❌ NO validar target_muscle_groups (no existe en backend)
      // ❌ NO validar equipment_needed (no existe en backend)
    );

    onValidationChange?.(isValid);
    return isValid;
  }, [formData, onValidationChange]);

  // Actualizar datos cuando cambia el formulario - SOLO si ya inicializamos
  useEffect(() => {
    // Evitar loops: solo notificar cambios después de la carga inicial
    if (formData.name && formData.name.trim().length > 0) {
      onDataChange(formData);
      validateForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]); // Solo formData como dependencia

  const handleFieldChange = useCallback((field: keyof TemplateFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleTagsChange = useCallback((tagsString: string) => {
    const tags = tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    handleFieldChange('tags', tags);
  }, [handleFieldChange]);

  return (
    <div className="space-y-8">
      {/* Información básica */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <InformationCircleIcon className="w-5 h-5 text-villa-mitre-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Información Básica</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <FormField
              label="Nombre de la Plantilla"
              required
              error={errors.find(e => e.includes('nombre'))}
            >
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('name', e.target.value)}
                placeholder="Ej: Rutina de Fuerza - Principiantes"
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-villa-mitre-500 focus:border-villa-mitre-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </FormField>
          </div>

          {/* ❌ CAMPO 'description' eliminado - NO existe en el backend */}

          <div>
            <FormField label="Duración Estimada (minutos)" required>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ClockIcon className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={formData.estimated_duration || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('estimated_duration', parseInt(e.target.value) || 0)}
                  placeholder="60"
                  min="15"
                  max="180"
                  disabled={isLoading}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-villa-mitre-500 focus:border-villa-mitre-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </FormField>
          </div>

          <div>
            <FormField label="Nivel de Dificultad" required>
              <select
                value={formData.difficulty || ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('difficulty', e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-villa-mitre-500 focus:border-villa-mitre-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Selecciona una dificultad</option>
                {DIFFICULTY_LEVELS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
        </div>
      </div>

      {/* Objetivos y configuración */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <TagIcon className="w-5 h-5 text-villa-mitre-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Objetivos y Configuración</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <FormField label="Objetivo Principal" required>
              <select
                value={formData.primary_goal || ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('primary_goal', e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-villa-mitre-500 focus:border-villa-mitre-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Selecciona un objetivo</option>
                {PRIMARY_GOALS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
        </div>
      </div>

      {/* Tags y configuración adicional */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <TagIcon className="w-5 h-5 text-villa-mitre-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Tags y Configuración</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div>
            <FormField 
              label="Tags (separados por comas)" 
              helperText="Los tags ayudan a categorizar y buscar la plantilla más fácilmente"
            >
              <input
                type="text"
                value={formData.tags?.join(', ') || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTagsChange(e.target.value)}
                placeholder="fuerza, principiantes, gym, full-body"
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-villa-mitre-500 focus:border-villa-mitre-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </FormField>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_public"
              checked={formData.is_public || false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('is_public', e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 text-villa-mitre-600 focus:ring-villa-mitre-500 border-gray-300 rounded"
            />
            <label htmlFor="is_public" className="ml-2 block text-sm text-gray-900">
              Hacer pública esta plantilla
            </label>
            <div className="ml-2">
              <span className="text-xs text-gray-500">
                (Otros profesores podrán ver y usar esta plantilla)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ❌ SECCIÓN 'warm_up_notes', 'cool_down_notes', 'progression_notes' eliminada - NO existen en el backend */}

      {/* Información de ayuda */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <InformationCircleIcon className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Consejos para crear una buena plantilla:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Usa un nombre descriptivo que indique el objetivo y nivel</li>
              <li>Los grupos musculares y equipamiento se determinarán al agregar ejercicios</li>
              <li>Los tags ayudan a encontrar la plantilla más rápidamente</li>
              <li>Las plantillas públicas pueden ser útiles para otros profesores</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});

export default TemplateBasicInfoStep;
