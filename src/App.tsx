import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { MainLayout } from '@/components/layout';
import { ToastProvider } from '@/contexts/ToastContext';
import { ToastContainer } from '@/components/ui/Toast';
import LoginPage from '@/pages/auth/LoginPage';
import GymDashboard from '@/pages/gym/GymDashboard';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import ExerciseListPage from '@/pages/gym/ExerciseListPage';
import ExerciseTestPage from '@/pages/gym/ExerciseTestPage';
import ExerciseCreatePage from '@/pages/gym/ExerciseCreatePage';
import ExerciseEditPage from '@/pages/gym/ExerciseEditPage';
import TemplateCreatePage from '@/pages/gym/TemplateCreatePage';
import TemplateEditPage from '@/pages/gym/TemplateEditPage';
import TemplateListPage from '@/pages/gym/TemplateListPage';
import UserListPage from '@/pages/admin/UserListPage';
import UserDetailPage from '@/pages/admin/UserDetailPage';
// Assignment System Pages - Usando stubs temporales para build
import AssignmentDashboard from '@/pages/admin/AssignmentDashboard.stub';
import AssignmentManagement from '@/pages/admin/AssignmentManagement.stub';
import ProfessorDashboard from '@/pages/professor/ProfessorDashboard';
import RoleProtectedRoute from '@/components/auth/RoleProtectedRoute';
import UnauthorizedPage from '@/pages/auth/UnauthorizedPage';
import SmartRedirect from '@/components/auth/SmartRedirect';

// Crear cliente de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Componente para proteger rutas
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  console.log('🔒 ProtectedRoute - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  if (isLoading) {
    console.log('🔒 ProtectedRoute - Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-villa-mitre-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🔒 ProtectedRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('🔒 ProtectedRoute - Authenticated, rendering children');
  return <>{children}</>;
}

// Componente para redirigir al dashboard apropiado
function DashboardRedirect() {
  const { user } = useAuth();

  // Redirigir basado en el rol del usuario
  if (user?.is_admin || user?.is_super_admin) {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (user?.is_professor) {
    return <Navigate to="/professor/dashboard" replace />;
  } else {
    return <Navigate to="/gym/dashboard" replace />;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<Navigate to="/gym/dashboard" replace />} />
              
              {/* Gym Routes */}
              <Route 
                path="/gym/dashboard" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <GymDashboard />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute>
                    <RoleProtectedRoute requiredRoles={['admin', 'super_admin']}>
                      <MainLayout>
                        <AdminDashboard />
                      </MainLayout>
                    </RoleProtectedRoute>
                  </ProtectedRoute>
                } 
              />
              
              {/* Exercise Routes */}
              <Route 
                path="/gym/exercises" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ExerciseListPage />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/gym/exercises/create" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ExerciseCreatePage />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/gym/exercises/:id/edit" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ExerciseEditPage />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/gym/daily-templates" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <TemplateListPage />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/gym/daily-templates/create" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <TemplateCreatePage />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/gym/daily-templates/:id/edit" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <TemplateEditPage />
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin User Routes */}
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute>
                    <RoleProtectedRoute requiredRoles={['admin', 'super_admin']}>
                      <MainLayout>
                        <UserListPage />
                      </MainLayout>
                    </RoleProtectedRoute>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users/:id" 
                element={
                  <ProtectedRoute>
                    <RoleProtectedRoute requiredRoles={['admin', 'super_admin']}>
                      <MainLayout>
                        <UserDetailPage />
                      </MainLayout>
                    </RoleProtectedRoute>
                  </ProtectedRoute>
                } 
              />
              
              {/* Placeholder routes for missing pages */}
              <Route 
                path="/gym/weekly-templates" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold text-gray-900">Plantillas Semanales</h1>
                        <p className="mt-2 text-gray-600">Esta funcionalidad estará disponible próximamente.</p>
                      </div>
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              {/* Assignment Routes - Admin Panel */}
              <Route 
                path="/admin/assignments" 
                element={
                  <ProtectedRoute>
                    <RoleProtectedRoute requiredRoles={['admin', 'super_admin']}>
                      <MainLayout>
                        <AssignmentDashboard />
                      </MainLayout>
                    </RoleProtectedRoute>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/assignments/manage" 
                element={
                  <ProtectedRoute>
                    <RoleProtectedRoute requiredRoles={['admin', 'super_admin']}>
                      <MainLayout>
                        <AssignmentManagement />
                      </MainLayout>
                    </RoleProtectedRoute>
                  </ProtectedRoute>
                } 
              />
              
              {/* Assignment Routes - Professor Panel */}
              <Route 
                path="/professor/dashboard" 
                element={
                  <ProtectedRoute>
                    <RoleProtectedRoute requiredRoles={['professor', 'admin', 'super_admin']}>
                      <MainLayout>
                        <ProfessorDashboard />
                      </MainLayout>
                    </RoleProtectedRoute>
                  </ProtectedRoute>
                } 
              />
              
              {/* Unauthorized Page */}
              <Route 
                path="/unauthorized" 
                element={<UnauthorizedPage />}
              />
              
              {/* Legacy assignment routes - smart redirect based on role */}
              <Route 
                path="/gym/assignments" 
                element={
                  <SmartRedirect 
                    adminPath="/admin/assignments"
                    professorPath="/professor/dashboard"
                    defaultPath="/gym/dashboard"
                  />
                }
              />
              <Route 
                path="/gym/assignments/create" 
                element={
                  <SmartRedirect 
                    adminPath="/admin/assignments/manage"
                    professorPath="/professor/dashboard"
                    defaultPath="/gym/dashboard"
                  />
                }
              />
              <Route 
                path="/gym/reports" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold text-gray-900">Reportes Gimnasio</h1>
                        <p className="mt-2 text-gray-600">Esta funcionalidad estará disponible próximamente.</p>
                      </div>
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/gym/settings" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold text-gray-900">Configuración Gimnasio</h1>
                        <p className="mt-2 text-gray-600">Esta funcionalidad estará disponible próximamente.</p>
                      </div>
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/professors" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold text-gray-900">Profesores</h1>
                        <p className="mt-2 text-gray-600">Esta funcionalidad estará disponible próximamente.</p>
                      </div>
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold text-gray-900">Configuración Sistema</h1>
                        <p className="mt-2 text-gray-600">Esta funcionalidad estará disponible próximamente.</p>
                      </div>
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/reports" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold text-gray-900">Reportes Sistema</h1>
                        <p className="mt-2 text-gray-600">Esta funcionalidad estará disponible próximamente.</p>
                      </div>
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/audit" 
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold text-gray-900">Auditoría</h1>
                        <p className="mt-2 text-gray-600">Esta funcionalidad estará disponible próximamente.</p>
                      </div>
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch all */}
              <Route path="*" element={<Navigate to="/gym/dashboard" replace />} />
            </Routes>
          </Router>
          
          {/* Toast Container */}
          <ToastContainer />
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
