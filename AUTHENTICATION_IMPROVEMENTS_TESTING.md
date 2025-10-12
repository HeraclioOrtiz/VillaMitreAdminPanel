# 🧪 GUÍA DE TESTING - MEJORAS DE AUTENTICACIÓN

**Fecha:** 11/01/2025  
**Estado:** ✅ IMPLEMENTADO - Listo para testing

---

## 📋 RESUMEN DE IMPLEMENTACIÓN

Se implementaron **7 mejoras críticas** al sistema de autenticación:

### **Archivos Creados (4):**
1. `src/components/auth/SessionExpiredModal.tsx` - Modal informativo
2. `src/components/auth/AuthErrorBoundary.tsx` - Error boundary global
3. `src/components/auth/ProtectedRoute.tsx` - Guard mejorado
4. `src/components/auth/index.ts` - Exports centralizados

### **Archivos Modificados (5):**
1. `src/services/api.ts` - Headers anti-caché + navegación por eventos
2. `src/hooks/useAuth.tsx` - Limpieza completa + eventos
3. `src/pages/auth/LoginPage.tsx` - Mejor manejo de errores
4. `src/components/auth/RoleProtectedRoute.tsx` - Loading mejorado
5. `src/App.tsx` - Integración ErrorBoundary

---

## ✅ CHECKLIST DE TESTING

### **1. LOGIN BÁSICO**

#### **Caso 1.1: Login Exitoso**
```
Pasos:
1. Ir a /login
2. Ingresar DNI válido
3. Ingresar contraseña válida
4. Click en "Iniciar Sesión"

Resultado esperado:
✓ Redirección a /dashboard
✓ Usuario autenticado
✓ Token guardado en localStorage
✓ Sin errores en consola
✓ Navegación suave (sin recarga de página)
```

#### **Caso 1.2: Credenciales Incorrectas**
```
Pasos:
1. Ir a /login
2. Ingresar credenciales incorrectas
3. Click en "Iniciar Sesión"

Resultado esperado:
✓ Mensaje de error visible
✓ Error: "Error al iniciar sesión..."
✓ localStorage limpio (sin token)
✓ Usuario permanece en /login
✓ Puede intentar de nuevo
✓ Botón "volver" funciona correctamente
```

#### **Caso 1.3: Redirección Post-Login**
```
Pasos:
1. Intentar acceder a /gym/exercises (sin autenticar)
2. Ser redirigido a /login
3. Iniciar sesión correctamente

Resultado esperado:
✓ Después del login, redirige a /gym/exercises
✓ sessionStorage tiene 'redirectAfterLogin'
✓ Ruta intentada se recupera
✓ Usuario llega a donde quería ir
```

---

### **2. SESIÓN EXPIRADA**

#### **Caso 2.1: Token Expirado Durante Navegación**
```
Pasos:
1. Login exitoso
2. Esperar que token expire (o simular con token inválido)
3. Hacer una petición al backend (ej: cargar ejercicios)

Resultado esperado:
✓ Interceptor detecta 401
✓ Modal "Sesión Expirada" aparece
✓ Mensaje claro y profesional
✓ localStorage limpio
✓ React Query cache limpio
✓ Click en "Ir a Login" navega a /login
✓ NO hay window.location.href (hard redirect)
✓ Botón "volver" funciona
```

#### **Caso 2.2: Token Inválido al Iniciar**
```
Pasos:
1. Poner token inválido en localStorage manualmente
2. Recargar la aplicación
3. Intentar acceder a ruta protegida

Resultado esperado:
✓ initializeAuth detecta token inválido
✓ Token se limpia automáticamente
✓ Redirección a /login
✓ Sin pantalla blanca
✓ Loading state visible durante verificación
```

---

### **3. LOGOUT**

#### **Caso 3.1: Logout Manual**
```
Pasos:
1. Login exitoso
2. Navegar por la aplicación
3. Click en botón "Cerrar Sesión"

Resultado esperado:
✓ localStorage limpio (auth_token, auth_user)
✓ sessionStorage limpio (redirectAfterLogin)
✓ React Query cache limpio
✓ Usuario = null, Token = null
✓ Redirección a /login con replace: true
✓ No puede usar "volver" para acceder a páginas protegidas
✓ Navegación suave (sin recarga)
```

