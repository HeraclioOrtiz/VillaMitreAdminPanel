import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  className?: string;
}

/**
 * ErrorBoundary para capturar errores de React y mostrar fallbacks
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log del error
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Callback personalizado
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Aquí podrías enviar el error a un servicio de logging como Sentry
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Si hay un fallback personalizado, usarlo
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fallback por defecto
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
          showDetails={this.props.showDetails}
          className={this.props.className}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onRetry: () => void;
  showDetails?: boolean;
  className?: string;
}

/**
 * Componente de fallback por defecto para errores
 */
export const ErrorFallback = ({
  error,
  errorInfo,
  onRetry,
  showDetails = false,
  className = ''
}: ErrorFallbackProps) => {
  const [showFullError, setShowFullError] = React.useState(false);

  return (
    <div className={`min-h-[400px] flex items-center justify-center p-8 ${className}`}>
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6">
          <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-red-500" />
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Algo salió mal
        </h2>
        
        <p className="text-gray-600 mb-6">
          Ha ocurrido un error inesperado. Puedes intentar recargar la página o contactar al soporte técnico.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-villa-mitre-600 text-white rounded-md hover:bg-villa-mitre-700 focus:ring-2 focus:ring-villa-mitre-500 focus:ring-offset-2 transition-colors"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Reintentar
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-villa-mitre-500 focus:ring-offset-2 transition-colors"
          >
            Recargar página
          </button>
        </div>

        {showDetails && error && (
          <div className="text-left">
            <button
              onClick={() => setShowFullError(!showFullError)}
              className="text-sm text-gray-500 hover:text-gray-700 mb-3"
            >
              {showFullError ? 'Ocultar' : 'Mostrar'} detalles técnicos
            </button>
            
            {showFullError && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-xs font-mono text-left overflow-auto max-h-40">
                <div className="text-red-600 font-semibold mb-2">
                  {error.name}: {error.message}
                </div>
                {error.stack && (
                  <pre className="whitespace-pre-wrap text-gray-700">
                    {error.stack}
                  </pre>
                )}
                {errorInfo?.componentStack && (
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <div className="text-gray-600 font-semibold mb-1">Component Stack:</div>
                    <pre className="whitespace-pre-wrap text-gray-700">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Hook para manejo de errores en componentes funcionales
 */
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error) => {
    console.error('Error handled by useErrorHandler:', error);
    setError(error);
  }, []);

  // Si hay error, lanzarlo para que lo capture el ErrorBoundary
  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { handleError, resetError };
};

/**
 * ErrorBoundary específico para rutas
 */
export const RouteErrorBoundary = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Route Error:', error, errorInfo);
        // Aquí podrías enviar el error a un servicio de analytics
      }}
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-8">
            <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-red-500 mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Error en la página
            </h1>
            <p className="text-gray-600 mb-6">
              Ha ocurrido un error al cargar esta página. Intenta recargar o volver al inicio.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-villa-mitre-600 text-white rounded-md hover:bg-villa-mitre-700 transition-colors"
              >
                Recargar página
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Ir al inicio
              </button>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};

/**
 * ErrorBoundary específico para componentes de tabla
 */
export const TableErrorBoundary = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error al cargar la tabla
            </h3>
            <p className="text-gray-600 mb-4">
              No se pudieron cargar los datos de la tabla.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-villa-mitre-600 text-white rounded-md hover:bg-villa-mitre-700 transition-colors"
            >
              Recargar
            </button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};

/**
 * ErrorBoundary específico para formularios
 */
export const FormErrorBoundary = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error en el formulario
            </h3>
            <p className="text-gray-600 mb-4">
              Ha ocurrido un error al cargar el formulario.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-villa-mitre-600 text-white rounded-md hover:bg-villa-mitre-700 transition-colors"
            >
              Recargar formulario
            </button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};

/**
 * ErrorBoundary específico para modales
 */
export const ModalErrorBoundary = ({ 
  children, 
  onClose 
}: { 
  children: ReactNode;
  onClose: () => void;
}) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-8 text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error en el modal
          </h3>
          <p className="text-gray-600 mb-4">
            Ha ocurrido un error al cargar el contenido.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-villa-mitre-600 text-white rounded-md hover:bg-villa-mitre-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};

/**
 * Componente para mostrar errores de API de forma consistente
 */
export const ApiErrorDisplay = ({ 
  error, 
  onRetry,
  className = ''
}: { 
  error: Error | string;
  onRetry?: () => void;
  className?: string;
}) => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  return (
    <div className={`bg-red-50 border border-red-200 rounded-md p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Error al cargar los datos
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{errorMessage}</p>
          </div>
          {onRetry && (
            <div className="mt-3">
              <button
                onClick={onRetry}
                className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
              >
                Reintentar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
