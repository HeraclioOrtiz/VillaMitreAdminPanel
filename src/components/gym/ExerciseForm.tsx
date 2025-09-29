
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui';
import FormField, { FormInput, FormTextarea, FormSelect } from '@/components/ui/FormField';
import MultiSelect from '@/components/ui/MultiSelect';
import type { ExerciseFormData, Exercise } from '@/types/exercise';
import {
  MUSCLE_GROUPS,
  EQUIPMENT_TYPES,
  MOVEMENT_PATTERNS,
  DIFFICULTY_LEVELS,
  type MuscleGroup,
  type EquipmentType,
  type MovementPattern,
  type DifficultyLevel,
} from '@/types/exercise';
import {
  PhotoIcon,
  VideoCameraIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Schema de validación con Zod
const exerciseSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  muscle_group: z
    .string()
    .min(1, 'Selecciona al menos un grupo muscular'),
  movement_pattern: z
    .string()
    .min(1, 'Selecciona un patrón de movimiento'),
  equipment: z
    .string()
    .min(1, 'Selecciona al menos un equipamiento'),
  difficulty: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .refine((val) => val !== undefined, 'Selecciona la dificultad'),
  tags: z
    .array(z.string())
    .min(1, 'Agrega al menos un tag')
    .max(10, 'Máximo 10 tags permitidos'),
  instructions: z
    .string()
    .min(10, 'Las instrucciones deben tener al menos 10 caracteres')
    .max(1000, 'Las instrucciones no pueden exceder 1000 caracteres'),
  tempo: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => !val || val === '' || /^\d+-\d+-\d+(-\d+)?$/.test(val),
      'Formato de tempo inválido (ej: 3-1-1 o 3-1-1-1)'
    ),
  video_url: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => !val || val === '' || z.string().url().safeParse(val).success,
      'URL de video inválida'
    ),
  image_url: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => !val || val === '' || z.string().url().safeParse(val).success,
      'URL de imagen inválida'
    ),
});

