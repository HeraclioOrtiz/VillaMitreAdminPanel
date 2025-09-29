/**
 * Calendario semanal para profesores
 * Muestra sesiones programadas con opciones de completar/saltar
 */

import React, { memo, useState, useCallback, useMemo } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon,
  PauseIcon,
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid,
  XCircleIcon as XCircleIconSolid,
} from '@heroicons/react/24/solid';
import type { WeeklyCalendar as WeeklyCalendarData, TodaySession } from '@/types/assignment';
import { 
  useWeeklyCalendar, 
  useCompleteSession, 
  useSkipSession 
} from '@/hooks/useAssignments';
import { useToast } from '@/hooks/useToast';
import { Button, Badge, Skeleton, EmptyState } from '@/components/ui';
import { 
  formatDate, 
  formatTime, 
  addDays, 
  startOfWeek, 
  isSameDay,
  isToday,
  isPast 
} from '@/utils/date';

interface WeeklyCalendarProps {
  onSessionClick?: (session: TodaySession) => void;
  onStudentClick?: (studentId: number) => void;
}

/**
 * Componente de sesión individual
 */
const SessionCard = memo<{
  session: TodaySession;
  onComplete?: (sessionId: number) => void;
  onSkip?: (sessionId: number) => void;
  onSessionClick?: (session: TodaySession) => void;
  onStudentClick?: (studentId: number) => void;
  isLoading?: boolean;
}>(function SessionCard({ 
  session, 
  onComplete, 
  onSkip, 
  onSessionClick, 
  onStudentClick,
  isLoading 
}) {
  const studentName = `${session.student.first_name} ${session.student.last_name}`.trim();
  
  const getStatusBadge = useCallback(() => {
    switch (session.status) {
      case 'completed':
        return (
          <Badge variant="success" size="sm" className="flex items-center space-x-1">
            <CheckCircleIconSolid className="w-3 h-3" />
            <span>Completada</span>
          </Badge>
        );
      case 'skipped':
        return (
          <Badge variant="error" size="sm" className="flex items-center space-x-1">
            <XCircleIconSolid className="w-3 h-3" />
            <span>Saltada</span>
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="warning" size="sm" className="flex items-center space-x-1">
            <ClockIcon className="w-3 h-3" />
            <span>Pendiente</span>
          </Badge>
        );
      default:
        return null;
    }
  }, [session.status]);

  const canModify = session.status === 'pending';
  const isPastSession = isPast(new Date(session.scheduled_date));

  return (
    <div 
      className={`
        bg-white rounded-lg border-2 p-4 transition-all duration-200 cursor-pointer
        ${session.status === 'completed' ? 'border-green-200 bg-green-50' : ''}
        ${session.status === 'skipped' ? 'border-red-200 bg-red-50' : ''}
        ${session.status === 'pending' ? 'border-blue-200 hover:border-blue-300 hover:shadow-md' : ''}
      `}
      onClick={() => onSessionClick?.(session)}
    >
      {/* Header con estudiante y estado */}
      <div className="flex items-start justify-between mb-3">
        <div 
          className="flex items-center space-x-2 cursor-pointer hover:text-blue-600"
          onClick={(e) => {
            e.stopPropagation();
            onStudentClick?.(session.student.id);
          }}
        >
          {session.student.avatar_url ? (
            <img
              className="h-6 w-6 rounded-full object-cover"
              src={session.student.avatar_url}
              alt={studentName}
            />
          ) : (
            <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
              <UserIcon className="h-3 w-3 text-gray-500" />
            </div>
          )}
          <span className="text-sm font-medium text-gray-900 truncate">
            {studentName}
          </span>
        </div>
        
        {getStatusBadge()}
      </div>

      {/* Información de la plantilla */}
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-gray-900 truncate">
          {session.template_assignment.template.name}
        </h4>
        {session.template_assignment.template.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {session.template_assignment.template.description}
          </p>
        )}
      </div>

      {/* Información adicional */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <div className="flex items-center space-x-1">
          <ClockIcon className="h-3 w-3" />
          <span>{formatTime(session.scheduled_date)}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <span>{session.template_assignment.template.exercises?.length || 0} ejercicios</span>
        </div>
      </div>

      {/* Notas del profesor */}
      {session.template_assignment.professor_notes && (
        <div className="mb-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
          <span className="font-medium">Nota:</span> {session.template_assignment.professor_notes}
        </div>
      )}

      {/* Acciones */}
      {canModify && (
        <div className="flex space-x-2 pt-2 border-t border-gray-100">
          <Button
            size="xs"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onComplete?.(session.id);
            }}
            disabled={isLoading}
            leftIcon={<CheckCircleIcon className="w-3 h-3" />}
            className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
          >
            Completar
          </Button>
          
          <Button
            size="xs"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onSkip?.(session.id);
            }}
            disabled={isLoading}
            leftIcon={<XCircleIcon className="w-3 h-3" />}
            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
          >
            Saltar
          </Button>
        </div>
      )}

      {/* Indicador de sesión pasada */}
      {isPastSession && session.status === 'pending' && (
        <div className="mt-2 text-xs text-orange-600 bg-orange-50 rounded px-2 py-1">
          Sesión vencida - Marcar como completada o saltada
        </div>
      )}
    </div>
  );
});

