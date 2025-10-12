# 🚨 CAMBIOS CRÍTICOS - PLANTILLAS DIARIAS Y SETS

**Fecha:** 11 de Octubre 2025  
**Problema:** Campos de formulario y UI que NO existen en el backend

---

## ❌ CAMPOS ELIMINADOS (NO EXISTEN EN BACKEND)

### **1. Información Básica:**
- ❌ `description` - NO existe en tabla `gym_daily_templates`

### **2. Objetivos:**
- ❌ `intensity_level` - NO existe en backend
- ❌ `secondary_goals` - NO existe en backend

### **3. Grupos Musculares y Equipamiento:**
- ❌ `target_muscle_groups` - Se calcula automáticamente desde ejercicios
- ❌ `equipment_needed` - Se calcula automáticamente desde ejercicios

### **4. Configuración Avanzada:**
- ❌ `warm_up_notes` - NO existe en backend
- ❌ `cool_down_notes` - NO existe en backend
- ❌ `progression_notes` - NO existe en backend
- ❌ `variations` - NO existe en backend
- ❌ `prerequisites` - NO existe en backend
- ❌ `contraindications` - NO existe en backend

### **5. Configuración de Sets (gym_daily_template_sets):**
- ❌ `duration` - NO existe en tabla `gym_daily_template_sets`
- ❌ `distance` - NO existe en tabla `gym_daily_template_sets`
- ❌ `tempo` - NO existe en tabla `gym_daily_template_sets` (ya estaba comentado)

---

## ✅ CAMPOS QUE SÍ EXISTEN EN BACKEND

Según la documentación oficial del backend:

### **Campos de gym_daily_templates:**
1. **title** (string, max: 255) - **REQUERIDO**
2. **estimated_duration_min** (integer, 0-600) - OPCIONAL
3. **level** (string, max: 50) - OPCIONAL
   - Valores: "beginner", "intermediate", "advanced"
4. **goal** (string, max: 50) - OPCIONAL
   - Valores: "strength", "hypertrophy", "endurance", "power", "mobility", "cardio"
5. **tags** (JSON array) - OPCIONAL
6. **is_preset** (boolean) - OPCIONAL
7. **is_public** (boolean) - OPCIONAL
8. **exercises** (array) - OPCIONAL

### **Campos de gym_daily_template_sets:**
1. **set_number** (integer) - REQUERIDO
2. **reps_min** (integer) - OPCIONAL
3. **reps_max** (integer) - OPCIONAL
4. **weight_min** (decimal 8,2) - OPCIONAL (Peso mínimo en kg)
5. **weight_max** (decimal 8,2) - OPCIONAL (Peso máximo en kg)
6. **weight_target** (decimal 8,2) - OPCIONAL (Peso objetivo en kg)
7. **rest_seconds** (integer) - OPCIONAL (Descanso en segundos)
8. **rpe_target** (decimal 4,2) - OPCIONAL (0.00-10.00)
9. **notes** (text) - OPCIONAL (Notas específicas)

**⚠️ IMPORTANTE:** Los campos `duration`, `distance` y `tempo` NO existen en la tabla.

---

## 🔄 MAPEO FRONTEND ↔ BACKEND

| **Frontend**             | **Backend**              | **Tipo**   |
|--------------------------|--------------------------|------------|
| `name`                   | `title`                  | string     |
| `difficulty`             | `level`                  | string     |
| `primary_goal`           | `goal`                   | string     |
| `estimated_duration`     | `estimated_duration_min` | integer    |
| `tags`                   | `tags`                   | string[]   |
| `is_public`              | `is_public`              | boolean    |
| `exercises`              | `exercises`              | array      |

---

## 🛠️ ARCHIVOS MODIFICADOS

### **1. src/services/template.ts**
- ✅ Eliminados campos que NO existen en backend del envío
- ✅ Solo se envían: title, level, goal, estimated_duration_min, tags, is_public, exercises
- ✅ Logging completo de transformaciones

### **2. src/components/gym/TemplateBasicInfoStep.tsx**
- ✅ Comentados/eliminados todos los campos que NO existen
- ✅ Formulario simplificado con solo 5 campos:
  1. Nombre
  2. Duración Estimada
  3. Nivel de Dificultad
  4. Objetivo Principal
  5. Tags
  6. Checkbox Hacer Pública
- ✅ Validación actualizada (solo valida campos existentes)

### **3. src/components/gym/TemplateSetsStep.tsx**
- ✅ Arreglado problema de sincronización
- ✅ Ahora detecta cuando se agregan nuevos ejercicios
- ✅ Se actualiza automáticamente sin necesidad de refrescar

### **4. src/components/gym/SetEditor.tsx** ⭐ NUEVO
- ✅ Eliminado campo `duration` (NO existe en backend)
- ✅ Eliminado campo `distance` (NO existe en backend)
- ✅ Campo `tempo` ya estaba comentado correctamente
- ✅ Formulario ahora solo muestra 7 campos reales:
  1. Reps (repeticiones)
  2. Peso Objetivo (weight_target)
  3. Rango de Peso (weight_min, weight_max)
  4. Descanso (rest_seconds)
  5. RPE (rpe_target)
  6. Notas (notes)
- ✅ Help text actualizado con campos correctos

