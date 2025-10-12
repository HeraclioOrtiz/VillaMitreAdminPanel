import { apiClient } from './api';

/**
 * Interfaz para los datos de un set individual
 */
export interface DailyTemplateSet {
  id: number;
  daily_template_exercise_id: number;
  set_number: number;
  reps_min: number | null;
  reps_max: number | null;
  rest_seconds: number | null;
  rpe_target: number | null;
  weight_min: number | null;
  weight_max: number | null;
  weight_target: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Interfaz para actualizar un set
 */
export interface UpdateSetData {
  set_number?: number;
  reps_min?: number;
  reps_max?: number;
  rest_seconds?: number;
  rpe_target?: number;
  weight_min?: number;
  weight_max?: number;
  weight_target?: number;
  notes?: string;
}

const SET_ENDPOINTS = {
  update: (id: number) => `/admin/gym/sets/${id}`,
  delete: (id: number) => `/admin/gym/sets/${id}`,
} as const;

export const setService = {
  /**
   * Actualiza un set individual
   * Útil para quick edits sin recargar toda la plantilla
   */
  async updateSet(id: number, data: UpdateSetData): Promise<DailyTemplateSet> {
    try {
      const response = await apiClient.put(SET_ENDPOINTS.update(id), data);
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        throw new Error('Set no encontrado');
      }
      throw new Error('Error al actualizar el set');
    }
  },

  /**
   * Elimina un set individual
   */
  async deleteSet(id: number): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete(SET_ENDPOINTS.delete(id));
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        throw new Error('Set no encontrado');
      }
      throw new Error('Error al eliminar el set');
    }
  },
};
