import React, { createContext, useContext, useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  success: (title: string, message?: string, options?: Partial<Toast>) => void;
  error: (title: string, message?: string, options?: Partial<Toast>) => void;
  warning: (title: string, message?: string, options?: Partial<Toast>) => void;
  info: (title: string, message?: string, options?: Partial<Toast>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
  defaultDuration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export const ToastProvider = ({ 
  children, 
  maxToasts = 5,
  defaultDuration = 5000,
}: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? defaultDuration,
    };

    setToasts(prev => {
      const updated = [newToast, ...prev];
      return updated.slice(0, maxToasts);
    });

    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, [maxToasts, defaultDuration, removeToast]);

  const success = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({ 
      type: 'success', 
      title, 
      message,
      ...options 
    });
  }, [addToast]);

  const error = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({ 
      type: 'error', 
      title, 
      message, 
      duration: 7000, // Errors stay longer
      ...options 
    });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({ 
      type: 'warning', 
      title, 
      message,
      duration: 6000, // Warnings stay a bit longer
      ...options 
    });
  }, [addToast]);

  const info = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({ 
      type: 'info', 
      title, 
      message,
      ...options 
    });
  }, [addToast]);

  const contextValue: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
