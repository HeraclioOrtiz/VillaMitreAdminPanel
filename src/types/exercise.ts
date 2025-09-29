// Tipos y interfaces para el módulo de ejercicios

export interface Exercise {
  id: number;
  name: string;
  description?: string;
  muscle_group: string; // Viene como string del backend
  movement_pattern?: string | null;
  equipment: string; // Viene como string del backend
  difficulty: string; // Puede ser 'beginner', 'intermediate', 'advanced' o valores en español
  tags: string[] | null; // Puede ser null
  instructions?: string | null;
  tempo?: string | null;
  video_url?: string;
  image_url?: string;
  estimated_duration?: number;
  popularity?: number;
  tips?: string;
  variations?: string[];
  force_type?: string;
  mechanics?: string;
  preparation?: string;
  created_at: string;
  updated_at: string;
}

export interface ExerciseFilters {
  search: string;
  muscle_group: string[];
  equipment: string[];
  difficulty: string[];
  tags: string[];
}

export interface ExerciseFormData {
  name: string;
  description?: string;
  muscle_group: string; // Cambiado a string para coincidir con backend
  movement_pattern?: string;
  equipment: string; // Cambiado a string para coincidir con backend
  difficulty: string; // Cambiado a string flexible para valores en español
  tags: string[];
  instructions: string;
  tempo?: string;
  video_url?: string;
  image_url?: string;
  estimated_duration?: number;
  tips?: string;
  variations?: string[];
  force_type?: string;
  mechanics?: string;
  preparation?: string;
}

export interface ExerciseListResponse {
  // Estructura estándar de paginación de Laravel
  data: Exercise[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
  path: string;
  from: number;
  to: number;
  links: Array<{
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
  }>;
  filters_summary?: {
    total_exercises: number;
    by_difficulty: Record<string, number>;
    by_muscle_group: Record<string, number>;
    by_equipment: Record<string, number>;
  };
}

export interface ExerciseQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  muscle_group?: string[];
  equipment?: string[];
  difficulty?: string[];
  tags?: string[];
  sort_by?: 'name' | 'created_at' | 'popularity';
  sort_direction?: 'asc' | 'desc';
}

// Opciones predefinidas para filtros
export const MUSCLE_GROUPS = [
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'legs',
  'glutes',
  'core',
  'cardio',
  'full-body'
] as const;

export const EQUIPMENT_TYPES = [
  'barbell',
  'dumbbell',
  'kettlebell',
  'cable',
  'machine',
  'bodyweight',
  'resistance-band',
  'medicine-ball',
  'suspension',
  'other'
] as const;

export const MOVEMENT_PATTERNS = [
  'push',
  'pull',
  'squat',
  'hinge',
  'lunge',
  'carry',
  'rotation',
  'gait',
  'isometric'
] as const;

export const DIFFICULTY_LEVELS = [
  'beginner',
  'intermediate',
  'advanced'
] as const;

export type MuscleGroup = typeof MUSCLE_GROUPS[number];
export type EquipmentType = typeof EQUIPMENT_TYPES[number];
export type MovementPattern = typeof MOVEMENT_PATTERNS[number];
export type DifficultyLevel = typeof DIFFICULTY_LEVELS[number];
