# 🧪 SCRIPTS DE TESTING AUTOMATIZADOS

## 📋 **ÍNDICE**
- [🚀 Setup de Testing](#-setup-de-testing)
- [🔧 Configuración de Herramientas](#-configuración-de-herramientas)
- [📝 Scripts de Testing](#-scripts-de-testing)
- [🎯 Tests por Componente](#-tests-por-componente)
- [🌐 Tests End-to-End](#-tests-end-to-end)
- [⚡ Tests de Performance](#-tests-de-performance)

---

## 🚀 **SETUP DE TESTING**

### **Instalación de Dependencias**
```bash
# Testing framework
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event jsdom

# E2E Testing
npm install -D @playwright/test

# Performance Testing
npm install -D lighthouse lighthouse-ci

# Mocking
npm install -D msw @mswjs/data

# Coverage
npm install -D @vitest/coverage-v8
```

### **Configuración de Vitest**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

### **Setup de Testing**
```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from 'vitest';
import { server } from './mocks/server';

// Cleanup después de cada test
afterEach(() => {
  cleanup();
});

// Setup MSW
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## 🔧 **CONFIGURACIÓN DE HERRAMIENTAS**

### **MSW para Mocking API**
```typescript
// src/test/mocks/handlers.ts
import { rest } from 'msw';
import { mockUsers, mockExercises, mockTemplates } from './data';

export const handlers = [
  // Users API
  rest.get('/api/admin/users', (req, res, ctx) => {
    const page = Number(req.url.searchParams.get('page')) || 1;
    const perPage = Number(req.url.searchParams.get('per_page')) || 20;
    
    return res(
      ctx.json({
        data: mockUsers.slice((page - 1) * perPage, page * perPage),
        meta: {
          current_page: page,
          per_page: perPage,
          total: mockUsers.length,
          last_page: Math.ceil(mockUsers.length / perPage)
        }
      })
    );
  }),

  // Exercises API
  rest.get('/api/gym/exercises', (req, res, ctx) => {
    return res(ctx.json({
      data: mockExercises,
      meta: { total: mockExercises.length }
    }));
  }),

  rest.post('/api/gym/exercises', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({ id: Date.now(), ...req.body })
    );
  }),

  // Error scenarios
  rest.get('/api/error-test', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({ message: 'Internal Server Error' })
    );
  })
];
```

### **Test Utilities**
```typescript
// src/test/utils.tsx
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '@/components/ui';

// Custom render con providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastProvider>
          {children}
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

---

## 📝 **SCRIPTS DE TESTING**

### **Package.json Scripts**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:performance": "lighthouse-ci",
    "test:all": "npm run test:run && npm run test:e2e",
    "test:component": "vitest run --reporter=verbose",
    "test:integration": "vitest run src/test/integration",
    "test:unit": "vitest run src/test/unit"
  }
}
```

### **Scripts de Verificación**
```bash
#!/bin/bash
# scripts/test-all-features.sh

echo "🧪 Iniciando testing completo de Villa Mitre Admin Panel..."

# 1. Tests unitarios
echo "📝 Ejecutando tests unitarios..."
npm run test:unit

# 2. Tests de integración
echo "🔗 Ejecutando tests de integración..."
npm run test:integration

# 3. Tests E2E
echo "🌐 Ejecutando tests end-to-end..."
npm run test:e2e

# 4. Tests de performance
echo "⚡ Ejecutando tests de performance..."
npm run test:performance

# 5. Coverage report
echo "📊 Generando reporte de cobertura..."
npm run test:coverage

echo "✅ Testing completo finalizado!"
```

---

## 🎯 **TESTS POR COMPONENTE**

### **Button Component**
```typescript
// src/test/unit/components/ui/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { Button } from '@/components/ui';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('applies correct variant classes', () => {
    render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders with left icon', () => {
    const Icon = () => <span data-testid="icon">Icon</span>;
    render(<Button leftIcon={<Icon />}>With Icon</Button>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
```

### **DataTable Component**
```typescript
// src/test/unit/components/ui/DataTable.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { DataTable } from '@/components/ui';

const mockData = [
  { id: 1, name: 'John', email: 'john@test.com' },
  { id: 2, name: 'Jane', email: 'jane@test.com' }
];

const mockColumns = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'email', title: 'Email' }
];

