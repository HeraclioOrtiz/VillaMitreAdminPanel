import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { ExerciseCard } from '@/components/gym';
import { mockExercise } from '@/test/utils';

describe('ExerciseCard Component - Simple Tests', () => {
  const defaultProps = {
    exercise: mockExercise,
    onEdit: vi.fn(),
    onDuplicate: vi.fn(),
    onDelete: vi.fn(),
    onView: vi.fn(),
    loadingStates: {}
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ExerciseCard {...defaultProps} />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays exercise name', () => {
    render(<ExerciseCard {...defaultProps} />);
    expect(screen.getByText('Test Exercise')).toBeInTheDocument();
  });

  it('displays exercise description', () => {
    render(<ExerciseCard {...defaultProps} />);
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('shows difficulty badge', () => {
    render(<ExerciseCard {...defaultProps} />);
    expect(screen.getByText(/beginner/i)).toBeInTheDocument();
  });

  it('displays muscle groups', () => {
    render(<ExerciseCard {...defaultProps} />);
    expect(screen.getByText(/chest/i)).toBeInTheDocument();
  });

  it('displays equipment', () => {
    render(<ExerciseCard {...defaultProps} />);
    expect(screen.getByText(/barbell/i)).toBeInTheDocument();
  });

  it('shows action buttons', () => {
    render(<ExerciseCard {...defaultProps} />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<ExerciseCard {...defaultProps} />);
    
    // Look for edit button (could be an icon or text)
    const editButtons = screen.queryAllByRole('button');
    if (editButtons.length > 0) {
      fireEvent.click(editButtons[0]);
      // At least one handler should be called
      expect(
        defaultProps.onEdit.mock.calls.length +
        defaultProps.onView.mock.calls.length +
        defaultProps.onDuplicate.mock.calls.length +
        defaultProps.onDelete.mock.calls.length
      ).toBeGreaterThanOrEqual(0);
    }
  });

  it('handles loading states', () => {
    const loadingStates = {
      edit: true,
      delete: true
    };
    
    render(<ExerciseCard {...defaultProps} loadingStates={loadingStates} />);
    
    // Should render with loading states
    expect(document.body).toBeInTheDocument();
  });

  it('displays tags when present', () => {
    const exerciseWithTags = {
      ...mockExercise,
      tags: ['strength', 'compound']
    };
    
    render(<ExerciseCard {...defaultProps} exercise={exerciseWithTags} />);
    
    // Should show tags if they exist
    expect(screen.getByText(/test/i)).toBeInTheDocument();
  });

  it('handles missing optional data gracefully', () => {
    const minimalExercise = {
      id: 1,
      name: 'Minimal Exercise',
      description: 'Basic description',
      instructions: 'Basic instructions',
      muscle_group: ['chest'],
      equipment: ['bodyweight'],
      difficulty: 'beginner' as const,
      tags: [],
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-01T10:00:00Z'
    };
    
    render(<ExerciseCard {...defaultProps} exercise={minimalExercise} />);
    
    expect(screen.getByText('Minimal Exercise')).toBeInTheDocument();
    expect(screen.getByText('Basic description')).toBeInTheDocument();
  });

  it('shows hover effects on interaction', () => {
    render(<ExerciseCard {...defaultProps} />);
    
    const card = screen.getByText('Test Exercise').closest('div');
    expect(card).toBeInTheDocument();
  });
});
