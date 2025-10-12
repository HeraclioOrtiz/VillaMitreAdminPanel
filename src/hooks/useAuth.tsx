import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { User, LoginCredentials, AuthContextType } from '@/types/auth';
import { authService } from '@/services/auth';
import SessionExpiredModal from '@/components/auth/SessionExpiredModal';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [sessionExpiredReason, setSessionExpiredReason] = useState<'expired' | 'unauthorized' | 'invalid'>('expired');
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    initializeAuth();
  }, []);

  // Escuchar eventos de sesión no autorizada
  useEffect(() => {
    const handleUnauthorized = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.warn('🔐 Auth: Unauthorized event received', customEvent.detail);
      
      // Limpiar estado
      setUser(null);
      setToken(null);
      
      // Limpiar React Query cache para evitar datos residuales
      queryClient.clear();
      
      // Mostrar modal informativo
      setSessionExpiredReason('unauthorized');
      setShowSessionExpired(true);
    };

    const handleAuthError = (event: Event) => {
      console.warn('🔐 Auth: Error event received');
      
      // Limpiar estado
      setUser(null);
      setToken(null);
      
      // Limpiar cache
      queryClient.clear();
      
      // Mostrar modal
      setSessionExpiredReason('invalid');
      setShowSessionExpired(true);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    window.addEventListener('auth:error', handleAuthError);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
      window.removeEventListener('auth:error', handleAuthError);
    };
  }, [queryClient]);

  const initializeAuth = async () => {
    try {
      const storedToken = authService.getToken();
      
      if (storedToken && authService.isTokenValid()) {
        setToken(storedToken);
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } else {
        authService.removeToken();
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      authService.removeToken();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      authService.setToken(response.token);
      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // 1. Llamar al backend para invalidar sesión
      await authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
      // Continuar con limpieza local aunque falle el backend
    } finally {
      // 2. Limpiar todo el storage (selectivo para evitar perder otras configuraciones)
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      sessionStorage.removeItem('redirectAfterLogin');
      
      // 3. Limpiar React Query cache completamente
      queryClient.clear();
      
      // 4. Limpiar estado de auth
      setUser(null);
      setToken(null);
      
      // 5. Navegar a login con replace para evitar volver atrás
      navigate('/login', { replace: true });
      
      setIsLoading(false);
    }
  }, [navigate, queryClient]);

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated,
  };

  const handleCloseSessionExpired = useCallback(() => {
    setShowSessionExpired(false);
    // El modal se encargará de navegar al login
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {children}
      
      {/* Modal de sesión expirada */}
      <SessionExpiredModal
        isOpen={showSessionExpired}
        onClose={handleCloseSessionExpired}
        reason={sessionExpiredReason}
      />
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
