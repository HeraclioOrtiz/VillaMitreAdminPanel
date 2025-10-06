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
      toast.success(
        '✅ Ejercicio creado exitosamente',
        `"${exercise.name}" se agregó a la biblioteca`
      );
      navigate('/gym/exercises');
    },
    onError: (error) => {
      toast.error(
        '❌ Error al crear ejercicio',
        'Verifica los datos e intenta nuevamente'
      );
    },
  });

  const handleSubmit = async (data: ExerciseFormData) => {
    try {
      await createExerciseMutation.mutateAsync(data);
    } catch (error) {
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/gym/exercises');
  };

  return (
    <div className="w-full">
      {/* Header Moderno */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleCancel}
          leftIcon={<ArrowLeftIcon className="w-5 h-5" />}
          className="mb-4 hover:bg-gray-100 transition-colors"
        >
          Volver a Ejercicios
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Crear Nuevo Ejercicio
            </h1>
            <p className="text-base text-gray-600">
              Completa la información para agregar un ejercicio a la biblioteca
            </p>
          </div>
        </div>
      </div>

      {/* Tarjeta de Ayuda Mejorada */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 shadow-sm">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <InformationCircleIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              💡 Consejos para crear un ejercicio efectivo
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-blue-800">
              <div className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Usa un nombre descriptivo y específico</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Selecciona los grupos musculares principales</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Agrega tags relevantes para búsqueda</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Escribe instrucciones claras paso a paso</span>
              </div>
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
    </div>
  );
};

export default ExerciseCreatePage;
