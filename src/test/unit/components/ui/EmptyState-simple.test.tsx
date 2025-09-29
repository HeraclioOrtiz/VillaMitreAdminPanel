import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { 
  EmptyState, 
  SearchEmptyState, 
  ExercisesEmptyState, 
  TemplatesEmptyState,
  UsersEmptyState 
} from '@/components/ui';

describe('EmptyState Components - Simple Tests', () => {
  describe('Basic EmptyState', () => {
    it('renders with title and description', () => {
      render(
        <EmptyState
          title="No hay datos"
          description="No se encontraron elementos"
          illustration="folder"
        />
      );
      
      expect(screen.getByText('No hay datos')).toBeInTheDocument();
      expect(screen.getByText('No se encontraron elementos')).toBeInTheDocument();
    });

    it('renders with actions', () => {
      const mockAction = vi.fn();
      
      render(
        <EmptyState
          title="No hay datos"
          description="No se encontraron elementos"
          illustration="create"
          actions={[
            {
              label: 'Crear nuevo',
              onClick: mockAction,
              variant: 'primary'
            }
          ]}
        />
      );
      
      const button = screen.getByText('Crear nuevo');
      expect(button).toBeInTheDocument();
      
      fireEvent.click(button);
      expect(mockAction).toHaveBeenCalled();
    });

    it('renders with secondary action', () => {
      const primaryAction = vi.fn();
      const secondaryAction = vi.fn();
      
      render(
        <EmptyState
          title="No hay datos"
          description="No se encontraron elementos"
          illustration="search"
          actions={[
            {
              label: 'Acción principal',
              onClick: primaryAction,
              variant: 'primary'
            },
            {
              label: 'Acción secundaria',
              onClick: secondaryAction,
              variant: 'secondary'
            }
          ]}
        />
      );
      
      expect(screen.getByText('Acción principal')).toBeInTheDocument();
      expect(screen.getByText('Acción secundaria')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <EmptyState
          title="Test"
          description="Test description"
          illustration="info"
          className="custom-empty-state"
        />
      );
      
      const container = document.querySelector('.custom-empty-state');
      expect(container).toBeInTheDocument();
    });
  });

  describe('SearchEmptyState', () => {
    it('renders search-specific content', () => {
      render(<SearchEmptyState searchTerm="test query" onClearSearch={vi.fn()} />);
      
      expect(screen.getByText(/No se encontraron resultados/i)).toBeInTheDocument();
      expect(screen.getByText(/test query/i)).toBeInTheDocument();
    });

    it('renders without search term', () => {
      render(<SearchEmptyState searchTerm="" onClearSearch={vi.fn()} />);
      expect(screen.getByText(/No se encontraron resultados/i)).toBeInTheDocument();
    });

    it('calls onClearSearch when provided', () => {
      const mockClear = vi.fn();
      
      render(<SearchEmptyState searchTerm="test" onClearSearch={mockClear} />);
      
      const clearButton = screen.getByText(/Limpiar búsqueda/i);
      fireEvent.click(clearButton);
      
      expect(mockClear).toHaveBeenCalled();
    });
  });

  describe('ExercisesEmptyState', () => {
    it('renders exercises-specific content', () => {
      render(<ExercisesEmptyState onCreateExercise={vi.fn()} />);
      expect(screen.getByText(/No hay ejercicios/i)).toBeInTheDocument();
    });

    it('calls onCreateExercise when provided', () => {
      const mockCreate = vi.fn();
      
      render(<ExercisesEmptyState onCreateExercise={mockCreate} />);
      
      const createButton = screen.getByText(/Crear ejercicio/i);
      fireEvent.click(createButton);
      
      expect(mockCreate).toHaveBeenCalled();
    });

    it('shows clear filters option when hasFilters is true', () => {
      const mockClear = vi.fn();
      
      render(
        <ExercisesEmptyState 
          onCreateExercise={vi.fn()}
          hasFilters={true} 
          onClearFilters={mockClear} 
        />
      );
      
      const clearButton = screen.getByText(/Limpiar filtros/i);
      fireEvent.click(clearButton);
      
      expect(mockClear).toHaveBeenCalled();
    });
  });

  describe('TemplatesEmptyState', () => {
    it('renders templates-specific content', () => {
      render(<TemplatesEmptyState onCreateTemplate={vi.fn()} />);
      expect(screen.getByText(/No hay plantillas/i)).toBeInTheDocument();
    });

    it('calls onCreateTemplate when provided', () => {
      const mockCreate = vi.fn();
      
      render(<TemplatesEmptyState onCreateTemplate={mockCreate} />);
      
      const createButton = screen.getByText(/Crear plantilla/i);
      fireEvent.click(createButton);
      
      expect(mockCreate).toHaveBeenCalled();
    });
  });

  describe('UsersEmptyState', () => {
    it('renders users-specific content', () => {
      render(<UsersEmptyState onInviteUser={vi.fn()} />);
      expect(screen.getByText(/No hay usuarios/i)).toBeInTheDocument();
    });

    it('calls onCreateUser when provided', () => {
      const mockCreate = vi.fn();
      
      render(<UsersEmptyState onInviteUser={mockCreate} />);
      
      const createButton = screen.getByText(/Crear usuario/i);
      fireEvent.click(createButton);
      
      expect(mockCreate).toHaveBeenCalled();
    });

    it('shows invite option correctly', () => {
      const mockInvite = vi.fn();
      
      render(<UsersEmptyState onInviteUser={mockInvite} />);
      
      const inviteButton = screen.getByText(/Invitar usuario/i);
      fireEvent.click(inviteButton);
      
      expect(mockInvite).toHaveBeenCalled();
    });
  });
});
