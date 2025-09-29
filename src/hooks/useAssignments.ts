/**
 * Hooks React Query para gestión de asignaciones
 * Implementa todas las operaciones con optimizaciones de performance
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { assignmentService } from '@/services/assignment';
import type {
  ProfessorStudentAssignment,
  TemplateAssignment,
  WorkoutSession,
  AdminAssignmentStats,
  ProfessorStats,
  TodaySession,
  WeeklyCalendar,
  CreateProfessorStudentAssignmentRequest,
  UpdateProfessorStudentAssignmentRequest,
  AssignTemplateRequest,
  UpdateTemplateAssignmentRequest,
  AssignmentQueryParams,
  AssignmentListResponse,
  UnassignedStudentsResponse,
  ProfessorStudentsResponse,
  TodaySessionsResponse,
} from '@/types/assignment';
import type { User } from '@/types/user';

// ===== QUERY KEYS =====

export const assignmentKeys = {
  // Admin keys
  all: ['assignments'] as const,
  adminStats: () => [...assignmentKeys.all, 'admin-stats'] as const,
  lists: () => [...assignmentKeys.all, 'list'] as const,
  list: (params: AssignmentQueryParams) => [...assignmentKeys.lists(), params] as const,
  details: () => [...assignmentKeys.all, 'detail'] as const,
  detail: (id: number) => [...assignmentKeys.details(), id] as const,
  unassigned: () => [...assignmentKeys.all, 'unassigned-students'] as const,
  availableProfessors: () => [...assignmentKeys.all, 'available-professors'] as const,
  
  // Professor keys
  professorStudents: () => [...assignmentKeys.all, 'professor-students'] as const,
  professorStats: () => [...assignmentKeys.all, 'professor-stats'] as const,
  todaySessions: () => [...assignmentKeys.all, 'today-sessions'] as const,
  weeklyCalendar: (startDate: string) => [...assignmentKeys.all, 'weekly-calendar', startDate] as const,
  studentProgress: (studentId: number) => [...assignmentKeys.all, 'student-progress', studentId] as const,
  studentTemplateAssignments: (studentId: number) => [...assignmentKeys.all, 'student-template-assignments', studentId] as const,
  upcomingSessions: (studentId: number, days: number) => [...assignmentKeys.all, 'upcoming-sessions', studentId, days] as const,
};

// ===== ADMIN HOOKS =====

/**
 * Hook para obtener estadísticas del dashboard admin
 */
export const useAdminStats = () => {
  const queryKey = useMemo(() => assignmentKeys.adminStats(), []);
  const queryFn = useCallback(() => assignmentService.getAdminStats(), []);

  return useQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      if (error?.status === 404 || error?.status === 403) return false;
      return failureCount < 3;
    },
  });
};

/**
 * Hook para obtener lista paginada de asignaciones
 */
export const useAssignments = (params: AssignmentQueryParams = {}) => {
  const queryKey = useMemo(() => assignmentKeys.list(params), [params]);
  const queryFn = useCallback(() => assignmentService.getAssignments(params), [params]);

  return useQuery<AssignmentListResponse>({
    queryKey,
    queryFn,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      if (error?.status === 404 || error?.status === 403) return false;
      return failureCount < 3;
    },
  });
};

/**
 * Hook para obtener una asignación específica
 */
export const useAssignment = (id: number) => {
  const queryKey = useMemo(() => assignmentKeys.detail(id), [id]);
  const queryFn = useCallback(() => assignmentService.getAssignment(id), [id]);

  return useQuery<ProfessorStudentAssignment>({
    queryKey,
    queryFn,
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      if (error?.status === 404) return false;
      return failureCount < 2;
    },
  });
};

/**
 * Hook para obtener estudiantes sin asignar
 */
