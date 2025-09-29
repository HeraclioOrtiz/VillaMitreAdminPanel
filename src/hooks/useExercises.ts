import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { exerciseService } from '@/services/exercise';
import type {
  Exercise,
  ExerciseFormData,
  ExerciseQueryParams,
  ExerciseListResponse,
} from '@/types/exercise';

// Query Keys para React Query
export const exerciseKeys = {
  all: ['exercises'] as const,
  lists: () => [...exerciseKeys.all, 'list'] as const,
  list: (params: ExerciseQueryParams) => [...exerciseKeys.lists(), params] as const,
  details: () => [...exerciseKeys.all, 'detail'] as const,
  detail: (id: number) => [...exerciseKeys.details(), id] as const,
};

/**
 * Hook para obtener lista paginada de ejercicios
 * Optimizado con useMemo para queryKey y queryFn
 */
export const useExercises = (params: ExerciseQueryParams = {}) => {
  // Memoizar queryKey para evitar re-renders innecesarios
  const queryKey = useMemo(() => exerciseKeys.list(params), [params]);
  
  // Memoizar queryFn para estabilidad de referencia
  const queryFn = useCallback(() => {
    console.log('useExercises - queryFn called with params:', params);
    return exerciseService.getExercises(params);
  }, [params]);
  
  console.log('useExercises - hook called with params:', params);
  console.log('useExercises - queryKey:', queryKey);
  
  const result = useQuery<ExerciseListResponse>({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (reemplaza cacheTime)
    // Temporalmente removemos placeholderData para debug
    // placeholderData: (previousData) => previousData, // Para paginación suave
    refetchOnWindowFocus: false, // Evitar refetch innecesarios
    retry: (failureCount, error: any) => {
      // Retry inteligente basado en el tipo de error
      if (error?.status === 404 || error?.status === 403) return false;
      return failureCount < 3;
    },
  });
  
  console.log('useExercises - query result:', result);
  
  return result;
};

/**
 * Hook para obtener un ejercicio específico
 * Optimizado con useMemo y useCallback
 */
export const useExercise = (id: number) => {
  // Memoizar queryKey
  const queryKey = useMemo(() => exerciseKeys.detail(id), [id]);
  
  // Memoizar queryFn
  const queryFn = useCallback(() => exerciseService.getExercise(id), [id]);
  
  return useQuery<Exercise>({
    queryKey,
    queryFn,
    enabled: !!id, // Solo ejecutar si hay ID
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      if (error?.status === 404) return false; // No retry para 404
      return failureCount < 2;
    },
  });
};

/**
 * Hook para crear un nuevo ejercicio
 * Optimizado con useCallback para callbacks estables
 */
export const useCreateExercise = (options?: {
  onSuccess?: (exercise: Exercise) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  // Memoizar mutationFn
  const mutationFn = useCallback(
    (data: ExerciseFormData) => exerciseService.createExercise(data),
    []
  );

  // Memoizar onSuccess callback
  const onSuccess = useCallback(
    (exercise: Exercise) => {
      console.log('Exercise created successfully:', exercise);
      
      // Invalidar todas las listas de ejercicios
      console.log('Invalidating queries with key:', exerciseKeys.lists());
      queryClient.invalidateQueries({ queryKey: exerciseKeys.lists() });
      
      // También invalidar todas las queries de ejercicios para asegurar refresh
      queryClient.invalidateQueries({ queryKey: exerciseKeys.all });
      
      // Actualización optimista: agregar a cache si es posible
      queryClient.setQueryData(exerciseKeys.detail(exercise.id), exercise);
      
      options?.onSuccess?.(exercise);
    },
    [queryClient, options?.onSuccess]
  );

  // Memoizar onError callback
  const onError = useCallback(
    (error: any) => {
      console.error('useCreateExercise - Error creating exercise:', error);
      console.error('useCreateExercise - Error stack:', error.stack);
      console.error('useCreateExercise - Error type:', typeof error);
      options?.onError?.(error);
    },
    [options?.onError]
  );

  return useMutation({
    mutationFn,
    onSuccess,
    onError,
    // Configuración de retry para mutations
    retry: (failureCount, error: any) => {
      if (error?.status >= 400 && error?.status < 500) return false; // No retry para errores del cliente
      return failureCount < 2;
    },
  });
};

/**
 * Hook para actualizar un ejercicio
 */
export const useUpdateExercise = (options?: {
  onSuccess?: (exercise: Exercise) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ExerciseFormData }) =>
      exerciseService.updateExercise(id, data),
    onSuccess: (updatedExercise) => {
      // Invalidar listas y actualizar el detalle específico
      queryClient.invalidateQueries({ queryKey: exerciseKeys.lists() });
      queryClient.setQueryData(
        exerciseKeys.detail(updatedExercise.id),
        updatedExercise
      );
      options?.onSuccess?.(updatedExercise);
    },
    onError: (error) => {
      console.error('Error updating exercise:', error);
      options?.onError?.(error);
    },
  });
};

