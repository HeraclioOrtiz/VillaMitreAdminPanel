/**
 * UserListPage - Página principal de gestión de usuarios
 * Integra filtros, tabla y acciones con optimizaciones de performance
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Pagination, ListPageSkeleton, UsersEmptyState, TableErrorBoundary } from '@/components/ui';
import { UserFilters } from '@/components/admin';
import UserTable from '@/components/admin/UserTable';
import type { UserFilters as UserFiltersType, UserQueryParams, User } from '@/types/user';
import { 
  useUsers, 
  useDeleteUser, 
  useBulkDeleteUsers, 
  useBulkStatusChange,
  useAssignProfessor,
  useResetPassword,
  useAvailableProfessors,
} from '@/hooks/useUsers';
import { useToast } from '@/hooks/useToast';
import {
  PlusIcon,
  TrashIcon,
  UserGroupIcon,
  DocumentArrowDownIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const UserListPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // Estados locales
  const [filters, setFilters] = useState<UserFiltersType>({});
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [loadingStates, setLoadingStates] = useState<{
    [userId: number]: { [action: string]: boolean };
  }>({});

  // Memoizar parámetros de query
  const queryParams = useMemo((): UserQueryParams => ({
    ...filters,
    page,
    per_page: perPage,
    sort_by: sortBy as any,
    sort_direction: sortDirection,
  }), [filters, page, perPage, sortBy, sortDirection]);

  // Hooks de datos
  const { 
    data: usersResponse, 
    isLoading, 
    error, 
    refetch 
  } = useUsers(queryParams);

  const { data: availableProfessors = [] } = useAvailableProfessors();

  // Hooks de mutaciones
  const deleteUserMutation = useDeleteUser({
    onSuccess: (deletedId) => {
      toast.success('Usuario eliminado', 'El usuario ha sido eliminado correctamente');
      setSelectedUsers(prev => prev.filter(id => id !== deletedId));
      setLoadingStates(prev => {
        const newState = { ...prev };
        delete newState[deletedId];
        return newState;
      });
    },
    onError: (error) => {
      toast.error('Error al eliminar', 'No se pudo eliminar el usuario');
      console.error('Delete user error:', error);
    },
  });

  const bulkDeleteMutation = useBulkDeleteUsers({
    onSuccess: (deletedCount) => {
      toast.success('Usuarios eliminados', `${deletedCount} usuarios eliminados correctamente`);
      setSelectedUsers([]);
    },
    onError: (error) => {
      toast.error('Error en eliminación masiva', 'No se pudieron eliminar algunos usuarios');
      console.error('Bulk delete error:', error);
    },
  });

  const bulkStatusMutation = useBulkStatusChange({
    onSuccess: (result) => {
      toast.success('Estados actualizados', `${result.updated_count} usuarios actualizados`);
      setSelectedUsers([]);
    },
    onError: (error) => {
      toast.error('Error al actualizar estados', 'No se pudieron actualizar algunos usuarios');
      console.error('Bulk status error:', error);
    },
  });

  const assignProfessorMutation = useAssignProfessor({
    onSuccess: (user) => {
      toast.success('Profesor asignado', `Profesor asignado a ${user.first_name} ${user.last_name}`);
    },
    onError: (error) => {
      toast.error('Error al asignar profesor', 'No se pudo asignar el profesor');
      console.error('Assign professor error:', error);
    },
  });

  const resetPasswordMutation = useResetPassword({
    onSuccess: (response) => {
      if (response.temporary_password) {
        toast.success('Contraseña reseteada', `Nueva contraseña: ${response.temporary_password}`);
      } else {
        toast.success('Contraseña reseteada', 'Se ha enviado la nueva contraseña por email');
      }
    },
    onError: (error) => {
      toast.error('Error al resetear contraseña', 'No se pudo resetear la contraseña');
      console.error('Reset password error:', error);
    },
  });

  // Handlers optimizados
  const handleFiltersChange = useCallback((newFilters: UserFiltersType) => {
    setFilters(newFilters);
    setPage(1); // Reset page when filters change
  }, []);

  const handleFiltersReset = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  const handleSort = useCallback((params: { sort_by: string; sort_direction: 'asc' | 'desc' }) => {
    setSortBy(params.sort_by);
    setSortDirection(params.sort_direction);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleSelectionChange = useCallback((selectedIds: number[]) => {
    setSelectedUsers(selectedIds);
  }, []);

  // Handlers de acciones individuales
  const setUserLoading = useCallback((userId: number, action: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [action]: loading,
      },
    }));
  }, []);

  const handleView = useCallback((user: User) => {
    navigate(`/admin/users/${user.id}`);
  }, [navigate]);

  const handleEdit = useCallback((user: User) => {
    navigate(`/admin/users/${user.id}/edit`);
  }, [navigate]);

  const handleDelete = useCallback(async (user: User) => {
    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar a ${user.first_name} ${user.last_name}?`
    );
    
    if (!confirmed) return;

    setUserLoading(user.id, 'delete', true);
    try {
      await deleteUserMutation.mutateAsync(user.id);
    } finally {
      setUserLoading(user.id, 'delete', false);
    }
  }, [deleteUserMutation, setUserLoading]);

  const handleDuplicate = useCallback((user: User) => {
    navigate('/admin/users/create', { 
      state: { 
        duplicateFrom: user,
        title: `Duplicar usuario: ${user.first_name} ${user.last_name}`
      } 
    });
  }, [navigate]);

  const handleAssignProfessor = useCallback(async (user: User) => {
    // En una implementación real, esto abriría un modal de selección
    // Por ahora, simulamos la asignación del primer profesor disponible
    if (availableProfessors.length === 0) {
      toast.warning('Sin profesores', 'No hay profesores disponibles para asignar');
      return;
    }

    setUserLoading(user.id, 'assignProfessor', true);
    try {
      await assignProfessorMutation.mutateAsync({
        user_id: user.id,
        professor_id: availableProfessors[0].id,
      });
    } finally {
      setUserLoading(user.id, 'assignProfessor', false);
    }
  }, [availableProfessors, assignProfessorMutation, setUserLoading, toast]);

  const handleResetPassword = useCallback(async (user: User) => {
    const confirmed = window.confirm(
      `¿Resetear la contraseña de ${user.first_name} ${user.last_name}?`
    );
    
    if (!confirmed) return;

    setUserLoading(user.id, 'resetPassword', true);
    try {
      await resetPasswordMutation.mutateAsync({
        user_id: user.id,
        send_email: true,
      });
    } finally {
      setUserLoading(user.id, 'resetPassword', false);
    }
  }, [resetPasswordMutation, setUserLoading]);

  const handleToggleStatus = useCallback(async (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activar' : 'desactivar';
    
    const confirmed = window.confirm(
      `¿${action} a ${user.first_name} ${user.last_name}?`
    );
    
    if (!confirmed) return;

    setUserLoading(user.id, 'toggleStatus', true);
    try {
      await bulkStatusMutation.mutateAsync({
        user_ids: [user.id],
        status: newStatus,
      });
    } finally {
      setUserLoading(user.id, 'toggleStatus', false);
    }
  }, [bulkStatusMutation, setUserLoading]);

  const handleVerifyEmail = useCallback((user: User) => {
    setUserLoading(user.id, 'verifyEmail', true);
    // Simular verificación
    setTimeout(() => {
      toast.success('Email verificado', `Email de ${user.first_name} ${user.last_name} verificado`);
      setUserLoading(user.id, 'verifyEmail', false);
    }, 1000);
  }, [setUserLoading, toast]);

  const handleVerifyPhone = useCallback((user: User) => {
    setUserLoading(user.id, 'verifyPhone', true);
    // Simular verificación
    setTimeout(() => {
      toast.success('Teléfono verificado', `Teléfono de ${user.first_name} ${user.last_name} verificado`);
      setUserLoading(user.id, 'verifyPhone', false);
    }, 1000);
  }, [setUserLoading, toast]);

  // Handlers de acciones masivas
  const handleBulkDelete = useCallback(async () => {
    if (selectedUsers.length === 0) return;

    const confirmed = window.confirm(
      `¿Eliminar ${selectedUsers.length} usuario${selectedUsers.length > 1 ? 's' : ''}?`
    );
    
    if (!confirmed) return;

    await bulkDeleteMutation.mutateAsync(selectedUsers);
  }, [selectedUsers, bulkDeleteMutation]);

  const handleBulkStatusChange = useCallback(async (status: 'active' | 'inactive' | 'suspended') => {
    if (selectedUsers.length === 0) return;

    const statusLabels = {
      active: 'activar',
      inactive: 'desactivar',
      suspended: 'suspender',
    };

    const confirmed = window.confirm(
      `¿${statusLabels[status]} ${selectedUsers.length} usuario${selectedUsers.length > 1 ? 's' : ''}?`
    );
    
    if (!confirmed) return;

    await bulkStatusMutation.mutateAsync({
      user_ids: selectedUsers,
      status,
    });
  }, [selectedUsers, bulkStatusMutation]);

  const handleCreateUser = useCallback(() => {
    navigate('/admin/users/create');
  }, [navigate]);

  const handleExportUsers = useCallback(() => {
    // Implementar exportación
    toast.info('Exportación', 'Funcionalidad de exportación en desarrollo');
  }, [toast]);

  // Memoizar datos de usuarios
  const users = useMemo(() => usersResponse?.data || [], [usersResponse?.data]);
  const totalUsers = useMemo(() => usersResponse?.meta?.total || 0, [usersResponse?.meta?.total]);
  const totalPages = useMemo(() => usersResponse?.meta?.last_page || 1, [usersResponse?.meta?.last_page]);

  // Memoizar si hay filtros activos
  const hasActiveFilters = useMemo(() => 
    Object.values(filters).some(value => 
      value !== undefined && value !== null && 
      (Array.isArray(value) ? value.length > 0 : true)
    )
  , [filters]);

  // Estados de carga y error
  if (isLoading && !usersResponse) {
    return <ListPageSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Error al cargar usuarios</h2>
          <p className="text-gray-500 mb-4">No se pudieron cargar los usuarios</p>
          <Button onClick={() => refetch()}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-500">
            Gestiona los usuarios del sistema ({totalUsers} total{totalUsers !== 1 ? 'es' : ''})
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            onClick={handleExportUsers}
            leftIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
          >
            Exportar
          </Button>
          
          <Button
            onClick={handleCreateUser}
            leftIcon={<PlusIcon className="h-4 w-4" />}
          >
            Crear Usuario
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <UserFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleFiltersReset}
        availableProfessors={availableProfessors.map(p => ({
          id: p.id,
          name: `${p.first_name} ${p.last_name}`,
        }))}
        collapsible
        showChips
      />

      {/* Acciones masivas */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <UserGroupIcon className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {selectedUsers.length} usuario{selectedUsers.length > 1 ? 's' : ''} seleccionado{selectedUsers.length > 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleBulkStatusChange('active')}
                disabled={bulkStatusMutation.isPending}
              >
                Activar
              </Button>
              
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleBulkStatusChange('inactive')}
                disabled={bulkStatusMutation.isPending}
              >
                Desactivar
              </Button>
              
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleBulkStatusChange('suspended')}
                disabled={bulkStatusMutation.isPending}
              >
                Suspender
              </Button>
              
              <Button
                size="sm"
                variant="danger"
                onClick={handleBulkDelete}
                disabled={bulkDeleteMutation.isPending}
                leftIcon={<TrashIcon className="h-4 w-4" />}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tabla */}
      <TableErrorBoundary>
        {users.length === 0 && !isLoading ? (
          <UsersEmptyState
            hasFilters={hasActiveFilters}
            onClearFilters={handleFiltersReset}
            onInviteUser={handleCreateUser}
          />
        ) : (
          <UserTable
            users={users}
            loading={isLoading}
            selectedUsers={selectedUsers}
            onSelectionChange={handleSelectionChange}
            onSort={handleSort}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onAssignProfessor={handleAssignProfessor}
            onResetPassword={handleResetPassword}
            onToggleStatus={handleToggleStatus}
            onVerifyEmail={handleVerifyEmail}
            onVerifyPhone={handleVerifyPhone}
            loadingStates={loadingStates}
            permissions={{
              canView: true,
              canEdit: true,
              canDelete: true,
              canDuplicate: true,
              canAssignProfessor: true,
              canResetPassword: true,
              canToggleStatus: true,
              canVerify: true,
            }}
          />
        )}
      </TableErrorBoundary>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalUsers}
            itemsPerPage={perPage}
            onPageChange={handlePageChange}
            showItemsPerPage={false}
          />
        </div>
      )}
    </div>
  );
};

export default UserListPage;