export const useUnassignedStudents = () => {
  const queryKey = useMemo(() => assignmentKeys.unassigned(), []);
  const queryFn = useCallback(() => assignmentService.getUnassignedStudents(), []);

  return useQuery<UnassignedStudentsResponse>({
    queryKey,
    queryFn,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para obtener profesores disponibles
 */
export const useAvailableProfessors = () => {
  const queryKey = useMemo(() => assignmentKeys.availableProfessors(), []);
  const queryFn = useCallback(() => assignmentService.getAvailableProfessors(), []);

  return useQuery<User[]>({
    queryKey,
    queryFn,
    staleTime: 10 * 60 * 1000, // 10 minutos (datos más estables)
    gcTime: 15 * 60 * 1000, // 15 minutos
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para crear asignación profesor-estudiante
 */
export const useCreateAssignment = (options?: {
  onSuccess?: (assignment: ProfessorStudentAssignment) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  const mutationFn = useCallback(
    (data: CreateProfessorStudentAssignmentRequest) => assignmentService.createAssignment(data),
    []
  );

  const onSuccess = useCallback(
    (assignment: ProfessorStudentAssignment) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.adminStats() });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.unassigned() });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.professorStudents() });
      
      // Agregar a cache del detalle
      queryClient.setQueryData(assignmentKeys.detail(assignment.id), assignment);
      
      options?.onSuccess?.(assignment);
    },
    [queryClient, options?.onSuccess]
  );

  const onError = useCallback(
    (error: any) => {
      console.error('Error creating assignment:', error);
      options?.onError?.(error);
    },
    [options?.onError]
  );

  return useMutation({
    mutationFn,
    onSuccess,
    onError,
    retry: (failureCount, error: any) => {
      if (error?.status >= 400 && error?.status < 500) return false;
      return failureCount < 2;
    },
  });
};

/**
 * Hook para actualizar asignación profesor-estudiante
 */
export const useUpdateAssignment = (options?: {
  onSuccess?: (assignment: ProfessorStudentAssignment) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  const mutationFn = useCallback(
    ({ id, data }: { id: number; data: UpdateProfessorStudentAssignmentRequest }) =>
      assignmentService.updateAssignment(id, data),
    []
  );

  const onSuccess = useCallback(
    (updatedAssignment: ProfessorStudentAssignment) => {
      // Invalidar listas y actualizar detalle específico
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.adminStats() });
      queryClient.setQueryData(assignmentKeys.detail(updatedAssignment.id), updatedAssignment);
      
      options?.onSuccess?.(updatedAssignment);
    },
    [queryClient, options?.onSuccess]
  );

  const onError = useCallback(
    (error: any) => {
      console.error('Error updating assignment:', error);
      options?.onError?.(error);
    },
    [options?.onError]
  );

  return useMutation({
    mutationFn,
    onSuccess,
    onError,
  });
};

/**
 * Hook para eliminar asignación profesor-estudiante
 */
export const useDeleteAssignment = (options?: {
  onSuccess?: (deletedId: number) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  const mutationFn = useCallback(
    (id: number) => assignmentService.deleteAssignment(id),
    []
  );

  const onSuccess = useCallback(
    (_: void, deletedId: number) => {
      // Invalidar listas y remover detalle específico
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.adminStats() });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.unassigned() });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.professorStudents() });
      queryClient.removeQueries({ queryKey: assignmentKeys.detail(deletedId) });
      
      options?.onSuccess?.(deletedId);
    },
    [queryClient, options?.onSuccess]
  );

  const onError = useCallback(
    (error: any) => {
      console.error('Error deleting assignment:', error);
      options?.onError?.(error);
    },
    [options?.onError]
  );

  return useMutation({
    mutationFn,
    onSuccess,
    onError,
  });
};

// ===== PROFESSOR HOOKS =====

/**
 * Hook para obtener estudiantes del profesor autenticado
 */
