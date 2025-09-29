import React from 'react';
import Modal from '@/components/ui/Modal';
import ExerciseCard from './ExerciseCard';
import { Button } from '@/components/ui';
import type { Exercise } from '@/types/exercise';
import {
  PencilIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';

interface ExercisePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise | null;
  onEdit?: (exercise: Exercise) => void;
  onDuplicate?: (exercise: Exercise) => void;
  onDelete?: (exercise: Exercise) => void;
  onStartWorkout?: (exercise: Exercise) => void;
  loading?: boolean;
}

const ExercisePreviewModal = ({
  isOpen,
  onClose,
  exercise,
  onEdit,
  onDuplicate,
  onDelete,
  onStartWorkout,
  loading = false,
}: ExercisePreviewModalProps) => {

  if (!exercise && !loading) {
    return null;
  }

  const handleEdit = () => {
    if (exercise && onEdit) {
      onEdit(exercise);
      onClose();
    }
  };

  const handleDuplicate = () => {
    if (exercise && onDuplicate) {
      onDuplicate(exercise);
      onClose();
    }
  };

  const handleDelete = () => {
    if (exercise && onDelete) {
      onDelete(exercise);
      onClose();
    }
  };

  const handleStartWorkout = () => {
    if (exercise && onStartWorkout) {
      onStartWorkout(exercise);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={loading ? 'Cargando ejercicio...' : exercise?.name}
      size="lg"
      className="max-h-[90vh] overflow-hidden"
      contentClassName="overflow-y-auto"
    >
      {loading ? (
        // Estado de carga
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-villa-mitre-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información del ejercicio...</p>
          </div>
        </div>
      ) : exercise ? (
        <div className="space-y-6">
          {/* Tarjeta del ejercicio */}
          <div className="border-0 shadow-none">
            <ExerciseCard 
              exercise={exercise}
              className="border-0 shadow-none"
            />
          </div>

          {/* Instrucciones detalladas */}
          {exercise.instructions && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Instrucciones Detalladas
              </h4>
              <div className="space-y-2">
                {exercise.instructions.split('\n').map((instruction, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-villa-mitre-100 text-villa-mitre-700 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {instruction}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Consejos y precauciones */}
          {exercise.tips && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                💡 Consejos y Precauciones
              </h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                {exercise.tips}
              </p>
            </div>
          )}

          {/* Variaciones */}
          {exercise.variations && exercise.variations.length > 0 && (
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-green-900 mb-3">
                🔄 Variaciones
              </h4>
              <div className="space-y-2">
                {exercise.variations.map((variation, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <p className="text-sm text-green-800">
                      {variation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Información técnica */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Movimiento
              </p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {exercise.movement_pattern || 'No especificado'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Fuerza Requerida
              </p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {exercise.force_type || 'No especificado'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Mecánica
              </p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {exercise.mechanics || 'No especificado'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Preparación
              </p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {exercise.preparation || 'No especificado'}
              </p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            {onStartWorkout && (
              <Button
                variant="primary"
                onClick={handleStartWorkout}
                leftIcon={<PlayIcon className="w-4 h-4" />}
                className="flex-1 sm:flex-none"
              >
                Iniciar Entrenamiento
              </Button>
            )}
            
            {onEdit && (
              <Button
                variant="secondary"
                onClick={handleEdit}
                leftIcon={<PencilIcon className="w-4 h-4" />}
                className="flex-1 sm:flex-none"
              >
                Editar
              </Button>
            )}
            
            {onDuplicate && (
              <Button
                variant="secondary"
                onClick={handleDuplicate}
                leftIcon={<DocumentDuplicateIcon className="w-4 h-4" />}
                className="flex-1 sm:flex-none"
              >
                Duplicar
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="danger"
                onClick={handleDelete}
                leftIcon={<TrashIcon className="w-4 h-4" />}
                className="flex-1 sm:flex-none"
              >
                Eliminar
              </Button>
            )}
          </div>
        </div>
      ) : (
        // Estado de error
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Ejercicio no encontrado
          </h3>
          <p className="text-gray-600 mb-6">
            No se pudo cargar la información del ejercicio.
          </p>
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default ExercisePreviewModal;
