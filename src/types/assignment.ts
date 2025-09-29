/**
 * Tipos y interfaces para el sistema de asignaciones jerárquico
 * Basado en la guía del backend y documentación oficial
 */

import type { User } from './user';
import type { DailyTemplate } from './template';

// ===== ESTADOS Y TIPOS BÁSICOS =====

export type AssignmentStatus = 'active' | 'paused' | 'completed' | 'cancelled';
export type SessionStatus = 'pending' | 'completed' | 'skipped';
export type WeekDay = 1 | 2 | 3 | 4 | 5 | 6 | 7; // Lun=1, Dom=7

// ===== ENTIDADES PRINCIPALES =====

/**
 * Asignación Profesor-Estudiante (Nivel 1)
 * Un admin asigna un estudiante a un profesor
 */
export interface ProfessorStudentAssignment {
  id: number;
  professor_id: number;
  student_id: number;
  start_date: string;
  end_date?: string;
  status: AssignmentStatus;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  
  // Relaciones populadas
  professor: User;
  student: User;
  
  // Datos calculados (opcional)
  active_templates?: number;
  progress_percentage?: number;
  template_assignments?: TemplateAssignment[];
}

/**
 * Asignación Plantilla-Estudiante (Nivel 2)  
 * Un profesor asigna una plantilla a su estudiante
 */
export interface TemplateAssignment {
  id: number;
  professor_student_assignment_id: number;
  daily_template_id: number;
  start_date: string;
  end_date?: string;
  frequency: WeekDay[]; // [1,3,5] = Lun, Mie, Vie
  status: AssignmentStatus;
  professor_notes?: string;
  created_at: string;
  updated_at: string;
  
  // Relaciones populadas
  professor_student_assignment: ProfessorStudentAssignment;
  daily_template: DailyTemplate;
  sessions?: WorkoutSession[];
}

/**
 * Sesión de Entrenamiento (Nivel 3)
 * Sesiones automáticas generadas por el sistema
 */
export interface WorkoutSession {
  id: number;
  template_assignment_id: number;
  scheduled_date: string;
  completed_at?: string;
  status: SessionStatus;
  student_notes?: string;
  professor_feedback?: string;
  created_at: string;
  updated_at: string;
  
  // Relaciones populadas
  template_assignment: TemplateAssignment;
}

// ===== ESTADÍSTICAS Y DASHBOARDS =====

/**
 * Estadísticas para el dashboard de administrador
 */
export interface AdminAssignmentStats {
  total_professors: number;
  total_students: number;
  active_assignments: number;
  unassigned_students: number;
  assignment_rate: number;
}

/**
 * Estadísticas para el dashboard de profesor
 */
export interface ProfessorStats {
  total_students: number;
  active_template_assignments: number;
  completed_sessions: number;
  pending_sessions: number;
  adherence_rate: number;
}

/**
 * Sesión del día para profesor
 */
export interface TodaySession {
  id: number;
  student_name: string;
  template_title: string;
  scheduled_date: string;
  status: SessionStatus;
  student: User;
  template_assignment: TemplateAssignment;
}

/**
 * Calendario semanal para profesor
 */
export interface WeeklyCalendarSession {
  id: number;
  student_name: string;
  template_title: string;
  scheduled_date: string;
  status: SessionStatus;
  day_of_week: WeekDay;
}

export interface WeeklyCalendar {
  week_start: string;
  week_end: string;
  sessions: WeeklyCalendarSession[];
}

// ===== REQUESTS PARA API =====

/**
 * Crear asignación profesor-estudiante (Admin)
 */
export interface CreateProfessorStudentAssignmentRequest {
  professor_id: number;
  student_id: number;
  start_date: string;
  end_date?: string;
  admin_notes?: string;
}

/**
 * Actualizar asignación profesor-estudiante (Admin)
 */
export interface UpdateProfessorStudentAssignmentRequest {
  professor_id?: number;
  student_id?: number;
  start_date?: string;
  end_date?: string;
  status?: AssignmentStatus;
  admin_notes?: string;
}

/**
 * Asignar plantilla a estudiante (Profesor)
 */
