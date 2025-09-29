/**
 * Servicio API para gestión de asignaciones jerárquico
 * Implementa todos los endpoints definidos en la guía del backend
 */

import { apiClient } from './api';
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

/**
 * Clase de servicio para operaciones de asignaciones
 */
class AssignmentService {
  
  // ===== ADMIN ENDPOINTS =====
  
  /**
   * Obtener estadísticas del dashboard admin
   * GET /admin/assignments-stats
   */
  async getAdminStats(): Promise<AdminAssignmentStats> {
    const response = await apiClient.get<AdminAssignmentStats>('/admin/assignments-stats');
    return response.data;
  }

  /**
   * Obtener lista paginada de asignaciones profesor-estudiante
   * GET /admin/assignments
   */
  async getAssignments(params: AssignmentQueryParams = {}): Promise<AssignmentListResponse> {
    const response = await apiClient.get<AssignmentListResponse>('/admin/assignments', { params });
    return response.data;
  }

  /**
   * Obtener una asignación específica por ID
   * GET /admin/assignments/{id}
   */
  async getAssignment(id: number): Promise<ProfessorStudentAssignment> {
    const response = await apiClient.get<ProfessorStudentAssignment>(`/admin/assignments/${id}`);
    return response.data;
  }

  /**
   * Crear nueva asignación profesor-estudiante
   * POST /admin/assignments
   */
  async createAssignment(data: CreateProfessorStudentAssignmentRequest): Promise<ProfessorStudentAssignment> {
    const response = await apiClient.post<ProfessorStudentAssignment>('/admin/assignments', data);
    return response.data;
  }

  /**
   * Actualizar asignación profesor-estudiante
   * PUT /admin/assignments/{id}
   */
  async updateAssignment(id: number, data: UpdateProfessorStudentAssignmentRequest): Promise<ProfessorStudentAssignment> {
    const response = await apiClient.put<ProfessorStudentAssignment>(`/admin/assignments/${id}`, data);
    return response.data;
  }

  /**
   * Eliminar asignación profesor-estudiante
   * DELETE /admin/assignments/{id}
   */
  async deleteAssignment(id: number): Promise<void> {
    await apiClient.delete(`/admin/assignments/${id}`);
  }

  /**
   * Obtener estudiantes sin asignar
   * GET /admin/students/unassigned
   */
  async getUnassignedStudents(): Promise<UnassignedStudentsResponse> {
    const response = await apiClient.get<UnassignedStudentsResponse>('/admin/students/unassigned');
    return response.data;
  }

  /**
   * Obtener profesores disponibles para asignación
   * GET /admin/professors/available
   */
  async getAvailableProfessors(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/admin/professors/available');
    return response.data;
  }

  // ===== PROFESSOR ENDPOINTS =====

  /**
   * Obtener estudiantes asignados al profesor autenticado
   * GET /professor/my-students
   */
  async getProfessorStudents(): Promise<ProfessorStudentsResponse> {
    const response = await apiClient.get<ProfessorStudentsResponse>('/professor/my-students');
    return response.data;
  }

  /**
   * Obtener estadísticas del profesor autenticado
   * GET /professor/my-stats
   */
  async getProfessorStats(): Promise<ProfessorStats> {
    const response = await apiClient.get<ProfessorStats>('/professor/my-stats');
    return response.data;
  }

  /**
   * Obtener sesiones del día para el profesor autenticado
   * GET /professor/today-sessions
   */
  async getTodaySessions(): Promise<TodaySessionsResponse> {
    const response = await apiClient.get<TodaySessionsResponse>('/professor/today-sessions');
    return response.data;
  }

  /**
   * Obtener calendario semanal del profesor
   * GET /professor/weekly-calendar
   */
  async getWeeklyCalendar(startDate: string): Promise<WeeklyCalendar> {
    const response = await apiClient.get<WeeklyCalendar>('/professor/weekly-calendar', {
      params: { start_date: startDate }
    });
    return response.data;
  }

  /**
   * Asignar plantilla a un estudiante
   * POST /professor/assign-template
   */
  async assignTemplate(data: AssignTemplateRequest): Promise<TemplateAssignment> {
    const response = await apiClient.post<TemplateAssignment>('/professor/assign-template', data);
    return response.data;
  }

  /**
   * Actualizar asignación de plantilla
   * PUT /professor/template-assignments/{id}
   */
  async updateTemplateAssignment(id: number, data: UpdateTemplateAssignmentRequest): Promise<TemplateAssignment> {
    const response = await apiClient.put<TemplateAssignment>(`/professor/template-assignments/${id}`, data);
    return response.data;
  }

  /**
   * Eliminar asignación de plantilla
   * DELETE /professor/template-assignments/{id}
   */
  async deleteTemplateAssignment(id: number): Promise<void> {
    await apiClient.delete(`/professor/template-assignments/${id}`);
  }

