import React from 'react';
import { 
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  DocumentTextIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  FolderIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  icon?: React.ComponentType<{ className?: string }>;
}

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  illustration?: 'search' | 'create' | 'error' | 'folder' | 'settings' | 'info' | 'users' | 'documents';
  actions?: EmptyStateAction[];
  className?: string;
}

/**
 * Componente EmptyState para mostrar estados vacíos con ilustraciones
 * Proporciona diferentes variantes y acciones personalizables
 */
export const EmptyState = ({
  title,
  description,
  icon,
  illustration = 'folder',
  actions = [],
  className = ''
}: EmptyStateProps) => {
  const getIllustrationIcon = () => {
    if (icon) return icon;
    
    switch (illustration) {
      case 'search':
        return MagnifyingGlassIcon;
      case 'create':
        return PlusIcon;
      case 'error':
        return ExclamationTriangleIcon;
      case 'settings':
        return Cog6ToothIcon;
      case 'info':
        return InformationCircleIcon;
      case 'users':
        return UserGroupIcon;
      case 'documents':
        return ClipboardDocumentListIcon;
      case 'folder':
      default:
        return FolderIcon;
    }
  };

  const getIllustrationColor = () => {
    switch (illustration) {
      case 'error':
        return 'text-red-400';
      case 'search':
        return 'text-blue-400';
      case 'create':
        return 'text-green-400';
      case 'settings':
        return 'text-purple-400';
      case 'info':
        return 'text-blue-400';
      case 'users':
        return 'text-indigo-400';
      case 'documents':
        return 'text-orange-400';
      case 'folder':
      default:
        return 'text-gray-400';
    }
  };

  const IconComponent = getIllustrationIcon();

  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="mx-auto max-w-md">
        {/* Illustration */}
        <div className="mx-auto mb-6">
          <IconComponent className={`mx-auto h-24 w-24 ${getIllustrationColor()}`} />
        </div>

        {/* Content */}
        <div className="space-y-3 mb-8">
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {actions.map((action, index) => {
              const isPrimary = action.variant === 'primary' || (index === 0 && !action.variant);
              
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`
                    inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors
                    ${isPrimary
                      ? 'bg-villa-mitre-600 text-white hover:bg-villa-mitre-700 focus:ring-2 focus:ring-villa-mitre-500 focus:ring-offset-2'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-villa-mitre-500 focus:ring-offset-2'
                    }
                  `}
                >
                  {action.icon && <action.icon className="h-4 w-4" />}
                  {action.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * EmptyState específico para búsquedas sin resultados
 */
export const SearchEmptyState = ({ 
  searchTerm,
  onClearSearch,
  onCreateNew
}: {
  searchTerm: string;
  onClearSearch: () => void;
  onCreateNew?: () => void;
}) => {
  const actions: EmptyStateAction[] = [
    {
      label: 'Limpiar búsqueda',
      onClick: onClearSearch,
      variant: 'secondary'
    }
  ];

  if (onCreateNew) {
    actions.unshift({
      label: 'Crear nuevo',
      onClick: onCreateNew,
      variant: 'primary',
      icon: PlusIcon
    });
  }

  return (
    <EmptyState
      illustration="search"
      title="No se encontraron resultados"
      description={`No encontramos elementos que coincidan con "${searchTerm}". Intenta con otros términos de búsqueda o crea un nuevo elemento.`}
      actions={actions}
    />
  );
};

/**
 * EmptyState específico para ejercicios
 */
export const ExercisesEmptyState = ({ 
  onCreateExercise,
  hasFilters = false,
  onClearFilters
}: {
  onCreateExercise: () => void;
  hasFilters?: boolean;
  onClearFilters?: () => void;
}) => {
  if (hasFilters && onClearFilters) {
    return (
      <EmptyState
        illustration="search"
        title="No hay ejercicios con estos filtros"
        description="No encontramos ejercicios que coincidan con los filtros seleccionados. Intenta ajustar los criterios de búsqueda."
        actions={[
          {
            label: 'Crear ejercicio',
            onClick: onCreateExercise,
            variant: 'primary',
            icon: PlusIcon
          },
          {
            label: 'Limpiar filtros',
            onClick: onClearFilters,
            variant: 'secondary'
          }
        ]}
      />
    );
  }

  return (
    <EmptyState
      illustration="documents"
      title="No hay ejercicios creados"
      description="Comienza creando tu primer ejercicio. Podrás definir grupos musculares, equipamiento, dificultad y más."
      actions={[
        {
          label: 'Crear primer ejercicio',
          onClick: onCreateExercise,
          variant: 'primary',
          icon: PlusIcon
        }
      ]}
    />
  );
};

/**
 * EmptyState específico para plantillas
 */
export const TemplatesEmptyState = ({ 
  onCreateTemplate,
  hasFilters = false,
  onClearFilters
}: {
  onCreateTemplate: () => void;
  hasFilters?: boolean;
  onClearFilters?: () => void;
}) => {
  if (hasFilters && onClearFilters) {
    return (
      <EmptyState
        illustration="search"
        title="No hay plantillas con estos filtros"
        description="No encontramos plantillas que coincidan con los filtros seleccionados. Intenta ajustar los criterios de búsqueda."
        actions={[
          {
            label: 'Crear plantilla',
            onClick: onCreateTemplate,
            variant: 'primary',
            icon: PlusIcon
          },
          {
            label: 'Limpiar filtros',
            onClick: onClearFilters,
            variant: 'secondary'
          }
        ]}
      />
    );
  }

  return (
    <EmptyState
      illustration="documents"
      title="No hay plantillas creadas"
      description="Crea tu primera plantilla de entrenamiento. Podrás combinar ejercicios, definir series y personalizar rutinas completas."
      actions={[
        {
          label: 'Crear primera plantilla',
          onClick: onCreateTemplate,
          variant: 'primary',
          icon: PlusIcon
        }
      ]}
    />
  );
};

/**
 * EmptyState específico para usuarios
 */
export const UsersEmptyState = ({ 
  onInviteUser,
  hasFilters = false,
  onClearFilters
}: {
  onInviteUser: () => void;
  hasFilters?: boolean;
  onClearFilters?: () => void;
}) => {
  if (hasFilters && onClearFilters) {
    return (
      <EmptyState
        illustration="search"
        title="No hay usuarios con estos filtros"
        description="No encontramos usuarios que coincidan con los filtros seleccionados. Intenta ajustar los criterios de búsqueda."
        actions={[
          {
            label: 'Invitar usuario',
            onClick: onInviteUser,
            variant: 'primary',
            icon: PlusIcon
          },
          {
            label: 'Limpiar filtros',
            onClick: onClearFilters,
            variant: 'secondary'
          }
        ]}
      />
    );
  }

  return (
    <EmptyState
      illustration="users"
      title="No hay usuarios registrados"
      description="Invita a los primeros usuarios al sistema. Podrás gestionar roles, permisos y asignaciones de entrenamiento."
      actions={[
        {
          label: 'Invitar primer usuario',
          onClick: onInviteUser,
          variant: 'primary',
          icon: PlusIcon
        }
      ]}
    />
  );
};

/**
 * EmptyState para errores de conexión
 */
export const ConnectionErrorState = ({ 
  onRetry,
  onGoBack
}: {
  onRetry: () => void;
  onGoBack?: () => void;
}) => {
  const actions: EmptyStateAction[] = [
    {
      label: 'Reintentar',
      onClick: onRetry,
      variant: 'primary'
    }
  ];

  if (onGoBack) {
    actions.push({
      label: 'Volver',
      onClick: onGoBack,
      variant: 'secondary'
    });
  }

  return (
    <EmptyState
      illustration="error"
      title="Error de conexión"
      description="No pudimos cargar los datos. Verifica tu conexión a internet e intenta nuevamente."
      actions={actions}
    />
  );
};

/**
 * EmptyState para permisos insuficientes
 */
export const PermissionDeniedState = ({ 
  onGoBack,
  onContactAdmin
}: {
  onGoBack?: () => void;
  onContactAdmin?: () => void;
}) => {
  const actions: EmptyStateAction[] = [];

  if (onContactAdmin) {
    actions.push({
      label: 'Contactar administrador',
      onClick: onContactAdmin,
      variant: 'primary'
    });
  }

  if (onGoBack) {
    actions.push({
      label: 'Volver',
      onClick: onGoBack,
      variant: 'secondary'
    });
  }

  return (
    <EmptyState
      illustration="error"
      title="Acceso denegado"
      description="No tienes permisos suficientes para acceder a esta sección. Contacta al administrador si necesitas acceso."
      actions={actions}
    />
  );
};

/**
 * EmptyState para mantenimiento
 */
export const MaintenanceState = ({ 
  onGoBack,
  estimatedTime
}: {
  onGoBack?: () => void;
  estimatedTime?: string;
}) => {
  const actions: EmptyStateAction[] = [];

  if (onGoBack) {
    actions.push({
      label: 'Volver al inicio',
      onClick: onGoBack,
      variant: 'primary'
    });
  }

  return (
    <EmptyState
      illustration="settings"
      title="Mantenimiento en progreso"
      description={`Esta funcionalidad está temporalmente deshabilitada por mantenimiento.${estimatedTime ? ` Tiempo estimado: ${estimatedTime}` : ''}`}
      actions={actions}
    />
  );
};

export default EmptyState;
