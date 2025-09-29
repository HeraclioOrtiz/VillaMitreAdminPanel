/**
 * Página de gestión de asignaciones para administradores
 * Lista completa con filtros, paginación y acciones CRUD
 */

import React, { memo, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  FunnelIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import type { 
  AssignmentFilters, 
  ProfessorStudentAssignment,
  AssignmentQueryParams 
} from '@/types/assignment';
import { 
  useAssignments, 
  useDeleteAssignment,
  useAvailableProfessors 
} from '@/hooks/useAssignments';
import { useUsers } from '@/hooks/useUsers';
import { useToast } from '@/hooks/useToast';
import { AssignmentTable } from '@/components/admin/AssignmentTable';
import { AssignmentFilters } from '@/components/admin/AssignmentFilters';
import { Button, Pagination, EmptyState, Skeleton } from '@/components/ui';

/**
 * Componente de skeleton para la página
 */
const PageSkeleton = memo(function PageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="mt-4 md:mt-0">
          <Skeleton className="h-10 w-40" />
        </div>
      </div>

      {/* Filters skeleton */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-10" />
          ))}
        </div>
      </div>

      {/* Table skeleton */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-24" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

/**
 * Componente principal de gestión de asignaciones
 */
export const AssignmentManagement: React.FC = memo(function AssignmentManagement() {
  // Estados locales
  const [filters, setFilters] = useState<AssignmentFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAssignment, setSelectedAssignment] = useState<ProfessorStudentAssignment | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<number, Record<string, boolean>>>({});

  const toast = useToast();

  // Parámetros de query memoizados
  const queryParams = useMemo<AssignmentQueryParams>(() => ({
    ...filters,
    page: currentPage,
    per_page: 20,
    sort_by: 'created_at',
    sort_direction: 'desc',
  }), [filters, currentPage]);

  // Queries
  const { 
    data: assignmentsResponse, 
    isLoading: isLoadingAssignments,
    error: assignmentsError,
    refetch: refetchAssignments 
  } = useAssignments(queryParams);

  const { data: availableProfessors } = useAvailableProfessors();
  
  const { data: usersResponse } = useUsers({
    per_page: 100,
    role: ['member'], // Solo estudiantes para los filtros
  });

  // Mutaciones
  const deleteAssignmentMutation = useDeleteAssignment({
    onSuccess: () => {
      toast.success('Asignación eliminada exitosamente');
      setSelectedAssignment(null);
    },
    onError: (error) => {
      console.error('Error deleting assignment:', error);
      toast.error('Error al eliminar la asignación');
    },
  });

  // Handlers
  const handleFiltersChange = useCallback((newFilters: AssignmentFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset página al cambiar filtros
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const setAssignmentLoading = useCallback((assignmentId: number, action: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [assignmentId]: {
        ...prev[assignmentId],
        [action]: loading,
      },
    }));
  }, []);

  const handleView = useCallback((assignment: ProfessorStudentAssignment) => {
    setSelectedAssignment(assignment);
    // TODO: Abrir modal de vista detallada
    console.log('View assignment:', assignment);
  }, []);

  const handleEdit = useCallback((assignment: ProfessorStudentAssignment) => {
    // TODO: Navegar a página de edición o abrir modal
    console.log('Edit assignment:', assignment);
  }, []);

  const handleDelete = useCallback(async (assignment: ProfessorStudentAssignment) => {
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar la asignación entre ${assignment.professor.first_name} ${assignment.professor.last_name} y ${assignment.student.first_name} ${assignment.student.last_name}?`
    );
    
    if (!confirmed) return;

    setAssignmentLoading(assignment.id, 'delete', true);
    
    try {
      await deleteAssignmentMutation.mutateAsync(assignment.id);
    } finally {
      setAssignmentLoading(assignment.id, 'delete', false);
    }
  }, [deleteAssignmentMutation, setAssignmentLoading]);

  const handleRefresh = useCallback(() => {
    refetchAssignments();
  }, [refetchAssignments]);

  // Estados de carga y error
  if (isLoadingAssignments && !assignmentsResponse) {
    return <PageSkeleton />;
  }

  const assignments = assignmentsResponse?.data || [];
  const totalPages = assignmentsResponse?.last_page || 1;
  const totalItems = assignmentsResponse?.total || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Gestión de Asignaciones
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Administra las asignaciones entre profesores y estudiantes
          </p>
        </div>
        
        <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          <Button
            variant="secondary"
            onClick={handleRefresh}
            disabled={isLoadingAssignments}
            leftIcon={<ArrowPathIcon className="w-4 h-4" />}
          >
            Actualizar
          </Button>
          
          <Link to="/admin/assignments/create">
            <Button leftIcon={<PlusIcon className="w-4 h-4" />}>
              Nueva Asignación
            </Button>
          </Link>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      {totalItems > 0 && (
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  {totalItems} asignaciones encontradas
                </span>
              </div>
              {Object.keys(filters).length > 0 && (
                <span className="text-sm text-gray-500">
                  (con filtros aplicados)
                </span>
              )}
            </div>
            
            <div className="text-sm text-gray-500">
              Página {currentPage} de {totalPages}
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <AssignmentFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
        availableProfessors={availableProfessors || []}
        availableStudents={usersResponse?.data || []}
        collapsible
        showChips
      />

      {/* Error state */}
      {assignmentsError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error al cargar asignaciones
              </h3>
              <p className="mt-1 text-sm text-red-700">
                {assignmentsError.message || 'Ha ocurrido un error inesperado'}
              </p>
              <div className="mt-3">
                <Button size="sm" variant="secondary" onClick={handleRefresh}>
                  Reintentar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de asignaciones */}
      {assignments.length > 0 ? (
        <>
          <AssignmentTable
            assignments={assignments}
            isLoading={isLoadingAssignments}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loadingStates={loadingStates}
          />

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                showPageNumbers
                showFirstLast
              />
            </div>
          )}
        </>
      ) : !isLoadingAssignments ? (
        <EmptyState
          title="No hay asignaciones"
          description={
            Object.keys(filters).length > 0
              ? "No se encontraron asignaciones con los filtros aplicados. Intenta ajustar los criterios de búsqueda."
              : "Aún no hay asignaciones creadas en el sistema. Crea la primera asignación para comenzar."
          }
          action={{
            label: "Nueva Asignación",
            href: "/admin/assignments/create"
          }}
        />
      ) : null}
    </div>
  );
});

export default AssignmentManagement;
