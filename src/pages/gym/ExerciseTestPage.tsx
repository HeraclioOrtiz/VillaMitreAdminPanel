import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { PlusIcon, ListBulletIcon } from '@heroicons/react/24/outline';

const ExerciseTestPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ejercicios</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gestiona los ejercicios disponibles en el gimnasio
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button
            onClick={() => navigate('/gym/exercises/create')}
            className="inline-flex items-center"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Nuevo Ejercicio
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="text-center">
            <ListBulletIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Lista de Ejercicios</h3>
            <p className="mt-1 text-sm text-gray-500">
              Esta es una página de prueba. La funcionalidad completa se cargará cuando el backend esté disponible.
            </p>
            <div className="mt-6 space-y-3">
              <Button
                onClick={() => navigate('/gym/exercises/create')}
                variant="primary"
                className="w-full sm:w-auto"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Crear Nuevo Ejercicio
              </Button>
              <div className="text-sm text-gray-500">
                <p>Funcionalidades disponibles:</p>
                <ul className="mt-2 text-left space-y-1">
                  <li>• Crear ejercicios</li>
                  <li>• Editar ejercicios</li>
                  <li>• Filtrar por grupo muscular</li>
                  <li>• Vista previa con modal</li>
                  <li>• Operaciones masivas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-sm">0</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Ejercicios
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    Cargando...
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-sm">0</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Grupos Musculares
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    Cargando...
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-sm">0</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Más Populares
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    Cargando...
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseTestPage;