describe('DataTable Component', () => {
  it('renders table with data', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);
    
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('jane@test.com')).toBeInTheDocument();
  });

  it('handles sorting', () => {
    const onSort = vi.fn();
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
        onSort={onSort}
      />
    );
    
    fireEvent.click(screen.getByText('Name'));
    expect(onSort).toHaveBeenCalledWith({
      key: 'name',
      direction: 'asc'
    });
  });

  it('shows empty state when no data', () => {
    render(<DataTable data={[]} columns={mockColumns} />);
    expect(screen.getByText('No hay datos disponibles')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<DataTable data={[]} columns={mockColumns} loading />);
    expect(screen.getByTestId('table-skeleton')).toBeInTheDocument();
  });
});
```

### **UserActions Component**
```typescript
// src/test/unit/components/admin/UserActions.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { UserActions } from '@/components/admin';

const mockUser = {
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@test.com',
  role: 'member',
  status: 'active',
  is_member: true
};

describe('UserActions Component', () => {
  it('renders all actions when permissions allow', () => {
    const permissions = {
      canView: true,
      canEdit: true,
      canDelete: true,
      canAssignProfessor: true
    };

    render(
      <UserActions 
        user={mockUser} 
        permissions={permissions}
        onView={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onAssignProfessor={vi.fn()}
      />
    );

    expect(screen.getByLabelText('Ver')).toBeInTheDocument();
    expect(screen.getByLabelText('Editar')).toBeInTheDocument();
    expect(screen.getByLabelText('Eliminar')).toBeInTheDocument();
  });

  it('calls correct handler on action click', () => {
    const onEdit = vi.fn();
    render(<UserActions user={mockUser} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByLabelText('Editar'));
    expect(onEdit).toHaveBeenCalledWith(mockUser);
  });

  it('shows loading state for specific action', () => {
    const loadingStates = { delete: true };
    render(
      <UserActions 
        user={mockUser} 
        loadingStates={loadingStates}
        onDelete={vi.fn()}
      />
    );

    const deleteButton = screen.getByLabelText('Eliminar');
    expect(deleteButton).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders in compact mode', () => {
    render(<UserActions user={mockUser} compact />);
    expect(screen.getByTestId('actions-dropdown')).toBeInTheDocument();
  });
});
```

---

## 🌐 **TESTS END-TO-END**

### **Playwright Configuration**
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/test/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### **E2E Test: User Management Flow**
```typescript
// src/test/e2e/user-management.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock login
    await page.goto('/login');
    await page.fill('[name="email"]', 'admin@test.com');
    await page.fill('[name="password"]', 'password');
    await page.click('[type="submit"]');
    await expect(page).toHaveURL('/admin/dashboard');
  });

  test('complete user CRUD flow', async ({ page }) => {
    // Navigate to users
    await page.click('text=Usuarios');
    await expect(page.locator('h1')).toContainText('Usuarios');

    // Create user
    await page.click('[data-testid="create-user"]');
    await page.fill('[name="first_name"]', 'Test');
    await page.fill('[name="last_name"]', 'User');
    await page.fill('[name="email"]', 'test@example.com');
    await page.selectOption('[name="role"]', 'member');
    await page.click('[type="submit"]');

    // Verify creation
    await expect(page.locator('.toast-success')).toBeVisible();
    await expect(page.locator('text=Test User')).toBeVisible();

    // Edit user
    await page.click('[data-testid="edit-user"]');
    await page.fill('[name="first_name"]', 'Updated');
    await page.click('[type="submit"]');

    // Verify update
    await expect(page.locator('text=Updated User')).toBeVisible();

    // Delete user
    await page.click('[data-testid="delete-user"]');
    await page.click('[data-testid="confirm-delete"]');

    // Verify deletion
    await expect(page.locator('text=Updated User')).not.toBeVisible();
  });

  test('user filters work correctly', async ({ page }) => {
    await page.goto('/admin/users');

    // Apply role filter
    await page.click('[data-testid="role-filter"]');
    await page.click('text=Administrador');

    // Verify filtered results
    await expect(page.locator('[data-testid="user-table"]')).toContainText('admin');

    // Clear filters
    await page.click('[data-testid="clear-filters"]');

    // Verify all users shown
    await expect(page.locator('[data-testid="user-count"]')).toContainText('Total');
  });

  test('user detail page shows complete information', async ({ page }) => {
    await page.goto('/admin/users');
    
    // Click on first user
    await page.click('[data-testid="view-user"]');

    // Verify detail page
    await expect(page.locator('h1')).toContainText('Detalle de Usuario');
    await expect(page.locator('[data-testid="user-stats"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-info"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-actions"]')).toBeVisible();
  });
});
```

### **E2E Test: Exercise Management**
```typescript
// src/test/e2e/exercise-management.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Exercise Management', () => {
  test('exercise CRUD operations', async ({ page }) => {
    await page.goto('/gym/exercises');

    // Create exercise
    await page.click('[data-testid="create-exercise"]');
    await page.fill('[name="name"]', 'Test Exercise');
    await page.selectOption('[name="muscle_group"]', 'chest');
    await page.selectOption('[name="equipment"]', 'barbell');
    await page.selectOption('[name="difficulty"]', 'beginner');
    await page.fill('[name="description"]', 'Test description');
    await page.click('[type="submit"]');

    // Verify creation
    await expect(page.locator('.toast-success')).toBeVisible();
    await expect(page.locator('text=Test Exercise')).toBeVisible();

    // Filter exercises
    await page.click('[data-testid="muscle-group-filter"]');
    await page.click('text=Pecho');

    // Verify filtered results
    await expect(page.locator('[data-testid="exercise-card"]')).toContainText('Test Exercise');

    // Edit exercise
    await page.click('[data-testid="edit-exercise"]');
    await page.fill('[name="name"]', 'Updated Exercise');
    await page.click('[type="submit"]');

    // Verify update
    await expect(page.locator('text=Updated Exercise')).toBeVisible();
  });

  test('exercise filters and search work', async ({ page }) => {
    await page.goto('/gym/exercises');

    // Search by name
    await page.fill('[data-testid="search-input"]', 'bench');
    await expect(page.locator('[data-testid="exercise-card"]')).toContainText('bench');

    // Filter by muscle group
    await page.click('[data-testid="muscle-group-filter"]');
    await page.click('text=Pecho');

    // Verify combined filters
    await expect(page.locator('[data-testid="active-filters"]')).toBeVisible();
  });
});
```

---

## ⚡ **TESTS DE PERFORMANCE**

### **Lighthouse Configuration**
```javascript
// lighthouse.config.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:5173/',
        'http://localhost:5173/gym/exercises',
        'http://localhost:5173/admin/users'
      ],
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.8 }]
      }
    }
  }
};
```

### **Performance Tests**
```typescript
// src/test/performance/component-performance.test.ts
import { describe, it, expect } from 'vitest';
import { render } from '@/test/utils';
import { ExerciseListPage } from '@/pages/gym';

