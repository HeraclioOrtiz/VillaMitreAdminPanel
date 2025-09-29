import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, useToast } from '@/components/ui';
import ExerciseForm from '@/components/gym/ExerciseForm';
import { useCreateExercise } from '@/hooks/useExercises';
import type { ExerciseFormData } from '@/types/exercise';
import {
  ArrowLeftIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

const ExerciseCreatePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const createExerciseMutation = useCreateExercise({
    onSuccess: (exercise) => {
      console.log('ExerciseCreatePage - onSuccess called with:', exercise);
      toast.success(
        'Ejercicio creado',
        `El ejercicio "${exercise.name}" se creó correctamente`
      );
      navigate('/gym/exercises');
    },
    onError: (error) => {
      console.error('ExerciseCreatePage - onError called with:', error);
      toast.error(
        'Error al crear ejercicio',
        'No se pudo crear el ejercicio. Verifica los datos e intenta nuevamente.'
      );
    },
  });

  const handleSubmit = async (data: ExerciseFormData) => {
    console.log('ExerciseCreatePage - handleSubmit called with:', data);
    try {
      const result = await createExerciseMutation.mutateAsync(data);
      console.log('ExerciseCreatePage - mutateAsync result:', result);
      // El éxito se maneja en el callback onSuccess del hook
    } catch (error) {
      // El error se maneja en el callback onError del hook
      console.error('ExerciseCreatePage - handleSubmit catch error:', error);
      throw error; // Re-throw para que el formulario maneje el error
    }
  };

  const handleCancel = () => {
    navigate('/gym/exercises');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            variant="ghost"
            onClick={handleCancel}
            leftIcon={<ArrowLeftIcon className="w-4 h-4" />}
          >
            Volver a Ejercicios
          </Button>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Crear Nuevo Ejercicio
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Completa la información del ejercicio para agregarlo a la biblioteca.
          </p>
        </div>
      </div>

      {/* Información de ayuda */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Consejos para crear un buen ejercicio
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Usa un nombre descriptivo y específico</li>
                <li>Selecciona el grupo muscular principal que trabaja</li>
                <li>Agrega tags relevantes para facilitar la búsqueda</li>
                <li>Escribe instrucciones claras paso a paso</li>
                <li>Si tienes video o imagen, agrégalos para mejor comprensión</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <ExerciseForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={createExerciseMutation.isPending}
      />

      {/* Error de creación */}
      {createExerciseMutation.error && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error al crear el ejercicio
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Ha ocurrido un error al crear el ejercicio. Por favor, verifica los datos e intenta nuevamente.
                </p>
                {/* Mostrar detalles del error si están disponibles */}
                {createExerciseMutation.error instanceof Error && (
                  <p className="mt-1 text-xs">
                    Detalles: {createExerciseMutation.error.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseCreatePage;
