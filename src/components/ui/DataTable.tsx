import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui';
import Pagination from './Pagination';
import TableSkeleton from './TableSkeleton';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';

// Tipos para las columnas de la tabla
export interface Column<T = any> {
  key: string;
  title: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  className?: string;
}

// Tipos para la configuración de ordenamiento
export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

// Tipos para la paginación
export interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
}

// Props del componente DataTable
interface DataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pagination?: PaginationConfig;
  onPaginationChange?: (page: number, pageSize: number) => void;
  onSort?: (sortConfig: SortConfig | null) => void;
  selectable?: boolean;
  selectedRowKeys?: React.Key[];
  onSelectionChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
  rowKey?: string | ((record: T) => React.Key);
  emptyText?: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  bordered?: boolean;
  hover?: boolean;
  striped?: boolean;
}

const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  pagination,
  onPaginationChange,
  onSort,
  selectable = false,
  selectedRowKeys = [],
  onSelectionChange,
  rowKey = 'id',
  emptyText = 'No hay datos disponibles',
  className = '',
  size = 'medium',
  hover = false,
  striped = false,
  bordered = false,
}: DataTableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // Función para obtener la clave de una fila
  const getRowKey = (record: T, index: number): React.Key => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] || index;
  };

  // Manejar el ordenamiento
  const handleSort = (columnKey: string) => {
    let newSortConfig: SortConfig | null = null;

    if (!sortConfig || sortConfig.key !== columnKey) {
      newSortConfig = { key: columnKey, direction: 'asc' };
    } else if (sortConfig.direction === 'asc') {
      newSortConfig = { key: columnKey, direction: 'desc' };
    } else {
      newSortConfig = null; // Quitar ordenamiento
    }

    setSortConfig(newSortConfig);
    onSort?.(newSortConfig);
  };

  // Manejar selección de todas las filas
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allKeys = data.map((record, index) => getRowKey(record, index));
      onSelectionChange?.(allKeys, data);
    } else {
      onSelectionChange?.([], []);
    }
  };

  // Manejar selección de una fila
  const handleSelectRow = (record: T, index: number, checked: boolean) => {
    const key = getRowKey(record, index);
    let newSelectedKeys: React.Key[];
    let newSelectedRows: T[];

    if (checked) {
      newSelectedKeys = [...selectedRowKeys, key];
      newSelectedRows = [...data.filter((item, idx) => 
        selectedRowKeys.includes(getRowKey(item, idx))
      ), record];
    } else {
      newSelectedKeys = selectedRowKeys.filter(k => k !== key);
      newSelectedRows = data.filter((item, idx) => 
        newSelectedKeys.includes(getRowKey(item, idx))
      );
    }

    onSelectionChange?.(newSelectedKeys, newSelectedRows);
  };

  // Calcular si todas las filas están seleccionadas
  const allSelected = data.length > 0 && selectedRowKeys.length === data.length;
  const someSelected = selectedRowKeys.length > 0 && selectedRowKeys.length < data.length;

  // Clases CSS dinámicas
  const tableClasses = useMemo(() => {
    const classes = ['min-w-full divide-y divide-gray-300'];
    
    if (size === 'small') classes.push('text-sm');
    if (size === 'large') classes.push('text-lg');
    
    return classes.join(' ');
  }, [size]);

  const containerClasses = useMemo(() => {
    const classes = ['overflow-hidden shadow ring-1 ring-black ring-opacity-5'];
    
    if (bordered) classes.push('md:rounded-lg');
    
    return classes.join(' ');
  }, [bordered]);

  // Renderizar contenido de celda
  const renderCell = (column: Column<T>, record: T, index: number) => {
    if (column.render) {
      return column.render(record[column.key], record, index);
    }
    return record[column.key];
  };

  // Mostrar skeleton mientras carga
  if (loading) {
    return (
      <TableSkeleton
        rows={pagination?.pageSize || 10}
        columns={columns.length + (selectable ? 1 : 0)}
        className={className}
      />
    );
  }

  return (
    <div className={className}>
      <div className={containerClasses}>
        <table className={tableClasses}>
          {/* Header */}
          <thead className="bg-gray-50">
            <tr>
              {/* Columna de selección */}
              {selectable && (
                <th className="relative px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-villa-mitre-600 focus:ring-villa-mitre-500"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
              )}

              {/* Columnas de datos */}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide ${
                    column.sortable ? 'cursor-pointer select-none hover:bg-gray-100' : ''
                  } ${column.className || ''}`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <span className="flex flex-col">
                        <ChevronUpIcon
                          className={`h-3 w-3 ${
                            sortConfig?.key === column.key && sortConfig.direction === 'asc'
                              ? 'text-villa-mitre-600'
                              : 'text-gray-300'
                          }`}
                        />
                        <ChevronDownIcon
                          className={`h-3 w-3 -mt-1 ${
                            sortConfig?.key === column.key && sortConfig.direction === 'desc'
                              ? 'text-villa-mitre-600'
                              : 'text-gray-300'
                          }`}
                        />
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className={`bg-white divide-y divide-gray-200 ${striped ? 'divide-y-0' : ''}`}>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <EllipsisVerticalIcon className="h-12 w-12 text-gray-300" />
                    <p>{emptyText}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((record, index) => {
                const key = getRowKey(record, index);
                const isSelected = selectedRowKeys.includes(key);

                return (
                  <tr
                    key={key}
                    className={`
                      ${hover ? 'hover:bg-gray-50' : ''}
                      ${striped && index % 2 === 1 ? 'bg-gray-50' : ''}
                      ${isSelected ? 'bg-villa-mitre-50' : ''}
                    `}
                  >
                    {/* Celda de selección */}
                    {selectable && (
                      <td className="relative px-6 py-4">
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-villa-mitre-600 focus:ring-villa-mitre-500"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(record, index, e.target.checked)}
                        />
                      </td>
                    )}

                    {/* Celdas de datos */}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
                          column.className || ''
                        }`}
                      >
                        {renderCell(column, record, index)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {pagination && (
        <Pagination
          currentPage={pagination.current}
          totalPages={Math.ceil(pagination.total / pagination.pageSize)}
          totalItems={pagination.total}
          itemsPerPage={pagination.pageSize}
          onPageChange={(page) => onPaginationChange?.(page, pagination.pageSize)}
          onItemsPerPageChange={
            pagination.showSizeChanger
              ? (pageSize) => onPaginationChange?.(1, pageSize)
              : undefined
          }
          showItemsPerPage={pagination.showSizeChanger}
          itemsPerPageOptions={pagination.pageSizeOptions}
          className="mt-4"
        />
      )}
    </div>
  );
};

export default DataTable;
