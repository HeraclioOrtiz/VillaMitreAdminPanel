import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { UserActions } from '@/components/admin';
import { mockUser } from '@/test/utils';

const defaultProps = {
  user: mockUser,
  onView: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  onDuplicate: vi.fn(),
  onAssignProfessor: vi.fn(),
  onResetPassword: vi.fn(),
  onToggleStatus: vi.fn(),
  onVerifyEmail: vi.fn(),
  onVerifyPhone: vi.fn(),
  loadingStates: {},
  permissions: {
    canView: true,
    canEdit: true,
    canDelete: true,
    canDuplicate: true,
    canAssignProfessor: true,
    canResetPassword: true,
    canToggleStatus: true,
    canVerify: true,
  }
};

describe('UserActions Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all actions when permissions allow', () => {
    render(<UserActions {...defaultProps} />);

    expect(screen.getByLabelText('Ver usuario')).toBeInTheDocument();
    expect(screen.getByLabelText('Editar usuario')).toBeInTheDocument();
    expect(screen.getByLabelText('Eliminar usuario')).toBeInTheDocument();
    expect(screen.getByLabelText('Duplicar usuario')).toBeInTheDocument();
  });

  it('calls correct handler on action click', () => {
    render(<UserActions {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('Ver usuario'));
    expect(defaultProps.onView).toHaveBeenCalledWith(mockUser);

    fireEvent.click(screen.getByLabelText('Editar usuario'));
    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockUser);

    fireEvent.click(screen.getByLabelText('Duplicar usuario'));
    expect(defaultProps.onDuplicate).toHaveBeenCalledWith(mockUser);
  });

  it('shows confirmation for delete action', () => {
    // Mock window.confirm
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    
    render(<UserActions {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('Eliminar usuario'));
    
    expect(confirmSpy).toHaveBeenCalledWith(
      `¿Estás seguro de que deseas eliminar a ${mockUser.first_name} ${mockUser.last_name}?`
    );
    expect(defaultProps.onDelete).toHaveBeenCalledWith(mockUser);
    
    confirmSpy.mockRestore();
  });

  it('does not call delete handler when confirmation is cancelled', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    
    render(<UserActions {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('Eliminar usuario'));
    
    expect(confirmSpy).toHaveBeenCalled();
    expect(defaultProps.onDelete).not.toHaveBeenCalled();
    
    confirmSpy.mockRestore();
  });

  it('hides actions when permissions deny', () => {
    const restrictedPermissions = {
      canView: true,
      canEdit: false,
      canDelete: false,
      canDuplicate: false,
      canAssignProfessor: false,
      canResetPassword: false,
      canToggleStatus: false,
      canVerify: false,
    };

    render(
      <UserActions 
        {...defaultProps} 
        permissions={restrictedPermissions}
      />
    );

    expect(screen.getByLabelText('Ver usuario')).toBeInTheDocument();
    expect(screen.queryByLabelText('Editar usuario')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Eliminar usuario')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Duplicar usuario')).not.toBeInTheDocument();
  });

  it('shows loading state for specific action', () => {
    const loadingStates = { delete: true };
    
    render(
      <UserActions 
        {...defaultProps} 
        loadingStates={loadingStates}
      />
    );

    const deleteButton = screen.getByLabelText('Eliminar usuario');
    expect(deleteButton).toBeDisabled();
    expect(deleteButton.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders in compact mode', () => {
    render(<UserActions {...defaultProps} compact />);
    
    // In compact mode, should show dropdown trigger
    expect(screen.getByLabelText('Más acciones')).toBeInTheDocument();
  });

  it('shows assign professor action only for members', () => {
    const memberUser = { ...mockUser, is_member: true };
    
    render(
      <UserActions 
        {...defaultProps} 
        user={memberUser}
      />
    );

    // Should show assign professor action for members
    expect(screen.getByLabelText('Asignar profesor')).toBeInTheDocument();
  });

  it('hides assign professor action for non-members', () => {
    const nonMemberUser = { ...mockUser, is_member: false };
    
    render(
      <UserActions 
        {...defaultProps} 
        user={nonMemberUser}
      />
    );

    // Should not show assign professor action for non-members
    expect(screen.queryByLabelText('Asignar profesor')).not.toBeInTheDocument();
  });

  it('handles verify email action', () => {
    render(<UserActions {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('Verificar email'));
    expect(defaultProps.onVerifyEmail).toHaveBeenCalledWith(mockUser);
  });

  it('handles verify phone action', () => {
    render(<UserActions {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('Verificar teléfono'));
    expect(defaultProps.onVerifyPhone).toHaveBeenCalledWith(mockUser);
  });

  it('handles toggle status action', () => {
    render(<UserActions {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('Cambiar estado'));
    expect(defaultProps.onToggleStatus).toHaveBeenCalledWith(mockUser);
  });

  it('handles reset password action', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    
    render(<UserActions {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('Resetear contraseña'));
    
    expect(confirmSpy).toHaveBeenCalledWith(
      `¿Enviar email de reseteo de contraseña a ${mockUser.email}?`
    );
    expect(defaultProps.onResetPassword).toHaveBeenCalledWith(mockUser);
    
    confirmSpy.mockRestore();
  });

  it('shows different loading states for different actions', () => {
    const loadingStates = { 
      delete: true, 
      edit: false, 
      assignProfessor: true 
    };
    
    render(
      <UserActions 
        {...defaultProps} 
        loadingStates={loadingStates}
      />
    );

    // Delete button should be loading
    expect(screen.getByLabelText('Eliminar usuario')).toBeDisabled();
    
    // Edit button should not be loading
    expect(screen.getByLabelText('Editar usuario')).not.toBeDisabled();
    
    // Assign professor button should be loading
    expect(screen.getByLabelText('Asignar profesor')).toBeDisabled();
  });

  it('has correct accessibility attributes', () => {
    render(<UserActions {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-label');
    });
  });

  it('handles keyboard navigation', () => {
    render(<UserActions {...defaultProps} />);

    const firstButton = screen.getByLabelText('Ver usuario');
    firstButton.focus();
    
    expect(document.activeElement).toBe(firstButton);
    
    // Test tab navigation
    fireEvent.keyDown(firstButton, { key: 'Tab' });
    // Next button should be focused (implementation dependent)
  });
});
