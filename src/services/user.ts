/**
 * Servicio API para gestión de usuarios
 * Implementa todas las operaciones CRUD y funcionalidades avanzadas para usuarios
 */

import { apiClient } from './api';
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
  UserActivity,
  UserActivityResponse,
} from '@/types/user';

/**
 * Clase de servicio para operaciones de usuarios
 */
class UserService {
  private readonly baseURL = '/api/admin/users';

  /**
   * Obtener lista paginada de usuarios con filtros
   */
  async getUsers(params: UserQueryParams = {}): Promise<UserListResponse> {
    const response = await apiClient.get(this.baseURL, { params });
    return response.data;
  }

  /**
   * Obtener un usuario específico por ID
   */
  async getUser(id: number): Promise<User> {
    const response = await apiClient.get<User>(`${this.baseURL}/${id}`);
    return response.data;
  }

  /**
   * Crear un nuevo usuario
   */
  async createUser(data: CreateUserData): Promise<User> {
    const response = await apiClient.post<User>(this.baseURL, data);
    return response.data;
  }

  /**
   * Actualizar un usuario existente
   */
  async updateUser(id: number, data: UpdateUserData): Promise<User> {
    const response = await apiClient.put<User>(`${this.baseURL}/${id}`, data);
    return response.data;
  }

  /**
   * Eliminar un usuario (soft delete)
   */
  async deleteUser(id: number): Promise<void> {
    await apiClient.delete(`${this.baseURL}/${id}`);
  }

  /**
   * Restaurar un usuario eliminado
   */
  async restoreUser(id: number): Promise<User> {
    const response = await apiClient.post<User>(`${this.baseURL}/${id}/restore`);
    return response.data;
  }

  /**
   * Eliminar permanentemente un usuario
   */
  async forceDeleteUser(id: number): Promise<void> {
    await apiClient.delete(`${this.baseURL}/${id}/force`);
  }

  /**
   * Obtener estadísticas de usuarios
   */
  async getUserStats(): Promise<UserStats> {
    const response = await apiClient.get<UserStats>(`${this.baseURL}/stats`);
    return response.data;
  }

  /**
   * Asignar profesor a un usuario
   */
  async assignProfessor(data: AssignProfessorData): Promise<User> {
    const response = await apiClient.post<User>(`${this.baseURL}/assign-professor`, data);
    return response.data;
  }

  /**
   * Desasignar profesor de un usuario
   */
  async unassignProfessor(userId: number): Promise<User> {
    const response = await apiClient.delete<User>(`${this.baseURL}/${userId}/unassign-professor`);
    return response.data;
  }

  /**
   * Resetear contraseña de un usuario
   */
  async resetPassword(data: ResetPasswordData): Promise<ResetPasswordResponse> {
    const response = await apiClient.post<ResetPasswordResponse>(`${this.baseURL}/reset-password`, data);
    return response.data;
  }

  /**
   * Cambiar estado de múltiples usuarios
   */
  async bulkStatusChange(data: BulkStatusChangeData): Promise<{ updated_count: number; users: User[] }> {
    const response = await apiClient.post<{ updated_count: number; users: User[] }>(`${this.baseURL}/bulk-status`, data);
    return response.data;
  }

  /**
   * Eliminar múltiples usuarios
   */
  async bulkDeleteUsers(userIds: number[]): Promise<{ deleted_count: number }> {
    const response = await apiClient.post<{ deleted_count: number }>(`${this.baseURL}/bulk-delete`, { user_ids: userIds });
    return response.data;
  }

  /**
   * Exportar usuarios
   */
  async exportUsers(data: ExportUsersData): Promise<Blob> {
    const response = await apiClient.post(`${this.baseURL}/export`, data, {
      responseType: 'blob',
    });
    return response.data;
  }

  /**
   * Obtener actividades de un usuario
   */
  async getUserActivities(userId: number, params: { page?: number; per_page?: number } = {}): Promise<UserActivityResponse> {
    const response = await apiClient.get<UserActivityResponse>(`${this.baseURL}/${userId}/activities`, { params });
    return response.data;
  }

  /**
   * Verificar email de un usuario
   */
  async verifyEmail(userId: number): Promise<User> {
    const response = await apiClient.post<User>(`${this.baseURL}/${userId}/verify-email`);
    return response.data;
  }

