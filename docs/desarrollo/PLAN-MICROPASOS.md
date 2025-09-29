# 📋 Plan de Micropasos - Villa Mitre Admin Panel

## 🎯 **FASE 2A: CRUD DE EJERCICIOS**

### **MICROPASO 1: Fundación de Tipos y Servicios**
**Duración estimada**: 15-20 minutos
**Archivos a crear**:
- `src/types/exercise.ts` - Interfaces y tipos
- `src/services/exercise.ts` - Funciones API
- `src/hooks/useExercises.ts` - Hooks React Query

**Objetivo**: Establecer la base de datos y comunicación con API

---

### **MICROPASO 2: Componente DataTable Base**
**Duración estimada**: 30-40 minutos
**Archivos a crear**:
- `src/components/ui/DataTable.tsx` - Tabla reutilizable
- `src/components/ui/Pagination.tsx` - Paginación
- `src/components/ui/TableSkeleton.tsx` - Loading state

**Objetivo**: Crear componente de tabla reutilizable para todo el proyecto

---

### **MICROPASO 3: Sistema de Filtros**
**Duración estimada**: 25-35 minutos
**Archivos a crear**:
- `src/components/ui/SearchInput.tsx` - Input con debounce
- `src/components/ui/MultiSelect.tsx` - Selector múltiple
- `src/components/gym/ExerciseFilters.tsx` - Panel de filtros específico

**Objetivo**: Sistema de filtrado avanzado para ejercicios

---

### **MICROPASO 4: Lista de Ejercicios**
**Duración estimada**: 20-30 minutos
**Archivos a crear**:
- `src/components/gym/ExerciseTable.tsx` - Tabla específica
- `src/pages/gym/ExerciseListPage.tsx` - Página principal
- Actualizar `src/App.tsx` - Agregar ruta

**Objetivo**: Página funcional de listado con filtros

---

### **MICROPASO 5: Formulario de Ejercicios**
**Duración estimada**: 35-45 minutos
**Archivos a crear**:
- `src/components/ui/FormField.tsx` - Campo de formulario base
- `src/components/gym/ExerciseForm.tsx` - Formulario específico
- `src/pages/gym/ExerciseCreatePage.tsx` - Página crear
- `src/pages/gym/ExerciseEditPage.tsx` - Página editar

**Objetivo**: Formularios de creación y edición completos

---

### **MICROPASO 6: Modal de Vista Previa**
**Duración estimada**: 20-25 minutos
**Archivos a crear**:
- `src/components/ui/Modal.tsx` - Modal base reutilizable
- `src/components/gym/ExercisePreviewModal.tsx` - Modal específico
- `src/components/gym/ExerciseCard.tsx` - Tarjeta de ejercicio

**Objetivo**: Vista previa rápida de ejercicios

---

### **MICROPASO 7: Acciones y Estados**
**Duración estimada**: 15-20 minutos
**Archivos a modificar**:
- `src/hooks/useExercises.ts` - Agregar mutaciones
- `src/components/gym/ExerciseTable.tsx` - Agregar acciones
- `src/components/ui/Toast.tsx` - Notificaciones

**Objetivo**: Completar CRUD con acciones y feedback

---

## 🎯 **FASE 2B: PLANTILLAS DIARIAS**

### **MICROPASO 8: Tipos y Servicios de Plantillas**
**Duración estimada**: 20-25 minutos
**Archivos a crear**:
- `src/types/template.ts` - Interfaces de plantillas
- `src/services/template.ts` - API de plantillas
- `src/hooks/useTemplates.ts` - Hooks React Query

---

### **MICROPASO 9: Wizard Base**
**Duración estimada**: 30-40 minutos
**Archivos a crear**:
- `src/components/ui/Wizard.tsx` - Componente wizard reutilizable
- `src/components/ui/StepIndicator.tsx` - Indicador de pasos
- `src/hooks/useWizard.ts` - Hook para manejo de wizard

---

### **MICROPASO 10: Paso 1 - Información General**
**Duración estimada**: 25-30 minutos
**Archivos a crear**:
- `src/components/gym/TemplateBasicInfoStep.tsx` - Primer paso
- `src/pages/gym/TemplateCreatePage.tsx` - Página del wizard

---

### **MICROPASO 11: Paso 2 - Selección de Ejercicios**
**Duración estimada**: 40-50 minutos
**Archivos a crear**:
- `src/components/gym/ExerciseSelector.tsx` - Selector con drag & drop
- `src/components/gym/TemplateExerciseStep.tsx` - Segundo paso
- `src/hooks/useDragAndDrop.ts` - Hook para drag & drop

