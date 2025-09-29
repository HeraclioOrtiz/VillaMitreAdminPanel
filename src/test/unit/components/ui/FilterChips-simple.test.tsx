import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, renderHook } from '@/test/utils';
import { FilterChips, useFilterChips } from '@/components/ui';

describe('FilterChips Component - Simple Tests', () => {
  const mockChips = [
    {
      id: 'search',
      label: 'Búsqueda: test',
      value: 'test',
      color: 'blue' as const,
      removable: true
    },
    {
      id: 'role',
      label: 'Rol: admin',
      value: 'admin',
      color: 'green' as const,
      removable: true
    },
    {
      id: 'status',
      label: 'Estado: active',
      value: 'active',
      color: 'yellow' as const,
      removable: false
    }
  ];

  const defaultProps = {
    chips: mockChips,
    onRemoveChip: vi.fn(),
    onClearAll: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<FilterChips {...defaultProps} />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays all chips', () => {
    render(<FilterChips {...defaultProps} />);
    
    expect(screen.getByText('Búsqueda: test')).toBeInTheDocument();
    expect(screen.getByText('Rol: admin')).toBeInTheDocument();
    expect(screen.getByText('Estado: active')).toBeInTheDocument();
  });

  it('shows remove buttons for removable chips', () => {
    render(<FilterChips {...defaultProps} />);
    
    // Should have 2 remove buttons (for search and role chips)
    const removeButtons = screen.getAllByText('×');
    expect(removeButtons).toHaveLength(2);
  });

  it('calls onRemoveChip when remove button is clicked', () => {
    render(<FilterChips {...defaultProps} />);
    
    const removeButtons = screen.getAllByText('×');
    fireEvent.click(removeButtons[0]);
    
    expect(defaultProps.onRemoveChip).toHaveBeenCalledWith('search');
  });

  it('shows clear all button when there are chips', () => {
    render(<FilterChips {...defaultProps} />);
    
    expect(screen.getByText('Limpiar todo')).toBeInTheDocument();
  });

  it('calls onClearAll when clear all button is clicked', () => {
    render(<FilterChips {...defaultProps} />);
    
    const clearAllButton = screen.getByText('Limpiar todo');
    fireEvent.click(clearAllButton);
    
    expect(defaultProps.onClearAll).toHaveBeenCalled();
  });

  it('does not render when no chips provided', () => {
    render(<FilterChips chips={[]} onRemoveChip={vi.fn()} onClearAll={vi.fn()} />);
    
    expect(screen.queryByText('Limpiar todo')).not.toBeInTheDocument();
  });

  it('applies different colors to chips', () => {
    render(<FilterChips {...defaultProps} />);
    
    const searchChip = screen.getByText('Búsqueda: test').closest('span');
    const roleChip = screen.getByText('Rol: admin').closest('span');
    
    expect(searchChip).toHaveClass('bg-blue-100');
    expect(roleChip).toHaveClass('bg-green-100');
  });

  it('handles maxVisible prop', () => {
    const manyChips = Array.from({ length: 10 }, (_, i) => ({
      id: `chip-${i}`,
      label: `Chip ${i}`,
      value: `value-${i}`,
      color: 'blue' as const,
      removable: true
    }));

    render(
      <FilterChips 
        chips={manyChips} 
        maxVisible={3}
        onRemoveChip={vi.fn()} 
        onClearAll={vi.fn()} 
      />
    );
    
    // Should show first 3 chips plus a "+7 más" indicator
    expect(screen.getByText('Chip 0')).toBeInTheDocument();
    expect(screen.getByText('Chip 1')).toBeInTheDocument();
    expect(screen.getByText('Chip 2')).toBeInTheDocument();
    expect(screen.getByText('+7 más')).toBeInTheDocument();
    expect(screen.queryByText('Chip 3')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <FilterChips {...defaultProps} className="custom-chips" />
    );
    
    expect(container.firstChild).toHaveClass('custom-chips');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<FilterChips {...defaultProps} size="sm" />);
    
    let chips = screen.getAllByRole('button');
    expect(chips[0]).toHaveClass('text-xs');
    
    rerender(<FilterChips {...defaultProps} size="md" />);
    chips = screen.getAllByRole('button');
    expect(chips[0]).toHaveClass('text-sm');
    
    rerender(<FilterChips {...defaultProps} size="lg" />);
    chips = screen.getAllByRole('button');
    expect(chips[0]).toHaveClass('text-base');
  });

  it('renders with outlined variant', () => {
    render(<FilterChips {...defaultProps} variant="outlined" />);
    
    const searchChip = screen.getByText('Búsqueda: test').closest('span');
    expect(searchChip).toHaveClass('border-blue-200');
    expect(searchChip).toHaveClass('bg-transparent');
  });
});

describe('useFilterChips Hook - Simple Tests', () => {
  it('should create text chip correctly', () => {
    const { result } = renderHook(() => useFilterChips());
    
    const chip = result.current.createTextChip('test-id', 'Label', 'value', 'blue');
    
    expect(chip).toEqual({
      id: 'test-id',
      label: 'Label: value',
      value: 'value',
      color: 'blue',
      removable: true
    });
  });

  it('should create array chip correctly', () => {
    const { result } = renderHook(() => useFilterChips());
    
    const chip = result.current.createArrayChip('roles', 'Roles', ['admin', 'user'], 'green');
    
    expect(chip).toEqual({
      id: 'roles',
      label: 'Roles: admin, user',
      value: ['admin', 'user'],
      color: 'green',
      removable: true
    });
  });

  it('should create boolean chip correctly', () => {
    const { result } = renderHook(() => useFilterChips());
    
    const chip = result.current.createBooleanChip('verified', 'Verificado', true, 'green');
    
    expect(chip).toEqual({
      id: 'verified',
      label: 'Verificado: Sí',
      value: true,
      color: 'green',
      removable: true
    });
  });

  it('should create date range chip correctly', () => {
    const { result } = renderHook(() => useFilterChips());
    
    const chip = result.current.createDateRangeChip(
      'created', 
      'Fecha creación', 
      '2024-01-01', 
      '2024-01-31', 
      'purple'
    );
    
    expect(chip).toEqual({
      id: 'created',
      label: 'Fecha creación: 01/01/2024 - 31/01/2024',
      value: { start: '2024-01-01', end: '2024-01-31' },
      color: 'purple',
      removable: true
    });
  });

  it('should return null for empty array chip', () => {
    const { result } = renderHook(() => useFilterChips());
    
    const chip = result.current.createArrayChip('empty', 'Empty', [], 'blue');
    
    expect(chip).toBeNull();
  });

  it('should return null for empty date range chip', () => {
    const { result } = renderHook(() => useFilterChips());
    
    const chip = result.current.createDateRangeChip('empty', 'Empty', null, null, 'blue');
    
    expect(chip).toBeNull();
  });
});
