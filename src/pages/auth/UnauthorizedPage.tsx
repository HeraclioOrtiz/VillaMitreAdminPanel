import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui';
import { 
  ExclamationTriangleIcon,
  HomeIcon,
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoHome = () => {
    // Redirigir al dashboard apropiado según el rol
    if (user?.is_admin || user?.is_super_admin) {
      navigate('/admin/dashboard');
    } else if (user?.is_professor) {
      navigate('/professor/dashboard');
    } else {
      navigate('/gym/dashboard');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-6">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>

          {/* Content */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Acceso No Autorizado
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              No tienes permisos para acceder a esta página. Si crees que esto es un error, 
              contacta con el administrador del sistema.
            </p>

            {/* User Info */}
            <div className="bg-gray-50 rounded-md p-4 mb-6">
              <div className="text-sm">
                <p className="font-medium text-gray-900">Usuario actual:</p>
                <p className="text-gray-600">{user?.name}</p>
                <p className="text-gray-500 text-xs mt-1">
                  Rol: {user?.is_super_admin ? 'Super Administrador' : 
                        user?.is_admin ? 'Administrador' : 
                        user?.is_professor ? 'Profesor' : 'Usuario'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                onClick={handleGoHome}
                leftIcon={<HomeIcon className="w-4 h-4" />}
                className="flex-1"
              >
                Ir al Dashboard
              </Button>
              <Button
                variant="secondary"
                onClick={handleGoBack}
                leftIcon={<ArrowLeftIcon className="w-4 h-4" />}
                className="flex-1"
              >
                Volver
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Villa Mitre Admin Panel - Sistema de Gestión
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