---

### **MICROPASO 12: Paso 3 - Configuración de Series**
**Duración estimada**: 35-45 minutos
**Archivos a crear**:
- `src/components/gym/SetEditor.tsx` - Editor de series
- `src/components/gym/TemplateSetsStep.tsx` - Tercer paso
- `src/components/gym/TemplatePreview.tsx` - Vista previa final

---

### **MICROPASO 13: Lista de Plantillas**
**Duración estimada**: 25-30 minutos
**Archivos a crear**:
- `src/components/gym/TemplateGrid.tsx` - Grid de tarjetas
- `src/components/gym/TemplateCard.tsx` - Tarjeta individual
- `src/pages/gym/TemplateListPage.tsx` - Página de lista

---

## 🎯 **FASE 2C: COMPONENTES AVANZADOS**

### **MICROPASO 14: Sistema de Notificaciones**
**Duración estimada**: 20-25 minutos
**Archivos a crear**:
- `src/components/ui/Toast.tsx` - Componente toast
- `src/hooks/useToast.ts` - Hook para notificaciones
- `src/contexts/ToastContext.tsx` - Contexto global

---

### **MICROPASO 15: Estados de Carga Avanzados**
**Duración estimada**: 15-20 minutos
**Archivos a crear**:
- `src/components/ui/Skeleton.tsx` - Componentes skeleton
- `src/components/ui/EmptyState.tsx` - Estados vacíos
- `src/components/ui/ErrorBoundary.tsx` - Manejo de errores

---

### **MICROPASO 16: Optimización y Performance**
**Duración estimada**: 20-25 minutos
**Archivos a modificar**:
- Agregar `React.memo` donde sea necesario
- Implementar `useMemo` y `useCallback`
- Optimizar queries de React Query

---

## 🎯 **FASE 3A: GESTIÓN DE USUARIOS (ADMIN)**

### **MICROPASO 17: Tipos y Servicios de Usuarios**
**Duración estimada**: 25-30 minutos
**Archivos a crear**:
- `src/types/user.ts` - Interfaces de usuarios
- `src/services/user.ts` - API de usuarios
- `src/hooks/useUsers.ts` - Hooks React Query

---

### **MICROPASO 18: Filtros Avanzados de Usuarios**
**Duración estimada**: 35-40 minutos
**Archivos a crear**:
- `src/components/admin/UserFilters.tsx` - Filtros específicos
- `src/components/ui/DateRangePicker.tsx` - Selector de fechas
- `src/components/ui/FilterChips.tsx` - Chips de filtros activos

---

### **MICROPASO 19: Tabla de Usuarios**
**Duración estimada**: 30-35 minutos
**Archivos a crear**:
- `src/components/admin/UserTable.tsx` - Tabla específica
- `src/components/admin/UserActions.tsx` - Acciones por fila
- `src/pages/admin/UserListPage.tsx` - Página principal

---

### **MICROPASO 20: Detalle de Usuario**
**Duración estimada**: 40-45 minutos
**Archivos a crear**:
- `src/components/admin/UserDetail.tsx` - Vista detallada
- `src/components/admin/UserStats.tsx` - Estadísticas
- `src/pages/admin/UserDetailPage.tsx` - Página de detalle

---

## 📊 **ESTIMACIONES TOTALES**

### **FASE 2A - CRUD Ejercicios**: 
- **7 micropasos** 
- **Tiempo estimado**: 3-4 horas
- **Complejidad**: Media

### **FASE 2B - Plantillas Diarias**: 
- **6 micropasos**
- **Tiempo estimado**: 3.5-4.5 horas  
- **Complejidad**: Alta (wizard + drag & drop)

### **FASE 2C - Componentes Avanzados**: 
- **3 micropasos**
- **Tiempo estimado**: 1-1.5 horas
- **Complejidad**: Baja

### **FASE 3A - Gestión Usuarios**: 
- **4 micropasos**
- **Tiempo estimado**: 2.5-3 horas
- **Complejidad**: Media-Alta

## 🎯 **PRÓXIMO PASO RECOMENDADO**

**COMENZAR CON MICROPASO 1**: Fundación de Tipos y Servicios para Ejercicios

Este micropaso establecerá:
- ✅ Estructura de datos clara
- ✅ Comunicación con API
- ✅ Hooks de React Query
- ✅ Base para todos los siguientes pasos

**Comando para Claude**:
```
Implementa el MICROPASO 1: Fundación de Tipos y Servicios para Ejercicios.
Crea los tipos TypeScript, servicios API y hooks de React Query necesarios 
para el CRUD de ejercicios según las especificaciones del contexto.
```