  /**
   * Verificar teléfono de un usuario
   */
  async verifyPhone(userId: number): Promise<User> {
    const response = await apiClient.post<User>(`${this.baseURL}/${userId}/verify-phone`);
    return response.data;
  }

  /**
   * Enviar email de bienvenida
   */
  async sendWelcomeEmail(userId: number): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>(`${this.baseURL}/${userId}/welcome-email`);
    return response.data;
  }

  /**
   * Obtener profesores disponibles para asignación
   */
  async getAvailableProfessors(): Promise<User[]> {
    const response = await apiClient.get<User[]>(`${this.baseURL}/professors`);
    return response.data;
  }

  /**
   * Obtener usuarios por rol
   */
  async getUsersByRole(role: string, params: { page?: number; per_page?: number } = {}): Promise<UserListResponse> {
    const response = await apiClient.get<UserListResponse>(`${this.baseURL}/by-role/${role}`, { params });
    return response.data;
  }

  /**
   * Buscar usuarios por término
   */
  async searchUsers(query: string, params: { limit?: number } = {}): Promise<User[]> {
    const response = await apiClient.get<User[]>(`${this.baseURL}/search`, {
      params: { q: query, ...params }
    });
    return response.data;
  }

  /**
   * Obtener usuarios con membresías próximas a vencer
   */
  async getExpiringMemberships(days: number = 30): Promise<User[]> {
    const response = await apiClient.get<User[]>(`${this.baseURL}/expiring-memberships`, {
      params: { days }
    });
    return response.data;
  }

  /**
   * Obtener usuarios inactivos
   */
  async getInactiveUsers(days: number = 30): Promise<User[]> {
    const response = await apiClient.get<User[]>(`${this.baseURL}/inactive`, {
      params: { days }
    });
    return response.data;
  }

  /**
   * Actualizar foto de perfil
   */
  async updateAvatar(userId: number, file: File): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await apiClient.post<User>(`${this.baseURL}/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Eliminar foto de perfil
   */
  async deleteAvatar(userId: number): Promise<User> {
    const response = await apiClient.delete<User>(`${this.baseURL}/${userId}/avatar`);
    return response.data;
  }

  /**
   * Obtener resumen de usuario para dashboard
   */
  async getUserSummary(userId: number): Promise<{
    user: User;
    stats: {
      total_workouts: number;
      current_streak: number;
      last_workout: string | null;
      next_payment_due: string | null;
    };
    recent_activities: UserActivity[];
  }> {
    const response = await apiClient.get(`${this.baseURL}/${userId}/summary`);
    return response.data;
  }

  /**
   * Duplicar usuario (crear copia con datos similares)
   */
  async duplicateUser(id: number): Promise<User> {
    const response = await apiClient.post<User>(`${this.baseURL}/${id}/duplicate`);
    return response.data;
  }

  /**
   * Validar datos de usuario antes de guardar
   */
  async validateUserData(data: CreateUserData | UpdateUserData): Promise<{
    valid: boolean;
    errors: Array<{ field: string; message: string }>;
  }> {
    const response = await apiClient.post(`${this.baseURL}/validate`, data);
    return response.data;
  }

  /**
   * Obtener configuración de usuario
   */
  async getUserSettings(userId: number): Promise<Record<string, any>> {
    const response = await apiClient.get(`${this.baseURL}/${userId}/settings`);
    return response.data;
  }

  /**
   * Actualizar configuración de usuario
   */
  async updateUserSettings(userId: number, settings: Record<string, any>): Promise<Record<string, any>> {
    const response = await apiClient.put(`${this.baseURL}/${userId}/settings`, settings);
    return response.data;
  }

  /**
   * Generar reporte de usuario
   */
  async generateUserReport(userId: number, format: 'pdf' | 'xlsx' = 'pdf'): Promise<Blob> {
    const response = await apiClient.get(`${this.baseURL}/${userId}/report`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  }

  /**
   * Obtener historial de cambios de un usuario
   */
  async getUserHistory(userId: number, params: { page?: number; per_page?: number } = {}): Promise<{
    data: Array<{
      id: number;
      field: string;
      old_value: any;
      new_value: any;
      changed_by: User;
      created_at: string;
    }>;
    meta: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
    };
  }> {
    const response = await apiClient.get(`${this.baseURL}/${userId}/history`, { params });
    return response.data;
  }
}

// Instancia singleton del servicio
export const userService = new UserService();

// Export por defecto
export default userService;
