import React, { useState, useEffect } from 'react';
import { Modal, Button } from '@/components/ui';
import { exerciseService } from '@/services/exercise';
import {
  ExclamationTriangleIcon,
  TrashIcon,
  DocumentTextIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import type { Exercise } from '@/types/exercise';

interface DeleteExerciseModalProps {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  onForceDelete?: (exercise: Exercise) => Promise<void>;
}

interface DependencyInfo {
  can_delete: boolean;
  dependencies: {
    daily_templates: number;
  };
  total_references: number;
  exercise: {
    id: number;
    name: string;
  };
}

/**
 * Modal para confirmar eliminación de ejercicio
 * Verifica dependencias y muestra warning si hay plantillas que lo usan
 */
export const DeleteExerciseModal: React.FC<DeleteExerciseModalProps> = ({
  exercise,
  isOpen,
  onClose,
  onConfirm,
  onForceDelete,
}) => {
  const [isCheckingDependencies, setIsCheckingDependencies] = useState(false);
  const [dependencyInfo, setDependencyInfo] = useState<DependencyInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForceConfirmation, setShowForceConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Verificar dependencias cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      checkDependencies();
    } else {
      // Reset state cuando se cierra
      setDependencyInfo(null);
      setError(null);
      setShowForceConfirmation(false);
      setIsDeleting(false);
    }
  }, [isOpen, exercise.id]);

  const checkDependencies = async () => {
    setIsCheckingDependencies(true);
    setError(null);
    try {
      console.log('🔍 Checking dependencies for exercise:', exercise.id);
      const info = await exerciseService.checkExerciseDependencies(exercise.id);
      console.log('✅ Dependency info received:', info);
      setDependencyInfo(info);
    } catch (err: any) {
      console.error('❌ Error checking dependencies:', err);
      setError(err.message || 'Error al verificar dependencias');
    } finally {
      setIsCheckingDependencies(false);
    }
  };

  const handleSimpleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      // No cerramos aquí, el padre lo hará después del éxito
    } catch (error) {
      // Error handling is done in parent component
      setIsDeleting(false); // Solo reactivar en error
    }
  };

  const handleForceDelete = async () => {
    if (onForceDelete) {
      setIsDeleting(true);
      try {
        await onForceDelete(exercise);
        // No cerramos aquí, el padre lo hará después del éxito
      } catch (error) {
        // Error handling is done in parent component
        setIsDeleting(false); // Solo reactivar en error
      }
    }
  };

  const renderLoadingState = () => (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-villa-mitre-600 mr-3"></div>
      <span className="text-gray-700">Verificando dependencias...</span>
    </div>
  );

  const renderErrorState = () => (
    <div className="py-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-red-800 mb-1">Error al verificar dependencias</h4>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={checkDependencies}>
          Reintentar
        </Button>
      </div>
    </div>
  );

  const renderSimpleDeleteConfirmation = () => (
    <div className="py-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-green-800 mb-1">
              Este ejercicio no está en uso
            </h4>
            <p className="text-sm text-green-700">
              Puedes eliminarlo de forma segura sin afectar plantillas o asignaciones.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-700">
          ¿Estás seguro que deseas eliminar el ejercicio <strong>"{exercise.name}"</strong>?
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Esta acción no se puede deshacer.
        </p>
      </div>

      <div className="flex justify-end space-x-3">
        <Button 
          variant="secondary" 
          onClick={onClose}
          disabled={isDeleting}
        >
          Cancelar
        </Button>
        <Button 
          variant="danger" 
          onClick={handleSimpleDelete}
          isLoading={isDeleting}
          disabled={isDeleting}
        >
          {!isDeleting && <TrashIcon className="w-4 h-4 mr-2" />}
          {isDeleting ? 'Eliminando...' : 'Eliminar Ejercicio'}
        </Button>
      </div>
    </div>
  );

  const renderForceDeleteWarning = () => {
    if (!dependencyInfo) return null;

    const templatesCount = dependencyInfo.dependencies.daily_templates;

    return (
      <div className="py-6">
        {/* Warning principal */}
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-red-900 mb-2">
                ⚠️ Este ejercicio está en uso y NO puede eliminarse de forma segura
              </h4>
              <p className="text-sm text-red-800">
                El ejercicio <strong>"{exercise.name}"</strong> está siendo usado en:
              </p>
            </div>
          </div>
        </div>

        {/* Estadísticas de uso */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="bg-red-100 rounded-lg p-2">
                <DocumentTextIcon className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-900">{templatesCount}</div>
                <div className="text-sm text-gray-700">
                  {templatesCount === 1 ? 'Plantilla diaria' : 'Plantillas diarias'}
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-orange-100 rounded-lg p-2">
                <UserGroupIcon className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Asignaciones</div>
                <div className="text-xs text-gray-600">
                  Se desasignarán de todos los estudiantes
                </div>
              </div>
            </div>
          </div>
        </div>

        {!showForceConfirmation ? (
          <>
            {/* Opciones */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Opciones recomendadas:</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Edita las plantillas para reemplazar este ejercicio por otro</li>
                <li>Duplica el ejercicio y edita solo la copia</li>
                <li>Crea un nuevo ejercicio similar</li>
              </ul>
            </div>

            {/* Info de permisos si no puede forzar */}
            {!onForceDelete && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800 mb-1">
                      Permisos insuficientes
                    </h4>
                    <p className="text-sm text-yellow-700">
                      Solo los <strong>administradores</strong> pueden eliminar ejercicios que están en uso.
                      Contacta a un administrador si necesitas eliminar este ejercicio.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-between items-center">
              <Button 
                variant="secondary" 
                onClick={onClose}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              
              {onForceDelete && (
                <Button
                  variant="danger"
                  onClick={() => setShowForceConfirmation(true)}
                  disabled={isDeleting}
                >
                  <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                  Eliminar de Todos Modos
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Confirmación final */}
            <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-bold text-red-900 mb-3">
                🚨 CONFIRMACIÓN FINAL - ELIMINACIÓN FORZADA
              </h4>
              <p className="text-sm text-red-800 mb-3">
                Esta acción es <strong>IRREVERSIBLE</strong> y eliminará:
              </p>
              <ul className="text-sm text-red-900 space-y-2 list-disc list-inside mb-4">
                <li>
                  <strong>{templatesCount}</strong> {templatesCount === 1 ? 'plantilla diaria' : 'plantillas diarias'}
                </li>
                <li>
                  Todas las <strong>asignaciones de estudiantes</strong> a esas plantillas
                </li>
                <li>
                  El ejercicio <strong>"{exercise.name}"</strong>
                </li>
              </ul>
              <div className="bg-red-200 rounded p-3">
                <p className="text-xs text-red-900 font-medium">
                  ⚠️ Los estudiantes perderán el acceso a estas plantillas inmediatamente.
                  Esta acción solo debería realizarse si estás completamente seguro.
                </p>
              </div>
            </div>

            {/* Botones confirmación final */}
            <div className="flex justify-end space-x-3">
              <Button 
                variant="secondary" 
                onClick={() => setShowForceConfirmation(false)}
                disabled={isDeleting}
              >
                No, Volver Atrás
              </Button>
              <Button 
                variant="danger" 
                onClick={handleForceDelete}
                isLoading={isDeleting}
                disabled={isDeleting}
              >
                {!isDeleting && <TrashIcon className="w-4 h-4 mr-2" />}
                {isDeleting ? 'Eliminando...' : 'Sí, Eliminar Todo'}
              </Button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Eliminar Ejercicio"
      size="lg"
    >
      {isCheckingDependencies && renderLoadingState()}
      {!isCheckingDependencies && error && renderErrorState()}
      {!isCheckingDependencies && !error && dependencyInfo && (
        <>
          {dependencyInfo.can_delete
            ? renderSimpleDeleteConfirmation()
            : renderForceDeleteWarning()}
        </>
      )}
      {!isCheckingDependencies && !error && !dependencyInfo && (
        <div className="py-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800 mb-1">
                  No se pudo verificar dependencias
                </h4>
                <p className="text-sm text-yellow-700">
                  No se pudo obtener información sobre el uso del ejercicio. Por favor, intenta de nuevo.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={checkDependencies}>
              Reintentar
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default DeleteExerciseModal;
