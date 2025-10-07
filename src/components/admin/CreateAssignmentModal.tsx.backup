/**
 * Modal para crear nueva asignación profesor-estudiante
 * Formulario con validación y selección de profesor/estudiante
 */

import React, { memo, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  XMarkIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import type { CreateProfessorStudentAssignmentRequest } from '@/types/assignment';
import type { User } from '@/types/user';
import { useCreateAssignment, useAvailableProfessors, useUnassignedStudents } from '@/hooks/useAssignments';
import { useToast } from '@/hooks/useToast';
import { Modal, Button, FormField, Input, Select, TextArea } from '@/components/ui';
import { Skeleton } from '@/components/ui/Skeleton';

// Schema de validación
const createAssignmentSchema = z.object({
  professor_id: z.number({
    required_error: 'Debe seleccionar un profesor',
  }).min(1, 'Debe seleccionar un profesor válido'),
  
  student_id: z.number({
    required_error: 'Debe seleccionar un estudiante',
  }).min(1, 'Debe seleccionar un estudiante válido'),
  
  start_date: z.string({
    required_error: 'Debe especificar una fecha de inicio',
  }).min(1, 'La fecha de inicio es requerida'),
  
  end_date: z.string().optional(),
  
  admin_notes: z.string().optional(),
}).refine((data) => {
  if (data.end_date && data.start_date) {
    return new Date(data.end_date) > new Date(data.start_date);
  }
  return true;
}, {
  message: 'La fecha de fin debe ser posterior a la fecha de inicio',
  path: ['end_date'],
});

type CreateAssignmentFormData = z.infer<typeof createAssignmentSchema>;

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Componente de información del usuario
 */
const UserOption = memo<{ user: User; role: 'professor' | 'student' }>(function UserOption({ user, role }) {
  const displayName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
  
  return (
    <div className="flex items-center space-x-3 py-2">
      <div className="flex-shrink-0">
        {user.avatar_url ? (
          <img 
            className="h-8 w-8 rounded-full object-cover" 
            src={user.avatar_url} 
            alt={displayName}
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            {role === 'professor' ? (
              <UserGroupIcon className="h-4 w-4 text-gray-500" />
            ) : (
              <AcademicCapIcon className="h-4 w-4 text-gray-500" />
            )}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900 truncate">
          {displayName || 'Sin nombre'}
        </p>
        {user.email && (
          <p className="text-xs text-gray-500 truncate">
            {user.email}
          </p>
        )}
      </div>
    </div>
  );
});

/**
 * Componente principal del modal
 */
export const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = memo(function CreateAssignmentModal({
  isOpen,
  onClose,
  onSuccess,
}) {
  const toast = useToast();

  // Queries
  const { data: availableProfessors, isLoading: isLoadingProfessors } = useAvailableProfessors();
  const { data: unassignedStudentsResponse, isLoading: isLoadingStudents } = useUnassignedStudents();

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useForm<CreateAssignmentFormData>({
    resolver: zodResolver(createAssignmentSchema),
    mode: 'onChange',
  });

  // Mutation
  const createAssignmentMutation = useCreateAssignment({
    onSuccess: () => {
      toast.success('Asignación creada exitosamente');
      reset();
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      console.error('Error creating assignment:', error);
      toast.error('Error al crear la asignación');
    },
  });

  // Opciones memoizadas
  const professorOptions = useMemo(() => {
    if (!availableProfessors) return [];
    
    return availableProfessors.map(professor => ({
      value: professor.id.toString(),
      label: `${professor.first_name} ${professor.last_name}`,
      content: <UserOption user={professor} role="professor" />,
    }));
  }, [availableProfessors]);

  const studentOptions = useMemo(() => {
    if (!unassignedStudentsResponse?.data) return [];
    
    return unassignedStudentsResponse.data.map(student => ({
      value: student.id.toString(),
      label: `${student.first_name} ${student.last_name}`,
      content: <UserOption user={student} role="student" />,
    }));
  }, [unassignedStudentsResponse]);

  // Handlers
  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const onSubmit = useCallback(async (data: CreateAssignmentFormData) => {
    try {
      await createAssignmentMutation.mutateAsync(data);
    } catch (error) {
      // Error ya manejado en onError del mutation
    }
  }, [createAssignmentMutation]);

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Nueva Asignación"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Descripción */}
        <div className="text-sm text-gray-600">
          Asigna un estudiante a un profesor para que pueda crear y gestionar sus entrenamientos.
        </div>

        {/* Selección de profesor */}
        <FormField
          label="Profesor"
          error={errors.professor_id?.message}
          required
          icon={<UserGroupIcon className="h-5 w-5 text-gray-400" />}
        >
          {isLoadingProfessors ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select
              placeholder="Seleccionar profesor"
              options={professorOptions}
              value={watch('professor_id')?.toString() || ''}
              onChange={(value) => setValue('professor_id', parseInt(value))}
              error={!!errors.professor_id}
              searchable
              emptyMessage="No hay profesores disponibles"
            />
          )}
        </FormField>

        {/* Selección de estudiante */}
        <FormField
          label="Estudiante"
          error={errors.student_id?.message}
          required
          icon={<AcademicCapIcon className="h-5 w-5 text-gray-400" />}
        >
          {isLoadingStudents ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select
              placeholder="Seleccionar estudiante"
              options={studentOptions}
              value={watch('student_id')?.toString() || ''}
              onChange={(value) => setValue('student_id', parseInt(value))}
              error={!!errors.student_id}
              searchable
              emptyMessage="No hay estudiantes sin asignar"
            />
          )}
        </FormField>

        {/* Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Fecha de Inicio"
            error={errors.start_date?.message}
            required
            icon={<CalendarDaysIcon className="h-5 w-5 text-gray-400" />}
          >
            <Input
              type="date"
              {...register('start_date')}
              min={minDate}
              error={!!errors.start_date}
            />
          </FormField>

          <FormField
            label="Fecha de Fin (Opcional)"
            error={errors.end_date?.message}
            icon={<CalendarDaysIcon className="h-5 w-5 text-gray-400" />}
          >
            <Input
              type="date"
              {...register('end_date')}
              min={minEndDate}
              error={!!errors.end_date}
            />
          </FormField>
        </div>

        {/* Notas del administrador */}
        <FormField
          label="Notas del Administrador (Opcional)"
          error={errors.admin_notes?.message}
          icon={<DocumentTextIcon className="h-5 w-5 text-gray-400" />}
        >
          <TextArea
            {...register('admin_notes')}
            placeholder="Notas adicionales sobre esta asignación..."
            rows={3}
            error={!!errors.admin_notes}
          />
        </FormField>

        {/* Información adicional */}
        <div className="bg-blue-50 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800">
                Información importante
              </h4>
              <div className="mt-1 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>El profesor podrá asignar plantillas de entrenamiento al estudiante</li>
                  <li>El estudiante recibirá notificaciones de sus entrenamientos programados</li>
                  <li>Puedes modificar o finalizar esta asignación en cualquier momento</li>
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
            disabled={createAssignmentMutation.isPending}
          >
            Cancelar
          </Button>
          
          <Button
            type="submit"
            isLoading={createAssignmentMutation.isPending}
            disabled={!isValid || createAssignmentMutation.isPending}
          >
            Crear Asignación
          </Button>
        </div>
      </form>
    </Modal>
  );
});

export default CreateAssignmentModal;
