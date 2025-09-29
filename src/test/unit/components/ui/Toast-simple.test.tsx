import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { ToastProvider, useToast } from '@/components/ui';

// Test component simple
const SimpleToastTest = () => {
  const { success, error } = useToast();
  
  return (
    <div>
      <button onClick={() => success('Test success')}>Success</button>
      <button onClick={() => error('Test error')}>Error</button>
    </div>
  );
};

describe('Toast System - Simple Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders toast provider without errors', () => {
    render(
      <ToastProvider>
        <div>Test content</div>
      </ToastProvider>
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('useToast hook works inside provider', () => {
    render(
      <ToastProvider>
        <SimpleToastTest />
      </ToastProvider>
    );
    
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('can trigger success toast', () => {
    render(
      <ToastProvider>
        <SimpleToastTest />
      </ToastProvider>
    );
    
    fireEvent.click(screen.getByText('Success'));
    // Just check that no error is thrown
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('can trigger error toast', () => {
    render(
      <ToastProvider>
        <SimpleToastTest />
      </ToastProvider>
    );
    
    fireEvent.click(screen.getByText('Error'));
    // Just check that no error is thrown
    expect(screen.getByText('Error')).toBeInTheDocument();
  });
});
