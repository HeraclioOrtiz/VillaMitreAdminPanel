/**
 * Tipos y interfaces para la gestión de usuarios
 * Sistema completo para administración de usuarios del Villa Mitre Admin Panel
 */

// Tipos base para usuarios
export type UserRole = 'super_admin' | 'admin' | 'professor' | 'member' | 'guest';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';
export type MembershipStatus = 'active' | 'expired' | 'suspended' | 'pending' | 'cancelled';
export type TrafficLightStatus = 'green' | 'yellow' | 'red' | 'gray';
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

/**
 * Interface principal del usuario
 */
export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string; // Campo del API
  dni?: string;
  phone?: string;
  birth_date?: string;
  gender?: Gender;
  avatar_url?: string;
  foto_url?: string; // Campo del API
  
  // Campos adicionales del API
  nombre?: string;
  apellido?: string;
  nacionalidad?: string;
  nacimiento?: string;
  domicilio?: string;
  localidad?: string;
  telefono?: string;
  celular?: string;
  categoria?: string;
  socio_id?: string;
  barcode?: string;
  estado_socio?: string;
  api_updated_at?: string;
  socio_n?: string;
  saldo?: string;
  semaforo?: number;
  tipo_dni?: string;
  r1?: string;
  r2?: string;
  tutor?: string;
  observaciones?: string;
  deuda?: string;
  descuento?: string;
  alta?: string;
  suspendido?: boolean;
  facturado?: boolean;
  fecha_baja?: string;
  monto_descuento?: string;
  update_ts?: string;
  validmail_st?: boolean;
  validmail_ts?: string;
  user_type?: string;
  type_label?: string;
  account_status?: string;
  professor_since?: string;
  session_timeout?: number;
  allowed_ips?: string;
  promotion_status?: string;
  promoted_at?: string;
  admin_notes?: string;
  permissions?: string[];
  created_at?: string;
  updated_at?: string;
  email_verified_at?: string;
  
  // Roles y permisos
  role: UserRole;
  is_super_admin: boolean;
  is_admin: boolean;
  is_professor: boolean;
  is_member: boolean;
  
  // Estados
  status?: UserStatus;
  phone_verified_at?: string;
  
  // Información de membresía
  membership_status?: MembershipStatus;
  membership_start_date?: string;
  membership_end_date?: string;
  membership_type?: string;
  
  // Sistema de semáforo (para seguimiento de actividad)
  traffic_light_status?: TrafficLightStatus;
  last_activity_date?: string;
  last_payment_date?: string;
  
  // Información adicional
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_notes?: string;
  
  // Profesor asignado (para miembros)
  assigned_professor_id?: number;
  assigned_professor?: User;
  
  // Metadatos (ya definidos arriba, removemos duplicados)
  deleted_at?: string;
}

/**
 * Datos para crear un usuario
 */
export interface CreateUserData {
  email: string;
  first_name: string;
  last_name: string;
  dni?: string;
  phone?: string;
  birth_date?: string;
  gender?: Gender;
  role: UserRole;
  password?: string; // Opcional, se puede generar automáticamente
  
  // Información de membresía
  membership_type?: string;
  membership_start_date?: string;
  membership_end_date?: string;
  
  // Información adicional
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_notes?: string;
  
  // Profesor asignado
  assigned_professor_id?: number;
}

/**
 * Datos para actualizar un usuario
 */
export interface UpdateUserData {
  email?: string;
  first_name?: string;
  last_name?: string;
  dni?: string;
  phone?: string;
  birth_date?: string;
  gender?: Gender;
  role?: UserRole;
  status?: UserStatus;
  
  // Información de membresía
  membership_status?: MembershipStatus;
  membership_type?: string;
  membership_start_date?: string;
  membership_end_date?: string;
  
  // Sistema de semáforo
  traffic_light_status?: TrafficLightStatus;
  
  // Información adicional
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_notes?: string;
  
  // Profesor asignado
  assigned_professor_id?: number;
}

/**
 * Filtros para búsqueda de usuarios
 */
export interface UserFilters {
  search?: string; // Búsqueda por nombre, email, DNI
  role?: UserRole[];
  status?: UserStatus[];
  membership_status?: MembershipStatus[];
  traffic_light_status?: TrafficLightStatus[];
  assigned_professor_id?: number;
  gender?: Gender[];
  
  // Filtros de fecha
  created_from?: string;
  created_to?: string;
  membership_expires_from?: string;
  membership_expires_to?: string;
  last_activity_from?: string;
  last_activity_to?: string;
  
  // Filtros booleanos
  has_phone?: boolean;
  has_emergency_contact?: boolean;
  has_medical_notes?: boolean;
  email_verified?: boolean;
  phone_verified?: boolean;
}

/**
 * Parámetros para consultas de usuarios
 */
