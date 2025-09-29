import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface SmartRedirectProps {
  adminPath: string;
  professorPath: string;
  defaultPath?: string;
}

const SmartRedirect: React.FC<SmartRedirectProps> = ({
  adminPath,
  professorPath,
  defaultPath = '/gym/dashboard'
}) => {
  const { user } = useAuth();

  // Redirigir basado en el rol del usuario
  if (user?.is_admin || user?.is_super_admin) {
    return <Navigate to={adminPath} replace />;
  } else if (user?.is_professor) {
    return <Navigate to={professorPath} replace />;
  } else {
    return <Navigate to={defaultPath} replace />;
  }
};

export default SmartRedirect;
