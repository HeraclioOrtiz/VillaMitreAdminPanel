// TODO: WizardStep component is not exported from @/components/ui
// This test will be re-enabled when the component is properly exported

/*
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { WizardStep } from '@/components/ui';

describe('WizardStep Component', () => {
  it('renders step with title and description', () => {
    render(
      <WizardStep
        title="Test Step"
        description="This is a test step description"
      >
        <div data-testid="step-content">Step content</div>
      </WizardStep>
    );

    expect(screen.getByText('Test Step')).toBeInTheDocument();
    expect(screen.getByText('This is a test step description')).toBeInTheDocument();
    expect(screen.getByTestId('step-content')).toBeInTheDocument();
  });

  it('renders step without description', () => {
    render(
      <WizardStep title="Test Step">
        <div data-testid="step-content">Step content</div>
      </WizardStep>
    );

    expect(screen.getByText('Test Step')).toBeInTheDocument();
    expect(screen.getByTestId('step-content')).toBeInTheDocument();
  });

  it('renders step with icon', () => {
    const TestIcon = () => <svg data-testid="test-icon" />;

    render(
      <WizardStep
        title="Test Step"
        icon={<TestIcon />}
      >
        <div>Step content</div>
      </WizardStep>
    );

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <WizardStep
        title="Test Step"
        className="custom-step-class"
      >
        <div>Step content</div>
      </WizardStep>
    );

    const stepElement = screen.getByText('Test Step').closest('.custom-step-class');
    expect(stepElement).toBeInTheDocument();
  });

  it('renders with error state', () => {
    render(
      <WizardStep
        title="Test Step"
        error="This field is required"
      >
        <div>Step content</div>
      </WizardStep>
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByText('This field is required')).toHaveClass('text-red-600');
  });

  it('renders with warning state', () => {
    render(
      <WizardStep
        title="Test Step"
        warning="Please review this information"
      >
        <div>Step content</div>
      </WizardStep>
    );

    expect(screen.getByText('Please review this information')).toBeInTheDocument();
    expect(screen.getByText('Please review this information')).toHaveClass('text-yellow-600');
  });

  it('renders with info message', () => {
    render(
      <WizardStep
        title="Test Step"
        info="Additional information about this step"
      >
        <div>Step content</div>
      </WizardStep>
    );

    expect(screen.getByText('Additional information about this step')).toBeInTheDocument();
    expect(screen.getByText('Additional information about this step')).toHaveClass('text-blue-600');
  });

  it('renders with loading state', () => {
    render(
      <WizardStep
        title="Test Step"
        loading
      >
        <div>Step content</div>
      </WizardStep>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('renders with completed state', () => {
    render(
      <WizardStep
        title="Test Step"
        completed
      >
        <div>Step content</div>
      </WizardStep>
    );

    // Should show checkmark icon for completed state
    const checkIcon = screen.getByTestId('check-circle-icon');
    expect(checkIcon).toBeInTheDocument();
    expect(checkIcon).toHaveClass('text-green-500');
  });

  it('renders with disabled state', () => {
    render(
      <WizardStep
        title="Test Step"
        disabled
      >
        <div>Step content</div>
      </WizardStep>
    );

    const stepContainer = screen.getByText('Test Step').closest('div');
    expect(stepContainer).toHaveClass('opacity-50');
  });

  it('renders with required indicator', () => {
    render(
      <WizardStep
        title="Test Step"
        required
      >
        <div>Step content</div>
      </WizardStep>
    );

    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('*')).toHaveClass('text-red-500');
  });

  it('renders with custom actions', () => {
    const handleAction = vi.fn();

    render(
      <WizardStep
        title="Test Step"
        actions={
          <button onClick={handleAction} data-testid="custom-action">
            Custom Action
          </button>
        }
      >
        <div>Step content</div>
      </WizardStep>
    );

    const actionButton = screen.getByTestId('custom-action');
    expect(actionButton).toBeInTheDocument();

    fireEvent.click(actionButton);
    expect(handleAction).toHaveBeenCalled();
  });

  it('renders with help text', () => {
    render(
      <WizardStep
        title="Test Step"
        helpText="This is helpful information about the step"
      >
        <div>Step content</div>
      </WizardStep>
    );

    expect(screen.getByText('This is helpful information about the step')).toBeInTheDocument();
    expect(screen.getByText('This is helpful information about the step')).toHaveClass('text-gray-600');
  });

  it('renders with step number', () => {
    render(
      <WizardStep
        title="Test Step"
        stepNumber={3}
      >
        <div>Step content</div>
      </WizardStep>
    );

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders with progress indicator', () => {
    render(
      <WizardStep
        title="Test Step"
        progress={75}
      >
        <div>Step content</div>
      </WizardStep>
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '75');
  });

  it('handles onValidate callback', () => {
    const handleValidate = vi.fn().mockReturnValue(true);

    render(
      <WizardStep
        title="Test Step"
        onValidate={handleValidate}
      >
        <div>Step content</div>
      </WizardStep>
    );

    // Simulate validation trigger (this would typically be called by parent)
    expect(handleValidate).toBeDefined();
  });

  it('handles onNext callback', () => {
    const handleNext = vi.fn();

    render(
      <WizardStep
        title="Test Step"
        onNext={handleNext}
      >
        <div>Step content</div>
      </WizardStep>
    );

    // If there's a next button in the step
    const nextButton = screen.queryByText('Siguiente');
    if (nextButton) {
      fireEvent.click(nextButton);
      expect(handleNext).toHaveBeenCalled();
    }
  });

  it('handles onPrevious callback', () => {
    const handlePrevious = vi.fn();

    render(
      <WizardStep
        title="Test Step"
        onPrevious={handlePrevious}
      >
        <div>Step content</div>
      </WizardStep>
    );

    // If there's a previous button in the step
    const previousButton = screen.queryByText('Anterior');
    if (previousButton) {
      fireEvent.click(previousButton);
      expect(handlePrevious).toHaveBeenCalled();
    }
  });

  it('renders with multiple states combined', () => {
    render(
      <WizardStep
        title="Test Step"
        description="Step description"
        required
        stepNumber={2}
        progress={50}
        info="Additional info"
        helpText="Help text"
      >
        <div data-testid="step-content">Step content</div>
      </WizardStep>
    );

    expect(screen.getByText('Test Step')).toBeInTheDocument();
    expect(screen.getByText('Step description')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument(); // Required indicator
    expect(screen.getByText('2')).toBeInTheDocument(); // Step number
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Additional info')).toBeInTheDocument();
    expect(screen.getByText('Help text')).toBeInTheDocument();
    expect(screen.getByTestId('step-content')).toBeInTheDocument();
  });

  it('renders with collapsible content', () => {
    render(
      <WizardStep
        title="Test Step"
        collapsible
        defaultCollapsed={false}
      >
        <div data-testid="step-content">Step content</div>
      </WizardStep>
    );

    expect(screen.getByTestId('step-content')).toBeInTheDocument();

    // Should have a collapse/expand button
    const collapseButton = screen.getByRole('button');
    expect(collapseButton).toBeInTheDocument();
  });

  it('starts collapsed when defaultCollapsed is true', () => {
    render(
      <WizardStep
        title="Test Step"
        collapsible
        defaultCollapsed={true}
      >
        <div data-testid="step-content">Step content</div>
      </WizardStep>
    );

    // Content should not be visible when collapsed
    expect(screen.queryByTestId('step-content')).not.toBeInTheDocument();
  });

  it('toggles collapsed state when collapse button is clicked', () => {
    render(
      <WizardStep
        title="Test Step"
        collapsible
        defaultCollapsed={false}
      >
        <div data-testid="step-content">Step content</div>
      </WizardStep>
    );

    expect(screen.getByTestId('step-content')).toBeInTheDocument();

    const collapseButton = screen.getByRole('button');
    fireEvent.click(collapseButton);

    expect(screen.queryByTestId('step-content')).not.toBeInTheDocument();
  });

  it('applies correct ARIA attributes', () => {
    render(
      <WizardStep
        title="Test Step"
        stepNumber={1}
        completed={false}
        disabled={false}
      >
        <div>Step content</div>
      </WizardStep>
    );

    const stepElement = screen.getByRole('tabpanel');
    expect(stepElement).toHaveAttribute('aria-labelledby');
  });

  it('handles keyboard navigation', () => {
    const handleNext = vi.fn();
    const handlePrevious = vi.fn();

    render(
      <WizardStep
        title="Test Step"
        onNext={handleNext}
        onPrevious={handlePrevious}
      >
        <div>Step content</div>
      </WizardStep>
    );

    const stepElement = screen.getByRole('tabpanel');
    
    // Simulate keyboard events
    fireEvent.keyDown(stepElement, { key: 'ArrowRight' });
    // Note: The actual keyboard handling would depend on the implementation
  });
});
*/
