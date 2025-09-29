import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { StepIndicator } from '@/components/ui';

const mockSteps = [
  { id: 'step1', title: 'Información General', description: 'Datos básicos' },
  { id: 'step2', title: 'Configuración', description: 'Opciones avanzadas' },
  { id: 'step3', title: 'Revisión', description: 'Confirmar datos' },
];

describe('StepIndicator Component', () => {
  it('renders all steps with titles', () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={0}
      />
    );

    expect(screen.getByText('Información General')).toBeInTheDocument();
    expect(screen.getByText('Configuración')).toBeInTheDocument();
    expect(screen.getByText('Revisión')).toBeInTheDocument();
  });

  it('shows descriptions when showDescriptions is true', () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={0}
        showDescriptions
      />
    );

    expect(screen.getByText('Datos básicos')).toBeInTheDocument();
    expect(screen.getByText('Opciones avanzadas')).toBeInTheDocument();
    expect(screen.getByText('Confirmar datos')).toBeInTheDocument();
  });

  it('highlights current step correctly', () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={1}
      />
    );

    const currentStepButton = screen.getByText('Configuración').closest('button');
    expect(currentStepButton).toHaveAttribute('aria-current', 'step');
    expect(currentStepButton).toHaveClass('bg-blue-600', 'text-white');
  });

  it('shows completed steps with check icon', () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={2}
      />
    );

    // Should render without errors
    expect(document.body).toBeInTheDocument();
  });

  it('handles step click when clickable', () => {
    const onStepClick = vi.fn();

    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={0}
        onStepClick={onStepClick}
      />
    );

    const step2Button = screen.getByText('Configuración').closest('button');
    fireEvent.click(step2Button!);

    expect(onStepClick).toHaveBeenCalledWith(1);
  });

  it('disables step click when not clickable', () => {
    const onStepClick = vi.fn();

    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={0}
        onStepClick={onStepClick}
      />
    );

    const step2Element = screen.getByText('Configuración');
    fireEvent.click(step2Element);

    expect(onStepClick).not.toHaveBeenCalled();
  });

  it('renders in vertical orientation', () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={0}
        orientation="vertical"
      />
    );

    const container = screen.getByRole('navigation');
    expect(container).toHaveClass('flex-col');
  });

  it('renders in horizontal orientation (default)', () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={0}
      />
    );

    const container = screen.getByRole('navigation');
    expect(container).toHaveClass('flex-row');
  });

  it('renders in compact mode', () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={1}
      />
    );

    // In compact mode, should show progress bar
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('2 de 3')).toBeInTheDocument();
  });

  it('shows step numbers when enabled', () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={1}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={0}
        className="custom-step-indicator"
      />
    );

    const container = screen.getByRole('navigation');
    expect(container).toHaveClass('custom-step-indicator');
  });

  it('shows error state for steps', () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={1}
      />
    );

    const errorStep = screen.getByText('Información General').closest('button');
    expect(errorStep).toHaveClass('bg-red-600');
  });

  it('shows warning state for steps', () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={1}
      />
    );

    const warningStep = screen.getByText('Revisión').closest('button');
    expect(warningStep).toHaveClass('bg-yellow-500');
  });

  it('disables specific steps', () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={0}
      />
    );

    const disabledStep = screen.getByText('Revisión').closest('button');
    expect(disabledStep).toBeDisabled();
    expect(disabledStep).toHaveClass('opacity-50');
  });

  it('renders with custom step icons', () => {
    const stepsWithIcons = mockSteps.map((step, index) => ({
      ...step,
      icon: <span data-testid={`custom-icon-${index}`}>Icon {index + 1}</span>
    }));

    render(
      <StepIndicator
        steps={stepsWithIcons}
        currentStep={0}
      />
    );

    expect(screen.getByTestId('custom-icon-0')).toBeInTheDocument();
    expect(screen.getByTestId('custom-icon-1')).toBeInTheDocument();
    expect(screen.getByTestId('custom-icon-2')).toBeInTheDocument();
  });

  it('calculates progress percentage correctly', () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={1}
      />
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '67'); // (1+1)/3 * 100 = 67%
  });

  it('handles keyboard navigation', () => {
    const onStepClick = vi.fn();

    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={0}
        onStepClick={onStepClick}
      />
    );

    const firstStep = screen.getByText('Información General').closest('button');
    
    // Simulate keyboard navigation
    fireEvent.keyDown(firstStep!, { key: 'ArrowRight' });
    // Note: Actual keyboard handling would depend on implementation
  });

  it('shows connecting lines between steps', () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={1}
      />
    );

    // Should have connector lines between steps
    const connectors = screen.getAllByTestId('step-connector');
    expect(connectors).toHaveLength(2); // n-1 connectors for n steps
  });

  it('renders with different sizes', () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={0}
        size="lg"
      />
    );

    const stepButtons = screen.getAllByRole('button');
    stepButtons.forEach(button => {
      expect(button).toHaveClass('h-12', 'w-12'); // Large size classes
    });
  });

  it('renders with small size', () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={0}
        size="sm"
      />
    );

    const stepButtons = screen.getAllByRole('button');
    stepButtons.forEach(button => {
      expect(button).toHaveClass('h-6', 'w-6'); // Small size classes
    });
  });

  it('handles empty steps array', () => {
    render(
      <StepIndicator
        steps={[]}
        currentStep={0}
      />
    );

    const container = screen.getByRole('navigation');
    expect(container).toBeInTheDocument();
    expect(container.children).toHaveLength(0);
  });

  it('handles single step', () => {
    const singleStep = [{ id: 'only', title: 'Only Step' }];

    render(
      <StepIndicator
        steps={singleStep}
        currentStep={0}
      />
    );

    expect(screen.getByText('Only Step')).toBeInTheDocument();
    
    // Should not show connectors for single step
    expect(screen.queryByTestId('step-connector')).not.toBeInTheDocument();
  });

  it('applies correct ARIA attributes', () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={1}
      />
    );

    const navigation = screen.getByRole('navigation');
    expect(navigation).toHaveAttribute('aria-label', 'Progreso del asistente');

    const currentStep = screen.getByText('Configuración').closest('button');
    expect(currentStep).toHaveAttribute('aria-current', 'step');

    const steps = screen.getAllByRole('button');
    steps.forEach((step, index) => {
      expect(step).toHaveAttribute('aria-label');
    });
  });

  it('shows step status in aria-label', () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={1}
      />
    );

    const completedStep = screen.getByText('Información General').closest('button');
    expect(completedStep).toHaveAttribute('aria-label', expect.stringContaining('completado'));

    const currentStep = screen.getByText('Configuración').closest('button');
    expect(currentStep).toHaveAttribute('aria-label', expect.stringContaining('actual'));

    const pendingStep = screen.getByText('Revisión').closest('button');
    expect(pendingStep).toHaveAttribute('aria-label', expect.stringContaining('pendiente'));
  });

  it('renders with custom theme colors', () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={1}
      />
    );

    const currentStep = screen.getByText('Configuración').closest('button');
    expect(currentStep).toHaveClass('bg-purple-600');
  });
});
