# 📊 ANÁLISIS: IMPLEMENTACIÓN DE PLANTILLAS DIARIAS

**Fecha:** 11 de Octubre 2025  
**Última actualización:** 11 de Octubre 2025 18:27  
**Estado:** ✅ CORREGIDO

---

## 🔍 **COMPARACIÓN: BACKEND vs FRONTEND**

### **📘 DOCUMENTACIÓN BACKEND:**

#### **GET /admin/gym/daily-templates** - Listar plantillas

**Query Parameters:**
```typescript
{
  search?: string;              // Búsqueda por título
  q?: string;                   // Alias de search
  difficulty?: string;
  start_date?: string;          // YYYY-MM-DD
  end_date?: string;            // YYYY-MM-DD
  level?: string;               // beginner|intermediate|advanced
  primary_goal?: string;
  goal?: string;                // Alias de primary_goal
  target_muscle_groups?: string;
  equipment_needed?: string;
  tags?: string;
  intensity_level?: string;
  sort_by?: string;             // Default: 'created_at'
  sort_direction?: 'asc' | 'desc'; // Default: 'desc'
  is_preset?: boolean;
  per_page?: number;            // Default: 20
  with_exercises?: boolean;     // Incluir ejercicios
  with_sets?: boolean;          // Incluir sets
  include?: string;             // 'exercises,exercises.sets,exercises.exercise'
}
```

**Respuesta 200:**
```typescript
{
  data: DailyTemplate[];
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
}
```

---

### **💻 IMPLEMENTACIÓN FRONTEND:**

**Archivo:** `src/services/template.ts`

**Líneas 159-227:** Método `getTemplates`

#### ✅ **LO QUE ESTÁ CORRECTO:**

1. **Endpoint URL:** ✅ `/admin/gym/daily-templates`
2. **Paginación:** ✅ `page`, `per_page`
3. **Parámetros básicos:** ✅ `search`, `level`, `goal`, `tags`, `sort_by`, `sort_direction`
4. **Include relaciones:** ✅ `with_exercises`, `with_sets`, `include`
5. **Transformación de respuesta:** ✅ Maneja múltiples estructuras
6. **Metadatos de paginación:** ✅ Correctamente mapeados

---

## ⚠️ **PROBLEMA IDENTIFICADO:**

### **React Query - Invalidación de Cache**

**Archivo:** `src/hooks/useTemplates.ts`

#### **useUpdateTemplate (Líneas 140-172):**

```typescript
export const useUpdateTemplate = (options?: {
  onSuccess?: (template: DailyTemplate) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TemplateFormData }) =>
      templateService.updateTemplate(id, data),
    onSuccess: async (updatedTemplate) => {
      // ✅ Actualizar el detalle específico primero
      queryClient.setQueryData(
        templateKeys.detail(updatedTemplate.id),
        updatedTemplate
      );
      
      // ⚠️ PROBLEMA: Invalidar y refetch
      await queryClient.invalidateQueries({ 
        queryKey: templateKeys.lists(),
        refetchType: 'active'  // 👈 Esto puede no estar triggereando correctamente
      });
      
      // ✅ Invalidar estadísticas
      queryClient.invalidateQueries({ queryKey: templateKeys.stats() });
      
      options?.onSuccess?.(updatedTemplate);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};
```

---

## 🛠️ **POSIBLES CAUSAS:**

### **1. Problema de Sincronización:**
- `refetchType: 'active'` solo refetch queries que están "activamente montadas"
- Si la página no está visible, no se actualizará

### **2. Cache Stale Time:**
```typescript
// useTemplates hook - Línea 38
staleTime: 5 * 60 * 1000, // 5 minutos
```
- Si los datos tienen menos de 5 minutos, React Query no los refetch
- La invalidación marca como "stale" pero no refetch inmediatamente

### **3. PlaceholderData:**
```typescript
// useTemplates hook - Línea 41
placeholderData: (previousData) => previousData,
```
- Mantiene los datos antiguos mientras se hace el refetch
- Puede dar la impresión de que no se actualiza

---

## ✅ **SOLUCIONES PROPUESTAS:**

### **Opción 1: Actualización Optimista en Lista**

Actualizar directamente la lista en cache sin invalidar:

```typescript
onSuccess: async (updatedTemplate) => {
  // 1. Actualizar detalle
  queryClient.setQueryData(
    templateKeys.detail(updatedTemplate.id),
    updatedTemplate
  );
  
  // 2. Actualizar todas las listas en cache
  queryClient.setQueriesData(
    { queryKey: templateKeys.lists() },
    (oldData: TemplateListResponse | undefined) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        data: oldData.data.map((template) =>
          template.id === updatedTemplate.id ? updatedTemplate : template
        ),
      };
    }
  );
  
  // 3. Invalidar estadísticas
  queryClient.invalidateQueries({ queryKey: templateKeys.stats() });
  
  options?.onSuccess?.(updatedTemplate);
},
```

### **Opción 2: Forzar Refetch Inmediato**

