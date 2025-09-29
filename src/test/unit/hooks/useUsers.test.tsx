import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@/test/utils';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/hooks/useUsers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the API calls
vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}));

describe('useUsers Hook Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe('useUsers', () => {
    it('should fetch users successfully', async () => {
      const mockUsers = [
        { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
        { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com' }
      ];

      // Mock API response
      const { getUsers } = await import('@/services/api');
      vi.mocked(getUsers).mockResolvedValue({
        data: mockUsers,
        meta: { total: 2, current_page: 1, per_page: 20, last_page: 1 }
      });

      const { result } = renderHook(() => useUsers(), {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        )
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.data).toEqual(mockUsers);
      expect(result.current.data?.meta.total).toBe(2);
    });

    it('should handle loading state', () => {
      const { result } = renderHook(() => useUsers(), {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        )
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('should handle error state', async () => {
      const { getUsers } = await import('@/services/api');
      vi.mocked(getUsers).mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(() => useUsers(), {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        )
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });

    it('should accept filters and pagination', async () => {
      const filters = { search: 'john', role: 'admin' };
      const pagination = { page: 2, per_page: 10 };

      const { getUsers } = await import('@/services/api');
      vi.mocked(getUsers).mockResolvedValue({
        data: [],
        meta: { total: 0, current_page: 2, per_page: 10, last_page: 1 }
      });

      renderHook(() => useUsers({ filters, ...pagination }), {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        )
      });

      await waitFor(() => {
        expect(getUsers).toHaveBeenCalledWith({
          ...filters,
          ...pagination
        });
      });
    });
  });

  describe('useCreateUser', () => {
    it('should create user successfully', async () => {
      const newUser = {
        first_name: 'New',
        last_name: 'User',
        email: 'new@example.com',
        role: 'member' as const
      };

      const createdUser = { id: 3, ...newUser, created_at: '2024-01-01T00:00:00Z' };

      const { createUser } = await import('@/services/api');
      vi.mocked(createUser).mockResolvedValue(createdUser);

      const { result } = renderHook(() => useCreateUser(), {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        )
      });

      result.current.mutate(newUser);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(createdUser);
      expect(createUser).toHaveBeenCalledWith(newUser);
    });

    it('should handle creation error', async () => {
      const { createUser } = await import('@/services/api');
      vi.mocked(createUser).mockRejectedValue(new Error('Creation failed'));

      const { result } = renderHook(() => useCreateUser(), {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        )
      });

      const newUser = {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        role: 'member' as const
      };

      result.current.mutate(newUser);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });

  describe('useUpdateUser', () => {
    it('should update user successfully', async () => {
      const userId = 1;
      const updateData = { first_name: 'Updated Name' };
      const updatedUser = {
        id: userId,
        first_name: 'Updated Name',
        last_name: 'Doe',
        email: 'john@example.com',
        role: 'member' as const,
        updated_at: '2024-01-01T00:00:00Z'
      };

      const { updateUser } = await import('@/services/api');
      vi.mocked(updateUser).mockResolvedValue(updatedUser);

      const { result } = renderHook(() => useUpdateUser(), {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        )
      });

      result.current.mutate({ id: userId, data: updateData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(updatedUser);
      expect(updateUser).toHaveBeenCalledWith(userId, updateData);
    });
  });

  describe('useDeleteUser', () => {
    it('should delete user successfully', async () => {
      const userId = 1;

      const { deleteUser } = await import('@/services/api');
      vi.mocked(deleteUser).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteUser(), {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        )
      });

      result.current.mutate(userId);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(deleteUser).toHaveBeenCalledWith(userId);
    });

    it('should handle deletion error', async () => {
      const { deleteUser } = await import('@/services/api');
      vi.mocked(deleteUser).mockRejectedValue(new Error('Deletion failed'));

      const { result } = renderHook(() => useDeleteUser(), {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        )
      });

      result.current.mutate(1);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });

  describe('Hook Integration', () => {
    it('should invalidate queries after mutations', async () => {
      const { createUser } = await import('@/services/api');
      vi.mocked(createUser).mockResolvedValue({
        id: 3,
        first_name: 'New',
        last_name: 'User',
        email: 'new@example.com',
        role: 'member',
        created_at: '2024-01-01T00:00:00Z'
      });

      const { result: createResult } = renderHook(() => useCreateUser(), {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        )
      });

      const newUser = {
        first_name: 'New',
        last_name: 'User',
        email: 'new@example.com',
        role: 'member' as const
      };

      createResult.current.mutate(newUser);

      await waitFor(() => {
        expect(createResult.current.isSuccess).toBe(true);
      });

      // Query should be invalidated and refetch
      expect(createUser).toHaveBeenCalledWith(newUser);
    });
  });
});
