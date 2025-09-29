import React, { memo, useMemo, useCallback } from 'react';
import type { Exercise } from '@/types/exercise';
import { 
  ClockIcon,
  FireIcon,
  TagIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

interface ExerciseCardProps {
  exercise: Exercise;
  className?: string;
  showActions?: boolean;
  onEdit?: (exercise: Exercise) => void;
  onDuplicate?: (exercise: Exercise) => void;
  onDelete?: (exercise: Exercise) => void;
}

const ExerciseCard = memo<ExerciseCardProps>(function ExerciseCard({
  exercise,
  className = '',
  showActions = false,
  onEdit,
  onDuplicate,
  onDelete,
}) {

  // Memoizar badge de dificultad
  const difficultyBadge = useMemo(() => {
    const badges = {
      beginner: { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        label: 'Principiante' 
      },
      intermediate: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        label: 'Intermedio' 
      },
      advanced: { 
        bg: 'bg-red-100', 
        text: 'text-red-800', 
        label: 'Avanzado' 
      },
    };
    return badges[exercise.difficulty] || badges.beginner;
  }, [exercise.difficulty]);

  // Memoizar función para obtener el color del grupo muscular
  const getMuscleGroupColor = useCallback((group: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-cyan-100 text-cyan-800',
    ];
    
    // Usar el hash del string para obtener un color consistente
    const hash = group.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  }, []);

  // Memoizar handlers para evitar re-renders
  const handleEdit = useCallback(() => {
    onEdit?.(exercise);
  }, [onEdit, exercise]);

  const handleDuplicate = useCallback(() => {
    onDuplicate?.(exercise);
  }, [onDuplicate, exercise]);

  const handleDelete = useCallback(() => {
    onDelete?.(exercise);
  }, [onDelete, exercise]);

  // Memoizar muscle groups procesados
  const muscleGroups = useMemo(() => {
    const groups = Array.isArray(exercise.muscle_group) 
      ? exercise.muscle_group 
      : [exercise.muscle_group];
    return groups.filter(Boolean);
  }, [exercise.muscle_group]);

  // Memoizar equipment procesado
  const equipment = useMemo(() => {
    const equip = Array.isArray(exercise.equipment) 
      ? exercise.equipment 
      : [exercise.equipment];
    return equip.filter(Boolean);
  }, [exercise.equipment]);

  // Memoizar tags procesados
  const tags = useMemo(() => {
    return Array.isArray(exercise.tags) ? exercise.tags : [];
  }, [exercise.tags]);

  return (
    <div className={`
      bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow
      ${className}
    `}>
      {/* Header con imagen o placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-villa-mitre-50 to-villa-mitre-100 rounded-t-lg">
        {exercise.image_url ? (
          <img
            src={exercise.image_url}
            alt={exercise.name}
            className="w-full h-full object-cover rounded-t-lg"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FireIcon className="w-12 h-12 text-villa-mitre-400 mx-auto mb-2" />
              <p className="text-sm text-villa-mitre-600 font-medium">
                {exercise.name}
              </p>
            </div>
          </div>
        )}
        
        {/* Badge de dificultad */}
        <div className="absolute top-3 right-3">
          <span className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${difficultyBadge.bg} ${difficultyBadge.text}
          `}>
            {difficultyBadge.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Título y descripción */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {exercise.name}
          </h3>
          {exercise.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {exercise.description}
            </p>
          )}
        </div>

        {/* Metadatos */}
        <div className="space-y-2 mb-4">
          {/* Duración estimada */}
          {exercise.estimated_duration && (
            <div className="flex items-center text-sm text-gray-500">
              <ClockIcon className="w-4 h-4 mr-2" />
              <span>{exercise.estimated_duration} min</span>
            </div>
          )}

          {/* Popularidad */}
          {exercise.popularity !== undefined && (
            <div className="flex items-center text-sm text-gray-500">
              <UserGroupIcon className="w-4 h-4 mr-2" />
              <span>Popularidad: {exercise.popularity}/5</span>
            </div>
          )}

          {/* Equipamiento */}
          {equipment.length > 0 && (
            <div className="flex items-center text-sm text-gray-500">
              <TagIcon className="w-4 h-4 mr-2" />
              <span>Equipo: {equipment.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Grupos musculares */}
        {muscleGroups.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700 mb-2">Grupos Musculares:</p>
            <div className="flex flex-wrap gap-1">
              {muscleGroups.map((group, index) => (
                <span
                  key={index}
                  className={`
                    inline-flex items-center px-2 py-1 rounded-md text-xs font-medium
                    ${getMuscleGroupColor(group)}
                  `}
                >
                  {group}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700 mb-2">Tags:</p>
            <div className="flex flex-wrap gap-1">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Instrucciones */}
        {exercise.instructions && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700 mb-2">Instrucciones:</p>
            <div className="text-sm text-gray-600 space-y-1">
              {exercise.instructions.split('\n').slice(0, 3).map((instruction, index) => (
                <p key={index} className="line-clamp-1">
                  {index + 1}. {instruction}
                </p>
              ))}
              {exercise.instructions.split('\n').length > 3 && (
                <p className="text-xs text-gray-500 italic">
                  +{exercise.instructions.split('\n').length - 3} pasos más...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Metadatos adicionales */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>
              Creado: {new Date(exercise.created_at).toLocaleDateString()}
            </span>
            {exercise.updated_at !== exercise.created_at && (
              <span>
                Actualizado: {new Date(exercise.updated_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ExerciseCard;
