import React, { useState, useEffect } from 'react';
import { Modal, Button } from '@/components/ui';
import { setService, type UpdateSetData, type DailyTemplateSet } from '@/services/set';
import { useToast } from '@/components/ui';
import {
  PencilIcon,
  TrashIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

interface QuickEditSetModalProps {
  set: DailyTemplateSet | null;
  exerciseName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Modal para edición rápida de un set individual
 * Permite editar o eliminar un set sin recargar toda la plantilla
 */
export const QuickEditSetModal: React.FC<QuickEditSetModalProps> = ({
  set,
  exerciseName,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [formData, setFormData] = useState<UpdateSetData>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Inicializar datos del formulario cuando cambia el set
  useEffect(() => {
    if (set) {
      setFormData({
        set_number: set.set_number,
        reps_min: set.reps_min ?? undefined,
        reps_max: set.reps_max ?? undefined,
        rest_seconds: set.rest_seconds ?? undefined,
        rpe_target: set.rpe_target ?? undefined,
        weight_min: set.weight_min ?? undefined,
        weight_max: set.weight_max ?? undefined,
        weight_target: set.weight_target ?? undefined,
        notes: set.notes ?? undefined,
      });
    }
  }, [set]);

  const handleInputChange = (field: keyof UpdateSetData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value,
    }));
  };

  const handleSave = async () => {
    if (!set) return;

    setIsSaving(true);
    try {
      await setService.updateSet(set.id, formData);
      toast.success(
        'Set actualizado',
        'Los cambios se guardaron correctamente'
      );
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(
        'Error al actualizar',
        error.message || 'No se pudo actualizar el set'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!set) return;

    const confirmed = window.confirm('¿Estás seguro de eliminar este set?');
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await setService.deleteSet(set.id);
      toast.success(
        'Set eliminado',
        'El set se eliminó correctamente'
      );
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(
        'Error al eliminar',
        error.message || 'No se pudo eliminar el set'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (!set) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Editar Set ${set.set_number} - ${exerciseName}`}
      size="lg"
    >
      <div className="py-6">
        {/* Info del ejercicio */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-sm text-gray-700">
            <strong>Ejercicio:</strong> {exerciseName}
          </div>
          <div className="text-sm text-gray-700">
            <strong>Set:</strong> #{set.set_number}
          </div>
        </div>

        {/* Formulario de edición */}
        <div className="space-y-6">
          {/* Repeticiones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repeticiones
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Mínimo</label>
                <input
                  type="number"
                  min="0"
                  value={formData.reps_min ?? ''}
                  onChange={(e) => handleInputChange('reps_min', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-villa-mitre-500 focus:border-villa-mitre-500"
                  placeholder="Ej: 8"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Máximo</label>
                <input
                  type="number"
                  min="0"
                  value={formData.reps_max ?? ''}
                  onChange={(e) => handleInputChange('reps_max', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-villa-mitre-500 focus:border-villa-mitre-500"
                  placeholder="Ej: 12"
                />
              </div>
            </div>
          </div>

          {/* Peso */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Peso (kg)
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Mínimo</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.weight_min ?? ''}
                  onChange={(e) => handleInputChange('weight_min', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-villa-mitre-500 focus:border-villa-mitre-500"
                  placeholder="Min"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Objetivo</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.weight_target ?? ''}
                  onChange={(e) => handleInputChange('weight_target', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-villa-mitre-500 focus:border-villa-mitre-500"
                  placeholder="Target"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Máximo</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.weight_max ?? ''}
                  onChange={(e) => handleInputChange('weight_max', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-villa-mitre-500 focus:border-villa-mitre-500"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>

          {/* Descanso y RPE */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descanso (segundos)
              </label>
              <input
                type="number"
                min="0"
                value={formData.rest_seconds ?? ''}
                onChange={(e) => handleInputChange('rest_seconds', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-villa-mitre-500 focus:border-villa-mitre-500"
                placeholder="Ej: 90"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RPE (0-10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={formData.rpe_target ?? ''}
                onChange={(e) => handleInputChange('rpe_target', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-villa-mitre-500 focus:border-villa-mitre-500"
                placeholder="Ej: 8"
              />
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas
            </label>
            <textarea
              rows={3}
              value={formData.notes ?? ''}
              onChange={(e) => handleInputChange('notes', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-villa-mitre-500 focus:border-villa-mitre-500"
              placeholder="Notas adicionales para este set..."
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-8 flex justify-between items-center">
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Eliminando...
              </>
            ) : (
              <>
                <TrashIcon className="w-4 h-4 mr-2" />
                Eliminar Set
              </>
            )}
          </Button>

          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isSaving || isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSaving || isDeleting}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QuickEditSetModal;
