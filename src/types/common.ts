export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

export interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'multiselect';
  options?: SelectOption[];
  placeholder?: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}
