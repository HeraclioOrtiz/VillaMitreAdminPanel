/**
 * Modal para asignar plantillas de entrenamiento a estudiantes
 * Formulario con selección de plantilla, días de la semana y fechas
 */

import React, { memo, useCallback, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  XMarkIcon,
  CalendarDaysIcon,
  ClockIcon,
  DocumentTextIcon,
  UserIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import type { 
  AssignTemplateRequest, 
  ProfessorStudentAssignment,
  WeekDay 
} from '@/types/assignment';
import type { DailyTemplate } from '@/types/template';
import { useAssignTemplate } from '@/hooks/useAssignments';
import { useTemplates } from '@/hooks/useTemplates';
import { useToast } from '@/hooks/useToast';
import { Modal, Button, FormField, Input, Select, TextArea, Checkbox, Skeleton } from '@/components/ui';
import { formatDate } from '@/utils/date';

// Días de la semana
const WEEK_DAYS = [
  { value: 1, label: 'Lunes', short: 'L' },
  { value: 2, label: 'Martes', short: 'M' },
  { value: 3, label: 'Miércoles', short: 'X' },
  { value: 4, label: 'Jueves', short: 'J' },
  { value: 5, label: 'Viernes', short: 'V' },
  { value: 6, label: 'Sábado', short: 'S' },
  { value: 7, label: 'Domingo', short: 'D' },
] as const;

// Schema de validación
const assignTemplateSchema = z.object({
  daily_template_id: z.number({
    required_error: 'Debe seleccionar una plantilla',
  }).min(1, 'Debe seleccionar una plantilla válida'),
  
  frequency: z.array(z.number().min(1).max(7))
    .min(1, 'Debe seleccionar al menos un día de la semana')
    .max(7, 'No puede seleccionar más de 7 días'),
  
  start_date: z.string({
    required_error: 'Debe especificar una fecha de inicio',
  }).min(1, 'La fecha de inicio es requerida'),
  
  end_date: z.string().optional(),
  
  professor_notes: z.string().optional(),
}).refine((data) => {
  if (data.end_date && data.start_date) {
    return new Date(data.end_date) > new Date(data.start_date);
  }
  return true;
}, {
  message: 'La fecha de fin debe ser posterior a la fecha de inicio',
  path: ['end_date'],
});

type AssignTemplateFormData = z.infer<typeof assignTemplateSchema>;

interface AssignTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: ProfessorStudentAssignment | null;
  onSuccess?: () => void;
}

/**
 * Componente de información del estudiante
 */
const StudentInfo = memo<{ student: ProfessorStudentAssignment }>(function StudentInfo({ student }) {
  const displayName = `${student.student.first_name} ${student.student.last_name}`.trim();
  
  return (
    <div className="bg-blue-50 rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-3">
        {student.student.avatar_url ? (
          <img 
            className="h-10 w-10 rounded-full object-cover" 
            src={student.student.avatar_url} 
            alt={displayName}
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
            <UserIcon className="h-5 w-5 text-blue-600" />
          </div>
        )}
        
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-medium text-blue-900">
            Asignando plantilla a:
          </h4>
          <p className="text-lg font-semibold text-blue-800 truncate">
            {displayName || 'Sin nombre'}
          </p>
          {student.student.email && (
            <p className="text-sm text-blue-600 truncate">
              {student.student.email}
            </p>
          )}
        </div>
        
        <div className="text-right">
          <p className="text-xs text-blue-600">
            Asignado desde
          </p>
          <p className="text-sm font-medium text-blue-800">
            {formatDate(student.start_date)}
          </p>
        </div>
      </div>
    </div>
  );
});

/**
 * Componente de tarjeta de plantilla
 */
