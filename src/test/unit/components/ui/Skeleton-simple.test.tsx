import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { 
  Skeleton, 
  ExerciseCardSkeleton, 
  TemplateCardSkeleton,
  TableRowSkeleton,
  FormSkeleton,
  ListPageSkeleton 
} from '@/components/ui';

describe('Skeleton Components - Simple Tests', () => {
  describe('Basic Skeleton', () => {
    it('renders with default props', () => {
      render(<Skeleton />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('applies custom width and height', () => {
      render(<Skeleton width="200px" height="50px" />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveStyle({ width: '200px', height: '50px' });
    });

    it('applies custom className', () => {
      render(<Skeleton className="custom-class" />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('custom-class');
    });

    it('renders circular variant', () => {
      render(<Skeleton variant="circular" />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('rounded-full');
    });

    it('renders text variant', () => {
      render(<Skeleton variant="text" />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('h-4');
    });

    it('applies different animations', () => {
      const { rerender } = render(<Skeleton animation="pulse" />);
      let skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('animate-pulse');

      rerender(<Skeleton animation="wave" />);
      skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('animate-wave');

      rerender(<Skeleton animation="none" />);
      skeleton = screen.getByRole('status');
      expect(skeleton).not.toHaveClass('animate-pulse');
      expect(skeleton).not.toHaveClass('animate-wave');
    });
  });

  describe('ExerciseCardSkeleton', () => {
    it('renders without crashing', () => {
      render(<ExerciseCardSkeleton />);
      // Should render multiple skeleton elements for card structure
      const skeletons = screen.getAllByRole('status');
      expect(skeletons.length).toBeGreaterThan(1);
    });

    it('renders with proper structure', () => {
      render(<ExerciseCardSkeleton />);
      const skeletons = screen.getAllByRole('status');
      expect(skeletons.length).toBeGreaterThan(1);
    });
  });

  describe('TemplateCardSkeleton', () => {
    it('renders without crashing', () => {
      render(<TemplateCardSkeleton />);
      const skeletons = screen.getAllByRole('status');
      expect(skeletons.length).toBeGreaterThan(1);
    });
  });

  describe('TableRowSkeleton', () => {
    it('renders with default columns', () => {
      render(
        <table>
          <tbody>
            <TableRowSkeleton />
          </tbody>
        </table>
      );
      const row = screen.getByRole('row');
      expect(row).toBeInTheDocument();
    });

    it('renders with custom column count', () => {
      render(
        <table>
          <tbody>
            <TableRowSkeleton columns={5} />
          </tbody>
        </table>
      );
      const cells = screen.getAllByRole('cell');
      expect(cells).toHaveLength(5);
    });
  });

  describe('FormSkeleton', () => {
    it('renders without crashing', () => {
      render(<FormSkeleton />);
      const skeletons = screen.getAllByRole('status');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders with proper structure', () => {
      render(<FormSkeleton />);
      const skeletons = screen.getAllByRole('status');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('ListPageSkeleton', () => {
    it('renders complete page skeleton', () => {
      render(<ListPageSkeleton />);
      const skeletons = screen.getAllByRole('status');
      // Should have header, filters, content skeletons
      expect(skeletons.length).toBeGreaterThan(5);
    });

    it('renders with proper structure', () => {
      render(<ListPageSkeleton />);
      const skeletons = screen.getAllByRole('status');
      expect(skeletons.length).toBeGreaterThan(5);
    });

    it('renders consistently', () => {
      render(<ListPageSkeleton />);
      const skeletons = screen.getAllByRole('status');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });
});
