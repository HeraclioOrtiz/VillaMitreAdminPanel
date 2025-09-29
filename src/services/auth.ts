import { apiClient } from './api';
import { LoginCredentials, AuthResponse, User } from '@/types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Ignorar errores de logout, limpiar token de todas formas
      console.warn('Error during logout:', error);
    } finally {
      localStorage.removeItem('auth_token');
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/refresh');
    return response.data;
  },

  // Helpers para manejar tokens
  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  removeToken(): void {
    localStorage.removeItem('auth_token');
  },

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Decodificar JWT para verificar expiración
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  },
};
