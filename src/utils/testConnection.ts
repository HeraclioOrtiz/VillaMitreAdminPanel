import { apiClient } from '@/services/api';

export const testConnection = async () => {
  try {
    console.log('🔍 Testing connection to:', import.meta.env.VITE_API_BASE_URL);
    
    // Test básico de conectividad
    const response = await fetch(import.meta.env.VITE_API_BASE_URL.replace('/api', ''), {
      method: 'GET',
      headers: {
        'Bypass-Tunnel-Reminder': 'true',
        'Accept': 'application/json',
      },
    });
    
    console.log('🌐 Basic fetch test:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });
    
    // Test de endpoint específico (health check o similar)
    try {
      const healthCheck = await apiClient.get('/health');
      console.log('✅ Health check successful:', healthCheck);
      return { success: true, message: 'Connection successful' };
    } catch (healthError: any) {
      console.log('⚠️ Health check failed, trying auth endpoint:', healthError.message);
      
      // Si no hay health check, probar con endpoint de auth
      try {
        await apiClient.get('/auth/me');
        console.log('✅ Auth endpoint reachable (401 expected without token)');
        return { success: true, message: 'Connection successful (auth endpoint reachable)' };
      } catch (authError: any) {
        if (authError.response?.status === 401) {
          console.log('✅ Auth endpoint working (401 as expected)');
          return { success: true, message: 'Connection successful (401 expected)' };
        }
        throw authError;
      }
    }
  } catch (error: any) {
    console.error('❌ Connection test failed:', error);
    return { 
      success: false, 
      message: `Connection failed: ${error.message}`,
      error: error.response?.data || error.message 
    };
  }
};

// Función para probar login específicamente
export const testLogin = async (email: string, password: string) => {
  try {
    console.log('🔐 Testing login with:', { email, password: '***' });
    
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    
    console.log('✅ Login successful:', response);
    return { success: true, data: response };
  } catch (error: any) {
    console.error('❌ Login failed:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data 
    };
  }
};
