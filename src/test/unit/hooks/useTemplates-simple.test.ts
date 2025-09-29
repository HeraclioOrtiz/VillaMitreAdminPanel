import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderHook, waitFor } from '@/test/utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTemplates, useTemplate, useCreateTemplate } from '@/hooks/useTemplates';
import * as templateService from '@/services/template';

// Mock the template service
vi.mock('@/services/template', () => ({
  getTemplates: vi.fn(),
  getTemplate: vi.fn(),
  createTemplate: vi.fn(),
  updateTemplate: vi.fn(),
  deleteTemplate: vi.fn(),
  duplicateTemplate: vi.fn(),
  toggleFavorite: vi.fn(),
}));

const mockTemplateService = templateService as any;

describe('useTemplates Hook - Simple Tests', () => {
  let queryClient: QueryClient;
  let wrapper: React.ComponentType<{ children: React.ReactNode }>;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0, staleTime: 0 },
        mutations: { retry: false },
      },
    });
    
    wrapper = ({ children }) => (
      React.createElement(QueryClientProvider, { client: queryClient }, children)
    );
    
    vi.clearAllMocks();
  });

  describe('useTemplates', () => {
    it('should fetch templates successfully', async () => {
      const mockTemplates = {
        data: [
          {
            id: 1,
            name: 'Test Template',
            description: 'Test description',
            difficulty: 'beginner',
            primary_goal: 'strength',
            exercises: [],
            created_at: '2024-01-01T10:00:00Z',
            updated_at: '2024-01-01T10:00:00Z'
          }
        ],
        meta: {
          total: 1,
          per_page: 10,
          current_page: 1,
          last_page: 1
        }
      };

      mockTemplateService.getTemplates.mockResolvedValue(mockTemplates);

      const { result } = renderHook(() => useTemplates(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockTemplates);
      expect(mockTemplateService.getTemplates).toHaveBeenCalledWith({});
    });

    it('should handle templates fetch error', async () => {
      const mockError = new Error('Failed to fetch templates');
      mockTemplateService.getTemplates.mockRejectedValue(mockError);

      const { result } = renderHook(() => useTemplates(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(mockError);
    });

    it('should fetch templates with filters', async () => {
      const filters = {
        search: 'test',
        difficulty: ['beginner'],
        primary_goal: ['strength']
      };

      mockTemplateService.getTemplates.mockResolvedValue({ data: [], meta: {} });

      const { result } = renderHook(() => useTemplates(filters), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockTemplateService.getTemplates).toHaveBeenCalledWith(filters);
    });

    it('should be loading initially', () => {
      mockTemplateService.getTemplates.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useTemplates(), { wrapper });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('useTemplate', () => {
    it('should fetch single template successfully', async () => {
      const mockTemplate = {
        id: 1,
        name: 'Test Template',
        description: 'Test description',
        difficulty: 'beginner',
        primary_goal: 'strength',
        exercises: [],
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-01T10:00:00Z'
      };

      mockTemplateService.getTemplate.mockResolvedValue(mockTemplate);

      const { result } = renderHook(() => useTemplate(1), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockTemplate);
      expect(mockTemplateService.getTemplate).toHaveBeenCalledWith(1);
    });

    it('should handle single template fetch error', async () => {
      const mockError = new Error('Template not found');
      mockTemplateService.getTemplate.mockRejectedValue(mockError);

      const { result } = renderHook(() => useTemplate(1), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(mockError);
    });

    it('should not fetch when id is undefined', () => {
      const { result } = renderHook(() => useTemplate(0), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(mockTemplateService.getTemplate).not.toHaveBeenCalled();
    });
  });

  describe('useCreateTemplate', () => {
    it('should create template successfully', async () => {
      const newTemplate = {
        name: 'New Template',
        description: 'New description',
        difficulty: 'beginner' as const,
        primary_goal: 'strength' as const,
        exercises: [],
        estimated_duration: 45,
        target_muscle_groups: ['chest', 'shoulders'],
        equipment_needed: ['dumbbells'],
        intensity_level: 'moderate' as const,
        is_public: false,
        tags: ['strength', 'beginner']
      };

      const createdTemplate = {
        id: 1,
        ...newTemplate,
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-01T10:00:00Z'
      };

      mockTemplateService.createTemplate.mockResolvedValue(createdTemplate);

      const { result } = renderHook(() => useCreateTemplate(), { wrapper });

      await result.current.mutateAsync(newTemplate);

      expect(mockTemplateService.createTemplate).toHaveBeenCalledWith(newTemplate);
    });

    it('should handle create template error', async () => {
      const newTemplate = {
        name: 'New Template',
        description: 'New description',
        difficulty: 'beginner' as const,
        primary_goal: 'strength' as const,
        exercises: [],
        estimated_duration: 45,
        target_muscle_groups: ['chest', 'shoulders'],
        equipment_needed: ['dumbbells'],
        intensity_level: 'moderate' as const,
        is_public: false,
        tags: ['strength', 'beginner']
      };

      const mockError = new Error('Failed to create template');
      mockTemplateService.createTemplate.mockRejectedValue(mockError);

      const { result } = renderHook(() => useCreateTemplate(), { wrapper });

      await expect(result.current.mutateAsync(newTemplate)).rejects.toThrow('Failed to create template');
    });

    it('should call onSuccess callback', async () => {
      const onSuccess = vi.fn();
      const newTemplate = {
        name: 'New Template',
        description: 'New description',
        difficulty: 'beginner' as const,
        primary_goal: 'strength' as const,
        exercises: [],
        estimated_duration: 45,
        target_muscle_groups: ['chest', 'shoulders'],
        equipment_needed: ['dumbbells'],
        intensity_level: 'moderate' as const,
        is_public: false,
        tags: ['strength', 'beginner']
      };

      const createdTemplate = {
        id: 1,
        ...newTemplate,
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-01T10:00:00Z'
      };

      mockTemplateService.createTemplate.mockResolvedValue(createdTemplate);

      const { result } = renderHook(() => useCreateTemplate({ onSuccess }), { wrapper });

      await result.current.mutateAsync(newTemplate);

      expect(onSuccess).toHaveBeenCalledWith(createdTemplate, newTemplate, expect.any(Object));
    });

    it('should call onError callback', async () => {
      const onError = vi.fn();
      const newTemplate = {
        name: 'New Template',
        description: 'New description',
        difficulty: 'beginner' as const,
        primary_goal: 'strength' as const,
        exercises: [],
        estimated_duration: 45,
        target_muscle_groups: ['chest', 'shoulders'],
        equipment_needed: ['dumbbells'],
        intensity_level: 'moderate' as const,
        is_public: false,
        tags: ['strength', 'beginner']
      };

      const mockError = new Error('Failed to create template');
      mockTemplateService.createTemplate.mockRejectedValue(mockError);

      const { result } = renderHook(() => useCreateTemplate({ onError }), { wrapper });

      try {
        await result.current.mutateAsync(newTemplate);
      } catch (error) {
        // Expected to throw
      }

      expect(onError).toHaveBeenCalledWith(mockError, newTemplate, expect.any(Object));
    });
  });
});
