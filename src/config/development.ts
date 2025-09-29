/**
 * Configuración para entorno de desarrollo
 * Datos y configuraciones específicas para testing del sistema de asignaciones
 */

export const DEVELOPMENT_CONFIG = {
  // Datos disponibles según documentación del backend
  AVAILABLE_DATA: {
    professors: 2,
    students: 19,
    templates: 20,
    exercises: 68,
  },

  // URLs de testing y documentación
  BACKEND_DOCS: {
    swagger: '/docs/api',
    postman: '/docs/postman-collection.json',
    guide: '/docs/frontend/GUIA_FRONTEND_ASIGNACIONES.md',
  },

  // Configuración de API para desarrollo
  API_CONFIG: {
    timeout: 10000, // 10 segundos para desarrollo
    retries: 3,
    baseURL: process.env.VITE_API_URL || 'http://localhost:8000/api',
  },

  // Configuración de React Query para desarrollo
  QUERY_CONFIG: {
    staleTime: 1000 * 60 * 5, // 5 minutos
    cacheTime: 1000 * 60 * 10, // 10 minutos
    refetchOnWindowFocus: true, // Útil en desarrollo
    retry: 2,
  },

  // Datos de prueba para desarrollo local
  MOCK_DATA: {
    // IDs de usuarios de prueba (ajustar según seeder del backend)
    TEST_PROFESSOR_ID: 1,
    TEST_STUDENT_IDS: [3, 4, 5, 6, 7], // Primeros 5 estudiantes
    TEST_TEMPLATE_IDS: [1, 2, 3, 4, 5], // Primeras 5 plantillas
  },

  // Configuración de logging para desarrollo
  LOGGING: {
    enableApiLogs: true,
    enableQueryLogs: true,
    enableErrorReporting: true,
  },

  // Configuración de UI para desarrollo
  UI_CONFIG: {
    showDevTools: true,
    enableAnimations: true,
    showLoadingStates: true,
    enableToasts: true,
  },

  // Configuración de performance para desarrollo
  PERFORMANCE: {
    enableProfiling: false,
    logSlowQueries: true,
    slowQueryThreshold: 1000, // 1 segundo
  },
};

// Helper para verificar si estamos en desarrollo
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

// Helper para obtener configuración de desarrollo
export const getDevConfig = () => {
  return isDevelopment() ? DEVELOPMENT_CONFIG : null;
};

// Helper para logging en desarrollo
export const devLog = (message: string, data?: any) => {
  if (isDevelopment() && DEVELOPMENT_CONFIG.LOGGING.enableApiLogs) {
    console.log(`[DEV] ${message}`, data || '');
  }
};

// Helper para logging de errores en desarrollo
export const devError = (message: string, error?: any) => {
  if (isDevelopment() && DEVELOPMENT_CONFIG.LOGGING.enableErrorReporting) {
    console.error(`[DEV ERROR] ${message}`, error || '');
  }
};

export default DEVELOPMENT_CONFIG;
