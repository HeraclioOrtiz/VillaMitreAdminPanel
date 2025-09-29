/**
 * UserDetail - Componente de vista detallada de usuario optimizado
 * Muestra información completa del usuario con React.memo y optimizaciones
 */

import React, { memo, useMemo, useCallback, useState } from 'react';
import { Button } from '@/components/ui';
import UserStats from './UserStats';
import UserActions from './UserActions';
import type { User, UserActivity } from '@/types/user';
import {
  USER_ROLES,
  USER_STATUSES,
  MEMBERSHIP_STATUSES,
  TRAFFIC_LIGHT_STATUSES,
  GENDERS,
} from '@/types/user';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  IdentificationIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  EyeIcon,
  ClockIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

interface UserDetailProps {
  user: User;
  stats?: {
    total_workouts: number;
    current_streak: number;
    last_workout: string | null;
    next_payment_due: string | null;
    total_payments: number;
    membership_days_remaining: number;
    login_count: number;
    last_login: string | null;
  };
  activities?: UserActivity[];
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onAssignProfessor?: (user: User) => void;
  onResetPassword?: (user: User) => void;
  onToggleStatus?: (user: User) => void;
  onVerifyEmail?: (user: User) => void;
  onVerifyPhone?: (user: User) => void;
  loadingStates?: {
    [action: string]: boolean;
  };
  permissions?: {
    canEdit?: boolean;
    canDelete?: boolean;
    canAssignProfessor?: boolean;
    canResetPassword?: boolean;
    canToggleStatus?: boolean;
    canVerify?: boolean;
  };
  className?: string;
}

interface InfoSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

const InfoSection = memo<InfoSectionProps>(function InfoSection({
  title,
  icon: Icon,
  children,
  collapsible = false,
  defaultCollapsed = false,
}) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const handleToggle = useCallback(() => {
    if (collapsible) {
      setIsCollapsed(prev => !prev);
    }
  }, [collapsible]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div 
        className={`px-6 py-4 border-b border-gray-200 ${
          collapsible ? 'cursor-pointer hover:bg-gray-50' : ''
        }`}
        onClick={handleToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          {collapsible && (
            <button className="text-gray-400 hover:text-gray-600">
              {isCollapsed ? '+' : '−'}
            </button>
          )}
        </div>
      </div>
      
      {(!collapsible || !isCollapsed) && (
        <div className="px-6 py-4">
          {children}
        </div>
      )}
    </div>
  );
});

interface InfoItemProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  verified?: boolean;
  warning?: boolean;
}

const InfoItem = memo<InfoItemProps>(function InfoItem({
  label,
  value,
  icon: Icon,
  verified,
  warning,
}) {
  return (
    <div className="flex items-start justify-between py-2">
      <div className="flex items-center space-x-2">
        {Icon && <Icon className="h-4 w-4 text-gray-400 mt-0.5" />}
        <span className="text-sm font-medium text-gray-600">{label}:</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-900">{value}</span>
        {verified && <CheckCircleIcon className="h-4 w-4 text-green-500" />}
        {warning && <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />}
      </div>
    </div>
  );
});

