/**
 * Hooks React Query para gestión de usuarios
 * Implementa todas las operaciones con optimizaciones de performance
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { userService } from '@/services/user';
import type {
  User,
  CreateUserData,
  UpdateUserData,
  UserQueryParams,
  UserListResponse,
  UserStats,
  AssignProfessorData,
  ResetPasswordData,
  ResetPasswordResponse,
  BulkStatusChangeData,
  ExportUsersData,
  UserActivityResponse,
} from '@/types/user';

// Query Keys para React Query con tipado estricto
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: UserQueryParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
  stats: () => [...userKeys.all, 'stats'] as const,
  activities: (userId: number) => [...userKeys.all, 'activities', userId] as const,
  professors: () => [...userKeys.all, 'professors'] as const,
  expiring: (days: number) => [...userKeys.all, 'expiring', days] as const,
  inactive: (days: number) => [...userKeys.all, 'inactive', days] as const,
  summary: (userId: number) => [...userKeys.all, 'summary', userId] as const,
  settings: (userId: number) => [...userKeys.all, 'settings', userId] as const,
  history: (userId: number) => [...userKeys.all, 'history', userId] as const,
};

/**
 * Hook para obtener lista paginada de usuarios con filtros
 * Optimizado con useMemo y useCallback
 */
