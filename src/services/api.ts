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
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor para agregar token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      
      if (import.meta.env.VITE_DEBUG_API === 'true') {
        console.log('🔐 API Request Debug:', {
          url: config.url,
          baseURL: config.baseURL,
          fullURL: `${config.baseURL}${config.url}`,
          method: config.method?.toUpperCase(),
          headers: config.headers,
          hasToken: !!token,
          tokenPreview: token ? `${token.substring(0, 20)}...` : 'NO TOKEN'
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
          console.error('❌ API Response Error:');
          console.error('  URL:', error.config?.url);
          console.error('  Method:', error.config?.method?.toUpperCase());
          console.error('  Status:', error.response?.status);
          console.error('  Status Text:', error.response?.statusText);
          console.error('  Error Message:', error.message);
          console.error('  Response Data:', error.response?.data);
          console.error('  Response Headers:', error.response?.headers);
          console.error('  Request Data:', error.config?.data);
          console.error('  Full Error:', error);
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
      },
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