const UserDetail = memo<UserDetailProps>(function UserDetail({
  user,
  stats,
  activities = [],
  onEdit,
  onDelete,
  onAssignProfessor,
  onResetPassword,
  onToggleStatus,
  onVerifyEmail,
  onVerifyPhone,
  loadingStates = {},
  permissions = {},
  className = '',
}) {
  // Memoizar configuración de rol
  const roleConfig = useMemo(() => 
    USER_ROLES.find(r => r.value === user.role)
  , [user.role]);

  // Memoizar configuración de estado
  const statusConfig = useMemo(() => 
    USER_STATUSES.find(s => s.value === user.status)
  , [user.status]);

  // Memoizar configuración de membresía
  const membershipConfig = useMemo(() => 
    MEMBERSHIP_STATUSES.find(s => s.value === user.membership_status)
  , [user.membership_status]);

  // Memoizar configuración de semáforo
  const trafficLightConfig = useMemo(() => 
    TRAFFIC_LIGHT_STATUSES.find(s => s.value === user.traffic_light_status)
  , [user.traffic_light_status]);

  // Memoizar configuración de género
  const genderConfig = useMemo(() => 
    GENDERS.find(g => g.value === user.gender)
  , [user.gender]);

  // Memoizar badge de rol
  const roleBadge = useMemo(() => {
    if (!roleConfig) return null;
    
    const colors = {
      super_admin: 'bg-purple-100 text-purple-800',
      admin: 'bg-blue-100 text-blue-800',
      professor: 'bg-green-100 text-green-800',
      member: 'bg-gray-100 text-gray-800',
      guest: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[user.role]}`}>
        {roleConfig.label}
      </span>
    );
  }, [roleConfig, user.role]);

  // Memoizar badge de estado
  const statusBadge = useMemo(() => {
    if (!statusConfig) return null;
    
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[user.status]}`}>
        {statusConfig.label}
      </span>
    );
  }, [statusConfig, user.status]);

  // Memoizar badge de semáforo
  const trafficLightBadge = useMemo(() => {
    if (!trafficLightConfig) return null;
    
    const colors = {
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
      gray: 'bg-gray-400',
    };

    return (
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${colors[user.traffic_light_status]}`} />
        <span className="text-sm text-gray-600">{trafficLightConfig.label}</span>
        <span className="text-xs text-gray-400">({trafficLightConfig.description})</span>
      </div>
    );
  }, [trafficLightConfig, user.traffic_light_status]);

  // Memoizar actividades recientes
  const recentActivities = useMemo(() => 
    activities.slice(0, 5)
  , [activities]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header con información básica y acciones */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {user.avatar_url ? (
                <img
                  className="h-20 w-20 rounded-full object-cover"
                  src={user.avatar_url}
                  alt={`${user.first_name} ${user.last_name}`}
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-gray-500" />
                </div>
              )}
            </div>

            {/* Información básica */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.first_name} {user.last_name}
                </h1>
                {roleBadge}
                {statusBadge}
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="h-4 w-4" />
                  <span>{user.email}</span>
                  {user.email_verified_at && <CheckCircleIcon className="h-4 w-4 text-green-500" />}
                </div>
                
                {user.phone && (
                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="h-4 w-4" />
                    <span>{user.phone}</span>
                    {user.phone_verified_at && <CheckCircleIcon className="h-4 w-4 text-green-500" />}
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Miembro desde {new Date(user.created_at).toLocaleDateString('es-ES')}</span>
                </div>
              </div>

              {/* Sistema de semáforo */}
              <div className="mt-3">
                {trafficLightBadge}
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex-shrink-0">
            <UserActions
              user={user}
              onEdit={onEdit}
              onDelete={onDelete}
              onAssignProfessor={onAssignProfessor}
              onResetPassword={onResetPassword}
              onToggleStatus={onToggleStatus}
              onVerifyEmail={onVerifyEmail}
              onVerifyPhone={onVerifyPhone}
              loadingStates={loadingStates}
              permissions={permissions}
              compact={false}
              showLabels={true}
            />
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <UserStats user={user} stats={stats} />

      {/* Información personal */}
      <InfoSection title="Información Personal" icon={IdentificationIcon}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div className="space-y-2">
            <InfoItem label="DNI" value={user.dni || 'No especificado'} />
            <InfoItem 
              label="Fecha de nacimiento" 
              value={user.birth_date ? new Date(user.birth_date).toLocaleDateString('es-ES') : 'No especificada'} 
            />
            <InfoItem 
              label="Género" 
              value={genderConfig?.label || 'No especificado'} 
            />
            <InfoItem 
              label="Dirección" 
              value={user.address || 'No especificada'} 
              icon={MapPinIcon}
            />
          </div>
          
          <div className="space-y-2">
            <InfoItem 
              label="Email verificado" 
              value={user.email_verified_at ? 'Sí' : 'No'} 
              verified={!!user.email_verified_at}
              warning={!user.email_verified_at}
            />
            <InfoItem 
              label="Teléfono verificado" 
              value={user.phone_verified_at ? 'Sí' : 'No'} 
              verified={!!user.phone_verified_at}
              warning={!user.phone_verified_at}
            />
            <InfoItem 
              label="Última actualización" 
              value={new Date(user.updated_at).toLocaleDateString('es-ES')} 
            />
          </div>
        </div>
      </InfoSection>

      {/* Información de membresía (solo para miembros) */}
      {user.is_member && (
        <InfoSection title="Información de Membresía" icon={UserGroupIcon}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div className="space-y-2">
              <InfoItem 
                label="Estado de membresía" 
                value={membershipConfig?.label || 'No especificado'} 
              />
              <InfoItem 
                label="Tipo de membresía" 
                value={user.membership_type || 'No especificado'} 
              />
              <InfoItem 
                label="Fecha de inicio" 
                value={user.membership_start_date ? new Date(user.membership_start_date).toLocaleDateString('es-ES') : 'No especificada'} 
              />
              <InfoItem 
                label="Fecha de vencimiento" 
                value={user.membership_end_date ? new Date(user.membership_end_date).toLocaleDateString('es-ES') : 'No especificada'} 
                warning={!!(user.membership_end_date && new Date(user.membership_end_date) < new Date())}
              />
            </div>
            
            <div className="space-y-2">
              <InfoItem 
                label="Profesor asignado" 
                value={user.assigned_professor ? `${user.assigned_professor.first_name} ${user.assigned_professor.last_name}` : 'Sin asignar'} 
              />
              <InfoItem 
                label="Último pago" 
                value={user.last_payment_date ? new Date(user.last_payment_date).toLocaleDateString('es-ES') : 'Sin pagos'} 
              />
            </div>
          </div>
        </InfoSection>
      )}

      {/* Información de emergencia y médica */}
      <InfoSection title="Información de Emergencia y Médica" icon={HeartIcon} collapsible defaultCollapsed>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div className="space-y-2">
            <InfoItem 
              label="Contacto de emergencia" 
              value={user.emergency_contact_name || 'No especificado'} 
            />
            <InfoItem 
              label="Teléfono de emergencia" 
              value={user.emergency_contact_phone || 'No especificado'} 
            />
          </div>
          
          <div className="space-y-2">
            <InfoItem 
              label="Notas médicas" 
              value={user.medical_notes || 'Sin notas médicas'} 
              warning={!!user.medical_notes}
            />
          </div>
        </div>
      </InfoSection>

      {/* Actividad reciente */}
      {recentActivities.length > 0 && (
        <InfoSection title="Actividad Reciente" icon={ClockIcon} collapsible>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.created_at).toLocaleString('es-ES')}
                  </p>
                </div>
              </div>
            ))}
            
            {activities.length > 5 && (
              <div className="text-center">
                <Button variant="ghost" size="sm">
                  Ver todas las actividades ({activities.length})
                </Button>
              </div>
            )}
          </div>
        </InfoSection>
      )}
    </div>
  );
});

export default UserDetail;
