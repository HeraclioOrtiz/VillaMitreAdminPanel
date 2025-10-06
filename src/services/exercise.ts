import { apiClient } from './api';
import type {
  Exercise,
  ExerciseFormData,
  ExerciseListResponse,
  ExerciseQueryParams,
} from '@/types/exercise';

/**
 * Transforma datos de ejercicio del backend para compatibilidad
 * Maneja la transición de strings a arrays según cambios 2025-10-06
 */
function transformExerciseData(exercise: any): Exercise {
  return {
    ...exercise,
    // Asegurar que los campos sean arrays
    target_muscle_groups: Array.isArray(exercise.target_muscle_groups) 
      ? exercise.target_muscle_groups 
      : (exercise.muscle_group ? [exercise.muscle_group] : []),
    equipment: Array.isArray(exercise.equipment) 
      ? exercise.equipment 
      : (exercise.equipment ? [exercise.equipment] : []),
    tags: Array.isArray(exercise.tags) 
      ? exercise.tags 
      : (exercise.tags ? [exercise.tags] : []),
    // Mapear campos legacy para compatibilidad
    muscle_group: exercise.muscle_group || (exercise.target_muscle_groups?.[0]),
    difficulty: exercise.difficulty || exercise.difficulty_level,
    // Asegurar enums correctos
    difficulty_level: exercise.difficulty_level || exercise.difficulty || 'beginner',
    exercise_type: exercise.exercise_type || 'strength',
  };
}

/**
 * Transforma datos de formulario para envío al backend
 * El backend espera arrays para target_muscle_groups, muscle_groups y tags
 */
function transformFormDataForBackend(formData: ExerciseFormData): any {
  // Asegurar que los arrays sean arrays, no strings
  const ensureArray = (value: any): string[] => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value) return [value];
    return [];
  };

  return {
    name: formData.name,
    description: formData.description || '',
    // ✅ Arrays requeridos por el backend
    target_muscle_groups: ensureArray(formData.target_muscle_groups),
    muscle_groups: ensureArray(formData.target_muscle_groups), // Duplicado para compatibilidad
    tags: ensureArray(formData.tags),
    // Strings simples
    movement_pattern: formData.movement_pattern || '',
    equipment: formData.equipment?.[0] || formData.equipment || '', // El backend espera string
    difficulty_level: formData.difficulty_level || 'beginner',
    exercise_type: formData.exercise_type || 'strength',
    instructions: formData.instructions || '',
    tempo: formData.tempo || '',
    video_url: formData.video_url || '',
    image_url: formData.image_url || '',
  };
}

const EXERCISE_ENDPOINTS = {
  list: '/admin/gym/exercises',
  create: '/admin/gym/exercises',
  show: (id: number) => `/admin/gym/exercises/${id}`,
  update: (id: number) => `/admin/gym/exercises/${id}`,
  delete: (id: number) => `/admin/gym/exercises/${id}`,
  duplicate: (id: number) => `/admin/gym/exercises/${id}/duplicate`,
  bulkDelete: '/admin/gym/exercises/bulk-delete',
} as const;

export const exerciseService = {
  /**
   * Obtiene lista paginada de ejercicios con filtros
   */
  async getExercises(params: ExerciseQueryParams = {}): Promise<ExerciseListResponse> {
    try {
      const response = await apiClient.get(EXERCISE_ENDPOINTS.list, {
        params: {
          page: params.page || 1,
          per_page: params.per_page || 20,
          search: params.search || '',
          muscle_group: params.muscle_group?.join(',') || '',
          equipment: params.equipment?.join(',') || '',
          difficulty: params.difficulty?.join(',') || '',
          tags: params.tags?.join(',') || '',
          sort_by: params.sort_by || 'name',
          sort_direction: params.sort_direction || 'asc',
        },
      });
      
      // El backend devuelve directamente la estructura de paginación
      // response es de tipo ApiResponse pero contiene ExerciseListResponse dentro
      const paginationData = response as unknown as ExerciseListResponse;
      
      // Transformar datos para compatibilidad con cambios backend 2025-10-06
      const transformedData: ExerciseListResponse = {
        ...paginationData,
        data: paginationData.data.map(transformExerciseData)
      };
      
      return transformedData;
    } catch (error) {
      throw new Error('Error al cargar los ejercicios');
    }
  },

  /**
   * Obtiene un ejercicio específico por ID
   */
  async getExercise(id: number): Promise<Exercise> {
    try {
      const response = await apiClient.get(EXERCISE_ENDPOINTS.show(id));
      
      // Verificar si viene en un wrapper o directamente y transformar
      const rawExercise = response.data.exercise || response.data;
      return transformExerciseData(rawExercise);
    } catch (error) {
      throw new Error('Error al cargar el ejercicio');
    }
  },

  /**
   * Crea un nuevo ejercicio
   */
  async createExercise(data: ExerciseFormData): Promise<Exercise> {
    try {
      const transformedData = transformFormDataForBackend(data);
      const responseData = await apiClient.post(EXERCISE_ENDPOINTS.create, transformedData);
      
      // Extraer ejercicio de la respuesta y transformar
      const rawExercise = responseData.data || responseData;
      return transformExerciseData(rawExercise);
    } catch (error: any) {
      if (error.response?.status === 422) {
        const validationErrors = error.response.data?.errors || error.response.data?.message;
        throw new Error(`Errores de validación: ${JSON.stringify(validationErrors)}`);
      }
      throw new Error('Error al crear el ejercicio');
    }
  },

  /**
   * Actualiza un ejercicio existente
   */
  async updateExercise(id: number, data: ExerciseFormData): Promise<Exercise> {
    try {
      const transformedData = transformFormDataForBackend(data);
      const responseData = await apiClient.put(EXERCISE_ENDPOINTS.update(id), transformedData);
      
      // Extraer ejercicio de la respuesta y transformar
      const rawExercise = responseData.data || responseData;
      return transformExerciseData(rawExercise);
    } catch (error: any) {
      
      if (error.response?.status === 422) {
        const validationErrors = error.response.data?.errors || error.response.data?.message;
        throw new Error(`Errores de validación: ${JSON.stringify(validationErrors)}`);
      }
      
      throw new Error('Error al actualizar el ejercicio');
    }
  },

  /**
   * Elimina un ejercicio
   */
  async deleteExercise(id: number): Promise<void> {
    try {
      await apiClient.delete(EXERCISE_ENDPOINTS.delete(id));
    } catch (error) {
      // Propagar el error original para mantener la información del servidor
      throw error;
    }
  },

  /**
   * Duplica un ejercicio existente
   */
  async duplicateExercise(id: number): Promise<Exercise> {
    try {
      const response = await apiClient.post(EXERCISE_ENDPOINTS.duplicate(id));
      return response.data.exercise;
    } catch (error) {
      throw new Error('Error al duplicar el ejercicio');
    }
  },

  /**
   * Elimina múltiples ejercicios
   */
  async bulkDeleteExercises(ids: number[]): Promise<void> {
    try {
      await apiClient.post(EXERCISE_ENDPOINTS.bulkDelete, { ids });
    } catch (error) {
      // Propagar el error original para mantener la información del servidor
      throw error;
    }
  },

  /**
   * Exporta ejercicios a CSV
   */
  async exportExercises(params: ExerciseQueryParams = {}): Promise<Blob> {
    try {
      const response = await apiClient.get(`${EXERCISE_ENDPOINTS.list}/export`, {
        params,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw new Error('Error al exportar los ejercicios');
    }
  },
};