/**
 * Componente de día del calendario
 */
const CalendarDay = memo<{
  date: Date;
  sessions: TodaySession[];
  onComplete?: (sessionId: number) => void;
  onSkip?: (sessionId: number) => void;
  onSessionClick?: (session: TodaySession) => void;
  onStudentClick?: (studentId: number) => void;
  loadingStates?: Record<number, boolean>;
}>(function CalendarDay({ 
  date, 
  sessions, 
  onComplete, 
  onSkip, 
  onSessionClick, 
  onStudentClick,
  loadingStates = {}
}) {
  const isCurrentDay = isToday(date);
  const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
  const dayNumber = date.getDate();
  const monthName = date.toLocaleDateString('es-ES', { month: 'short' });

  // Estadísticas del día
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.status === 'completed').length;
  const skippedSessions = sessions.filter(s => s.status === 'skipped').length;
  const pendingSessions = sessions.filter(s => s.status === 'pending').length;

  return (
    <div className="flex flex-col h-full">
      {/* Header del día */}
      <div className={`
        p-3 border-b border-gray-200 text-center
        ${isCurrentDay ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}
      `}>
        <div className={`
          text-sm font-medium capitalize
          ${isCurrentDay ? 'text-blue-700' : 'text-gray-700'}
        `}>
          {dayName}
        </div>
        <div className={`
          text-lg font-bold
          ${isCurrentDay ? 'text-blue-900' : 'text-gray-900'}
        `}>
          {dayNumber}
        </div>
        <div className="text-xs text-gray-500">
          {monthName}
        </div>
        
        {/* Estadísticas rápidas */}
        {totalSessions > 0 && (
          <div className="flex justify-center space-x-1 mt-2">
            {completedSessions > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                {completedSessions}
              </span>
            )}
            {pendingSessions > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                {pendingSessions}
              </span>
            )}
            {skippedSessions > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                {skippedSessions}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Sesiones del día */}
      <div className="flex-1 p-2 space-y-2 overflow-y-auto">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onComplete={onComplete}
              onSkip={onSkip}
              onSessionClick={onSessionClick}
              onStudentClick={onStudentClick}
              isLoading={loadingStates[session.id]}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-20 text-gray-400">
            <div className="text-center">
              <CalendarDaysIcon className="h-6 w-6 mx-auto mb-1" />
              <span className="text-xs">Sin sesiones</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

/**
 * Componente principal del calendario
 */
export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = memo(function WeeklyCalendar({
  onSessionClick,
  onStudentClick,
}) {
  const toast = useToast();
  
  // Estado de la semana actual
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date()));
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});

  // Generar fechas de la semana
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => 
      addDays(currentWeekStart, index)
    );
  }, [currentWeekStart]);

  // Query del calendario
  const startDateString = currentWeekStart.toISOString().split('T')[0];
  const { 
    data: calendarData, 
    isLoading, 
    error,
    refetch 
  } = useWeeklyCalendar(startDateString);

  // Mutaciones
  const completeSessionMutation = useCompleteSession({
    onSuccess: () => {
      toast.success('Sesión marcada como completada');
    },
    onError: (error) => {
      console.error('Error completing session:', error);
      toast.error('Error al completar la sesión');
    },
  });

  const skipSessionMutation = useSkipSession({
    onSuccess: () => {
      toast.success('Sesión marcada como saltada');
    },
    onError: (error) => {
      console.error('Error skipping session:', error);
      toast.error('Error al saltar la sesión');
    },
  });

  // Handlers
  const handlePreviousWeek = useCallback(() => {
    setCurrentWeekStart(prev => addDays(prev, -7));
  }, []);

  const handleNextWeek = useCallback(() => {
    setCurrentWeekStart(prev => addDays(prev, 7));
  }, []);

  const handleToday = useCallback(() => {
    setCurrentWeekStart(startOfWeek(new Date()));
  }, []);

  const setSessionLoading = useCallback((sessionId: number, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [sessionId]: loading,
    }));
  }, []);

  const handleCompleteSession = useCallback(async (sessionId: number) => {
    setSessionLoading(sessionId, true);
    try {
      await completeSessionMutation.mutateAsync(sessionId);
    } finally {
      setSessionLoading(sessionId, false);
    }
  }, [completeSessionMutation, setSessionLoading]);

  const handleSkipSession = useCallback(async (sessionId: number) => {
    setSessionLoading(sessionId, true);
    try {
      await skipSessionMutation.mutateAsync(sessionId);
    } finally {
      setSessionLoading(sessionId, false);
    }
  }, [skipSessionMutation, setSessionLoading]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Agrupar sesiones por día
  const sessionsByDay = useMemo(() => {
    if (!calendarData?.sessions) return {};
    
    return calendarData.sessions.reduce((acc, session) => {
      const sessionDate = new Date(session.scheduled_date);
      const dayKey = sessionDate.toISOString().split('T')[0];
      
      if (!acc[dayKey]) {
        acc[dayKey] = [];
      }
      acc[dayKey].push(session);
      
      return acc;
    }, {} as Record<string, TodaySession[]>);
  }, [calendarData]);

  // Rango de fechas para mostrar
  const weekRange = useMemo(() => {
    const start = formatDate(currentWeekStart);
    const end = formatDate(addDays(currentWeekStart, 6));
    return `${start} - ${end}`;
  }, [currentWeekStart]);

  // Estados de carga
  if (isLoading && !calendarData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-4 h-96">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <Skeleton className="h-4 w-16 mx-auto mb-2" />
                <Skeleton className="h-6 w-8 mx-auto" />
              </div>
              <div className="p-2 space-y-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
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
              Error al cargar el calendario
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

  const totalSessions = calendarData?.sessions?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header con navegación */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Calendario Semanal
          </h2>
          <p className="text-sm text-gray-500">
            {weekRange} • {totalSessions} sesiones programadas
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            onClick={handleToday}
            size="sm"
          >
            Hoy
          </Button>
          
          <Button
            variant="secondary"
            onClick={handlePreviousWeek}
            size="sm"
            leftIcon={<ChevronLeftIcon className="w-4 h-4" />}
          >
            Anterior
          </Button>
          
          <Button
            variant="secondary"
            onClick={handleNextWeek}
            size="sm"
            rightIcon={<ChevronRightIcon className="w-4 h-4" />}
          >
            Siguiente
          </Button>
          
          <Button
            variant="secondary"
            onClick={handleRefresh}
            disabled={isLoading}
            size="sm"
            leftIcon={<PlayIcon className="w-4 h-4" />}
          >
            Actualizar
          </Button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      {totalSessions > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {calendarData?.stats?.total_sessions || 0}
              </div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {calendarData?.stats?.completed_sessions || 0}
              </div>
              <div className="text-sm text-gray-500">Completadas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {calendarData?.stats?.pending_sessions || 0}
              </div>
              <div className="text-sm text-gray-500">Pendientes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {calendarData?.stats?.skipped_sessions || 0}
              </div>
              <div className="text-sm text-gray-500">Saltadas</div>
            </div>
          </div>
        </div>
      )}

      {/* Grid del calendario */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-7 divide-x divide-gray-200" style={{ minHeight: '500px' }}>
          {weekDays.map((day) => {
            const dayKey = day.toISOString().split('T')[0];
            const daySessions = sessionsByDay[dayKey] || [];
            
            return (
              <CalendarDay
                key={dayKey}
                date={day}
                sessions={daySessions}
                onComplete={handleCompleteSession}
                onSkip={handleSkipSession}
                onSessionClick={onSessionClick}
                onStudentClick={onStudentClick}
                loadingStates={loadingStates}
              />
            );
          })}
        </div>
      </div>

      {/* Estado vacío */}
      {totalSessions === 0 && (
        <EmptyState
          title="No hay sesiones programadas"
          description="No tienes sesiones programadas para esta semana. Las sesiones aparecerán aquí cuando asignes plantillas a tus estudiantes."
        />
      )}
    </div>
  );
});

export default WeeklyCalendar;
