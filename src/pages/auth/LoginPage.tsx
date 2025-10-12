import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input, Card } from '@/components/ui';
import { LoginCredentials } from '@/types/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, isAuthenticated } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    dni: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  // Si ya está autenticado, redirigir
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || 
                          location.state?.from || 
                          '/dashboard';
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      console.log('🔐 Attempting login with:', { dni: credentials.dni });
      await login(credentials);
      console.log('✅ Login successful');
      
      // Obtener ruta de redirección
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || 
                          location.state?.from || 
                          '/dashboard';
      
      // Limpiar ruta guardada
      sessionStorage.removeItem('redirectAfterLogin');
      
      console.log('📍 Redirecting to:', redirectPath);
      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      console.error('❌ Login error:', err);
      console.error('  Error response:', err.response);
      console.error('  Error data:', err.response?.data);
      console.error('  Error message:', err.message);
      
      // Limpiar cualquier token inválido que pueda haber quedado
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Error al iniciar sesión. Por favor verifica tus credenciales.';
      setError(errorMessage);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gray-900 rounded-lg flex items-center justify-center p-2">
            <img 
              src="/cvm-escudo-para-fondo-negro.png" 
              alt="Villa Mitre" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Panel de Administración
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Villa Mitre - Acceso para administradores y profesores
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error de autenticación
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Input
              label="DNI"
              name="dni"
              type="text"
              required
              value={credentials.dni}
              onChange={handleInputChange}
              placeholder="Ingresa tu DNI"
              disabled={isLoading}
            />

            <Input
              label="Contraseña"
              name="password"
              type="password"
              required
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Ingresa tu contraseña"
              disabled={isLoading}
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={!credentials.dni || !credentials.password}
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  ¿Problemas para acceder?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Contacta al administrador del sistema para obtener acceso
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
