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

### **✅ Completado (Fase 1 + Fase 2 Parcial)**
- ✅ Configuración base del proyecto
- ✅ Sistema de diseño con Tailwind CSS
- ✅ Componentes UI base (Button, Input, Card, MetricCard)
- ✅ Sistema de autenticación completo
- ✅ Estructura de carpetas y configuración
- ✅ Integración con React Query
- ✅ Página de login funcional
- ✅ **Layout principal con sidebar y navegación**
- ✅ **Dashboard de profesores con métricas**
- ✅ **Dashboard de administradores**
- ✅ **Navegación inteligente por roles**
- ✅ **Componentes de layout responsive**

### **🔄 En Desarrollo (Fase 2)**
1. **CRUD de Ejercicios**: Gestión completa con filtros
2. **Plantillas Diarias**: Wizard de creación
3. **Asignaciones Básicas**: Gestión de rutinas

### **📋 Próximas Fases**
- **Fase 3**: Plantillas semanales y reportes
- **Fase 4**: Panel Villa Mitre completo
- **Fase 5**: Optimización y deployment

---

**Versión:** 1.0.0  
**Estado:** 🚧 En desarrollo activo
