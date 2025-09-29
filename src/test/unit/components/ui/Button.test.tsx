import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { Button } from '@/components/ui';
import { PlusIcon } from '@heroicons/react/24/outline';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('applies correct variant classes', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-villa-mitre-600');
  });

  it('applies secondary variant classes', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-white');
  });

  it('applies ghost variant classes', () => {
    render(<Button variant="ghost">Ghost Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-gray-100');
  });

  it('applies danger variant classes', () => {
    render(<Button variant="danger">Danger Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-600');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state correctly', () => {
    render(<Button isLoading>Loading Button</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Cargando...');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('renders with left icon', () => {
    render(
      <Button leftIcon={<PlusIcon data-testid="left-icon" />}>
        With Left Icon
      </Button>
    );
    
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByText('With Left Icon')).toBeInTheDocument();
  });

  it('renders with right icon', () => {
    render(
      <Button rightIcon={<PlusIcon data-testid="right-icon" />}>
        With Right Icon
      </Button>
    );
    
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    expect(screen.getByText('With Right Icon')).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1.5', 'text-sm');
    
    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-4', 'py-2', 'text-sm');
    
    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-base');
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when loading', () => {
    const handleClick = vi.fn();
    render(<Button isLoading onClick={handleClick}>Loading</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Ref Button</Button>);
    expect(ref).toHaveBeenCalled();
  });

  it('has correct accessibility attributes', () => {
    render(<Button>Accessible Button</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Accessible Button');
    
    // Test loading state
    const { rerender } = render(<Button isLoading>Loading Button</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Cargando...');
  });
});