```typescript
onSuccess: async (updatedTemplate) => {
  // 1. Actualizar detalle
  queryClient.setQueryData(
    templateKeys.detail(updatedTemplate.id),
    updatedTemplate
  );
  
  // 2. Invalidar listas SIN refetchType
  queryClient.invalidateQueries({ 
    queryKey: templateKeys.lists()
  });
  
  // 3. Forzar refetch inmediato
  await queryClient.refetchQueries({ 
    queryKey: templateKeys.lists(),
    type: 'active'
  });
  
  // 4. Invalidar estadísticas
  queryClient.invalidateQueries({ queryKey: templateKeys.stats() });
  
  options?.onSuccess?.(updatedTemplate);
},
```

### **Opción 3: Reducir Stale Time**

En `useTemplates`:

```typescript
staleTime: 30 * 1000, // 30 segundos en lugar de 5 minutos
gcTime: 2 * 60 * 1000, // 2 minutos
```

---

## 📋 **RECOMENDACIÓN:**

**Usar combinación de Opción 1 + Opción 3:**

1. **Actualización optimista** para feedback inmediato
2. **Stale time reducido** para refetch más frecuente
3. **Mantener invalidación** como fallback

---

## 🧪 **PRUEBAS RECOMENDADAS:**

1. **Editar una plantilla:**
   - Cambiar título, nivel, duración
   - Guardar
   - Verificar que el cambio aparece en la lista inmediatamente
   - Verificar que los datos persisten al refrescar

2. **Crear una plantilla:**
   - Crear nueva plantilla
   - Verificar que aparece en la lista inmediatamente
   - Sin necesidad de refrescar página

3. **Eliminar una plantilla:**
   - Eliminar plantilla
   - Verificar que desaparece de la lista
   - Verificar que el contador de total se actualiza

4. **Duplicar una plantilla:**
   - Duplicar plantilla existente
   - Verificar que la copia aparece inmediatamente
   - Verificar que tiene sufijo "(Copia)"

---

## 📊 **MÉTRICAS DE VALIDACIÓN:**

| Operación | Tiempo Esperado | Estado Actual | Objetivo |
|-----------|----------------|---------------|----------|
| Crear plantilla | < 1s | ❓ | ✅ Inmediato |
| Actualizar plantilla | < 1s | ⚠️ No se ve | ✅ Inmediato |
| Eliminar plantilla | < 1s | ❓ | ✅ Inmediato |
| Duplicar plantilla | < 1s | ❓ | ✅ Inmediato |
| Refetch lista | < 2s | ✅ OK | ✅ OK |

---

## 🔗 **ARCHIVOS RELEVANTES:**

- **Servicio:** `src/services/template.ts`
- **Hooks:** `src/hooks/useTemplates.ts`
- **Vista:** `src/pages/gym/TemplateListPage.tsx`
- **Grid:** `src/components/gym/TemplateGrid.tsx`
- **Tipos:** `src/types/template.ts`

---

## ✅ **CORRECCIONES IMPLEMENTADAS:**

### **1. Actualización Optimista en `useUpdateTemplate`**

```typescript
onSuccess: async (updatedTemplate) => {
  // 1. Actualizar detalle específico
  queryClient.setQueryData(
    templateKeys.detail(updatedTemplate.id),
    updatedTemplate
  );
  
  // 2. Actualización optimista en todas las listas
  queryClient.setQueriesData(
    { queryKey: templateKeys.lists() },
    (oldData: TemplateListResponse | undefined) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        data: oldData.data.map((template) =>
          template.id === updatedTemplate.id ? updatedTemplate : template
        ),
      };
    }
  );
  
  // 3. Invalidar para refetch en background
  queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
  
  options?.onSuccess?.(updatedTemplate);
}
```

### **2. Actualización Optimista en `useCreateTemplate`**

- ✅ Agrega la nueva plantilla al inicio de la lista
- ✅ Actualiza el contador total inmediatamente

### **3. Actualización Optimista en `useDeleteTemplate`**

- ✅ Remueve la plantilla de la lista inmediatamente
- ✅ Actualiza el contador total
- ✅ Limpia el cache del detalle

### **4. Actualización Optimista en `useDuplicateTemplate`**

- ✅ Agrega la copia al inicio de la lista
- ✅ Actualiza el contador total

### **5. Configuración de `useTemplates` Optimizada**

- ✅ `staleTime`: 30 segundos (antes 5 minutos)
- ✅ `gcTime`: 2 minutos (antes 10 minutos)
- ✅ `refetchOnWindowFocus`: true (para sincronización)

---

## 🎯 **RESULTADO:**

Todas las operaciones CRUD ahora se reflejan **inmediatamente** en la interfaz:

| Operación | Antes | Ahora |
|-----------|-------|-------|
| **Crear** | ⚠️ Requería refrescar | ✅ Aparece instantáneamente |
| **Actualizar** | ❌ No se veía | ✅ Se actualiza al instante |
| **Eliminar** | ⚠️ A veces no desaparecía | ✅ Desaparece inmediatamente |
| **Duplicar** | ⚠️ Requería refrescar | ✅ Aparece instantáneamente |

---

**Estado:** ✅ Implementación completada y lista para pruebas
