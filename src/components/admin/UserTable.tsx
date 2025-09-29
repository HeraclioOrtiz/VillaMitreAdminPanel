/**
 * UserTable - Tabla específica para usuarios con optimizaciones de performance
 * Implementa DataTable con React.memo, useMemo y useCallback
 */

import React, { memo, useMemo, useCallback } from 'react';
import { DataTable } from '@/components/ui';
import UserActions from './UserActions';
import type { User, UserQueryParams } from '@/types/user';
import {
  USER_ROLES,
  USER_STATUSES,
  MEMBERSHIP_STATUSES,
  TRAFFIC_LIGHT_STATUSES,
} from '@/types/user';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface UserTableProps {
  users: User[];
  loading?: boolean;
  selectedUsers?: number[];
  onSelectionChange?: (selectedIds: number[]) => void;
  onSort?: (params: { sort_by: string; sort_direction: 'asc' | 'desc' }) => void;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  
  // Acciones
  onView?: (user: User) => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onDuplicate?: (user: User) => void;
  onAssignProfessor?: (user: User) => void;
  onResetPassword?: (user: User) => void;
  onToggleStatus?: (user: User) => void;
  onVerifyEmail?: (user: User) => void;
  onVerifyPhone?: (user: User) => void;
  
  // Estados de carga
  loadingStates?: {
    [userId: number]: {
      [action: string]: boolean;
    };
  };
  
  // Configuración
  compact?: boolean;
  showSelection?: boolean;
  permissions?: {
    canView?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
    canDuplicate?: boolean;
    canAssignProfessor?: boolean;
    canResetPassword?: boolean;
    canToggleStatus?: boolean;
    canVerify?: boolean;
  };
}

