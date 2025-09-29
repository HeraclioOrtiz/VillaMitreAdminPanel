# 🧪 PLAN DE TESTING COMPLETO - Villa Mitre Admin Panel

## 📋 **ÍNDICE**
- [🎯 Objetivos del Testing](#-objetivos-del-testing)
- [🏗️ Arquitectura del Sistema](#️-arquitectura-del-sistema)
- [🔍 Testing por Micropasos](#-testing-por-micropasos)
- [🌐 Testing Macro (End-to-End)](#-testing-macro-end-to-end)
- [⚡ Testing de Performance](#-testing-de-performance)
- [🔒 Testing de Seguridad](#-testing-de-seguridad)
- [📱 Testing de Responsividad](#-testing-de-responsividad)
- [✅ Checklist de Verificación](#-checklist-de-verificación)

---

## 🎯 **OBJETIVOS DEL TESTING**

### **Propósito Principal**
Verificar el correcto funcionamiento de TODOS los features implementados en el Villa Mitre Admin Panel, desde componentes individuales hasta flujos completos de usuario.

### **Alcance del Testing**
- ✅ **Componentes UI**: Todos los componentes base y especializados
- ✅ **Hooks y Servicios**: React Query hooks, servicios API, hooks personalizados
- ✅ **Páginas Completas**: Flujos de usuario end-to-end
- ✅ **Estados y Transiciones**: Loading, error, empty states
- ✅ **Performance**: Optimizaciones y rendimiento
- ✅ **Responsividad**: Adaptación a diferentes dispositivos
- ✅ **Integración**: Comunicación entre componentes

---

## 🏗️ **ARQUITECTURA DEL SISTEMA**

### **Stack Tecnológico**
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query + useState/useReducer
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Icons**: Heroicons
- **Build**: Vite con optimizaciones

### **Estructura de Componentes**
```
src/
├── components/
│   ├── ui/           # Componentes base reutilizables
│   ├── admin/        # Componentes específicos de administración
│   └── gym/          # Componentes específicos de gimnasio
├── hooks/            # Hooks personalizados y React Query
├── services/         # Servicios API y utilidades
├── types/            # Tipos TypeScript
└── pages/            # Páginas principales
```

---

## 🔍 **TESTING POR MICROPASOS**

### **MICROPASO 1-6: Configuración Base**
#### ✅ **Componentes UI Base**
- [ ] **Button**: Todas las variantes (primary, secondary, ghost, danger)
- [ ] **Input**: Estados (normal, error, disabled, loading)
- [ ] **Card**: Diferentes tamaños y contenidos
- [ ] **MetricCard**: Visualización de métricas con iconos

#### 🧪 **Tests Unitarios**
```typescript
// Ejemplo de test para Button
describe('Button Component', () => {
  test('renders with correct variant classes', () => {
    render(<Button variant="primary">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600');
  });
  
  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### **MICROPASO 7: Sistema de Toasts**
#### ✅ **Toast System**
- [ ] **ToastProvider**: Context global funcionando
- [ ] **useToast**: Hook para mostrar notificaciones
- [ ] **Toast Types**: success, error, warning, info
- [ ] **Auto-dismiss**: Configuración de duración
- [ ] **Multiple Toasts**: Gestión de múltiples notificaciones

#### 🧪 **Tests de Integración**
```typescript
describe('Toast System', () => {
  test('shows success toast', () => {
    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider
    });
    
    act(() => {
      result.current.showSuccess('Test message');
    });
    
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });
});
```

### **MICROPASO 8-14: Sistema de Ejercicios**
#### ✅ **Ejercicios CRUD Completo**
- [ ] **ExerciseListPage**: Lista con filtros y paginación
- [ ] **ExerciseCreatePage**: Formulario de creación con validación
- [ ] **ExerciseEditPage**: Edición con carga de datos
- [ ] **ExerciseTable**: DataTable con selección múltiple
- [ ] **ExerciseFilters**: Filtros avanzados funcionales
- [ ] **ExerciseCard**: Vista de tarjeta con acciones

#### 🧪 **Tests End-to-End**
```typescript
describe('Exercise Management Flow', () => {
  test('complete CRUD flow', async () => {
    // 1. Navegar a lista de ejercicios
    await page.goto('/gym/exercises');
    await expect(page.locator('h1')).toContainText('Ejercicios');
    
    // 2. Crear nuevo ejercicio
    await page.click('[data-testid="create-exercise"]');
    await page.fill('[name="name"]', 'Test Exercise');
    await page.selectOption('[name="muscle_group"]', 'chest');
    await page.click('[type="submit"]');
    
    // 3. Verificar creación exitosa
    await expect(page.locator('.toast-success')).toBeVisible();
    await expect(page.locator('text=Test Exercise')).toBeVisible();
    
    // 4. Editar ejercicio
    await page.click('[data-testid="edit-exercise"]');
    await page.fill('[name="name"]', 'Updated Exercise');
    await page.click('[type="submit"]');
    
    // 5. Verificar actualización
    await expect(page.locator('text=Updated Exercise')).toBeVisible();
    
    // 6. Eliminar ejercicio
    await page.click('[data-testid="delete-exercise"]');
    await page.click('[data-testid="confirm-delete"]');
    
    // 7. Verificar eliminación
    await expect(page.locator('text=Updated Exercise')).not.toBeVisible();
  });
});
```

### **MICROPASO 15: Estados de Carga**
#### ✅ **Loading States System**
- [ ] **Skeleton**: Componente base con animaciones
- [ ] **Specialized Skeletons**: ExerciseCard, TemplateCard, Table
- [ ] **EmptyState**: Estados vacíos con acciones
- [ ] **ErrorBoundary**: Manejo robusto de errores
- [ ] **Loading Transitions**: Transiciones suaves

#### 🧪 **Tests de Estados**
```typescript
describe('Loading States', () => {
  test('shows skeleton while loading', () => {
    render(<ExerciseListPage />, {
      wrapper: ({ children }) => (
        <QueryClient client={createTestQueryClient()}>
          {children}
        </QueryClient>
      )
    });
    
    expect(screen.getByTestId('list-page-skeleton')).toBeInTheDocument();
  });
  
  test('shows empty state when no data', async () => {
    // Mock empty response
    server.use(
      rest.get('/api/gym/exercises', (req, res, ctx) => {
        return res(ctx.json({ data: [], meta: { total: 0 } }));
      })
    );
    
    render(<ExerciseListPage />);
    
    await waitFor(() => {
      expect(screen.getByText('No hay ejercicios creados')).toBeInTheDocument();
    });
  });
});
```

### **MICROPASO 16: Optimización y Performance**
#### ✅ **Performance Optimizations**
- [ ] **React.memo**: Componentes memoizados
- [ ] **useMemo**: Cálculos costosos optimizados
- [ ] **useCallback**: Referencias estables
- [ ] **React Query**: Cache inteligente
- [ ] **Bundle Size**: Optimización de imports

#### 🧪 **Tests de Performance**
```typescript
describe('Performance Optimizations', () => {
  test('components are memoized correctly', () => {
    const ExerciseCard = require('../ExerciseCard').default;
    expect(ExerciseCard.$$typeof).toBe(Symbol.for('react.memo'));
  });
  
  test('expensive calculations are memoized', () => {
    const mockUseMemo = jest.spyOn(React, 'useMemo');
    render(<ExerciseFilters />);
    expect(mockUseMemo).toHaveBeenCalled();
  });
});
```

### **MICROPASO 17-21: Sistema de Usuarios**
#### ✅ **User Management System**
- [ ] **UserListPage**: Lista completa con filtros avanzados
- [ ] **UserDetailPage**: Vista detallada con estadísticas
- [ ] **UserTable**: Tabla con 7 columnas informativas
- [ ] **UserActions**: 9 acciones contextuales
- [ ] **UserFilters**: 15+ tipos de filtros
- [ ] **UserStats**: Estadísticas avanzadas

#### 🧪 **Tests de Usuario Completos**
```typescript
describe('User Management System', () => {
  test('user list with filters', async () => {
    render(<UserListPage />);
    
    // Verificar carga inicial
    await waitFor(() => {
      expect(screen.getByText('Usuarios')).toBeInTheDocument();
    });
    
    // Aplicar filtros
    await user.click(screen.getByLabelText('Roles'));
    await user.click(screen.getByText('Administrador'));
    
    // Verificar filtrado
    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument();
    });
  });
  
  test('user actions work correctly', async () => {
    render(<UserActions user={mockUser} onEdit={mockEdit} />);
    
    // Test edit action
    await user.click(screen.getByLabelText('Editar'));
    expect(mockEdit).toHaveBeenCalledWith(mockUser);
    
    // Test delete action with confirmation
    await user.click(screen.getByLabelText('Eliminar'));
    expect(screen.getByText('¿Confirmar eliminación?')).toBeInTheDocument();
  });
});
```

---

## 🌐 **TESTING MACRO (END-TO-END)**

### **🎯 Flujos Principales de Usuario**

#### **1. Flujo de Administrador**
```typescript
describe('Admin Complete Flow', () => {
  test('admin can manage users and exercises', async () => {
    // Login como admin
    await page.goto('/login');
    await page.fill('[name="email"]', 'admin@villamitre.com');
    await page.fill('[name="password"]', 'password');
    await page.click('[type="submit"]');
    
    // Verificar dashboard
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Gestionar usuarios
    await page.click('text=Usuarios');
    await expect(page.locator('h1')).toContainText('Usuarios');
    
    // Crear usuario
    await page.click('[data-testid="create-user"]');
    await page.fill('[name="first_name"]', 'Juan');
    await page.fill('[name="last_name"]', 'Pérez');
    await page.fill('[name="email"]', 'juan@test.com');
    await page.selectOption('[name="role"]', 'member');
    await page.click('[type="submit"]');
    
    // Verificar creación
    await expect(page.locator('.toast-success')).toBeVisible();
    await expect(page.locator('text=Juan Pérez')).toBeVisible();
    
    // Navegar a ejercicios
    await page.click('text=Ejercicios');
    await expect(page.locator('h1')).toContainText('Ejercicios');
    
    // Verificar funcionalidades de ejercicios
    await expect(page.locator('[data-testid="exercise-table"]')).toBeVisible();
  });
});
```

#### **2. Flujo de Profesor**
```typescript
describe('Professor Complete Flow', () => {
  test('professor can manage gym content', async () => {
    // Login como profesor
    await page.goto('/login');
    await page.fill('[name="email"]', 'profesor@villamitre.com');
    await page.fill('[name="password"]', 'password');
    await page.click('[type="submit"]');
    
    // Verificar acceso a panel de gimnasio
    await expect(page.locator('text=Panel de Gimnasio')).toBeVisible();
    
    // Gestionar ejercicios
    await page.click('text=Ejercicios');
    await page.click('[data-testid="create-exercise"]');
    
    // Crear ejercicio completo
    await page.fill('[name="name"]', 'Press de Banca');
    await page.selectOption('[name="muscle_group"]', 'chest');
    await page.selectOption('[name="equipment"]', 'barbell');
    await page.selectOption('[name="difficulty"]', 'intermediate');
    await page.fill('[name="description"]', 'Ejercicio para pecho');
    await page.click('[type="submit"]');
    
    // Verificar creación exitosa
    await expect(page.locator('.toast-success')).toBeVisible();
    
    // Gestionar plantillas
    await page.click('text=Plantillas');
    await page.click('[data-testid="create-template"]');
    
    // Crear plantilla
    await page.fill('[name="name"]', 'Rutina de Pecho');
    await page.selectOption('[name="primary_goal"]', 'strength');
    await page.click('[type="submit"]');
    
    // Verificar creación de plantilla
    await expect(page.locator('text=Rutina de Pecho')).toBeVisible();
  });
});
```

### **🔄 Flujos de Integración**

#### **3. Flujo de Datos Completo**
```typescript
describe('Data Integration Flow', () => {
  test('data flows correctly between components', async () => {
    // Crear ejercicio
    await page.goto('/gym/exercises/create');
    await page.fill('[name="name"]', 'Sentadillas');
    await page.selectOption('[name="muscle_group"]', 'legs');
    await page.click('[type="submit"]');
    
    // Verificar en lista
    await page.goto('/gym/exercises');
    await expect(page.locator('text=Sentadillas')).toBeVisible();
    
    // Usar en plantilla
    await page.goto('/gym/daily-templates/create');
    await page.fill('[name="name"]', 'Día de Piernas');
    await page.click('[data-testid="add-exercise"]');
    await page.click('text=Sentadillas');
    
    // Configurar series
    await page.fill('[name="sets"]', '3');
    await page.fill('[name="reps"]', '12');
    await page.click('[type="submit"]');
    
    // Verificar plantilla creada
    await expect(page.locator('text=Día de Piernas')).toBeVisible();
    
    // Asignar a usuario
    await page.goto('/admin/users');
    await page.click('[data-testid="assign-template"]');
    await page.selectOption('[name="template"]', 'Día de Piernas');
    await page.click('[type="submit"]');
    
    // Verificar asignación
    await expect(page.locator('.toast-success')).toBeVisible();
  });
});
```

---

## ⚡ **TESTING DE PERFORMANCE**

### **📊 Métricas de Performance**

#### **1. Tiempo de Carga**
```typescript
describe('Performance Metrics', () => {
  test('pages load within acceptable time', async () => {
    const startTime = Date.now();
    await page.goto('/gym/exercises');
    await page.waitForSelector('[data-testid="exercise-table"]');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000); // < 2 segundos
  });
  
  test('large lists render efficiently', async () => {
    // Mock 1000 exercises
    server.use(
      rest.get('/api/gym/exercises', (req, res, ctx) => {
        return res(ctx.json({
          data: Array.from({ length: 1000 }, (_, i) => ({
            id: i,
            name: `Exercise ${i}`,
            muscle_group: 'chest'
          })),
          meta: { total: 1000 }
        }));
      })
    );
    
    const startTime = performance.now();
    render(<ExerciseListPage />);
    await waitFor(() => {
      expect(screen.getByText('Exercise 0')).toBeInTheDocument();
    });
    const renderTime = performance.now() - startTime;
    
    expect(renderTime).toBeLessThan(100); // < 100ms
  });
});
```

#### **2. Memory Usage**
```typescript
describe('Memory Performance', () => {
  test('components cleanup properly', () => {
    const { unmount } = render(<ExerciseCard exercise={mockExercise} />);
    
    // Verificar que no hay memory leaks
    const initialMemory = performance.memory?.usedJSHeapSize || 0;
    unmount();
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = performance.memory?.usedJSHeapSize || 0;
    expect(finalMemory).toBeLessThanOrEqual(initialMemory);
  });
});
```

### **🚀 Optimizaciones Verificadas**

#### **React Query Cache**
- [ ] **staleTime**: 5-15 minutos según importancia
- [ ] **gcTime**: 10-15 minutos para mejor caching
- [ ] **Retry logic**: No retry para errores 4xx
- [ ] **Background refetch**: Datos frescos sin bloquear UI

#### **Component Memoization**
- [ ] **React.memo**: Todos los componentes principales
- [ ] **useMemo**: Cálculos costosos y opciones de filtros
- [ ] **useCallback**: Todos los handlers y funciones
- [ ] **Stable references**: Evita re-renders innecesarios

---

## 🔒 **TESTING DE SEGURIDAD**

### **🛡️ Validaciones y Permisos**

#### **1. Validación de Formularios**
```typescript
describe('Form Security', () => {
  test('validates required fields', async () => {
    render(<ExerciseForm />);
    
    // Intentar enviar formulario vacío
    await user.click(screen.getByRole('button', { name: /guardar/i }));
    
    // Verificar errores de validación
    expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
    expect(screen.getByText('Selecciona un grupo muscular')).toBeInTheDocument();
  });
  
  test('sanitizes input data', async () => {
    render(<ExerciseForm />);
    
    // Intentar XSS
    await user.type(screen.getByLabelText('Nombre'), '<script>alert("xss")</script>');
    await user.click(screen.getByRole('button', { name: /guardar/i }));
    
    // Verificar que el script no se ejecuta
    expect(screen.queryByText('alert("xss")')).not.toBeInTheDocument();
  });
});
```

#### **2. Control de Acceso**
```typescript
describe('Access Control', () => {
  test('redirects unauthorized users', async () => {
    // Usuario sin permisos
    mockAuth.mockReturnValue({ user: { role: 'guest' } });
    
    await page.goto('/admin/users');
    await expect(page).toHaveURL('/unauthorized');
  });
  
  test('shows only allowed actions', () => {
    const memberUser = { role: 'member' };
    render(<UserActions user={memberUser} permissions={{ canDelete: false }} />);
    
    expect(screen.queryByLabelText('Eliminar')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Ver')).toBeInTheDocument();
  });
});
```

---

## 📱 **TESTING DE RESPONSIVIDAD**

### **📐 Breakpoints y Adaptación**

#### **1. Mobile First**
```typescript
describe('Responsive Design', () => {
  test('adapts to mobile viewport', async () => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/gym/exercises');
    
    // Verificar navegación móvil
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    // Verificar tabla responsive
    await expect(page.locator('[data-testid="mobile-table"]')).toBeVisible();
  });
  
  test('tablet layout works correctly', async () => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/admin/users');
    
    // Verificar grid de 2 columnas en tablet
    const grid = page.locator('[data-testid="user-grid"]');
    await expect(grid).toHaveCSS('grid-template-columns', 'repeat(2, minmax(0, 1fr))');
  });
  
  test('desktop layout is optimal', async () => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/gym/exercises');
    
    // Verificar sidebar visible
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
    
    // Verificar tabla completa
    await expect(page.locator('[data-testid="desktop-table"]')).toBeVisible();
  });
});
```

#### **2. Touch Interactions**
```typescript
describe('Touch Interactions', () => {
  test('touch gestures work on mobile', async () => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/gym/exercises');
    
    // Swipe gesture para acciones
    await page.touchscreen.tap(100, 200);
    await page.touchscreen.tap(300, 200);
    
    // Verificar acciones táctiles
    await expect(page.locator('[data-testid="touch-actions"]')).toBeVisible();
  });
});
```

---

## ✅ **CHECKLIST DE VERIFICACIÓN**

### **🎯 Componentes UI Base**
- [ ] Button - Todas las variantes y estados
- [ ] Input - Validación y estados de error
- [ ] Card - Diferentes layouts y contenidos
- [ ] MetricCard - Visualización de datos
- [ ] DataTable - Ordenamiento, filtros, selección
- [ ] Pagination - Navegación entre páginas
- [ ] SearchInput - Búsqueda con debounce
- [ ] MultiSelect - Selección múltiple con grupos
- [ ] FormField - Validación en tiempo real
- [ ] Modal - Apertura, cierre, overlay

### **🔄 Estados y Transiciones**
- [ ] Skeleton - Animaciones de carga
- [ ] EmptyState - Estados vacíos con acciones
- [ ] ErrorBoundary - Manejo de errores
- [ ] Loading States - Transiciones suaves
- [ ] Toast Notifications - Feedback inmediato

### **🏋️ Sistema de Ejercicios**
- [ ] Lista de ejercicios con filtros
- [ ] Creación de ejercicios con validación
- [ ] Edición de ejercicios existentes
- [ ] Eliminación con confirmación
- [ ] Duplicación de ejercicios
- [ ] Filtros por grupo muscular, equipo, dificultad
- [ ] Búsqueda por nombre
- [ ] Paginación de resultados

### **👥 Sistema de Usuarios**
- [ ] Lista de usuarios con 15+ filtros
- [ ] Vista detallada con estadísticas
- [ ] 9 acciones contextuales por usuario
- [ ] Tabla con 7 columnas informativas
- [ ] Filtros avanzados (roles, estados, fechas)
- [ ] Selección múltiple y acciones masivas
- [ ] Navegación entre páginas
- [ ] Estados de carga granulares

### **📊 Plantillas y Rutinas**
- [ ] Creación de plantillas diarias
- [ ] Constructor de plantillas semanales
- [ ] Asignación a usuarios
- [ ] Wizard de 3-4 pasos
- [ ] Validación de formularios
- [ ] Gestión de ejercicios en plantillas

### **⚡ Performance y Optimización**
- [ ] React.memo en componentes principales
- [ ] useMemo para cálculos costosos
- [ ] useCallback para handlers
- [ ] React Query cache optimizado
- [ ] Bundle size optimizado
- [ ] Lazy loading preparado

### **🔒 Seguridad y Validación**
- [ ] Validación de formularios con Zod
- [ ] Sanitización de inputs
- [ ] Control de acceso por roles
- [ ] Manejo seguro de errores
- [ ] Protección contra XSS

### **📱 Responsividad**
- [ ] Mobile First design
- [ ] Breakpoints: 375px, 768px, 1024px, 1920px
- [ ] Touch interactions
- [ ] Navegación móvil
- [ ] Tablas responsive
- [ ] Grids adaptativos

### **🌐 Integración y Flujos**
- [ ] Navegación entre páginas
- [ ] Estado global compartido
- [ ] Comunicación entre componentes
- [ ] Persistencia de filtros
- [ ] URLs con parámetros
- [ ] Breadcrumbs y navegación

---

## 🚀 **COMANDOS DE TESTING**

### **Ejecutar Tests**
```bash
# Tests unitarios
npm run test

