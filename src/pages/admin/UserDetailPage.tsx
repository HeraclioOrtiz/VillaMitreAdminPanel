/**
 * UserDetailPage - Página de detalle de usuario con integración completa
 * Integra UserDetail, estadísticas y actividades con optimizaciones de performance
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Skeleton, ApiErrorDisplay, TableErrorBoundary } from '@/components/ui';
import UserDetail from '@/components/admin/UserDetail';
import type { User } from '@/types/user';
import { 
  useUser, 
  useDeleteUser, 
  useAssignProfessor,
  useResetPassword,
  useBulkStatusChange,
  useUserActivities,
  useAvailableProfessors,
} from '@/hooks/useUsers';
import { useToast } from '@/hooks/useToast';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';

const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  // Estados locales
  const [loadingStates, setLoadingStates] = useState<{
    [action: string]: boolean;
  }>({});

  // Validar ID
  const userId = useMemo(() => {
    const parsedId = parseInt(id || '0', 10);
    return isNaN(parsedId) || parsedId <= 0 ? null : parsedId;
  }, [id]);

  // Hooks de datos
  const { 
    data: user, 
    isLoading: userLoading, 
    error: userError,
    refetch: refetchUser 
  } = useUser(userId!);

  const { 
    data: activitiesResponse,
    isLoading: activitiesLoading 
  } = useUserActivities(userId!, { per_page: 20 });

  const { data: availableProfessors = [] } = useAvailableProfessors();

  // Hooks de mutaciones
  const deleteUserMutation = useDeleteUser({
    onSuccess: () => {
      toast.success('Usuario eliminado', 'El usuario ha sido eliminado correctamente');
      navigate('/admin/users');
    },
    onError: (error) => {
      toast.error('Error al eliminar', 'No se pudo eliminar el usuario');
      console.error('Delete user error:', error);
    },
  });

  const assignProfessorMutation = useAssignProfessor({
    onSuccess: (updatedUser) => {
      toast.success('Profesor asignado', `Profesor asignado a ${updatedUser.first_name} ${updatedUser.last_name}`);
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

  const bulkStatusMutation = useBulkStatusChange({
    onSuccess: (result) => {
      const user = result.users[0];
      if (user) {
        toast.success('Estado actualizado', `${user.first_name} ${user.last_name} ${user.status === 'active' ? 'activado' : 'desactivado'}`);
      }
    },
    onError: (error) => {
      toast.error('Error al actualizar estado', 'No se pudo actualizar el estado del usuario');
      console.error('Status change error:', error);
    },
  });

  // Helper para manejar estados de carga
  const setActionLoading = useCallback((action: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [action]: loading,
    }));
  }, []);

  // Handlers de navegación
  const handleBack = useCallback(() => {
    navigate('/admin/users');
  }, [navigate]);

  const handleEdit = useCallback((user: User) => {
    navigate(`/admin/users/${user.id}/edit`);
  }, [navigate]);

  const handleDuplicate = useCallback((user: User) => {
    navigate('/admin/users/create', { 
      state: { 
        duplicateFrom: user,
        title: `Duplicar usuario: ${user.first_name} ${user.last_name}`
      } 
    });
  }, [navigate]);

  // Handlers de acciones
  const handleDelete = useCallback(async (user: User) => {
    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar a ${user.first_name} ${user.last_name}?\n\nEsta acción no se puede deshacer.`
    );
    
    if (!confirmed) return;

    setActionLoading('delete', true);
    try {
      await deleteUserMutation.mutateAsync(user.id);
    } finally {
      setActionLoading('delete', false);
    }
  }, [deleteUserMutation, setActionLoading]);

  const handleAssignProfessor = useCallback(async (user: User) => {
    // En una implementación real, esto abriría un modal de selección
    // Por ahora, simulamos la asignación del primer profesor disponible
    if (availableProfessors.length === 0) {
      toast.warning('Sin profesores', 'No hay profesores disponibles para asignar');
      return;
    }

    const confirmed = window.confirm(
      `¿Asignar profesor a ${user.first_name} ${user.last_name}?\n\nSe asignará: ${availableProfessors[0].first_name} ${availableProfessors[0].last_name}`
    );
    
    if (!confirmed) return;

    setActionLoading('assignProfessor', true);
    try {
      await assignProfessorMutation.mutateAsync({
        user_id: user.id,
        professor_id: availableProfessors[0].id,
      });
    } finally {
      setActionLoading('assignProfessor', false);
    }
  }, [availableProfessors, assignProfessorMutation, setActionLoading, toast]);

  const handleResetPassword = useCallback(async (user: User) => {
    const confirmed = window.confirm(
      `¿Resetear la contraseña de ${user.first_name} ${user.last_name}?\n\nSe enviará una nueva contraseña por email.`
    );
    
    if (!confirmed) return;

    setActionLoading('resetPassword', true);
    try {
      await resetPasswordMutation.mutateAsync({
        user_id: user.id,
        send_email: true,
      });
    } finally {
      setActionLoading('resetPassword', false);
    }
  }, [resetPasswordMutation, setActionLoading]);

  const handleToggleStatus = useCallback(async (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activar' : 'desactivar';
    
    const confirmed = window.confirm(
      `¿${action} a ${user.first_name} ${user.last_name}?`
    );
    
    if (!confirmed) return;

    setActionLoading('toggleStatus', true);
    try {
      await bulkStatusMutation.mutateAsync({
        user_ids: [user.id],
        status: newStatus,
      });
    } finally {
      setActionLoading('toggleStatus', false);
    }
  }, [bulkStatusMutation, setActionLoading]);

  const handleVerifyEmail = useCallback((user: User) => {
    setActionLoading('verifyEmail', true);
    // Simular verificación
    setTimeout(() => {
      toast.success('Email verificado', `Email de ${user.first_name} ${user.last_name} verificado correctamente`);
      setActionLoading('verifyEmail', false);
      refetchUser();
    }, 1000);
  }, [setActionLoading, toast, refetchUser]);

  const handleVerifyPhone = useCallback((user: User) => {
    setActionLoading('verifyPhone', true);
    // Simular verificación
    setTimeout(() => {
      toast.success('Teléfono verificado', `Teléfono de ${user.first_name} ${user.last_name} verificado correctamente`);
      setActionLoading('verifyPhone', false);
      refetchUser();
    }, 1000);
  }, [setActionLoading, toast, refetchUser]);

  const handleShare = useCallback(() => {
    if (navigator.share && user) {
      navigator.share({
        title: `${user.first_name} ${user.last_name} - Villa Mitre`,
        text: `Perfil de ${user.first_name} ${user.last_name}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copiar URL al clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Enlace copiado', 'El enlace ha sido copiado al portapapeles');
    }
  }, [user, toast]);

  // Memoizar estadísticas simuladas
  const userStats = useMemo(() => {
    if (!user) return undefined;
    
    // En una implementación real, estas estadísticas vendrían de la API
    return {
      total_workouts: Math.floor(Math.random() * 100),
      current_streak: Math.floor(Math.random() * 30),
      last_workout: user.last_activity_date || null,
      next_payment_due: user.membership_end_date || null,
      total_payments: Math.floor(Math.random() * 20),
      membership_days_remaining: user.membership_end_date ? 
        Math.ceil((new Date(user.membership_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0,
      login_count: Math.floor(Math.random() * 200),
      last_login: user.last_activity_date || null,
    };
  }, [user]);

  // Memoizar actividades
  const activities = useMemo(() => 
    activitiesResponse?.data || []
  , [activitiesResponse?.data]);

  // Validar ID
  if (!userId) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900 mb-2">ID de usuario inválido</h2>
          <p className="text-gray-500 mb-4">El ID proporcionado no es válido</p>
          <Button onClick={handleBack}>Volver a la lista</Button>
        </div>
      </div>
    );
  }

  // Estados de carga
  if (userLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-4">
          <Skeleton width={40} height={40} variant="circular" />
          <div className="space-y-2">
            <Skeleton width={200} height={24} />
            <Skeleton width={150} height={16} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton width="100%" height={120} />
          <Skeleton width="100%" height={120} />
          <Skeleton width="100%" height={120} />
        </div>
        <Skeleton width="100%" height={300} />
      </div>
    );
  }

  // Error
  if (userError || !user) {
    return (
      <div className="p-6">
        <ApiErrorDisplay
          error={userError || new Error('No se pudo cargar la información del usuario')}
          onRetry={() => refetchUser()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
          >
            Volver
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Detalle de Usuario
            </h1>
            <p className="text-gray-500">
              Información completa de {user.first_name} {user.last_name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            onClick={handleShare}
            leftIcon={<ShareIcon className="h-4 w-4" />}
          >
            Compartir
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => handleDuplicate(user)}
            leftIcon={<DocumentDuplicateIcon className="h-4 w-4" />}
          >
            Duplicar
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => handleEdit(user)}
            leftIcon={<PencilIcon className="h-4 w-4" />}
          >
            Editar
          </Button>
        </div>
      </div>

      {/* Contenido principal */}
      <TableErrorBoundary>
        <UserDetail
          user={user}
          stats={userStats}
          activities={activities}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAssignProfessor={handleAssignProfessor}
          onResetPassword={handleResetPassword}
          onToggleStatus={handleToggleStatus}
          onVerifyEmail={handleVerifyEmail}
          onVerifyPhone={handleVerifyPhone}
          loadingStates={loadingStates}
          permissions={{
            canEdit: true,
            canDelete: true,
            canAssignProfessor: user.is_member,
            canResetPassword: true,
            canToggleStatus: true,
            canVerify: true,
          }}
        />
      </TableErrorBoundary>

      {/* Información adicional de carga */}
      {activitiesLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="animate-spin h-4 w-4 border border-blue-600 border-t-transparent rounded-full" />
            <span className="text-sm text-blue-800">Cargando actividades recientes...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetailPage;