/**
 * Hook para eliminar un ejercicio
 */
export const useDeleteExercise = (options?: {
  onSuccess?: (deletedId: number) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => exerciseService.deleteExercise(id),
    onSuccess: (_, deletedId) => {
      // Invalidar listas y remover el detalle específico
      queryClient.invalidateQueries({ queryKey: exerciseKeys.lists() });
      queryClient.removeQueries({ queryKey: exerciseKeys.detail(deletedId) });
      options?.onSuccess?.(deletedId);
    },
    onError: (error) => {
      console.error('Error deleting exercise:', error);
      options?.onError?.(error);
    },
  });
};

/**
 * Hook para duplicar un ejercicio
 */
export const useDuplicateExercise = (options?: {
  onSuccess?: (exercise: Exercise) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => exerciseService.duplicateExercise(id),
    onSuccess: (duplicatedExercise) => {
      // Invalidar todas las listas para mostrar el ejercicio duplicado
      queryClient.invalidateQueries({ queryKey: exerciseKeys.lists() });
      options?.onSuccess?.(duplicatedExercise);
    },
    onError: (error) => {
      console.error('Error duplicating exercise:', error);
      options?.onError?.(error);
    },
  });
};

/**
 * Hook para eliminar múltiples ejercicios
 */
export const useBulkDeleteExercises = (options?: {
  onSuccess?: (deletedIds: number[]) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => exerciseService.bulkDeleteExercises(ids),
    onSuccess: (_, deletedIds) => {
      // Invalidar listas y remover detalles específicos
      queryClient.invalidateQueries({ queryKey: exerciseKeys.lists() });
      deletedIds.forEach((id) => {
        queryClient.removeQueries({ queryKey: exerciseKeys.detail(id) });
      });
      options?.onSuccess?.(deletedIds);
    },
    onError: (error) => {
      console.error('Error bulk deleting exercises:', error);
      options?.onError?.(error);
    },
  });
};

/**
 * Hook para exportar ejercicios
 */
export const useExportExercises = () => {
  return useMutation({
    mutationFn: (params: ExerciseQueryParams = {}) =>
      exerciseService.exportExercises(params),
    onSuccess: (blob) => {
      // Crear URL para descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ejercicios-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error('Error exporting exercises:', error);
    },
  });
};

/**
 * Hook personalizado para manejo optimista de ejercicios
 * Útil para updates inmediatos en la UI
 * Optimizado con useCallback
 */
export const useOptimisticExerciseUpdate = () => {
  const queryClient = useQueryClient();

  // Memoizar función de actualización optimista
  const updateExerciseOptimistically = useCallback(
    (id: number, updates: Partial<Exercise>) => {
      // Actualizar inmediatamente en cache del detalle
      queryClient.setQueryData(
        exerciseKeys.detail(id),
        (old: Exercise | undefined) => {
          if (!old) return old;
          return { ...old, ...updates };
        }
      );

      // También actualizar en las listas si existe
      queryClient.setQueriesData(
        { queryKey: exerciseKeys.lists() },
        (old: any) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((exercise: Exercise) =>
              exercise.id === id ? { ...exercise, ...updates } : exercise
            ),
          };
        }
      );
    },
    [queryClient]
  );

  // Función para revertir cambios optimistas en caso de error
  const revertOptimisticUpdate = useCallback(
    (id: number) => {
      // Invalidar queries para obtener datos frescos del servidor
      queryClient.invalidateQueries({ queryKey: exerciseKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: exerciseKeys.lists() });
    },
    [queryClient]
  );

  return useMemo(
    () => ({
      updateExerciseOptimistically,
      revertOptimisticUpdate,
    }),
    [updateExerciseOptimistically, revertOptimisticUpdate]
  );
};
