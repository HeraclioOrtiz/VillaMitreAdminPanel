import { apiClient } from './api';
import type {
  DailyTemplate,
  TemplateFormData,
  TemplateListResponse,
  TemplateQueryParams,
  TemplateStats,
  TemplateSet,
} from '@/types/template';

/**
 * Transforma datos de set del backend para compatibilidad
 * Maneja los nuevos campos de peso según cambios 2025-10-06
 */
function transformSetData(set: any): TemplateSet {
  return {
    ...set,
    // Asegurar que los nuevos campos de peso estén presentes
    weight_min: set.weight_min || null,
    weight_max: set.weight_max || null,
    weight_target: set.weight_target || null,
    // Mapear campos legacy para compatibilidad
    weight: set.weight || set.weight_target || null,
    rpe: set.rpe || set.rpe_target || null,
    rpe_target: set.rpe_target || set.rpe || null,
    // Nota: tempo ya no se usa en sets según backend 2025-10-06
  };
}

/**
 * Transforma datos de plantilla del backend para frontend
 */
function transformTemplateData(template: any): DailyTemplate {
  return {
    ...template,
    exercises: template.exercises?.map((exercise: any) => ({
      ...exercise,
      sets: exercise.sets?.map(transformSetData) || []
    })) || []
  };
}

/**
 * Transforma datos del formulario frontend al formato del backend
 * Backend espera: title, level, goal, estimated_duration_min, tags (array)
 * Frontend envía: name, difficulty, primary_goal, estimated_duration, tags
 */
function transformFormDataForBackend(formData: any): any {
  // Transformar ejercicios y sets
  const exercises = formData.exercises?.map((exercise: any, index: number) => ({
    exercise_id: exercise.exercise_id,
    display_order: exercise.display_order || index + 1,
    super_set_group: exercise.super_set_group || null,
    rest_between_sets: exercise.rest_between_sets || 60,
    notes: exercise.notes || '',
    modifications: exercise.modifications || '',
    sets: exercise.sets?.map((set: any, setIndex: number) => ({
      set_number: set.set_number || setIndex + 1,
      reps_min: set.reps_min || set.reps || 0,
      reps_max: set.reps_max || set.reps || 0,
      // Campos de peso nuevos 2025-10-06
      weight_min: set.weight_min || null,
      weight_max: set.weight_max || null,
      weight_target: set.weight_target || set.weight || null,
      duration: set.duration || null,
      distance: set.distance || null,
      rest_seconds: set.rest_seconds || set.rest_time || 60,
      notes: set.notes || '',
      rpe_target: set.rpe_target || set.rpe || null,
    })) || []
  })) || [];

  return {
    // Campos básicos - Mapeo frontend → backend
    title: formData.name,  // Backend usa 'title'
    description: formData.description || '',
    estimated_duration_min: formData.estimated_duration || 60,  // Backend usa 'estimated_duration_min'
    level: formData.difficulty || 'intermediate',  // Backend usa 'level'
    goal: formData.primary_goal || 'hypertrophy',  // Backend usa 'goal'
    tags: Array.isArray(formData.tags) ? formData.tags : [],  // Backend usa array de strings
    
    // Campos de configuración
    target_muscle_groups: formData.target_muscle_groups || [],
    equipment_needed: formData.equipment_needed || [],
    secondary_goals: formData.secondary_goals || [],
    intensity_level: formData.intensity_level || 'moderate',
    
    // Campos adicionales
    warm_up_notes: formData.warm_up_notes || '',
    cool_down_notes: formData.cool_down_notes || '',
    progression_notes: formData.progression_notes || '',
    variations: formData.variations || [],
    prerequisites: formData.prerequisites || [],
    contraindications: formData.contraindications || [],
    
    // Visibilidad
    is_public: formData.is_public || false,
    
    // Ejercicios transformados
    exercises: exercises,
  };
}

