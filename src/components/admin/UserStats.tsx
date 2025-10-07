// Stub temporal para build - Componente en desarrollo
import React from 'react';

interface UserStatsProps {
  user: any;
  stats?: any;
  compact?: boolean;
}

const UserStats: React.FC<UserStatsProps> = () => {
  return (
    <div className="bg-white border rounded-lg p-6">
      <p className="text-sm text-gray-600">Estadísticas de usuario en desarrollo</p>
    </div>
  );
};

export default UserStats;
