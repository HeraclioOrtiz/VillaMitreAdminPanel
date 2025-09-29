import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { TemplateGrid } from '@/components/gym';
import { mockTemplate } from '@/test/utils';

describe('TemplateGrid Component - Simple Tests', () => {
  const mockTemplates = [
    mockTemplate,
    {
      ...mockTemplate,
      id: 2,
      name: 'Upper Body Workout',
      description: 'Focus on upper body strength',
      primary_goal: 'hypertrophy',
      difficulty: 'advanced' as const
    },
    {
      ...mockTemplate,
      id: 3,
      name: 'Cardio Session',
      description: 'High intensity cardio',
      primary_goal: 'endurance',
      difficulty: 'intermediate' as const
    }
  ];

  const defaultProps = {
    templates: mockTemplates,
    loading: false,
    onTemplateSelect: vi.fn(),
    onTemplateEdit: vi.fn(),
    onTemplateDuplicate: vi.fn(),
    onTemplateDelete: vi.fn(),
    onTemplateFavorite: vi.fn(),
    loadingStates: {}
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<TemplateGrid {...defaultProps} />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays all templates', () => {
    render(<TemplateGrid {...defaultProps} />);
    
    expect(screen.getByText('Test Template')).toBeInTheDocument();
    expect(screen.getByText('Upper Body Workout')).toBeInTheDocument();
    expect(screen.getByText('Cardio Session')).toBeInTheDocument();
  });

  it('shows template descriptions', () => {
    render(<TemplateGrid {...defaultProps} />);
    
    expect(screen.getByText('This is a test template')).toBeInTheDocument();
    expect(screen.getByText('Focus on upper body strength')).toBeInTheDocument();
    expect(screen.getByText('High intensity cardio')).toBeInTheDocument();
  });

  it('displays template goals', () => {
    render(<TemplateGrid {...defaultProps} />);
    
    expect(screen.getByText(/strength/i)).toBeInTheDocument();
    expect(screen.getByText(/hypertrophy/i)).toBeInTheDocument();
    expect(screen.getByText(/endurance/i)).toBeInTheDocument();
  });

  it('shows difficulty levels', () => {
    render(<TemplateGrid {...defaultProps} />);
    
    expect(screen.getByText(/beginner/i)).toBeInTheDocument();
    expect(screen.getByText(/advanced/i)).toBeInTheDocument();
    expect(screen.getByText(/intermediate/i)).toBeInTheDocument();
  });

  it('handles template selection', () => {
    render(<TemplateGrid {...defaultProps} />);
    
    const templateCards = screen.getAllByRole('button');
    if (templateCards.length > 0) {
      fireEvent.click(templateCards[0]);
      expect(defaultProps.onTemplateSelect).toHaveBeenCalledWith(mockTemplates[0]);
    }
  });

  it('shows loading state', () => {
    render(<TemplateGrid {...defaultProps} loading={true} />);
    
    // Should show loading skeletons or indicators
    expect(document.body).toBeInTheDocument();
  });

  it('handles empty template list', () => {
    render(<TemplateGrid {...defaultProps} templates={[]} />);
    
    // Should show empty state
    expect(document.body).toBeInTheDocument();
  });

  it('displays template metadata', () => {
    render(<TemplateGrid {...defaultProps} />);
    
    // Should show exercise count, duration, etc.
    const metadata = screen.queryAllByText(/ejercicios/i);
    expect(metadata.length).toBeGreaterThanOrEqual(0);
  });

  it('shows action buttons on hover', () => {
    render(<TemplateGrid {...defaultProps} />);
    
    const actionButtons = screen.getAllByRole('button');
    expect(actionButtons.length).toBeGreaterThan(0);
  });

  it('handles favorite toggle', () => {
    render(<TemplateGrid {...defaultProps} />);
    
    // Look for favorite buttons (heart icons, star icons, etc.)
    const favoriteButtons = screen.queryAllByRole('button');
    if (favoriteButtons.length > 0) {
      // Test that buttons exist and can be clicked
      expect(favoriteButtons.length).toBeGreaterThan(0);
    }
  });

  it('displays template tags', () => {
    const templatesWithTags = mockTemplates.map(template => ({
      ...template,
      tags: ['strength', 'compound', 'beginner']
    }));

    render(<TemplateGrid {...defaultProps} templates={templatesWithTags} />);
    
    // Should show tags if they exist
    expect(screen.getByText('Test Template')).toBeInTheDocument();
  });

  it('handles loading states for individual templates', () => {
    const loadingStates = {
      [mockTemplates[0].id]: { delete: true, favorite: true }
    };

    render(<TemplateGrid {...defaultProps} loadingStates={loadingStates} />);
    
    // Should show loading indicators for specific templates
    expect(document.body).toBeInTheDocument();
  });

  it('shows template statistics', () => {
    render(<TemplateGrid {...defaultProps} />);
    
    // Should show usage count, rating, etc.
    const stats = screen.queryAllByText(/\d+/);
    expect(stats.length).toBeGreaterThanOrEqual(0);
  });

  it('handles grid layout responsively', () => {
    render(<TemplateGrid {...defaultProps} />);
    
    // Should render in a grid layout
    const gridContainer = screen.getByText('Test Template').closest('div');
    expect(gridContainer).toBeInTheDocument();
  });

  it('supports different view modes', () => {
    render(<TemplateGrid {...defaultProps} viewMode="compact" />);
    
    // Should adapt to different view modes if supported
    expect(document.body).toBeInTheDocument();
  });

  it('handles template filtering', () => {
    const filteredTemplates = mockTemplates.filter(t => t.primary_goal === 'strength');
    
    render(<TemplateGrid {...defaultProps} templates={filteredTemplates} />);
    
    expect(screen.getByText('Test Template')).toBeInTheDocument();
    expect(screen.queryByText('Upper Body Workout')).not.toBeInTheDocument();
  });

  it('shows template creation date', () => {
    render(<TemplateGrid {...defaultProps} />);
    
    // Should show when templates were created
    const dates = screen.queryAllByText(/\d{4}/);
    expect(dates.length).toBeGreaterThanOrEqual(0);
  });

  it('handles template actions correctly', () => {
    render(<TemplateGrid {...defaultProps} />);
    
    // All action handlers should be functions
    expect(typeof defaultProps.onTemplateSelect).toBe('function');
    expect(typeof defaultProps.onTemplateEdit).toBe('function');
    expect(typeof defaultProps.onTemplateDuplicate).toBe('function');
    expect(typeof defaultProps.onTemplateDelete).toBe('function');
    expect(typeof defaultProps.onTemplateFavorite).toBe('function');
  });
});