export interface AssignTemplateRequest {
  professor_student_assignment_id: number;
  daily_template_id: number;
  start_date: string;
  end_date?: string;
  frequency: WeekDay[]; // [1,3,5] = Lun, Mie, Vie
  professor_notes?: string;
}

/**
 * Actualizar asignación de plantilla (Profesor)
 */
export interface UpdateTemplateAssignmentRequest {
  daily_template_id?: number;
  start_date?: string;
  end_date?: string;
  frequency?: WeekDay[];
  status?: AssignmentStatus;
  professor_notes?: string;
}

// ===== FILTROS Y QUERIES =====

/**
 * Filtros para lista de asignaciones
 */
export interface AssignmentFilters {
  professor_id?: number;
  student_id?: number;
  status?: AssignmentStatus;
  start_date_from?: string;
  start_date_to?: string;
  search?: string;
}

/**
 * Parámetros de query con paginación
 */
export interface AssignmentQueryParams extends AssignmentFilters {
  page?: number;
  per_page?: number;
  sort_by?: 'created_at' | 'start_date' | 'student_name' | 'professor_name';
  sort_direction?: 'asc' | 'desc';
}

// ===== RESPONSES DE API =====

/**
 * Respuesta de lista de asignaciones
 */
export interface AssignmentListResponse {
  data: ProfessorStudentAssignment[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

/**
 * Respuesta de estudiantes sin asignar
 */
export interface UnassignedStudentsResponse {
  data: User[];
  count: number;
}

/**
 * Respuesta de estudiantes del profesor
 */
export interface ProfessorStudentsResponse {
  data: ProfessorStudentAssignment[];
  current_page: number;
  total: number;
}

/**
 * Respuesta de sesiones del día
 */
export interface TodaySessionsResponse {
  data: TodaySession[];
}

// ===== CONSTANTES PARA UI =====

export const ASSIGNMENT_STATUSES = [
  { value: 'active', label: 'Activa', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' },
  { value: 'paused', label: 'Pausada', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
  { value: 'completed', label: 'Completada', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
  { value: 'cancelled', label: 'Cancelada', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800' },
] as const;

export const SESSION_STATUSES = [
  { value: 'pending', label: 'Pendiente', color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-800' },
  { value: 'completed', label: 'Completada', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' },
  { value: 'skipped', label: 'Omitida', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
] as const;

export const WEEK_DAYS = [
  { value: 1, label: 'Lunes', short: 'L' },
  { value: 2, label: 'Martes', short: 'M' },
  { value: 3, label: 'Miércoles', short: 'X' },
  { value: 4, label: 'Jueves', short: 'J' },
  { value: 5, label: 'Viernes', short: 'V' },
  { value: 6, label: 'Sábado', short: 'S' },
  { value: 7, label: 'Domingo', short: 'D' },
] as const;

// ===== UTILIDADES =====

/**
 * Obtener configuración de color para estado de asignación
 */
export const getAssignmentStatusConfig = (status: AssignmentStatus) => {
  return ASSIGNMENT_STATUSES.find(s => s.value === status) || ASSIGNMENT_STATUSES[0];
};

/**
 * Obtener configuración de color para estado de sesión
 */
export const getSessionStatusConfig = (status: SessionStatus) => {
  return SESSION_STATUSES.find(s => s.value === status) || SESSION_STATUSES[0];
};

/**
 * Obtener label de día de la semana
 */
export const getWeekDayLabel = (day: WeekDay): string => {
  const dayConfig = WEEK_DAYS.find(d => d.value === day);
  return dayConfig?.label || '';
};

/**
 * Obtener short label de día de la semana
 */
export const getWeekDayShort = (day: WeekDay): string => {
  const dayConfig = WEEK_DAYS.find(d => d.value === day);
  return dayConfig?.short || '';
};

/**
 * Formatear array de días a string legible
 */
export const formatFrequency = (frequency: WeekDay[]): string => {
  if (!frequency || frequency.length === 0) return 'Sin frecuencia';
  
  const sortedDays = [...frequency].sort();
  const dayLabels = sortedDays.map(day => getWeekDayShort(day));
  
  return dayLabels.join(', ');
};
