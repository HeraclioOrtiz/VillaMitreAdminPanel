import React, { useState } from 'react';
import { Button } from '@/components/ui';

export default function TestApiPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test: string, success: boolean, data: any) => {
    setResults(prev => [...prev, {
      test,
      success,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://villamitre.loca.lt/api';
  const baseUrl = apiBaseUrl.replace('/api', ''); // https://villamitre.loca.lt

  const testBaseUrl = async () => {
    setLoading(true);
    try {
      const response = await fetch(baseUrl, {
        headers: {
          'Bypass-Tunnel-Reminder': 'true'
        }
      });
      addResult(`Base URL (${baseUrl})`, response.ok, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: baseUrl
      });
    } catch (error: any) {
      addResult('Base URL', false, { error: error.message, url: baseUrl });
    }
    setLoading(false);
  };

  const testApiEndpoint = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiBaseUrl, {
        headers: {
          'Accept': 'application/json',
          'Bypass-Tunnel-Reminder': 'true'
        }
      });
      const data = await response.json().catch(() => ({ text: 'No JSON response' }));
      addResult(`API Endpoint (${apiBaseUrl})`, response.ok, {
        status: response.status,
        statusText: response.statusText,
        data: data,
        url: apiBaseUrl
      });
    } catch (error: any) {
      addResult('API Endpoint', false, { error: error.message, url: apiBaseUrl });
    }
    setLoading(false);
  };

  const testLoginEndpoint = async () => {
    setLoading(true);
    try {
      const loginUrl = `${apiBaseUrl}/auth/login`;
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Bypass-Tunnel-Reminder': 'true'
        },
        body: JSON.stringify({
          dni: '12345678',
          password: 'wrong-password'
        })
      });
      const data = await response.json().catch(() => ({ text: 'No JSON response' }));
      addResult(`Login Endpoint (${loginUrl})`, true, {
        status: response.status,
        statusText: response.statusText,
        data: data,
        url: loginUrl,
        note: 'Credentials incorrectas es OK - solo testeando conectividad'
      });
    } catch (error: any) {
      addResult('Login Endpoint', false, { 
        error: error.message, 
        url: `${apiBaseUrl}/auth/login` 
      });
    }
    setLoading(false);
  };

  const testWithApiClient = async () => {
    setLoading(true);
    try {
      const { apiClient } = await import('@/services/api');
      const response = await apiClient.get('/');
      addResult('Via ApiClient (GET /)', true, response);
    } catch (error: any) {
      addResult('Via ApiClient', false, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
    setLoading(false);
  };

  const runAllTests = async () => {
    setResults([]);
    await testBaseUrl();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testApiEndpoint();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testLoginEndpoint();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testWithApiClient();
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🔌 Test de Conexión API
          </h1>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              📍 Configuración Actual
            </h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Base URL:</strong> {import.meta.env.VITE_API_BASE_URL}</p>
              <p><strong>Debug Mode:</strong> {import.meta.env.VITE_DEBUG_API}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button
              onClick={testBaseUrl}
              disabled={loading}
              variant="secondary"
            >
              Test Base URL
            </Button>
            <Button
              onClick={testApiEndpoint}
              disabled={loading}
              variant="secondary"
            >
              Test API Endpoint
            </Button>
            <Button
              onClick={testLoginEndpoint}
              disabled={loading}
              variant="secondary"
            >
              Test Login Endpoint
            </Button>
            <Button
              onClick={testWithApiClient}
              disabled={loading}
              variant="secondary"
            >
              Test via ApiClient
            </Button>
          </div>

          <div className="flex gap-4 mb-6">
            <Button
              onClick={runAllTests}
              disabled={loading}
              className="flex-1"
            >
              ▶️ Ejecutar Todos los Tests
            </Button>
            <Button
              onClick={clearResults}
              disabled={loading}
              variant="secondary"
            >
              🗑️ Limpiar
            </Button>
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-villa-mitre-600"></div>
              <p className="mt-2 text-gray-600">Ejecutando test...</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Resultados:</h2>
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      result.success
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-semibold ${
                        result.success ? 'text-green-900' : 'text-red-900'
                      }`}>
                        {result.success ? '✅' : '❌'} {result.test}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {result.timestamp}
                      </span>
                    </div>
                    <pre className={`text-xs overflow-x-auto p-3 rounded ${
                      result.success ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>

              {/* Resumen */}
              <div className="mt-6 bg-gray-100 rounded-lg p-4">
                <h3 className="font-semibold mb-2">📊 Resumen</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-600 font-semibold">
                      ✅ Exitosos: {results.filter(r => r.success).length}
                    </span>
                  </div>
                  <div>
                    <span className="text-red-600 font-semibold">
                      ❌ Fallidos: {results.filter(r => !r.success).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instrucciones */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">
              💡 ¿Qué significan los resultados?
            </h3>
            <ul className="text-sm text-yellow-800 space-y-2">
              <li>
                <strong>✅ Base URL OK:</strong> Localtunnel está funcionando
              </li>
              <li>
                <strong>✅ API Endpoint OK:</strong> Backend responde en /api
              </li>
              <li>
                <strong>✅ Login Endpoint OK (incluso con error 422):</strong> El endpoint existe
              </li>
              <li>
                <strong>❌ Network Error:</strong> Localtunnel caído o backend apagado
              </li>
              <li>
                <strong>❌ 404:</strong> Ruta no existe en el backend
              </li>
              <li>
                <strong>❌ 500:</strong> Error del servidor backend
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