const UserTable = memo<UserTableProps>(function UserTable({
  users,
  loading = false,
  selectedUsers = [],
  onSelectionChange,
  onSort,
  sortBy,
  sortDirection,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onAssignProfessor,
  onResetPassword,
  onToggleStatus,
  onVerifyEmail,
  onVerifyPhone,
  loadingStates = {},
  compact = false,
  showSelection = true,
  permissions = {},
}) {
  // Memoizar función para obtener badge de rol
  const getRoleBadge = useCallback((role: User['role']) => {
    const roleConfig = USER_ROLES.find(r => r.value === role);
    if (!roleConfig) return null;

    const colors = {
      super_admin: 'bg-purple-100 text-purple-800',
      admin: 'bg-blue-100 text-blue-800',
      professor: 'bg-green-100 text-green-800',
      member: 'bg-gray-100 text-gray-800',
      guest: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[role]}`}>
        {roleConfig.label}
      </span>
    );
  }, []);

  // Memoizar función para obtener badge de estado
  const getStatusBadge = useCallback((status: User['status']) => {
    const statusConfig = USER_STATUSES.find(s => s.value === status);
    if (!statusConfig) return null;

    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {statusConfig.label}
      </span>
    );
  }, []);

  // Memoizar función para obtener badge de membresía
  const getMembershipBadge = useCallback((status: User['membership_status']) => {
    const membershipConfig = MEMBERSHIP_STATUSES.find(s => s.value === status);
    if (!membershipConfig) return null;

    const colors = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      suspended: 'bg-orange-100 text-orange-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {membershipConfig.label}
      </span>
    );
  }, []);

  // Memoizar función para obtener badge de semáforo
  const getTrafficLightBadge = useCallback((status: User['traffic_light_status']) => {
    const trafficConfig = TRAFFIC_LIGHT_STATUSES.find(s => s.value === status);
    if (!trafficConfig) return null;

    const colors = {
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
      gray: 'bg-gray-400',
    };

    return (
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${colors[status]}`} />
        <span className="text-sm text-gray-600">{trafficConfig.label}</span>
      </div>
    );
  }, []);

  // Memoizar columnas de la tabla
  const columns = useMemo(() => [
    {
      key: 'user',
      title: 'Usuario',
      sortable: true,
      render: (value: any, user: User) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {user.avatar_url ? (
              <img
                className="h-8 w-8 rounded-full"
                src={user.avatar_url}
                alt={`${user.first_name} ${user.last_name}`}
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-gray-500" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.first_name} {user.last_name}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <EnvelopeIcon className="h-3 w-3" />
                <span className="truncate max-w-32">{user.email}</span>
                {user.email_verified_at && (
                  <CheckCircleIcon className="h-3 w-3 text-green-500" />
                )}
              </div>
              {user.phone && (
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <PhoneIcon className="h-3 w-3" />
                  <span>{user.phone}</span>
                  {user.phone_verified_at && (
                    <CheckCircleIcon className="h-3 w-3 text-green-500" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      title: 'Rol',
      sortable: true,
      render: (value: any, user: User) => getRoleBadge(user.role),
    },
    {
      key: 'status',
      title: 'Estado',
      sortable: true,
      render: (value: any, user: User) => (
        <div className="space-y-1">
          {getStatusBadge(user.status)}
          {user.is_member && getMembershipBadge(user.membership_status)}
        </div>
      ),
    },
    {
      key: 'traffic_light',
      title: 'Semáforo',
      sortable: true,
      render: (value: any, user: User) => getTrafficLightBadge(user.traffic_light_status),
    },
    {
      key: 'professor',
      title: 'Profesor',
      render: (value: any, user: User) => {
        if (!user.is_member || !user.assigned_professor) {
          return <span className="text-sm text-gray-400">-</span>;
        }
        return (
          <span className="text-sm text-gray-900">
            {user.assigned_professor.first_name} {user.assigned_professor.last_name}
          </span>
        );
      },
    },
    {
      key: 'dates',
      title: 'Fechas',
      sortable: true,
      render: (value: any, user: User) => (
        <div className="space-y-1 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <CalendarIcon className="h-3 w-3" />
            <span>Creado: {new Date(user.created_at).toLocaleDateString('es-ES')}</span>
          </div>
          {user.last_activity_date && (
            <div className="flex items-center space-x-1">
              <ClockIcon className="h-3 w-3" />
              <span>Actividad: {new Date(user.last_activity_date).toLocaleDateString('es-ES')}</span>
            </div>
          )}
          {user.membership_end_date && (
            <div className="flex items-center space-x-1">
              <XCircleIcon className="h-3 w-3" />
              <span>Vence: {new Date(user.membership_end_date).toLocaleDateString('es-ES')}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Acciones',
      render: (value: any, user: User) => (
        <UserActions
          user={user}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onAssignProfessor={onAssignProfessor}
          onResetPassword={onResetPassword}
          onToggleStatus={onToggleStatus}
          onVerifyEmail={onVerifyEmail}
          onVerifyPhone={onVerifyPhone}
          loadingStates={loadingStates[user.id] || {}}
          permissions={permissions}
          compact={compact}
        />
      ),
    },
  ], [
    getRoleBadge, getStatusBadge, getMembershipBadge, getTrafficLightBadge,
    onView, onEdit, onDelete, onDuplicate, onAssignProfessor, onResetPassword,
    onToggleStatus, onVerifyEmail, onVerifyPhone, loadingStates, permissions, compact
  ]);

  // Handler para selección
  const handleSelectionChange = useCallback((selectedRowKeys: React.Key[], selectedRows: User[]) => {
    const selectedIds = selectedRowKeys.map(key => Number(key));
    onSelectionChange?.(selectedIds);
  }, [onSelectionChange]);

  // Handler para ordenamiento
  const handleSort = useCallback((sortConfig: { key: string; direction: 'asc' | 'desc' } | null) => {
    if (sortConfig) {
      onSort?.({ sort_by: sortConfig.key, sort_direction: sortConfig.direction });
    }
  }, [onSort]);

  // Memoizar configuración de la tabla
  const tableConfig = useMemo(() => ({
    showSelection,
    selectable: showSelection,
    sortable: true,
    loading,
    emptyMessage: 'No se encontraron usuarios',
    loadingMessage: 'Cargando usuarios...',
  }), [showSelection, loading]);

  return (
    <DataTable
      data={users}
      columns={columns}
      selectedRowKeys={selectedUsers.map(id => id.toString())}
      onSelectionChange={handleSelectionChange}
      onSort={handleSort}
      rowKey="id"
      {...tableConfig}
    />
  );
});

export default UserTable;
