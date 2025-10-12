/**
 * Dashboard principal de gimnasio - Versión simplificada
 * Solo muestra mensaje de bienvenida
 */

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const GymDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo del Club */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gray-900 rounded-2xl flex items-center justify-center p-3 shadow-lg">
            <img 
              src="/cvm-escudo-para-fondo-negro.png" 
              alt="Villa Mitre" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Mensaje de Bienvenida */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            ¡Bienvenido, {user?.name}!
          </h1>
          <p className="text-xl text-gray-600">
            Panel de Gestión de Gimnasio
          </p>
          <p className="text-base text-gray-500 max-w-lg mx-auto">
            Utiliza el menú lateral para acceder a las diferentes secciones del sistema
          </p>
        </div>

        {/* Indicadores de Secciones */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex justify-center mb-3">
              <ClipboardDocumentListIcon className="w-8 h-8 text-villa-mitre-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Ejercicios</h3>
            <p className="text-sm text-gray-500">Biblioteca de ejercicios</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex justify-center mb-3">
              <CalendarDaysIcon className="w-8 h-8 text-villa-mitre-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Plantillas</h3>
            <p className="text-sm text-gray-500">Rutinas diarias y semanales</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex justify-center mb-3">
              <ChartBarIcon className="w-8 h-8 text-villa-mitre-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Reportes</h3>
            <p className="text-sm text-gray-500">Métricas y estadísticas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GymDashboard;
