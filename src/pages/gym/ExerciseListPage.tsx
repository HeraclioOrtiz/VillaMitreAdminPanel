import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button, 
  useToast, 
  ListPageSkeleton, 
  ExercisesEmptyState, 
  ApiErrorDisplay,
  // import { TableErrorBoundary } from '@/components/ui/ErrorBoundary'; // Temporalmente removido para debug
} from '@/components/ui';
import ExerciseTable from '@/components/gym/ExerciseTable';
import ExerciseFilters from '@/components/gym/ExerciseFilters';
import ExercisePreviewModal from '@/components/gym/ExercisePreviewModal';
import { useExercises, useBulkDeleteExercises, useDuplicateExercise, useDeleteExercise, useExportExercises } from '@/hooks/useExercises';
import type { ExerciseFilters as ExerciseFiltersType, Exercise, ExerciseListResponse } from '@/types/exercise';
import {
  PlusIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

const ExerciseListPage = () => {
  console.log('🚀 ExerciseListPage - Component is rendering');
  
  const navigate = useNavigate();
  const toast = useToast();
  
  // Estados locales
  const [filters, setFilters] = useState<ExerciseFiltersType>({
    search: '',
    muscle_group: [],
    equipment: [],
    difficulty: [],
    tags: [],
  });
  
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 20,
  });
  
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    duplicating: [] as number[],
    deleting: [] as number[],
  });

  // Preparar parámetros para la query
  const queryParams = useMemo(() => {
    const params = {
      ...pagination,
      ...filters,
      sort_by: sortConfig?.key as 'name' | 'created_at' | 'popularity' | undefined,
      sort_direction: sortConfig?.direction,
    };
    console.log('ExerciseListPage - queryParams calculated:', params);
    return params;
  }, [pagination, filters, sortConfig]);

  // Hooks de React Query
  const queryResult = useExercises(queryParams);
  const { data: exercisesData, isLoading, error, isFetching, status, fetchStatus } = queryResult;
  
  // Debug logging completo
  console.log('🚨 QUERY DEBUG - queryParams:', queryParams);
  console.log('🚨 QUERY DEBUG - queryResult:', queryResult);
  console.log('🚨 QUERY DEBUG - exercisesData:', exercisesData);
  console.log('🚨 QUERY DEBUG - isLoading:', isLoading);
  console.log('🚨 QUERY DEBUG - isFetching:', isFetching);
  console.log('🚨 QUERY DEBUG - status:', status);
  console.log('🚨 QUERY DEBUG - fetchStatus:', fetchStatus);
  console.log('🚨 QUERY DEBUG - error:', error);
  
  // Verificar si React Query está configurado
  console.log('🚨 REACT QUERY DEBUG - QueryClient exists:', !!queryResult);
  
  // Debug de API
  console.log('🚨 API DEBUG - VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
  console.log('🚨 API DEBUG - auth_token exists:', !!localStorage.getItem('auth_token'));
  
  // TODOS LOS HOOKS DEBEN IR ANTES DE CUALQUIER RETURN
  const bulkDeleteMutation = useBulkDeleteExercises({
    onSuccess: (deletedIds) => {
      toast.success(
        'Ejercicios eliminados',
        `Se eliminaron ${deletedIds.length} ejercicio(s) correctamente`
      );
      setSelectedRowKeys([]);
      
      // Verificar si necesitamos ajustar la paginación después de eliminación masiva
      if (exercisesData && pagination.page > 1) {
        const currentPageItems = exercisesData.data.length;
        const deletedCount = deletedIds.length;
        
        // Si eliminamos todos los elementos de la página actual, volver a la anterior
        if (currentPageItems <= deletedCount) {
          setPagination(prev => ({
            ...prev,
            page: prev.page - 1
          }));
        }
      }
    },
    onError: (error) => {
      console.error('Bulk delete error:', error);
      
      // Extraer mensaje de error de diferentes fuentes posibles
      let errorMessage = '';
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      console.log('Extracted bulk delete error message:', errorMessage);
      
      // Verificar si es un error de foreign key constraint
      const isForeignKeyError = errorMessage.includes('foreign key constraint') || 
                               errorMessage.includes('Integrity constraint violation') ||
                               errorMessage.includes('gym_daily_template_exercises') ||
                               errorMessage.includes('1451');
      
      if (isForeignKeyError) {
        toast.error(
          'No se pueden eliminar algunos ejercicios',
          'Algunos ejercicios están siendo usados en plantillas de entrenamiento. Elimina primero las plantillas que los usan.'
        );
      } else {
        toast.error(
          'Error al eliminar ejercicios',
          errorMessage || 'No se pudieron eliminar los ejercicios seleccionados. Intenta nuevamente.'
        );
      }
    },
  });

  const duplicateMutation = useDuplicateExercise({
    onSuccess: (exercise) => {
      toast.success(
        'Ejercicio duplicado',
        `Se creó una copia de "${exercise.name}"`
      );
    },
    onError: (error) => {
      toast.error(
        'Error al duplicar ejercicio',
        'No se pudo crear la copia del ejercicio'
      );
    },
  });

  const deleteMutation = useDeleteExercise({
    onSuccess: (deletedId) => {
      toast.success(
        'Ejercicio eliminado',
        'El ejercicio se eliminó correctamente'
      );
      
      // Verificar si necesitamos ajustar la paginación
      // Si estamos en una página > 1 y solo había 1 elemento, volver a la página anterior
      if (exercisesData && pagination.page > 1) {
        const currentPageItems = exercisesData.data.length;
        if (currentPageItems === 1) {
          setPagination(prev => ({
            ...prev,
            page: prev.page - 1
          }));
        }
      }
    },
    onError: (error) => {
      console.error('Delete error:', error);
      
      // Extraer mensaje de error de diferentes fuentes posibles
      let errorMessage = '';
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      console.log('Extracted error message:', errorMessage);
      console.log('Error status:', error?.response?.status);
      
      // Verificar si es un error 404 (ejercicio ya no existe)
      if (error?.response?.status === 404) {
        toast.warning(
          'Ejercicio ya eliminado',
          'El ejercicio ya no existe en el servidor.'
        );
        return;
      }
      
      // Verificar si es un error de foreign key constraint
      const isForeignKeyError = errorMessage.includes('foreign key constraint') || 
                               errorMessage.includes('Integrity constraint violation') ||
                               errorMessage.includes('gym_daily_template_exercises') ||
                               errorMessage.includes('1451');
      
      if (isForeignKeyError) {
        toast.error(
          'No se puede eliminar el ejercicio',
          'Este ejercicio está siendo usado en plantillas de entrenamiento. Elimina primero las plantillas que lo usan.'
        );
      } else {
        toast.error(
          'Error al eliminar ejercicio',
          errorMessage || 'No se pudo eliminar el ejercicio. Intenta nuevamente.'
        );
      }
    },
  });

  const exportMutation = useExportExercises();

  // Handlers
  const handleFiltersChange = (newFilters: ExerciseFiltersType) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset a página 1 al filtrar
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({ page, per_page: pageSize });
  };

  const handleSort = (newSortConfig: { key: string; direction: 'asc' | 'desc' } | null) => {
    setSortConfig(newSortConfig);
  };

  const handleSelectionChange = (selectedKeys: React.Key[], selectedRows: Exercise[]) => {
    setSelectedRowKeys(selectedKeys);
  };

  // Acciones de ejercicios
  const handleView = (exercise: Exercise) => {
    setPreviewExercise(exercise);
    setShowPreviewModal(true);
  };

  const handleClosePreview = () => {
    setShowPreviewModal(false);
    setPreviewExercise(null);
  };

  const handleEdit = (exercise: Exercise) => {
    navigate(`/gym/exercises/${exercise.id}/edit`);
  };

  const handleDuplicate = async (exercise: Exercise) => {
    // Agregar al estado de carga
    setLoadingStates(prev => ({
      ...prev,
      duplicating: [...prev.duplicating, exercise.id]
    }));

    try {
      await duplicateMutation.mutateAsync(exercise.id);
    } catch (error) {
      // El error ya se maneja en el callback del hook
    } finally {
      // Remover del estado de carga
      setLoadingStates(prev => ({
        ...prev,
        duplicating: prev.duplicating.filter(id => id !== exercise.id)
      }));
    }
  };

  const handleDelete = async (exercise: Exercise) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${exercise.name}"?`)) {
      // Agregar al estado de carga
      setLoadingStates(prev => ({
        ...prev,
        deleting: [...prev.deleting, exercise.id]
      }));

      try {
        await deleteMutation.mutateAsync(exercise.id);
      } catch (error) {
        // El error ya se maneja en el callback del hook
      } finally {
        // Remover del estado de carga
        setLoadingStates(prev => ({
          ...prev,
          deleting: prev.deleting.filter(id => id !== exercise.id)
        }));
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) return;
    
    if (window.confirm(`¿Estás seguro de que quieres eliminar ${selectedRowKeys.length} ejercicio(s)?`)) {
      try {
        await bulkDeleteMutation.mutateAsync(selectedRowKeys as number[]);
      } catch (error) {
        // El error ya se maneja en el callback del hook
      }
    }
  };

  const handleExport = async () => {
    try {
      await exportMutation.mutateAsync(queryParams);
      toast.success(
        'Exportación completada',
        'Los ejercicios se han exportado correctamente'
      );
    } catch (error) {
      toast.error(
        'Error al exportar',
        'No se pudieron exportar los ejercicios'
      );
    }
  };

  const handleCreateNew = () => {
    navigate('/gym/exercises/create');
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = 
    filters.search ||
    (filters.muscle_group && filters.muscle_group.length > 0) ||
    (filters.equipment && filters.equipment.length > 0) ||
    (filters.difficulty && filters.difficulty.length > 0) ||
    (filters.tags && filters.tags.length > 0);

  // Función para limpiar filtros
  const handleClearFilters = () => {
    setFilters({
      search: '',
      muscle_group: [],
      equipment: [],
      difficulty: [],
      tags: [],
    });
  };

  // TEMPORAL: Debug simple
  console.log('🚨 FINAL DEBUG - exercisesData:', exercisesData);
  console.log('🚨 FINAL DEBUG - has data:', exercisesData && exercisesData.data && exercisesData.data.length > 0);

  // Loading state
  if (isLoading) {
    return <ListPageSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Ejercicios
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Gestiona la biblioteca de ejercicios disponibles para crear plantillas y rutinas.
            </p>
          </div>
        </div>
        
        <ApiErrorDisplay 
          error={error} 
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  // Extraer datos de forma segura
  // Debug para verificar la estructura real
  console.log('🔍 Data structure check:', {
    exercisesData: exercisesData,
    isArray: Array.isArray(exercisesData),
    hasDataProperty: exercisesData && 'data' in exercisesData,
    directLength: Array.isArray(exercisesData) ? exercisesData.length : 'not array',
    dataPropertyLength: exercisesData?.data?.length || 'no data property'
  });
  
  // Extraer ejercicios según la estructura real
  const exercises = Array.isArray(exercisesData) ? exercisesData : (exercisesData?.data || []);
  const hasExercises = exercises.length > 0;
  
  // Debug logs simplificados
  console.log('📊 ExerciseListPage - Data loaded:', {
    hasData: !!exercisesData,
    exerciseCount: exercises.length,
    isLoading,
    error: !!error,
    exercises: exercises.slice(0, 2), // Solo primeros 2 para debug
    pagination: exercisesData && !Array.isArray(exercisesData) ? {
      current: exercisesData.current_page || 1,
      pageSize: exercisesData.per_page || 20,
      total: exercisesData.total || 0,
    } : undefined
  });

  // Debug específico para renderizado de tabla
  console.log('🎯 ExerciseTable - Props que se van a pasar:', {
    exercisesLength: exercises.length,
    loading: isLoading,
    hasExercises: exercises.length > 0,
    shouldRenderTable: !isLoading && !error && exercises.length > 0
  });
  
  // Mostrar empty state solo si no hay loading, no hay error y no hay ejercicios
  if (!isLoading && !error && !hasExercises) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Ejercicios
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Gestiona la biblioteca de ejercicios disponibles para crear plantillas y rutinas.
            </p>
          </div>
          
          <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<FunnelIcon className="w-4 h-4" />}
              className={hasActiveFilters ? 'ring-2 ring-villa-mitre-500' : ''}
            >
              Filtros
              {hasActiveFilters && (
                <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-villa-mitre-100 text-villa-mitre-800">
                  {Object.values(filters).flat().filter(Boolean).length}
                </span>
              )}
            </Button>
            
            <Button
              variant="primary"
              onClick={handleCreateNew}
              leftIcon={<PlusIcon className="w-4 h-4" />}
            >
              Nuevo Ejercicio
            </Button>
          </div>
        </div>

        {/* Filtros */}
        {showFilters && (
          <ExerciseFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            collapsible={false}
          />
        )}
        
        <ExercisesEmptyState 
          onCreateExercise={handleCreateNew}
          hasFilters={Boolean(hasActiveFilters)}
          onClearFilters={hasActiveFilters ? handleClearFilters : undefined}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Ejercicios
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona la biblioteca de ejercicios disponibles para crear plantillas y rutinas.
          </p>
        </div>
        
        <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            leftIcon={<FunnelIcon className="w-4 h-4" />}
            className={hasActiveFilters ? 'ring-2 ring-villa-mitre-500' : ''}
          >
            Filtros
            {hasActiveFilters && (
              <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-villa-mitre-100 text-villa-mitre-800">
                {Object.values(filters).flat().filter(Boolean).length}
              </span>
            )}
          </Button>
          
          <Button
            variant="secondary"
            onClick={handleExport}
            leftIcon={<ArrowDownTrayIcon className="w-4 h-4" />}
            disabled={exportMutation.isPending}
            isLoading={exportMutation.isPending}
          >
            {exportMutation.isPending ? 'Exportando...' : 'Exportar'}
          </Button>
          
          <Button
            variant="primary"
            onClick={handleCreateNew}
            leftIcon={<PlusIcon className="w-4 h-4" />}
          >
            Nuevo Ejercicio
          </Button>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <ExerciseFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          collapsible={false}
        />
      )}

      {/* Acciones masivas */}
      {selectedRowKeys.length > 0 && (
        <div className="bg-villa-mitre-50 border border-villa-mitre-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-villa-mitre-900">
                {selectedRowKeys.length} ejercicio(s) seleccionado(s)
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="danger"
                size="sm"
                onClick={handleBulkDelete}
                leftIcon={<TrashIcon className="w-4 h-4" />}
                disabled={bulkDeleteMutation.isPending}
              >
                {bulkDeleteMutation.isPending ? 'Eliminando...' : 'Eliminar Seleccionados'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de ejercicios */}
      <div className="bg-white shadow rounded-lg">
        <ExerciseTable
          exercises={exercises}
          loading={isLoading}
          loadingStates={loadingStates}
          pagination={exercisesData && !Array.isArray(exercisesData) ? {
            current: exercisesData.current_page || 1,
            pageSize: exercisesData.per_page || 20,
            total: exercisesData.total || 0,
          } : undefined}
          onPaginationChange={handlePaginationChange}
          onSort={handleSort}
          onView={handleView}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          selectedRowKeys={selectedRowKeys}
          onSelectionChange={handleSelectionChange}
        />
      </div>

      {/* Modal de vista previa */}
      <ExercisePreviewModal
        isOpen={showPreviewModal}
        onClose={handleClosePreview}
        exercise={previewExercise}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ExerciseListPage;
