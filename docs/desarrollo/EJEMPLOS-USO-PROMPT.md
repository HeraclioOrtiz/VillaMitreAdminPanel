# 📝 Ejemplos de Uso del Prompt - Villa Mitre Admin Panel

## 🎯 **Cómo Usar el Prompt Especializado**

### **FORMATO DE SOLICITUD A CLAUDE:**

```
Contexto: Eres un desarrollador senior trabajando en Villa Mitre Admin Panel.
Consulta el archivo PROMPT-DESARROLLO-CLAUDE.md para las especificaciones completas.

MICROPASO SOLICITADO: [Nombre del micropaso]

Implementa según las especificaciones del contexto, siguiendo la metodología de micropasos.
```

---

## 🏋️ **EJEMPLOS PRÁCTICOS**

### **EJEMPLO 1: Iniciar CRUD de Ejercicios**

```
Contexto: Eres un desarrollador senior trabajando en Villa Mitre Admin Panel.
Consulta el archivo PROMPT-DESARROLLO-CLAUDE.md para las especificaciones completas.

MICROPASO SOLICITADO: MICROPASO 1 - Fundación de Tipos y Servicios para Ejercicios

Crea:
- src/types/exercise.ts con todas las interfaces necesarias
- src/services/exercise.ts con funciones API usando axios
- src/hooks/useExercises.ts con hooks de React Query

Implementa según las especificaciones del contexto, siguiendo la metodología de micropasos.
```

**Respuesta esperada de Claude:**
- Análisis del micropaso
- Creación de los 3 archivos
- Explicación de cada implementación
- Verificación de funcionamiento
- Sugerencia del próximo micropaso

---

### **EJEMPLO 2: Crear Componente DataTable**

```
Contexto: Eres un desarrollador senior trabajando en Villa Mitre Admin Panel.
Consulta el archivo PROMPT-DESARROLLO-CLAUDE.md para las especificaciones completas.

MICROPASO SOLICITADO: MICROPASO 2 - Componente DataTable Base

Crea un componente DataTable reutilizable con:
- Paginación automática
- Ordenamiento por columnas
- Loading states con skeleton
- Props tipadas con TypeScript

Implementa según las especificaciones del contexto, siguiendo la metodología de micropasos.
```

---

### **EJEMPLO 3: Sistema de Filtros**

```
Contexto: Eres un desarrollador senior trabajando en Villa Mitre Admin Panel.
Consulta el archivo PROMPT-DESARROLLO-CLAUDE.md para las especificaciones completas.

MICROPASO SOLICITADO: MICROPASO 3 - Sistema de Filtros

Implementa:
- SearchInput con debounce automático
- MultiSelect con chips removibles
- ExerciseFilters específico para ejercicios

Usa Tailwind CSS y sigue los patrones establecidos.
```

---

### **EJEMPLO 4: Wizard de Plantillas**

```
Contexto: Eres un desarrollador senior trabajando en Villa Mitre Admin Panel.
Consulta el archivo PROMPT-DESARROLLO-CLAUDE.md para las especificaciones completas.

MICROPASO SOLICITADO: MICROPASO 9 - Wizard Base

Crea un componente Wizard reutilizable que:
- Maneje múltiples pasos
- Tenga navegación entre pasos
- Incluya validación por paso
- Sea reutilizable para diferentes wizards

Implementa según las especificaciones del contexto.
```

---

## 🔄 **FLUJO DE TRABAJO RECOMENDADO**

### **1. PREPARACIÓN**
```
Antes de solicitar un micropaso:
- Revisa el PLAN-MICROPASOS.md
- Identifica el micropaso específico
- Verifica que el anterior esté completado
```

### **2. SOLICITUD**
```
Usa el formato estándar:
- Contexto claro
- Micropaso específico
- Referencia al prompt especializado
```

