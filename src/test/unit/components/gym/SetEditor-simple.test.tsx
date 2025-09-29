import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { SetEditor } from '@/components/gym';

describe('SetEditor Component - Simple Tests', () => {
  const mockExercise = {
    id: 1,
    name: 'Test Exercise',
    description: 'Test description',
    instructions: 'Test instructions',
    muscle_group: ['chest'],
    equipment: ['barbell'],
    difficulty: 'beginner' as const,
    tags: ['test'],
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z'
  };

  const mockSets = [
    {
      id: '1',
      reps: 10,
      weight: 50,
      rest: 60,
      notes: ''
    }
  ];

  const defaultProps = {
    exercise: mockExercise,
    sets: mockSets,
    onChange: vi.fn(),
    onSetsChange: vi.fn(),
    restBetweenSets: 60,
    onRestBetweenSetsChange: vi.fn(),
    exerciseNotes: '',
    onExerciseNotesChange: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<SetEditor {...defaultProps} />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays exercise name', () => {
    render(<SetEditor {...defaultProps} />);
    expect(screen.getByText('Test Exercise')).toBeInTheDocument();
  });

  it('renders sets table', () => {
    render(<SetEditor {...defaultProps} />);
    // Should show table headers
    expect(screen.getByText('Serie')).toBeInTheDocument();
    expect(screen.getByText('Reps')).toBeInTheDocument();
    expect(screen.getByText('Peso (kg)')).toBeInTheDocument();
  });

  it('shows add set button', () => {
    render(<SetEditor {...defaultProps} />);
    expect(screen.getByText('Agregar Serie')).toBeInTheDocument();
  });

  it('calls onChange when adding a set', () => {
    render(<SetEditor {...defaultProps} />);
    
    const addButton = screen.getByText('Agregar Serie');
    fireEvent.click(addButton);
    
    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it('displays rest between sets input', () => {
    render(<SetEditor {...defaultProps} />);
    expect(screen.getByLabelText(/Descanso entre series/i)).toBeInTheDocument();
  });

  it('displays exercise notes textarea', () => {
    render(<SetEditor {...defaultProps} />);
    expect(screen.getByLabelText(/Notas del ejercicio/i)).toBeInTheDocument();
  });

  it('handles empty sets array', () => {
    const propsWithEmptySets = {
      ...defaultProps,
      sets: []
    };
    
    render(<SetEditor {...propsWithEmptySets} />);
    expect(screen.getByText('Agregar Serie')).toBeInTheDocument();
  });

  it('renders with multiple sets', () => {
    const multipleSets = [
      { id: '1', reps: 10, weight: 50, rest: 60, notes: '' },
      { id: '2', reps: 8, weight: 55, rest: 60, notes: '' },
      { id: '3', reps: 6, weight: 60, rest: 60, notes: '' }
    ];
    
    const propsWithMultipleSets = {
      ...defaultProps,
      sets: multipleSets
    };
    
    render(<SetEditor {...propsWithMultipleSets} />);
    
    // Should show all sets
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    expect(screen.getByDisplayValue('8')).toBeInTheDocument();
    expect(screen.getByDisplayValue('6')).toBeInTheDocument();
  });
});
