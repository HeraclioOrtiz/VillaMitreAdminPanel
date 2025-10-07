// Stub temporal para build - Componente en desarrollo
import React from 'react';

export interface WeeklyCalendarProps {
  sessions?: any[];
  onSessionClick?: (session: any) => void;
  onCompleteSession?: (sessionId: number) => void;
  onSkipSession?: (sessionId: number) => void;
  onStudentClick?: (studentId: number) => void;
}

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = () => {
  return (
    <div className="bg-white border rounded-lg p-6">
      <p className="text-sm text-gray-600">Calendario semanal en desarrollo</p>
    </div>
  );
};

export default WeeklyCalendar;
