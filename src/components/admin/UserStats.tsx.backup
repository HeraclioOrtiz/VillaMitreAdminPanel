/**
 * UserStats - Componente de estadísticas de usuario optimizado
 * Muestra métricas y estadísticas relevantes con React.memo y optimizaciones
 */

import React, { memo, useMemo, useCallback } from 'react';
import type { User } from '@/types/user';
import {
  UserIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  FireIcon,
  TrophyIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

interface UserStatsProps {
  user: User;
  stats?: {
    total_workouts: number;
    current_streak: number;
    last_workout: string | null;
    next_payment_due: string | null;
    total_payments: number;
    membership_days_remaining: number;
    login_count: number;
    last_login: string | null;
  };
  className?: string;
  compact?: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = memo<StatCardProps>(function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
}) {
  // Memoizar clases de color
  const colorClasses = useMemo(() => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        text: 'text-blue-900',
        border: 'border-blue-200',
      },
      green: {
        bg: 'bg-green-50',
        icon: 'text-green-600',
        text: 'text-green-900',
        border: 'border-green-200',
      },
      yellow: {
        bg: 'bg-yellow-50',
        icon: 'text-yellow-600',
        text: 'text-yellow-900',
        border: 'border-yellow-200',
      },
      red: {
        bg: 'bg-red-50',
        icon: 'text-red-600',
        text: 'text-red-900',
        border: 'border-red-200',
      },
      purple: {
        bg: 'bg-purple-50',
        icon: 'text-purple-600',
        text: 'text-purple-900',
        border: 'border-purple-200',
      },
      gray: {
        bg: 'bg-gray-50',
        icon: 'text-gray-600',
        text: 'text-gray-900',
        border: 'border-gray-200',
      },
    };
    return colors[color];
  }, [color]);

  return (
    <div className={`p-4 rounded-lg border ${colorClasses.bg} ${colorClasses.border}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-white ${colorClasses.border}`}>
            <Icon className={`h-5 w-5 ${colorClasses.icon}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-2xl font-bold ${colorClasses.text}`}>{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        
        {trend && (
          <div className={`text-sm font-medium ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>
    </div>
  );
});

const UserStats = memo<UserStatsProps>(function UserStats({
  user,
  stats,
  className = '',
  compact = false,
}) {
  // Memoizar cálculo de días desde creación
  const daysSinceCreation = useMemo(() => {
    const createdDate = new Date(user.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [user.created_at]);

  // Memoizar cálculo de días desde última actividad
  const daysSinceLastActivity = useMemo(() => {
    if (!user.last_activity_date) return null;
    const lastActivityDate = new Date(user.last_activity_date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastActivityDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [user.last_activity_date]);

  // Memoizar cálculo de días hasta vencimiento de membresía
  const daysUntilMembershipExpiry = useMemo(() => {
    if (!user.membership_end_date) return null;
    const expiryDate = new Date(user.membership_end_date);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [user.membership_end_date]);

  // Helper para determinar color de actividad
  const getActivityColor = useCallback((days: number | null): 'gray' | 'green' | 'yellow' | 'red' => {
    if (days === null) return 'gray';
    if (days <= 7) return 'green';
    if (days <= 30) return 'yellow';
    return 'red';
  }, []);

  // Helper para determinar color de verificación
  const getVerificationColor = useCallback((isVerified: boolean): 'green' | 'yellow' => {
    return isVerified ? 'green' : 'yellow';
  }, []);

  // Helper para determinar color de membresía
  const getMembershipColor = useCallback((days: number): 'green' | 'yellow' | 'red' => {
    if (days > 30) return 'green';
    if (days > 7) return 'yellow';
    return 'red';
  }, []);

  // Helper para determinar color de racha
  const getStreakColor = useCallback((streak: number): 'green' | 'yellow' | 'gray' => {
    if (streak > 7) return 'green';
    if (streak > 3) return 'yellow';
    return 'gray';
  }, []);

  // Memoizar estadísticas básicas del usuario
  const basicStats = useMemo(() => [
    {
      title: 'Días en el sistema',
      value: daysSinceCreation,
      subtitle: `Desde ${new Date(user.created_at).toLocaleDateString('es-ES')}`,
      icon: CalendarIcon,
      color: 'blue' as const,
    },
    {
      title: 'Estado de verificación',
      value: user.email_verified_at && user.phone_verified_at ? 'Completo' : 'Pendiente',
      subtitle: `Email: ${user.email_verified_at ? 'Verificado' : 'Pendiente'}, Teléfono: ${user.phone_verified_at ? 'Verificado' : 'Pendiente'}`,
      icon: user.email_verified_at && user.phone_verified_at ? CheckCircleIcon : XCircleIcon,
      color: getVerificationColor(Boolean(user.email_verified_at && user.phone_verified_at)),
    },
    {
      title: 'Última actividad',
      value: daysSinceLastActivity !== null ? `${daysSinceLastActivity} días` : 'Sin actividad',
      subtitle: user.last_activity_date ? new Date(user.last_activity_date).toLocaleDateString('es-ES') : 'Nunca',
      icon: ClockIcon,
      color: getActivityColor(daysSinceLastActivity),
    },
  ], [daysSinceCreation, user, daysSinceLastActivity, getActivityColor, getVerificationColor]);

  // Memoizar estadísticas de membresía (solo para miembros)
  const membershipStats = useMemo(() => {
    if (!user.is_member) return [];

    const stats = [];

    if (daysUntilMembershipExpiry !== null) {
      stats.push({
        title: 'Membresía',
        value: daysUntilMembershipExpiry > 0 ? `${daysUntilMembershipExpiry} días` : 'Vencida',
        subtitle: user.membership_end_date ? `Vence: ${new Date(user.membership_end_date).toLocaleDateString('es-ES')}` : '',
        icon: CurrencyDollarIcon,
        color: getMembershipColor(daysUntilMembershipExpiry),
      });
    }

    if (user.assigned_professor) {
      stats.push({
        title: 'Profesor asignado',
        value: 'Asignado',
        subtitle: `${user.assigned_professor.first_name} ${user.assigned_professor.last_name}`,
        icon: UserIcon,
        color: 'purple' as const,
      });
    }

    return stats;
  }, [user, daysUntilMembershipExpiry, getMembershipColor]);

  // Memoizar estadísticas avanzadas (si están disponibles)
  const advancedStats = useMemo(() => {
    if (!stats) return [];

    return [
      {
        title: 'Entrenamientos totales',
        value: stats.total_workouts,
        subtitle: stats.last_workout ? `Último: ${new Date(stats.last_workout).toLocaleDateString('es-ES')}` : 'Sin entrenamientos',
        icon: TrophyIcon,
        color: 'green' as const,
      },
      {
        title: 'Racha actual',
        value: `${stats.current_streak} días`,
        subtitle: stats.current_streak > 0 ? 'Mantén el ritmo!' : 'Comienza una nueva racha',
        icon: FireIcon,
        color: getStreakColor(stats.current_streak),
      },
      {
        title: 'Inicios de sesión',
        value: stats.login_count,
        subtitle: stats.last_login ? `Último: ${new Date(stats.last_login).toLocaleDateString('es-ES')}` : 'Sin inicios',
        icon: ChartBarIcon,
        color: 'blue' as const,
      },
      {
        title: 'Pagos realizados',
        value: stats.total_payments,
        subtitle: stats.next_payment_due ? `Próximo: ${new Date(stats.next_payment_due).toLocaleDateString('es-ES')}` : 'Sin pagos pendientes',
        icon: CurrencyDollarIcon,
        color: 'purple' as const,
      },
    ];
  }, [stats, getStreakColor]);

  // Combinar todas las estadísticas
  const allStats = useMemo(() => [
    ...basicStats,
    ...membershipStats,
    ...advancedStats,
  ], [basicStats, membershipStats, advancedStats]);

  if (compact) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${className}`}>
        {allStats.slice(0, 4).map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Estadísticas básicas */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información General</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {basicStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Estadísticas de membresía */}
      {membershipStats.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Membresía</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {membershipStats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>
      )}

      {/* Estadísticas avanzadas */}
      {advancedStats.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad y Rendimiento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {advancedStats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay estadísticas avanzadas */}
      {advancedStats.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Estadísticas no disponibles</h3>
          <p className="text-gray-500">
            Las estadísticas detalladas de actividad y rendimiento no están disponibles para este usuario.
          </p>
        </div>
      )}
    </div>
  );
});

export default UserStats;
