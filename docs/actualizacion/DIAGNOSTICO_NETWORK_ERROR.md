# 🔍 DIAGNÓSTICO: Network Error en Login

**Error detectado:** Network Error con Status undefined
**Fecha:** 2025-10-06 13:07

---

## 🚨 PROBLEMA IDENTIFICADO

```
❌ Network Error
Status: undefined
Response: undefined
```

**Esto significa:** La petición no llega al servidor. Problema de conectividad.

---

## ✅ SOLUCIÓN PASO A PASO

### **1. VERIFICAR BACKEND**

Abre una terminal y ejecuta:

```bash
cd F:\Laburo\Programacion\Laburo-Javi\VILLAMITRE\backend
php artisan serve
```

**Debería mostrar:**
```
Laravel development server started: http://127.0.0.1:8000
```

**✅ Si lo ves:** Backend funcionando
**❌ Si no:** Ejecuta el comando y déjalo corriendo

---

### **2. VERIFICAR LOCALTUNNEL**

Abre **OTRA terminal** (deja el backend corriendo) y ejecuta:

```bash
lt --port 8000 --subdomain villamitre
```

**Debería mostrar:**
```
your url is: https://villamitre.loca.lt
```

**✅ Si lo ves:** Tunnel funcionando
**❌ Si dice "subdomain unavailable":** Prueba sin subdomain:

```bash
lt --port 8000
```

Te dará una URL diferente. **Copia esa URL** y actualiza el `.env`:

```env
VITE_API_BASE_URL=https://tu-nueva-url.loca.lt/api
```

---

### **3. VERIFICAR CONEXIÓN MANUAL**

Abre tu navegador y ve a:

```
https://villamitre.loca.lt
```

**✅ Si ves la página de Laravel:** Tunnel funciona
**❌ Si ves error "Tunnel not found":** Localtunnel caído, reinícialo

---

### **4. VERIFICAR ENDPOINT API**

Abre en el navegador:

```
https://villamitre.loca.lt/api
```

**✅ Si ves JSON o mensaje:** API accesible
**❌ Si ves 404:** Verifica ruta `/api` en backend

---

### **5. TEST CON CURL (OPCIONAL)**

En terminal, ejecuta:

```bash
curl -X POST https://villamitre.loca.lt/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Bypass-Tunnel-Reminder: true" \
  -d '{"dni":"22222222","password":"profesor123"}'
```

**✅ Si ves respuesta JSON:** Backend funcionando
**❌ Si ves error:** Problema con backend o ruta

---

## 🔧 PROBLEMA COMÚN: LOCALTUNNEL CAÍDO

Si localtunnel se cae frecuentemente:

### **Solución A: Usar localhost directo (solo desarrollo)**

```env
# .env
VITE_API_BASE_URL=http://localhost:8000/api
```

**⚠️ Importante:** Esto solo funciona si frontend y backend están en la misma máquina.

### **Solución B: Usar ngrok (alternativa)**

Si localtunnel es inestable:

```bash
# Instalar ngrok: https://ngrok.com/
ngrok http 8000
```

Copia la URL que te da y actualiza `.env`:

```env
VITE_API_BASE_URL=https://tu-url.ngrok-free.app/api
```

---

## 📋 CHECKLIST RÁPIDO

Verifica estos 4 puntos:

- [ ] **Backend corriendo:** `php artisan serve` activo
- [ ] **Localtunnel activo:** `lt --port 8000 --subdomain villamitre` corriendo
- [ ] **URL correcta:** Abre `https://villamitre.loca.lt` en navegador
- [ ] **Frontend reiniciado:** `npm run dev` después de cambiar `.env`

---

## 🎯 DESPUÉS DE RESOLVER

Una vez que todos los servicios estén activos:

1. **Reinicia el frontend:** Ctrl+C y `npm run dev`
2. **Limpia cache del navegador:** Ctrl+Shift+R
3. **Intenta login nuevamente**

**Deberías ver en consola:**
```
🔐 API Request Debug: {url: /auth/login, method: POST, ...}
✅ API Response Success: {status: 200, ...}
```

---

## 💡 DEBUGGING ADICIONAL

Si el problema persiste, verifica:

### **CORS en Backend**

En `config/cors.php`:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

### **Rutas en Backend**

```bash
php artisan route:list | grep login
```

Debe mostrar:
```
POST   api/auth/login
```

---

## 📞 SIGUIENTE PASO

Ejecuta los pasos 1, 2 y 3 en orden y comparte:

1. ✅ o ❌ Backend corriendo
2. ✅ o ❌ Localtunnel activo
3. ✅ o ❌ URL accesible en navegador

Con esa información sabré exactamente qué ajustar.
