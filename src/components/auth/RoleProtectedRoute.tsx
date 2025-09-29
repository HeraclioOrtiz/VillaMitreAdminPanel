import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: ('admin' | 'super_admin' | 'professor' | 'member')[];
  fallbackPath?: string;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  fallbackPath = '/unauthorized'
}) => {
  const { user, isLoading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-villa-mitre-600"></div>
      </div>
    );
  }

  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si no se especifican roles requeridos, permitir acceso
  if (requiredRoles.length === 0) {
    return <>{children}</>;
  }

  // Verificar si el usuario tiene alguno de los roles requeridos
  const hasRequiredRole = requiredRoles.some(role => {
    switch (role) {
      case 'super_admin':
        return user.is_super_admin;
      case 'admin':
        return user.is_admin || user.is_super_admin;
      case 'professor':
        return user.is_professor || user.is_admin || user.is_super_admin;
      case 'member':
        return true; // Todos los usuarios autenticados son miembros
      default:
        return false;
    }
  });

  if (!hasRequiredRole) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