const TemplateCard = memo<{
  template: DailyTemplate;
  isSelected: boolean;
  onClick: () => void;
}>(function TemplateCard({ template, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        cursor-pointer rounded-lg border-2 p-3 transition-all duration-200
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200' 
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }
      `}
    >
      {/* Layout horizontal compacto */}
      <div className="flex items-start space-x-3">
        {/* Checkbox visual */}
        <div className={`
          flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5
          ${isSelected 
            ? 'border-blue-500 bg-blue-500' 
            : 'border-gray-300'
          }
        `}>
          {isSelected && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        
        {/* Contenido principal */}
        <div className="flex-1 min-w-0">
          {/* Título y nivel en la misma línea */}
          <div className="flex items-center justify-between mb-2">
            <h4 className={`font-semibold text-sm truncate ${
              isSelected ? 'text-blue-900' : 'text-gray-900'
            }`}>
              {(template as any).title || template.name || 'Plantilla sin nombre'}
            </h4>
            
            <span className={`ml-2 flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              (template as any).level === 'beginner' || template.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
              (template as any).level === 'intermediate' || template.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              (template as any).level === 'advanced' || template.difficulty === 'advanced' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {((template as any).level === 'beginner' || template.difficulty === 'beginner') ? '🟢 Principiante' :
               ((template as any).level === 'intermediate' || template.difficulty === 'intermediate') ? '🟡 Intermedio' :
               ((template as any).level === 'advanced' || template.difficulty === 'advanced') ? '🔴 Avanzado' :
               '⚪ Sin dificultad'}
            </span>
          </div>
          
          {/* Información compacta */}
          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
            <div className="flex items-center space-x-1">
              <AcademicCapIcon className="h-3 w-3" />
              <span>{template.exercises?.length || 0} ejercicios</span>
            </div>
            
            {template.estimated_duration_min && (
              <div className="flex items-center space-x-1">
                <ClockIcon className="h-3 w-3" />
                <span>{template.estimated_duration_min} min</span>
              </div>
            )}
            
            {/* Objetivo */}
            {(template as any).goal && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                {(template as any).goal}
              </span>
            )}
          </div>
          
          {/* Tags compactos */}
          {(template as any).tags && Array.isArray((template as any).tags) && (template as any).tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {(template as any).tags.slice(0, 3).map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-blue-100 text-blue-700"
                >
                  {tag}
                </span>
              ))}
              {(template as any).tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{(template as any).tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

/**
 * Componente de selección de plantillas
 */
const TemplateSelector = memo<{
  templates: DailyTemplate[];
  selectedTemplateId: number | null;
  onSelect: (templateId: number) => void;
  isLoading: boolean;
}>(function TemplateSelector({ templates, selectedTemplateId, onSelect, isLoading }) {
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="border-2 border-gray-200 rounded-lg p-4">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-full mb-3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <div className="text-center py-8 px-4 border-2 border-dashed border-gray-300 rounded-lg">
        <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No hay plantillas disponibles
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Crea una plantilla primero para poder asignarla a estudiantes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600">
        Selecciona una plantilla para asignar ({templates.length} disponibles):
      </div>
      
      <div className="border border-gray-200 rounded-lg max-h-80 overflow-y-auto">
        <div className="space-y-2 p-3">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplateId === template.id}
              onClick={() => onSelect(template.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

/**
 * Componente de selección de días
 */
const WeekDaySelector = memo<{
  selectedDays: WeekDay[];
  onChange: (days: WeekDay[]) => void;
  error?: string;
}>(function WeekDaySelector({ selectedDays, onChange, error }) {
  const handleDayToggle = useCallback((day: WeekDay) => {
    const isSelected = selectedDays.includes(day);
    if (isSelected) {
      onChange(selectedDays.filter(d => d !== day));
    } else {
      onChange([...selectedDays, day].sort());
    }
  }, [selectedDays, onChange]);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-2">
        {WEEK_DAYS.map((day) => {
          const isSelected = selectedDays.includes(day.value as WeekDay);
          return (
            <button
              key={day.value}
              type="button"
              onClick={() => handleDayToggle(day.value as WeekDay)}
              className={`
                p-3 rounded-lg border-2 transition-all duration-200 text-center
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }
                ${error ? 'border-red-300' : ''}
              `}
            >
              <div className="text-xs font-medium">{day.short}</div>
              <div className="text-xs mt-1">{day.label}</div>
            </button>
          );
        })}
      </div>
      
      {selectedDays.length > 0 && (
        <div className="text-sm text-gray-600">
          Seleccionados: {selectedDays.map(day => 
            WEEK_DAYS.find(d => d.value === day)?.label
          ).join(', ')}
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

/**
 * Componente principal del modal
 */
export const AssignTemplateModal: React.FC<AssignTemplateModalProps> = memo(function AssignTemplateModal({
  isOpen,
  onClose,
  student,
  onSuccess,
}) {
  const toast = useToast();

  // Queries - Solo ejecutar cuando el modal está abierto
  const { data: templatesResponse, isLoading: isLoadingTemplates, error: templatesError } = useTemplates({
    per_page: 100,
  }, {
    enabled: isOpen, // Solo ejecutar cuando el modal esté abierto
  });


  // Form
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
    control,
  } = useForm<AssignTemplateFormData>({
    resolver: zodResolver(assignTemplateSchema),
    mode: 'onChange',
    defaultValues: {
      frequency: [],
    },
  });

  // Mutation
  const assignTemplateMutation = useAssignTemplate({
    onSuccess: () => {
      toast.success('Plantilla asignada exitosamente');
      reset();
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      console.error('Error assigning template:', error);
      toast.error('Error al asignar la plantilla');
    },
  });

  // Plantillas disponibles - Manejar tanto array directo como objeto paginado
  const availableTemplates = useMemo(() => {
    // Si templatesResponse es un array directo, usarlo
    if (Array.isArray(templatesResponse)) {
      return templatesResponse;
    }
    // Si es un objeto con propiedad data, usar data
    return templatesResponse?.data || [];
  }, [templatesResponse]);

  // Handlers
  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const onSubmit = useCallback(async (data: AssignTemplateFormData) => {
    if (!student) return;

    const request: AssignTemplateRequest = {
      professor_student_assignment_id: student.id, // ID de la asignación profesor-estudiante
      daily_template_id: data.daily_template_id,
      frequency: data.frequency as WeekDay[],
      start_date: data.start_date,
      end_date: data.end_date || undefined,
      professor_notes: data.professor_notes || undefined,
    };

    try {
      await assignTemplateMutation.mutateAsync(request);
    } catch (error) {
      // Error ya manejado en onError del mutation
    }
  }, [student, assignTemplateMutation]);

  // Fecha mínima (hoy)
  const minDate = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // Fecha mínima para end_date (start_date + 1 día)
  const startDate = watch('start_date');
  const minEndDate = useMemo(() => {
    if (!startDate) return minDate;
    const date = new Date(startDate);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }, [startDate, minDate]);

  // Plantilla seleccionada
  const selectedTemplateId = watch('daily_template_id');
  const selectedTemplate = useMemo(() => {
    if (!selectedTemplateId || !templatesResponse?.data) return null;
    return templatesResponse.data.find(t => t.id === selectedTemplateId);
  }, [selectedTemplateId, templatesResponse]);

  if (!student) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Asignar Plantilla de Entrenamiento"
      size="xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información del estudiante */}
        <StudentInfo student={student} />

        {/* Selección de plantilla */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Plantilla de Entrenamiento <span className="text-red-500">*</span>
          </label>
          
          <TemplateSelector
            templates={availableTemplates}
            selectedTemplateId={selectedTemplateId || null}
            onSelect={(templateId) => setValue('daily_template_id', templateId)}
            isLoading={isLoadingTemplates}
          />
          
          {errors.daily_template_id && (
            <p className="text-sm text-red-600">{errors.daily_template_id.message}</p>
          )}
        </div>

        {/* Selección de días de la semana */}
        <FormField
          label="Días de la Semana"
          error={errors.frequency?.message}
          required
        >
          <Controller
            name="frequency"
            control={control}
            render={({ field }) => (
              <WeekDaySelector
                selectedDays={field.value as WeekDay[]}
                onChange={field.onChange}
                error={errors.frequency?.message}
              />
            )}
          />
        </FormField>

        {/* Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Fecha de Inicio"
            error={errors.start_date?.message}
            required
          >
            <Input
              type="date"
              {...register('start_date')}
              min={minDate}
            />
          </FormField>

          <FormField
            label="Fecha de Fin (Opcional)"
            error={errors.end_date?.message}
          >
            <Input
              type="date"
              {...register('end_date')}
              min={minEndDate}
            />
          </FormField>
        </div>

        {/* Notas del profesor */}
        <FormField
          label="Notas para el Estudiante (Opcional)"
          error={errors.professor_notes?.message}
        >
          <TextArea
            {...register('professor_notes')}
            placeholder="Instrucciones especiales, objetivos, modificaciones..."
            rows={3}
          />
        </FormField>

        {/* Información adicional */}
        <div className="bg-yellow-50 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h4 className="text-sm font-medium text-yellow-800">
                Información importante
              </h4>
              <div className="mt-1 text-sm text-yellow-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>El estudiante recibirá notificaciones de sus entrenamientos programados</li>
                  <li>Podrás ver el progreso y completar/saltar sesiones desde el calendario</li>
                  <li>La asignación se repetirá automáticamente en los días seleccionados</li>
                  <li>Puedes modificar o pausar esta asignación en cualquier momento</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={assignTemplateMutation.isPending}
          >
            Cancelar
          </Button>
          
          <Button
            type="submit"
            isLoading={assignTemplateMutation.isPending}
            disabled={!isValid || assignTemplateMutation.isPending}
          >
            Asignar Plantilla
          </Button>
        </div>
      </form>
    </Modal>
  );
});

export default AssignTemplateModal;
