# 🏛️ Villa Mitre - Panel de Administración

Panel de administración web para el ecosistema Villa Mitre, que incluye dos módulos principales:

1. **Panel de Gimnasio** - Para profesores de educación física
2. **Panel Villa Mitre** - Para administradores del club

## 🚀 **Inicio Rápido**

### **Prerrequisitos**
- Node.js 18+ 
- npm o yarn
- Backend Laravel corriendo en `http://localhost:8000`

### **Instalación**
```bash
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
- **Secundario**: Gris neutro (`gray-600`: #6b7280)
- **Estados**: Verde éxito, amarillo advertencia, rojo error

### **Componentes Base Disponibles**
- `Button` - Variants: primary, secondary, danger, ghost
- `Input` - Con validación y estados de error
- `Card` - Contenedores de contenido con header/footer

## 🔐 **Autenticación**

El sistema utiliza autenticación basada en tokens Bearer:

```typescript
// Login
const response = await authService.login({ dni, password });

// Las requests automáticamente incluyen el token
const users = await apiClient.get('/admin/users');
```

## 📱 **Responsive Design**

- **Mobile** (< 768px): Stack vertical, menú hamburguesa
- **Tablet** (768px - 1024px): Sidebar colapsable  
- **Desktop** (> 1024px): Sidebar fijo, múltiples columnas

## 🚀 **Scripts Disponibles**

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linting con ESLint
npm run type-check   # Verificación de tipos TypeScript
```

## 🔧 **Configuración**

### **Variables de Entorno**
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Villa Mitre Admin
VITE_APP_VERSION=1.0.0
```

## 📋 **Estado Actual del Desarrollo**

### **✅ Completado**

#### **Infraestructura Base**
- ✅ Configuración base del proyecto (Vite + React + TypeScript)
- ✅ Sistema de diseño con Tailwind CSS y colores Villa Mitre
- ✅ Componentes UI completos (Button, Input, Card, Modal, Toast, etc.)
- ✅ Sistema de autenticación con roles y permisos
- ✅ Integración con React Query para state management
- ✅ Layout responsive con sidebar colapsable
- ✅ Sistema de navegación inteligente por roles
- ✅ Error boundaries y manejo de errores robusto

#### **Panel de Gimnasio**
- ✅ **Dashboard simplificado** con mensaje de bienvenida
- ✅ **CRUD de Ejercicios completo**
  - Lista con filtros avanzados
  - Creación y edición con validación
  - Vista previa y duplicación
  - Eliminación con protección de foreign keys
- ✅ **Gestión de Plantillas Diarias**
  - Wizard de creación en 3 pasos
  - Vista de grid con tarjetas
  - Edición y duplicación
  - Sistema de favoritos
- ✅ **Sistema de tipos completo** (Exercise, Template, Assignment)

#### **Panel de Profesor**
- ✅ **Dashboard simplificado** con mensaje de bienvenida
- ✅ **Gestión de Estudiantes** (`/professor/students`)
  - Grid de estudiantes asignados
  - Estadísticas por estudiante
  - Asignación de plantillas con días específicos
  - Modal de asignación avanzado
  - Vista de plantillas asignadas
- ✅ **Calendario semanal** (integrado)
- ✅ **Hooks optimizados** con React Query

#### **Panel de Administración**
- ✅ **Dashboard simplificado** con mensaje de bienvenida
- ✅ **Gestión de Usuarios completa**
  - Lista con filtros avanzados (15+ filtros)
  - CRUD completo con validación
  - Sistema de roles y permisos
  - Asignación de profesores
  - Vista detallada con estadísticas
- ✅ **Sistema de Asignaciones**
  - Dashboard con métricas
  - Gestión profesor-estudiante
  - Protección por roles

#### **Optimizaciones y Performance**
- ✅ React.memo en componentes críticos
- ✅ useMemo y useCallback para prevenir re-renders
- ✅ React Query con cache inteligente
- ✅ Lazy loading preparado
- ✅ Bundle optimization con Vite
- ✅ Estados de carga granulares

#### **UI/UX Improvements**
- ✅ Toast notifications system
- ✅ Loading skeletons
- ✅ Empty states contextuales
- ✅ Error boundaries especializados
- ✅ Confirmaciones antes de acciones destructivas
- ✅ UI simplificada y limpia (sin elementos no funcionales)

### **🎯 Listo para Producción**

El proyecto está completamente funcional y optimizado para despliegue:
- ✅ Build de producción configurado
- ✅ Variables de entorno configuradas
- ✅ Guía de deployment completa (`DEPLOYMENT.md`)
- ✅ Script de despliegue automático
- ✅ Configuración de Nginx lista
- ✅ GitIgnore actualizado
- ✅ Sin errores de TypeScript
- ✅ Performance optimizada

### **📝 Notas de Versión 1.0.0**

**Cambios recientes:**
- Simplificación de dashboards (solo mensaje de bienvenida)
- Eliminación de botones no funcionales (Exportar, Reportes, Configuración)
- Ocultación de campanita de notificaciones
- Ocultación de opción "Mi Perfil"
- Creación de página dedicada para "Mis Estudiantes"
- Actualización de rutas y navegación
- Mejoras en UI/UX general

### **🚀 Despliegue**

Para instrucciones detalladas de despliegue en servidor de producción, ver: **[DEPLOYMENT.md](./DEPLOYMENT.md)**

Comando rápido en el servidor:
```bash
./deploy.sh
```

---

**Versión:** 1.0.0  
**Estado:** ✅ **Listo para Producción**  
**Última actualización:** Enero 2025
