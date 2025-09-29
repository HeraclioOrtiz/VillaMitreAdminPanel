import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { DateRangePicker } from '@/components/ui';

describe('DateRangePicker Component', () => {
  const defaultProps = {
    label: 'Fecha de prueba',
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with label', () => {
    render(<DateRangePicker {...defaultProps} />);
    expect(screen.getByText('Fecha de prueba')).toBeInTheDocument();
  });

  it('shows placeholder when no value', () => {
    render(<DateRangePicker {...defaultProps} placeholder="Seleccionar fecha" />);
    expect(screen.getByText('Seleccionar fecha')).toBeInTheDocument();
  });

  it('displays value when provided', () => {
    const value = {
      start: '2024-01-01',
      end: '2024-01-31'
    };
    
    render(<DateRangePicker {...defaultProps} value={value} />);
    // Should display formatted date range
    expect(screen.getByDisplayValue(/2024/)).toBeInTheDocument();
  });

  it('opens dropdown when clicked', () => {
    render(<DateRangePicker {...defaultProps} />);
    
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    
    // Should show apply/cancel buttons when opened
    expect(screen.getByText('Aplicar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('shows presets when available', () => {
    const presets = [
      { label: 'Hoy', value: { start: '2024-01-01', end: '2024-01-01' } },
      { label: 'Últimos 7 días', value: { start: '2024-01-01', end: '2024-01-07' } }
    ];
    
    render(<DateRangePicker {...defaultProps} presets={presets} />);
    
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    
    expect(screen.getByText('Hoy')).toBeInTheDocument();
    expect(screen.getByText('Últimos 7 días')).toBeInTheDocument();
  });

  it('calls onChange when applying selection', () => {
    render(<DateRangePicker {...defaultProps} />);
    
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    
    const applyButton = screen.getByText('Aplicar');
    fireEvent.click(applyButton);
    
    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it('shows clear button when clearable and has value', () => {
    const value = {
      start: '2024-01-01',
      end: '2024-01-31'
    };
    
    render(<DateRangePicker {...defaultProps} value={value} clearable />);
    
    // Should show clear button (×)
    expect(screen.getByText('×')).toBeInTheDocument();
  });

  it('clears value when clear button clicked', () => {
    const value = {
      start: '2024-01-01',
      end: '2024-01-31'
    };
    
    render(<DateRangePicker {...defaultProps} value={value} clearable />);
    
    const clearButton = screen.getByText('×');
    fireEvent.click(clearButton);
    
    expect(defaultProps.onChange).toHaveBeenCalledWith(null);
  });

  it('applies different sizes', () => {
    const { rerender } = render(<DateRangePicker {...defaultProps} size="sm" />);
    expect(screen.getByRole('button')).toHaveClass('h-8');
    
    rerender(<DateRangePicker {...defaultProps} size="md" />);
    expect(screen.getByRole('button')).toHaveClass('h-10');
    
    rerender(<DateRangePicker {...defaultProps} size="lg" />);
    expect(screen.getByRole('button')).toHaveClass('h-12');
  });
});