#### **Caso 3.2: Logout con Error de Backend**
```
Pasos:
1. Login exitoso
2. Simular error en /auth/logout (desconectar red)
3. Click en "Cerrar Sesión"

Resultado esperado:
✓ Continúa con limpieza local aunque falle backend
✓ localStorage limpio
✓ Cache limpio
✓ Redirección a /login
✓ Usuario deslogueado localmente
```

---

### **4. NAVEGACIÓN Y BOTÓN VOLVER**

#### **Caso 4.1: Botón Volver Después de Login**
```
Pasos:
1. Ir a /login
2. Login exitoso → redirige a /dashboard
3. Presionar botón "volver" del navegador

Resultado esperado:
✓ NO vuelve a /login (replace: true funcionó)
✓ Permanece en /dashboard o va a ruta anterior válida
✓ Sin loops de redirección
✓ Sin pantalla blanca
```

#### **Caso 4.2: Botón Volver Durante Navegación Normal**
```
Pasos:
1. Login exitoso
2. /dashboard → /gym/exercises → /gym/exercises/create
3. Presionar "volver" varias veces

Resultado esperado:
✓ Navegación normal hacia atrás
✓ Sin recargas de página
✓ Historial preservado correctamente
✓ Estados de React preservados
```

#### **Caso 4.3: Botón Volver Después de Sesión Expirada**
```
Pasos:
1. Login exitoso
2. Navegar a /gym/exercises
3. Token expira → Modal aparece
4. Click en "Ir a Login"
5. Presionar "volver"

Resultado esperado:
✓ No vuelve a página protegida
✓ ProtectedRoute redirige a /login
✓ Sin acceso no autorizado
✓ Sin pantalla blanca
```

---

### **5. CACHÉ DEL NAVEGADOR**

#### **Caso 5.1: Headers Anti-Caché**
```
Verificación:
1. Login exitoso
2. Abrir DevTools → Network tab
3. Ver headers de requests

Resultado esperado:
✓ Headers presentes en todas las requests:
  - Cache-Control: no-cache, no-store, must-revalidate
  - Pragma: no-cache
  - Expires: 0
✓ Respuestas no se cachean
✓ Botón "volver" no muestra datos cacheados
```

#### **Caso 5.2: React Query Cache Limpio en Logout**
```
Pasos:
1. Login exitoso
2. Cargar datos (ejercicios, plantillas, usuarios)
3. Ver datos en React Query DevTools
4. Logout

Resultado esperado:
✓ React Query cache completamente limpio
✓ No hay datos residuales
✓ queryClient.clear() ejecutado
✓ Próximo login empieza con cache vacío
```

---

### **6. ESTADOS DE CARGA**

#### **Caso 6.1: Loading Durante Verificación de Auth**
```
Pasos:
1. Recargar aplicación con token válido
2. Observar mientras initializeAuth se ejecuta

Resultado esperado:
✓ Loading spinner visible
✓ Mensaje "Verificando sesión..."
✓ Sin flash de contenido no autorizado
✓ Transición suave a contenido autenticado
✓ Sin pantalla blanca
```

#### **Caso 6.2: Loading en ProtectedRoute**
```
Pasos:
1. Acceder a ruta protegida mientras isLoading = true

Resultado esperado:
✓ Loading spinner visible
✓ Mensaje "Verificando permisos..." o "Redirigiendo..."
✓ No renderiza contenido antes de verificar
✓ Sin flash de contenido
```

---

### **7. ERROR BOUNDARY**

#### **Caso 7.1: Error de Auth No Manejado**
```
Simulación:
1. Forzar error en AuthProvider (throw en useEffect)
2. Observar comportamiento

Resultado esperado:
✓ ErrorBoundary captura el error
✓ Página de error amigable visible
✓ Opciones de recuperación:
  - "Intentar de Nuevo"
  - "Volver al Inicio de Sesión"
✓ No pantalla blanca
✓ Detalles técnicos visibles en modo desarrollo
```

#### **Caso 7.2: Error 401 en Componente**
```
Simulación:
1. Component hace fetch y recibe 401
2. Error no manejado en catch

Resultado esperado:
✓ ErrorBoundary detecta "401" o "unauthorized"
✓ Limpia auth_token
✓ Emite evento 'auth:error'
✓ AuthProvider muestra modal de sesión expirada
✓ Usuario puede volver a login
```

