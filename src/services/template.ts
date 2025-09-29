import { apiClient } from './api';
import type {
  DailyTemplate,
  TemplateFormData,
  TemplateListResponse,
  TemplateQueryParams,
  TemplateStats,
} from '@/types/template';

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
        // 🔍 INTENTAR DIFERENTES FORMAS DE SOLICITAR LAS RELACIONES
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

      return response.data;
    } catch (error: any) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  },

  /**
   * Obtiene una plantilla específica por ID
   */
  async getTemplate(id: number): Promise<DailyTemplate> {
    try {
      const response = await apiClient.get(TEMPLATE_ENDPOINTS.show(id));
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching template ${id}:`, error);
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
      
      
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching template with exercises ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crea una nueva plantilla
   */
  async createTemplate(data: TemplateFormData): Promise<DailyTemplate> {
    try {
      const response = await apiClient.post(TEMPLATE_ENDPOINTS.create, data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating template:', error);
      throw error;
    }
  },

  /**
   * Actualiza una plantilla existente
   */
  async updateTemplate(id: number, data: TemplateFormData): Promise<DailyTemplate> {
    try {
      const response = await apiClient.put(TEMPLATE_ENDPOINTS.update(id), data);
      return response.data;
    } catch (error: any) {
      console.error(`Error updating template ${id}:`, error);
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
      console.error(`Error deleting template ${id}:`, error);
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
      console.error(`Error duplicating template ${id}:`, error);
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
      console.error(`Error toggling favorite for template ${id}:`, error);
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
      console.error('Error fetching template stats:', error);
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
      console.error('Error exporting templates:', error);
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
      console.error('Error bulk deleting templates:', error);
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
      console.error('Error bulk updating templates:', error);
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
      console.error(`Error finding similar templates for ${templateId}:`, error);
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
      console.error('Error fetching recommended templates:', error);
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
      console.error('Error validating template:', error);
      throw error;
    }
  },
};
