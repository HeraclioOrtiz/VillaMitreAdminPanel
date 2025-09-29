import { apiClient } from './api';
import type {
  Exercise,
  ExerciseFormData,
  ExerciseListResponse,
  ExerciseQueryParams,
} from '@/types/exercise';

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
      
      console.log('getExercises - response:', response);
      console.log('getExercises - response.data:', response.data);
      console.log('getExercises - typeof response.data:', typeof response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw new Error('Error al cargar los ejercicios');
    }
  },

  /**
   * Obtiene un ejercicio específico por ID
   */
  async getExercise(id: number): Promise<Exercise> {
    try {
      const response = await apiClient.get(EXERCISE_ENDPOINTS.show(id));
      console.log('Get exercise response:', response.data);
      
      // Verificar si viene en un wrapper o directamente
      return response.data.exercise || response.data;
    } catch (error) {
      console.error('Error fetching exercise:', error);
      throw new Error('Error al cargar el ejercicio');
    }
  },

  /**
   * Crea un nuevo ejercicio
   */
  async createExercise(data: ExerciseFormData): Promise<Exercise> {
    try {
      // Transformar datos según lo que espera el backend
      const transformedData = {
        ...data,
        muscle_group: Array.isArray(data.muscle_group) ? data.muscle_group.join(',') : data.muscle_group,
        equipment: Array.isArray(data.equipment) ? data.equipment.join(',') : data.equipment,
        tags: data.tags, // tags debe permanecer como array
      };
      
      console.log('Sending exercise data:', transformedData);
      const responseData = await apiClient.post(EXERCISE_ENDPOINTS.create, transformedData);
      console.log('Create exercise responseData:', responseData);
      console.log('ResponseData type:', typeof responseData);
      
      // El apiClient devuelve response.data, que puede ser ApiResponse<Exercise> o directamente Exercise
      // Verificar que la respuesta exista
      if (!responseData) {
        console.error('No response data from server');
        throw new Error('No se recibió respuesta del servidor');
      }
      
      // Verificar si la respuesta tiene estructura ApiResponse o es directamente el ejercicio
      let exercise: any;
      const responseAsAny = responseData as any;
      
      if (responseAsAny.data && typeof responseAsAny.data === 'object') {
        // Estructura ApiResponse<Exercise>
        exercise = responseAsAny.data;
        console.log('Using responseData.data as exercise:', exercise);
      } else if (responseAsAny.id) {
        // Directamente el ejercicio
        exercise = responseAsAny;
        console.log('Using responseData directly as exercise:', exercise);
      } else {
        console.error('Invalid response structure:', responseData);
        throw new Error('Estructura de respuesta inválida del servidor');
      }
      
      console.log('Exercise object:', exercise);
      console.log('Exercise type:', typeof exercise);
      
      // Validar que el ejercicio tenga los campos requeridos
      if (!exercise || typeof exercise !== 'object') {
        console.error('Invalid exercise object:', exercise);
        throw new Error('Objeto de ejercicio inválido');
      }
      
      if (!exercise.id || !exercise.name) {
        console.error('Exercise missing required fields:', { id: exercise.id, name: exercise.name });
        throw new Error('El ejercicio creado no tiene los campos requeridos');
      }
      
      console.log('Exercise validation passed, returning:', exercise);
      return exercise;
    } catch (error: any) {
      console.error('Error creating exercise:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
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
      // Transformar datos según lo que espera el backend
      const transformedData = {
        ...data,
        muscle_group: Array.isArray(data.muscle_group) ? data.muscle_group.join(',') : data.muscle_group,
        equipment: Array.isArray(data.equipment) ? data.equipment.join(',') : data.equipment,
        tags: data.tags, // tags debe permanecer como array
      };
      
      console.log('Updating exercise with data:', transformedData);
      const responseData = await apiClient.put(EXERCISE_ENDPOINTS.update(id), transformedData);
      console.log('Update exercise responseData:', responseData);
      console.log('ResponseData type:', typeof responseData);
      
      // Verificar que la respuesta exista
      if (!responseData) {
        console.error('No response data from server');
        throw new Error('No se recibió respuesta del servidor');
      }
      
      let exercise: Exercise;
      const responseAsAny = responseData as any;
      
      // Verificar si la respuesta tiene la estructura ApiResponse<Exercise>
      if (responseAsAny.data && typeof responseAsAny.data === 'object') {
        // Estructura ApiResponse
        exercise = responseAsAny.data;
        console.log('Using responseData.data as exercise:', exercise);
      } else if (responseAsAny.id && responseAsAny.name) {
        // Directamente el ejercicio
        exercise = responseAsAny;
        console.log('Using responseData directly as exercise:', exercise);
      } else {
        console.error('Invalid response structure:', responseData);
        throw new Error('Estructura de respuesta inválida del servidor');
      }
      
      console.log('Exercise object:', exercise);
      console.log('Exercise type:', typeof exercise);
      
      // Validar que el ejercicio tenga los campos requeridos
      if (!exercise || typeof exercise !== 'object') {
        console.error('Invalid exercise object:', exercise);
        throw new Error('Objeto de ejercicio inválido');
      }
      
      if (!exercise.id || !exercise.name) {
        console.error('Exercise missing required fields:', { id: exercise.id, name: exercise.name });
        throw new Error('El ejercicio actualizado no tiene los campos requeridos');
      }
      
      console.log('Exercise validation passed, returning:', exercise);
      return exercise;
    } catch (error: any) {
      console.error('Error updating exercise:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
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
      console.error('Error deleting exercise:', error);
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
      console.error('Error duplicating exercise:', error);
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
      console.error('Error bulk deleting exercises:', error);
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
      console.error('Error exporting exercises:', error);
      throw new Error('Error al exportar los ejercicios');
    }
  },
};