---

### **8. MÚLTIPLES TABS**

#### **Caso 8.1: Login en Tab 1, Logout en Tab 2**
```
Pasos:
1. Abrir 2 tabs de la aplicación
2. Login en Tab 1
3. Logout en Tab 2
4. Volver a Tab 1

Resultado esperado:
✓ Tab 1 detecta que token fue removido
✓ Próxima request en Tab 1 recibe 401
✓ Modal de sesión expirada aparece
✓ Usuario redirigido a login en Tab 1
```

#### **Caso 8.2: Token Expira con Múltiples Tabs**
```
Pasos:
1. Abrir 3 tabs de la aplicación
2. Login en todas
3. Esperar expiración de token
4. Hacer action en cualquier tab

Resultado esperado:
✓ Tab que hace action recibe 401
✓ Modal aparece en ese tab
✓ Otras tabs también detectarán en próxima action
✓ Todas eventualmente redirigen a login
```

---

### **9. MODAL DE SESIÓN EXPIRADA**

#### **Caso 9.1: Variante "Expired"**
```
Trigger: Token expirado por inactividad

Resultado esperado:
✓ Ícono: ClockIcon (reloj) amarillo
✓ Título: "Sesión Expirada"
✓ Mensaje: "...expirado por inactividad..."
✓ Botón: "Ir a Iniciar Sesión"
✓ Información de seguridad visible
```

#### **Caso 9.2: Variante "Unauthorized"**
```
Trigger: 401 durante navegación

Resultado esperado:
✓ Ícono: ExclamationTriangle rojo
✓ Título: "Acceso No Autorizado"
✓ Mensaje: "...no tienes permisos..."
✓ Botón funciona correctamente
```

#### **Caso 9.3: Variante "Invalid"**
```
Trigger: Token inválido o revocado

Resultado esperado:
✓ Ícono: ExclamationTriangle naranja
✓ Título: "Sesión Inválida"
✓ Mensaje: "...inválida o revocada..."
✓ Overlay no permite cerrar sin action
```

---

### **10. INTEGRACIÓN COMPLETA**

#### **Caso 10.1: Flujo Completo de Usuario**
```
Pasos:
1. Ir a / (raíz)
2. Redirige a /gym/dashboard
3. ProtectedRoute redirige a /login
4. Login exitoso
5. Redirige a /gym/dashboard
6. Navegar a /gym/exercises
7. Crear ejercicio
8. Token expira
9. Guardar ejercicio (401)
10. Modal aparece
11. Volver a login
12. Login nuevamente
13. Continuar trabajo

Resultado esperado:
✓ Todo flujo funciona correctamente
✓ Sin recargas inesperadas
✓ Sin pantallas blancas
✓ Navegación suave en todo momento
✓ Datos no se pierden innecesariamente
✓ Experiencia de usuario profesional
```

---

## 🐛 REGRESIÓN: QUÉ NO DEBE ROMPERSE

### **Funcionalidades Existentes:**
- ✓ CRUD de ejercicios
- ✓ CRUD de plantillas
- ✓ Sistema de asignaciones
- ✓ Dashboard de profesor
- ✓ Dashboard de admin
- ✓ Navegación sidebar
- ✓ Toast notifications
- ✓ React Query caching (excepto en logout)

### **Verificar NO Afectado:**
- ✓ Performance de la app
- ✓ Velocidad de navegación
- ✓ Carga de datos
- ✓ Optimistic updates
- ✓ Formularios y validaciones

---

## 🔍 TESTING MANUAL - CHECKLIST RÁPIDO

### **CRÍTICO (Debe funcionar):**
- [ ] Login con credenciales correctas
- [ ] Login con credenciales incorrectas
- [ ] Botón "volver" después de login
- [ ] Logout limpia todo
- [ ] Sesión expirada muestra modal
- [ ] Modal permite volver a login
- [ ] ProtectedRoute previene acceso sin auth

### **IMPORTANTE (Debe funcionar bien):**
- [ ] Redirección post-login a ruta intentada
- [ ] Headers anti-caché presentes
- [ ] React Query cache se limpia
- [ ] Loading states visibles
- [ ] Sin pantallas blancas
- [ ] ErrorBoundary captura errores

