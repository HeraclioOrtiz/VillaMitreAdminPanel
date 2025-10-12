import React, { useState, useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { useDuplicateTemplate, useDeleteTemplate, useToggleFavoriteTemplate } from '@/hooks/useTemplates';
import type { DailyTemplate } from '@/types/template';
import { 
  PRIMARY_GOALS, 
  INTENSITY_LEVELS, 
  DIFFICULTY_LEVELS 
} from '@/types/template';
import {
  ClockIcon,
  FireIcon,
  UserGroupIcon,
  CogIcon,
  HeartIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  EyeIcon,
  PlayIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface TemplateCardProps {
  template: DailyTemplate;
  onPreview?: (template: DailyTemplate) => void;
  onEdit?: (template: DailyTemplate) => void;
  onDuplicate?: (template: DailyTemplate) => void;
  onDelete?: (template: DailyTemplate) => void;
  className?: string;
  showActions?: boolean;
}

const TemplateCard = memo<TemplateCardProps>(function TemplateCard({
  template,
  onPreview,
  onEdit,
  onDuplicate,
  onDelete,
  className = '',
  showActions = true,
}) {
  
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Mutations
  const duplicateTemplateMutation = useDuplicateTemplate();
  const deleteTemplateMutation = useDeleteTemplate();
  const toggleFavoriteMutation = useToggleFavoriteTemplate();

  // Helper functions
  const getDifficultyBadge = useCallback((difficulty: string) => {
    const styles = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800',
    };
    
    const label = DIFFICULTY_LEVELS.find(d => d.value === difficulty)?.label || difficulty;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[difficulty as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {label}
      </span>
    );
  }, []);

  const getIntensityColor = useCallback((intensity: string) => {
    const colors = {
      low: 'text-green-600',
      moderate: 'text-yellow-600',
      high: 'text-orange-600',
      very_high: 'text-red-600',
    };
    return colors[intensity as keyof typeof colors] || 'text-gray-600';
  }, []);

  const getMuscleGroupColor = useCallback((group: string) => {
    const colors: Record<string, string> = {
      chest: 'bg-red-100 text-red-700',
      back: 'bg-blue-100 text-blue-700',
      shoulders: 'bg-yellow-100 text-yellow-700',
      biceps: 'bg-purple-100 text-purple-700',
      triceps: 'bg-pink-100 text-pink-700',
      legs: 'bg-green-100 text-green-700',
      glutes: 'bg-indigo-100 text-indigo-700',
      core: 'bg-orange-100 text-orange-700',
      cardio: 'bg-teal-100 text-teal-700',
    };
    return colors[group] || 'bg-gray-100 text-gray-700';
  }, []);

  // Actions - memoized for performance
  const handlePreview = useCallback(() => {
    onPreview?.(template);
    setShowDropdown(false);
  }, [onPreview, template]);

  const handleEdit = useCallback(() => {
    onEdit?.(template);
    setShowDropdown(false);
  }, [onEdit, template]);

  const handleDuplicate = useCallback(async () => {
    if (onDuplicate) {
      await onDuplicate(template);
    } else {
      if (confirm(`¿Duplicar la plantilla "${template.name}"?`)) {
        await duplicateTemplateMutation.mutateAsync(template.id);
      }
    }
    setShowDropdown(false);
  }, [onDuplicate, template, duplicateTemplateMutation]);

  const handleDelete = useCallback(async () => {
    if (onDelete) {
      await onDelete(template);
    } else {
      if (confirm(`¿Eliminar la plantilla "${template.name}"? Esta acción no se puede deshacer.`)) {
        await deleteTemplateMutation.mutateAsync(template.id);
      }
    }
    setShowDropdown(false);
  }, [onDelete, template, deleteTemplateMutation]);

  const handleToggleFavorite = useCallback(async () => {
    await toggleFavoriteMutation.mutateAsync({
      id: template.id,
      isFavorite: !template.is_favorite
    });
  }, [toggleFavoriteMutation, template]);
  
  const handleUseTemplate = useCallback(() => {
    navigate(`/professor/dashboard?template=${template.id}`);
  }, [navigate, template]);

  const totalSets = useMemo(() => 
    template.exercises?.reduce((total, exercise) => 
      total + (exercise.sets?.length || 0), 0
    ) || 0, [template.exercises]);
  // Obtener grupos musculares únicos de los ejercicios
  const uniqueMuscleGroups = useMemo(() => {
    if (!template.exercises) return [];
    
    const groups = template.exercises
      .map(ex => ex.exercise?.muscle_group)
      .filter((group): group is string => Boolean(group))
      .filter((group, index, arr) => arr.indexOf(group) === index);
    
    return groups;
  }, [template.exercises]);

  return (
    <div className={`bg-white rounded-xl border border-gray-200 hover:border-villa-mitre-300 hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}>
      {/* Header con gradiente sutil */}
      <div className="bg-gradient-to-r from-villa-mitre-50 to-white p-6 border-b border-villa-mitre-100">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-bold text-villa-mitre-900 truncate">
                {(template as any).title || template.name || 'Plantilla sin nombre'}
              </h3>
              {template.is_favorite && (
                <HeartSolidIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
              )}
              {template.is_public && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <GlobeAltIcon className="w-3 h-3 mr-1" />
                  Pública
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-3 mb-2">
              {((template as any).level || template.difficulty) && 
                getDifficultyBadge((template as any).level || template.difficulty)}
              
              <div className="flex items-center text-sm text-villa-mitre-600 bg-villa-mitre-50 px-2 py-1 rounded-md">
                <ClockIcon className="w-4 h-4 mr-1" />
                <span className="font-medium">
                  {(template as any).estimated_duration_min || (template as any).estimated_duration || 0} min
                </span>
              </div>
              
              {((template as any).goal || template.primary_goal) && (
                <div className="flex items-center text-sm text-villa-mitre-600 bg-villa-mitre-50 px-2 py-1 rounded-md">
                  <FireIcon className="w-4 h-4 mr-1" />
                  <span className="font-medium capitalize">
                    {(template as any).goal || template.primary_goal}
                  </span>
                </div>
              )}
            </div>

            {/* ❌ CAMPO ELIMINADO: 'description' NO existe en gym_daily_templates */}

            {/* Tags del backend */}
            {((template as any).tags && (template as any).tags.length > 0) && (
              <div className="flex flex-wrap gap-1 mb-3">
                {(template as any).tags.slice(0, 3).map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    #{tag}
                  </span>
                ))}
                {(template as any).tags.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                    +{(template as any).tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {showActions && (
            <div className="flex items-center space-x-1 ml-2">
              <button
                onClick={handleToggleFavorite}
                disabled={toggleFavoriteMutation.isPending}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                title={template.is_favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                {template.is_favorite ? (
                  <HeartSolidIcon className="w-5 h-5" />
                ) : (
                  <HeartIcon className="w-5 h-5" />
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <EllipsisVerticalIcon className="w-5 h-5" />
                </button>

                {showDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 top-8 z-20 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1">
                      <button
                        onClick={handlePreview}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <EyeIcon className="w-4 h-4 mr-3" />
                        Ver detalles
                      </button>
                      
                      <button
                        onClick={handleUseTemplate}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <PlayIcon className="w-4 h-4 mr-3" />
                        Usar plantilla
                      </button>
                      
                      <button
                        onClick={handleEdit}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <PencilIcon className="w-4 h-4 mr-3" />
                        Editar
                      </button>
                      
                      <button
                        onClick={handleDuplicate}
                        disabled={duplicateTemplateMutation.isPending}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <DocumentDuplicateIcon className="w-4 h-4 mr-3" />
                        Duplicar
                      </button>
                      
                      <hr className="my-1" />
                      
                      <button
                        onClick={handleDelete}
                        disabled={deleteTemplateMutation.isPending}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        <TrashIcon className="w-4 h-4 mr-3" />
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          {/* Stats mejoradas - Layout horizontal */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="bg-villa-mitre-50 rounded-lg p-2 border border-villa-mitre-100">
                <div className="text-lg font-bold text-villa-mitre-700">
                  {template.exercises?.length || 0}
                </div>
              </div>
              <div className="text-sm font-medium text-villa-mitre-600">Ejercicios</div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="bg-blue-50 rounded-lg p-2 border border-blue-100">
                <div className="text-lg font-bold text-blue-700">
                  {totalSets}
                </div>
              </div>
              <div className="text-sm font-medium text-blue-600">Series</div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-100">
                <div className="text-lg font-bold text-emerald-700">
                  {uniqueMuscleGroups.length || (template as any).tags?.length || 0}
                </div>
              </div>
              <div className="text-sm font-medium text-emerald-600">
                {uniqueMuscleGroups.length > 0 ? 'Grupos' : 'Tags'}
              </div>
            </div>
          </div>

          {/* ❌ CAMPO ELIMINADO: 'intensity_level' NO existe en gym_daily_templates */}
        </div>

        {/* Secciones adicionales */}
        <div className="mt-4 space-y-4">

        {/* Ejercicios con nombres reales */}
        {template.exercises && template.exercises.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2 flex items-center">
              <UserGroupIcon className="w-3 h-3 mr-1" />
              Ejercicios Incluidos
            </h4>
            <div className="flex flex-wrap gap-1">
              {template.exercises.slice(0, 3).map((exercise) => {
                const exerciseName = exercise.exercise?.name || `Ejercicio ${exercise.exercise_id}`;
                const truncatedName = exerciseName.length > 20 ? `${exerciseName.substring(0, 17)}...` : exerciseName;
                
                return (
                  <span
                    key={exercise.id}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 max-w-32 truncate"
                    title={exerciseName}
                  >
                    {truncatedName}
                  </span>
                );
              })}
              {template.exercises.length > 3 && (
                <span 
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600"
                  title={`${template.exercises.length - 3} ejercicios más: ${template.exercises.slice(3).map(ex => ex.exercise?.name || `Ejercicio ${ex.exercise_id}`).join(', ')}`}
                >
                  +{template.exercises.length - 3} más
                </span>
              )}
            </div>
          </div>
        )}

        {/* Grupos Musculares de los Ejercicios */}
        {uniqueMuscleGroups.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2 flex items-center">
              <UserGroupIcon className="w-3 h-3 mr-1" />
              Grupos Musculares
            </h4>
            <div className="flex flex-wrap gap-1">
              {uniqueMuscleGroups.slice(0, 4).map((group) => (
                <span
                  key={group}
                  className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getMuscleGroupColor(group)}`}
                >
                  {group}
                </span>
              ))}
              {uniqueMuscleGroups.length > 4 && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                  +{uniqueMuscleGroups.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* ❌ CAMPO ELIMINADO: 'target_muscle_groups' NO existe (se calcula desde ejercicios) */}

        {/* ❌ CAMPO ELIMINADO: 'equipment_needed' NO existe (se calcula desde ejercicios) */}

        {/* Tags */}
        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {template.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600"
              >
                #{tag}
              </span>
            ))}
            {template.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{template.tags.length - 3} más
              </span>
            )}
          </div>
        )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 rounded-b-lg">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Creado {new Date(template.created_at).toLocaleDateString()}
          </span>
          
          {template.usage_count !== undefined && (
            <span>
              {template.usage_count} uso(s)
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

export default TemplateCard;
