import React, { useEffect, useState, memo, useMemo, useCallback } from 'react';
import { FormField, MultiSelect } from '@/components/ui';
import { 
  PRIMARY_GOALS, 
  INTENSITY_LEVELS, 
  DIFFICULTY_LEVELS,
  type TemplateFormData 
} from '@/types/template';
import {
  ClockIcon,
  TagIcon,
  CogIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

interface TemplateBasicInfoStepProps {
  data: Partial<TemplateFormData>;
  onDataChange: (data: Partial<TemplateFormData>) => void;
  onValidationChange?: (isValid: boolean) => void;
  errors?: string[];
  isLoading?: boolean;
}

// Opciones predefinidas para los selects - MEMOIZADAS
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
  { value: 'full-body', label: 'Cuerpo Completo' },
];

const EQUIPMENT_OPTIONS = [
  { value: 'barbell', label: 'Barra' },
  { value: 'dumbbell', label: 'Mancuernas' },
  { value: 'kettlebell', label: 'Kettlebell' },
  { value: 'cable', label: 'Polea' },
  { value: 'machine', label: 'Máquina' },
  { value: 'bodyweight', label: 'Peso Corporal' },
  { value: 'resistance-band', label: 'Banda Elástica' },
  { value: 'medicine-ball', label: 'Pelota Medicinal' },
  { value: 'suspension', label: 'Suspensión (TRX)' },
  { value: 'cardio-equipment', label: 'Equipo Cardio' },
];

const SECONDARY_GOALS_OPTIONS = [
  { value: 'mobility', label: 'Movilidad' },
  { value: 'balance', label: 'Equilibrio' },
  { value: 'coordination', label: 'Coordinación' },
  { value: 'speed', label: 'Velocidad' },
  { value: 'agility', label: 'Agilidad' },
  { value: 'rehabilitation', label: 'Rehabilitación' },
  { value: 'weight-loss', label: 'Pérdida de Peso' },
  { value: 'muscle-gain', label: 'Ganancia Muscular' },
];

const TemplateBasicInfoStep = memo<TemplateBasicInfoStepProps>(function TemplateBasicInfoStep({
  data,
  onDataChange,
  onValidationChange,
  errors = [],
  isLoading = false,
}) {

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
    ...data,
  });

  // Validar formulario
  const validateForm = () => {
    const isValid = !!(
      formData.name?.trim() &&
      formData.estimated_duration &&
      formData.estimated_duration > 0 &&
      formData.difficulty &&
      formData.primary_goal &&
      formData.intensity_level &&
      formData.target_muscle_groups?.length &&
      formData.equipment_needed?.length
    );

    onValidationChange?.(isValid);
    return isValid;
  };

  // Actualizar datos cuando cambia el formulario
  useEffect(() => {
    onDataChange(formData);
    validateForm();
  }, [formData]);

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

          <div className="md:col-span-2">
            <FormField label="Descripción">
              <textarea
                value={formData.description || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange('description', e.target.value)}
                placeholder="Describe el propósito y características de esta plantilla..."
                rows={3}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-villa-mitre-500 focus:border-villa-mitre-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-vertical"
              />
            </FormField>
          </div>

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
          <div>
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

          <div>
            <FormField label="Nivel de Intensidad" required>
              <select
                value={formData.intensity_level || ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('intensity_level', e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-villa-mitre-500 focus:border-villa-mitre-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Selecciona una intensidad</option>
                {INTENSITY_LEVELS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="md:col-span-2">
            <FormField label="Objetivos Secundarios">
              <MultiSelect
                value={formData.secondary_goals || []}
                onChange={(values) => handleFieldChange('secondary_goals', values)}
                options={SECONDARY_GOALS_OPTIONS}
                placeholder="Selecciona objetivos adicionales..."
                disabled={isLoading}
              />
            </FormField>
          </div>
        </div>
      </div>

      {/* Grupos musculares y equipamiento */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <CogIcon className="w-5 h-5 text-villa-mitre-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Grupos Musculares y Equipamiento</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div>
            <FormField label="Grupos Musculares Objetivo" required>
              <MultiSelect
                value={formData.target_muscle_groups || []}
                onChange={(values) => handleFieldChange('target_muscle_groups', values)}
                options={MUSCLE_GROUP_OPTIONS}
                placeholder="Selecciona los grupos musculares que trabajará esta plantilla..."
                disabled={isLoading}
              />
            </FormField>
          </div>

          <div>
            <FormField label="Equipamiento Necesario" required>
              <MultiSelect
                value={formData.equipment_needed || []}
                onChange={(values) => handleFieldChange('equipment_needed', values)}
                options={EQUIPMENT_OPTIONS}
                placeholder="Selecciona el equipamiento que se necesita..."
                disabled={isLoading}
              />
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

      {/* Información de ayuda */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <InformationCircleIcon className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Consejos para crear una buena plantilla:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Usa un nombre descriptivo que indique el objetivo y nivel</li>
              <li>Selecciona grupos musculares específicos para mejor organización</li>
              <li>Considera el equipamiento disponible en tu gimnasio</li>
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