### **DESEABLE (UX mejorado):**
- [ ] Mensajes de error claros
- [ ] Transiciones suaves
- [ ] Múltiples tabs funcionan
- [ ] Token inválido se detecta al inicio
- [ ] Modal con diseño profesional

---

## 📊 MÉTRICAS DE ÉXITO

| Métrica | Antes | Después | Objetivo |
|---------|-------|---------|----------|
| Hard redirects (window.location) | ✗ Sí | ✓ No | 0 |
| Pantallas blancas | ✗ Frecuentes | ✓ Ninguna | 0 |
| Botón volver funciona | ✗ No | ✓ Sí | 100% |
| Cache limpio en logout | ✗ No | ✓ Sí | 100% |
| Modal informativo | ✗ No | ✓ Sí | 100% |
| Headers anti-caché | ✗ No | ✓ Sí | 100% |
| ErrorBoundary | ✗ No | ✓ Sí | 100% |
| UX profesional | ✗ Abrupta | ✓ Suave | Excelente |

---

## 🚀 TESTING AUTOMATIZADO (Futuro)

### **Tests Unitarios Sugeridos:**
```typescript
// authService.test.ts
describe('authService', () => {
  test('isTokenValid detecta token expirado', () => {});
  test('removeToken limpia localStorage', () => {});
});

// useAuth.test.tsx
describe('useAuth', () => {
  test('logout limpia todo', () => {});
  test('evento auth:unauthorized limpia estado', () => {});
  test('modal aparece en 401', () => {});
});

// api.test.ts
describe('apiClient', () => {
  test('headers anti-caché presentes', () => {});
  test('401 emite evento auth:unauthorized', () => {});
  test('no hace hard redirect', () => {});
});

// ProtectedRoute.test.tsx
describe('ProtectedRoute', () => {
  test('muestra loading mientras verifica', () => {});
  test('redirige a login si no autenticado', () => {});
  test('guarda ruta intentada', () => {});
});
```

### **Tests E2E Sugeridos (Playwright/Cypress):**
```typescript
// auth-flow.e2e.ts
test('flujo completo de autenticación', async () => {
  // Login → Navegar → Expirar → Relogin
});

test('botón volver funciona correctamente', async () => {
  // Varias navegaciones con back button
});

test('logout limpia cache completamente', async () => {
  // Verificar storage y cache
});
```

---

## 📝 NOTAS PARA EL TESTER

### **Herramientas Útiles:**
- **Chrome DevTools:**
  - Application → Storage → Ver localStorage/sessionStorage
  - Network → Ver headers de requests
  - React DevTools → Ver estado de componentes
  
- **React Query DevTools:**
  - Ver cache de queries
  - Verificar invalidaciones
  - Comprobar limpieza en logout

- **Console:**
  - Buscar errores no manejados
  - Ver logs de auth (🔐 Auth:...)
  - Verificar warnings

### **Simular Escenarios:**
```javascript
// En console del navegador:

// Simular token expirado
localStorage.setItem('auth_token', 'invalid.token.here');

// Simular 401
// (hacer request que falle)

// Limpiar storage
localStorage.clear();
sessionStorage.clear();

// Ver eventos
window.addEventListener('auth:unauthorized', (e) => {
  console.log('Evento recibido:', e);
});
```

---

## ✅ CRITERIO DE ACEPTACIÓN

**El sistema pasa testing si:**
1. ✓ Todos los casos CRÍTICOS funcionan
2. ✓ Al menos 90% de IMPORTANTE funciona
3. ✓ No hay regresiones en funcionalidad existente
4. ✓ Botón "volver" siempre funciona
5. ✓ No hay pantallas blancas
6. ✓ UX es mejor que antes

**El sistema está listo para producción si:**
- ✓ 100% de CRÍTICO + IMPORTANTE
- ✓ 80%+ de DESEABLE
- ✓ Sin regresiones
- ✓ Performance no afectado
- ✓ Código limpio y sin warnings

---

**Documento preparado para testing exhaustivo del sistema de autenticación mejorado.**

**Próximo paso:** Ejecutar checklist completo y reportar issues encontrados.
