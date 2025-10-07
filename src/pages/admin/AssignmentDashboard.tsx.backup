/**
 * Dashboard de Asignaciones para Administradores
 * Muestra estadísticas generales y acceso rápido a funcionalidades
 */

import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  AcademicCapIcon,
  LinkIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  TableCellsIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useAdminStats } from '@/hooks/useAssignments';
import { MetricCard, Button, Skeleton } from '@/components/ui';

/**
 * Componente de estadísticas del dashboard
 */
const StatsSection = memo(function StatsSection() {
  const { data: stats, isLoading, error } = useAdminStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Skeleton className="h-8 w-8 rounded" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error al cargar estadísticas
            </h3>
            <p className="mt-1 text-sm text-red-700">
              No se pudieron cargar las estadísticas del sistema. Intenta recargar la página.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Profesores Activos"
        value={stats?.total_professors || 0}
        icon={<UserGroupIcon className="w-6 h-6" />}
        subtitle="Total de profesores en el sistema"
      />
      
      <MetricCard
        title="Estudiantes"
        value={stats?.total_students || 0}
        icon={<AcademicCapIcon className="w-6 h-6" />}
        subtitle="Total de estudiantes registrados"
      />
      
      <MetricCard
        title="Asignaciones Activas"
        value={stats?.active_assignments || 0}
        icon={<LinkIcon className="w-6 h-6" />}
        subtitle="Asignaciones profesor-estudiante activas"
      />
      
      <MetricCard
        title="Sin Asignar"
        value={stats?.unassigned_students || 0}
        icon={<ExclamationTriangleIcon className="w-6 h-6" />}
        subtitle="Estudiantes sin profesor asignado"
        change={stats?.unassigned_students && stats.unassigned_students > 0 ? stats.unassigned_students : undefined}
        changeType={stats?.unassigned_students && stats.unassigned_students > 0 ? 'increase' : 'neutral'}
      />
    </div>
  );
});

/**
 * Componente de acciones rápidas
 */
const QuickActions = memo(function QuickActions() {
  const quickActions = [
    {
      name: 'Nueva Asignación',
      description: 'Asignar un estudiante a un profesor',
      href: '/admin/assignments/create',
      icon: PlusIcon,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      name: 'Gestionar Asignaciones',
      description: 'Ver y administrar todas las asignaciones',
      href: '/admin/assignments',
      icon: TableCellsIcon,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      name: 'Reportes',
      description: 'Ver reportes y estadísticas detalladas',
      href: '/admin/assignments/reports',
      icon: ChartBarIcon,
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      name: 'Configuración',
      description: 'Configurar parámetros del sistema',
      href: '/admin/assignments/settings',
      icon: Cog6ToothIcon,
      color: 'bg-gray-500 hover:bg-gray-600',
    },
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Acciones Rápidas</h3>
        <p className="mt-1 text-sm text-gray-500">
          Accede rápidamente a las funciones más utilizadas
        </p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="group relative bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
            >
              <div>
                <span className={`inline-flex p-3 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {action.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {action.description}
                </p>
              </div>
              <span
                className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400 transition-colors"
                aria-hidden="true"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
});

/**
 * Componente de información del sistema
 */
const SystemInfo = memo(function SystemInfo() {
  const { data: stats } = useAdminStats();

  const assignmentRate = stats?.assignment_rate || 0;
  const getAssignmentRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAssignmentRateLabel = (rate: number) => {
    if (rate >= 80) return 'Excelente';
    if (rate >= 60) return 'Buena';
    return 'Necesita atención';
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Estado del Sistema</h3>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">
              Tasa de Asignación
            </span>
            <div className="text-right">
              <span className={`text-lg font-semibold ${getAssignmentRateColor(assignmentRate)}`}>
                {assignmentRate.toFixed(1)}%
              </span>
              <p className={`text-xs ${getAssignmentRateColor(assignmentRate)}`}>
                {getAssignmentRateLabel(assignmentRate)}
              </p>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                assignmentRate >= 80 
                  ? 'bg-green-500' 
                  : assignmentRate >= 60 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(assignmentRate, 100)}%` }}
            />
          </div>
          
          {stats?.unassigned_students && stats.unassigned_students > 0 && (
            <div className="mt-4 p-4 bg-orange-50 rounded-md">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-orange-400" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-orange-800">
                    Estudiantes sin asignar
                  </h4>
                  <p className="mt-1 text-sm text-orange-700">
                    Hay {stats.unassigned_students} estudiantes que necesitan ser asignados a un profesor.
                  </p>
                  <div className="mt-3">
                    <Link to="/admin/assignments/unassigned">
                      <Button size="sm" variant="secondary">
                        Ver estudiantes sin asignar
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

/**
 * Componente principal del dashboard de asignaciones
 */
export const AssignmentDashboard: React.FC = memo(function AssignmentDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Dashboard de Asignaciones
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona las asignaciones entre profesores y estudiantes
          </p>
        </div>
        
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link to="/admin/assignments/create">
            <Button leftIcon={<PlusIcon className="w-4 h-4" />}>
              Nueva Asignación
            </Button>
          </Link>
        </div>
      </div>

      {/* Estadísticas principales */}
      <StatsSection />

      {/* Grid de contenido */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Acciones rápidas - ocupa 2 columnas */}
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
        
        {/* Información del sistema - ocupa 1 columna */}
        <div className="lg:col-span-1">
          <SystemInfo />
        </div>
      </div>
    </div>
  );
});

export default AssignmentDashboard;
