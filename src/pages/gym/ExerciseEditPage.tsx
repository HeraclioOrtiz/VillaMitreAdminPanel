import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import ExerciseForm from '@/components/gym/ExerciseForm';
import { FormSkeleton } from '@/components/ui/TableSkeleton';
import { useExercise, useUpdateExercise } from '@/hooks/useExercises';
import type { ExerciseFormData } from '@/types/exercise';
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const ExerciseEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const exerciseId = parseInt(id || '0', 10);
  
  // Hooks de React Query
  const { data: exercise, isLoading, error } = useExercise(exerciseId);
  const updateExerciseMutation = useUpdateExercise();

  const handleSubmit = async (data: ExerciseFormData) => {
    try {
      await updateExerciseMutation.mutateAsync({ id: exerciseId, data });
      // TODO: Mostrar toast de éxito
      navigate('/gym/exercises');
    } catch (error) {
      // TODO: Mostrar toast de error
      console.error('Error updating exercise:', error);
      throw error; // Re-throw para que el formulario maneje el error
    }
  };

  const handleCancel = () => {
    navigate('/gym/exercises');
  };

  // Manejar ID inválido
  if (!id || isNaN(exerciseId)) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">ID de ejercicio inválido</h3>
          <p className="mt-1 text-sm text-gray-500">
            El ID proporcionado no es válido.
          </p>
          <div className="mt-6">
            <Button
              variant="primary"
              onClick={() => navigate('/gym/exercises')}
            >
              Volver a Ejercicios
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Estado de carga
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-9 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Form skeleton */}
        <FormSkeleton fields={8} />
      </div>
    );
  }

  // Estado de error
  if (error || !exercise) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Error al cargar el ejercicio
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {error instanceof Error 
              ? error.message 
              : 'No se pudo cargar la información del ejercicio.'
            }
          </p>
          <div className="mt-6 flex justify-center space-x-3">
            <Button
              variant="secondary"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/gym/exercises')}
            >
              Volver a Ejercicios
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            Editar Ejercicio
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Modifica la información del ejercicio "{exercise.name}".
          </p>
        </div>
      </div>

      {/* Información del ejercicio actual */}
      <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start space-x-4">
          {/* Thumbnail */}
          <div className="flex-shrink-0">
            {exercise.image_url ? (
              <img
                src={exercise.image_url}
                alt={exercise.name}
                className="h-16 w-16 rounded-lg object-cover border border-gray-200"
              />
            ) : (
              <div className="h-16 w-16 rounded-lg bg-villa-mitre-100 flex items-center justify-center border border-gray-200">
                <span className="text-villa-mitre-600 font-semibold text-lg">
                  {exercise.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Información */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {exercise.name}
            </h3>
            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
              <span>ID: {exercise.id}</span>
              <span>•</span>
              <span>
                Creado: {new Date(exercise.created_at).toLocaleDateString('es-ES')}
              </span>
              {exercise.updated_at !== exercise.created_at && (
                <>
                  <span>•</span>
                  <span>
                    Modificado: {new Date(exercise.updated_at).toLocaleDateString('es-ES')}
                  </span>
                </>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {exercise.tags?.slice(0, 5).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
              {(exercise.tags?.length || 0) > 5 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  +{(exercise.tags?.length || 0) - 5} más
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <ExerciseForm
        mode="edit"
        initialData={exercise}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={updateExerciseMutation.isPending}
      />

      {/* Error de actualización */}
      {updateExerciseMutation.error && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error al actualizar el ejercicio
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Ha ocurrido un error al actualizar el ejercicio. Por favor, verifica los datos e intenta nuevamente.
                </p>
                {/* Mostrar detalles del error si están disponibles */}
                {updateExerciseMutation.error instanceof Error && (
                  <p className="mt-1 text-xs">
                    Detalles: {updateExerciseMutation.error.message}
                  </p>
                )}
              </div>
              <div className="mt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => updateExerciseMutation.reset()}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseEditPage;
