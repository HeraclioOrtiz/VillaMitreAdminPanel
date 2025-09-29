import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import { templateService } from '@/services/template';
import type {
  DailyTemplate,
  TemplateFormData,
  TemplateQueryParams,
  TemplateListResponse,
  TemplateStats,
} from '@/types/template';

// Query Keys para React Query
export const templateKeys = {
  all: ['templates'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
  list: (params: TemplateQueryParams) => [...templateKeys.lists(), params] as const,
  details: () => [...templateKeys.all, 'detail'] as const,
  detail: (id: number) => [...templateKeys.details(), id] as const,
  stats: () => [...templateKeys.all, 'stats'] as const,
  similar: (id: number) => [...templateKeys.all, 'similar', id] as const,
  recommended: () => [...templateKeys.all, 'recommended'] as const,
};

/**
 * Hook para obtener lista paginada de plantillas - OPTIMIZADO
 */
export const useTemplates = (params: TemplateQueryParams = {}, options?: { enabled?: boolean }) => {
  // Memoizar query key para evitar re-creación innecesaria
  const queryKey = useMemo(() => templateKeys.list(params), [params]);
  
  // Memoizar query function para estabilidad de referencia
  const queryFn = useCallback(() => templateService.getTemplates(params), [params]);

  return useQuery<TemplateListResponse>({
    queryKey,
    queryFn,
    enabled: options?.enabled !== false, // Por defecto habilitado, solo deshabilitar si se pasa false
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (reemplaza cacheTime deprecated)
    refetchOnWindowFocus: false, // Evitar refetch innecesarios
    placeholderData: (previousData) => previousData, // Para paginación suave
    retry: (failureCount, error: any) => {
      // No retry para errores 4xx del cliente
      if (error?.status === 404 || error?.status === 403) return false;
      return failureCount < 3;
    },
  });
};

/**
 * Hook para obtener una plantilla específica - OPTIMIZADO
 */
export const useTemplate = (id: number) => {
  // Memoizar query key para evitar re-creación innecesaria
  const queryKey = useMemo(() => templateKeys.detail(id), [id]);
  
  // Memoizar query function para estabilidad de referencia
  const queryFn = useCallback(() => templateService.getTemplate(id), [id]);

  return useQuery<DailyTemplate>({
    queryKey,
    queryFn,
    enabled: !!id, // Solo ejecutar si hay ID
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      // No retry para errores 4xx del cliente
      if (error?.status === 404 || error?.status === 403) return false;
      return failureCount < 3;
    },
  });
};

/**
 * Hook para obtener estadísticas de plantillas
 */
export const useTemplateStats = () => {
  return useQuery<TemplateStats>({
    queryKey: templateKeys.stats(),
    queryFn: () => templateService.getTemplateStats(),
    staleTime: 15 * 60 * 1000, // 15 minutos
  });
};

/**
 * Hook para obtener plantillas similares
 */
export const useSimilarTemplates = (templateId: number, limit: number = 5) => {
  return useQuery<DailyTemplate[]>({
    queryKey: templateKeys.similar(templateId),
    queryFn: () => templateService.findSimilarTemplates(templateId, limit),
    enabled: !!templateId,
    staleTime: 30 * 60 * 1000, // 30 minutos
  });
};

/**
 * Hook para obtener plantillas recomendadas
 */
export const useRecommendedTemplates = (limit: number = 10) => {
  return useQuery<DailyTemplate[]>({
    queryKey: templateKeys.recommended(),
    queryFn: () => templateService.getRecommendedTemplates(limit),
    staleTime: 20 * 60 * 1000, // 20 minutos
  });
};

/**
 * Hook para crear una nueva plantilla - OPTIMIZADO
 */
export const useCreateTemplate = (options?: {
  onSuccess?: (template: DailyTemplate) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  // Memoizar callbacks para estabilidad de referencia
  const onSuccess = useCallback((template: DailyTemplate) => {
    // Invalidar todas las listas de plantillas
    queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    // Invalidar estadísticas
    queryClient.invalidateQueries({ queryKey: templateKeys.stats() });
    options?.onSuccess?.(template);
  }, [queryClient, options?.onSuccess]);

  const onError = useCallback((error: any) => {
    console.error('Error creating template:', error);
    options?.onError?.(error);
  }, [options?.onError]);

  return useMutation({
    mutationFn: (data: TemplateFormData) => templateService.createTemplate(data),
    onSuccess,
    onError,
  });
};

/**
 * Hook para actualizar una plantilla
 */
export const useUpdateTemplate = (options?: {
  onSuccess?: (template: DailyTemplate) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TemplateFormData }) =>
      templateService.updateTemplate(id, data),
    onSuccess: (updatedTemplate) => {
      // Invalidar listas y actualizar el detalle específico
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      queryClient.setQueryData(
        templateKeys.detail(updatedTemplate.id),
        updatedTemplate
      );
      // Invalidar estadísticas
      queryClient.invalidateQueries({ queryKey: templateKeys.stats() });
      options?.onSuccess?.(updatedTemplate);
    },
    onError: (error) => {
      console.error('Error updating template:', error);
      options?.onError?.(error);
    },
  });
};

/**
 * Hook para eliminar una plantilla
 */
