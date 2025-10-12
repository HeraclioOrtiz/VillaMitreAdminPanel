import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary para capturar errores de autenticación no manejados
 * Evita pantallas blancas y proporciona recuperación elegante
 */
export class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🔴 AuthErrorBoundary caught an error:', error);
    console.error('Error Info:', errorInfo);

    this.setState({
      errorInfo,
    });

    // Si es un error de autenticación, limpiar y preparar para redirect
    if (
      error.message.includes('401') ||
      error.message.includes('unauthorized') ||
      error.message.includes('authentication')
    ) {
      console.warn('⚠️ Authentication error detected, clearing auth data...');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      // Emitir evento para que AuthProvider maneje la redirección
      window.dispatchEvent(new CustomEvent('auth:error', { detail: error }));
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    window.location.href = '/login';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="flex justify-center">
              <ExclamationTriangleIcon className="h-16 w-16 text-red-500" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              ¡Ups! Algo salió mal
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Ha ocurrido un error inesperado en la aplicación
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              {/* Mensaje de error */}
              <div className="mb-6">
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error detectado
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        {this.state.error?.message || 'Error desconocido'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información técnica (solo en desarrollo) */}
              {import.meta.env.DEV && this.state.errorInfo && (
                <div className="mb-6">
                  <details className="cursor-pointer">
                    <summary className="text-sm font-medium text-gray-700 mb-2">
                      Detalles técnicos (modo desarrollo)
                    </summary>
                    <div className="mt-2 bg-gray-100 rounded p-3 overflow-auto max-h-40">
                      <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  </details>
                </div>
              )}

              {/* Acciones */}
              <div className="space-y-3">
                <Button
                  onClick={this.handleReset}
                  variant="primary"
                  className="w-full"
                >
                  Intentar de Nuevo
                </Button>
                
                <Button
                  onClick={this.handleGoHome}
                  variant="secondary"
                  className="w-full"
                >
                  Volver al Inicio de Sesión
                </Button>

                {import.meta.env.DEV && (
                  <Button
                    onClick={() => window.location.reload()}
                    variant="ghost"
                    className="w-full"
                  >
                    Recargar Página
                  </Button>
                )}
              </div>

              {/* Mensaje de ayuda */}
              <div className="mt-6">
                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-blue-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Si el problema persiste, contacta al administrador del sistema
                        proporcionando los detalles del error mostrados arriba.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;
