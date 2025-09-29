import React, { useState, useMemo, useCallback, memo } from 'react';
import TemplateCard from './TemplateCard';
import { SearchInput, MultiSelect, Button } from '@/components/ui';
import { useTemplates } from '@/hooks/useTemplates';
import type { DailyTemplate, TemplateFilters } from '@/types/template';
import { 
  PRIMARY_GOALS, 
  INTENSITY_LEVELS, 
  DIFFICULTY_LEVELS 
} from '@/types/template';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  PlusIcon,
  Squares2X2Icon,
  ListBulletIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

// Filter options - Moved outside component to prevent re-creation
const MUSCLE_GROUP_OPTIONS = [
  { value: 'chest', label: 'Pecho' },
  { value: 'back', label: 'Espalda' },
  { value: 'shoulders', label: 'Hombros' },
  { value: 'biceps', label: 'Bíceps' },
  { value: 'triceps', label: 'Tríceps' },
  { value: 'legs', label: 'Piernas' },
  { value: 'glutes', label: 'Glúteos' },
  { value: 'core', label: 'Core' },
  { value: 'cardio', label: 'Cardio' },
];

const EQUIPMENT_OPTIONS = [
  { value: 'barbell', label: 'Barra' },
  { value: 'dumbbell', label: 'Mancuernas' },
  { value: 'kettlebell', label: 'Kettlebell' },
  { value: 'cable', label: 'Polea' },
  { value: 'machine', label: 'Máquina' },
  { value: 'bodyweight', label: 'Peso Corporal' },
];

interface TemplateGridProps {
  onCreateNew?: () => void;
  onPreview?: (template: DailyTemplate) => void;
  onEdit?: (template: DailyTemplate) => void;
  onDuplicate?: (template: DailyTemplate) => void;
  onDelete?: (template: DailyTemplate) => void;
  className?: string;
  showCreateButton?: boolean;
  showFilters?: boolean;
  initialFilters?: Partial<TemplateFilters>;
}

const TemplateGrid = memo<TemplateGridProps>(function TemplateGrid({
  onCreateNew,
  onPreview,
  onEdit,
  onDuplicate,
  onDelete,
  className = '',
  showCreateButton = true,
  showFilters = true,
  initialFilters = {},
}) {

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const [filters, setFilters] = useState<TemplateFilters>({
    search: '',
    difficulty: [],
    primary_goal: [],
    intensity_level: [],
    target_muscle_groups: [],
    equipment_needed: [],
    tags: [],
    is_public: undefined,
    is_favorite: undefined,
    ...initialFilters,
  });

  // Fetch templates with filters
  const { data: templatesData, isLoading, error } = useTemplates({
    ...filters,
    per_page: 50,
  });

  // Debug para comparar con modal
  console.log('🏠 LISTA - Plantillas cargadas:', {
    loading: isLoading,
    error: error,
    totalTemplates: Array.isArray(templatesData) ? templatesData.length : templatesData?.data?.length || 0,
    responseType: Array.isArray(templatesData) ? 'array' : 'object',
    endpoint: '/admin/gym/daily-templates',
    params: { ...filters, per_page: 50 }
  });

  // Debug básico
  // Process templates data
  const templates = Array.isArray(templatesData) ? templatesData : (templatesData?.data || []);
  const meta = templatesData?.meta;

  // Handle filter changes
  const handleFilterChange = useCallback((key: keyof TemplateFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      difficulty: [],
      primary_goal: [],
      intensity_level: [],
      target_muscle_groups: [],
      equipment_needed: [],
      tags: [],
      is_public: undefined,
      is_favorite: undefined,
    });
  }, []);

  // Check if filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === 'search') return value && value.length > 0;
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== '';
    });
  }, [filters]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Plantillas Diarias</h2>
          <p className="text-sm text-gray-600 mt-1">
            {meta ? `${meta.total} plantilla(s) encontrada(s)` : 'Gestiona tus plantillas de entrenamiento'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-villa-mitre-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Vista en cuadrícula"
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-villa-mitre-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Vista en lista"
            >
              <ListBulletIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Create Button */}
          {showCreateButton && (
            <Button
              onClick={onCreateNew}
              leftIcon={<PlusIcon className="w-4 h-4" />}
            >
              Nueva Plantilla
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          {/* Basic Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
            <div className="flex-1">
              <SearchInput
                value={filters.search || ''}
                onChange={(value) => handleFilterChange('search', value)}
                placeholder="Buscar plantillas por nombre, descripción o tags..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                leftIcon={<AdjustmentsHorizontalIcon className="w-4 h-4" />}
              >
                Filtros Avanzados
              </Button>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  leftIcon={<XMarkIcon className="w-4 h-4" />}
                >
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <MultiSelect
                  value={filters.difficulty || []}
                  onChange={(values) => handleFilterChange('difficulty', values)}
                  options={DIFFICULTY_LEVELS as any}
                  placeholder="Dificultad..."
                />

                <MultiSelect
                  value={filters.primary_goal || []}
                  onChange={(values) => handleFilterChange('primary_goal', values)}
                  options={PRIMARY_GOALS as any}
                  placeholder="Objetivo principal..."
                />

                <MultiSelect
                  value={filters.intensity_level || []}
                  onChange={(values) => handleFilterChange('intensity_level', values)}
                  options={INTENSITY_LEVELS as any}
                  placeholder="Intensidad..."
                />

                <MultiSelect
                  value={filters.target_muscle_groups || []}
                  onChange={(values) => handleFilterChange('target_muscle_groups', values)}
                  options={MUSCLE_GROUP_OPTIONS}
                  placeholder="Grupos musculares..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MultiSelect
                  value={filters.equipment_needed || []}
                  onChange={(values) => handleFilterChange('equipment_needed', values)}
                  options={EQUIPMENT_OPTIONS}
                  placeholder="Equipamiento..."
                />

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.is_favorite === true}
                      onChange={(e) => handleFilterChange('is_favorite', e.target.checked ? true : undefined)}
                      className="rounded border-gray-300 text-villa-mitre-600 focus:ring-villa-mitre-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Solo favoritas</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.is_public === true}
                      onChange={(e) => handleFilterChange('is_public', e.target.checked ? true : undefined)}
                      className="rounded border-gray-300 text-villa-mitre-600 focus:ring-villa-mitre-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Solo públicas</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-villa-mitre-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-2">Error al cargar las plantillas</div>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {hasActiveFilters ? 'No se encontraron plantillas' : 'No hay plantillas creadas'}
            </h3>
            <p className="text-gray-600 mb-4">
              {hasActiveFilters 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Crea tu primera plantilla de entrenamiento'
              }
            </p>
            {hasActiveFilters ? (
              <Button variant="secondary" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            ) : showCreateButton ? (
              <Button onClick={onCreateNew} leftIcon={<PlusIcon className="w-4 h-4" />}>
                Crear Primera Plantilla
              </Button>
            ) : null}
          </div>
        ) : (
          <>
            {/* Grid/List View */}
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 gap-6'
                : 'space-y-4'
            }>
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onPreview={onPreview}
                  onEdit={onEdit}
                  onDuplicate={onDuplicate}
                  onDelete={onDelete}
                  className={viewMode === 'list' ? 'max-w-none' : ''}
                />
              ))}
            </div>

            {/* Pagination Info */}
            {meta && meta.total > templates.length && (
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Mostrando {templates.length} de {meta.total} plantillas
                </p>
                <Button variant="secondary" className="mt-2">
                  Cargar más
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default TemplateGrid;
