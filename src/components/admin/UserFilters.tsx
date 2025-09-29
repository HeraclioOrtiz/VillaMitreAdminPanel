/**
 * UserFilters - Componente de filtros avanzados para usuarios
 * Optimizado con React.memo, useMemo y useCallback siguiendo patrones de performance
 */

import React, { useState, memo, useMemo, useCallback } from 'react';
import { Button, SearchInput, MultiSelect } from '@/components/ui';
import DateRangePicker, { type DateRange } from '@/components/ui/DateRangePicker';
import { UserFilterChips } from '@/components/ui/FilterChips';
import type { 
  UserFilters, 
  UserRole, 
  UserStatus, 
  MembershipStatus, 
  TrafficLightStatus, 
  Gender 
} from '@/types/user';
import {
  USER_ROLES,
  USER_STATUSES,
  MEMBERSHIP_STATUSES,
  TRAFFIC_LIGHT_STATUSES,
  GENDERS,
} from '@/types/user';
import {
  FunnelIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  CalendarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface UserFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
  onReset?: () => void;
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  showChips?: boolean;
  availableProfessors?: Array<{ id: number; name: string }>;
}

const UserFiltersComponent = memo<UserFiltersProps>(function UserFilters({
  filters,
  onFiltersChange,
  onReset,
  className = '',
  collapsible = true,
  defaultCollapsed = false,
  showChips = true,
  availableProfessors = [],
}) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  // Memoizar opciones para los MultiSelect
  const roleOptions = useMemo(() => 
    USER_ROLES.map((role) => ({
      value: role.value,
      label: role.label,
      description: role.description,
      group: 'Roles de Usuario',
    })), []
  );

  const statusOptions = useMemo(() => 
    USER_STATUSES.map((status) => ({
      value: status.value,
      label: status.label,
      color: status.color,
      group: 'Estados de Usuario',
    })), []
  );

  const membershipStatusOptions = useMemo(() => 
    MEMBERSHIP_STATUSES.map((status) => ({
      value: status.value,
      label: status.label,
      color: status.color,
      group: 'Estados de Membresía',
    })), []
  );

  const trafficLightOptions = useMemo(() => 
    TRAFFIC_LIGHT_STATUSES.map((status) => ({
      value: status.value,
      label: status.label,
      color: status.color,
      description: status.description,
      group: 'Sistema de Semáforo',
    })), []
  );

  const genderOptions = useMemo(() => 
    GENDERS.map((gender) => ({
      value: gender.value,
      label: gender.label,
      group: 'Género',
    })), []
  );

  const professorOptions = useMemo(() => 
    availableProfessors.map((professor) => ({
      value: professor.id.toString(),
      label: professor.name,
      group: 'Profesores',
    })), [availableProfessors]
  );

  // Handlers optimizados con useCallback
  const handleSearchChange = useCallback((search: string) => {
    onFiltersChange({ ...filters, search: search || undefined });
  }, [filters, onFiltersChange]);

  const handleRoleChange = useCallback((roles: string[]) => {
    onFiltersChange({ ...filters, role: roles.length > 0 ? roles as UserRole[] : undefined });
  }, [filters, onFiltersChange]);

  const handleStatusChange = useCallback((statuses: string[]) => {
    onFiltersChange({ ...filters, status: statuses.length > 0 ? statuses as UserStatus[] : undefined });
  }, [filters, onFiltersChange]);

  const handleMembershipStatusChange = useCallback((statuses: string[]) => {
    onFiltersChange({ ...filters, membership_status: statuses.length > 0 ? statuses as MembershipStatus[] : undefined });
  }, [filters, onFiltersChange]);

  const handleTrafficLightChange = useCallback((statuses: string[]) => {
    onFiltersChange({ ...filters, traffic_light_status: statuses.length > 0 ? statuses as TrafficLightStatus[] : undefined });
  }, [filters, onFiltersChange]);

  const handleGenderChange = useCallback((genders: string[]) => {
    onFiltersChange({ ...filters, gender: genders.length > 0 ? genders as Gender[] : undefined });
  }, [filters, onFiltersChange]);

  const handleProfessorChange = useCallback((professorIds: string[]) => {
    const professorId = professorIds.length > 0 ? parseInt(professorIds[0]) : undefined;
    onFiltersChange({ ...filters, assigned_professor_id: professorId });
  }, [filters, onFiltersChange]);

  // Handlers para rangos de fechas
  const handleCreatedDateChange = useCallback((range: DateRange) => {
    onFiltersChange({
      ...filters,
      created_from: range.start || undefined,
      created_to: range.end || undefined,
    });
  }, [filters, onFiltersChange]);

  const handleMembershipExpiresChange = useCallback((range: DateRange) => {
    onFiltersChange({
      ...filters,
      membership_expires_from: range.start || undefined,
      membership_expires_to: range.end || undefined,
    });
  }, [filters, onFiltersChange]);

  const handleLastActivityChange = useCallback((range: DateRange) => {
    onFiltersChange({
      ...filters,
      last_activity_from: range.start || undefined,
      last_activity_to: range.end || undefined,
    });
  }, [filters, onFiltersChange]);

  // Handlers para filtros booleanos
  const handleBooleanFilterChange = useCallback((key: keyof UserFilters) => {
    return (checked: boolean) => {
      onFiltersChange({ ...filters, [key]: checked || undefined });
    };
  }, [filters, onFiltersChange]);

  // Handler para remover filtro individual
  const handleRemoveFilter = useCallback((filterKey: string) => {
    const newFilters = { ...filters };
    
    switch (filterKey) {
      case 'search':
        delete newFilters.search;
        break;
      case 'role':
        delete newFilters.role;
        break;
      case 'status':
        delete newFilters.status;
        break;
      case 'membership_status':
        delete newFilters.membership_status;
        break;
      case 'traffic_light_status':
        delete newFilters.traffic_light_status;
        break;
      case 'gender':
        delete newFilters.gender;
        break;
      case 'assigned_professor_id':
        delete newFilters.assigned_professor_id;
        break;
      case 'created_date':
        delete newFilters.created_from;
        delete newFilters.created_to;
        break;
      case 'membership_date':
        delete newFilters.membership_expires_from;
        delete newFilters.membership_expires_to;
        break;
      case 'activity_date':
        delete newFilters.last_activity_from;
        delete newFilters.last_activity_to;
        break;
      case 'has_phone':
        delete newFilters.has_phone;
        break;
      case 'has_emergency_contact':
        delete newFilters.has_emergency_contact;
        break;
      case 'has_medical_notes':
        delete newFilters.has_medical_notes;
        break;
      case 'email_verified':
        delete newFilters.email_verified;
        break;
      case 'phone_verified':
        delete newFilters.phone_verified;
        break;
    }
    
    onFiltersChange(newFilters);
  }, [filters, onFiltersChange]);

  // Handler para limpiar todos los filtros
  const handleClearAllFilters = useCallback(() => {
    onReset?.();
  }, [onReset]);

  // Handler para toggle de colapso
  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  // Verificar si hay filtros activos
  const hasActiveFilters = useMemo(() => 
    filters.search ||
    (filters.role && filters.role.length > 0) ||
    (filters.status && filters.status.length > 0) ||
    (filters.membership_status && filters.membership_status.length > 0) ||
    (filters.traffic_light_status && filters.traffic_light_status.length > 0) ||
    (filters.gender && filters.gender.length > 0) ||
    filters.assigned_professor_id ||
    filters.created_from ||
    filters.created_to ||
    filters.membership_expires_from ||
    filters.membership_expires_to ||
    filters.last_activity_from ||
    filters.last_activity_to ||
    filters.has_phone ||
    filters.has_emergency_contact ||
    filters.has_medical_notes ||
    filters.email_verified ||
    filters.phone_verified
  , [filters]);

  // Memoizar valores para DateRangePicker
  const createdDateRange = useMemo(() => ({
    start: filters.created_from || null,
    end: filters.created_to || null,
  }), [filters.created_from, filters.created_to]);

  const membershipExpiresRange = useMemo(() => ({
    start: filters.membership_expires_from || null,
    end: filters.membership_expires_to || null,
  }), [filters.membership_expires_from, filters.membership_expires_to]);

  const lastActivityRange = useMemo(() => ({
    start: filters.last_activity_from || null,
    end: filters.last_activity_to || null,
  }), [filters.last_activity_from, filters.last_activity_to]);

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-900">Filtros de Usuarios</h3>
            {hasActiveFilters && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-villa-mitre-100 text-villa-mitre-800">
                {Object.values(filters).flat().filter(Boolean).length}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAllFilters}
                leftIcon={<XMarkIcon className="h-4 w-4" />}
              >
                Limpiar
              </Button>
            )}
            
            {collapsible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleCollapse}
                leftIcon={<AdjustmentsHorizontalIcon className="h-4 w-4" />}
              >
                {isCollapsed ? 'Expandir' : 'Contraer'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Chips de filtros activos */}
      {showChips && hasActiveFilters && (
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <UserFilterChips
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
            onClearAllFilters={handleClearAllFilters}
          />
        </div>
      )}

      {/* Contenido de filtros */}
      {(!collapsible || !isCollapsed) && (
        <div className="p-4 space-y-4">
          {/* Búsqueda */}
          <div>
            <SearchInput
              value={filters.search || ''}
              onChange={handleSearchChange}
              placeholder="Buscar por nombre, email o DNI..."
            />
          </div>

          {/* Filtros principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Roles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
              <MultiSelect
                options={roleOptions}
                value={filters.role || []}
                onChange={handleRoleChange}
                placeholder="Seleccionar roles..."
                searchable
                groupBy={true}
              />
            </div>

            {/* Estados */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estados</label>
              <MultiSelect
                options={statusOptions}
                value={filters.status || []}
                onChange={handleStatusChange}
                placeholder="Seleccionar estados..."
                groupBy={true}
              />
            </div>

            {/* Estados de membresía */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estados de Membresía</label>
              <MultiSelect
                options={membershipStatusOptions}
                value={filters.membership_status || []}
                onChange={handleMembershipStatusChange}
                placeholder="Seleccionar estados..."
                groupBy={true}
              />
            </div>

            {/* Sistema de semáforo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sistema de Semáforo</label>
              <MultiSelect
                options={trafficLightOptions}
                value={filters.traffic_light_status || []}
                onChange={handleTrafficLightChange}
                placeholder="Seleccionar estados..."
                groupBy={true}
              />
            </div>

            {/* Género */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Género</label>
              <MultiSelect
                options={genderOptions}
                value={filters.gender || []}
                onChange={handleGenderChange}
                placeholder="Seleccionar géneros..."
                groupBy={true}
              />
            </div>

            {/* Profesor asignado */}
            {professorOptions.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profesor Asignado</label>
                <MultiSelect
                  options={professorOptions}
                  value={filters.assigned_professor_id ? [filters.assigned_professor_id.toString()] : []}
                  onChange={handleProfessorChange}
                  placeholder="Seleccionar profesor..."
                  searchable
                  groupBy={true}
                />
              </div>
            )}
          </div>

          {/* Filtros de fecha */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DateRangePicker
              label="Fecha de Creación"
              value={createdDateRange}
              onChange={handleCreatedDateChange}
              placeholder="Seleccionar rango..."
              clearable
            />

            <DateRangePicker
              label="Vencimiento de Membresía"
              value={membershipExpiresRange}
              onChange={handleMembershipExpiresChange}
              placeholder="Seleccionar rango..."
              clearable
            />

            <DateRangePicker
              label="Última Actividad"
              value={lastActivityRange}
              onChange={handleLastActivityChange}
              placeholder="Seleccionar rango..."
              clearable
            />
          </div>

          {/* Filtros booleanos */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              Verificaciones y Datos
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.has_phone || false}
                  onChange={(e) => handleBooleanFilterChange('has_phone')(e.target.checked)}
                  className="rounded border-gray-300 text-villa-mitre-600 focus:ring-villa-mitre-500"
                />
                <span className="ml-2 text-sm text-gray-700">Con teléfono</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.has_emergency_contact || false}
                  onChange={(e) => handleBooleanFilterChange('has_emergency_contact')(e.target.checked)}
                  className="rounded border-gray-300 text-villa-mitre-600 focus:ring-villa-mitre-500"
                />
                <span className="ml-2 text-sm text-gray-700">Contacto emergencia</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.has_medical_notes || false}
                  onChange={(e) => handleBooleanFilterChange('has_medical_notes')(e.target.checked)}
                  className="rounded border-gray-300 text-villa-mitre-600 focus:ring-villa-mitre-500"
                />
                <span className="ml-2 text-sm text-gray-700">Notas médicas</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.email_verified || false}
                  onChange={(e) => handleBooleanFilterChange('email_verified')(e.target.checked)}
                  className="rounded border-gray-300 text-villa-mitre-600 focus:ring-villa-mitre-500"
                />
                <span className="ml-2 text-sm text-gray-700">Email verificado</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.phone_verified || false}
                  onChange={(e) => handleBooleanFilterChange('phone_verified')(e.target.checked)}
                  className="rounded border-gray-300 text-villa-mitre-600 focus:ring-villa-mitre-500"
                />
                <span className="ml-2 text-sm text-gray-700">Teléfono verificado</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default UserFiltersComponent;
