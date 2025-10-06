# 🚀 Checklist de Preparación para Deploy - Villa Mitre Admin

## ✅ Estado Actual

### 📊 Estadísticas del Proyecto:
- **33 archivos** con console.log/warn/error
- **Archivos más críticos:**
  - `services/template.ts` - 17 logs
  - `services/api.ts` - 12 logs  
  - `hooks/useExercises.ts` - 10 logs
  - `pages/professor/ProfessorDashboard.tsx` - 10 logs
  - `utils/testConnection.ts` - 10 logs

### 🔧 Configuración Actual:
- **TypeScript**: Configurado con exclusión de tests
- **Variables de Entorno**: `.env.example` presente
- **Build System**: Vite + TypeScript

---

## 📋 TAREAS PENDIENTES

### 1. 🧹 Limpieza de Código (CRÍTICO)

#### A. Servicios (Alta Prioridad):
- [ ] `services/template.ts` - Eliminar 17 console.log de debugging
- [ ] `services/api.ts` - Limpiar 12 logs (mantener solo error handling esencial)
- [ ] `services/exercise.ts` - Eliminar 7 logs de debugging

#### B. Hooks (Alta Prioridad):
- [ ] `hooks/useExercises.ts` - Limpiar 10 logs
- [ ] `hooks/useTemplates.ts` - Eliminar 9 logs
- [ ] `hooks/useAssignments.ts` - Limpiar 8 logs
- [ ] `hooks/useUsers.ts` - Eliminar 8 logs

#### C. Páginas (Media Prioridad):
- [ ] `pages/professor/ProfessorDashboard.tsx` - Eliminar 10 logs de testing
- [ ] `pages/auth/LoginPage.tsx` - Limpiar 6 logs
- [ ] `pages/admin/UserListPage.tsx` - Eliminar 5 logs
- [ ] `pages/gym/ExerciseListPage.tsx` - Limpiar 5 logs
- [ ] `pages/admin/UserDetailPage.tsx` - Eliminar 4 logs
- [ ] `App.tsx` - Limpiar 4 logs de autenticación

#### D. Componentes (Media Prioridad):
- [ ] `components/ui/ErrorBoundary.tsx` - Revisar logs de error (mantener algunos para Sentry)
- [ ] `components/admin/AssignmentManagement.tsx` - Eliminar 3 logs
- [ ] `components/professor/MyStudents.tsx` - Limpiar 2 logs

#### E. Utilidades (Baja Prioridad - Revisar):
- [ ] `utils/testConnection.ts` - **ELIMINAR ARCHIVO COMPLETO** (solo para testing)
- [ ] `utils/testing.ts` - Revisar si es necesario en producción
- [ ] `config/development.ts` - Asegurar que no se incluya en prod

---

### 2. 🔐 Variables de Entorno

#### Variables Requeridas:
```env
# API Configuration
VITE_API_BASE_URL=https://tu-dominio-produccion.com/api

# App Metadata
VITE_APP_NAME=Villa Mitre Admin
VITE_APP_VERSION=1.0.0

# Feature Flags (Opcional)
VITE_DEBUG_API=false
VITE_DEBUG_AUTH=false
```

#### Acciones:
- [ ] Crear `.env.production` con valores de producción
- [ ] Verificar que `.env` no esté en git (debe estar en `.gitignore`)
- [ ] Documentar variables requeridas en README
- [ ] Cambiar `VITE_API_BASE_URL` de localtunnel a URL real

---

### 3. ⚡ Optimizaciones

#### A. Imports y Código No Usado:
- [ ] Ejecutar linter para detectar imports no usados
- [ ] Eliminar código comentado (si existe)
- [ ] Verificar dead code

#### B. Bundle Optimization:
- [ ] Verificar lazy loading de rutas
- [ ] Revisar code splitting
- [ ] Optimizar imports de librerías grandes (ej: heroicons)

#### C. Assets:
- [ ] Optimizar imágenes (si las hay)
- [ ] Verificar fonts loading
- [ ] Revisar CSS no usado

---

### 4. 🔍 Errores de Build

#### Errores Detectados:
```
- tsconfig.app.json: ✅ CORREGIDO - Excluidos tests del build
- Archivos de tests: ✅ RESUELTO - No se incluyen en build
```

#### Pendiente:
- [ ] Ejecutar `npm run build` final y verificar warnings
- [ ] Revisar tamaño del bundle final
- [ ] Verificar que no haya errores de TypeScript

---

### 5. 📝 Documentación

#### Archivos a Crear/Actualizar:
- [ ] `README.md` - Instrucciones de deploy
- [ ] `.env.example` - ✅ Ya existe, verificar que esté completo
- [ ] `CONTRIBUTING.md` (Opcional) - Guía para desarrolladores
- [ ] Changelog inicial

---

### 6. 🔒 Seguridad

#### Checklist de Seguridad:
- [ ] Verificar que no hay API keys hardcodeadas
- [ ] Revisar que tokens no estén en el código
- [ ] Verificar `.gitignore` incluye:
  - `.env`
  - `.env.local`
  - `.env.production`
  - `node_modules/`
  - `dist/`

---

### 7. 🏗️ Build y Deploy

#### Comandos de Build:
```bash
# Instalar dependencias
npm install

# Build de producción
npm run build

# Preview del build (opcional)
npm run preview
```

#### Verificaciones Post-Build:
- [ ] Verificar carpeta `dist/` generada correctamente
- [ ] Tamaño del bundle < 1MB (ideal)
- [ ] Sin errores ni warnings críticos
- [ ] Probar localmente con `npm run preview`

---

## 🎯 PRIORIDAD DE EJECUCIÓN

### Fase 1: CRÍTICA (Ahora)
1. ✅ Excluir tests del build
2. 🔄 Limpiar logs en servicios (`services/`)
3. 🔄 Limpiar logs en hooks principales
4. 🔄 Eliminar `utils/testConnection.ts`

### Fase 2: ALTA (Antes de deploy)
1. Configurar variables de entorno de producción
2. Limpiar logs en páginas principales
3. Ejecutar build final y verificar

### Fase 3: MEDIA (Opcional antes de deploy)
1. Optimizar imports
2. Revisar bundle size
3. Documentación completa

### Fase 4: BAJA (Post-deploy)
1. Monitoreo y logging (Sentry)
2. Analytics
3. Performance monitoring

---

## 📊 Métricas de Éxito

### Build:
- ✅ Build completa sin errores
- ✅ Bundle size < 1MB
- ✅ TypeScript sin errores

### Código:
- ✅ 0 console.log en código de producción (excepto ErrorBoundary)
- ✅ 0 archivos de testing en build
- ✅ 0 TODO/FIXME sin resolver

### Configuración:
- ✅ Variables de entorno configuradas
- ✅ `.env` no en git
- ✅ API URL de producción configurada

---

## 🚨 NOTAS IMPORTANTES

### Mantener en Producción:
- `ErrorBoundary` logs de error (útiles para debugging)
- Error handling en servicios (pero sin console.log)
- Validaciones y mensajes de error al usuario

### Eliminar de Producción:
- ❌ Todos los `console.log` de debugging
- ❌ Archivos de testing
- ❌ `utils/testConnection.ts`
- ❌ Comentarios con TODOs viejos
- ❌ Código comentado no usado

---

**Última actualización:** 2025-01-06
**Estado:** 🔄 En Proceso