export const useProfessorStudents = () => {
  const queryKey = useMemo(() => assignmentKeys.professorStudents(), []);
  const queryFn = useCallback(async () => {
    const result = await assignmentService.getProfessorStudents();
    return result;
  }, []);

  return useQuery<ProfessorStudentsResponse>({
    queryKey,
    queryFn,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para obtener estadísticas del profesor
 */
export const useProfessorStats = () => {
  const queryKey = useMemo(() => assignmentKeys.professorStats(), []);
  const queryFn = useCallback(async () => {
    try {
      const result = await assignmentService.getProfessorStats();
      return result || {
        total_students: 0,
        active_template_assignments: 0,
        completed_sessions: 0,
        pending_sessions: 0,
        adherence_rate: 0
      };
    } catch (error) {
      console.error('Error fetching professor stats:', error);
      return {
        total_students: 0,
        active_template_assignments: 0,
        completed_sessions: 0,
        pending_sessions: 0,
        adherence_rate: 0
      };
    }
  }, []);

  return useQuery<ProfessorStats>({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    refetchInterval: 30000, // Actualizar cada 30 segundos
    retry: (failureCount, error: any) => {
      if (error?.status === 404 || error?.status === 403) return false;
      return failureCount < 3;
    },
  });
};

/**
 * Hook para obtener sesiones del día
 */
export const useTodaySessions = () => {
  const queryKey = useMemo(() => assignmentKeys.todaySessions(), []);
  const queryFn = useCallback(async () => {
    try {
      const result = await assignmentService.getTodaySessions();
      return result || { data: [], total: 0, pagination: null };
    } catch (error) {
      console.error('Error fetching today sessions:', error);
      return { data: [], total: 0, pagination: null };
    }
  }, []);

  return useQuery<TodaySessionsResponse>({
    queryKey,
    queryFn,
    staleTime: 1 * 60 * 1000, // 1 minuto
    gcTime: 2 * 60 * 1000, // 2 minutos
    refetchOnWindowFocus: false,
    refetchInterval: 60000, // Actualizar cada minuto
    retry: (failureCount, error: any) => {
      // No retry para errores 404 o 403
      if (error?.status === 404 || error?.status === 403) return false;
      return failureCount < 3;
    },
  });
};

/**
 * Hook para obtener calendario semanal
 */
export const useWeeklyCalendar = (startDate: string) => {
  const queryKey = useMemo(() => assignmentKeys.weeklyCalendar(startDate), [startDate]);
  const queryFn = useCallback(() => assignmentService.getWeeklyCalendar(startDate), [startDate]);

  return useQuery<WeeklyCalendar>({
    queryKey,
    queryFn,
    enabled: !!startDate,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para asignar plantilla a estudiante
 */
export const useAssignTemplate = (options?: {
  onSuccess?: (templateAssignment: TemplateAssignment) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  const mutationFn = useCallback(
    (data: AssignTemplateRequest) => assignmentService.assignTemplate(data),
    []
  );

  const onSuccess = useCallback(
    (templateAssignment: TemplateAssignment) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: assignmentKeys.professorStudents() });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.professorStats() });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.todaySessions() });
      
      // Invalidar calendario semanal (todas las semanas)
      queryClient.invalidateQueries({ 
        predicate: (query) => 
          query.queryKey[0] === 'assignments' && 
          query.queryKey[1] === 'weekly-calendar'
      });
      
      // Invalidar progreso del estudiante
      if (templateAssignment.professor_student_assignment?.student_id) {
        queryClient.invalidateQueries({ 
          queryKey: assignmentKeys.studentProgress(templateAssignment.professor_student_assignment.student_id) 
        });
      }
      
      options?.onSuccess?.(templateAssignment);
    },
    [queryClient, options?.onSuccess]
  );

  const onError = useCallback(
    (error: any) => {
      console.error('Error assigning template:', error);
      options?.onError?.(error);
    },
    [options?.onError]
  );

  return useMutation({
    mutationFn,
    onSuccess,
    onError,
  });
};

/**
 * Hook para obtener progreso de un estudiante
 */