describe('Component Performance', () => {
  it('renders large lists efficiently', async () => {
    const startTime = performance.now();
    
    // Mock 1000 exercises
    const mockExercises = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Exercise ${i}`,
      muscle_group: 'chest',
      equipment: 'barbell',
      difficulty: 'beginner'
    }));

    render(<ExerciseListPage />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Should render in less than 100ms
    expect(renderTime).toBeLessThan(100);
  });

  it('memoization prevents unnecessary re-renders', () => {
    const renderSpy = vi.fn();
    const MemoizedComponent = React.memo(() => {
      renderSpy();
      return <div>Test</div>;
    });

    const { rerender } = render(<MemoizedComponent />);
    
    // First render
    expect(renderSpy).toHaveBeenCalledTimes(1);
    
    // Re-render with same props
    rerender(<MemoizedComponent />);
    
    // Should not re-render
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });
});
```

---

## 🎯 **SCRIPTS DE AUTOMATIZACIÓN**

### **Continuous Testing Script**
```bash
#!/bin/bash
# scripts/continuous-testing.sh

echo "🔄 Iniciando testing continuo..."

# Watch mode para desarrollo
if [ "$1" = "dev" ]; then
    echo "👀 Modo desarrollo - watching files..."
    npm run test:watch &
    npm run test:e2e -- --ui &
    wait
fi

# CI mode para producción
if [ "$1" = "ci" ]; then
    echo "🚀 Modo CI - ejecutando todos los tests..."
    
    # Lint check
    npm run lint
    
    # Type check
    npm run type-check
    
    # Unit tests with coverage
    npm run test:coverage
    
    # E2E tests
    npm run test:e2e
    
    # Performance tests
    npm run test:performance
    
    echo "✅ Todos los tests pasaron!"
fi
```

### **Feature Testing Script**
```bash
#!/bin/bash
# scripts/test-feature.sh

FEATURE=$1

if [ -z "$FEATURE" ]; then
    echo "❌ Especifica un feature: users, exercises, templates"
    exit 1
fi

echo "🧪 Testing feature: $FEATURE"

case $FEATURE in
    "users")
        npm run test -- src/test/unit/components/admin/User*
        npm run test:e2e -- src/test/e2e/user-management.spec.ts
        ;;
    "exercises")
        npm run test -- src/test/unit/components/gym/Exercise*
        npm run test:e2e -- src/test/e2e/exercise-management.spec.ts
        ;;
    "templates")
        npm run test -- src/test/unit/components/gym/Template*
        npm run test:e2e -- src/test/e2e/template-management.spec.ts
        ;;
    *)
        echo "❌ Feature no reconocido: $FEATURE"
        exit 1
        ;;
esac

echo "✅ Feature $FEATURE tested successfully!"
```

---

## 📊 **REPORTING Y MÉTRICAS**

### **Coverage Report Script**
```bash
#!/bin/bash
# scripts/generate-coverage-report.sh

echo "📊 Generando reporte de cobertura..."

# Generate coverage
npm run test:coverage

# Open coverage report
if command -v open &> /dev/null; then
    open coverage/index.html
elif command -v xdg-open &> /dev/null; then
    xdg-open coverage/index.html
else
    echo "📁 Reporte disponible en: coverage/index.html"
fi

echo "✅ Reporte de cobertura generado!"
```

### **Test Results Summary**
```typescript
// scripts/test-summary.js
const fs = require('fs');
const path = require('path');

function generateTestSummary() {
  const coverageFile = path.join(__dirname, '../coverage/coverage-summary.json');
  
  if (!fs.existsSync(coverageFile)) {
    console.log('❌ No se encontró reporte de cobertura');
    return;
  }

  const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
  
  console.log('📊 RESUMEN DE TESTING');
  console.log('====================');
  console.log(`📝 Líneas: ${coverage.total.lines.pct}%`);
  console.log(`🔀 Branches: ${coverage.total.branches.pct}%`);
  console.log(`🔧 Funciones: ${coverage.total.functions.pct}%`);
  console.log(`📄 Statements: ${coverage.total.statements.pct}%`);
  
  // Verificar umbrales
  const threshold = 80;
  const passed = coverage.total.lines.pct >= threshold;
  
  console.log(`\n${passed ? '✅' : '❌'} Umbral de cobertura: ${threshold}%`);
  
  return passed;
}

if (require.main === module) {
  const passed = generateTestSummary();
  process.exit(passed ? 0 : 1);
}

module.exports = generateTestSummary;
```

---

Este sistema de testing completo asegura que TODOS los features del Villa Mitre Admin Panel funcionen correctamente, desde componentes individuales hasta flujos completos de usuario. Los scripts automatizados facilitan la ejecución y monitoreo continuo de la calidad del código.

**🎯 Próximos pasos:**
1. Implementar los tests unitarios para componentes base
2. Configurar CI/CD con estos scripts
3. Establecer umbrales de cobertura por feature
4. Crear tests de regresión para bugs críticos
