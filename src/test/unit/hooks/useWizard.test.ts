import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWizard } from '@/hooks/useWizard';

const mockSteps = [
  { id: 'step1', title: 'Step 1' },
  { id: 'step2', title: 'Step 2' },
  { id: 'step3', title: 'Step 3' },
];

describe('useWizard Hook', () => {
  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useWizard({
      steps: mockSteps,
    }));

    expect(result.current.currentStep).toBe(0);
    expect(result.current.steps).toEqual(mockSteps);
    expect(result.current.data).toEqual({});
    expect(result.current.errors).toEqual({});
    expect(result.current.isLoading).toBe(false);
    expect(result.current.completedSteps).toEqual(new Set());
    expect(result.current.isFirstStep).toBe(true);
    expect(result.current.isLastStep).toBe(false);
    expect(result.current.canGoNext).toBe(true);
    expect(result.current.progressPercentage).toBe(0);
  });

  it('navigates to next step', () => {
    const { result } = renderHook(() => useWizard({
      steps: mockSteps,
    }));

    act(() => {
      result.current.nextStep();
    });

    expect(result.current.currentStep).toBe(1);
    expect(result.current.isFirstStep).toBe(false);
    expect(result.current.isLastStep).toBe(false);
    expect(result.current.progressPercentage).toBe(50);
  });

  it('navigates to previous step', () => {
    const { result } = renderHook(() => useWizard({
      steps: mockSteps,
    }));

    // Go to step 2 first
    act(() => {
      result.current.nextStep();
    });

    // Then go back
    act(() => {
      result.current.previousStep();
    });

    expect(result.current.currentStep).toBe(0);
    expect(result.current.isFirstStep).toBe(true);
  });

  it('goes to specific step', () => {
    const { result } = renderHook(() => useWizard({
      steps: mockSteps,
    }));

    act(() => {
      result.current.goToStep(2);
    });

    expect(result.current.currentStep).toBe(2);
    expect(result.current.isLastStep).toBe(true);
    expect(result.current.progressPercentage).toBe(100);
  });

  it('does not go beyond first step when going previous', () => {
    const { result } = renderHook(() => useWizard({
      steps: mockSteps,
    }));

    act(() => {
      result.current.previousStep();
    });

    expect(result.current.currentStep).toBe(0);
  });

  it('does not go beyond last step when going next', () => {
    const { result } = renderHook(() => useWizard({
      steps: mockSteps,
    }));

    // Go to last step
    act(() => {
      result.current.goToStep(2);
    });

    // Try to go further
    act(() => {
      result.current.nextStep();
    });

    expect(result.current.currentStep).toBe(2);
  });

  it('updates step data correctly', () => {
    const { result } = renderHook(() => useWizard({
      steps: mockSteps,
    }));

    const stepData = { name: 'Test', email: 'test@example.com' };

    act(() => {
      result.current.updateStepData(0, stepData);
    });

    expect(result.current.data).toEqual({
      step1: stepData,
    });
  });

  it('updates global data correctly', () => {
    const { result } = renderHook(() => useWizard({
      steps: mockSteps,
    }));

    const globalData = { userId: 123, settings: { theme: 'dark' } };

    act(() => {
      result.current.updateData(globalData);
    });

    expect(result.current.data).toEqual(globalData);
  });

  it('gets data for specific step', () => {
    const { result } = renderHook(() => useWizard({
      steps: mockSteps,
    }));

    const stepData = { name: 'Test' };

    act(() => {
      result.current.updateStepData(0, stepData);
    });

    const retrievedData = result.current.getData('step1');
    expect(retrievedData).toEqual(stepData);
  });

  it('marks step as completed', () => {
    const { result } = renderHook(() => useWizard({
      steps: mockSteps,
    }));

    act(() => {
      result.current.markStepAsCompleted(0);
    });

    expect(result.current.completedSteps.has(0)).toBe(true);
  });

  it('sets loading state', () => {
    const { result } = renderHook(() => useWizard({
      steps: mockSteps,
    }));

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.isLoading).toBe(true);

    act(() => {
      result.current.setLoading(false);
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('resets wizard state', () => {
    const { result } = renderHook(() => useWizard({
      steps: mockSteps,
    }));

    // Make some changes
    act(() => {
      result.current.goToStep(2);
      result.current.updateData({ test: 'data' });
      result.current.markStepAsCompleted(0);
      result.current.setLoading(true);
    });

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.currentStep).toBe(0);
    expect(result.current.data).toEqual({});
    expect(result.current.completedSteps).toEqual(new Set());
    expect(result.current.isLoading).toBe(false);
  });

  it('validates step with custom validator', async () => {
    const validator = vi.fn().mockResolvedValue(true);
    
    const { result } = renderHook(() => useWizard({
      steps: mockSteps,
      validateStep: validator,
    }));

    let validationResult;
    await act(async () => {
      validationResult = await result.current.validateStep(0);
    });

    expect(validator).toHaveBeenCalledWith(0, {});
    expect(validationResult).toBe(true);
  });

  it('validates step with validation errors', async () => {
    const validator = vi.fn().mockResolvedValue({ name: 'Name is required' });
    
    const { result } = renderHook(() => useWizard({
      steps: mockSteps,
      validateStep: validator,
    }));

    let validationResult;
    await act(async () => {
      validationResult = await result.current.validateStep(0);
    });

    expect(validationResult).toBe(false);
    expect(result.current.errors).toEqual({ step1: { name: 'Name is required' } });
  });

  it('validates all steps', async () => {
    const validator = vi.fn()
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce({ email: 'Email is required' })
      .mockResolvedValueOnce(true);
    
    const { result } = renderHook(() => useWizard({
      steps: mockSteps,
      validateStep: validator,
    }));

    let validationResult;
    await act(async () => {
      validationResult = await result.current.validateAllSteps();
    });

    expect(validator).toHaveBeenCalledTimes(3);
    expect(validationResult).toBe(false);
    expect(result.current.errors).toEqual({
      step2: { email: 'Email is required' }
    });
  });

  it('calls onStepChange callback', () => {
    const onStepChange = vi.fn();
    
    const { result } = renderHook(() => useWizard({
      steps: mockSteps,
      onStepChange,
    }));

    act(() => {
      result.current.nextStep();
    });

    expect(onStepChange).toHaveBeenCalledWith(1, 0);
  });

  it('calls onDataChange callback', () => {
    const onDataChange = vi.fn();
    
    const { result } = renderHook(() => useWizard({
      steps: mockSteps,
      onDataChange,
    }));

    const newData = { test: 'data' };

    act(() => {
      result.current.updateData(newData);
    });

    expect(onDataChange).toHaveBeenCalledWith(newData);
  });

  it('respects allowSkipSteps configuration', () => {
    const { result } = renderHook(() => useWizard({
      steps: mockSteps,
      allowSkipSteps: false,
    }));

    // Try to skip to step 2 without completing step 1
    act(() => {
      result.current.goToStep(2);
    });

    // Should not allow skipping if allowSkipSteps is false
    expect(result.current.currentStep).toBe(0);
  });

  it('allows skipping steps when allowSkipSteps is true', () => {
    const { result } = renderHook(() => useWizard({
      steps: mockSteps,
      allowSkipSteps: true,
    }));

    act(() => {
      result.current.goToStep(2);
    });

    expect(result.current.currentStep).toBe(2);
  });

  it('prevents navigation when canGoNext is false', () => {
    const canGoNext = vi.fn().mockReturnValue(false);
    
    const { result } = renderHook(() => useWizard({
      steps: mockSteps,
      canGoNext,
    }));

    expect(result.current.canGoNext).toBe(false);

    act(() => {
      result.current.nextStep();
    });

    // Should not advance if canGoNext returns false
    expect(result.current.currentStep).toBe(0);
  });

  it('goes to first step', () => {
    const { result } = renderHook(() => useWizard({
      steps: mockSteps,
    }));

    // Go to middle step first
    act(() => {
      result.current.goToStep(1);
    });

    // Then go to first
    act(() => {
      result.current.goToFirstStep();
    });

    expect(result.current.currentStep).toBe(0);
  });

  it('goes to last step', () => {
    const { result } = renderHook(() => useWizard({
      steps: mockSteps,
    }));

    act(() => {
      result.current.goToLastStep();
    });

    expect(result.current.currentStep).toBe(2);
    expect(result.current.isLastStep).toBe(true);
  });

  it('calculates progress percentage correctly', () => {
    const { result } = renderHook(() => useWizard({
      steps: mockSteps,
    }));

    // Step 0 (first step)
    expect(result.current.progressPercentage).toBe(0);

    // Step 1 (middle step)
    act(() => {
      result.current.nextStep();
    });
    expect(result.current.progressPercentage).toBe(50);

    // Step 2 (last step)
    act(() => {
      result.current.nextStep();
    });
    expect(result.current.progressPercentage).toBe(100);
  });

  it('handles empty steps array', () => {
    const { result } = renderHook(() => useWizard({
      steps: [],
    }));

    expect(result.current.currentStep).toBe(0);
    expect(result.current.isFirstStep).toBe(true);
    expect(result.current.isLastStep).toBe(true);
    expect(result.current.progressPercentage).toBe(100);
  });

  it('handles single step', () => {
    const singleStep = [{ id: 'only', title: 'Only Step' }];
    
    const { result } = renderHook(() => useWizard({
      steps: singleStep,
    }));

    expect(result.current.isFirstStep).toBe(true);
    expect(result.current.isLastStep).toBe(true);
    expect(result.current.progressPercentage).toBe(100);

    // Should not be able to navigate
    act(() => {
      result.current.nextStep();
    });
    expect(result.current.currentStep).toBe(0);

    act(() => {
      result.current.previousStep();
    });
    expect(result.current.currentStep).toBe(0);
  });
});
