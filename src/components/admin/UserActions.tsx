/**
 * UserActions - Componente de acciones por fila para usuarios
 * Optimizado con React.memo, useMemo y useCallback siguiendo patrones de performance
 */

import React, { memo, useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui';
import type { User } from '@/types/user';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  KeyIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentDuplicateIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';

interface ActionItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'ghost' | 'primary' | 'secondary';
  loading?: boolean;
  className?: string;
  separator?: boolean;
}

interface UserActionsProps {
  user: User;
  onView?: (user: User) => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onDuplicate?: (user: User) => void;
  onAssignProfessor?: (user: User) => void;
  onResetPassword?: (user: User) => void;
  onToggleStatus?: (user: User) => void;
  onVerifyEmail?: (user: User) => void;
  onVerifyPhone?: (user: User) => void;
  loadingStates?: {
    [key: string]: boolean;
  };
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
  compact?: boolean;
  showLabels?: boolean;
}

const UserActions = memo<UserActionsProps>(function UserActions({
  user,
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
  permissions = {},
  compact = false,
  showLabels = false,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Memoizar permisos con valores por defecto
  const {
    canView = true,
    canEdit = true,
    canDelete = true,
    canDuplicate = false,
    canAssignProfessor = true,
    canResetPassword = true,
    canToggleStatus = true,
    canVerify = true,
  } = useMemo(() => permissions, [permissions]);

  // Handlers optimizados con useCallback
  const handleView = useCallback(() => {
    onView?.(user);
  }, [onView, user]);

  const handleEdit = useCallback(() => {
    onEdit?.(user);
  }, [onEdit, user]);

  const handleDelete = useCallback(() => {
    onDelete?.(user);
  }, [onDelete, user]);

  const handleDuplicate = useCallback(() => {
    onDuplicate?.(user);
  }, [onDuplicate, user]);

  const handleAssignProfessor = useCallback(() => {
    onAssignProfessor?.(user);
  }, [onAssignProfessor, user]);

  const handleResetPassword = useCallback(() => {
    onResetPassword?.(user);
  }, [onResetPassword, user]);

  const handleToggleStatus = useCallback(() => {
    onToggleStatus?.(user);
  }, [onToggleStatus, user]);

  const handleVerifyEmail = useCallback(() => {
    onVerifyEmail?.(user);
  }, [onVerifyEmail, user]);

  const handleVerifyPhone = useCallback(() => {
    onVerifyPhone?.(user);
  }, [onVerifyPhone, user]);

  const handleDropdownToggle = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  // Manejar click fuera del dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Memoizar acciones principales
  const primaryActions = useMemo(() => {
    const actions: ActionItem[] = [];

    if (canView && onView) {
      actions.push({
        key: 'view',
        label: 'Ver',
        icon: EyeIcon,
        onClick: handleView,
        variant: 'ghost' as const,
        loading: loadingStates.view,
      });
    }

    if (canEdit && onEdit) {
      actions.push({
        key: 'edit',
        label: 'Editar',
        icon: PencilIcon,
        onClick: handleEdit,
        variant: 'ghost' as const,
        loading: loadingStates.edit,
      });
    }

    return actions;
  }, [canView, canEdit, onView, onEdit, handleView, handleEdit, loadingStates]);

  // Memoizar acciones secundarias
  const secondaryActions = useMemo(() => {
    const actions: ActionItem[] = [];

    if (canAssignProfessor && onAssignProfessor && user.is_member) {
      actions.push({
        key: 'assign-professor',
        label: 'Asignar Profesor',
        icon: UserPlusIcon,
        onClick: handleAssignProfessor,
        loading: loadingStates.assignProfessor,
      });
    }

    if (canResetPassword && onResetPassword) {
      actions.push({
        key: 'reset-password',
        label: 'Resetear Contraseña',
        icon: KeyIcon,
        onClick: handleResetPassword,
        loading: loadingStates.resetPassword,
      });
    }

    if (canToggleStatus && onToggleStatus) {
      const isActive = user.status === 'active';
      actions.push({
        key: 'toggle-status',
        label: isActive ? 'Desactivar' : 'Activar',
        icon: isActive ? XCircleIcon : CheckCircleIcon,
        onClick: handleToggleStatus,
        loading: loadingStates.toggleStatus,
        className: isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700',
      });
    }

    if (canVerify && onVerifyEmail && !user.email_verified_at) {
      actions.push({
        key: 'verify-email',
        label: 'Verificar Email',
        icon: CheckCircleIcon,
        onClick: handleVerifyEmail,
        loading: loadingStates.verifyEmail,
        className: 'text-blue-600 hover:text-blue-700',
      });
    }

    if (canVerify && onVerifyPhone && user.phone && !user.phone_verified_at) {
      actions.push({
        key: 'verify-phone',
        label: 'Verificar Teléfono',
        icon: CheckCircleIcon,
        onClick: handleVerifyPhone,
        loading: loadingStates.verifyPhone,
        className: 'text-blue-600 hover:text-blue-700',
      });
    }

    if (canDuplicate && onDuplicate) {
      actions.push({
        key: 'duplicate',
        label: 'Duplicar',
        icon: DocumentDuplicateIcon,
        onClick: handleDuplicate,
        loading: loadingStates.duplicate,
      });
    }

    if (canDelete && onDelete) {
      actions.push({
        key: 'delete',
        label: 'Eliminar',
        icon: TrashIcon,
        onClick: handleDelete,
        loading: loadingStates.delete,
        className: 'text-red-600 hover:text-red-700',
        separator: true,
      });
    }

    return actions;
  }, [
    canAssignProfessor, canResetPassword, canToggleStatus, canVerify, canDuplicate, canDelete,
    onAssignProfessor, onResetPassword, onToggleStatus, onVerifyEmail, onVerifyPhone, onDuplicate, onDelete,
    user, loadingStates,
    handleAssignProfessor, handleResetPassword, handleToggleStatus, handleVerifyEmail, handleVerifyPhone, handleDuplicate, handleDelete
  ]);

  // Memoizar si hay acciones disponibles
  const hasActions = useMemo(() => 
    primaryActions.length > 0 || secondaryActions.length > 0
  , [primaryActions, secondaryActions]);

  // Si no hay acciones, no renderizar nada
  if (!hasActions) {
    return null;
  }

  // Modo compacto con dropdown
  if (compact) {
    const allActions = [...primaryActions, ...secondaryActions];
    
    return (
      <div className="relative" ref={dropdownRef}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDropdownToggle}
          className="p-1"
        >
          <EllipsisHorizontalIcon className="h-4 w-4" />
        </Button>

        {isDropdownOpen && (
          <div className="absolute right-0 z-50 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="py-1">
              {allActions.map((action, index) => (
                <div key={action.key}>
                  {action.separator && index > 0 && (
                    <div className="border-t border-gray-100 my-1" />
                  )}
                  <button
                    onClick={() => {
                      action.onClick();
                      setIsDropdownOpen(false);
                    }}
                    disabled={action.loading}
                    className={`
                      w-full text-left px-4 py-2 text-sm hover:bg-gray-50 
                      disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center space-x-2
                      ${action.className || 'text-gray-700 hover:text-gray-900'}
                    `}
                  >
                    <action.icon className="h-4 w-4" />
                    <span>{action.label}</span>
                    {action.loading && (
                      <div className="ml-auto">
                        <div className="animate-spin h-3 w-3 border border-gray-300 border-t-transparent rounded-full" />
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Modo expandido con botones individuales
  return (
    <div className="flex items-center space-x-1">
      {/* Acciones principales */}
      {primaryActions.map((action) => (
        <Button
          key={action.key}
          variant={action.variant}
          size="sm"
          onClick={action.onClick}
          disabled={action.loading}
          leftIcon={<action.icon className="h-4 w-4" />}
          className={action.className}
        >
          {showLabels && action.label}
        </Button>
      ))}

      {/* Acciones secundarias en dropdown si hay muchas */}
      {secondaryActions.length > 0 && (
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDropdownToggle}
            className="p-1"
          >
            <EllipsisHorizontalIcon className="h-4 w-4" />
          </Button>

          {isDropdownOpen && (
            <div className="absolute right-0 z-50 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
              <div className="py-1">
                {secondaryActions.map((action, index) => (
                  <div key={action.key}>
                    {action.separator && index > 0 && (
                      <div className="border-t border-gray-100 my-1" />
                    )}
                    <button
                      onClick={() => {
                        action.onClick();
                        setIsDropdownOpen(false);
                      }}
                      disabled={action.loading}
                      className={`
                        w-full text-left px-4 py-2 text-sm hover:bg-gray-50 
                        disabled:opacity-50 disabled:cursor-not-allowed
                        flex items-center space-x-2
                        ${action.className || 'text-gray-700 hover:text-gray-900'}
                      `}
                    >
                      <action.icon className="h-4 w-4" />
                      <span>{action.label}</span>
                      {action.loading && (
                        <div className="ml-auto">
                          <div className="animate-spin h-3 w-3 border border-gray-300 border-t-transparent rounded-full" />
                        </div>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default UserActions;
