import React from 'react';
import { DataTable } from '@/components/ui';
import type { Column } from '@/components/ui/DataTable';
import type { Exercise } from '@/types/exercise';
import { Button } from '@/components/ui';
import {
  EyeIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';

interface ExerciseTableProps {
  exercises: Exercise[];
  loading?: boolean;
  loadingStates?: {
    duplicating?: number[];
    deleting?: number[];
  };
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
  };
  onPaginationChange?: (page: number, pageSize: number) => void;
  onSort?: (sortConfig: { key: string; direction: 'asc' | 'desc' } | null) => void;
  onView?: (exercise: Exercise) => void;
  onEdit?: (exercise: Exercise) => void;
  onDuplicate?: (exercise: Exercise) => void;
  onDelete?: (exercise: Exercise) => void;
  selectedRowKeys?: React.Key[];
  onSelectionChange?: (selectedRowKeys: React.Key[], selectedRows: Exercise[]) => void;
}

const ExerciseTable = ({
  exercises,
  loading = false,
  loadingStates = {},
  pagination,
  onPaginationChange,
  onSort,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  selectedRowKeys = [],
  onSelectionChange,
}: ExerciseTableProps) => {

  // Función para obtener etiquetas de equipamiento
  const getEquipmentLabel = (equipment: string | null | undefined) => {
    // Verificar si equipment es null, undefined o vacío
    if (!equipment) {
      return 'Sin Equipamiento';
    }
    
    const labels: Record<string, string> = {
      barbell: 'Barra',
      dumbbell: 'Mancuernas',
      kettlebell: 'Kettlebell',
      cable: 'Polea',
      machine: 'Máquina',
      bodyweight: 'Peso Corporal',
      'resistance-band': 'Banda Elástica',
      'medicine-ball': 'Pelota Medicinal',
      suspension: 'Suspensión (TRX)',
      other: 'Otro',
      'Barra': 'Barra',
      'Mancuernas': 'Mancuernas',
      'Polea': 'Polea',
      'Peso corporal': 'Peso Corporal',
      'Ninguno': 'Sin Equipamiento',
    };
    
    // Si contiene comas, dividir y procesar cada parte
    if (equipment.includes(',')) {
      return equipment.split(',').map(eq => labels[eq.trim()] || eq.trim()).join(', ');
    }
    
    return labels[equipment] || equipment;
  };

  // Definir columnas de la tabla con diseño compacto y responsivo
  const columns: Column<Exercise>[] = [
    {
      key: 'name',
      title: 'EJERCICIO',
      sortable: true,
      render: (_, record) => (
        <div className="flex items-center gap-3 py-2 min-w-0">
          {/* Avatar compacto */}
          <div className="flex-shrink-0">
            {record.image_url || record.video_url ? (
              <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                {record.image_url ? (
                  <img
                    src={record.image_url}
                    alt={record.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 h-full w-full flex items-center justify-center">
                    <PlayIcon className="h-5 w-5 text-blue-600" />
                  </div>
                )}
              </div>
            ) : (
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-villa-mitre-50 to-villa-mitre-100 flex items-center justify-center border border-villa-mitre-200">
                <span className="text-villa-mitre-700 font-bold text-lg">
                  {record.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Información compacta */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {record.name}
            </h3>
            {/* Grupos musculares compactos - solo 2 */}
            <div className="flex flex-wrap gap-1 mt-1">
              {(record.target_muscle_groups || []).slice(0, 2).map((muscle, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700"
                >
                  {muscle}
                </span>
              ))}
              {(record.target_muscle_groups || []).length > 2 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-600">
                  +{(record.target_muscle_groups || []).length - 2}
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'equipment',
      title: 'EQUIPO',
      className: 'hidden md:table-cell',
      render: (_, record) => {
        const equipment = record.equipment || [];
        const equipmentArray = Array.isArray(equipment) ? equipment : [equipment];
        return (
          <div className="py-2">
            {equipmentArray.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {equipmentArray.slice(0, 2).map((eq, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200"
                  >
                    {getEquipmentLabel(eq)}
                  </span>
                ))}
                {equipmentArray.length > 2 && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-50 text-gray-600">
                    +{equipmentArray.length - 2}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs text-gray-400 italic">-</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'exercise_type',
      title: 'TIPO',
      render: (_, record) => {
        const typeConfig: Record<string, { label: string; icon: string; color: string }> = {
          strength: { label: 'Fuerza', icon: '💪', color: 'bg-orange-50 text-orange-700 border-orange-200' },
          cardio: { label: 'Cardio', icon: '🏃', color: 'bg-green-50 text-green-700 border-green-200' },
          flexibility: { label: 'Flex', icon: '🤸', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
          balance: { label: 'Balance', icon: '⚖️', color: 'bg-pink-50 text-pink-700 border-pink-200' },
        };
        const type = record.exercise_type || 'strength';
        const config = typeConfig[type] || typeConfig.strength;
        
        return (
          <div className="py-2">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${config.color}`}>
              <span>{config.icon}</span>
              <span className="hidden sm:inline">{config.label}</span>
            </span>
          </div>
        );
      },
    },
    {
      key: 'difficulty_level',
      title: 'NIVEL',
      sortable: true,
      render: (_, record) => {
        const difficulty = record.difficulty_level || record.difficulty;
        const difficultyConfig = {
          beginner: { 
            label: 'Principiante',
            short: 'Princ',
            bg: 'bg-green-50',
            text: 'text-green-700',
            border: 'border-green-200',
            icon: '🌱'
          },
          intermediate: { 
            label: 'Intermedio',
            short: 'Inter',
            bg: 'bg-yellow-50',
            text: 'text-yellow-700',
            border: 'border-yellow-200',
            icon: '⚡'
          },
          advanced: { 
            label: 'Avanzado',
            short: 'Avanz',
            bg: 'bg-red-50',
            text: 'text-red-700',
            border: 'border-red-200',
            icon: '🔥'
          },
        };
        const config = difficultyConfig[difficulty as keyof typeof difficultyConfig] || difficultyConfig.beginner;
        
        return (
          <div className="py-2">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
              <span>{config.icon}</span>
              <span className="hidden lg:inline">{config.label}</span>
              <span className="lg:hidden">{config.short}</span>
            </span>
          </div>
        );
      },
    },
    {
      key: 'actions',
      title: 'ACCIONES',
      render: (_, record) => (
        <div className="flex items-center justify-end gap-1 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView?.(record)}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Ver"
          >
            <EyeIcon className="h-4 w-4 text-gray-600" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(record)}
            className="p-1.5 hover:bg-villa-mitre-50 rounded transition-colors"
            title="Editar"
          >
            <PencilIcon className="h-4 w-4 text-villa-mitre-600" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDuplicate?.(record)}
            className="p-1.5 hover:bg-blue-50 rounded transition-colors"
            title="Duplicar"
            disabled={loadingStates.duplicating?.includes(record.id)}
          >
            {loadingStates.duplicating?.includes(record.id) ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
            ) : (
              <DocumentDuplicateIcon className="h-4 w-4 text-blue-600" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(record)}
            className="p-1.5 hover:bg-red-50 rounded transition-colors"
            title="Eliminar"
            disabled={loadingStates.deleting?.includes(record.id)}
          >
            {loadingStates.deleting?.includes(record.id) ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
            ) : (
              <TrashIcon className="h-4 w-4 text-red-600" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={exercises}
          loading={loading}
          pagination={pagination ? {
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
          } : undefined}
          onPaginationChange={onPaginationChange}
          onSort={onSort}
          selectable={true}
          selectedRowKeys={selectedRowKeys}
          onSelectionChange={onSelectionChange}
          rowKey="id"
          emptyText="No se encontraron ejercicios"
          hover={true}
          bordered={false}
        />
      </div>
    </div>
  );
};

export default ExerciseTable;
