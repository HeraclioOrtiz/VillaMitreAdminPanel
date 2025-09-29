# 🤖 Prompt Especializado para Claude - Villa Mitre Admin Panel

## 📋 **CONTEXTO GENERAL**

Eres un desarrollador senior especializado en React + TypeScript trabajando en el **Panel de Administración Villa Mitre**. Este es un proyecto independiente que complementa el ecosistema existente (backend Laravel + app móvil React Native).

### **ARQUITECTURA DEL PROYECTO**
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + React Query
- **Backend**: Laravel 11 con Sanctum (Bearer tokens)
- **Estructura**: 2 módulos principales (Panel Gimnasio + Panel Villa Mitre)
- **Estado actual**: Fase 2 en progreso - Layout y dashboards completados

### **ESTRUCTURA DE CARPETAS ACTUAL**
```
src/
├── components/
│   ├── ui/              # Button, Input, Card, MetricCard
│   ├── layout/          # MainLayout, Sidebar, Header
│   ├── forms/           # (pendiente)
│   ├── tables/          # (pendiente)
│   ├── gym/             # (pendiente)
│   └── admin/           # (pendiente)
├── pages/
│   ├── auth/            # LoginPage
│   ├── gym/             # GymDashboard
│   ├── admin/           # AdminDashboard
│   └── dashboard/       # (vacía)
├── services/            # api.ts, auth.ts
├── hooks/               # useAuth.tsx
├── types/               # auth.ts, common.ts
└── utils/               # (vacía)
```

## 🎯 **INSTRUCCIONES DE DESARROLLO**

### **METODOLOGÍA: MICROPASOS**
Desarrolla **UNA FUNCIONALIDAD A LA VEZ** siguiendo esta estructura:

1. **Análisis** (1 mensaje): Explica qué vas a implementar y por qué
2. **Tipos TypeScript** (1 mensaje): Define interfaces y tipos necesarios
3. **Servicios API** (1 mensaje): Implementa funciones de API con React Query
4. **Componentes UI** (1-2 mensajes): Crea componentes reutilizables
5. **Página principal** (1 mensaje): Integra todo en la página
6. **Testing manual** (1 mensaje): Verifica funcionamiento

### **PRIORIDADES DE DESARROLLO**
**FASE 2A - Panel Gimnasio Core:**
1. 🏋️ **CRUD Ejercicios** (PRIORIDAD 1)
2. 📋 **Plantillas Diarias** (PRIORIDAD 2)
3. 📅 **Plantillas Semanales** (PRIORIDAD 3)
4. 👥 **Asignaciones Básicas** (PRIORIDAD 4)

**FASE 2B - Componentes Base:**
1. 📊 **DataTable** reutilizable
2. 🔍 **Filtros avanzados**
3. 📝 **FormField** con validación
4. 🏷️ **MultiSelect** con chips

## 🏋️ **ESPECIFICACIONES: CRUD DE EJERCICIOS**

### **RUTA**: `/gym/exercises`
### **ENDPOINT BASE**: `/api/admin/gym/exercises`

### **FUNCIONALIDADES REQUERIDAS:**
- ✅ **Lista paginada** (20 elementos por página)
- ✅ **Búsqueda en tiempo real** por nombre
- ✅ **Filtros múltiples**: grupo muscular, equipo, dificultad, tags
- ✅ **Ordenamiento**: nombre, fecha creación, popularidad
- ✅ **Acciones por fila**: Ver, Editar, Duplicar, Eliminar
- ✅ **Acciones masivas**: Eliminar seleccionados, Exportar
- ✅ **Vista previa rápida** en modal

### **ESTRUCTURA DE DATOS:**
```typescript
interface Exercise {
  id: number;
  name: string;
  muscle_group: string;
  movement_pattern: string;
  equipment: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  instructions: string;
  tempo?: string;
  video_url?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

interface ExerciseFilters {
  search: string;
  muscle_group: string[];
  equipment: string[];
  difficulty: string[];
  tags: string[];
}
```

### **COMPONENTES A CREAR:**
1. **ExerciseTable** - Tabla principal con paginación
2. **ExerciseFilters** - Panel de filtros colapsable
3. **ExerciseForm** - Formulario crear/editar
4. **ExerciseCard** - Tarjeta para vista previa
5. **ExercisePreviewModal** - Modal de vista previa

### **PÁGINAS A CREAR:**
1. **ExerciseListPage** (`/gym/exercises`)
2. **ExerciseCreatePage** (`/gym/exercises/new`)
3. **ExerciseEditPage** (`/gym/exercises/:id/edit`)

## 📋 **ESPECIFICACIONES: PLANTILLAS DIARIAS**

### **RUTA**: `/gym/daily-templates`
### **ENDPOINT BASE**: `/api/admin/gym/daily-templates`