const TEMPLATE_ENDPOINTS = {
  list: '/admin/gym/daily-templates',
  create: '/admin/gym/daily-templates',
  show: (id: number) => `/admin/gym/daily-templates/${id}`,
  update: (id: number) => `/admin/gym/daily-templates/${id}`,
  delete: (id: number) => `/admin/gym/daily-templates/${id}`,
  duplicate: (id: number) => `/admin/gym/daily-templates/${id}/duplicate`,
  favorite: (id: number) => `/admin/gym/daily-templates/${id}/favorite`,
  unfavorite: (id: number) => `/admin/gym/daily-templates/${id}/unfavorite`,
  stats: '/admin/gym/daily-templates/stats',
  export: '/admin/gym/daily-templates/export',
  bulkDelete: '/admin/gym/daily-templates/bulk-delete',
  bulkUpdate: '/admin/gym/daily-templates/bulk-update',
} as const;

export const templateService = {
  /**
   * Obtiene lista paginada de plantillas con filtros
   */
  async getTemplates(params: TemplateQueryParams = {}): Promise<TemplateListResponse> {
    try {
      const requestParams = {
        page: params.page || 1,
        per_page: params.per_page || 20,
        search: params.search || '',
        level: params.difficulty?.join(',') || '',
        goal: params.primary_goal?.join(',') || '',
        tags: params.tags?.join(',') || '',
        sort_by: params.sort_by || 'created_at',
        sort_direction: params.sort_direction || 'desc',
        with_exercises: true,
        with_sets: true,
        include: 'exercises,exercises.exercise,exercises.sets',
        with: 'exercises.exercise,exercises.sets',
        target_muscle_groups: params.target_muscle_groups?.join(',') || '',
        equipment_needed: params.equipment_needed?.join(',') || '',
        duration_min: params.duration_min,
        duration_max: params.duration_max,
        intensity_level: params.intensity_level?.join(',') || '',
        is_public: params.is_public,
        is_favorite: params.is_favorite,
        created_by: params.created_by,
      };
      
      const response = await apiClient.get(TEMPLATE_ENDPOINTS.list, {
        params: requestParams,
      });

      // Manejar diferentes estructuras de respuesta del backend
      const responseData = response.data || response;
      let templates: any[] = [];
      
      // Si es un array directo
      if (Array.isArray(responseData)) {
        templates = responseData;
      }
      // Si tiene estructura paginada con data
      else if (responseData.data && Array.isArray(responseData.data)) {
        templates = responseData.data;
      }
      // Si tiene estructura paginada con templates
      else if (responseData.templates && Array.isArray(responseData.templates)) {
        templates = responseData.templates;
      }
      // Fallback: array vacío
      else {
        templates = [];
      }

      // Transformar plantillas
      const transformedTemplates = templates.map(transformTemplateData);

      // Retornar con estructura paginada consistente
      return {
        data: transformedTemplates,
        meta: responseData.meta || {
          current_page: responseData.current_page || 1,
          last_page: responseData.last_page || 1,
          per_page: responseData.per_page || templates.length,
          total: responseData.total || templates.length,
          from: responseData.from || 1,
          to: responseData.to || templates.length,
        },
      };
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Obtiene una plantilla específica por ID
   */
  async getTemplate(id: number): Promise<DailyTemplate> {
    try {
      const response = await apiClient.get(TEMPLATE_ENDPOINTS.show(id));
      return transformTemplateData(response.data);
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Obtiene una plantilla específica con ejercicios incluidos
   */
  async getTemplateWithExercises(id: number): Promise<DailyTemplate> {
    try {
      const response = await apiClient.get(TEMPLATE_ENDPOINTS.show(id), {
        params: {
          with_exercises: true,
          with_sets: true,
          // 🔍 INTENTAR DIFERENTES FORMAS DE SOLICITAR LAS RELACIONES
          include: 'exercises,exercises.exercise,exercises.sets',
          with: 'exercises.exercise,exercises.sets',
        }
      });
      
      return transformTemplateData(response.data);
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Crea una nueva plantilla
   * Transforma los datos del formulario al formato esperado por el backend
   */
  async createTemplate(data: TemplateFormData): Promise<DailyTemplate> {
    try {
      // Transformar datos del frontend al formato del backend
      const transformedData = transformFormDataForBackend(data);
      
      const response = await apiClient.post(TEMPLATE_ENDPOINTS.create, transformedData);
      
      // La respuesta de apiClient.post ya viene sin el wrapper .data gracias al interceptor
      // response es directamente el objeto de datos del backend
      return transformTemplateData(response);
    } catch (error: any) {
      if (error.response?.status === 422) {
        const validationErrors = error.response.data?.errors || error.response.data?.message;
        throw new Error(`Errores de validación: ${JSON.stringify(validationErrors)}`);
      }
      throw error;
    }
  },

  /**
   * Actualiza una plantilla existente
   * Transforma los datos del formulario al formato esperado por el backend
   */
  async updateTemplate(id: number, data: TemplateFormData): Promise<DailyTemplate> {
    try {
      // Transformar datos del frontend al formato del backend
      const transformedData = transformFormDataForBackend(data);
      
      const response = await apiClient.put(TEMPLATE_ENDPOINTS.update(id), transformedData);
      
      // Transformar respuesta del backend al formato del frontend
      return transformTemplateData(response.data);
    } catch (error: any) {
      if (error.response?.status === 422) {
        const validationErrors = error.response.data?.errors || error.response.data?.message;
        throw new Error(`Errores de validación: ${JSON.stringify(validationErrors)}`);
      }
      throw error;
    }
  },

  /**
   * Elimina una plantilla
   */
  async deleteTemplate(id: number): Promise<void> {
    try {
      await apiClient.delete(TEMPLATE_ENDPOINTS.delete(id));
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Duplica una plantilla
   */
  async duplicateTemplate(id: number): Promise<DailyTemplate> {
    try {
      const response = await apiClient.post(TEMPLATE_ENDPOINTS.duplicate(id));
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Toggle favorito de una plantilla
   */
  async toggleFavorite(id: number, isFavorite: boolean): Promise<DailyTemplate> {
    try {
      const endpoint = isFavorite 
        ? TEMPLATE_ENDPOINTS.favorite(id)
        : TEMPLATE_ENDPOINTS.unfavorite(id);
      
      const response = await apiClient.post(endpoint);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Obtiene estadísticas de plantillas
   */
  async getTemplateStats(): Promise<TemplateStats> {
    try {
      const response = await apiClient.get(TEMPLATE_ENDPOINTS.stats);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Exporta plantillas a Excel
   */
  async exportTemplates(params: TemplateQueryParams = {}): Promise<Blob> {
    try {
      const response = await apiClient.get(TEMPLATE_ENDPOINTS.export, {
        params,
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Eliminación masiva de plantillas
   */
  async bulkDeleteTemplates(ids: number[]): Promise<void> {
    try {
      await apiClient.post(TEMPLATE_ENDPOINTS.bulkDelete, { ids });
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Actualización masiva de plantillas
   */
  async bulkUpdateTemplates(ids: number[], updates: Partial<DailyTemplate>): Promise<DailyTemplate[]> {
    try {
      const response = await apiClient.post(TEMPLATE_ENDPOINTS.bulkUpdate, {
        ids,
        updates,
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Busca plantillas similares
   */
  async findSimilarTemplates(templateId: number, limit: number = 5): Promise<DailyTemplate[]> {
    try {
      const response = await apiClient.get(`/admin/gym/daily-templates/${templateId}/similar`, {
        params: { limit },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Obtiene plantillas recomendadas
   */
  async getRecommendedTemplates(limit: number = 10): Promise<DailyTemplate[]> {
    try {
      const response = await apiClient.get('/admin/gym/daily-templates/recommended', {
        params: { limit },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Valida una plantilla antes de guardar
   */
  async validateTemplate(data: TemplateFormData): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    try {
      const response = await apiClient.post('/admin/gym/daily-templates/validate', data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
};