export const useDeleteTemplate = (options?: {
  onSuccess?: (deletedId: number) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => templateService.deleteTemplate(id),
    onSuccess: (_, deletedId) => {
      // Invalidar listas y remover el detalle específico
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      queryClient.removeQueries({ queryKey: templateKeys.detail(deletedId) });
      // Invalidar estadísticas y recomendaciones
      queryClient.invalidateQueries({ queryKey: templateKeys.stats() });
      queryClient.invalidateQueries({ queryKey: templateKeys.recommended() });
      options?.onSuccess?.(deletedId);
    },
    onError: (error) => {
      console.error('Error deleting template:', error);
      options?.onError?.(error);
    },
  });
};

/**
 * Hook para duplicar una plantilla
 */
export const useDuplicateTemplate = (options?: {
  onSuccess?: (template: DailyTemplate) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => templateService.duplicateTemplate(id),
    onSuccess: (duplicatedTemplate) => {
      // Invalidar todas las listas para mostrar la plantilla duplicada
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      // Invalidar estadísticas
      queryClient.invalidateQueries({ queryKey: templateKeys.stats() });
      options?.onSuccess?.(duplicatedTemplate);
    },
    onError: (error) => {
      console.error('Error duplicating template:', error);
      options?.onError?.(error);
    },
  });
};

/**
 * Hook para marcar/desmarcar como favorita
 */
export const useToggleFavoriteTemplate = (options?: {
  onSuccess?: (template: DailyTemplate) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFavorite }: { id: number; isFavorite: boolean }) =>
      templateService.toggleFavorite(id, isFavorite),
    onSuccess: (updatedTemplate) => {
      // Actualizar el detalle específico
      queryClient.setQueryData(
        templateKeys.detail(updatedTemplate.id),
        updatedTemplate
      );
      // Invalidar listas para reflejar cambios en favoritos
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      // Invalidar estadísticas
      queryClient.invalidateQueries({ queryKey: templateKeys.stats() });
      options?.onSuccess?.(updatedTemplate);
    },
    onError: (error) => {
      console.error('Error toggling favorite template:', error);
      options?.onError?.(error);
    },
  });
};

/**
 * Hook para eliminar múltiples plantillas
 */
export const useBulkDeleteTemplates = (options?: {
  onSuccess?: (deletedIds: number[]) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => templateService.bulkDeleteTemplates(ids),
    onSuccess: (_, deletedIds) => {
      // Invalidar listas y remover detalles específicos
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      deletedIds.forEach((id) => {
        queryClient.removeQueries({ queryKey: templateKeys.detail(id) });
      });
      // Invalidar estadísticas y recomendaciones
      queryClient.invalidateQueries({ queryKey: templateKeys.stats() });
      queryClient.invalidateQueries({ queryKey: templateKeys.recommended() });
      options?.onSuccess?.(deletedIds);
    },
    onError: (error) => {
      console.error('Error bulk deleting templates:', error);
      options?.onError?.(error);
    },
  });
};

/**
 * Hook para actualizar múltiples plantillas
 */
export const useBulkUpdateTemplates = (options?: {
  onSuccess?: (templates: DailyTemplate[]) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      ids, 
      updates 
    }: { 
      ids: number[]; 
      updates: Partial<Pick<TemplateFormData, 'is_public' | 'tags' | 'difficulty'>>
    }) => templateService.bulkUpdateTemplates(ids, updates),
    onSuccess: (updatedTemplates) => {
      // Invalidar listas para mostrar cambios
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      // Actualizar detalles específicos si están en cache
      updatedTemplates.forEach((template) => {
        queryClient.setQueryData(
          templateKeys.detail(template.id),
          template
        );
      });
      // Invalidar estadísticas
      queryClient.invalidateQueries({ queryKey: templateKeys.stats() });
      options?.onSuccess?.(updatedTemplates);
    },
    onError: (error) => {
      console.error('Error bulk updating templates:', error);
      options?.onError?.(error);
    },
  });
};

/**
 * Hook para exportar plantillas
 */
export const useExportTemplates = () => {
  return useMutation({
    mutationFn: (params: TemplateQueryParams = {}) =>
      templateService.exportTemplates(params),
    onSuccess: (blob) => {
      // Crear URL temporal para descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `plantillas-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error('Error exporting templates:', error);
    },
  });
};

/**
 * Hook para validar una plantilla
 */
export const useValidateTemplate = () => {
  return useMutation({
    mutationFn: (data: TemplateFormData) => templateService.validateTemplate(data),
    onError: (error) => {
      console.error('Error validating template:', error);
    },
  });
};

/**
 * Hook para actualizaciones optimistas de plantillas
 * Útil para cambios rápidos como favoritos, visibilidad, etc.
 */
export const useOptimisticTemplateUpdate = () => {
  const queryClient = useQueryClient();

  return {
    updateTemplate: (id: number, updates: Partial<DailyTemplate>) => {
      // Actualizar optimísticamente el cache
      queryClient.setQueryData(
        templateKeys.detail(id),
        (oldData: DailyTemplate | undefined) => {
          if (!oldData) return oldData;
          return { ...oldData, ...updates };
        }
      );

      // También actualizar en las listas si están en cache
      queryClient.setQueriesData(
        { queryKey: templateKeys.lists() },
        (oldData: TemplateListResponse | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((template) =>
              template.id === id ? { ...template, ...updates } : template
            ),
          };
        }
      );
    },

    revertTemplate: (id: number) => {
      // Invalidar para forzar refetch desde el servidor
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  };
};
