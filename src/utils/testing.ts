/**
 * Utilidades para testing del sistema de asignaciones
 * Helpers y funciones para facilitar las pruebas con datos reales
 */

import { DEVELOPMENT_CONFIG } from '@/config/development';
import type { 
  ProfessorStudentAssignment, 
  TemplateAssignment, 
  AssignmentStatus,
  SessionStatus 
} from '@/types/assignment';
import type { User } from '@/types/user';

// ===== HELPERS DE DATOS DE PRUEBA =====

/**
 * Genera datos de prueba para asignaciones profesor-estudiante
 */
export const generateMockProfessorStudentAssignment = (
  overrides: Partial<ProfessorStudentAssignment> = {}
): ProfessorStudentAssignment => {
  const baseAssignment: ProfessorStudentAssignment = {
    id: Math.floor(Math.random() * 1000),
    professor_id: DEVELOPMENT_CONFIG.MOCK_DATA.TEST_PROFESSOR_ID,
    student_id: DEVELOPMENT_CONFIG.MOCK_DATA.TEST_STUDENT_IDS[0],
    start_date: new Date().toISOString().split('T')[0],
    end_date: undefined,
    status: 'active' as AssignmentStatus,
    admin_notes: 'Asignación de prueba generada automáticamente',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    professor: {
      id: DEVELOPMENT_CONFIG.MOCK_DATA.TEST_PROFESSOR_ID,
      name: 'Profesor de Prueba',
      email: 'profesor@test.com',
      is_professor: true,
      is_admin: false,
      is_super_admin: false,
    } as User,
    student: {
      id: DEVELOPMENT_CONFIG.MOCK_DATA.TEST_STUDENT_IDS[0],
      name: 'Estudiante de Prueba',
      email: 'estudiante@test.com',
      is_professor: false,
      is_admin: false,
      is_super_admin: false,
    } as User,
    active_templates: 2,
    progress_percentage: 75,
    template_assignments: [],
  };

  return { ...baseAssignment, ...overrides };
};

/**
 * Genera datos de prueba para asignaciones de plantillas
 */
export const generateMockTemplateAssignment = (
  overrides: Partial<TemplateAssignment> = {}
): TemplateAssignment => {
  const baseAssignment: TemplateAssignment = {
    id: Math.floor(Math.random() * 1000),
    professor_student_assignment_id: 1,
    daily_template_id: DEVELOPMENT_CONFIG.MOCK_DATA.TEST_TEMPLATE_IDS[0],
    start_date: new Date().toISOString().split('T')[0],
    end_date: undefined,
    week_days: [1, 3, 5], // Lun, Mie, Vie
    status: 'active' as AssignmentStatus,
    professor_notes: 'Plantilla de prueba',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    daily_template: {
      id: DEVELOPMENT_CONFIG.MOCK_DATA.TEST_TEMPLATE_IDS[0],
      name: 'Plantilla de Prueba',
      description: 'Descripción de prueba',
      exercises: [],
    } as any,
    total_sessions: 12,
    completed_sessions: 8,
    progress_percentage: 67,
  };

  return { ...baseAssignment, ...overrides };
};

// ===== HELPERS DE VALIDACIÓN =====

/**
 * Valida que una asignación tenga la estructura correcta
 */
export const validateAssignmentStructure = (assignment: any): boolean => {
  const requiredFields = [
    'id', 'professor_id', 'student_id', 'start_date', 
    'status', 'created_at', 'updated_at'
  ];
  
  return requiredFields.every(field => assignment.hasOwnProperty(field));
};

/**
 * Valida que los datos de respuesta de la API sean correctos
 */
export const validateApiResponse = (response: any, expectedFields: string[]): boolean => {
  if (!response || typeof response !== 'object') {
    return false;
  }
  
  return expectedFields.every(field => response.hasOwnProperty(field));
};

// ===== HELPERS DE ESTADO =====

/**
 * Obtiene el color CSS para un estado de asignación
 */
export const getStatusColor = (status: AssignmentStatus): string => {
  const colors = {
    active: 'text-green-600 bg-green-100',
    paused: 'text-yellow-600 bg-yellow-100',
    completed: 'text-blue-600 bg-blue-100',
    cancelled: 'text-red-600 bg-red-100',
  };
  
  return colors[status] || 'text-gray-600 bg-gray-100';
};

/**
 * Obtiene el texto legible para un estado
 */
export const getStatusText = (status: AssignmentStatus): string => {
  const texts = {
    active: 'Activa',
    paused: 'Pausada',
    completed: 'Completada',
    cancelled: 'Cancelada',
  };
  
  return texts[status] || 'Desconocido';
};

/**
 * Obtiene el color CSS para un estado de sesión
 */
export const getSessionStatusColor = (status: SessionStatus): string => {
  const colors = {
    pending: 'text-orange-600 bg-orange-100',
    completed: 'text-green-600 bg-green-100',
    skipped: 'text-gray-600 bg-gray-100',
  };
  
  return colors[status] || 'text-gray-600 bg-gray-100';
};

// ===== HELPERS DE FECHA =====

/**
 * Formatea una fecha para mostrar en la UI
 */
export const formatDisplayDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'Fecha inválida';
  }
};

/**
 * Calcula los días transcurridos desde una fecha
 */
export const getDaysFromDate = (dateString: string): number => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
};

// ===== HELPERS DE LOGGING =====

/**
 * Log específico para operaciones de asignaciones
 */
export const logAssignmentOperation = (
  operation: string, 
  data?: any, 
  success: boolean = true
) => {
  if (DEVELOPMENT_CONFIG.LOGGING.enableApiLogs) {
    const prefix = success ? '[ASSIGNMENT SUCCESS]' : '[ASSIGNMENT ERROR]';
    console.log(`${prefix} ${operation}`, data || '');
  }
};

/**
 * Log para performance de queries
 */
export const logQueryPerformance = (
  queryKey: string, 
  duration: number, 
  data?: any
) => {
  if (DEVELOPMENT_CONFIG.LOGGING.enableQueryLogs) {
    const isSlowQuery = duration > DEVELOPMENT_CONFIG.PERFORMANCE.slowQueryThreshold;
    const prefix = isSlowQuery ? '[SLOW QUERY]' : '[QUERY]';
    console.log(`${prefix} ${queryKey} (${duration}ms)`, data || '');
  }
};

// ===== HELPERS DE TESTING =====

/**
 * Simula un delay para testing de estados de carga
 */
export const simulateDelay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Genera un error simulado para testing
 */
export const simulateError = (message: string = 'Error simulado'): Error => {
  return new Error(message);
};

/**
 * Verifica si estamos en modo de testing
 */
export const isTestingMode = (): boolean => {
  return process.env.NODE_ENV === 'test' || 
         process.env.VITE_TESTING_MODE === 'true';
};

export default {
  generateMockProfessorStudentAssignment,
  generateMockTemplateAssignment,
  validateAssignmentStructure,
  validateApiResponse,
  getStatusColor,
  getStatusText,
  getSessionStatusColor,
  formatDisplayDate,
  getDaysFromDate,
  logAssignmentOperation,
  logQueryPerformance,
  simulateDelay,
  simulateError,
  isTestingMode,
};
