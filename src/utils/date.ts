/**
 * Utilidades para manejo de fechas
 * Funciones comunes para formateo y manipulación de fechas
 */

/**
 * Formatea una fecha en formato legible
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formatea una fecha con hora
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formatea solo la hora
 */
export function formatTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Calcula la distancia relativa a ahora
 */
export function formatDistanceToNow(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInMinutes < 1) {
    return 'hace un momento';
  } else if (diffInMinutes < 60) {
    return `hace ${diffInMinutes} minuto${diffInMinutes !== 1 ? 's' : ''}`;
  } else if (diffInHours < 24) {
    return `hace ${diffInHours} hora${diffInHours !== 1 ? 's' : ''}`;
  } else if (diffInDays < 7) {
    return `hace ${diffInDays} día${diffInDays !== 1 ? 's' : ''}`;
  } else if (diffInWeeks < 4) {
    return `hace ${diffInWeeks} semana${diffInWeeks !== 1 ? 's' : ''}`;
  } else if (diffInMonths < 12) {
    return `hace ${diffInMonths} mes${diffInMonths !== 1 ? 'es' : ''}`;
  } else {
    return `hace ${diffInYears} año${diffInYears !== 1 ? 's' : ''}`;
  }
}

/**
 * Añade días a una fecha
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Obtiene el inicio de la semana (lunes)
 */
export function startOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para que lunes sea el primer día
  return new Date(result.setDate(diff));
}

/**
 * Verifica si dos fechas son el mismo día
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Verifica si una fecha es hoy
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Verifica si una fecha es del pasado
 */
export function isPast(date: Date): boolean {
  const now = new Date();
  return date < now;
}

/**
 * Verifica si una fecha es del futuro
 */
export function isFuture(date: Date): boolean {
  const now = new Date();
  return date > now;
}

/**
 * Obtiene el rango de fechas de una semana
 */
export function getWeekRange(startDate: Date): { start: Date; end: Date } {
  const start = startOfWeek(startDate);
  const end = addDays(start, 6);
  return { start, end };
}

/**
 * Convierte una fecha a string ISO (YYYY-MM-DD)
 */
export function toISODateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Parsea una fecha desde string ISO
 */
export function fromISODateString(dateString: string): Date {
  return new Date(dateString + 'T00:00:00.000Z');
}
