import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'rectangular' | 'circular' | 'text';
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Componente Skeleton para estados de carga
 * Proporciona diferentes variantes y animaciones
 */
export const Skeleton = ({ 
  className = '',
  width,
  height,
  variant = 'rectangular',
  animation = 'pulse'
}: SkeletonProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'text':
        return 'rounded h-4';
      case 'rectangular':
      default:
        return 'rounded-md';
    }
  };

  const getAnimationClasses = () => {
    switch (animation) {
      case 'wave':
        return 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[wave_1.5s_ease-in-out_infinite]';
      case 'pulse':
        return 'animate-pulse bg-gray-200';
      case 'none':
        return 'bg-gray-200';
      default:
        return 'animate-pulse bg-gray-200';
    }
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div 
      className={`${getVariantClasses()} ${getAnimationClasses()} ${className}`}
      style={style}
      role="status"
      aria-label="Cargando..."
    />
  );
};

/**
 * Skeleton para tarjetas de ejercicios
 */
export const ExerciseCardSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton height={24} width="70%" />
        <Skeleton height={16} width="50%" />
      </div>
      <Skeleton variant="circular" width={40} height={40} />
    </div>
    
    <div className="space-y-2">
      <Skeleton height={16} width="100%" />
      <Skeleton height={16} width="80%" />
    </div>
    
    <div className="flex gap-2">
      <Skeleton height={24} width={80} />
      <Skeleton height={24} width={60} />
      <Skeleton height={24} width={90} />
    </div>
    
    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
      <Skeleton height={20} width={100} />
      <div className="flex gap-2">
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="circular" width={32} height={32} />
      </div>
    </div>
  </div>
);

/**
 * Skeleton para tarjetas de plantillas
 */
export const TemplateCardSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton height={20} width="80%" />
        <Skeleton height={14} width="60%" />
      </div>
      <Skeleton variant="circular" width={8} height={8} />
    </div>
    
    <div className="space-y-2">
      <Skeleton height={14} width="100%" />
      <Skeleton height={14} width="90%" />
    </div>
    
    <div className="flex items-center gap-4 text-sm text-gray-500">
      <div className="flex items-center gap-1">
        <Skeleton variant="circular" width={16} height={16} />
        <Skeleton height={14} width={40} />
      </div>
      <div className="flex items-center gap-1">
        <Skeleton variant="circular" width={16} height={16} />
        <Skeleton height={14} width={50} />
      </div>
      <div className="flex items-center gap-1">
        <Skeleton variant="circular" width={16} height={16} />
        <Skeleton height={14} width={45} />
      </div>
    </div>
    
    <div className="flex flex-wrap gap-1">
      <Skeleton height={20} width={60} />
      <Skeleton height={20} width={80} />
      <Skeleton height={20} width={70} />
    </div>
    
    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
      <div className="flex gap-2">
        <Skeleton height={24} width={70} />
        <Skeleton height={24} width={80} />
      </div>
      <Skeleton variant="circular" width={32} height={32} />
    </div>
  </div>
);

/**
 * Skeleton para filas de tabla
 */
export const TableRowSkeleton = ({ columns = 5 }: { columns?: number }) => (
  <tr className="border-b border-gray-200">
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <Skeleton height={16} width={index === 0 ? "80%" : "60%"} />
      </td>
    ))}
  </tr>
);

/**
 * Skeleton para tabla completa
 */
export const TableSkeleton = ({ 
  rows = 5, 
  columns = 5,
  showHeader = true 
}: { 
  rows?: number; 
  columns?: number;
  showHeader?: boolean;
}) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      {showHeader && (
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="px-6 py-3 text-left">
                <Skeleton height={16} width="70%" />
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody className="bg-white divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, index) => (
          <TableRowSkeleton key={index} columns={columns} />
        ))}
      </tbody>
    </table>
  </div>
);

/**
 * Skeleton para formularios
 */
export const FormSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton height={16} width={100} />
      <Skeleton height={40} width="100%" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Skeleton height={16} width={80} />
        <Skeleton height={40} width="100%" />
      </div>
      <div className="space-y-2">
        <Skeleton height={16} width={90} />
        <Skeleton height={40} width="100%" />
      </div>
    </div>
    
    <div className="space-y-2">
      <Skeleton height={16} width={120} />
      <Skeleton height={100} width="100%" />
    </div>
    
    <div className="flex gap-3">
      <Skeleton height={40} width={100} />
      <Skeleton height={40} width={80} />
    </div>
  </div>
);

/**
 * Skeleton para grid de tarjetas
 */
export const CardGridSkeleton = ({ 
  count = 6,
  CardComponent = ExerciseCardSkeleton 
}: { 
  count?: number;
  CardComponent?: React.ComponentType;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <CardComponent key={index} />
    ))}
  </div>
);

/**
 * Skeleton para lista con filtros
 */
export const ListPageSkeleton = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton height={32} width={200} />
        <Skeleton height={16} width={300} />
      </div>
      <Skeleton height={40} width={120} />
    </div>
    
    {/* Filters */}
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Skeleton height={40} width="100%" />
        <Skeleton height={40} width="100%" />
        <Skeleton height={40} width="100%" />
        <Skeleton height={40} width="100%" />
      </div>
    </div>
    
    {/* Content */}
    <CardGridSkeleton count={6} />
    
    {/* Pagination */}
    <div className="flex justify-between items-center">
      <Skeleton height={16} width={150} />
      <div className="flex gap-2">
        <Skeleton height={32} width={32} />
        <Skeleton height={32} width={32} />
        <Skeleton height={32} width={32} />
      </div>
    </div>
  </div>
);

export default Skeleton;