export const useStudentProgress = (studentId: number) => {
  const queryKey = useMemo(() => assignmentKeys.studentProgress(studentId), [studentId]);
  const queryFn = useCallback(() => assignmentService.getStudentProgress(studentId), [studentId]);

  return useQuery({
    queryKey,
    queryFn,
    enabled: !!studentId,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para obtener asignaciones de plantillas de un estudiante
 */
export const useStudentTemplateAssignments = (studentId: number) => {
  const queryKey = useMemo(() => assignmentKeys.studentTemplateAssignments(studentId), [studentId]);
  const queryFn = useCallback(() => assignmentService.getStudentTemplateAssignments(studentId), [studentId]);

  return useQuery({
    queryKey,
    queryFn,
    enabled: !!studentId,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para obtener próximas sesiones de un estudiante
 */
export const useUpcomingSessions = (studentId: number, days: number = 7) => {
  const queryKey = useMemo(() => assignmentKeys.upcomingSessions(studentId, days), [studentId, days]);
  const queryFn = useCallback(() => assignmentService.getUpcomingSessions(studentId, days), [studentId, days]);

  return useQuery<WorkoutSession[]>({
    queryKey,
    queryFn,
    enabled: !!studentId,
    staleTime: 1 * 60 * 1000, // 1 minuto
    gcTime: 2 * 60 * 1000, // 2 minutos
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para completar sesión
 */
export const useCompleteSession = (options?: {
  onSuccess?: (session: WorkoutSession) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  const mutationFn = useCallback(
    ({ sessionId, notes }: { sessionId: number; notes?: string }) => 
      assignmentService.completeSession(sessionId, notes),
    []
  );

  const onSuccess = useCallback(
    (session: WorkoutSession) => {
      // Invalidar queries relacionadas con sesiones
      queryClient.invalidateQueries({ queryKey: assignmentKeys.todaySessions() });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.professorStats() });
      
      // Invalidar calendario semanal
      queryClient.invalidateQueries({ 
        predicate: (query) => 
          query.queryKey[0] === 'assignments' && 
          query.queryKey[1] === 'weekly-calendar'
      });
      
      options?.onSuccess?.(session);
    },
    [queryClient, options?.onSuccess]
  );

  const onError = useCallback(
    (error: any) => {
      console.error('Error completing session:', error);
      options?.onError?.(error);
    },
    [options?.onError]
  );

  return useMutation({
    mutationFn,
    onSuccess,
    onError,
  });
};

/**
 * Hook para omitir sesión
 */
export const useSkipSession = (options?: {
  onSuccess?: (session: WorkoutSession) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  const mutationFn = useCallback(
    ({ sessionId, reason }: { sessionId: number; reason?: string }) => 
      assignmentService.skipSession(sessionId, reason),
    []
  );

  const onSuccess = useCallback(
    (session: WorkoutSession) => {
      // Invalidar queries relacionadas con sesiones
      queryClient.invalidateQueries({ queryKey: assignmentKeys.todaySessions() });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.professorStats() });
      
      // Invalidar calendario semanal
      queryClient.invalidateQueries({ 
        predicate: (query) => 
          query.queryKey[0] === 'assignments' && 
          query.queryKey[1] === 'weekly-calendar'
      });
      
      options?.onSuccess?.(session);
    },
    [queryClient, options?.onSuccess]
  );

  const onError = useCallback(
    (error: any) => {
      console.error('Error skipping session:', error);
      options?.onError?.(error);
    },
    [options?.onError]
  );

  return useMutation({
    mutationFn,
    onSuccess,
    onError,
  });
};

// ===== UTILIDADES =====

/**
 * Hook para invalidar todas las queries de asignaciones
 */
export const useInvalidateAssignments = () => {
  const queryClient = useQueryClient();
  
  return useCallback(() => {
    queryClient.invalidateQueries({ queryKey: assignmentKeys.all });
  }, [queryClient]);
};
