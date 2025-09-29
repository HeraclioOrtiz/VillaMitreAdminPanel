import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import {
  useTemplates,
  useTemplate,
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate,
  useDuplicateTemplate,
  useToggleFavoriteTemplate,
  useBulkDeleteTemplates,
  useTemplateStats,
  useSimilarTemplates,
  useRecommendedTemplates,
} from '@/hooks/useTemplates';
import * as templateService from '@/services/template';
import { DailyTemplate, TemplateFilters, TemplateListResponse } from '@/types/template';

// Mock del servicio de templates
vi.mock('@/services/template');

const mockTemplateService = vi.mocked(templateService);

// Mock data
const mockTemplate: DailyTemplate = {
  id: 1,
  name: 'Test Template',
  description: 'Test description',
  exercises: [
    {
      id: 1,
      exercise_id: 1,
      order: 1,
      sets: [
        {
          id: '1',
          reps: 10,
          weight: 50,
          rest_time: 60,
          rpe: 8,
          tempo: '2-1-2-1',
          notes: 'Test notes'
        }
      ]
    }
  ],
  primary_goal: 'strength',
  secondary_goals: ['hypertrophy'],
  target_muscle_groups: ['chest', 'shoulders'],
  equipment_needed: ['barbell', 'bench'],
  difficulty: 'intermediate',
  estimated_duration: 60,
  intensity_level: 'high',
  tags: ['push', 'upper'],
  is_public: true,
  is_favorite: false,
  usage_count: 5,
  created_by: 1,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

const mockTemplateListResponse: TemplateListResponse = {
  data: [mockTemplate],
  meta: {
    current_page: 1,
    per_page: 10,
    total: 1,
    last_page: 1
  }
};

const mockTemplateStats = {
  total_templates: 10,
  public_templates: 7,
  private_templates: 3,
  favorite_templates: 2,
  most_used_goals: [
    { goal: 'strength', count: 5 },
    { goal: 'hypertrophy', count: 3 }
  ],
  most_used_muscle_groups: [
    { muscle_group: 'chest', count: 4 },
    { muscle_group: 'back', count: 3 }
  ],
  average_duration: 65,
  difficulty_distribution: {
    beginner: 2,
    intermediate: 6,
    advanced: 2
  }
};

// Query client wrapper
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useTemplates Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches templates successfully', async () => {
    mockTemplateService.getTemplates.mockResolvedValue(mockTemplateListResponse);

    const { result } = renderHook(
      () => useTemplates({}),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockTemplateListResponse);
    expect(mockTemplateService.getTemplates).toHaveBeenCalledWith({});
  });

  it('applies filters correctly', async () => {
    const filters: TemplateFilters = {
      search: 'test',
      primary_goal: ['strength'],
      difficulty: 'intermediate',
      is_public: true
    };

    mockTemplateService.getTemplates.mockResolvedValue(mockTemplateListResponse);

    renderHook(
      () => useTemplates(filters),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(mockTemplateService.getTemplates).toHaveBeenCalledWith(filters);
    });
  });

  it('handles pagination correctly', async () => {
    const filters = { page: 2, per_page: 20 };

    mockTemplateService.getTemplates.mockResolvedValue(mockTemplateListResponse);

    renderHook(
      () => useTemplates(filters),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(mockTemplateService.getTemplates).toHaveBeenCalledWith(filters);
    });
  });

  it('handles error state', async () => {
    const error = new Error('Failed to fetch templates');
    mockTemplateService.getTemplates.mockRejectedValue(error);

    const { result } = renderHook(
      () => useTemplates({}),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });
});

describe('useTemplate Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches single template successfully', async () => {
    mockTemplateService.getTemplate.mockResolvedValue(mockTemplate);

    const { result } = renderHook(
      () => useTemplate(1),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockTemplate);
    expect(mockTemplateService.getTemplate).toHaveBeenCalledWith(1);
  });

  it('does not fetch when id is undefined', () => {
    renderHook(
      () => useTemplate(undefined),
      { wrapper: createWrapper() }
    );

    expect(mockTemplateService.getTemplate).not.toHaveBeenCalled();
  });

  it('handles template not found error', async () => {
    const error = new Error('Template not found');
    mockTemplateService.getTemplate.mockRejectedValue(error);

    const { result } = renderHook(
      () => useTemplate(999),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });
});

describe('useCreateTemplate Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates template successfully', async () => {
    const newTemplate = { ...mockTemplate, id: 2 };
    mockTemplateService.createTemplate.mockResolvedValue(newTemplate);

    const { result } = renderHook(
      () => useCreateTemplate(),
      { wrapper: createWrapper() }
    );

    const templateData = {
      name: 'New Template',
      description: 'New description',
      exercises: [],
      primary_goal: 'strength' as const,
      difficulty_level: 'beginner' as const,
      estimated_duration: 45,
      intensity_level: 'moderate' as const,
      is_public: false
    };

    result.current.mutate(templateData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(newTemplate);
    expect(mockTemplateService.createTemplate).toHaveBeenCalledWith(templateData);
  });

  it('handles create template error', async () => {
    const error = new Error('Failed to create template');
    mockTemplateService.createTemplate.mockRejectedValue(error);

    const { result } = renderHook(
      () => useCreateTemplate(),
      { wrapper: createWrapper() }
    );

    const templateData = {
      name: 'New Template',
      exercises: [],
      primary_goal: 'strength' as const,
      difficulty_level: 'beginner' as const,
      estimated_duration: 45,
      intensity_level: 'moderate' as const,
      is_public: false
    };

    result.current.mutate(templateData);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });

  it('calls success callback on successful creation', async () => {
    const onSuccess = vi.fn();
    const newTemplate = { ...mockTemplate, id: 2 };
    mockTemplateService.createTemplate.mockResolvedValue(newTemplate);

    const { result } = renderHook(
      () => useCreateTemplate({ onSuccess }),
      { wrapper: createWrapper() }
    );

    const templateData = {
      name: 'New Template',
      exercises: [],
      primary_goal: 'strength' as const,
      difficulty_level: 'beginner' as const,
      estimated_duration: 45,
      intensity_level: 'moderate' as const,
      is_public: false
    };

    result.current.mutate(templateData);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(newTemplate, templateData, undefined);
    });
  });
});

