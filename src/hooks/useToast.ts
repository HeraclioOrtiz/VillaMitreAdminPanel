import { useToastContext, type Toast, type ToastType } from '@/contexts/ToastContext';

export interface UseToastReturn {
  // Core functions
  success: (title: string, message?: string, options?: Partial<Toast>) => void;
  error: (title: string, message?: string, options?: Partial<Toast>) => void;
  warning: (title: string, message?: string, options?: Partial<Toast>) => void;
  info: (title: string, message?: string, options?: Partial<Toast>) => void;
  
  // Advanced functions
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  
  // State
  toasts: Toast[];
  
  // Utility functions
  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => Promise<T>;
}

/**
 * Hook para gestionar notificaciones toast de forma sencilla
 * 
 * @example
 * ```tsx
 * const toast = useToast();
 * 
 * // Notificaciones básicas
 * toast.success('Operación exitosa');
 * toast.error('Error al procesar');
 * toast.warning('Advertencia importante');
 * toast.info('Información relevante');
 * 
 * // Con mensaje adicional
 * toast.success('Usuario creado', 'El usuario ha sido registrado correctamente');
 * 
 * // Con opciones avanzadas
 * toast.success('Guardado', 'Cambios guardados', {
 *   duration: 3000,
 *   action: {
 *     label: 'Deshacer',
 *     onClick: () => console.log('Deshacer acción')
 *   }
 * });
 * 
 * // Para promesas
 * toast.promise(
 *   fetch('/api/users'),
 *   {
 *     loading: 'Cargando usuarios...',
 *     success: 'Usuarios cargados correctamente',
 *     error: 'Error al cargar usuarios'
 *   }
 * );
 * ```
 */
export const useToast = (): UseToastReturn => {
  const context = useToastContext();

  /**
   * Maneja promesas con toasts automáticos
   */
  const promise = async <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ): Promise<T> => {
    // Mostrar toast de loading (simplificado sin ID tracking)
    context.info(options.loading);

    try {
      const result = await promise;
      
      // Mostrar success toast
      const successMessage = typeof options.success === 'function' 
        ? options.success(result) 
        : options.success;
      
      context.success(successMessage);
      
      return result;
    } catch (error) {
      // Mostrar error toast
      const errorMessage = typeof options.error === 'function' 
        ? options.error(error) 
        : options.error;
      
      context.error(errorMessage);
      
      throw error;
    }
  };

  return {
    // Core functions
    success: context.success,
    error: context.error,
    warning: context.warning,
    info: context.info,
    
    // Advanced functions
    addToast: context.addToast,
    removeToast: context.removeToast,
    clearAllToasts: context.clearAllToasts,
    
    // State
    toasts: context.toasts,
    
    // Utility functions
    promise,
  };
};

/**
 * Hook simplificado para casos básicos
 * 
 * @example
 * ```tsx
 * const { success, error } = useSimpleToast();
 * success('Operación completada');
 * error('Algo salió mal');
 * ```
 */
export const useSimpleToast = () => {
  const { success, error, warning, info } = useToast();
  
  return {
    success: (message: string) => success(message),
    error: (message: string) => error(message),
    warning: (message: string) => warning(message),
    info: (message: string) => info(message),
  };
};

/**
 * Hook para notificaciones de operaciones CRUD
 * 
 * @example
 * ```tsx
 * const crudToast = useCrudToast('Usuario');
 * 
 * crudToast.created(); // "Usuario creado correctamente"
 * crudToast.updated(); // "Usuario actualizado correctamente"
 * crudToast.deleted(); // "Usuario eliminado correctamente"
 * crudToast.error('crear'); // "Error al crear usuario"
 * ```
 */
export const useCrudToast = (entityName: string) => {
  const toast = useToast();
  
  return {
    created: (customMessage?: string) => {
      toast.success(
        customMessage || `${entityName} creado`,
        `${entityName} ha sido creado correctamente`
      );
    },
    
    updated: (customMessage?: string) => {
      toast.success(
        customMessage || `${entityName} actualizado`,
        `${entityName} ha sido actualizado correctamente`
      );
    },
    
    deleted: (customMessage?: string) => {
      toast.success(
        customMessage || `${entityName} eliminado`,
        `${entityName} ha sido eliminado correctamente`
      );
    },
    
    error: (operation: string, customMessage?: string) => {
      toast.error(
        customMessage || `Error al ${operation} ${entityName.toLowerCase()}`,
        'Por favor, inténtalo nuevamente'
      );
    },
    
    loading: (operation: string) => {
      return toast.info(`${operation} ${entityName.toLowerCase()}...`);
    },
  };
};

export default useToast;