### **3. IMPLEMENTACIÓN**
```
Claude responderá con:
- Análisis del micropaso
- Archivos a crear/modificar
- Código implementado
- Verificación de funcionamiento
- Próximo micropaso sugerido
```

### **4. VERIFICACIÓN**
```
Después de cada micropaso:
- Ejecuta npm run dev
- Verifica que no hay errores
- Prueba la funcionalidad implementada
- Procede al siguiente micropaso
```

---

## 🎯 **COMANDOS ESPECÍFICOS POR FASE**

### **FASE 2A: CRUD DE EJERCICIOS**

**Micropaso 1:**
```
MICROPASO SOLICITADO: MICROPASO 1 - Fundación de Tipos y Servicios para Ejercicios
```

**Micropaso 2:**
```
MICROPASO SOLICITADO: MICROPASO 2 - Componente DataTable Base
```

**Micropaso 3:**
```
MICROPASO SOLICITADO: MICROPASO 3 - Sistema de Filtros
```

**Micropaso 4:**
```
MICROPASO SOLICITADO: MICROPASO 4 - Lista de Ejercicios
```

**Micropaso 5:**
```
MICROPASO SOLICITADO: MICROPASO 5 - Formulario de Ejercicios
```

**Micropaso 6:**
```
MICROPASO SOLICITADO: MICROPASO 6 - Modal de Vista Previa
```

**Micropaso 7:**
```
MICROPASO SOLICITADO: MICROPASO 7 - Acciones y Estados
```

### **FASE 2B: PLANTILLAS DIARIAS**

**Micropaso 8:**
```
MICROPASO SOLICITADO: MICROPASO 8 - Tipos y Servicios de Plantillas
```

**Micropaso 9:**
```
MICROPASO SOLICITADO: MICROPASO 9 - Wizard Base
```

**Y así sucesivamente...**

---

## 🚨 **CASOS ESPECIALES**

### **Si hay errores en un micropaso:**
```
Contexto: Hay un error en el MICROPASO X implementado anteriormente.

ERROR ENCONTRADO: [Descripción del error]

Por favor corrige el error y verifica que todo funcione correctamente.
Mantén la metodología de micropasos.
```

### **Si necesitas modificar algo existente:**
```
Contexto: Necesito modificar el MICROPASO X ya implementado.

MODIFICACIÓN REQUERIDA: [Descripción de la modificación]

Actualiza el código manteniendo la compatibilidad con el resto del sistema.
```

### **Si quieres saltar a otro micropaso:**
```
Contexto: Quiero implementar un micropaso específico fuera de orden.

MICROPASO SOLICITADO: MICROPASO X - [Nombre]

NOTA: Los micropasos anteriores ya están implementados.
Procede con la implementación según las especificaciones.
```

---

## 📋 **CHECKLIST DE VERIFICACIÓN**

Después de cada micropaso, verifica:

- [ ] ✅ **Compilación**: `npm run dev` sin errores
- [ ] ✅ **TypeScript**: Sin errores de tipos
- [ ] ✅ **Funcionalidad**: La funcionalidad implementada funciona
- [ ] ✅ **Estilos**: Tailwind CSS aplicado correctamente
- [ ] ✅ **Navegación**: Las rutas funcionan (si aplica)
- [ ] ✅ **Consistencia**: Sigue los patrones establecidos

---

## 🎯 **COMANDO PARA EMPEZAR**

**Para comenzar el desarrollo, usa este comando:**

```
Contexto: Eres un desarrollador senior trabajando en Villa Mitre Admin Panel.
Consulta el archivo PROMPT-DESARROLLO-CLAUDE.md para las especificaciones completas.

MICROPASO SOLICITADO: MICROPASO 1 - Fundación de Tipos y Servicios para Ejercicios

Implementa según las especificaciones del contexto, siguiendo la metodología de micropasos.
Crea los tipos TypeScript, servicios API y hooks de React Query necesarios para el CRUD de ejercicios.
```

¡Listo para comenzar el desarrollo paso a paso! 🚀
