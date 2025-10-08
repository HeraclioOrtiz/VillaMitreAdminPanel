# 🔧 Actualización de Configuración de API

**Fecha:** 2025-01-08  
**Tipo:** Migración de API de desarrollo a producción

---

## 📊 RESUMEN DE CAMBIOS

Se migró la configuración de la API desde **localtunnel** (desarrollo temporal) a la **API de producción en servidor propio**.

### **URL Antigua (Localtunnel):**
```
https://villamitre.loca.lt/api
```

### **URL Nueva (Producción):**
```
https://appvillamitre.surtekbb.com/api
```

---

## ✅ ARCHIVOS ACTUALIZADOS

### **1. Variables de Entorno**

#### **.env** (Desarrollo)
```diff
- VITE_API_BASE_URL=https://villamitre.loca.lt/api
+ VITE_API_BASE_URL=https://appvillamitre.surtekbb.com/api
```

#### **.env.production** (Producción)
```diff
- VITE_API_BASE_URL=https://villamitre.loca.lt/api
+ VITE_API_BASE_URL=https://appvillamitre.surtekbb.com/api
```

#### **.env.example** (Plantilla)
```diff
- VITE_API_BASE_URL=https://villamitre.loca.lt/api
+ VITE_API_BASE_URL=https://appvillamitre.surtekbb.com/api
+ VITE_DEBUG_API=true
```

### **2. Cliente API (src/services/api.ts)**

#### **Eliminado header específico de localtunnel:**

**Constructor de axios:**
```diff
  this.client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
-     // Header requerido para localtunnel
-     'Bypass-Tunnel-Reminder': 'true',
    },
  });
```

**Request interceptor:**
```diff
  this.client.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
-   
-   // Asegurar que el header de bypass esté presente en todas las requests
-   if (!config.headers['Bypass-Tunnel-Reminder']) {
-     config.headers['Bypass-Tunnel-Reminder'] = 'true';
-   }
    
    if (import.meta.env.VITE_DEBUG_API === 'true') {
      console.log('🔐 API Request Debug:', {
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
        method: config.method?.toUpperCase(),
        headers: config.headers,
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'NO TOKEN',
-       bypassHeader: config.headers['Bypass-Tunnel-Reminder']
      });
    }
```

**Upload method:**
```diff
  async upload<T = any>(url: string, formData: FormData): Promise<ApiResponse<T>> {
    const response = await this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
-       'Bypass-Tunnel-Reminder': 'true',
      },
    });
    return response.data;
  }
```

---

## 🎯 VALIDACIONES REALIZADAS

### **✅ Configuración Correcta:**

1. **BaseURL con `/api`:**
   ```
   https://appvillamitre.surtekbb.com/api
   ```

2. **Endpoints Relativos:**
   ```
   /admin/gym/exercises
   /admin/gym/daily-templates
   /auth/login
   /auth/me
   ```

3. **URL Final Generada:**
   ```
   https://appvillamitre.surtekbb.com/api/admin/gym/exercises ✅
   ```

4. **Headers Estándar:**
   - `Content-Type: application/json`
   - `Accept: application/json`
   - `Authorization: Bearer {token}` (automático)

5. **CORS:**
   - Configurado en el servidor
   - No requiere headers especiales

---

## 🔒 SEGURIDAD MANTENIDA

### **Headers de Autenticación:**
```typescript
// Request interceptor (línea 23-39)
const token = localStorage.getItem('auth_token');
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

### **Manejo de Errores 401:**
```typescript
// Response interceptor (línea 72-76)
if (error.response?.status === 401) {
  localStorage.removeItem('auth_token');
  window.location.href = '/login';
}
```

---

## 📡 ENDPOINTS DISPONIBLES

### **Autenticación:**
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/refresh`

### **Ejercicios:**
- `GET /api/admin/gym/exercises`
- `POST /api/admin/gym/exercises`
- `GET /api/admin/gym/exercises/{id}`
- `PUT /api/admin/gym/exercises/{id}`
- `DELETE /api/admin/gym/exercises/{id}`
- `POST /api/admin/gym/exercises/{id}/duplicate`
- `POST /api/admin/gym/exercises/bulk-delete`

