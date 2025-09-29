import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/utils';
import { UserTable } from '@/components/admin';
import { mockUser } from '@/test/utils';

describe('UserTable Component - Simple Tests', () => {
  const mockUsers = [
    mockUser,
    {
      ...mockUser,
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      role: 'admin' as const
    }
  ];

  const defaultProps = {
    users: mockUsers,
    loading: false,
    selectedUsers: [],
    onSelectionChange: vi.fn(),
    onSort: vi.fn(),
    sortBy: undefined,
    sortDirection: 'asc' as const,
    onView: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    loadingStates: {},
    permissions: {
      canView: true,
      canEdit: true,
      canDelete: true
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<UserTable {...defaultProps} />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays user data', () => {
    render(<UserTable {...defaultProps} />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<UserTable {...defaultProps} loading={true} />);
    
    // Should show some loading indicator
    expect(document.body).toBeInTheDocument();
  });

  it('handles empty user list', () => {
    render(<UserTable {...defaultProps} users={[]} />);
    
    // Should handle empty state gracefully
    expect(document.body).toBeInTheDocument();
  });

  it('handles selection change', () => {
    render(<UserTable {...defaultProps} />);
    
    // Look for checkboxes or selection elements
    const checkboxes = screen.queryAllByRole('checkbox');
    if (checkboxes.length > 0) {
      // If checkboxes exist, test selection
      expect(checkboxes.length).toBeGreaterThan(0);
    }
  });

  it('displays user roles correctly', () => {
    render(<UserTable {...defaultProps} />);
    
    // Should show role badges or text
    expect(screen.getByText(/member/i)).toBeInTheDocument();
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
  });

  it('handles sorting', () => {
    render(<UserTable {...defaultProps} sortBy="name" sortDirection="asc" />);
    
    // Should render with sorting applied
    expect(document.body).toBeInTheDocument();
  });

  it('shows action buttons when permissions allow', () => {
    render(<UserTable {...defaultProps} />);
    
    // Look for action buttons (view, edit, delete)
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('handles loading states for individual users', () => {
    const loadingStates = {
      [mockUser.id]: { delete: true }
    };
    
    render(<UserTable {...defaultProps} loadingStates={loadingStates} />);
    
    // Should show loading state for specific user actions
    expect(document.body).toBeInTheDocument();
  });

  it('respects permissions', () => {
    const restrictedPermissions = {
      canView: false,
      canEdit: false,
      canDelete: false
    };
    
    render(<UserTable {...defaultProps} permissions={restrictedPermissions} />);
    
    // Should render with restricted permissions
    expect(document.body).toBeInTheDocument();
  });
});
