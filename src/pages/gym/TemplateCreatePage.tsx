import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wizard, useToast } from '@/components/ui';
import TemplateBasicInfoStep from '@/components/gym/TemplateBasicInfoStep';
import TemplateExerciseStep from '@/components/gym/TemplateExerciseStep';
import TemplateSetsStep from '@/components/gym/TemplateSetsStep';
import { useCreateTemplate } from '@/hooks/useTemplates';
import type { TemplateFormData } from '@/types/template';
import type { WizardStep } from '@/hooks/useWizard';
import {
  InformationCircleIcon,
  ListBulletIcon,
  CogIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

const TemplateCreatePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [wizardData, setWizardData] = useState<Partial<TemplateFormData>>({});

  // Hook para crear plantilla
  const createTemplateMutation = useCreateTemplate({
    onSuccess: (template) => {
      toast.success(
        'Plantilla creada',
        `La plantilla "${template.name}" se creó exitosamente`
      );
      navigate('/gym/daily-templates');
    },
    onError: (error) => {
      toast.error(
        'Error al crear plantilla',
        'No se pudo crear la plantilla. Inténtalo nuevamente.'
      );
    },
  });

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
      console.log('📋 Datos del wizard completo:', data);
      
      // Combinar todos los datos de los 3 pasos del wizard
      const templateData: TemplateFormData = {
        // Paso 1: Información básica
        name: data['basic-info']?.name || '',
        description: data['basic-info']?.description || '',
        estimated_duration: data['basic-info']?.estimated_duration || 60,
        difficulty: data['basic-info']?.difficulty || 'intermediate',
        primary_goal: data['basic-info']?.primary_goal || 'hypertrophy',
        secondary_goals: data['basic-info']?.secondary_goals || [],
        intensity_level: data['basic-info']?.intensity_level || 'moderate',
        target_muscle_groups: data['basic-info']?.target_muscle_groups || [],
        equipment_needed: data['basic-info']?.equipment_needed || [],
        tags: data['basic-info']?.tags || [],
        is_public: data['basic-info']?.is_public || false,
        
        // Paso 2: Ejercicios seleccionados (ID: 'exercises')
        // Paso 3: Series configuradas (ID: 'sets-config') - tiene prioridad
        exercises: data['sets-config']?.exercises || data['exercises']?.exercises || [],
        
        // Campos opcionales
        warm_up_notes: data['basic-info']?.warm_up_notes || '',
        cool_down_notes: data['basic-info']?.cool_down_notes || '',
        progression_notes: data['basic-info']?.progression_notes || '',
        variations: data['basic-info']?.variations || [],
        prerequisites: data['basic-info']?.prerequisites || [],
        contraindications: data['basic-info']?.contraindications || [],
      };

      console.log('📤 Enviando templateData:', templateData);
      await createTemplateMutation.mutateAsync(templateData);
    } catch (error) {
      // El error ya se maneja en el callback del hook
      throw error;
    }
  };

  // Manejar cancelación
  const handleCancel = () => {
    navigate('/gym/daily-templates');
  };

  // Manejar cambio de paso
  const handleStepChange = (currentStep: number, previousStep: number) => {
    // Aquí se puede agregar lógica adicional cuando cambia el paso
    // Por ejemplo: guardar progreso, analytics, etc.
  };

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
              Crear Nueva Plantilla Diaria
            </h1>
            <p className="mt-2 text-gray-600">
              Crea una plantilla de entrenamiento personalizada siguiendo estos 3 pasos simples
            </p>
          </div>
        </div>

        {/* Wizard */}
        <Wizard
          steps={wizardSteps}
          onComplete={handleWizardComplete}
          onCancel={handleCancel}
          onStepChange={handleStepChange}
          title="Crear Plantilla Diaria"
          subtitle="Sigue estos pasos para crear tu plantilla personalizada"
          showProgress={true}
          showStepIndicator={true}
          validateOnNext={true}
          confirmOnCancel={true}
          nextButtonText="Continuar"
          previousButtonText="Anterior"
          finishButtonText="Crear Plantilla"
          cancelButtonText="Cancelar"
        >
          {/* El contenido se renderiza dinámicamente por el wizard */}
        </Wizard>

        {/* Información adicional */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start">
            <InformationCircleIcon className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                ¿Qué es una plantilla diaria?
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Las plantillas diarias son rutinas de entrenamiento predefinidas que puedes asignar 
                a tus estudiantes. Cada plantilla incluye ejercicios específicos con configuraciones 
                de series, repeticiones y descansos.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-start">
                  <InformationCircleIcon className="w-4 h-4 text-villa-mitre-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-medium text-gray-900">Paso 1: Información</h4>
                    <p className="text-xs text-gray-600">
                      Define objetivos, duración y grupos musculares
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <ListBulletIcon className="w-4 h-4 text-villa-mitre-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-medium text-gray-900">Paso 2: Ejercicios</h4>
                    <p className="text-xs text-gray-600">
                      Selecciona y ordena los ejercicios
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CogIcon className="w-4 h-4 text-villa-mitre-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-medium text-gray-900">Paso 3: Configuración</h4>
                    <p className="text-xs text-gray-600">
                      Configura series, reps y descansos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estado de carga global */}
        {createTemplateMutation.isPending && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-villa-mitre-600 mr-3"></div>
                <span className="text-gray-900">Creando plantilla...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateCreatePage;