  /**
   * Obtener asignaciones de plantillas de un estudiante específico
   * GET /professor/students/{studentId}/template-assignments
   */
  async getStudentTemplateAssignments(studentId: number): Promise<{ data: TemplateAssignment[] }> {
    const response = await apiClient.get<{ data: TemplateAssignment[] }>(`/professor/students/${studentId}/template-assignments`);
    return response.data;
  }

  /**
   * Obtener progreso de un estudiante
   * GET /professor/students/{studentId}/progress
   */
  async getStudentProgress(studentId: number): Promise<{
    total_sessions: number;
    completed_sessions: number;
    pending_sessions: number;
    adherence_rate: number;
    recent_sessions: WorkoutSession[];
  }> {
    const response = await apiClient.get(`/professor/students/${studentId}/progress`);
    return response.data;
  }

  // ===== UTILIDADES Y HELPERS =====

  /**
   * Validar datos de asignación antes de enviar
   */
  validateAssignmentData(data: CreateProfessorStudentAssignmentRequest): { 
    valid: boolean; 
    errors: string[] 
  } {
    const errors: string[] = [];

    if (!data.professor_id) {
      errors.push('Debe seleccionar un profesor');
    }

    if (!data.student_id) {
      errors.push('Debe seleccionar un estudiante');
    }

    if (!data.start_date) {
      errors.push('Debe especificar una fecha de inicio');
    }

    // Validar que la fecha de inicio no sea en el pasado
    if (data.start_date && new Date(data.start_date) < new Date()) {
      errors.push('La fecha de inicio no puede ser en el pasado');
    }

    // Validar que la fecha de fin sea posterior a la de inicio
    if (data.end_date && data.start_date && new Date(data.end_date) <= new Date(data.start_date)) {
      errors.push('La fecha de fin debe ser posterior a la fecha de inicio');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validar datos de asignación de plantilla
   */
  validateTemplateAssignmentData(data: AssignTemplateRequest): { 
    valid: boolean; 
    errors: string[] 
  } {
    const errors: string[] = [];

    if (!data.professor_student_assignment_id) {
      errors.push('Debe especificar la asignación profesor-estudiante');
    }

    if (!data.daily_template_id) {
      errors.push('Debe seleccionar una plantilla');
    }

    if (!data.start_date) {
      errors.push('Debe especificar una fecha de inicio');
    }

    if (!data.frequency || data.frequency.length === 0) {
      errors.push('Debe seleccionar al menos un día de la semana');
    }

    // Validar que los días de la semana sean válidos (1-7)
    if (data.frequency && data.frequency.some(day => day < 1 || day > 7)) {
      errors.push('Los días de la semana deben estar entre 1 (Lunes) y 7 (Domingo)');
    }

    // Validar que la fecha de inicio no sea en el pasado
    if (data.start_date && new Date(data.start_date) < new Date()) {
      errors.push('La fecha de inicio no puede ser en el pasado');
    }

    // Validar que la fecha de fin sea posterior a la de inicio
    if (data.end_date && data.start_date && new Date(data.end_date) <= new Date(data.start_date)) {
      errors.push('La fecha de fin debe ser posterior a la fecha de inicio');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Formatear fecha para envío a API
   */
  formatDateForAPI(date: Date | string): string {
    if (typeof date === 'string') {
      return date;
    }
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  /**
   * Calcular estadísticas de adherencia
   */
  calculateAdherenceRate(completedSessions: number, totalSessions: number): number {
    if (totalSessions === 0) return 0;
    return Math.round((completedSessions / totalSessions) * 100);
  }

  /**
   * Obtener próximas sesiones de un estudiante
   */
  async getUpcomingSessions(studentId: number, days: number = 7): Promise<WorkoutSession[]> {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    
    const response = await apiClient.get<{ data: WorkoutSession[] }>(`/professor/students/${studentId}/sessions`, {
      params: {
        start_date: this.formatDateForAPI(new Date()),
        end_date: this.formatDateForAPI(endDate),
        status: 'pending'
      }
    });
    
    return response.data.data;
  }

  /**
   * Marcar sesión como completada
   */
  async completeSession(sessionId: number, notes?: string): Promise<WorkoutSession> {
    const response = await apiClient.put<WorkoutSession>(`/professor/sessions/${sessionId}/complete`, {
      student_notes: notes,
      completed_at: new Date().toISOString()
    });
    return response.data;
  }

  /**
   * Marcar sesión como omitida
   */
  async skipSession(sessionId: number, reason?: string): Promise<WorkoutSession> {
    const response = await apiClient.put<WorkoutSession>(`/professor/sessions/${sessionId}/skip`, {
      student_notes: reason
    });
    return response.data;
  }
}

// Instancia singleton del servicio
export const assignmentService = new AssignmentService();

// Export por defecto
export default assignmentService;
