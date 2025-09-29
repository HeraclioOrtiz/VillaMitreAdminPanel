import React from 'react';
import type { TemplateFormData } from '@/types/template';
import { 
  PRIMARY_GOALS, 
  INTENSITY_LEVELS, 
  DIFFICULTY_LEVELS 
} from '@/types/template';
import {
  ClockIcon,
  TagIcon,
  FireIcon,
  UserGroupIcon,
  CogIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

interface TemplatePreviewProps {
  data: Partial<TemplateFormData>;
  className?: string;
}

const TemplatePreview = ({ data, className = '' }: TemplatePreviewProps) => {
  
  // ✅ Extraer datos con compatibilidad backend/frontend
  const templateName = (data as any).title || data.name || 'Plantilla sin nombre';
  const templateDescription = data.description || 'Sin descripción disponible';
  const templateLevel = (data as any).level || data.difficulty || 'beginner';
  const templateGoal = (data as any).goal || data.primary_goal || 'general';
  const templateDuration = (data as any).estimated_duration_min || data.estimated_duration || 0;
  const templateTags = (data as any).tags || data.tags || [];
  const templateExercises = data.exercises || [];
  
  
  // Helper functions
  const getDifficultyBadge = (difficulty: string) => {
    const styles = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800',
    };
    
    const label = DIFFICULTY_LEVELS.find(d => d.value === difficulty)?.label || difficulty;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[difficulty as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {label}
      </span>
    );
  };

  const getIntensityColor = (intensity: string) => {
    const colors = {
      low: 'text-green-600',
      moderate: 'text-yellow-600',
      high: 'text-orange-600',
      very_high: 'text-red-600',
    };
    return colors[intensity as keyof typeof colors] || 'text-gray-600';
  };

  const getMuscleGroupColor = (group: string) => {
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
  };

  const formatSetConfiguration = (set: any, index: number) => {
    const parts = [];
    
    if (set.reps) parts.push(`${set.reps} reps`);
    if (set.weight) parts.push(`${set.weight}kg`);
    if (set.duration) parts.push(`${set.duration}s`);
    if (set.distance) parts.push(`${set.distance}m`);
    if ((set as any).rest_seconds || (set as any).rest_time) parts.push(`${(set as any).rest_seconds || (set as any).rest_time}s descanso`);
    
    return parts.length > 0 ? parts.join(' • ') : `Serie ${index + 1}`;
  };

  const getTotalEstimatedTime = () => {
    if (!data.exercises) return data.estimated_duration || 0;
    
    let totalTime = 0;
    data.exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        if (set.duration) totalTime += set.duration;
        if ((set as any).rest_seconds || (set as any).rest_time) totalTime += ((set as any).rest_seconds || (set as any).rest_time);
      });
    });
    
    // Add base exercise time if no duration specified
    const baseTime = data.exercises.length * 2 * 60; // 2 min per exercise average
    return Math.max(totalTime / 60, baseTime / 60, data.estimated_duration || 0);
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-villa-mitre-900 mb-2">
              {templateName}
            </h3>
            <p className="text-villa-mitre-700 text-sm mb-4">
              {templateDescription}
            </p>
            
            <div className="flex items-center space-x-4 mb-4">
              {templateLevel && getDifficultyBadge(templateLevel)}
              
              <div className="flex items-center text-sm text-villa-mitre-600 bg-villa-mitre-50 px-3 py-1 rounded-md">
                <ClockIcon className="w-4 h-4 mr-1" />
                <span className="font-medium">{templateDuration} min</span>
              </div>
              
              {templateGoal && (
                <div className="flex items-center text-sm text-villa-mitre-600 bg-villa-mitre-50 px-3 py-1 rounded-md">
                  <FireIcon className="w-4 h-4 mr-1" />
                  <span className="font-medium capitalize">{templateGoal}</span>
                </div>
              )}
            </div>

            {/* Tags del backend */}
            {templateTags && templateTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {templateTags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              data.is_public 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {data.is_public ? 'Pública' : 'Privada'}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        
        {/* Muscle Groups & Equipment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Muscle Groups */}
          {data.target_muscle_groups && data.target_muscle_groups.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <UserGroupIcon className="w-4 h-4 mr-2 text-gray-500" />
                Grupos Musculares
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.target_muscle_groups.map((group) => (
                  <span
                    key={group}
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getMuscleGroupColor(group)}`}
                  >
                    {group}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Equipment Needed */}
          {data.equipment_needed && data.equipment_needed.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <CogIcon className="w-4 h-4 mr-2 text-gray-500" />
                Equipamiento
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.equipment_needed.map((equipment) => (
                  <span
                    key={equipment}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    {equipment}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Secondary Goals */}
        {data.secondary_goals && data.secondary_goals.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Objetivos Secundarios
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.secondary_goals.map((goal) => (
                <span
                  key={goal}
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700"
                >
                  {goal}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {data.tags && data.tags.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <TagIcon className="w-4 h-4 mr-2 text-gray-500" />
              Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Exercises */}
        {data.exercises && data.exercises.length > 0 ? (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
              <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
              Ejercicios ({data.exercises.length})
            </h4>
            
            <div className="space-y-6">
              {templateExercises.map((templateExercise, exerciseIndex) => (
                <div
                  key={(templateExercise as any).id || exerciseIndex}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  {/* Header del ejercicio */}
                  <div className="bg-gradient-to-r from-villa-mitre-50 to-blue-50 p-4 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-villa-mitre-600 text-white text-sm font-bold rounded-full flex-shrink-0">
                          {templateExercise.display_order}
                        </span>
                        <div className="flex-1">
                          <h5 className="text-lg font-bold text-gray-900 mb-1">
                            {templateExercise.exercise?.name || `Ejercicio ${templateExercise.exercise_id}`}
                          </h5>
                          
                          {/* Información del ejercicio - Adaptada a la estructura real del backend */}
                          {templateExercise.exercise ? (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {templateExercise.exercise.muscle_group && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  💪 {templateExercise.exercise.muscle_group}
                                </span>
                              )}
                              {templateExercise.exercise.movement_pattern && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  🎯 {templateExercise.exercise.movement_pattern}
                                </span>
                              )}
                              {templateExercise.exercise.equipment && templateExercise.exercise.equipment !== 'Ninguno' && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  🏋️ {templateExercise.exercise.equipment}
                                </span>
                              )}
                              {templateExercise.exercise.difficulty && (
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                  templateExercise.exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                                  templateExercise.exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                  templateExercise.exercise.difficulty === 'advanced' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  📊 {templateExercise.exercise.difficulty}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                ⚠️ Información del ejercicio no disponible
                              </span>
                            </div>
                          )}

                          {/* Tags del ejercicio */}
                          {templateExercise.exercise?.tags && Array.isArray(templateExercise.exercise.tags) && templateExercise.exercise.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {templateExercise.exercise.tags.map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Tempo del ejercicio */}
                          {templateExercise.exercise?.tempo && (
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                🎵 Tempo: {templateExercise.exercise.tempo}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Notas del template exercise */}
                      {templateExercise.notes && (
                        <div className="ml-4 max-w-xs">
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                            <p className="text-xs text-yellow-800">
                              <strong>Nota:</strong> {templateExercise.notes}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Configuración de Series Real */}
                  {templateExercise.sets && templateExercise.sets.length > 0 && (
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h6 className="text-sm font-semibold text-gray-800 flex items-center">
                          🎯 Series Configuradas ({templateExercise.sets.length})
                        </h6>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {templateExercise.sets.map((set, setIndex) => (
                          <div
                            key={(set as any).id || `set-${setIndex}`}
                            className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
                          >
                            {/* Header de la serie */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <span className="inline-flex items-center justify-center w-6 h-6 bg-villa-mitre-600 text-white text-xs font-bold rounded-full">
                                  {set.set_number}
                                </span>
                                <span className="text-sm font-medium text-gray-800">
                                  Serie {set.set_number}
                                </span>
                              </div>
                              {(set as any).rpe_target && (
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                                  RPE {(set as any).rpe_target}/10
                                </span>
                              )}
                            </div>
                            
                            {/* Configuración principal */}
                            <div className="space-y-2">
                              {/* Repeticiones */}
                              {(set.reps_min || set.reps_max) && (
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs font-medium text-gray-600 w-16">Reps:</span>
                                  <span className="text-sm font-semibold text-gray-900">
                                    {set.reps_min === set.reps_max 
                                      ? set.reps_min
                                      : `${set.reps_min || 0}-${set.reps_max || 0}`}
                                  </span>
                                </div>
                              )}
                              
                              {/* Descanso */}
                              {set.rest_seconds && (
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs font-medium text-gray-600 w-16">Descanso:</span>
                                  <span className="text-sm font-semibold text-orange-700">
                                    {set.rest_seconds}s
                                  </span>
                                </div>
                              )}
                              
                              {/* Tempo */}
                              {set.tempo && (
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs font-medium text-gray-600 w-16">Tempo:</span>
                                  <span className="text-sm font-mono font-semibold text-indigo-700">
                                    {set.tempo}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* Notas de la serie */}
                            {set.notes && (
                              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                <p className="text-xs text-yellow-800">
                                  <strong>💡 Nota:</strong> {set.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Información adicional del ejercicio real */}
                  <div className="px-4 pb-4 space-y-3">
                    {/* Instrucciones del ejercicio */}
                    {/* Instrucciones del ejercicio */}
                    {templateExercise.exercise?.instructions && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <h6 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                          📋 Instrucciones
                        </h6>
                        <p className="text-sm text-blue-700 leading-relaxed">
                          {templateExercise.exercise.instructions}
                        </p>
                      </div>
                    )}

                    {/* Tempo del ejercicio */}
                    {templateExercise.exercise?.tempo && (
                      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                        <h6 className="text-sm font-semibold text-indigo-800 mb-2 flex items-center">
                          ⏱️ Tempo
                        </h6>
                        <p className="text-sm text-indigo-700 font-mono">
                          {templateExercise.exercise.tempo}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <ExclamationTriangleIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              No hay ejercicios configurados en esta plantilla
            </p>
          </div>
        )}

        {/* Summary Stats */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Resumen de la Plantilla
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-villa-mitre-600">
                {data.exercises?.length || 0}
              </div>
              <div className="text-xs text-gray-500">Ejercicios</div>
            </div>
            
            <div>
              <div className="text-lg font-semibold text-villa-mitre-600">
                {data.exercises?.reduce((total, ex) => total + (ex.sets?.length || 0), 0) || 0}
              </div>
              <div className="text-xs text-gray-500">Series Total</div>
            </div>
            
            <div>
              <div className="text-lg font-semibold text-villa-mitre-600">
                {Math.round(getTotalEstimatedTime())}
              </div>
              <div className="text-xs text-gray-500">Minutos</div>
            </div>
            
            <div>
              <div className="text-lg font-semibold text-villa-mitre-600">
                {data.target_muscle_groups?.length || 0}
              </div>
              <div className="text-xs text-gray-500">Grupos Musc.</div>
            </div>
          </div>
        </div>

        {/* Validation Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <InformationCircleIcon className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Estado de la Plantilla
              </h4>
              
              <div className="space-y-1 text-sm">
                <div className="flex items-center">
                  {data.name ? (
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                  ) : (
                    <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500 mr-2" />
                  )}
                  <span className={data.name ? 'text-green-700' : 'text-yellow-700'}>
                    Nombre de plantilla {data.name ? 'configurado' : 'requerido'}
                  </span>
                </div>
                
                <div className="flex items-center">
                  {data.exercises && data.exercises.length > 0 ? (
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                  ) : (
                    <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500 mr-2" />
                  )}
                  <span className={data.exercises && data.exercises.length > 0 ? 'text-green-700' : 'text-yellow-700'}>
                    Ejercicios {data.exercises && data.exercises.length > 0 ? 'seleccionados' : 'requeridos'}
                  </span>
                </div>
                
                <div className="flex items-center">
                  {data.exercises?.some(ex => ex.sets && ex.sets.length > 0) ? (
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                  ) : (
                    <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500 mr-2" />
                  )}
                  <span className={data.exercises?.some(ex => ex.sets && ex.sets.length > 0) ? 'text-green-700' : 'text-yellow-700'}>
                    Series {data.exercises?.some(ex => ex.sets && ex.sets.length > 0) ? 'configuradas' : 'requeridas'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;