describe('useUpdateTemplate Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates template successfully', async () => {
    const updatedTemplate = { ...mockTemplate, name: 'Updated Template' };
    mockTemplateService.updateTemplate.mockResolvedValue(updatedTemplate);

    const { result } = renderHook(
      () => useUpdateTemplate(),
      { wrapper: createWrapper() }
    );

    const updateData = {
      id: 1,
      name: 'Updated Template'
    };

    result.current.mutate(updateData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(updatedTemplate);
    expect(mockTemplateService.updateTemplate).toHaveBeenCalledWith(1, { name: 'Updated Template' });
  });

  it('handles update template error', async () => {
    const error = new Error('Failed to update template');
    mockTemplateService.updateTemplate.mockRejectedValue(error);

    const { result } = renderHook(
      () => useUpdateTemplate(),
      { wrapper: createWrapper() }
    );

    result.current.mutate({ id: 1, name: 'Updated Template' });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });
});

describe('useDeleteTemplate Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes template successfully', async () => {
    mockTemplateService.deleteTemplate.mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useDeleteTemplate(),
      { wrapper: createWrapper() }
    );

    result.current.mutate(1);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockTemplateService.deleteTemplate).toHaveBeenCalledWith(1);
  });

  it('handles delete template error', async () => {
    const error = new Error('Failed to delete template');
    mockTemplateService.deleteTemplate.mockRejectedValue(error);

    const { result } = renderHook(
      () => useDeleteTemplate(),
      { wrapper: createWrapper() }
    );

    result.current.mutate(1);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });
});

describe('useDuplicateTemplate Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('duplicates template successfully', async () => {
    const duplicatedTemplate = { ...mockTemplate, id: 2, name: 'Copy of Test Template' };
    mockTemplateService.duplicateTemplate.mockResolvedValue(duplicatedTemplate);

    const { result } = renderHook(
      () => useDuplicateTemplate(),
      { wrapper: createWrapper() }
    );

    result.current.mutate(1);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(duplicatedTemplate);
    expect(mockTemplateService.duplicateTemplate).toHaveBeenCalledWith(1);
  });
});

describe('useToggleFavoriteTemplate Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('toggles favorite status successfully', async () => {
    const updatedTemplate = { ...mockTemplate, is_favorite: true };
    mockTemplateService.toggleFavorite.mockResolvedValue(updatedTemplate);

    const { result } = renderHook(
      () => useToggleFavoriteTemplate(),
      { wrapper: createWrapper() }
    );

    result.current.mutate(1);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(updatedTemplate);
    expect(mockTemplateService.toggleFavorite).toHaveBeenCalledWith(1);
  });
});

describe('useBulkDeleteTemplates Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('bulk deletes templates successfully', async () => {
    mockTemplateService.bulkDeleteTemplates.mockResolvedValue({ deleted_count: 3 });

    const { result } = renderHook(
      () => useBulkDeleteTemplates(),
      { wrapper: createWrapper() }
    );

    result.current.mutate([1, 2, 3]);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual({ deleted_count: 3 });
    expect(mockTemplateService.bulkDeleteTemplates).toHaveBeenCalledWith([1, 2, 3]);
  });
});

describe('useTemplateStats Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches template stats successfully', async () => {
    mockTemplateService.getTemplateStats.mockResolvedValue(mockTemplateStats);

    const { result } = renderHook(
      () => useTemplateStats(),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockTemplateStats);
    expect(mockTemplateService.getTemplateStats).toHaveBeenCalled();
  });
});

describe('useSimilarTemplates Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches similar templates successfully', async () => {
    const similarTemplates = [{ ...mockTemplate, id: 2, name: 'Similar Template' }];
    mockTemplateService.findSimilarTemplates.mockResolvedValue(similarTemplates);

    const { result } = renderHook(
      () => useSimilarTemplates(1),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(similarTemplates);
    expect(mockTemplateService.findSimilarTemplates).toHaveBeenCalledWith(1);
  });

  it('does not fetch when templateId is undefined', () => {
    renderHook(
      () => useSimilarTemplates(undefined),
      { wrapper: createWrapper() }
    );

    expect(mockTemplateService.findSimilarTemplates).not.toHaveBeenCalled();
  });
});

describe('useRecommendedTemplates Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches recommended templates successfully', async () => {
    const recommendedTemplates = [mockTemplate];
    mockTemplateService.getRecommendedTemplates.mockResolvedValue(recommendedTemplates);

    const { result } = renderHook(
      () => useRecommendedTemplates({ limit: 5 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(recommendedTemplates);
    expect(mockTemplateService.getRecommendedTemplates).toHaveBeenCalledWith({ limit: 5 });
  });

  it('uses default parameters when none provided', async () => {
    const recommendedTemplates = [mockTemplate];
    mockTemplateService.getRecommendedTemplates.mockResolvedValue(recommendedTemplates);

    renderHook(
      () => useRecommendedTemplates(),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(mockTemplateService.getRecommendedTemplates).toHaveBeenCalledWith({});
    });
  });
});
