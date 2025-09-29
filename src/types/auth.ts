export interface User {
  id: number;
  name: string;
  email?: string;
  dni: string;
  user_type: 'local' | 'api';
  type_label: string;
  is_professor: boolean;
  is_admin?: boolean;
  is_super_admin?: boolean;
  avatar_url?: string;
  created_at: string;
  last_login?: string;
}

export interface LoginCredentials {
  dni: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}
