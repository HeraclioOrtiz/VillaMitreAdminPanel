import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  HomeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  CogIcon,
  UsersIcon,
  ShieldCheckIcon,
  DocumentChartBarIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  current?: boolean;
  requiredRole?: 'professor' | 'admin' | 'super_admin';
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Navegación para profesores - Panel de Gimnasio (Gestión de contenido)
  const gymNavigation: NavigationItem[] = [
    { name: 'Dashboard Gimnasio', href: '/gym/dashboard', icon: HomeIcon },
    { name: 'Ejercicios', href: '/gym/exercises', icon: ClipboardDocumentListIcon },
    { name: 'Plantillas Diarias', href: '/gym/daily-templates', icon: CalendarDaysIcon },
    { name: 'Plantillas Semanales', href: '/gym/weekly-templates', icon: CalendarDaysIcon },
    { name: 'Reportes', href: '/gym/reports', icon: ChartBarIcon },
    { name: 'Configuración', href: '/gym/settings', icon: CogIcon },
  ];

  // Navegación para profesores - Panel de Asignaciones (Gestión de estudiantes)
  const professorNavigation: NavigationItem[] = [
    { name: 'Mis Estudiantes', href: '/professor/dashboard', icon: AcademicCapIcon },
  ];

  // Navegación para administradores - Panel de Administración (Gestión del sistema)
  const adminNavigation: NavigationItem[] = [
    { name: 'Dashboard Admin', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Usuarios', href: '/admin/users', icon: UsersIcon },
    { name: 'Gestión Asignaciones', href: '/admin/assignments', icon: UserGroupIcon },
    { name: 'Profesores', href: '/admin/professors', icon: ShieldCheckIcon },
    { name: 'Configuración Sistema', href: '/admin/settings', icon: CogIcon },
    { name: 'Reportes Sistema', href: '/admin/reports', icon: DocumentChartBarIcon },
    { name: 'Auditoría', href: '/admin/audit', icon: DocumentChartBarIcon },
  ];

  // Determinar qué navegación mostrar basado en el rol del usuario
  const getNavigationSections = (): NavigationSection[] => {
    if (user?.is_admin || user?.is_super_admin) {
      return [
        { title: 'Panel de Gimnasio', items: gymNavigation },
        { title: 'Panel de Profesor', items: professorNavigation },
        { title: 'Panel de Administración', items: adminNavigation },
      ];
    }
    if (user?.is_professor) {
      return [
        { title: 'Panel de Gimnasio', items: gymNavigation },
        { title: 'Gestión de Estudiantes', items: professorNavigation },
      ];
    }
    return [];
  };

  const navigationSections = getNavigationSections();

  const isCurrentPath = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center flex-shrink-0 px-4">
        <div className="w-8 h-8 bg-villa-mitre-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">VM</span>
        </div>
        <div className="ml-3">
          <h1 className="text-lg font-semibold text-gray-900">Villa Mitre</h1>
          <p className="text-xs text-gray-500">
            {user?.is_admin || user?.is_super_admin ? 'Panel Admin' : 
             user?.is_professor ? 'Panel Profesor' : 'Panel Usuario'}
          </p>
        </div>
      </div>

      {/* User Info */}
      <div className="mt-6 px-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">
              {user?.is_super_admin ? 'Super Admin' : 
               user?.is_admin ? 'Administrador' : 
               user?.is_professor ? 'Profesor' : 'Usuario'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8 flex-1 px-2 space-y-6">
        {navigationSections.map((section) => (
          <div key={section.title}>
            {/* Section Title */}
            <div className="px-2 mb-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </h3>
            </div>
            
            {/* Section Items */}
            <div className="space-y-1">
              {section.items.map((item: NavigationItem) => {
                const current = isCurrentPath(item.href);
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      current
                        ? 'bg-villa-mitre-100 text-villa-mitre-900 border-r-2 border-villa-mitre-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        current ? 'text-villa-mitre-600' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Villa Mitre Admin v1.0.0
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
