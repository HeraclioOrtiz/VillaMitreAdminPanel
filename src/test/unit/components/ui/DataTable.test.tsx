import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { DataTable } from '@/components/ui';

const mockData = [
  { id: 1, name: 'John Doe', email: 'john@test.com', role: 'admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@test.com', role: 'user' },
  { id: 3, name: 'Bob Johnson', email: 'bob@test.com', role: 'user' }
];

const mockColumns = [
  { 
    key: 'name', 
    title: 'Name', 
    sortable: true,
    render: (value: any, record: any) => <span>{record.name}</span>
  },
  { 
    key: 'email', 
    title: 'Email',
    render: (value: any, record: any) => <span>{record.email}</span>
  },
  { 
    key: 'role', 
    title: 'Role', 
    sortable: true,
    render: (value: any, record: any) => <span>{record.role}</span>
  }
];

describe('DataTable Component', () => {
  it('renders table with data correctly', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);
    
    // Check headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    
    // Check data
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@test.com')).toBeInTheDocument();
    expect(screen.getByText('user')).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    render(<DataTable data={[]} columns={mockColumns} />);
    expect(screen.getByText('No hay datos disponibles')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<DataTable data={[]} columns={mockColumns} loading />);
    expect(screen.getByTestId('table-skeleton')).toBeInTheDocument();
  });

  it('handles sorting correctly', () => {
    const onSort = vi.fn();
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
        onSort={onSort}
      />
    );
    
    // Click on sortable column header
    fireEvent.click(screen.getByText('Name'));
    expect(onSort).toHaveBeenCalledWith({
      key: 'name',
      direction: 'asc'
    });
  });

  it('handles selection correctly', () => {
    const onSelectionChange = vi.fn();
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
        selectable
        onSelectionChange={onSelectionChange}
      />
    );
    
    // Should show checkboxes
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(4); // 3 rows + 1 header
    
    // Click on first row checkbox
    fireEvent.click(checkboxes[1]);
    expect(onSelectionChange).toHaveBeenCalledWith(['1'], [mockData[0]]);
  });

  it('handles select all correctly', () => {
    const onSelectionChange = vi.fn();
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
        selectable
        onSelectionChange={onSelectionChange}
      />
    );
    
    // Click on header checkbox (select all)
    const headerCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(headerCheckbox);
    
    expect(onSelectionChange).toHaveBeenCalledWith(
      ['1', '2', '3'], 
      mockData
    );
  });

  it('shows selected rows correctly', () => {
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
        selectable
        selectedRowKeys={['1', '2']}
      />
    );
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[1]).toBeChecked(); // First row
    expect(checkboxes[2]).toBeChecked(); // Second row
    expect(checkboxes[3]).not.toBeChecked(); // Third row
  });

  it('applies custom row key correctly', () => {
    const customData = [
      { customId: 'a', name: 'Test A' },
      { customId: 'b', name: 'Test B' }
    ];
    
    const customColumns = [
      { key: 'name', title: 'Name', render: (value: any, record: any) => record.name }
    ];
    
    const onSelectionChange = vi.fn();
    
    render(
      <DataTable 
        data={customData} 
        columns={customColumns} 
        selectable
        rowKey="customId"
        onSelectionChange={onSelectionChange}
      />
    );
    
    // Click on first row checkbox
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    
    expect(onSelectionChange).toHaveBeenCalledWith(['a'], [customData[0]]);
  });

  it('shows custom empty message', () => {
    render(
      <DataTable 
        data={[]} 
        columns={mockColumns} 
        emptyText="Custom empty message"
      />
    );
    expect(screen.getByText('Custom empty message')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
        className="custom-table-class"
      />
    );
    
    const table = screen.getByRole('table');
    expect(table.closest('div')).toHaveClass('custom-table-class');
  });

  it('handles column without render function', () => {
    const simpleColumns = [
      { key: 'name', title: 'Name' },
      { key: 'email', title: 'Email' }
    ];
    
    render(<DataTable data={mockData} columns={simpleColumns} />);
    
    // Should render the raw values
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@test.com')).toBeInTheDocument();
  });

  it('shows sort indicators correctly', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);
    
    // Should show sort indicator for sortable columns
    const nameHeader = screen.getByText('Name').closest('th');
    expect(nameHeader).toHaveClass('cursor-pointer');
  });

  it('disables sorting for non-sortable columns', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);
    
    // Email column is not sortable
    const emailHeader = screen.getByText('Email').closest('th');
    expect(emailHeader).not.toHaveClass('cursor-pointer');
  });
});
