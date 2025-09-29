import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '@/components/ui';

// Custom render con providers necesarios
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
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

// Helper para crear QueryClient de testing
export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
      staleTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
});

// Helper para esperar por queries
export const waitForQueryToSettle = async (queryClient: QueryClient) => {
  await queryClient.getQueryCache().getAll().forEach(query => {
    if (query.state.fetchStatus === 'fetching') {
      return query.promise;
    }
  });
};

// Mock user para testing
export const mockUser = {
  id: 1,
  first_name: 'Test',
  last_name: 'User',
  email: 'test@example.com',
  role: 'member' as const,
  is_super_admin: false,
  is_admin: false,
  is_professor: false,
  is_member: true,
  status: 'active' as const,
  membership_status: 'active' as const,
  traffic_light_status: 'green' as const,
  created_at: '2024-01-01T10:00:00Z',
  updated_at: '2024-01-01T10:00:00Z'
};

// Mock exercise para testing
export const mockExercise = {
  id: 1,
  name: 'Test Exercise',
  description: 'Test description',
  instructions: 'Test instructions',
  muscle_group: ['chest'],
  equipment: ['barbell'],
  difficulty: 'beginner' as const,
  tags: ['test'],
  created_at: '2024-01-01T10:00:00Z',
  updated_at: '2024-01-01T10:00:00Z'
};

// Re-export everything from testing-library
export * from '@testing-library/react';
export { customRender as render };
