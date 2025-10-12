import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExclamationTriangleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui';

interface SessionExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: 'expired' | 'unauthorized' | 'invalid';
}

/**
 * Modal informativo cuando la sesión del usuario expira o es inválida
 * Proporciona feedback claro y opción de volver a login
 */
export const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({
  isOpen,
  onClose,
  reason = 'expired',
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToLogin = () => {
    onClose();
    navigate('/login', { replace: true });
  };

  const getContent = () => {
    switch (reason) {
      case 'unauthorized':
        return {
          icon: <ExclamationTriangleIcon className="h-12 w-12 text-red-500" />,
          title: 'Acceso No Autorizado',
          message: 'No tienes permisos para acceder a este recurso. Por favor, inicia sesión con una cuenta autorizada.',
        };
      case 'invalid':
        return {
          icon: <ExclamationTriangleIcon className="h-12 w-12 text-orange-500" />,
          title: 'Sesión Inválida',
          message: 'Tu sesión es inválida o ha sido revocada. Por favor, inicia sesión nuevamente.',
        };
      case 'expired':
      default:
        return {
          icon: <ClockIcon className="h-12 w-12 text-yellow-500" />,
          title: 'Sesión Expirada',
          message: 'Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente para continuar.',
        };
    }
  };

  const content = getContent();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleGoToLogin}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10">
                {content.icon}
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  {content.title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    {content.message}
                  </p>
                </div>

                {/* Información adicional */}
                <div className="mt-4 rounded-md bg-blue-50 p-3">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-blue-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm text-blue-700">
                        Por seguridad, tus datos han sido limpiados. 
                        No te preocupes, puedes volver a iniciar sesión de forma segura.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-3">
            <Button
              onClick={handleGoToLogin}
              variant="primary"
              className="w-full sm:w-auto"
            >
              Ir a Iniciar Sesión
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
