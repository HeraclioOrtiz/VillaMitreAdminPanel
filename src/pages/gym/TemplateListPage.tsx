import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateGrid from '@/components/gym/TemplateGrid';
import TemplatePreview from '@/components/gym/TemplatePreview';
import { Button, useToast } from '@/components/ui';
import { useDeleteTemplate, useDuplicateTemplate } from '@/hooks/useTemplates';
import type { DailyTemplate } from '@/types/template';
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

const TemplateListPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [selectedTemplate, setSelectedTemplate] = useState<DailyTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Mutations
  const deleteTemplateMutation = useDeleteTemplate({
    onSuccess: () => {
      toast.success(
        'Plantilla eliminada',
        'La plantilla ha sido eliminada correctamente'
      );
    },
    onError: (error) => {
      console.error('Delete template error:', error);
      toast.error(
        'Error al eliminar',
        'No se pudo eliminar la plantilla. Inténtalo nuevamente.'
      );
    },
  });

  const duplicateTemplateMutation = useDuplicateTemplate({
    onSuccess: (template) => {
      toast.success(
        'Plantilla duplicada',
        `Se ha creado una copia de "${template.name}" correctamente`
      );
    },
    onError: (error) => {
      console.error('Duplicate template error:', error);
      toast.error(
        'Error al duplicar',
        'No se pudo duplicar la plantilla. Inténtalo nuevamente.'
      );
    },
  });

  // Handlers
  const handleCreateNew = () => {
    navigate('/gym/daily-templates/create');
  };

  const handlePreview = (template: DailyTemplate) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleEdit = (template: DailyTemplate) => {
    navigate(`/gym/daily-templates/${template.id}/edit`);
  };

  const handleDuplicate = async (template: DailyTemplate) => {
    try {
      await duplicateTemplateMutation.mutateAsync(template.id);
    } catch (error) {
      // Error ya manejado en onError del mutation
    }
  };

  const handleDelete = async (template: DailyTemplate) => {
    const confirmed = confirm(
      `¿Estás seguro de que quieres eliminar la plantilla "${template.name}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (confirmed) {
      try {
        await deleteTemplateMutation.mutateAsync(template.id);
      } catch (error) {
        // Error ya manejado en onError del mutation
      }
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedTemplate(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/gym/dashboard')}
                leftIcon={<ArrowLeftIcon className="w-4 h-4" />}
              >
                Dashboard
              </Button>
              
              <span className="text-gray-300">/</span>
              
              <div className="flex items-center space-x-2">
                <DocumentTextIcon className="w-5 h-5 text-villa-mitre-600" />
                <span className="text-lg font-medium text-gray-900">
                  Plantillas Diarias
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TemplateGrid
          onCreateNew={handleCreateNew}
          onPreview={handlePreview}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          showCreateButton={true}
          showFilters={true}
        />
      </div>

      {/* Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleClosePreview}
            />

            {/* Modal */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              {/* Header */}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Vista Previa de Plantilla
                  </h3>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(selectedTemplate)}
                    >
                      Editar
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClosePreview}
                    >
                      Cerrar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="bg-gray-50 px-4 py-5 sm:p-6 max-h-96 overflow-y-auto">
                <TemplatePreview
                  data={{
                    name: selectedTemplate.title || selectedTemplate.name,
                    description: selectedTemplate.description,
                    difficulty: (selectedTemplate as any).level || selectedTemplate.difficulty,
                    estimated_duration: (selectedTemplate as any).estimated_duration_min || (selectedTemplate as any).estimated_duration,
                    primary_goal: (selectedTemplate as any).goal || selectedTemplate.primary_goal,
                    intensity_level: selectedTemplate.intensity_level,
                    secondary_goals: selectedTemplate.secondary_goals,
                    target_muscle_groups: selectedTemplate.target_muscle_groups,
                    equipment_needed: selectedTemplate.equipment_needed,
                    tags: selectedTemplate.tags,
                    is_public: selectedTemplate.is_public,
                    exercises: selectedTemplate.exercises,
                  }}
                />
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                <Button
                  onClick={() => navigate(`/professor/dashboard?template=${selectedTemplate.id}`)}
                  className="w-full sm:w-auto sm:ml-3"
                  leftIcon={<PlusIcon className="w-4 h-4" />}
                >
                  Usar Plantilla
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={() => handleDuplicate(selectedTemplate)}
                  disabled={duplicateTemplateMutation.isPending}
                  className="mt-3 w-full sm:mt-0 sm:w-auto"
                >
                  Duplicar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Info */}
      <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Acciones Rápidas
        </h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div>• <strong>Click en tarjeta:</strong> Ver detalles</div>
          <div>• <strong>Corazón:</strong> Agregar/quitar favoritos</div>
          <div>• <strong>Menú (⋮):</strong> Más acciones</div>
          <div>• <strong>Usar plantilla:</strong> Crear asignación</div>
        </div>
      </div>
    </div>
  );
};

export default TemplateListPage;
