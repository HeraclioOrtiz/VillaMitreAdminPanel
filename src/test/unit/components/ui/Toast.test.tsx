import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/utils';
import { ToastProvider, useToast } from '@/components/ui';
import { act } from '@testing-library/react';

// Test component que usa el hook useToast
const TestToastComponent = () => {
  const { success, error, warning, info } = useToast();
  
  return (
    <div>
      <button onClick={() => success('Success message')}>
        Show Success
      </button>
      <button onClick={() => error('Error message')}>
        Show Error
      </button>
      <button onClick={() => warning('Warning message')}>
        Show Warning
      </button>
      <button onClick={() => info('Info message')}>
        Show Info
      </button>
    </div>
  );
};

describe('Toast System', () => {
  beforeEach(() => {
    // Clear any existing toasts
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('shows success toast correctly', async () => {
    render(
      <ToastProvider>
        <TestToastComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Success'));

    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });

    // Check success toast styling
    const toast = screen.getByText('Success message').closest('[role="alert"]');
    expect(toast).toHaveClass('bg-green-50');
  });

  it('shows error toast correctly', async () => {
    render(
      <ToastProvider>
        <TestToastComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Error'));

    await waitFor(() => {
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    // Check error toast styling
    const toast = screen.getByText('Error message').closest('[role="alert"]');
    expect(toast).toHaveClass('bg-red-50');
  });

  it('shows warning toast correctly', async () => {
    render(
      <ToastProvider>
        <TestToastComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Warning'));

    await waitFor(() => {
      expect(screen.getByText('Warning message')).toBeInTheDocument();
    });

    // Check warning toast styling
    const toast = screen.getByText('Warning message').closest('[role="alert"]');
    expect(toast).toHaveClass('bg-yellow-50');
  });

  it('shows info toast correctly', async () => {
    render(
      <ToastProvider>
        <TestToastComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Info'));

    await waitFor(() => {
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });

    // Check info toast styling
    const toast = screen.getByText('Info message').closest('[role="alert"]');
    expect(toast).toHaveClass('bg-blue-50');
  });

  it('auto-dismisses toast after duration', async () => {
    render(
      <ToastProvider>
        <TestToastComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Success'));

    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });

    // Fast-forward time to trigger auto-dismiss
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    });
  });

  it('allows manual dismissal of toast', async () => {
    render(
      <ToastProvider>
        <TestToastComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Success'));

    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });

    // Find and click close button
    const closeButton = screen.getByLabelText('Cerrar notificación');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    });
  });

  it('shows multiple toasts simultaneously', async () => {
    render(
      <ToastProvider>
        <TestToastComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Success'));
    fireEvent.click(screen.getByText('Show Error'));
    fireEvent.click(screen.getByText('Show Warning'));

    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.getByText('Warning message')).toBeInTheDocument();
    });
  });

  it('limits maximum number of toasts', async () => {
    const TestManyToasts = () => {
      const { success } = useToast();
      
      const showManyToasts = () => {
        for (let i = 0; i < 10; i++) {
          success(`Toast ${i + 1}`);
        }
      };
      
      return <button onClick={showManyToasts}>Show Many Toasts</button>;
    };

    render(
      <ToastProvider>
        <TestManyToasts />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Many Toasts'));

    await waitFor(() => {
      // Should only show maximum allowed toasts (typically 5)
      const toasts = screen.getAllByRole('alert');
      expect(toasts.length).toBeLessThanOrEqual(5);
    });
  });

  it('handles toast with actions', async () => {
    const TestToastWithAction = () => {
      const { success } = useToast();
      
      const showActionToast = () => {
        success('Success with action', '', {
          action: {
            label: 'Undo',
            onClick: () => console.log('Undo clicked')
          }
        });
      };
      
      return <button onClick={showActionToast}>Show Action Toast</button>;
    };

    render(
      <ToastProvider>
        <TestToastWithAction />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Action Toast'));

    await waitFor(() => {
      expect(screen.getByText('Success with action')).toBeInTheDocument();
      expect(screen.getByText('Undo')).toBeInTheDocument();
    });
  });

  it('has correct accessibility attributes', async () => {
    render(
      <ToastProvider>
        <TestToastComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Success'));

    await waitFor(() => {
      const toast = screen.getByRole('alert');
      expect(toast).toHaveAttribute('aria-live', 'polite');
      expect(toast).toHaveAttribute('aria-atomic', 'true');
    });
  });

  it('throws error when useToast is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestToastComponent />);
    }).toThrow();
    
    consoleSpy.mockRestore();
  });
});
