import React, { useState } from 'react';
import Button from './Button';
import StepIndicator, { CompactStepIndicator } from './StepIndicator';
import { useWizard, type WizardConfig, type WizardStep } from '@/hooks/useWizard';
import { useToast } from '@/hooks/useToast';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface WizardProps extends Omit<WizardConfig, 'onComplete' | 'onCancel'> {
  children?: React.ReactNode;
  onComplete?: (data: any) => Promise<void> | void;
  onCancel?: () => void;
  
  // Configuración de UI
  title?: string;
  subtitle?: string;
  showProgress?: boolean;
  showStepIndicator?: boolean;
  compactMode?: boolean;
  
  // Configuración de navegación
  showNavigationButtons?: boolean;
  nextButtonText?: string;
  previousButtonText?: string;
  finishButtonText?: string;
  cancelButtonText?: string;
  
  // Configuración de validación
  showValidationErrors?: boolean;
  confirmOnCancel?: boolean;
  
  // Estilos
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
}

const Wizard = ({
  children,
  steps,
  initialStep = 0,
  allowSkipSteps = false,
  validateOnNext = true,
  onStepChange,
  onComplete,
  onCancel,
  
  // UI
  title,
  subtitle,
  showProgress = true,
  showStepIndicator = true,
  compactMode = false,
  
  // Navegación
  showNavigationButtons = true,
  nextButtonText = 'Siguiente',
  previousButtonText = 'Anterior',
  finishButtonText = 'Finalizar',
  cancelButtonText = 'Cancelar',
  
  // Validación
  showValidationErrors = true,
  confirmOnCancel = true,
  
  // Estilos
  className = '',
  contentClassName = '',
  headerClassName = '',
  footerClassName = '',
}: WizardProps) => {
  
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Configurar wizard
  const wizardConfig: WizardConfig = {
    steps,
    initialStep,
    allowSkipSteps,
    validateOnNext,
    onStepChange,
    onComplete: async (data) => {
      setIsSubmitting(true);
      try {
        await onComplete?.(data);
        toast.success('¡Completado!', 'El proceso se completó exitosamente');
      } catch (error) {
        toast.error('Error', 'Hubo un problema al completar el proceso');
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    onCancel,
  };

  const [wizardState, wizardActions] = useWizard(wizardConfig);
  const currentStepData = wizardState.steps[wizardState.currentStep];
  const stepErrors = wizardState.errors[currentStepData?.id] || [];

  // Manejar cancelación con confirmación
  const handleCancel = () => {
    if (confirmOnCancel && Object.keys(wizardState.data).length > 0) {
      if (window.confirm('¿Estás seguro de que quieres cancelar? Se perderán los cambios no guardados.')) {
        onCancel?.();
      }
    } else {
      onCancel?.();
    }
  };

  // Manejar navegación con validación
  const handleNext = async () => {
    wizardActions.setLoading(true);
    
    try {
      const success = await wizardActions.nextStep();
      if (!success && showValidationErrors) {
        toast.warning(
          'Paso incompleto',
          'Por favor completa los campos requeridos antes de continuar'
        );
      }
    } catch (error) {
      if (showValidationErrors) {
        toast.error('Error de validación', 'Hubo un problema al validar el paso actual');
      }
    } finally {
      wizardActions.setLoading(false);
    }
  };

  const handlePrevious = () => {
    wizardActions.previousStep();
  };

  // Renderizar contenido del paso actual
  const renderStepContent = () => {
    const StepComponent = currentStepData?.component;
    
    if (StepComponent && currentStepData) {
      return (
        <StepComponent
          data={wizardActions.getData(currentStepData.id)}
          onDataChange={(data: any) => wizardActions.updateStepData(currentStepData.id, data)}
          onValidationChange={(isValid: boolean) => {
            if (isValid) {
              wizardActions.markStepAsCompleted(currentStepData.id);
            } else {
              wizardActions.markStepAsIncomplete(currentStepData.id);
            }
          }}
          errors={stepErrors}
          isLoading={wizardState.isLoading}
        />
      );
    }
    
    return children || null;
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className={`border-b border-gray-200 ${headerClassName}`}>
        <div className="px-6 py-4">
          {/* Título y subtítulo */}
          <div className="flex items-center justify-between mb-4">
            <div>
              {title && (
                <h2 className="text-xl font-semibold text-gray-900">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            
            {onCancel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Indicador de progreso */}
          {showProgress && (
            <div className="mb-4">
              {compactMode ? (
                <CompactStepIndicator
                  steps={wizardState.steps}
                  currentStep={wizardState.currentStep}
                />
              ) : showStepIndicator ? (
                <StepIndicator
                  steps={wizardState.steps}
                  currentStep={wizardState.currentStep}
                  onStepClick={wizardActions.goToStep}
                  allowClickNavigation={allowSkipSteps}
                  showLabels={!compactMode}
                  showDescriptions={false}
                />
              ) : null}
            </div>
          )}

          {/* Información del paso actual */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {currentStepData?.title}
              </h3>
              {currentStepData?.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {currentStepData.description}
                </p>
              )}
            </div>
            
            {currentStepData?.isOptional && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Opcional
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`px-6 py-6 ${contentClassName}`}>
        {/* Errores de validación */}
        {showValidationErrors && stepErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-red-800 mb-2">
                  Se encontraron errores en este paso:
                </h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {stepErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Contenido del paso */}
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>
      </div>

      {/* Footer con navegación */}
      {showNavigationButtons && (
        <div className={`border-t border-gray-200 px-6 py-4 ${footerClassName}`}>
          <div className="flex items-center justify-between">
            <div>
              {!wizardActions.isFirstStep && (
                <Button
                  variant="secondary"
                  onClick={handlePrevious}
                  disabled={wizardState.isLoading || isSubmitting}
                  leftIcon={<ChevronLeftIcon className="w-4 h-4" />}
                >
                  {previousButtonText}
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {onCancel && (
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={wizardState.isLoading || isSubmitting}
                >
                  {cancelButtonText}
                </Button>
              )}

              <Button
                variant="primary"
                onClick={handleNext}
                disabled={
                  wizardState.isLoading || 
                  isSubmitting || 
                  (!wizardActions.canGoNext && validateOnNext)
                }
                isLoading={wizardState.isLoading || isSubmitting}
                rightIcon={
                  !wizardActions.isLastStep ? (
                    <ChevronRightIcon className="w-4 h-4" />
                  ) : undefined
                }
              >
                {wizardActions.isLastStep ? finishButtonText : nextButtonText}
              </Button>
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span>
              {wizardActions.completedStepsCount} de {wizardActions.totalSteps} pasos completados
            </span>
            <span>
              {wizardActions.progressPercentage}% completado
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente wrapper para casos simples
export const SimpleWizard = ({
  steps,
  children,
  onComplete,
  onCancel,
  title,
}: {
  steps: WizardStep[];
  children: React.ReactNode;
  onComplete?: (data: any) => Promise<void> | void;
  onCancel?: () => void;
  title?: string;
}) => (
  <Wizard
    steps={steps}
    onComplete={onComplete}
    onCancel={onCancel}
    title={title}
    compactMode={false}
    showStepIndicator={true}
    validateOnNext={true}
  >
    {children}
  </Wizard>
);

export default Wizard;
