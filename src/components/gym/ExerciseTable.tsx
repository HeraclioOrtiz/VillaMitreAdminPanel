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
  console.log('🎯 ExerciseTable - Component is rendering');
  
  // Debug logs para ExerciseTable
  console.log('🎯 ExerciseTable - Received props:', {
    exercises,
    exercisesLength: exercises?.length,
    exercisesType: typeof exercises,
    isArray: Array.isArray(exercises),
    loading,
    pagination,
    firstExercise: exercises?.[0]
  });

  // Función para obtener el badge de dificultad
  const getDifficultyBadge = (difficulty: string) => {
    const badges: Record<string, string> = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800',
      'Principiante': 'bg-green-100 text-green-800',
      'Intermedio': 'bg-yellow-100 text-yellow-800',
      'Avanzado': 'bg-red-100 text-red-800',
    };

    const labels: Record<string, string> = {
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado',
      'Principiante': 'Principiante',
      'Intermedio': 'Intermedio',
      'Avanzado': 'Avanzado',
    };

    const badgeClass = badges[difficulty] || 'bg-gray-100 text-gray-800';
    const label = labels[difficulty] || difficulty;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
        {label}
      </span>
    );
  };

  // Función para obtener etiquetas de grupos musculares
  const getMuscleGroupLabel = (muscleGroup: string | null | undefined) => {
    // Verificar si muscleGroup es null, undefined o vacío
    if (!muscleGroup) {
      return 'No especificado';
    }
    
    const labels: Record<string, string> = {
      chest: 'Pecho',
      back: 'Espalda',
      shoulders: 'Hombros',
      biceps: 'Bíceps',
      triceps: 'Tríceps',
      legs: 'Piernas',
      glutes: 'Glúteos',
      core: 'Core',
      cardio: 'Cardio',
      'full-body': 'Cuerpo Completo',
      'Pecho': 'Pecho',
      'Espalda': 'Espalda',
      'Hombros': 'Hombros',
      'Bíceps': 'Bíceps',
      'Tríceps': 'Tríceps',
      'Piernas': 'Piernas',
      'Core': 'Core',
    };
    
    // Si contiene comas, dividir y procesar cada parte
    if (muscleGroup.includes(',')) {
      return muscleGroup.split(',').map(group => labels[group.trim()] || group.trim()).join(', ');
    }
    
    return labels[muscleGroup] || muscleGroup;
  };

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

  // Definir columnas de la tabla
  const columns: Column<Exercise>[] = [
    {
      key: 'name',
      title: 'Ejercicio',
      sortable: true,
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          {/* Imagen/Video thumbnail */}
          <div className="flex-shrink-0">
            {record.image_url || record.video_url ? (
              <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                {record.image_url ? (
                  <img
                    src={record.image_url}
                    alt={record.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <PlayIcon className="h-5 w-5 text-gray-400" />
                )}
              </div>
            ) : (
              <div className="h-10 w-10 rounded-lg bg-villa-mitre-100 flex items-center justify-center">
                <span className="text-villa-mitre-600 font-semibold text-sm">
                  {record.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Información del ejercicio */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {record.name}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {getMuscleGroupLabel(record.muscle_group)} • {getEquipmentLabel(record.equipment)}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'difficulty',
      title: 'Dificultad',
      sortable: true,
      render: (_, record) => getDifficultyBadge(record.difficulty),
    },
    {
      key: 'tags',
      title: 'Tags',
      render: (_, record) => {
        const tags = record.tags || [];
        return (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                +{tags.length - 3}
              </span>
            )}
            {tags.length === 0 && (
              <span className="text-xs text-gray-400">Sin tags</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'created_at',
      title: 'Creado',
      sortable: true,
      render: (_, record) => (
        <div className="text-sm text-gray-900">
          {new Date(record.created_at).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Acciones',
      width: '120px',
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView?.(record)}
            className="text-gray-400 hover:text-gray-600"
            title="Ver detalles"
          >
            <EyeIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(record)}
            className="text-gray-400 hover:text-villa-mitre-600"
            title="Editar"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDuplicate?.(record)}
            className="text-gray-400 hover:text-blue-600"
            title="Duplicar"
            disabled={loadingStates.duplicating?.includes(record.id)}
          >
            {loadingStates.duplicating?.includes(record.id) ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            ) : (
              <DocumentDuplicateIcon className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(record)}
            className="text-gray-400 hover:text-red-600"
            title="Eliminar"
            disabled={loadingStates.deleting?.includes(record.id)}
          >
            {loadingStates.deleting?.includes(record.id) ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
            ) : (
              <TrashIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  // Debug final antes de pasar a DataTable
  console.log('🎯 ExerciseTable - Passing to DataTable:', {
    columns: columns.length,
    data: exercises,
    dataLength: exercises?.length,
    loading,
    pagination,
    rowKey: 'id'
  });

  return (
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
      bordered={true}
    />
  );
};

export default ExerciseTable;
