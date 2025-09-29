import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, Button } from '@/components/ui';
import MetricCard from '@/components/ui/MetricCard';
import {
  UsersIcon,
  ShieldCheckIcon,
  ServerIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  UserGroupIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { user } = useAuth();

  // Datos simulados - en producción vendrían de la API
  const systemMetrics = {
    totalUsers: 156,
    activeProfessors: 8,
    systemHealth: 98,
    apiCalls: 2847,
  };

  const systemAlerts = [
    {
      id: 1,
      type: 'warning',
      message: 'Sincronización API pendiente desde hace 2 horas',
      time: '2h',
    },
    {
      id: 2,
      type: 'info',
      message: '3 nuevos usuarios registrados hoy',
      time: '4h',
    },
    {
      id: 3,
      type: 'success',
      message: 'Backup automático completado exitosamente',
      time: '6h',
    },
  ];

  const quickStats = [
    { label: 'Usuarios Activos Hoy', value: 42 },
    { label: 'Profesores Conectados', value: 5 },
    { label: 'Asignaciones Creadas', value: 12 },
    { label: 'Tiempo Promedio Sesión', value: '24min' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Panel de Administración
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Bienvenido, {user?.name}. Gestiona el sistema Villa Mitre desde aquí.
          </p>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          <Button 
            variant="ghost"
            leftIcon={<UserGroupIcon className="w-4 h-4" />}
            onClick={() => window.location.href = '/admin/assignments'}
          >
            Asignaciones
          </Button>
          <Button 
            variant="secondary"
            onClick={() => window.location.href = '/admin/users'}
          >
            Gestionar Usuarios
          </Button>
          <Button 
            variant="primary"
            leftIcon={<PlusIcon className="w-4 h-4" />}
            onClick={() => window.location.href = '/admin/assignments/manage'}
          >
            Nueva Asignación
          </Button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Usuarios"
          value={systemMetrics.totalUsers}
          change={8}
          changeType="increase"
          icon={<UsersIcon className="w-5 h-5" />}
          subtitle="Registrados en el sistema"
        />
        <MetricCard
          title="Profesores Activos"
          value={systemMetrics.activeProfessors}
          change={0}
          changeType="neutral"
          icon={<ShieldCheckIcon className="w-5 h-5" />}
          subtitle="Con permisos de gimnasio"
        />
        <MetricCard
          title="Salud del Sistema"
          value={`${systemMetrics.systemHealth}%`}
          change={2}
          changeType="increase"
          icon={<ServerIcon className="w-5 h-5" />}
          subtitle="Uptime últimas 24h"
        />
        <MetricCard
          title="Llamadas API"
          value={systemMetrics.apiCalls.toLocaleString()}
          change={15}
          changeType="increase"
          icon={<ChartBarIcon className="w-5 h-5" />}
          subtitle="Hoy"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* System Status */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header 
              title="Estado del Sistema" 
              subtitle="Monitoreo en tiempo real"
              actions={
                <Button variant="secondary" size="sm">
                  Actualizar
                </Button>
              }
            />
            <Card.Content>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-green-800">API Externa</p>
                      <p className="text-xs text-green-600">Conectado - Última sync: hace 30min</p>
                    </div>
                  </div>
                  <span className="text-green-600 text-sm font-medium">Operativo</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Base de Datos</p>
                      <p className="text-xs text-green-600">Rendimiento óptimo</p>
                    </div>
                  </div>
                  <span className="text-green-600 text-sm font-medium">Operativo</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Cache Redis</p>
                      <p className="text-xs text-yellow-600">Uso elevado - 85% capacidad</p>
                    </div>
                  </div>
                  <span className="text-yellow-600 text-sm font-medium">Advertencia</span>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* System Alerts */}
        <Card>
          <Card.Header title="Alertas del Sistema" subtitle="Notificaciones importantes" />
          <Card.Content>
            <div className="space-y-3">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {alert.type === 'warning' && (
                      <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
                    )}
                    {alert.type === 'info' && (
                      <ChartBarIcon className="w-5 h-5 text-blue-500" />
                    )}
                    {alert.type === 'success' && (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500">hace {alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <Card.Header title="Estadísticas Rápidas" subtitle="Resumen de actividad del día" />
        <Card.Content>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {quickStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Management Actions */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Card.Content>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="w-8 h-8 text-villa-mitre-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Gestionar Usuarios</h3>
                <p className="text-sm text-gray-500">Ver, editar y administrar usuarios del sistema</p>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Card.Content>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShieldCheckIcon className="w-8 h-8 text-villa-mitre-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Profesores</h3>
                <p className="text-sm text-gray-500">Asignar roles y gestionar permisos</p>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Card.Content>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="w-8 h-8 text-villa-mitre-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Reportes</h3>
                <p className="text-sm text-gray-500">Análisis y métricas del sistema</p>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