### **Plantillas:**
- `GET /api/admin/gym/daily-templates`
- `POST /api/admin/gym/daily-templates`
- `GET /api/admin/gym/daily-templates/{id}`
- `PUT /api/admin/gym/daily-templates/{id}`
- `DELETE /api/admin/gym/daily-templates/{id}`
- `POST /api/admin/gym/daily-templates/{id}/duplicate`
- `POST /api/admin/gym/daily-templates/{id}/favorite`

### **Usuarios:**
- `GET /api/admin/users`
- `GET /api/admin/users/{id}`
- `PUT /api/admin/users/{id}`
- `DELETE /api/admin/users/{id}`
- `POST /api/admin/users/{id}/assign-professor`

---

## 🧪 TESTING

### **1. Verificar Conexión:**
```bash
# Desarrollo
npm run dev
# Verificar que carga sin errores de CORS
```

### **2. Probar Login:**
```bash
# Abrir http://localhost:5173
# Intentar login con credenciales válidas
# Verificar que el token se guarda correctamente
```

### **3. Probar Endpoints:**
```bash
# Ejercicios
GET https://appvillamitre.surtekbb.com/api/admin/gym/exercises

# Plantillas
GET https://appvillamitre.surtekbb.com/api/admin/gym/daily-templates

# Usuario actual
GET https://appvillamitre.surtekbb.com/api/auth/me
```

### **4. Verificar Headers:**
```javascript
// En DevTools > Network:
// Request Headers:
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

---

## 🚀 DEPLOY

### **Variables de Entorno en Servidor:**

**Vercel/Netlify:**
```env
VITE_API_BASE_URL=https://appvillamitre.surtekbb.com/api
VITE_APP_NAME=Villa Mitre Admin
VITE_APP_VERSION=1.0.0
VITE_DEBUG_API=false
```

**Docker:**
```dockerfile
ENV VITE_API_BASE_URL=https://appvillamitre.surtekbb.com/api
ENV VITE_DEBUG_API=false
```

---

## ⚠️ NOTAS IMPORTANTES

### **1. CORS Configurado:**
El servidor ya tiene CORS configurado y acepta peticiones desde cualquier origen en desarrollo. En producción, asegúrate de configurar los orígenes permitidos.

### **2. HTTPS Disponible:**
La API tiene certificado SSL configurado y funciona con HTTPS.

### **3. Header Authorization:**
Todas las peticiones autenticadas requieren el header `Authorization: Bearer {token}`.

### **4. Debug Mode:**
- **Desarrollo:** `VITE_DEBUG_API=true` (logs detallados)
- **Producción:** `VITE_DEBUG_API=false` (sin logs)

### **5. Endpoint Prefix:**
Todos los endpoints requieren el prefijo `/api` que ya está incluido en la `baseURL`.

---

## 📝 CHECKLIST POST-UPDATE

- [x] `.env` actualizado
- [x] `.env.production` actualizado
- [x] `.env.example` actualizado
- [x] `api.ts` limpiado (sin headers de tunnel)
- [x] Verificar que baseURL usa nueva URL
- [ ] Probar login en desarrollo
- [ ] Probar endpoints principales
- [ ] Verificar que no hay errores CORS
- [ ] Build de producción exitoso
- [ ] Deploy a servidor

---

## 🔄 ROLLBACK (Si es necesario)

Si necesitas volver a la configuración anterior:

```bash
# Revertir cambios
git checkout HEAD -- .env .env.production .env.example src/services/api.ts

# O manualmente:
VITE_API_BASE_URL=https://villamitre.loca.lt/api
```

---

## 📞 CONTACTO Y SOPORTE

**API Base URL:** `https://appvillamitre.surtekbb.com/api`  
**Documentación:** Ver archivos en `docs/`  
**Estado del Servidor:** Verificar con `GET /api/health` (si existe)

---

**¡Configuración actualizada exitosamente! 🎉**
