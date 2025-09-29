import { useState, useCallback, useMemo } from 'react';

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  isOptional?: boolean;
  isCompleted?: boolean;
  isValid?: boolean;
  component?: React.ComponentType<any>;
}

export interface WizardConfig {
  steps: WizardStep[];
  initialStep?: number;
  allowSkipSteps?: boolean;
  validateOnNext?: boolean;
  onStepChange?: (currentStep: number, previousStep: number) => void;
  onComplete?: (data: any) => void;
  onCancel?: () => void;
}

export interface WizardState {
  currentStep: number;
  steps: WizardStep[];
  data: Record<string, any>;
  isLoading: boolean;
  errors: Record<string, string[]>;
}

export interface WizardActions {
  // Navegación
  goToStep: (step: number) => void;
  nextStep: () => Promise<boolean>;
  previousStep: () => void;
  goToFirstStep: () => void;
  goToLastStep: () => void;
  
  // Datos
  updateStepData: (stepId: string, data: any) => void;
  updateData: (data: Record<string, any>) => void;
  getData: (stepId?: string) => any;
  
  // Validación
  validateStep: (stepId?: string) => Promise<boolean>;
  validateAllSteps: () => Promise<boolean>;
  setStepErrors: (stepId: string, errors: string[]) => void;
  clearStepErrors: (stepId: string) => void;
  
  // Estado
  markStepAsCompleted: (stepId: string) => void;
  markStepAsIncomplete: (stepId: string) => void;
  setLoading: (loading: boolean) => void;
  
  // Utilidades
  isFirstStep: boolean;
  isLastStep: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
  completedStepsCount: number;
  totalSteps: number;
  progressPercentage: number;
  
  // Reset
  reset: () => void;
}