# Tests con coverage
npm run test:coverage

# Tests e2e
npm run test:e2e

# Tests de performance
npm run test:performance

# Todos los tests
npm run test:all
```

### **Configuración de Testing**
```json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:performance": "lighthouse-ci",
    "test:all": "npm run test && npm run test:e2e"
  }
}
```

---

## 📈 **MÉTRICAS DE ÉXITO**

### **Cobertura de Código**
- ✅ **Componentes**: > 90% cobertura
- ✅ **Hooks**: > 85% cobertura
- ✅ **Servicios**: > 95% cobertura
- ✅ **Páginas**: > 80% cobertura

### **Performance**
- ✅ **First Contentful Paint**: < 1.5s
- ✅ **Largest Contentful Paint**: < 2.5s
- ✅ **Time to Interactive**: < 3s
- ✅ **Cumulative Layout Shift**: < 0.1

### **Accesibilidad**
- ✅ **WCAG 2.1 AA**: Cumplimiento completo
- ✅ **Keyboard Navigation**: Totalmente funcional
- ✅ **Screen Reader**: Compatible
- ✅ **Color Contrast**: Ratio > 4.5:1

---

## 🎯 **CONCLUSIÓN**

Este plan de testing asegura la calidad y funcionamiento correcto de TODOS los features implementados en el Villa Mitre Admin Panel. Cada micropaso tiene tests específicos, y los flujos macro verifican la integración completa del sistema.

**Estado del Testing**: 🟡 **En Implementación**
**Próximo Paso**: Implementar tests unitarios para componentes base
**Meta**: 100% de features verificados y funcionando correctamente

---

*Documento creado: $(date)*
*Versión: 1.0*
*Autor: Villa Mitre Development Team*
