import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse } from '@/types/common';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Header requerido para localtunnel
        'Bypass-Tunnel-Reminder': 'true',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor para agregar token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      
      // Asegurar que el header de bypass esté presente en todas las requests
      if (!config.headers['Bypass-Tunnel-Reminder']) {
        config.headers['Bypass-Tunnel-Reminder'] = 'true';
      }
      
      if (import.meta.env.VITE_DEBUG_API === 'true') {
        console.log('🔐 API Request Debug:', {
          url: config.url,
          baseURL: config.baseURL,
          fullURL: `${config.baseURL}${config.url}`,
          method: config.method?.toUpperCase(),
          headers: config.headers,
          hasToken: !!token,
          tokenPreview: token ? `${token.substring(0, 20)}...` : 'NO TOKEN',
          bypassHeader: config.headers['Bypass-Tunnel-Reminder']
        });
      }
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor para manejar errores
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        if (import.meta.env.VITE_DEBUG_API === 'true') {
          console.log('✅ API Response Success:', {
            url: response.config.url,
            status: response.status,
            statusText: response.statusText,
            dataType: typeof response.data,
            dataKeys: response.data ? Object.keys(response.data) : [],
            hasData: !!response.data?.data,
            dataLength: Array.isArray(response.data?.data) ? response.data.data.length : 'N/A'
          });
        }
        return response;
      },
      (error) => {
        if (import.meta.env.VITE_DEBUG_API === 'true') {
          console.error('❌ API Response Error:', {
            url: error.config?.url,
            status: error.response?.status,
            statusText: error.response?.statusText,
            message: error.message,
            responseData: error.response?.data,
            headers: error.response?.headers
          });
        }
        
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(url: string, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.delete(url, config);
    return response.data;
  }

  // Método para subir archivos
  async upload<T = any>(url: string, formData: FormData): Promise<ApiResponse<T>> {
    const response = await this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Bypass-Tunnel-Reminder': 'true',
      },
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
