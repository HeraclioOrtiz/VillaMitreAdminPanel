import React, { useState, useEffect } from 'react';
import { useToastContext, type Toast } from '@/contexts/ToastContext';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  className?: string;
}

/**
 * Componente contenedor de toasts que se conecta automáticamente al contexto
 */
export const ToastContainer = ({ 
  position = 'top-right',
  className = '',
}: ToastContainerProps) => {
  const { toasts, removeToast } = useToastContext();

  if (toasts.length === 0) return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-50 space-y-2 max-w-sm w-full pointer-events-none ${className}`}>
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

/**
 * Componente individual de toast con animaciones y estilos
 */
export const ToastItem = ({ toast, onRemove }: ToastItemProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(toast.id), 150);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <ExclamationCircleIcon className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "border-l-4 bg-white";
    switch (toast.type) {
      case 'success':
        return `${baseStyles} border-green-500`;
      case 'error':
        return `${baseStyles} border-red-500`;
      case 'warning':
        return `${baseStyles} border-yellow-500`;
      case 'info':
        return `${baseStyles} border-blue-500`;
    }
  };

  return (
    <div
      className={`
        ${getStyles()}
        rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out pointer-events-auto
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isLeaving ? 'scale-95' : 'scale-100'}
        hover:shadow-xl
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900">
            {toast.title}
          </h4>
          {toast.message && (
            <p className="mt-1 text-sm text-gray-600">
              {toast.message}
            </p>
          )}
          {toast.action && (
            <div className="mt-2">
              <button
                onClick={toast.action.onClick}
                className="text-sm font-medium text-villa-mitre-600 hover:text-villa-mitre-500 transition-colors"
              >
                {toast.action.label}
              </button>
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0">
          <button
            onClick={handleRemove}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
            title="Cerrar notificación"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Re-export from context for convenience
export { ToastProvider, useToastContext } from '@/contexts/ToastContext';
export type { Toast, ToastType } from '@/contexts/ToastContext';

export default ToastContainer;
