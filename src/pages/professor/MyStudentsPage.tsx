/**
 * Página para mostrar y gestionar estudiantes asignados al profesor
 */

import React, { useState, useCallback } from 'react';
import { MyStudents } from '@/components/professor/MyStudents';
import { AssignTemplateModal } from '@/components/professor/AssignTemplateModal';
import type { ProfessorStudentAssignment } from '@/types/assignment';

const MyStudentsPage = () => {
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<ProfessorStudentAssignment | null>(null);

  // Handlers
  const handleAssignTemplate = useCallback((student: ProfessorStudentAssignment) => {
    setSelectedStudent(student);
    setAssignModalOpen(true);
  }, []);

  const handleViewProgress = useCallback((student: ProfessorStudentAssignment) => {
    // TODO: Implementar vista de progreso detallado
    console.log('Ver progreso de:', student);
  }, []);

  const handleViewCalendar = useCallback((student: ProfessorStudentAssignment) => {
    // TODO: Implementar vista de calendario del estudiante
    console.log('Ver calendario de:', student);
  }, []);

  const handleCloseAssignModal = useCallback(() => {
    setAssignModalOpen(false);
    setSelectedStudent(null);
  }, []);

  const handleAssignSuccess = useCallback(() => {
    // Modal se cierra automáticamente
    // Los datos se refrescan automáticamente por React Query
  }, []);

  return (
    <div className="space-y-6">
      <MyStudents
        onAssignTemplate={handleAssignTemplate}
        onViewProgress={handleViewProgress}
        onViewCalendar={handleViewCalendar}
      />

      {/* Modal de asignación de plantilla */}
      <AssignTemplateModal
        isOpen={assignModalOpen}
        onClose={handleCloseAssignModal}
        student={selectedStudent}
        onSuccess={handleAssignSuccess}
      />
    </div>
  );
};

export default MyStudentsPage;
