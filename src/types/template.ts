// Tipos y interfaces para el módulo de plantillas diarias

import type { Exercise } from './exercise';

// ✅ NUEVA ESTRUCTURA: Series según backend real
export interface TemplateSet {
  set_number: number;
  reps_min: number;
  reps_max?: number;
  weight?: number;
  duration?: number; // en segundos para ejercicios de tiempo
  distance?: number; // en metros para ejercicios de distancia
  rest_seconds: number; // tiempo de descanso en segundos
  notes?: string;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  tempo?: string; // ej: "2-1-2-1" (excéntrico-pausa-concéntrico-pausa)
}

// ✅ NUEVA ESTRUCTURA: Ejercicio según backend real
export interface TemplateExercise {
  id: number;
  exercise_id: number;
  display_order: number; // Orden dentro de la plantilla (backend usa display_order)
  exercise: Exercise; // Información completa del ejercicio (siempre incluida)
  sets: TemplateSet[]; // Series configuradas
  super_set_group?: string; // Agrupación para superseries
  rest_between_sets?: number; // Descanso entre series en segundos
  notes?: string;
  modifications?: string; // Modificaciones específicas para este ejercicio
}

// ✅ COMPATIBILIDAD: Mantener SetConfiguration para formularios
export interface SetConfiguration {
  id?: string;
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
  rest_time?: number;
  notes?: string;
  rpe?: number;
  tempo?: string;
}

// ✅ NUEVA ESTRUCTURA: Plantilla según backend real
export interface DailyTemplate {
  id: number;
  title: string; // Backend usa 'title' no 'name'
  description?: string;
  
  // ✅ Configuración según backend real
  estimated_duration_min: number; // Backend usa 'estimated_duration_min'
  level: 'beginner' | 'intermediate' | 'advanced'; // Backend usa 'level' no 'difficulty'
  goal: 'strength' | 'hypertrophy' | 'endurance' | 'power' | 'flexibility' | 'cardio' | 'general'; // Backend usa 'goal'
  tags: string[]; // Backend usa 'tags' array
  
  // ✅ COMPATIBILIDAD: Propiedades opcionales para frontend
  name?: string; // Alias para title
  difficulty?: 'beginner' | 'intermediate' | 'advanced'; // Alias para level
  primary_goal?: string; // Alias para goal
  target_muscle_groups?: string[]; // Calculado desde ejercicios
  equipment_needed?: string[]; // Calculado desde ejercicios
  secondary_goals?: string[];
  intensity_level?: 'low' | 'moderate' | 'high' | 'very_high';
  
  // Ejercicios y estructura
  exercises: TemplateExercise[];
  warm_up_notes?: string;
  cool_down_notes?: string;
  
  // Metadatos
  is_public?: boolean; // Si otros profesores pueden verla
  is_favorite?: boolean; // Marcada como favorita por el usuario
  popularity_score?: number; // Puntuación de popularidad
  usage_count?: number; // Veces que se ha usado
  
  // Configuración avanzada
  progression_notes?: string; // Notas sobre progresión
  variations?: string[]; // Variaciones de la plantilla
  prerequisites?: string[]; // Prerequisitos para usar la plantilla
  contraindications?: string[]; // Contraindicaciones
  
  // Fechas y autoría
  created_by: number; // ID del profesor que la creó
  created_by_name?: string; // Nombre del profesor (populated)
  created_at: string;
  updated_at: string;
  last_used_at?: string;
}

// Filtros para búsqueda de plantillas
export interface TemplateFilters {
  search?: string;
  difficulty?: string[];
  primary_goal?: string[];
  target_muscle_groups?: string[];
  equipment_needed?: string[];
  tags?: string[];
  duration_min?: number;
  duration_max?: number;
  intensity_level?: string[];
  is_public?: boolean;
  is_favorite?: boolean;
  created_by?: number;
}

// Datos para crear/editar plantilla
export interface TemplateFormData {
  name: string;
  description?: string;
  estimated_duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  target_muscle_groups: string[];
  equipment_needed: string[];
  primary_goal: 'strength' | 'hypertrophy' | 'endurance' | 'power' | 'flexibility' | 'cardio';
  secondary_goals?: string[];
  intensity_level: 'low' | 'moderate' | 'high' | 'very_high';
  exercises: Omit<TemplateExercise, 'id'>[];
  warm_up_notes?: string;
  cool_down_notes?: string;
  tags: string[];
  is_public: boolean;
  progression_notes?: string;
  variations?: string[];
  prerequisites?: string[];
  contraindications?: string[];
}

