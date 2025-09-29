/**
 * Tabla de asignaciones para administradores
 * Muestra lista paginada con filtros y acciones
 */

import React, { memo, useMemo, useCallback } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import type { ProfessorStudentAssignment, AssignmentStatus } from '@/types/assignment';
import { getAssignmentStatusConfig } from '@/types/assignment';
import { DataTable, Button, Badge } from '@/components/ui';

interface AssignmentTableProps {
  assignments: ProfessorStudentAssignment[];
  isLoading: boolean;
  onView?: (assignment: ProfessorStudentAssignment) => void;
  onEdit?: (assignment: ProfessorStudentAssignment) => void;
  onDelete?: (assignment: ProfessorStudentAssignment) => void;
  loadingStates?: Record<number, Record<string, boolean>>;
}

/**
 * Componente de badge de estado
 */
const StatusBadge = memo<{ status: AssignmentStatus }>(function StatusBadge({ status }) {
  const config = getAssignmentStatusConfig(status);
  
  return (
    <Badge 
      variant="default" 
      color={config.color}
      className={`${config.bgColor} ${config.textColor}`}
    >
      {config.label}
    </Badge>
  );
});

/**
 * Componente de información del usuario (profesor/estudiante)
 */
const UserInfo = memo<{ 
  user: { 
    id: number; 
    first_name?: string; 
    last_name?: string; 
    name?: string; 
    email?: string; 
    avatar_url?: string; 
  }; 
  role: 'professor' | 'student';
}>(function UserInfo({ user, role }) {
  const displayName = user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim();
  
  return (
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0">
        {user.avatar_url ? (
          <img 
            className="h-8 w-8 rounded-full object-cover" 
            src={user.avatar_url} 
            alt={displayName}
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <UserIcon className="h-4 w-4 text-gray-500" />
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
 * Componente de acciones por fila
 */
const RowActions = memo<{
  assignment: ProfessorStudentAssignment;
  onView?: (assignment: ProfessorStudentAssignment) => void;
  onEdit?: (assignment: ProfessorStudentAssignment) => void;
  onDelete?: (assignment: ProfessorStudentAssignment) => void;
  loadingStates?: Record<string, boolean>;
}>(function RowActions({ assignment, onView, onEdit, onDelete, loadingStates }) {
  const handleView = useCallback(() => {
    onView?.(assignment);
  }, [onView, assignment]);

  const handleEdit = useCallback(() => {
    onEdit?.(assignment);
  }, [onEdit, assignment]);

  const handleDelete = useCallback(() => {
    onDelete?.(assignment);
  }, [onDelete, assignment]);

  return (
    <div className="flex items-center space-x-2">
      {onView && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleView}
          disabled={loadingStates?.view}
          isLoading={loadingStates?.view}
          title="Ver detalles"
        >
          <EyeIcon className="h-4 w-4" />
        </Button>
      )}
      
      {onEdit && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleEdit}
          disabled={loadingStates?.edit}
          isLoading={loadingStates?.edit}
          title="Editar asignación"
        >
          <PencilIcon className="h-4 w-4" />
        </Button>
      )}
      
      {onDelete && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDelete}
          disabled={loadingStates?.delete}
          isLoading={loadingStates?.delete}
          title="Eliminar asignación"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
});

/**
 * Componente principal de la tabla de asignaciones
 */
export const AssignmentTable: React.FC<AssignmentTableProps> = memo(function AssignmentTable({
  assignments,
  isLoading,
  onView,
  onEdit,
  onDelete,
  loadingStates = {},
}) {
  // Definir columnas de la tabla
  const columns = useMemo(() => [
    {
      key: 'professor',
      label: 'Profesor',
      title: 'Profesor',
      sortable: true,
      sortKey: 'professor_name',
      render: (assignment: ProfessorStudentAssignment) => (
        <UserInfo user={assignment.professor} role="professor" />
      ),
    },
    {
      key: 'student',
      label: 'Estudiante',
      title: 'Estudiante',
      sortable: true,
      sortKey: 'student_name',
      render: (assignment: ProfessorStudentAssignment) => (
        <UserInfo user={assignment.student} role="student" />
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      title: 'Estado',
      sortable: true,
      sortKey: 'status',
      render: (assignment: ProfessorStudentAssignment) => (
        <StatusBadge status={assignment.status} />
      ),
    },
    {
      key: 'start_date',
      label: 'Fecha Inicio',
      title: 'Fecha Inicio',
      sortable: true,
      sortKey: 'start_date',
      render: (assignment: ProfessorStudentAssignment) => (
        <div className="text-sm text-gray-900">
          {format(new Date(assignment.start_date), 'dd/MM/yyyy', { locale: es })}
        </div>
      ),
    },
    {
      key: 'template_count',
      label: 'Plantillas',
      title: 'Plantillas',
      sortable: false,
      render: (assignment: ProfessorStudentAssignment) => (
        <div className="text-sm text-gray-900">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {assignment.active_templates || 0} activas
          </span>
        </div>
      ),
    },
    {
      key: 'progress',
      label: 'Progreso',
      title: 'Progreso',
      sortable: false,
      render: (assignment: ProfessorStudentAssignment) => {
        const progress = assignment.progress_percentage || 0;
        const getProgressColor = (value: number) => {
          if (value >= 80) return 'bg-green-500';
          if (value >= 60) return 'bg-yellow-500';
          if (value >= 40) return 'bg-orange-500';
          return 'bg-red-500';
        };

        return (
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-600 min-w-[3rem]">
              {progress.toFixed(0)}%
            </span>
          </div>
        );
      },
    },
    {
      key: 'created_at',
      label: 'Creado',
      title: 'Creado',
      sortable: true,
      sortKey: 'created_at',
      render: (assignment: ProfessorStudentAssignment) => (
        <div className="text-sm text-gray-500">
          {format(new Date(assignment.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      title: 'Acciones',
      sortable: false,
      render: (assignment: ProfessorStudentAssignment) => (
        <RowActions
          assignment={assignment}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          loadingStates={loadingStates[assignment.id]}
        />
      ),
    },
  ], [onView, onEdit, onDelete, loadingStates]);

  // Estado vacío personalizado
  const emptyState = useMemo(() => ({
    title: 'No hay asignaciones',
    description: 'No se encontraron asignaciones con los filtros aplicados.',
    action: {
      label: 'Nueva Asignación',
      onClick: () => {
        // Esta función será manejada por el componente padre
        console.log('Create new assignment');
      }
    }
  }), []);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <DataTable
        data={assignments}
        columns={columns}
        loading={isLoading}
        className="min-w-full"
      />
    </div>
  );
});

export default AssignmentTable;
