import React from 'react';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

const TableSkeleton = ({
  rows = 5,
  columns = 4,
  showHeader = true,
  className = '',
}: TableSkeletonProps) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          {/* Header skeleton */}
          {showHeader && (
            <thead className="bg-gray-50">
              <tr>
                {Array.from({ length: columns }).map((_, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide"
                  >
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </th>
                ))}
              </tr>
            </thead>
          )}

          {/* Body skeleton */}
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      {/* Diferentes tipos de skeleton según la columna */}
                      {colIndex === 0 ? (
                        // Primera columna: avatar + texto (para usuarios/ejercicios)
                        <>
                          <div className="h-10 w-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </>
                      ) : colIndex === columns - 1 ? (
                        // Última columna: botones de acción
                        <div className="flex space-x-2">
                          <div className="h-8 w-8 bg-gray-300 rounded"></div>
                          <div className="h-8 w-8 bg-gray-300 rounded"></div>
                          <div className="h-8 w-8 bg-gray-300 rounded"></div>
                        </div>
                      ) : (
                        // Columnas del medio: texto simple
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-full"></div>
                          {Math.random() > 0.5 && (
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6 mt-4">
        <div className="flex flex-1 justify-between sm:hidden">
          <div className="h-9 w-20 bg-gray-300 rounded"></div>
          <div className="h-9 w-20 bg-gray-300 rounded"></div>
        </div>

        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-4 bg-gray-300 rounded w-48"></div>
            <div className="flex items-center space-x-2">
              <div className="h-4 bg-gray-300 rounded w-12"></div>
              <div className="h-8 w-16 bg-gray-300 rounded"></div>
            </div>
          </div>

          <div className="flex space-x-1">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="h-10 w-10 bg-gray-300 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton específico para listas de tarjetas (para plantillas, etc.)
export const CardGridSkeleton = ({
  cards = 6,
  className = '',
}: {
  cards?: number;
  className?: string;
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cards }).map((_, index) => (
          <div
            key={index}
            className="bg-white overflow-hidden shadow rounded-lg border border-gray-200"
          >
            {/* Card header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                <div className="h-8 w-8 bg-gray-300 rounded"></div>
              </div>
            </div>

            {/* Card content */}
            <div className="px-6 py-4">
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>

              {/* Tags skeleton */}
              <div className="flex flex-wrap gap-2 mt-4">
                {Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, tagIndex) => (
                  <div
                    key={tagIndex}
                    className="h-6 bg-gray-200 rounded-full w-16"
                  ></div>
                ))}
              </div>
            </div>

            {/* Card footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="flex space-x-2">
                  <div className="h-8 w-16 bg-gray-300 rounded"></div>
                  <div className="h-8 w-16 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Skeleton para formularios
export const FormSkeleton = ({
  fields = 5,
  className = '',
}: {
  fields?: number;
  className?: string;
}) => {
  return (
    <div className={`animate-pulse space-y-6 ${className}`}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-24"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          {Math.random() > 0.7 && (
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          )}
        </div>
      ))}

      {/* Action buttons skeleton */}
      <div className="flex justify-end space-x-3 pt-6">
        <div className="h-10 w-20 bg-gray-300 rounded"></div>
        <div className="h-10 w-24 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default TableSkeleton;
