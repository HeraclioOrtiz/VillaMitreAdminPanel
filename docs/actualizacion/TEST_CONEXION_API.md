# 🔌 TEST DE CONEXIÓN API

**URL Configurada:** `https://villamitre.loca.lt/api`

---

## ✅ TESTS MANUALES RÁPIDOS

### 1. Test Básico en Navegador
Abre estas URLs directamente en el navegador:

```
https://villamitre.loca.lt
```

**✅ Debería mostrar:**
- Página de Laravel o mensaje del backend
- NO debería mostrar error de "tunnel not found"

**❌ Si muestra error:**
- Localtunnel no está activo
- Subdomain incorrecto

---

### 2. Test del Endpoint API
Abre esta URL en el navegador:

```
https://villamitre.loca.lt/api
```

**✅ Debería mostrar:**
- JSON con información de la API
- O un mensaje como "Welcome to API"

**❌ Si muestra 404:**
- Backend no está configurado correctamente
- Prefijo `/api` no existe

---

### 3. Test con DevTools Console
Abre la consola del navegador (F12) y ejecuta:

```javascript
fetch('https://villamitre.loca.lt/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Bypass-Tunnel-Reminder': 'true'
  },
  body: JSON.stringify({
    dni: '12345678',
    password: 'test123'
  })
})
.then(res => {
  console.log('Status:', res.status);
  return res.json();
})
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
```

**✅ Respuesta exitosa:**
```json
{
  "token": "...",
  "user": {...}
}
```

**❌ Respuestas de error comunes:**
- **Status 422**: Credenciales incorrectas o validación fallida
- **Status 404**: Ruta no encontrada
- **Status 500**: Error del servidor
- **Network Error**: Localtunnel caído o backend apagado

---

## 🚨 PROBLEMAS COMUNES

### Problema 1: "Tunnel not found"
**Causa:** Localtunnel no está activo o subdomain incorrecto

**Solución:**
```bash
# Terminal 1: Backend
cd backend-folder
php artisan serve

# Terminal 2: Localtunnel
lt --port 8000 --subdomain villamitre
```

**Verificar:**
- La URL que devuelve localtunnel debe ser exactamente: `https://villamitre.loca.lt`
- Si es diferente, actualizar `.env`

---

### Problema 2: CORS Error
**Síntoma:** Error en consola relacionado con CORS

**Solución en Backend:**
```php
// config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

---

### Problema 3: Backend espera email en lugar de DNI
**Síntoma:** Status 422 con mensaje de validación

**Solución Temporal:**
Cambiar en `LoginPage.tsx`:

```typescript
// Si el backend espera email:
const response = await authService.login({
  email: credentials.dni + '@example.com', // Convertir DNI a email
  password: credentials.password
});
```

---

## 🔧 CHECKLIST DE VERIFICACIÓN

### Backend
- [ ] `php artisan serve` está corriendo
- [ ] Puerto 8000 activo (http://localhost:8000)
- [ ] Base de datos conectada
- [ ] Migrations ejecutadas
- [ ] Usuario de prueba existe en DB

### Localtunnel
- [ ] `lt --port 8000 --subdomain villamitre` activo
- [ ] URL correcta: `https://villamitre.loca.lt`
- [ ] Puedes acceder a la URL en el navegador

### Frontend
- [ ] `.env` tiene la URL correcta
- [ ] `npm run dev` está corriendo
- [ ] Puerto 5173 activo (http://localhost:5173)

---

## 📋 COMANDOS PARA EJECUTAR

### Terminal 1: Backend Laravel
```bash
cd F:\Laburo\Programacion\Laburo-Javi\VILLAMITRE\backend
php artisan serve
```

### Terminal 2: Localtunnel
```bash
lt --port 8000 --subdomain villamitre
```

**Esperar a ver:**
```
your url is: https://villamitre.loca.lt
```

### Terminal 3: Frontend
```bash
cd F:\Laburo\Programacion\Laburo-Javi\VILLAMITRE\vmAdmin\villa-mitre-admin
npm run dev
```

---

## 🧪 TEST PASO A PASO

### Paso 1: Verificar Backend
```bash
# En terminal del backend
curl http://localhost:8000/api

# Debería devolver JSON o alguna respuesta
```

### Paso 2: Verificar Localtunnel
```bash
# En navegador, abrir:
https://villamitre.loca.lt

# Debería mostrar la misma página que localhost:8000
```

### Paso 3: Verificar Endpoint de Login
```bash
# En terminal:
curl -X POST https://villamitre.loca.lt/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Bypass-Tunnel-Reminder: true" \
  -d '{"dni":"12345678","password":"test123"}'
```

---

## 💡 SOLUCIÓN RÁPIDA SI TODO FALLA

### Opción 1: Usar localhost directo (sin tunnel)
```env
# .env
VITE_API_BASE_URL=http://localhost:8000/api
```

Esto funcionará solo en desarrollo local.

### Opción 2: Verificar estructura del backend
```bash
# En backend
php artisan route:list | grep auth

# Debería mostrar:
# POST   api/auth/login
```

---

## 📞 INFORMACIÓN A COMPARTIR

Por favor, ejecuta estos comandos y comparte la salida:

```bash
# 1. Verificar puerto backend
netstat -ano | findstr :8000

# 2. Verificar ruta de login
php artisan route:list | findstr login

# 3. Test con curl
curl -v https://villamitre.loca.lt/api
```

Y en el navegador, intenta abrir:
1. `https://villamitre.loca.lt` (debería funcionar)
2. `https://villamitre.loca.lt/api` (debería devolver algo)
