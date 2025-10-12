import React, { useState, useEffect } from 'react';
import { Modal, Button } from '@/components/ui';
import { exerciseService } from '@/services/exercise';
import {
  ExclamationTriangleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface BulkDeleteExercisesModalProps {
  exerciseIds: number[];
  exerciseNames: string[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

/**
 * Modal para confirmar eliminación masiva de ejercicios
 * Verifica dependencias de todos los ejercicios seleccionados
 */
export const BulkDeleteExercisesModal: React.FC<BulkDeleteExercisesModalProps> = ({
  exerciseIds,
  exerciseNames,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isCheckingDependencies, setIsCheckingDependencies] = useState(false);
  const [dependenciesInfo, setDependenciesInfo] = useState<{
    canDeleteAll: boolean;
    exercisesWithDependencies: Array<{
      id: number;
      name: string;
      templatesCount: number;
    }>;
    totalTemplates: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Verificar dependencias cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      checkDependencies();
    } else {
      // Reset state cuando se cierra
      setDependenciesInfo(null);
      setError(null);
      setIsDeleting(false);
    }
  }, [isOpen, exerciseIds]);

  const checkDependencies = async () => {
    setIsCheckingDependencies(true);
    setError(null);
    
    try {
      console.log('🔍 Checking dependencies for exercises:', exerciseIds);
      // Verificar dependencias de cada ejercicio
      const checks = await Promise.all(
        exerciseIds.map(id => exerciseService.checkExerciseDependencies(id))
      );
      console.log('✅ Dependency checks received:', checks);

      const exercisesWithDeps = checks
        .map((check, index) => ({
          id: exerciseIds[index],
          name: exerciseNames[index],
          templatesCount: check.dependencies.daily_templates,
          canDelete: check.can_delete,
        }))
        .filter(item => !item.canDelete);

      const totalTemplates = exercisesWithDeps.reduce(
        (sum, item) => sum + item.templatesCount,
        0
      );

      setDependenciesInfo({
        canDeleteAll: exercisesWithDeps.length === 0,
        exercisesWithDependencies: exercisesWithDeps,
        totalTemplates,
      });
    } catch (err: any) {
      console.error('Error checking dependencies:', err);
      setError(err.message || 'Error al verificar dependencias');
    } finally {
      setIsCheckingDependencies(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      // No cerramos aquí, el padre lo hará después del éxito
    } catch (error) {
      // Error handling is done in parent component
      setIsDeleting(false);
    }
  };

  const renderLoadingState = () => (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-villa-mitre-600 mr-3"></div>
      <span className="text-gray-700">Verificando dependencias de {exerciseIds.length} ejercicios...</span>
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

  const renderConfirmation = () => {
    if (!dependenciesInfo) return null;

    if (dependenciesInfo.canDeleteAll) {
      // Todos los ejercicios pueden eliminarse de forma segura
      return (
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
                  Estos ejercicios no están en uso
                </h4>
                <p className="text-sm text-green-700">
                  Puedes eliminarlos de forma segura sin afectar plantillas o asignaciones.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 mb-2">
              ¿Estás seguro que deseas eliminar <strong>{exerciseIds.length} ejercicios</strong>?
            </p>
            <div className="text-xs text-gray-600 max-h-32 overflow-y-auto">
              {exerciseNames.map((name, index) => (
                <div key={index} className="py-1">• {name}</div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-3">
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
              onClick={handleConfirmDelete}
              isLoading={isDeleting}
              disabled={isDeleting}
            >
              {!isDeleting && <TrashIcon className="w-4 h-4 mr-2" />}
              {isDeleting ? 'Eliminando...' : `Eliminar ${exerciseIds.length} Ejercicios`}
            </Button>
          </div>
        </div>
      );
    } else {
      // Algunos ejercicios tienen dependencias
      return (
        <div className="py-6">
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-red-900 mb-2">
                  ⚠️ Algunos ejercicios están en uso
                </h4>
                <p className="text-sm text-red-800">
                  {dependenciesInfo.exercisesWithDependencies.length} de {exerciseIds.length} ejercicios 
                  seleccionados están siendo usados en <strong>{dependenciesInfo.totalTemplates}</strong> plantillas.
                </p>
              </div>
            </div>
          </div>

          {/* Lista de ejercicios con dependencias */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 max-h-48 overflow-y-auto">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Ejercicios con plantillas:</h4>
            {dependenciesInfo.exercisesWithDependencies.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                <span className="text-sm text-gray-700">{item.name}</span>
                <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded">
                  {item.templatesCount} {item.templatesCount === 1 ? 'plantilla' : 'plantillas'}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Opciones recomendadas:</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Deselecciona los ejercicios que están en uso</li>
              <li>Edita las plantillas para reemplazar estos ejercicios</li>
              <li>Elimina solo los ejercicios sin dependencias</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3">
            <Button 
              variant="secondary" 
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancelar y Revisar
            </Button>
          </div>
        </div>
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Eliminar ${exerciseIds.length} Ejercicios`}
      size="lg"
    >
      {isCheckingDependencies && renderLoadingState()}
      {!isCheckingDependencies && error && renderErrorState()}
      {!isCheckingDependencies && !error && dependenciesInfo && renderConfirmation()}
      {!isCheckingDependencies && !error && !dependenciesInfo && (
        <div className="py-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800 mb-1">
                  No se pudo verificar dependencias
                </h4>
                <p className="text-sm text-yellow-700">
                  No se pudo obtener información sobre el uso de los ejercicios. Por favor, intenta de nuevo.
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

export default BulkDeleteExercisesModal;
