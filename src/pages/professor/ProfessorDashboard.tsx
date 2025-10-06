/**
 * Dashboard principal para profesores
 * Integra todos los componentes del panel de profesor
 */

import React, { memo, useState, useCallback } from 'react';
import { Tab } from '@headlessui/react';
import {
  UserGroupIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import type { ProfessorStudentAssignment, TodaySession } from '@/types/assignment';
import { useProfessorStats, useTodaySessions } from '@/hooks/useAssignments';
import { useTemplates } from '@/hooks/useTemplates';
import { MyStudents } from '@/components/professor/MyStudents';
import { WeeklyCalendar } from '@/components/professor/WeeklyCalendar';
import { AssignTemplateModal } from '@/components/professor/AssignTemplateModal';
import { MetricCard, Button, Skeleton } from '@/components/ui';

/**
 * Componente de estadísticas del profesor
 */
const ProfessorStats = memo(function ProfessorStats() {
  const { data: stats, isLoading } = useProfessorStats();
  const { data: todaySessionsResponse } = useTodaySessions();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32" />
        ))}
      </div>
    );
  }

  const todaySessions = todaySessionsResponse?.data || [];
  const todayPending = todaySessions.filter(s => s.status === 'pending').length;
  const todayCompleted = todaySessions.filter(s => s.status === 'completed').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Estudiantes Asignados"
        value={stats?.total_students || 0}
        subtitle={`${stats?.total_students || 0} total`}
        icon={<UserGroupIcon className="w-5 h-5" />}
        change={0}
        changeType="neutral"
      />

      <MetricCard
        title="Plantillas Asignadas"
        value={stats?.active_template_assignments || 0}
        subtitle={`${stats?.active_template_assignments || 0} activas`}
        icon={<CalendarDaysIcon className="w-5 h-5" />}
        change={0}
        changeType="neutral"
      />

      <MetricCard
        title="Sesiones de Hoy"
        value={todaySessions.length}
        subtitle={`${todayPending} pendientes, ${todayCompleted} completadas`}
        icon={<ChartBarIcon className="w-5 h-5" />}
        change={0}
        changeType="neutral"
      />

      <MetricCard
        title="Progreso Promedio"
        value={`${stats?.adherence_rate || 0}%`}
        subtitle="Adherencia promedio"
        icon={<ChartBarIcon className="w-5 h-5" />}
        change={0}
        changeType="neutral"
      />
    </div>
  );
});

/**
 * Componente de sesiones de hoy
 */