// Respuesta de la API para lista de plantillas
export interface TemplateListResponse {
  data: DailyTemplate[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
  filters_summary?: {
    total_templates: number;
    by_difficulty: Record<string, number>;
    by_goal: Record<string, number>;
    by_muscle_group: Record<string, number>;
    by_intensity: Record<string, number>;
  };
}

// Parámetros para queries de plantillas
export interface TemplateQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  difficulty?: string[];
  primary_goal?: string[];
  target_muscle_groups?: string[];
  equipment_needed?: string[];
  tags?: string[];
  duration_min?: number;
  duration_max?: number;
  intensity_level?: string[];
  is_public?: boolean;
  is_favorite?: boolean;
  created_by?: number;
  sort_by?: 'name' | 'created_at' | 'popularity_score' | 'usage_count' | 'last_used_at';
  sort_direction?: 'asc' | 'desc';
}

// Estadísticas de plantilla
export interface TemplateStats {
  total_templates: number;
  public_templates: number;
  favorite_templates: number;
  most_used_template: DailyTemplate | null;
  recent_templates: DailyTemplate[];
  popular_templates: DailyTemplate[];
  by_difficulty: Record<string, number>;
  by_goal: Record<string, number>;
  by_muscle_group: Record<string, number>;
}

// Opciones predefinidas para filtros y formularios
export const PRIMARY_GOALS = [
  { value: 'strength', label: 'Fuerza' },
  { value: 'hypertrophy', label: 'Hipertrofia' },
  { value: 'endurance', label: 'Resistencia' },
  { value: 'power', label: 'Potencia' },
  { value: 'flexibility', label: 'Flexibilidad' },
  { value: 'cardio', label: 'Cardiovascular' },
] as const;

export const INTENSITY_LEVELS = [
  { value: 'low', label: 'Baja' },
  { value: 'moderate', label: 'Moderada' },
  { value: 'high', label: 'Alta' },
  { value: 'very_high', label: 'Muy Alta' },
] as const;

export const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Principiante' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' },
] as const;

export const MUSCLE_GROUPS = [
  { value: 'chest', label: 'Pecho', description: 'Músculos pectorales' },
  { value: 'back', label: 'Espalda', description: 'Dorsales, romboides, trapecio' },
  { value: 'shoulders', label: 'Hombros', description: 'Deltoides anterior, medio y posterior' },
  { value: 'arms', label: 'Brazos', description: 'Bíceps y tríceps' },
  { value: 'legs', label: 'Piernas', description: 'Cuádriceps, isquiotibiales, pantorrillas' },
  { value: 'glutes', label: 'Glúteos', description: 'Glúteo mayor, medio y menor' },
  { value: 'core', label: 'Core', description: 'Abdominales y músculos estabilizadores' },
  { value: 'full_body', label: 'Cuerpo Completo', description: 'Ejercicios multiarticulares' },
] as const;

export const EQUIPMENT_OPTIONS = [
  { value: 'barbell', label: 'Barra', description: 'Barra olímpica y discos' },
  { value: 'dumbbells', label: 'Mancuernas', description: 'Mancuernas ajustables o fijas' },
  { value: 'kettlebells', label: 'Kettlebells', description: 'Pesas rusas' },
  { value: 'machines', label: 'Máquinas', description: 'Máquinas de gimnasio' },
  { value: 'cables', label: 'Poleas', description: 'Sistema de poleas y cables' },
  { value: 'bodyweight', label: 'Peso Corporal', description: 'Sin equipamiento adicional' },
  { value: 'bands', label: 'Bandas', description: 'Bandas elásticas de resistencia' },
  { value: 'bench', label: 'Banco', description: 'Banco plano o inclinado' },
  { value: 'pull_up_bar', label: 'Barra de Dominadas', description: 'Barra fija para dominadas' },
  { value: 'medicine_ball', label: 'Pelota Medicinal', description: 'Balón con peso' },
] as const;

// Plantilla de ejemplo/template para crear nuevas plantillas
export const DEFAULT_TEMPLATE: Partial<TemplateFormData> = {
  name: '',
  description: '',
  estimated_duration: 60,
  difficulty: 'intermediate',
  target_muscle_groups: [],
  equipment_needed: [],
  primary_goal: 'hypertrophy',
  secondary_goals: [],
  intensity_level: 'moderate',
  exercises: [],
  warm_up_notes: '',
  cool_down_notes: '',
  tags: [],
  is_public: false,
  progression_notes: '',
  variations: [],
  prerequisites: [],
  contraindications: [],
};
