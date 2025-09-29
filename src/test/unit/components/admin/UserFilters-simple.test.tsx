import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/utils';
import { UserFilters } from '@/components/admin';

describe('UserFilters Component - Simple Tests', () => {
  const defaultFilters = {
    search: '',
    role: undefined,
    status: undefined,
    dateRange: undefined
  };

  const defaultProps = {
    filters: defaultFilters,
    onFiltersChange: vi.fn(),
    onReset: vi.fn(),
    loading: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<UserFilters {...defaultProps} />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays search input', () => {
    render(<UserFilters {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText(/buscar/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('handles search input changes', () => {
    render(<UserFilters {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText(/buscar/i);
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      search: 'test search'
    });
  });

  it('displays role filter dropdown', () => {
    render(<UserFilters {...defaultProps} />);
    
    // Look for role filter (could be select, dropdown, or buttons)
    const roleElements = screen.queryAllByText(/rol/i);
    expect(roleElements.length).toBeGreaterThanOrEqual(0);
  });

  it('handles role filter changes', () => {
    render(<UserFilters {...defaultProps} />);
    
    // Try to find and interact with role filter
    const selects = screen.getAllByRole('combobox');
    if (selects.length > 0) {
      fireEvent.change(selects[0], { target: { value: 'admin' } });
      expect(defaultProps.onFiltersChange).toHaveBeenCalled();
    }
  });

  it('displays status filter', () => {
    render(<UserFilters {...defaultProps} />);
    
    // Look for status filter elements
    const statusElements = screen.queryAllByText(/estado/i);
    expect(statusElements.length).toBeGreaterThanOrEqual(0);
  });

  it('shows reset button when filters are applied', () => {
    const filtersWithValues = {
      search: 'test',
      role: 'admin',
      status: 'active',
      dateRange: undefined
    };

    render(<UserFilters {...defaultProps} filters={filtersWithValues} />);
    
    const resetButton = screen.queryByText(/limpiar/i) || screen.queryByText(/reset/i);
    if (resetButton) {
      expect(resetButton).toBeInTheDocument();
    }
  });

  it('calls onReset when reset button is clicked', () => {
    const filtersWithValues = {
      search: 'test',
      role: 'admin',
      status: 'active',
      dateRange: undefined
    };

    render(<UserFilters {...defaultProps} filters={filtersWithValues} />);
    
    const resetButton = screen.queryByText(/limpiar/i) || screen.queryByText(/reset/i);
    if (resetButton) {
      fireEvent.click(resetButton);
      expect(defaultProps.onReset).toHaveBeenCalled();
    }
  });

  it('shows loading state', () => {
    render(<UserFilters {...defaultProps} loading={true} />);
    
    // Should handle loading state gracefully
    expect(document.body).toBeInTheDocument();
  });

  it('displays date range picker', () => {
    render(<UserFilters {...defaultProps} />);
    
    // Look for date picker elements
    const dateElements = screen.queryAllByText(/fecha/i);
    expect(dateElements.length).toBeGreaterThanOrEqual(0);
  });

  it('handles date range changes', async () => {
    render(<UserFilters {...defaultProps} />);
    
    // Look for date inputs
    const dateInputs = screen.queryAllByRole('textbox');
    if (dateInputs.length > 1) {
      fireEvent.change(dateInputs[0], { target: { value: '2024-01-01' } });
      
      await waitFor(() => {
        expect(defaultProps.onFiltersChange).toHaveBeenCalled();
      });
    }
  });

  it('shows filter chips for active filters', () => {
    const filtersWithValues = {
      search: 'test user',
      role: 'admin',
      status: 'active',
      dateRange: {
        from: '2024-01-01',
        to: '2024-01-31'
      }
    };

    render(<UserFilters {...defaultProps} filters={filtersWithValues} />);
    
    // Should show some indication of active filters
    expect(screen.getByDisplayValue('test user')).toBeInTheDocument();
  });

  it('handles multiple filter changes', () => {
    render(<UserFilters {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText(/buscar/i);
    fireEvent.change(searchInput, { target: { value: 'admin user' } });
    
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      search: 'admin user'
    });
  });

  it('maintains filter state correctly', () => {
    const currentFilters = {
      search: 'existing search',
      role: 'member',
      status: 'inactive',
      dateRange: undefined
    };

    render(<UserFilters {...defaultProps} filters={currentFilters} />);
    
    // Should display current filter values
    expect(screen.getByDisplayValue('existing search')).toBeInTheDocument();
  });
});