export const useUsers = (params: UserQueryParams = {}) => {
  // Memoizar queryKey para evitar re-renders innecesarios
  const queryKey = useMemo(() => userKeys.list(params), [params]);
  
  // Memoizar queryFn para estabilidad de referencia
  const queryFn = useCallback(() => userService.getUsers(params), [params]);
  
  return useQuery<UserListResponse>({
    queryKey,
    queryFn,
    staleTime: 2 * 60 * 1000, // 2 minutos (datos más dinámicos)
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
 * Hook para obtener un usuario específico
 * Optimizado con useMemo y useCallback
 */
export const useUser = (id: number) => {
  const queryKey = useMemo(() => userKeys.detail(id), [id]);
  const queryFn = useCallback(() => userService.getUser(id), [id]);
  
  return useQuery<User>({
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
 * Hook para obtener estadísticas de usuarios
 */
export const useUserStats = () => {
  const queryKey = useMemo(() => userKeys.stats(), []);
  const queryFn = useCallback(() => userService.getUserStats(), []);
  
  return useQuery<UserStats>({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para crear un nuevo usuario
 * Optimizado con useCallback para callbacks estables
 */
export const useCreateUser = (options?: {
  onSuccess?: (user: User) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  const mutationFn = useCallback(
    (data: CreateUserData) => userService.createUser(data),
    []
  );

  const onSuccess = useCallback(
    (user: User) => {
      // Invalidar listas de usuarios
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
      
      // Agregar a cache del detalle
      queryClient.setQueryData(userKeys.detail(user.id), user);
      
      options?.onSuccess?.(user);
    },
    [queryClient, options?.onSuccess]
  );

  const onError = useCallback(
    (error: any) => {
      console.error('Error creating user:', error);
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
 * Hook para actualizar un usuario
 */
export const useUpdateUser = (options?: {
  onSuccess?: (user: User) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  const mutationFn = useCallback(
    ({ id, data }: { id: number; data: UpdateUserData }) =>
      userService.updateUser(id, data),
    []
  );

  const onSuccess = useCallback(
    (updatedUser: User) => {
      // Invalidar listas y actualizar detalle específico
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
      
      options?.onSuccess?.(updatedUser);
    },
    [queryClient, options?.onSuccess]
  );

  const onError = useCallback(
    (error: any) => {
      console.error('Error updating user:', error);
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
 * Hook para eliminar un usuario
 */
export const useDeleteUser = (options?: {
  onSuccess?: (deletedId: number) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  const mutationFn = useCallback(
    (id: number) => userService.deleteUser(id),
    []
  );

  const onSuccess = useCallback(
    (_: void, deletedId: number) => {
      // Invalidar listas y remover detalle específico
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedId) });
      
      options?.onSuccess?.(deletedId);
    },
    [queryClient, options?.onSuccess]
  );

  const onError = useCallback(
    (error: any) => {
      console.error('Error deleting user:', error);
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
 * Hook para asignar profesor
 */
export const useAssignProfessor = (options?: {
  onSuccess?: (user: User) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  const mutationFn = useCallback(
    (data: AssignProfessorData) => userService.assignProfessor(data),
    []
  );

  const onSuccess = useCallback(
    (updatedUser: User) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
      
      options?.onSuccess?.(updatedUser);
    },
    [queryClient, options?.onSuccess]
  );

  const onError = useCallback(
    (error: any) => {
      console.error('Error assigning professor:', error);
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
 * Hook para resetear contraseña
 */
export const useResetPassword = (options?: {
  onSuccess?: (response: ResetPasswordResponse) => void;
  onError?: (error: any) => void;
}) => {
  const mutationFn = useCallback(
    (data: ResetPasswordData) => userService.resetPassword(data),
    []
  );

  const onSuccess = useCallback(
    (response: ResetPasswordResponse) => {
      options?.onSuccess?.(response);
    },
    [options?.onSuccess]
  );

  const onError = useCallback(
    (error: any) => {
      console.error('Error resetting password:', error);
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
 * Hook para cambio de estado masivo
 */
export const useBulkStatusChange = (options?: {
  onSuccess?: (result: { updated_count: number; users: User[] }) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  const mutationFn = useCallback(
    (data: BulkStatusChangeData) => userService.bulkStatusChange(data),
    []
  );

  const onSuccess = useCallback(
    (result: { updated_count: number; users: User[] }) => {
      // Invalidar todas las listas para reflejar cambios
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
      
      // Actualizar cache de usuarios individuales
      result.users.forEach(user => {
        queryClient.setQueryData(userKeys.detail(user.id), user);
      });
      
      options?.onSuccess?.(result);
    },
    [queryClient, options?.onSuccess]
  );

  const onError = useCallback(
    (error: any) => {
      console.error('Error in bulk status change:', error);
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
 * Hook para eliminación masiva
 */
export const useBulkDeleteUsers = (options?: {
  onSuccess?: (deletedCount: number) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  const mutationFn = useCallback(
    (userIds: number[]) => userService.bulkDeleteUsers(userIds),
    []
  );

  const onSuccess = useCallback(
    (result: { deleted_count: number }, userIds: number[]) => {
      // Invalidar listas y remover detalles específicos
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
      
      userIds.forEach(id => {
        queryClient.removeQueries({ queryKey: userKeys.detail(id) });
      });
      
      options?.onSuccess?.(result.deleted_count);
    },
    [queryClient, options?.onSuccess]
  );

  const onError = useCallback(
    (error: any) => {
      console.error('Error in bulk delete:', error);
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
 * Hook para exportar usuarios
 */
export const useExportUsers = () => {
  const mutationFn = useCallback(
    (data: ExportUsersData) => userService.exportUsers(data),
    []
  );

  return useMutation({
    mutationFn,
    onSuccess: (blob, variables) => {
      // Crear URL para descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `usuarios-${new Date().toISOString().split('T')[0]}.${variables.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error('Error exporting users:', error);
    },
  });
};

/**
 * Hook para obtener profesores disponibles
 */
export const useAvailableProfessors = () => {
  const queryKey = useMemo(() => userKeys.professors(), []);
  const queryFn = useCallback(() => userService.getAvailableProfessors(), []);
  
  return useQuery<User[]>({
    queryKey,
    queryFn,
    staleTime: 10 * 60 * 1000, // 10 minutos (datos relativamente estáticos)
    gcTime: 15 * 60 * 1000, // 15 minutos
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para obtener actividades de usuario
 */
export const useUserActivities = (userId: number, params: { page?: number; per_page?: number } = {}) => {
  const queryKey = useMemo(() => [...userKeys.activities(userId), params], [userId, params]);
  const queryFn = useCallback(() => userService.getUserActivities(userId, params), [userId, params]);
  
  return useQuery<UserActivityResponse>({
    queryKey,
    queryFn,
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minuto (datos dinámicos)
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para obtener usuarios con membresías próximas a vencer
 */
export const useExpiringMemberships = (days: number = 30) => {
  const queryKey = useMemo(() => userKeys.expiring(days), [days]);
  const queryFn = useCallback(() => userService.getExpiringMemberships(days), [days]);
  
  return useQuery<User[]>({
    queryKey,
    queryFn,
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para obtener usuarios inactivos
 */
export const useInactiveUsers = (days: number = 30) => {
  const queryKey = useMemo(() => userKeys.inactive(days), [days]);
  const queryFn = useCallback(() => userService.getInactiveUsers(days), [days]);
  
  return useQuery<User[]>({
    queryKey,
    queryFn,
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook personalizado para manejo optimista de usuarios
 */
export const useOptimisticUserUpdate = () => {
  const queryClient = useQueryClient();

  const updateUserOptimistically = useCallback(
    (id: number, updates: Partial<User>) => {
      // Actualizar inmediatamente en cache del detalle
      queryClient.setQueryData(
        userKeys.detail(id),
        (old: User | undefined) => {
          if (!old) return old;
          return { ...old, ...updates };
        }
      );

      // También actualizar en las listas si existe
      queryClient.setQueriesData(
        { queryKey: userKeys.lists() },
        (old: any) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((user: User) =>
              user.id === id ? { ...user, ...updates } : user
            ),
          };
        }
      );
    },
    [queryClient]
  );

  const revertOptimisticUpdate = useCallback(
    (id: number) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    [queryClient]
  );

  return useMemo(
    () => ({
      updateUserOptimistically,
      revertOptimisticUpdate,
    }),
    [updateUserOptimistically, revertOptimisticUpdate]
  );
};

/**
 * Hook para búsqueda de usuarios
 */
export const useSearchUsers = (query: string, options: { enabled?: boolean; limit?: number } = {}) => {
  const { enabled = true, limit = 10 } = options;
  
  const queryKey = useMemo(() => [...userKeys.all, 'search', query, { limit }], [query, limit]);
  const queryFn = useCallback(() => userService.searchUsers(query, { limit }), [query, limit]);
  
  return useQuery<User[]>({
    queryKey,
    queryFn,
    enabled: enabled && query.length >= 2, // Solo buscar con al menos 2 caracteres
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 2 * 60 * 1000, // 2 minutos
    refetchOnWindowFocus: false,
  });
};
