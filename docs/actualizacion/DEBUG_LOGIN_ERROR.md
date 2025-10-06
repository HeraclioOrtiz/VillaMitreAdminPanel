# 🔍 DEBUG: Error de Login

**Fecha:** 2025-10-06 12:46  
**Error:** "API Response Error: Object" al intentar hacer login

---

## ✅ MEJORAS IMPLEMENTADAS

### 1. Logging Mejorado en API Client
- **Archivo**: `src/services/api.ts`
- **Cambios**: Logs detallados en el interceptor de errores
- **Información capturada**:
  - URL del endpoint
  - Método HTTP
  - Status code y status text
  - Mensaje de error
  - Response data completa
  - Request data enviada
  - Error completo

### 2. Logging Mejorado en Login Page
- **Archivo**: `src/pages/auth/LoginPage.tsx`
- **Cambios**: Logs antes y después del login
- **Información capturada**:
  - DNI usado para login
  - Error response completo
  - Error data
  - Mensaje de error

---

## 🔧 PASOS PARA DIAGNOSTICAR

### 1. Abrir DevTools Console
1. Abre las DevTools del navegador (F12)
2. Ve a la pestaña **Console**
3. Limpia la consola (Clear Console)

### 2. Intentar Login
1. Ingresa credenciales
2. Click en "Iniciar Sesión"
3. Observa los logs en consola

### 3. Información a Buscar

#### ✅ Logs Esperados (Exitosos):
```
🔐 API Request Debug: {...}
  url: /auth/login
  method: POST
  fullURL: https://villamitre.loca.lt/api/auth/login
  hasToken: false

🔐 Attempting login with: { dni: "..." }

✅ API Response Success: {...}
  status: 200
  dataKeys: [...]

✅ Login successful, redirecting to dashboard
```

#### ❌ Logs de Error:
```
❌ API Response Error:
  URL: /auth/login
  Method: POST
  Status: [NÚMERO]
  Status Text: [TEXTO]
  Error Message: [MENSAJE]
  Response Data: [DATOS DEL ERROR]
```

---

## 🚨 POSIBLES PROBLEMAS Y SOLUCIONES

### Problema 1: Error de Red (Network Error)
**Síntoma**: `Status: undefined`, `Error Message: "Network Error"`

**Causas posibles**:
- Backend no está corriendo
- URL incorrecta en `.env`
- Problema con localtunnel
- CORS bloqueado

**Solución**:
```bash
# 1. Verificar que backend esté corriendo
# En terminal del backend:
php artisan serve

# 2. Verificar localtunnel
# Debería estar corriendo en otra terminal:
lt --port 8000 --subdomain villamitre

# 3. Verificar URL en .env
# Debe coincidir con la URL de localtunnel
VITE_API_BASE_URL=https://villamitre.loca.lt/api
```

### Problema 2: Error 404 (Not Found)
**Síntoma**: `Status: 404`

**Causas posibles**:
- Ruta incorrecta
- Backend no tiene la ruta `/api/auth/login`
- Problema con prefijo `/api`

**Solución**:
```bash
# Verificar rutas del backend
php artisan route:list | grep login

# Debería mostrar:
# POST   api/auth/login
```

### Problema 3: Error 422 (Validation Error)
**Síntoma**: `Status: 422`

**Causas posibles**:
- Datos de validación incorrectos
- Backend espera `email` en lugar de `dni`
- Formato de datos incorrecto

**Solución**:
```typescript
// Verificar en Response Data qué campos requiere
// Puede que el backend espere:
{
  email: "...",
  password: "..."
}
// En lugar de:
{
  dni: "...",
  password: "..."
}
```

### Problema 4: Error 500 (Server Error)
**Síntoma**: `Status: 500`

**Causas posibles**:
- Error en el backend
- Base de datos no conectada
- Configuración faltante en backend

**Solución**:
```bash
# Revisar logs del backend
# Verificar .env del backend
# Verificar conexión a DB
```

### Problema 5: Error CORS
**Síntoma**: Error relacionado con CORS en consola

**Solución**:
```php
// En backend: config/cors.php
'paths' => ['api/*'],
'allowed_origins' => ['*'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

---

## 🔍 INFORMACIÓN NECESARIA PARA CONTINUAR

Por favor, intenta hacer login nuevamente y copia toda la información de la consola:

### 1. Request Information
```
🔐 API Request Debug:
  [COPIAR TODO EL OBJETO]
```

### 2. Error Information
```
❌ API Response Error:
  [COPIAR TODO EL LOG]
```

### 3. Captura de Pantalla
- Captura la pestaña Console completa
- Captura la pestaña Network (filtrar por "login")

---

## 📋 CHECKLIST RÁPIDO

- [ ] Backend está corriendo (`php artisan serve`)
- [ ] Localtunnel está activo
- [ ] URL en `.env` es correcta
- [ ] Database está conectada
- [ ] Migrations ejecutadas
- [ ] Ruta `/api/auth/login` existe en backend
- [ ] CORS configurado correctamente
- [ ] Credenciales de test existen en la DB

---

## 🛠️ PRÓXIMOS PASOS

1. **Intenta login nuevamente**
2. **Copia TODOS los logs de la consola**
3. **Comparte la información**
4. **Te ayudaré a identificar el problema exacto**

---

## 📞 COMANDOS ÚTILES

```bash
# Backend
php artisan serve
php artisan route:list
php artisan migrate:fresh --seed

# Frontend
npm run dev

# Localtunnel
lt --port 8000 --subdomain villamitre
```