const TodaySessionsWidget = memo(function TodaySessionsWidget() {
  const { data: todaySessionsResponse, isLoading } = useTodaySessions();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const sessions = todaySessionsResponse?.data || [];
  const pendingSessions = sessions.filter(s => s.status === 'pending');
  const completedSessions = sessions.filter(s => s.status === 'completed');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Sesiones de Hoy
        </h3>
        <span className="text-sm text-gray-500">
          {sessions.length} total
        </span>
      </div>

      {sessions.length > 0 ? (
        <div className="space-y-3">
          {sessions.slice(0, 5).map((session) => {
            const studentName = `${session.student.first_name} ${session.student.last_name}`.trim();
            
            return (
              <div key={session.id} className="flex items-center space-x-3">
                {session.student.avatar_url ? (
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={session.student.avatar_url}
                    alt={studentName}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserGroupIcon className="h-4 w-4 text-gray-500" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {studentName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {session.template_assignment.daily_template.name}
                  </p>
                </div>
                
                <span className={`
                  inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${session.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : session.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                  }
                `}>
                  {session.status === 'completed' ? 'Completada' : 
                   session.status === 'pending' ? 'Pendiente' : 'Saltada'}
                </span>
              </div>
            );
          })}
          
          {sessions.length > 5 && (
            <div className="text-center pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                y {sessions.length - 5} más...
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6">
          <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">
            No hay sesiones programadas para hoy
          </p>
        </div>
      )}
    </div>
  );
});

/**
 * Componente principal del dashboard
 */
export const ProfessorDashboard = memo(function ProfessorDashboard() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<ProfessorStudentAssignment | null>(null);
  
  // 🔴 TEST: Hook de plantillas para debugging
  const { data: testTemplatesResponse, isLoading: testIsLoading, error: testError } = useTemplates({
    per_page: 10,
  });

  // Handlers
  const handleAssignTemplate = useCallback((student: ProfessorStudentAssignment) => {
    setSelectedStudent(student);
    setAssignModalOpen(true);
  }, []);

  const handleViewProgress = useCallback((student: ProfessorStudentAssignment) => {
    // TODO: Implementar vista de progreso detallado
  }, []);

  const handleViewCalendar = useCallback((student: ProfessorStudentAssignment) => {
    // Cambiar a la pestaña del calendario
    setSelectedTabIndex(1);
  }, []);

  const handleSessionClick = useCallback((session: TodaySession) => {
    // TODO: Implementar vista detallada de sesión
  }, []);

  const handleStudentClick = useCallback((studentId: number) => {
    // TODO: Implementar vista detallada de estudiante
  }, []);

  const handleCloseAssignModal = useCallback(() => {
    setAssignModalOpen(false);
    setSelectedStudent(null);
  }, []);

  const handleAssignSuccess = useCallback(() => {
    // Modal se cierra automáticamente
    // Los datos se refrescan automáticamente por React Query
  }, []);

  const tabs = [
    {
      name: 'Mis Estudiantes',
      icon: <UserGroupIcon className="w-5 h-5" />,
      component: (
        <MyStudents
          onAssignTemplate={handleAssignTemplate}
          onViewProgress={handleViewProgress}
          onViewCalendar={handleViewCalendar}
        />
      ),
    },
    {
      name: 'Calendario',
      icon: <CalendarDaysIcon className="w-5 h-5" />,
      component: (
        <WeeklyCalendar
          onSessionClick={handleSessionClick}
          onStudentClick={handleStudentClick}
        />
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Panel de Profesor
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona tus estudiantes y sus entrenamientos
          </p>
        </div>
        
        <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          <Button
            onClick={() => setAssignModalOpen(true)}
            leftIcon={<PlusIcon className="w-4 h-4" />}
          >
            Asignar Plantilla
          </Button>
          
          {/* 🔴 TEST: Botón para probar carga de plantillas */}
          <Button
            variant="secondary"
            onClick={() => {
              // Test templates data
            }}
          >
            Plantillas ({testTemplatesResponse?.data?.length || 0})
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <ProfessorStats />

      {/* Layout de dos columnas en desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contenido principal */}
        <div className="lg:col-span-2">
          <Tab.Group selectedIndex={selectedTabIndex} onChange={setSelectedTabIndex}>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-6">
              {tabs.map((tab, index) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200
                     focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60
                     ${selected
                       ? 'bg-white text-blue-700 shadow'
                       : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                     }`
                  }
                >
                  <div className="flex items-center justify-center space-x-2">
                    {tab.icon}
                    <span>{tab.name}</span>
                  </div>
                </Tab>
              ))}
            </Tab.List>
            
            <Tab.Panels>
              {tabs.map((tab, index) => (
                <Tab.Panel key={index} className="focus:outline-none">
                  {tab.component}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <TodaySessionsWidget />
          
          {/* Widget de acciones rápidas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Acciones Rápidas
            </h3>
            <div className="space-y-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setAssignModalOpen(true)}
                leftIcon={<PlusIcon className="w-4 h-4" />}
                className="w-full justify-start"
              >
                Asignar Nueva Plantilla
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedTabIndex(1)}
                leftIcon={<CalendarDaysIcon className="w-4 h-4" />}
                className="w-full justify-start"
              >
                Ver Calendario Completo
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedTabIndex(0)}
                leftIcon={<UserGroupIcon className="w-4 h-4" />}
                className="w-full justify-start"
              >
                Gestionar Estudiantes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de asignación de plantilla */}
      <AssignTemplateModal
        isOpen={assignModalOpen}
        onClose={handleCloseAssignModal}
        student={selectedStudent}
        onSuccess={handleAssignSuccess}
      />
    </div>
  );
});

export default ProfessorDashboard;
