import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import type { WizardStep } from '@/hooks/useWizard';

interface StepIndicatorProps {
  steps: WizardStep[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  allowClickNavigation?: boolean;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  showDescriptions?: boolean;
  className?: string;
}

const StepIndicator = ({
  steps,
  currentStep,
  onStepClick,
  allowClickNavigation = false,
  orientation = 'horizontal',
  size = 'md',
  showLabels = true,
  showDescriptions = false,
  className = '',
}: StepIndicatorProps) => {

  const getStepStatus = (stepIndex: number) => {
    const step = steps[stepIndex];
    if (step.isCompleted) return 'completed';
    if (stepIndex === currentStep) return 'current';
    if (stepIndex < currentStep) return 'completed';
    return 'upcoming';
  };

  const getStepStyles = (stepIndex: number) => {
    const status = getStepStatus(stepIndex);
    const step = steps[stepIndex];
    
    const baseStyles = {
      sm: 'w-6 h-6 text-xs',
      md: 'w-8 h-8 text-sm',
      lg: 'w-10 h-10 text-base',
    };

    const statusStyles = {
      completed: 'bg-villa-mitre-600 text-white border-villa-mitre-600',
      current: 'bg-villa-mitre-100 text-villa-mitre-600 border-villa-mitre-600 ring-2 ring-villa-mitre-600 ring-offset-2',
      upcoming: 'bg-white text-gray-400 border-gray-300',
    };

    const interactiveStyles = allowClickNavigation && (status === 'completed' || stepIndex <= currentStep)
      ? 'cursor-pointer hover:bg-villa-mitre-50 hover:border-villa-mitre-400'
      : '';

    const errorStyles = step.isValid === false && stepIndex <= currentStep
      ? 'border-red-500 bg-red-50 text-red-600'
      : '';

    return `
      ${baseStyles[size]}
      ${statusStyles[status]}
      ${interactiveStyles}
      ${errorStyles}
      rounded-full border-2 flex items-center justify-center font-medium transition-all duration-200
    `;
  };

  const getConnectorStyles = (stepIndex: number) => {
    const isCompleted = getStepStatus(stepIndex) === 'completed';
    const isActive = stepIndex < currentStep;
    
    return `
      ${orientation === 'horizontal' ? 'h-0.5 flex-1' : 'w-0.5 h-8'}
      ${isCompleted || isActive ? 'bg-villa-mitre-600' : 'bg-gray-300'}
      transition-colors duration-200
    `;
  };

  const handleStepClick = (stepIndex: number) => {
    if (!allowClickNavigation) return;
    
    const step = steps[stepIndex];
    // Solo permitir navegación a pasos completados o al paso actual
    if (step.isCompleted || stepIndex <= currentStep) {
      onStepClick?.(stepIndex);
    }
  };

  const containerClasses = `
    ${orientation === 'horizontal' 
      ? 'flex items-center space-x-4' 
      : 'flex flex-col space-y-4'
    }
    ${className}
  `;

  return (
    <div className={containerClasses}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {/* Step Circle */}
          <div className={orientation === 'horizontal' ? 'flex flex-col items-center' : 'flex items-center space-x-3'}>
            <div
              className={getStepStyles(index)}
              onClick={() => handleStepClick(index)}
              role={allowClickNavigation ? 'button' : undefined}
              tabIndex={allowClickNavigation ? 0 : undefined}
              onKeyDown={(e) => {
                if (allowClickNavigation && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  handleStepClick(index);
                }
              }}
            >
              {getStepStatus(index) === 'completed' ? (
                <CheckIcon className="w-4 h-4" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>

            {/* Step Content */}
            {(showLabels || showDescriptions) && (
              <div className={`
                ${orientation === 'horizontal' ? 'mt-2 text-center' : 'flex-1'}
                ${orientation === 'horizontal' ? 'max-w-24' : ''}
              `}>
                {showLabels && (
                  <div className={`
                    font-medium text-sm
                    ${getStepStatus(index) === 'current' ? 'text-villa-mitre-600' : 'text-gray-700'}
                    ${getStepStatus(index) === 'upcoming' ? 'text-gray-400' : ''}
                  `}>
                    {step.title}
                  </div>
                )}
                
                {showDescriptions && step.description && (
                  <div className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </div>
                )}

                {/* Optional indicator */}
                {step.isOptional && (
                  <div className="text-xs text-gray-400 mt-1">
                    (Opcional)
                  </div>
                )}

                {/* Error indicator */}
                {step.isValid === false && index <= currentStep && (
                  <div className="text-xs text-red-500 mt-1">
                    ⚠ Requiere atención
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div className={getConnectorStyles(index)} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Componente simplificado para uso común
export const SimpleStepIndicator = ({ 
  steps, 
  currentStep, 
  className = '' 
}: Pick<StepIndicatorProps, 'steps' | 'currentStep' | 'className'>) => (
  <StepIndicator
    steps={steps}
    currentStep={currentStep}
    orientation="horizontal"
    size="md"
    showLabels={true}
    showDescriptions={false}
    className={className}
  />
);

// Componente compacto para espacios reducidos
export const CompactStepIndicator = ({ 
  steps, 
  currentStep, 
  className = '' 
}: Pick<StepIndicatorProps, 'steps' | 'currentStep' | 'className'>) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <span className="text-sm font-medium text-gray-600">
      Paso {currentStep + 1} de {steps.length}
    </span>
    <div className="flex-1 bg-gray-200 rounded-full h-2">
      <div 
        className="bg-villa-mitre-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
      />
    </div>
    <span className="text-sm text-gray-500">
      {Math.round(((currentStep + 1) / steps.length) * 100)}%
    </span>
  </div>
);

export default StepIndicator;