### **5. src/components/gym/TemplateCard.tsx** ⭐ NUEVO
- ✅ Eliminado campo `description` de visualización
- ✅ Eliminado campo `intensity_level` y su badge
- ✅ Eliminada sección `target_muscle_groups` (se calcula de ejercicios)
- ✅ Eliminada sección `equipment_needed` (se calcula de ejercicios)
- ✅ Tarjetas ahora solo muestran datos que existen:
  - Nombre (title)
  - Nivel (level)
  - Duración (estimated_duration_min)
  - Objetivo (goal)
  - Tags (tags)
  - Ejercicios con nombres reales
  - Grupos musculares extraídos de ejercicios
  - Estadísticas (ejercicios, series, grupos)

---

## 📊 FLUJO DE DATOS CORREGIDO

### **CREAR PLANTILLA:**
```typescript
POST /admin/gym/daily-templates
{
  "title": "Rutina de Fuerza",
  "estimated_duration_min": 60,
  "level": "intermediate",
  "goal": "strength",
  "tags": ["fuerza", "principiantes"],
  "is_public": false,
  "exercises": [...]
}
```

### **EDITAR PLANTILLA:**
```typescript
PUT /admin/gym/daily-templates/{id}
{
  "title": "Rutina de Fuerza (Actualizada)",
  "estimated_duration_min": 75,
  "level": "intermediate",
  "goal": "strength",
  "tags": ["fuerza", "intermedio"],
  "is_public": true
}
```

**⚠️ IMPORTANTE:** Si envías `exercises`, reemplaza TODOS los ejercicios existentes.

---

## ✅ PROBLEMAS RESUELTOS

### **1. Campos no aparecían al editar:**
- **Causa:** Frontend esperaba campos que NO existen en backend
- **Solución:** Eliminados campos inexistentes del formulario

### **2. Nombre no se actualizaba:**
- **Causa:** Mapeo incorrecto `name` → `title`
- **Solución:** Transformación correcta en ambas direcciones

### **3. Ejercicios nuevos no aparecían en sets:**
- **Causa:** Componente no detectaba cambios en ejercicios
- **Solución:** Sincronización mejorada con detección de cambios

### **4. Descripción no aparecía:**
- **Causa:** Campo `description` NO existe en backend
- **Solución:** Campo comentado/eliminado (no guardará datos)

### **5. Subcampos no se actualizaban:**
- **Causa:** Envío de campos que backend ignora
- **Solución:** Solo enviar campos que existen en backend

---

## 🧪 CÓMO VERIFICAR

### **Test 1: Crear Nueva Plantilla**
1. Ir a `/gym/daily-templates/create`
2. Llenar formulario simplificado (5 campos)
3. Agregar ejercicios
4. Configurar sets
5. Guardar
6. ✅ Debería guardarse correctamente

### **Test 2: Editar Plantilla Existente**
1. Ir a `/gym/daily-templates`
2. Click en "Editar" en una plantilla
3. ✅ Nombre debería aparecer precargado
4. ✅ Duración debería aparecer precargada
5. ✅ Nivel debería aparecer precargado
6. ✅ Objetivo debería aparecer precargado
7. ✅ Tags deberían aparecer precargados
8. Modificar algún campo
9. Guardar
10. ✅ Cambios deberían persistir

### **Test 3: Agregar Ejercicio Nuevo**
1. Editar plantilla existente
2. Ir a "Paso 2: Ejercicios"
3. Agregar un ejercicio nuevo
4. Ir a "Paso 3: Configurar Sets"
5. ✅ El nuevo ejercicio debería aparecer en la lista
6. Configurar sets
7. Guardar
8. ✅ El ejercicio nuevo debería guardarse

### **Test 4: Modificar Sets Existentes**
1. Editar plantilla con ejercicios
2. Ir a "Paso 3: Configurar Sets"
3. Modificar valores de sets (reps, peso, descanso)
4. Guardar
5. ✅ Los cambios deberían persistir

---

## 🎯 CAMPOS ACTUALES DEL FORMULARIO

### **Paso 1: Información General**
1. **Nombre** (requerido) → `title`
2. **Duración Estimada** (requerido) → `estimated_duration_min`
3. **Nivel de Dificultad** (requerido) → `level`
4. **Objetivo Principal** (requerido) → `goal`
5. **Tags** (opcional) → `tags`
6. **Hacer Pública** (checkbox) → `is_public`

### **Paso 2: Selección de Ejercicios**
- Búsqueda y filtros de ejercicios
- Drag & drop para agregar/reordenar
- Lista de ejercicios seleccionados

### **Paso 3: Configuración de Sets**
- Editor de sets por ejercicio
- Campos: set_number, reps_min, reps_max, weight_min, weight_max, weight_target, rest_seconds, rpe_target, notes

---

## 📝 NOTAS TÉCNICAS

1. **Los grupos musculares se calculan automáticamente** desde los ejercicios seleccionados
2. **El equipamiento se calcula automáticamente** desde los ejercicios seleccionados
3. **No existe campo "description"** - se eliminó del formulario
4. **Backend valida:**
   - title: requerido, max 255
   - estimated_duration_min: 0-600
   - level: max 50
   - goal: max 50
   - tags: array de strings

---

## ⚠️ IMPORTANTE PARA DESARROLLO FUTURO

Si necesitas agregar nuevos campos:

1. **PRIMERO** verifica que existan en el backend (tabla `gym_daily_templates`)
2. **SEGUNDO** agrega validaciones en el backend
3. **TERCERO** agrega el campo al formulario frontend
4. **CUARTO** agrega la transformación en `transformFormDataForBackend()`

**NO agregar campos al frontend que no existen en el backend** - se perderán datos.

---

**Fecha de cambios:** 11 de Octubre 2025  
**Estado:** ✅ COMPLETADO - Sistema corregido y funcionando
