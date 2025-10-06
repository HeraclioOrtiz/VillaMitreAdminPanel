/**
 * Componente para mostrar estudiantes asignados al profesor
 * Grid de tarjetas con información y acciones rápidas
 */

import React, { memo, useState, useCallback, useMemo } from 'react';
import {
  UserIcon,
  CalendarDaysIcon,
  ClockIcon,
  ChartBarIcon,
  PlusIcon,
  EyeIcon,
  PlayIcon,
  PauseIcon,
  TagIcon,
  FireIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';
import type { ProfessorStudentAssignment, TemplateAssignment } from '@/types/assignment';
import { useProfessorStudents } from '@/hooks/useAssignments';
import { Button, Badge, Skeleton, EmptyState } from '@/components/ui';
import { formatDate, formatDistanceToNow } from '@/utils/date';

interface MyStudentsProps {
  onAssignTemplate?: (student: ProfessorStudentAssignment) => void;
  onViewProgress?: (student: ProfessorStudentAssignment) => void;
  onViewCalendar?: (student: ProfessorStudentAssignment) => void;
}

/**
 * Componente para mostrar una plantilla asignada
 */
const AssignedTemplateCard = memo<{
  templateAssignment: TemplateAssignment;
}>(function AssignedTemplateCard({ templateAssignment }) {
  const { daily_template, frequency, start_date, end_date, status, professor_notes } = templateAssignment;
  
  // Función para obtener el color del nivel
  const getLevelColor = useCallback((level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, []);

  // Función para obtener el color del objetivo
  const getGoalColor = useCallback((goal: string) => {
    switch (goal) {
      case 'strength':
        return 'bg-blue-100 text-blue-800';
      case 'hypertrophy':
        return 'bg-purple-100 text-purple-800';
      case 'endurance':
        return 'bg-orange-100 text-orange-800';
      case 'power':
        return 'bg-red-100 text-red-800';
      case 'flexibility':
        return 'bg-pink-100 text-pink-800';
      case 'cardio':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, []);

  // Función para obtener el emoji del nivel
  const getLevelEmoji = useCallback((level: string) => {
    switch (level) {
      case 'beginner': return '🟢';
      case 'intermediate': return '🟡';
      case 'advanced': return '🔴';
      default: return '⚪';
    }
  }, []);

  // Función para formatear los días de la semana
  const formatFrequency = useCallback((freq: number[]) => {
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return freq.map(day => dayNames[day]).join(', ');
  }, []);

  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      {/* Header con título y estado */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h5 className="font-medium text-sm text-gray-900 truncate">
            {daily_template.title}
          </h5>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getLevelColor(daily_template.level)}`}>
              {getLevelEmoji(daily_template.level)} {daily_template.level === 'beginner' ? 'Principiante' : daily_template.level === 'intermediate' ? 'Intermedio' : 'Avanzado'}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getGoalColor(daily_template.goal)}`}>
              {daily_template.goal === 'strength' ? '💪 Fuerza' : 
               daily_template.goal === 'hypertrophy' ? '🏋️ Hipertrofia' :
               daily_template.goal === 'endurance' ? '🏃 Resistencia' :
               daily_template.goal === 'power' ? '⚡ Potencia' :
               daily_template.goal === 'flexibility' ? '🤸 Flexibilidad' :
               daily_template.goal === 'cardio' ? '❤️ Cardio' : daily_template.goal}
            </span>
          </div>
        </div>
        <Badge variant={status === 'active' ? 'success' : status === 'paused' ? 'warning' : 'secondary'}>
          {status === 'active' ? 'Activa' : status === 'paused' ? 'Pausada' : status}
        </Badge>
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
        <div className="flex items-center space-x-1">
          <ClockIcon className="h-3 w-3 flex-shrink-0" />
          <span>{daily_template.estimated_duration_min} min</span>
        </div>
        <div className="flex items-center space-x-1">
          <CalendarDaysIcon className="h-3 w-3 flex-shrink-0" />
          <span>{formatFrequency(frequency)}</span>
        </div>
      </div>

      {/* Fechas */}
      <div className="mt-2 text-xs text-gray-500">
        <span>📅 {formatDate(start_date)}</span>
        {end_date && <span> → {formatDate(end_date)}</span>}
      </div>

      {/* Tags */}
      {daily_template.tags && daily_template.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {daily_template.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-blue-100 text-blue-700">
              {tag}
            </span>
          ))}
          {daily_template.tags.length > 3 && (
            <span className="text-xs text-gray-500">+{daily_template.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Notas del profesor */}
      {professor_notes && (
        <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-gray-700">
          <div className="font-medium text-yellow-800 mb-1">📝 Notas del profesor:</div>
          <div className="line-clamp-2">{professor_notes}</div>
        </div>
      )}
    </div>
  );
});

/**
 * Componente para la sección de plantillas asignadas con navegación
 */
const AssignedTemplatesSection = memo<{
  templateAssignments: TemplateAssignment[];
  totalTemplates: number;
}>(function AssignedTemplatesSection({ templateAssignments, totalTemplates }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (templateAssignments.length === 0) {
    return (
      <div className="mb-4">
        <div 
          className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 hover:bg-gray-100 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center">
            <CalendarDaysIcon className="h-4 w-4 mr-2 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">
              Plantillas Asignadas (0)
            </span>
          </div>
          {isExpanded ? (
            <ChevronUpIcon className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          )}
        </div>
        
        {isExpanded && (
          <div className="mt-3 p-4 bg-gray-50 rounded-lg text-center border-2 border-dashed border-gray-200">
            <CalendarDaysIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">Sin plantillas asignadas</p>
            <p className="text-xs text-gray-500">
              Asigna una plantilla para comenzar el entrenamiento
            </p>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="mb-4">
      {/* Header colapsible */}
      <div 
        className="flex items-center justify-between cursor-pointer p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <CalendarDaysIcon className="h-4 w-4 mr-2 text-blue-600" />
          <span className="text-sm font-medium text-gray-900">
            Plantillas Asignadas ({totalTemplates})
          </span>
        </div>
        {isExpanded ? (
          <ChevronUpIcon className="h-4 w-4 text-blue-600" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 text-blue-600" />
        )}
      </div>
      
      {/* Contenido expandible con scroll */}
      {isExpanded && (
        <div className="mt-3">
          {/* Contenedor con scroll vertical */}
          <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
            {templateAssignments.map((templateAssignment) => (
              <AssignedTemplateCard 
                key={templateAssignment.id} 
                templateAssignment={templateAssignment} 
              />
            ))}
          </div>
          
          {/* Información adicional */}
          <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 rounded p-2 mt-3">
            <span>
              {templateAssignments.filter(ta => ta.status === 'active').length} activas
            </span>
            <span>
              {templateAssignments.filter(ta => ta.status === 'paused').length} pausadas
            </span>
            <span>
              Total: {templateAssignments.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
});

/**
 * Componente de tarjeta individual de estudiante
 */
const StudentCard = memo<{
  assignment: ProfessorStudentAssignment;
  onAssignTemplate?: (student: ProfessorStudentAssignment) => void;
  onViewProgress?: (student: ProfessorStudentAssignment) => void;
  onViewCalendar?: (student: ProfessorStudentAssignment) => void;
}>(function StudentCard({ 
  assignment, 
  onAssignTemplate, 
  onViewProgress, 
  onViewCalendar 
}) {
  const { student } = assignment;
  
  // Validación: Si student es null, no renderizar la carta
  if (!student) {
    console.warn('StudentCard: student es null para assignment', assignment.id);
    return null;
  }
  
  const displayName = student.name || `${student.nombre || ''} ${student.apellido || ''}`.trim() || 'Sin nombre';
  
  // Calcular estadísticas reales
  const activeTemplates = assignment.template_assignments?.filter(ta => ta.status === 'active').length || 0;
  const totalTemplates = assignment.template_assignments?.length || 0;
  const progressPercentage = assignment.progress_percentage || 0;
  
  // Estado visual basado en progreso
  const getProgressColor = useCallback((progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    if (progress >= 40) return 'text-orange-600';
    return 'text-red-600';
  }, []);

  const getStatusBadge = useCallback((status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Activo</Badge>;
      case 'paused':
        return <Badge variant="warning">Pausado</Badge>;
      case 'completed':
        return <Badge variant="info">Completado</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Fila principal: Avatar + Info + Badge */}
        <div className="flex items-start space-x-4 mb-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {student.foto_url ? (
              <img
                className="h-14 w-14 rounded-full object-cover"
                src={student.foto_url}
                alt={displayName}
              />
            ) : (
              <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="h-7 w-7 text-gray-500" />
              </div>
            )}
          </div>
          
          {/* Información del estudiante */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {displayName || 'Sin nombre'}
              </h3>
              {getStatusBadge(assignment.status)}
            </div>
            
            {student.email && (
              <p className="text-sm text-gray-600 mb-2 truncate">
                📧 {student.email}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <ClockIcon className="h-4 w-4 flex-shrink-0" />
                <span className="whitespace-nowrap">Inicio: {formatDate(assignment.start_date)}</span>
              </div>
              <div className="whitespace-nowrap">
                Asignado {formatDistanceToNow(assignment.created_at)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Fila de estadísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Plantillas Activas */}
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="flex-shrink-0">
              <CalendarDaysIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="min-w-0">
              <div className="text-xl font-bold text-gray-900">{activeTemplates}</div>
              <div className="text-xs text-gray-600 font-medium">Activas</div>
              {totalTemplates > activeTemplates && (
                <div className="text-xs text-gray-500">de {totalTemplates} total</div>
              )}
            </div>
          </div>
          
          {/* Progreso */}
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="min-w-0">
              <div className={`text-xl font-bold ${getProgressColor(progressPercentage)}`}>
                {progressPercentage}%
              </div>
              <div className="text-xs text-gray-600 font-medium">Progreso</div>
            </div>
          </div>
          
          {/* Barra de progreso visual */}
          <div className="col-span-2 lg:col-span-2 flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-600">Adherencia</span>
                <span className="text-xs text-gray-500">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    progressPercentage >= 80 ? 'bg-green-500' :
                    progressPercentage >= 60 ? 'bg-yellow-500' :
                    progressPercentage >= 40 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Plantillas Asignadas */}
        <AssignedTemplatesSection 
          templateAssignments={assignment.template_assignments || []}
          totalTemplates={totalTemplates}
        />
        
        {/* Fila de acciones */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => onAssignTemplate?.(assignment)}
            leftIcon={<PlusIcon className="w-4 h-4" />}
            className="flex-1 sm:flex-none"
          >
            Asignar Plantilla
          </Button>
          
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onViewProgress?.(assignment)}
            leftIcon={<EyeIcon className="w-4 h-4" />}
            className="flex-1 sm:flex-none"
          >
            Ver Progreso
          </Button>
          
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onViewCalendar?.(assignment)}
            leftIcon={<CalendarDaysIcon className="w-4 h-4" />}
            className="flex-1 sm:flex-none"
          >
            Calendario
          </Button>
        </div>
        
        {/* Alertas */}
        {assignment.status === 'paused' && (
          <div className="mt-4 flex items-center space-x-2 text-yellow-700 bg-yellow-50 rounded-md p-3">
            <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">Asignación pausada</span>
          </div>
        )}

        {activeTemplates === 0 && assignment.status === 'active' && (
          <div className="mt-4 flex items-center space-x-2 text-blue-700 bg-blue-50 rounded-md p-3">
            <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">Sin plantillas asignadas - ¡Asigna una plantilla para comenzar!</span>
          </div>
        )}
      </div>
    </div>
  );
});

/**
 * Componente de skeleton para las tarjetas
 */
const StudentCardSkeleton = memo(function StudentCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header skeleton */}
      <div className="flex items-start space-x-4 mb-4">
        <Skeleton className="h-14 w-14 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
      
      {/* Stats skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <Skeleton className="h-6 w-8 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <Skeleton className="h-6 w-12 mb-1" />
          <Skeleton className="h-3 w-14" />
        </div>
        <div className="col-span-2 p-3 bg-gray-50 rounded-lg">
          <Skeleton className="h-3 w-20 mb-2" />
          <Skeleton className="h-2 w-full" />
        </div>
      </div>
      
      {/* Actions skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
});

/**
 * Componente principal
 */
export const MyStudents: React.FC<MyStudentsProps> = memo(function MyStudents({
  onAssignTemplate,
  onViewProgress,
  onViewCalendar,
}) {
  // Query
  const { 
    data: studentsResponse, 
    isLoading, 
    error,
    refetch 
  } = useProfessorStudents();

  // Debug logs removidos - sistema funcionando correctamente

  // Estados locales
  const [filter, setFilter] = useState<'all' | 'active' | 'paused'>('all');

  // Filtrar estudiantes
  const filteredStudents = useMemo(() => {
    // Manejar tanto array directo como objeto paginado
    const studentsArray = Array.isArray(studentsResponse) 
      ? studentsResponse 
      : studentsResponse?.data;
    
    if (!studentsArray || !Array.isArray(studentsArray)) {
      return [];
    }
    
    if (filter === 'all') {
      return studentsArray;
    }
    
    return studentsArray.filter(assignment => assignment.status === filter);
  }, [studentsResponse, filter]);

  // Handlers
  const handleFilterChange = useCallback((newFilter: 'all' | 'active' | 'paused') => {
    setFilter(newFilter);
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Estados de carga
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <StudentCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error al cargar estudiantes
            </h3>
            <p className="mt-1 text-sm text-red-700">
              {error.message || 'Ha ocurrido un error inesperado'}
            </p>
            <div className="mt-3">
              <Button size="sm" variant="secondary" onClick={handleRefresh}>
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Obtener array de estudiantes (manejar tanto array directo como objeto paginado)
  const students = Array.isArray(studentsResponse) 
    ? studentsResponse 
    : studentsResponse?.data || [];
  
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const pausedStudents = students.filter(s => s.status === 'paused').length;
  
  // Estadísticas calculadas correctamente

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Mis Estudiantes
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {totalStudents} estudiantes asignados ({activeStudents} activos, {pausedStudents} pausados)
          </p>
        </div>
        
        <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          <Button
            variant="secondary"
            onClick={handleRefresh}
            disabled={isLoading}
            leftIcon={<PlayIcon className="w-4 h-4" />}
          >
            Actualizar
          </Button>
        </div>
      </div>

      {/* Filtros rápidos */}
      {totalStudents > 0 && (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={filter === 'all' ? 'primary' : 'secondary'}
            onClick={() => handleFilterChange('all')}
          >
            Todos ({totalStudents})
          </Button>
          <Button
            size="sm"
            variant={filter === 'active' ? 'primary' : 'secondary'}
            onClick={() => handleFilterChange('active')}
          >
            Activos ({activeStudents})
          </Button>
          <Button
            size="sm"
            variant={filter === 'paused' ? 'primary' : 'secondary'}
            onClick={() => handleFilterChange('paused')}
          >
            Pausados ({pausedStudents})
          </Button>
        </div>
      )}

      {/* Lista de estudiantes - Una carta por fila */}
      {filteredStudents.length > 0 ? (
        <div className="space-y-4">
          {filteredStudents.map((assignment) => (
            <StudentCard
              key={assignment.id}
              assignment={assignment}
              onAssignTemplate={onAssignTemplate}
              onViewProgress={onViewProgress}
              onViewCalendar={onViewCalendar}
            />
          ))}
        </div>
      ) : totalStudents === 0 ? (
        <EmptyState
          title="No tienes estudiantes asignados"
          description="Cuando un administrador te asigne estudiantes, aparecerán aquí para que puedas gestionar sus entrenamientos."
          actions={[{
            label: "Contactar Administrador",
            onClick: () => console.log('Contactar administrador')
          }]}
        />
      ) : (
        <EmptyState
          title={`No hay estudiantes ${filter === 'active' ? 'activos' : 'pausados'}`}
          description={`No se encontraron estudiantes con estado ${filter === 'active' ? 'activo' : 'pausado'}.`}
        />
      )}
    </div>
  );
});

export default MyStudents;
