import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, LoginCredentials, AuthContextType } from '@/types/auth';
import { authService } from '@/services/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    initializeAuth();
  }, []);

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

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
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
