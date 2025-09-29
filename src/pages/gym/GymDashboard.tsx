import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, Button } from '@/components/ui';
import MetricCard from '@/components/ui/MetricCard';
import {
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  PlusIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

const GymDashboard = () => {
  const { user } = useAuth();

  // Datos simulados - en producción vendrían de la API
  const metrics = {
    totalStudents: 24,
    activeAssignments: 8,
    templatesCreated: 12,
    averageAdherence: 78,
  };

  const recentActivities = [
    {
      id: 1,
      type: 'assignment',
      description: 'Nueva asignación creada para Juan Pérez',
      time: '2 horas',
      status: 'success',
    },
    {
      id: 2,
      type: 'template',
      description: 'Plantilla "Fuerza Básica" actualizada',
      time: '4 horas',
      status: 'info',
    },
    {
      id: 3,
      type: 'completion',
      description: 'María García completó rutina semanal',
      time: '1 día',
      status: 'success',
    },
    {
      id: 4,
      type: 'exercise',
      description: 'Nuevo ejercicio "Press Militar" agregado',
      time: '2 días',
      status: 'info',
    },
  ];

  const quickActions = [
    {
      name: 'Panel Profesor',
      description: 'Gestionar estudiantes y asignaciones',
      href: '/professor/dashboard',
      icon: UserGroupIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Crear Plantilla',
      description: 'Nueva plantilla de ejercicios',
      href: '/gym/daily-templates/create',
      icon: ClipboardDocumentListIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Ver Ejercicios',
      description: 'Gestionar biblioteca de ejercicios',
      href: '/gym/exercises',
      icon: EyeIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Reportes',
      description: 'Ver métricas y estadísticas',
      href: '/gym/reports',
      icon: ChartBarIcon,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Panel de Gimnasio
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Bienvenido de vuelta, {user?.name}. Aquí tienes un resumen de tu actividad.
          </p>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          <Button 
            variant="ghost" 
            leftIcon={<UserGroupIcon className="w-4 h-4" />}
            onClick={() => window.location.href = '/professor/dashboard'}
          >
            Panel Profesor
          </Button>
          <Button 
            variant="primary" 
            leftIcon={<PlusIcon className="w-4 h-4" />}
            onClick={() => window.location.href = '/gym/daily-templates/create'}
          >
            Nueva Plantilla
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Alumnos Asignados"
          value={metrics.totalStudents}
          change={12}
          changeType="increase"
          icon={<UserGroupIcon className="w-5 h-5" />}
          subtitle="Total de estudiantes"
        />
        <MetricCard
          title="Rutinas Activas"
          value={metrics.activeAssignments}
          change={-5}
          changeType="decrease"
          icon={<CalendarDaysIcon className="w-5 h-5" />}
          subtitle="Esta semana"
        />
        <MetricCard
          title="Plantillas Creadas"
          value={metrics.templatesCreated}
          change={8}
          changeType="increase"
          icon={<ClipboardDocumentListIcon className="w-5 h-5" />}
          subtitle="Total disponibles"
        />
        <MetricCard
          title="Adherencia Promedio"
          value={`${metrics.averageAdherence}%`}
          change={3}
          changeType="increase"
          icon={<ChartBarIcon className="w-5 h-5" />}
          subtitle="Últimos 30 días"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <Card.Header title="Acciones Rápidas" subtitle="Tareas frecuentes" />
          <Card.Content>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {quickActions.map((action) => (
                <div
                  key={action.name}
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-villa-mitre-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                >
                  <div>
                    <span className={`rounded-lg inline-flex p-3 ${action.color} text-white`}>
                      <action.icon className="w-6 h-6" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium">
                      <a href={action.href} className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        {action.name}
                      </a>
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">{action.description}</p>
                  </div>
                  <span
                    className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                    aria-hidden="true"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                    </svg>
                  </span>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>

        {/* Recent Activity */}
        <Card>
          <Card.Header title="Actividad Reciente" subtitle="Últimas acciones realizadas" />
          <Card.Content>
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivities.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivities.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span
                            className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                              activity.status === 'success'
                                ? 'bg-green-500'
                                : activity.status === 'info'
                                ? 'bg-blue-500'
                                : 'bg-gray-500'
                            }`}
                          >
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">{activity.description}</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time>hace {activity.time}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Weekly Overview */}
      <Card>
        <Card.Header 
          title="Resumen Semanal" 
          subtitle="Actividad de esta semana"
          actions={
            <Button variant="secondary" size="sm">
              Ver Detalles
            </Button>
          }
        />
        <Card.Content>
          <div className="grid grid-cols-7 gap-4 text-center">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => (
              <div key={day} className="flex flex-col items-center">
                <div className="text-sm font-medium text-gray-500 mb-2">{day}</div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium ${
                  index < 5 
                    ? 'bg-villa-mitre-100 text-villa-mitre-800' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {index < 5 ? Math.floor(Math.random() * 8) + 2 : 0}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {index < 5 ? 'asignaciones' : 'descanso'}
                </div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default GymDashboard;