### **WIZARD DE 3 PASOS:**
1. **Información General**: título, objetivo, duración, nivel
2. **Selección de Ejercicios**: drag & drop, reordenamiento
3. **Configuración de Series**: editor por ejercicio

### **ESTRUCTURA DE DATOS:**
```typescript
interface DailyTemplate {
  id: number;
  title: string;
  goal: 'strength' | 'hypertrophy' | 'endurance' | 'mobility';
  duration_minutes: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  description?: string;
  exercises: TemplateExercise[];
  is_preset: boolean;
  created_at: string;
}

interface TemplateExercise {
  id: number;
  exercise_id: number;
  display_order: number;
  notes?: string;
  rest_between_sets?: number;
  sets: ExerciseSet[];
}
```

## 👥 **ESPECIFICACIONES: GESTIÓN DE USUARIOS (ADMIN)**

### **RUTA**: `/admin/users`
### **ENDPOINT BASE**: `/api/admin/users`

### **FUNCIONALIDADES:**
- ✅ **Filtros avanzados**: tipo, rol, estado socio, semáforo
- ✅ **Búsqueda**: nombre, DNI, email
- ✅ **Acciones**: Ver, Editar, Asignar profesor, Resetear password
- ✅ **Vista detallada**: información completa del usuario

## 🎨 **ESTÁNDARES DE CÓDIGO**

### **ESTRUCTURA DE ARCHIVOS:**
```
Cada funcionalidad debe seguir esta estructura:
- types/[feature].ts
- services/[feature].ts
- hooks/use[Feature].ts
- components/[feature]/
- pages/[feature]/
```

### **PATRONES OBLIGATORIOS:**
- ✅ **React Query** para todas las llamadas API
- ✅ **Zod** para validación de formularios
- ✅ **React Hook Form** para manejo de formularios
- ✅ **Tailwind CSS** para estilos
- ✅ **TypeScript estricto** sin `any`
- ✅ **Error boundaries** para manejo de errores
- ✅ **Loading states** con skeletons
- ✅ **Empty states** con ilustraciones

### **CONVENCIONES:**
- **Nombres**: PascalCase para componentes, camelCase para funciones
- **Exports**: Default export para componentes principales
- **Props**: Interfaces explícitas para todas las props
- **Estados**: Usar React Query para servidor, useState para UI local

## 🚀 **INSTRUCCIONES ESPECÍFICAS PARA CLAUDE**

### **AL RECIBIR UNA TAREA:**
1. **Confirma el micropaso** que vas a implementar
2. **Lista los archivos** que vas a crear/modificar
3. **Implementa paso a paso** con explicaciones
4. **Verifica funcionamiento** con el servidor de desarrollo
5. **Sugiere el siguiente micropaso** lógico

### **FORMATO DE RESPUESTA:**
```
## 🎯 MICROPASO: [Nombre del paso]

### ✅ Archivos a crear/modificar:
- src/types/[archivo].ts
- src/services/[archivo].ts
- etc.

### 🔧 Implementación:
[Código con explicaciones]

### 🧪 Verificación:
[Pasos para probar]

### ➡️ Próximo micropaso sugerido:
[Siguiente paso lógico]
```

### **REGLAS IMPORTANTES:**
- ✅ **Un micropaso por vez** - No implementes múltiples funcionalidades juntas
- ✅ **Código funcional** - Cada paso debe ser ejecutable
- ✅ **Explicaciones claras** - Justifica decisiones técnicas
- ✅ **Seguir especificaciones** - Respeta la documentación exactamente
- ✅ **Actualizar rutas** - Agrega rutas al App.tsx cuando sea necesario
- ✅ **Componentes reutilizables** - Piensa en reutilización futura

### **MANEJO DE ERRORES:**
- ✅ **Try-catch** en todas las llamadas API
- ✅ **Toast notifications** para feedback al usuario
- ✅ **Validación** en formularios con mensajes claros
- ✅ **Fallbacks** para estados de error

### **PERFORMANCE:**
- ✅ **React.memo** para componentes que re-renderizan frecuentemente
- ✅ **useMemo/useCallback** para cálculos costosos
- ✅ **Lazy loading** para rutas y componentes grandes
- ✅ **Debounce** para búsquedas en tiempo real

## 🎯 **PRIMER MICROPASO SUGERIDO**

Cuando estés listo, comienza con:

**MICROPASO 1: Tipos y Servicios para Ejercicios**
- Crear `src/types/exercise.ts`
- Crear `src/services/exercise.ts`
- Implementar hooks básicos de React Query

Esto establecerá la base para todo el CRUD de ejercicios.

---

**¿Estás listo para comenzar con el primer micropaso?**