interface ExerciseFormProps {
  initialData?: Exercise;
  onSubmit: (data: ExerciseFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

const ExerciseForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode,
}: ExerciseFormProps) => {
  const [tagInput, setTagInput] = useState('');

  // Configurar React Hook Form
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      name: initialData?.name || '',
      muscle_group: initialData?.muscle_group || '',
      movement_pattern: initialData?.movement_pattern || '',
      equipment: initialData?.equipment || '',
      difficulty: initialData?.difficulty || 'beginner',
      tags: initialData?.tags || [],
      instructions: initialData?.instructions || '',
      tempo: initialData?.tempo || '',
      video_url: initialData?.video_url || '',
      image_url: initialData?.image_url || '',
    },
    mode: 'onChange',
  });

  // Debug: Log form state for debugging
  React.useEffect(() => {
    console.log('Form validation state:', {
      isValid,
      errors,
      values: {
        name: watch('name'),
        muscle_group: watch('muscle_group'),
        movement_pattern: watch('movement_pattern'),
        equipment: watch('equipment'),
        difficulty: watch('difficulty'),
        tags: watch('tags'),
        instructions: watch('instructions'),
      }
    });
  }, [isValid, errors, watch]);

  // Watch para valores reactivos
  const watchedTags = watch('tags');
  const watchedMuscleGroup = watch('muscle_group');
  const watchedEquipment = watch('equipment');
  const watchedVideoUrl = watch('video_url');
  const watchedImageUrl = watch('image_url');

  // Funciones helper para etiquetas
  const getMuscleGroupLabel = (group: MuscleGroup): string => {
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
  };

  const getEquipmentLabel = (equipment: EquipmentType): string => {
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
  };

  const getMovementPatternLabel = (pattern: MovementPattern): string => {
    const labels: Record<MovementPattern, string> = {
      push: 'Empuje',
      pull: 'Tirón',
      squat: 'Sentadilla',
      hinge: 'Bisagra de Cadera',
      lunge: 'Zancada',
      carry: 'Carga',
      rotation: 'Rotación',
      gait: 'Marcha',
      isometric: 'Isométrico',
    };
    return labels[pattern] || pattern;
  };

  const getDifficultyLabel = (difficulty: DifficultyLevel): string => {
    const labels: Record<DifficultyLevel, string> = {
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado',
    };
    return labels[difficulty] || difficulty;
  };

  // Manejar tags
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (tag && !watchedTags.includes(tag) && watchedTags.length < 10) {
        setValue('tags', [...watchedTags, tag], { shouldValidate: true });
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      'tags',
      watchedTags.filter((tag) => tag !== tagToRemove),
      { shouldValidate: true }
    );
  };

  // Manejar envío del formulario
  const handleFormSubmit = async (data: ExerciseFormData) => {
    try {
      console.log('ExerciseForm - handleFormSubmit called with:', data);
      await onSubmit(data);
      console.log('ExerciseForm - onSubmit completed successfully');
    } catch (error) {
      console.error('ExerciseForm - Error submitting form:', error);
      // Re-lanzar el error para que React Hook Form lo maneje
      throw error;
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit as any)} className="space-y-6">
      {/* Información básica */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Información Básica
        </h3>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            label="Nombre del Ejercicio"
            required
            error={errors.name?.message}
            className="sm:col-span-2"
          >
            <FormInput
              {...register('name')}
              placeholder="Ej: Press de banca con barra"
              error={!!errors.name}
            />
          </FormField>

          <FormField
            label="Grupo Muscular"
            required
            error={errors.muscle_group?.message}
          >
            <Controller
              name="muscle_group"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={MUSCLE_GROUPS.map((group) => ({
                    value: group,
                    label: getMuscleGroupLabel(group),
                  }))}
                  value={typeof field.value === 'string' ? field.value.split(',').map(s => s.trim()).filter(Boolean) : (field.value || [])}
                  onChange={(values) => field.onChange(values.join(', '))}
                  placeholder="Seleccionar grupos musculares"
                  className={errors.muscle_group ? 'border-red-300' : ''}
                />
              )}
            />
          </FormField>

          <FormField
            label="Patrón de Movimiento"
            required
            error={errors.movement_pattern?.message}
          >
            <FormSelect
              {...register('movement_pattern')}
              error={!!errors.movement_pattern}
            >
              <option value="">Seleccionar patrón de movimiento</option>
              {MOVEMENT_PATTERNS.map((pattern) => (
                <option key={pattern} value={pattern}>
                  {getMovementPatternLabel(pattern)}
                </option>
              ))}
            </FormSelect>
          </FormField>

          <FormField
            label="Equipamiento"
            required
            error={errors.equipment?.message}
          >
            <Controller
              name="equipment"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={EQUIPMENT_TYPES.map((equipment) => ({
                    value: equipment,
                    label: getEquipmentLabel(equipment),
                  }))}
                  value={typeof field.value === 'string' ? field.value.split(',').map(s => s.trim()).filter(Boolean) : (field.value || [])}
                  onChange={(values) => field.onChange(values.join(', '))}
                  placeholder="Seleccionar equipamiento"
                  className={errors.equipment ? 'border-red-300' : ''}
                />
              )}
            />
          </FormField>

          <FormField
            label="Dificultad"
            required
            error={errors.difficulty?.message}
          >
            <FormSelect
              {...register('difficulty')}
              error={!!errors.difficulty}
            >
              {DIFFICULTY_LEVELS.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {getDifficultyLabel(difficulty)}
                </option>
              ))}
            </FormSelect>
          </FormField>
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
        
        <FormField
          label="Agregar Tags"
          required
          error={errors.tags?.message}
          helperText="Presiona Enter o coma para agregar. Máximo 10 tags."
        >
          <FormInput
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Ej: fuerza, hipertrofia, funcional"
            error={!!errors.tags}
          />
        </FormField>

        {/* Tags actuales */}
        {watchedTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {watchedTags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-villa-mitre-100 text-villa-mitre-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-villa-mitre-600 hover:text-villa-mitre-800"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Instrucciones */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Instrucciones y Detalles
        </h3>

        <div className="space-y-6">
          <FormField
            label="Instrucciones de Ejecución"
            required
            error={errors.instructions?.message}
            helperText="Describe paso a paso cómo realizar el ejercicio correctamente"
          >
            <FormTextarea
              {...register('instructions')}
              rows={6}
              placeholder="1. Posición inicial: Acuéstate en el banco con los pies firmes en el suelo...&#10;2. Ejecución: Baja la barra de forma controlada hasta el pecho...&#10;3. Fase concéntrica: Empuja la barra hacia arriba..."
              error={!!errors.instructions}
            />
          </FormField>

          <FormField
            label="Tempo (Opcional)"
            error={errors.tempo?.message}
            helperText="Formato: excéntrico-pausa-concéntrico-pausa (ej: 3-1-1-1)"
          >
            <FormInput
              {...register('tempo')}
              placeholder="3-1-1-1"
              error={!!errors.tempo}
            />
          </FormField>
        </div>
      </div>

      {/* Multimedia */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Multimedia (Opcional)
        </h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            label="URL de Video"
            error={errors.video_url?.message}
            helperText="YouTube, Vimeo o enlace directo al video"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <VideoCameraIcon className="h-5 w-5 text-gray-400" />
              </div>
              <FormInput
                {...register('video_url')}
                placeholder="https://youtube.com/watch?v=..."
                className="pl-10"
                error={!!errors.video_url}
              />
            </div>
          </FormField>

          <FormField
            label="URL de Imagen"
            error={errors.image_url?.message}
            helperText="Imagen demostrativa del ejercicio"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhotoIcon className="h-5 w-5 text-gray-400" />
              </div>
              <FormInput
                {...register('image_url')}
                placeholder="https://example.com/image.jpg"
                className="pl-10"
                error={!!errors.image_url}
              />
            </div>
          </FormField>
        </div>

        {/* Preview de multimedia */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {watchedImageUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vista previa de imagen
              </label>
              <img
                src={watchedImageUrl}
                alt="Vista previa"
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {watchedVideoUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vista previa de video
              </label>
              <div className="w-full h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <VideoCameraIcon className="h-8 w-8 text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Video vinculado</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Debug info - Solo en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Debug Info:</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Form Valid: {isValid ? '✅' : '❌'}</div>
            <div>Loading: {isLoading ? '⏳' : '✅'}</div>
            {Object.keys(errors).length > 0 && (
              <div>
                <div className="font-medium text-red-600">Errores:</div>
                {Object.entries(errors).map(([field, error]) => (
                  <div key={field} className="ml-2 text-red-500">
                    • {field}: {error?.message}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        )}
        
        <Button
          type="submit"
          variant="primary"
          disabled={!isValid || isLoading}
          isLoading={isLoading}
          title={!isValid ? 'Completa todos los campos requeridos' : ''}
        >
          {mode === 'create' ? 'Crear Ejercicio' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  );
};

export default ExerciseForm;