export interface UserQueryParams extends UserFilters {
  page?: number;
  per_page?: number;
  sort_by?: 'name' | 'email' | 'created_at' | 'last_activity' | 'membership_end_date';
  sort_direction?: 'asc' | 'desc';
}

/**
 * Respuesta de la API para lista de usuarios
 */
export interface UserListResponse {
  data: User[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
  links: {
    first: string;
    last: string;
    prev?: string;
    next?: string;
  };
}

/**
 * Estadísticas de usuarios
 */
export interface UserStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  suspended_users: number;
  pending_users: number;
  
  // Por rol
  super_admins: number;
  admins: number;
  professors: number;
  members: number;
  guests: number;
  
  // Por estado de membresía
  active_memberships: number;
  expired_memberships: number;
  suspended_memberships: number;
  pending_memberships: number;
  cancelled_memberships: number;
  
  // Sistema de semáforo
  green_status: number;
  yellow_status: number;
  red_status: number;
  gray_status: number;
  
  // Verificaciones
  email_verified: number;
  phone_verified: number;
  
  // Fechas
  new_users_this_month: number;
  expiring_memberships_this_month: number;
}

/**
 * Datos para asignar profesor
 */
export interface AssignProfessorData {
  user_id: number;
  professor_id: number;
  notes?: string;
}

/**
 * Datos para resetear contraseña
 */
export interface ResetPasswordData {
  user_id: number;
  new_password?: string; // Opcional, se puede generar automáticamente
  send_email?: boolean; // Enviar por email al usuario
}

/**
 * Respuesta de reseteo de contraseña
 */
export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  temporary_password?: string; // Solo si se generó automáticamente
}

/**
 * Datos para cambio de estado masivo
 */
export interface BulkStatusChangeData {
  user_ids: number[];
  status: UserStatus;
  reason?: string;
}

/**
 * Datos para exportación de usuarios
 */
export interface ExportUsersData extends UserFilters {
  format: 'csv' | 'xlsx' | 'pdf';
  include_fields?: string[];
  include_sensitive_data?: boolean;
}

/**
 * Actividad del usuario
 */
export interface UserActivity {
  id: number;
  user_id: number;
  activity_type: 'login' | 'logout' | 'profile_update' | 'password_change' | 'membership_update' | 'payment' | 'gym_checkin' | 'gym_checkout';
  description: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

/**
 * Respuesta de actividades del usuario
 */
export interface UserActivityResponse {
  data: UserActivity[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

// Constantes para opciones de filtros
export const USER_ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: 'super_admin', label: 'Super Administrador', description: 'Acceso completo al sistema' },
  { value: 'admin', label: 'Administrador', description: 'Gestión de usuarios y configuración' },
  { value: 'professor', label: 'Profesor', description: 'Gestión de entrenamientos y miembros' },
  { value: 'member', label: 'Miembro', description: 'Usuario con membresía activa' },
  { value: 'guest', label: 'Invitado', description: 'Acceso limitado temporal' },
];

export const USER_STATUSES: { value: UserStatus; label: string; color: string }[] = [
  { value: 'active', label: 'Activo', color: 'green' },
  { value: 'inactive', label: 'Inactivo', color: 'gray' },
  { value: 'suspended', label: 'Suspendido', color: 'red' },
  { value: 'pending', label: 'Pendiente', color: 'yellow' },
];

export const MEMBERSHIP_STATUSES: { value: MembershipStatus; label: string; color: string }[] = [
  { value: 'active', label: 'Activa', color: 'green' },
  { value: 'expired', label: 'Vencida', color: 'red' },
  { value: 'suspended', label: 'Suspendida', color: 'orange' },
  { value: 'pending', label: 'Pendiente', color: 'yellow' },
  { value: 'cancelled', label: 'Cancelada', color: 'gray' },
];

export const TRAFFIC_LIGHT_STATUSES: { value: TrafficLightStatus; label: string; color: string; description: string }[] = [
  { value: 'green', label: 'Verde', color: 'green', description: 'Usuario activo y al día' },
  { value: 'yellow', label: 'Amarillo', color: 'yellow', description: 'Requiere atención' },
  { value: 'red', label: 'Rojo', color: 'red', description: 'Requiere acción inmediata' },
  { value: 'gray', label: 'Gris', color: 'gray', description: 'Sin actividad reciente' },
];

export const GENDERS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Femenino' },
  { value: 'other', label: 'Otro' },
  { value: 'prefer_not_to_say', label: 'Prefiero no decir' },
];

// Tipos para formularios
export type UserFormData = CreateUserData;
export type UserEditFormData = UpdateUserData;

// Tipos para validación
export interface UserValidationError {
  field: keyof (CreateUserData | UpdateUserData);
  message: string;
  code: string;
}

export interface UserValidationErrors {
  errors: UserValidationError[];
  message: string;
}
