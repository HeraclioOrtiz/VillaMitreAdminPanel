import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Wizard, useToast } from '@/components/ui';
import TemplateBasicInfoStep from '@/components/gym/TemplateBasicInfoStep';
import TemplateExerciseStep from '@/components/gym/TemplateExerciseStep';
import TemplateSetsStep from '@/components/gym/TemplateSetsStep';
import { useTemplate, useUpdateTemplate } from '@/hooks/useTemplates';
import { useWizard } from '@/hooks/useWizard';
import type { TemplateFormData, DailyTemplate } from '@/types/template';
import type { WizardStep } from '@/hooks/useWizard';
import {
  InformationCircleIcon,
  ListBulletIcon,
  CogIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

// Componente interno para el wizard de edición
interface EditTemplateWizardProps {
  initialData: Partial<TemplateFormData>;
  onComplete: (data: any) => Promise<void>;
  onCancel: () => void;
}

const EditTemplateWizard: React.FC<EditTemplateWizardProps> = ({
  initialData,
  onComplete,
  onCancel,
}) => {
  const toast = useToast();

  // Configuración de pasos del wizard
  const wizardSteps: WizardStep[] = [
    {
      id: 'basic-info',
      title: 'Información General',
      description: 'Configura los datos básicos de la plantilla',
      component: TemplateBasicInfoStep,
    },
    {
      id: 'exercises',
      title: 'Seleccionar Ejercicios',
      description: 'Elige los ejercicios que incluirá la plantilla',
      component: TemplateExerciseStep,
    },
    {
      id: 'sets-config',
      title: 'Configurar Series',
      description: 'Define las series, repeticiones y descansos',
      component: TemplateSetsStep,
    },
  ];

  // Hook del wizard
  const [wizardState, wizardActions] = useWizard({
    steps: wizardSteps,
    initialStep: 0,
    allowSkipSteps: false,
    validateOnNext: true,
  });

  // Inicializar datos cuando se monta el componente
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      // Distribuir los datos iniciales a los pasos correspondientes
      wizardActions.updateStepData('basic-info', initialData);
      if (initialData.exercises) {
        wizardActions.updateStepData('exercises', { exercises: initialData.exercises });
        wizardActions.updateStepData('sets-config', { exercises: initialData.exercises });
      }
    }
  }, [initialData, wizardActions]);

  // Manejar finalización del wizard
  const handleComplete = async () => {
    try {
      await onComplete(wizardState.data);
    } catch (error) {
      console.error('Error completing wizard:', error);
    }
  };

  // Renderizar el paso actual
  const renderCurrentStep = () => {
    const currentStep = wizardState.steps[wizardState.currentStep];
    if (!currentStep?.component) return null;

    const StepComponent = currentStep.component;
    const stepData = wizardActions.getData(currentStep.id);

    return (
      <StepComponent
        data={stepData}
        onDataChange={(data: any) => wizardActions.updateStepData(currentStep.id, data)}
        onValidationChange={(isValid: boolean) => {
          if (isValid) {
            wizardActions.markStepAsCompleted(currentStep.id);
          } else {
            wizardActions.markStepAsIncomplete(currentStep.id);
          }
        }}
        errors={wizardState.errors[currentStep.id] || []}
        isLoading={wizardState.isLoading}
      />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header del wizard */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Editar Plantilla Diaria</h2>
        <p className="mt-1 text-sm text-gray-600">Modifica los datos de tu plantilla personalizada</p>
      </div>

      {/* Indicador de progreso */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            {wizardState.steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center space-x-2 ${
                  index === wizardState.currentStep
                    ? 'text-villa-mitre-600'
                    : index < wizardState.currentStep
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index === wizardState.currentStep
                      ? 'bg-villa-mitre-600 text-white'
                      : index < wizardState.currentStep
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                <div>
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-500">
            Paso {wizardState.currentStep + 1} de {wizardState.steps.length}
          </div>
        </div>
      </div>

      {/* Contenido del paso actual */}
      <div className="px-6 py-6">
        {renderCurrentStep()}
      </div>

      {/* Footer con botones de navegación */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div>
          {wizardState.currentStep > 0 && (
            <button
              onClick={wizardActions.previousStep}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-villa-mitre-500"
            >
              Anterior
            </button>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-villa-mitre-500"
          >
            Cancelar
          </button>

          {wizardState.currentStep === wizardState.steps.length - 1 ? (
            <button
              onClick={handleComplete}
              disabled={wizardState.isLoading || !wizardState.steps[wizardState.currentStep]?.isCompleted}
              className="px-4 py-2 text-sm font-medium text-white bg-villa-mitre-600 border border-transparent rounded-md hover:bg-villa-mitre-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-villa-mitre-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {wizardState.isLoading ? 'Actualizando...' : 'Actualizar Plantilla'}
            </button>
          ) : (
            <button
              onClick={wizardActions.nextStep}
              disabled={!wizardState.steps[wizardState.currentStep]?.isCompleted}
              className="px-4 py-2 text-sm font-medium text-white bg-villa-mitre-600 border border-transparent rounded-md hover:bg-villa-mitre-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-villa-mitre-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const TemplateEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const [wizardData, setWizardData] = useState<Partial<TemplateFormData>>({});
  const [isWizardReady, setIsWizardReady] = useState(false);

  // Validar ID
  const templateId = id ? parseInt(id, 10) : null;
  
  if (!templateId || isNaN(templateId)) {
    navigate('/gym/daily-templates');
    return null;
  }

  // Cargar datos de la plantilla existente
  const { data: template, isLoading: isLoadingTemplate, error } = useTemplate(templateId);

  // Hook para actualizar plantilla
  const updateTemplateMutation = useUpdateTemplate({
    onSuccess: (updatedTemplate) => {
      toast.success(
        'Plantilla actualizada',
        `La plantilla "${updatedTemplate.name}" se actualizó exitosamente`
      );
      navigate('/gym/daily-templates');
    },
    onError: (error) => {
      console.error('Update template error:', error);
      toast.error(
        'Error al actualizar plantilla',
        'No se pudo actualizar la plantilla. Inténtalo nuevamente.'
      );
    },
  });

  // Convertir DailyTemplate a TemplateFormData cuando se carga
  useEffect(() => {
    if (template) {
      const formData: Partial<TemplateFormData> = {
        name: template.name || template.title, // Backend usa 'title', frontend usa 'name'
        description: template.description,
        difficulty: template.difficulty || template.level, // Backend usa 'level', frontend usa 'difficulty'
        estimated_duration: template.estimated_duration_min, // Backend usa 'estimated_duration_min'
        primary_goal: (template.primary_goal || template.goal) as 'strength' | 'hypertrophy' | 'endurance' | 'power' | 'flexibility' | 'cardio' | undefined, // Backend usa 'goal', frontend usa 'primary_goal'
        secondary_goals: template.secondary_goals || [],
        target_muscle_groups: template.target_muscle_groups || [],
        equipment_needed: template.equipment_needed || [],
        intensity_level: template.intensity_level,
        tags: template.tags || [],
        is_public: template.is_public || false,
        warm_up_notes: template.warm_up_notes || '',
        cool_down_notes: template.cool_down_notes || '',
        progression_notes: template.progression_notes || '',
        variations: template.variations || [],
        prerequisites: template.prerequisites || [],
        contraindications: template.contraindications || [],
        exercises: template.exercises || [],
      };
      setWizardData(formData);
      setIsWizardReady(true);
    }
  }, [template]);

  // Configuración de pasos del wizard
  const wizardSteps: WizardStep[] = [
    {
      id: 'basic-info',
      title: 'Información General',
      description: 'Configura los datos básicos de la plantilla',
      component: TemplateBasicInfoStep,
    },
    {
      id: 'exercises',
      title: 'Seleccionar Ejercicios',
      description: 'Elige los ejercicios que incluirá la plantilla',
      component: TemplateExerciseStep,
    },
    {
      id: 'sets-config',
      title: 'Configurar Series',
      description: 'Define las series, repeticiones y descansos',
      component: TemplateSetsStep,
    },
  ];

  // Manejar finalización del wizard
  const handleWizardComplete = async (data: any) => {
    try {
      // Combinar todos los datos del wizard
      const templateData: TemplateFormData = {
        ...data['basic-info'],
        exercises: data['sets-config']?.exercises || data['exercises'] || [],
        // Valores por defecto para campos requeridos
        warm_up_notes: data['basic-info']?.warm_up_notes || '',
        cool_down_notes: data['basic-info']?.cool_down_notes || '',
        progression_notes: data['basic-info']?.progression_notes || '',
        variations: data['basic-info']?.variations || [],
        prerequisites: data['basic-info']?.prerequisites || [],
        contraindications: data['basic-info']?.contraindications || [],
      };

      await updateTemplateMutation.mutateAsync({ 
        id: templateId, 
        data: templateData 
      });
    } catch (error) {
      // El error ya se maneja en el callback del hook
      throw error;
    }
  };

  // Manejar cancelación
  const handleCancel = () => {
    navigate('/gym/daily-templates');
  };

  // Estados de carga y error
  if (isLoadingTemplate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-sm">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-villa-mitre-600 mr-3"></div>
            <span className="text-gray-900">Cargando plantilla...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-sm text-center">
          <div className="text-red-500 mb-4">
            <InformationCircleIcon className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error al cargar plantilla
          </h3>
          <p className="text-gray-600 mb-4">
            No se pudo cargar la plantilla solicitada. Puede que no exista o no tengas permisos para editarla.
          </p>
          <button
            onClick={() => navigate('/gym/daily-templates')}
            className="bg-villa-mitre-600 text-white px-4 py-2 rounded-md hover:bg-villa-mitre-700 transition-colors"
          >
            Volver a Plantillas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate('/gym/daily-templates')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Volver a Plantillas
            </button>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Editar Plantilla: {template.name}
            </h1>
            <p className="mt-2 text-gray-600">
              Modifica los datos de tu plantilla de entrenamiento siguiendo estos 3 pasos
            </p>
          </div>
        </div>

        {/* Wizard - Solo renderizar cuando tenemos datos */}
        {isWizardReady && (
          <EditTemplateWizard
            initialData={wizardData}
            onComplete={handleWizardComplete}
            onCancel={handleCancel}
          />
        )}

        {/* Información adicional */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start">
            <InformationCircleIcon className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Editando plantilla existente
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Estás modificando una plantilla existente. Los cambios se aplicarán inmediatamente 
                y afectarán a futuras asignaciones que usen esta plantilla.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-start">
                  <InformationCircleIcon className="w-4 h-4 text-villa-mitre-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-medium text-gray-900">Paso 1: Información</h4>
                    <p className="text-xs text-gray-600">
                      Modifica objetivos, duración y grupos musculares
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <ListBulletIcon className="w-4 h-4 text-villa-mitre-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-medium text-gray-900">Paso 2: Ejercicios</h4>
                    <p className="text-xs text-gray-600">
                      Cambia, agrega o reordena ejercicios
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CogIcon className="w-4 h-4 text-villa-mitre-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-medium text-gray-900">Paso 3: Configuración</h4>
                    <p className="text-xs text-gray-600">
                      Ajusta series, reps y descansos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estado de carga global */}
        {updateTemplateMutation.isPending && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-villa-mitre-600 mr-3"></div>
                <span className="text-gray-900">Actualizando plantilla...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateEditPage;