export const useWizard = (config: WizardConfig): [WizardState, WizardActions] => {
  const { 
    steps: initialSteps, 
    initialStep = 0, 
    allowSkipSteps = false,
    validateOnNext = true,
    onStepChange,
    onComplete,
    onCancel 
  } = config;

  // Estado inicial
  const [state, setState] = useState<WizardState>({
    currentStep: initialStep,
    steps: initialSteps.map(step => ({
      ...step,
      isCompleted: false,
      isValid: false,
    })),
    data: {},
    isLoading: false,
    errors: {},
  });

  // Navegación
  const goToStep = useCallback((step: number) => {
    if (step < 0 || step >= state.steps.length) return;
    
    const previousStep = state.currentStep;
    
    setState(prev => ({
      ...prev,
      currentStep: step,
    }));
    
    onStepChange?.(step, previousStep);
  }, [state.currentStep, state.steps.length, onStepChange]);

  // Validación
  const validateStep = useCallback(async (stepId?: string): Promise<boolean> => {
    const targetStepId = stepId || state.steps[state.currentStep].id;
    const stepData = state.data[targetStepId];
    const step = state.steps.find(s => s.id === targetStepId);
    
    // Si el paso es opcional, siempre es válido
    if (step?.isOptional) {
      return true;
    }
    
    // Si el paso ya está marcado como completado, es válido
    if (step?.isCompleted) {
      return true;
    }
    
    // Validación básica: verificar si hay datos
    const isValid = stepData && Object.keys(stepData).length > 0;
    
    // Actualizar estado de validación del paso
    setState(prev => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === targetStepId
          ? { ...step, isValid }
          : step
      ),
    }));
    
    return isValid;
  }, [state.currentStep, state.steps, state.data]);

  // Estado de pasos
  const markStepAsCompleted = useCallback((stepId: string) => {
    setState(prev => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId
          ? { ...step, isCompleted: true, isValid: true }
          : step
      ),
    }));
  }, []);

  const nextStep = useCallback(async (): Promise<boolean> => {
    const currentStepData = state.steps[state.currentStep];
    
    // Validar paso actual si está habilitado
    if (validateOnNext) {
      const isValid = await validateStep(currentStepData.id);
      if (!isValid && !currentStepData.isOptional) {
        return false;
      }
    }
    
    // Marcar paso como completado
    markStepAsCompleted(currentStepData.id);
    
    // Si es el último paso, completar wizard
    if (state.currentStep === state.steps.length - 1) {
      onComplete?.(state.data);
      return true;
    }
    
    // Ir al siguiente paso
    goToStep(state.currentStep + 1);
    return true;
  }, [state.currentStep, state.steps, state.data, validateOnNext, onComplete, validateStep, markStepAsCompleted, goToStep]);

  const previousStep = useCallback(() => {
    if (state.currentStep > 0) {
      goToStep(state.currentStep - 1);
    }
  }, [state.currentStep, goToStep]);

  const goToFirstStep = useCallback(() => {
    goToStep(0);
  }, [goToStep]);

  const goToLastStep = useCallback(() => {
    goToStep(state.steps.length - 1);
  }, [state.steps.length, goToStep]);

  // Manejo de datos
  const updateStepData = useCallback((stepId: string, data: any) => {
    setState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [stepId]: {
          ...prev.data[stepId],
          ...data,
        },
      },
    }));
  }, []);

  const updateData = useCallback((data: Record<string, any>) => {
    setState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        ...data,
      },
    }));
  }, []);

  const getData = useCallback((stepId?: string) => {
    if (stepId) {
      return state.data[stepId] || {};
    }
    return state.data;
  }, [state.data]);

  const validateAllSteps = useCallback(async (): Promise<boolean> => {
    const validationResults = await Promise.all(
      state.steps.map(step => validateStep(step.id))
    );
    
    return validationResults.every(Boolean);
  }, [state.steps, validateStep]);

  const setStepErrors = useCallback((stepId: string, errors: string[]) => {
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [stepId]: errors,
      },
    }));
  }, []);

  const clearStepErrors = useCallback((stepId: string) => {
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [stepId]: [],
      },
    }));
  }, []);

  const markStepAsIncomplete = useCallback((stepId: string) => {
    setState(prev => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId
          ? { ...step, isCompleted: false, isValid: false }
          : step
      ),
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({
      ...prev,
      isLoading: loading,
    }));
  }, []);

  // Reset
  const reset = useCallback(() => {
    setState({
      currentStep: initialStep,
      steps: initialSteps.map(step => ({
        ...step,
        isCompleted: false,
        isValid: false,
      })),
      data: {},
      isLoading: false,
      errors: {},
    });
  }, [initialStep, initialSteps]);

  // Propiedades computadas
  const isFirstStep = state.currentStep === 0;
  const isLastStep = state.currentStep === state.steps.length - 1;
  const currentStepData = state.steps[state.currentStep];
  const canGoNext = allowSkipSteps || (currentStepData?.isValid ?? false) || (currentStepData?.isOptional ?? false);
  const canGoPrevious = state.currentStep > 0;
  const completedStepsCount = state.steps.filter(step => step.isCompleted).length;
  const totalSteps = state.steps.length;
  const progressPercentage = Math.round((completedStepsCount / totalSteps) * 100);

  const actions: WizardActions = useMemo(() => ({
    // Navegación
    goToStep,
    nextStep,
    previousStep,
    goToFirstStep,
    goToLastStep,
    
    // Datos
    updateStepData,
    updateData,
    getData,
    
    // Validación
    validateStep,
    validateAllSteps,
    setStepErrors,
    clearStepErrors,
    
    // Estado
    markStepAsCompleted,
    markStepAsIncomplete,
    setLoading,
    
    // Utilidades
    isFirstStep,
    isLastStep,
    canGoNext,
    canGoPrevious,
    completedStepsCount,
    totalSteps,
    progressPercentage,
    
    // Reset
    reset,
  }), [
    goToStep, nextStep, previousStep, goToFirstStep, goToLastStep,
    updateStepData, updateData, getData,
    validateStep, validateAllSteps, setStepErrors, clearStepErrors,
    markStepAsCompleted, markStepAsIncomplete, setLoading,
    isFirstStep, isLastStep, canGoNext, canGoPrevious,
    completedStepsCount, totalSteps, progressPercentage,
    reset
  ]);

  return [state, actions];
};
