#!/bin/bash

# 🧪 SCRIPT DE TESTING COMPLETO - Villa Mitre Admin Panel
# Este script ejecuta todos los tipos de testing definidos en el plan

echo "🚀 Iniciando testing completo de Villa Mitre Admin Panel..."
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Variables de control
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Función para ejecutar comando y capturar resultado
run_test() {
    local test_name="$1"
    local command="$2"
    
    log "Ejecutando: $test_name"
    
    if eval "$command"; then
        success "$test_name completado"
        ((PASSED_TESTS++))
    else
        error "$test_name falló"
        ((FAILED_TESTS++))
    fi
    
    ((TOTAL_TESTS++))
    echo ""
}

# 1. TESTS UNITARIOS
echo "📋 FASE 1: TESTS UNITARIOS"
echo "=========================="

run_test "Tests de Componentes UI" "npm run test:unit -- --reporter=verbose"
run_test "Tests de Hooks" "npm run test:unit -- src/hooks --reporter=verbose"
run_test "Tests de Servicios" "npm run test:unit -- src/services --reporter=verbose"

# 2. TESTS DE INTEGRACIÓN
echo "🔗 FASE 2: TESTS DE INTEGRACIÓN"
echo "==============================="

run_test "Tests de Integración" "npm run test:integration"

# 3. TESTS E2E
echo "🌐 FASE 3: TESTS END-TO-END"
echo "==========================="

run_test "Tests E2E - User Management" "npm run test:e2e -- user-management.spec.ts"
run_test "Tests E2E - Exercise Management" "npm run test:e2e -- exercise-management.spec.ts"
run_test "Tests E2E - Template Management" "npm run test:e2e -- template-management.spec.ts"

# 4. TESTS DE PERFORMANCE
echo "⚡ FASE 4: TESTS DE PERFORMANCE"
echo "=============================="

run_test "Lighthouse Performance" "npm run test:performance"
run_test "Bundle Size Analysis" "npm run analyze:bundle"

# 5. COBERTURA DE CÓDIGO
echo "📊 FASE 5: COBERTURA DE CÓDIGO"
echo "=============================="

run_test "Reporte de Cobertura" "npm run test:coverage"

# 6. TESTS DE ACCESIBILIDAD
echo "♿ FASE 6: TESTS DE ACCESIBILIDAD"
echo "================================"

run_test "Tests de Accesibilidad" "npm run test:a11y"

# RESUMEN FINAL
echo "📈 RESUMEN DE TESTING"
echo "===================="
echo "Total de tests ejecutados: $TOTAL_TESTS"
success "Tests exitosos: $PASSED_TESTS"
if [ $FAILED_TESTS -gt 0 ]; then
    error "Tests fallidos: $FAILED_TESTS"
else
    success "Tests fallidos: $FAILED_TESTS"
fi

# Calcular porcentaje de éxito
if [ $TOTAL_TESTS -gt 0 ]; then
    SUCCESS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo "Tasa de éxito: $SUCCESS_RATE%"
    
    if [ $SUCCESS_RATE -ge 90 ]; then
        success "¡Excelente! Tasa de éxito superior al 90%"
    elif [ $SUCCESS_RATE -ge 80 ]; then
        warning "Buena tasa de éxito, pero hay margen de mejora"
    else
        error "Tasa de éxito baja, revisar tests fallidos"
    fi
fi

# Generar reporte final
echo ""
log "Generando reporte final..."
cat > test-report.md << EOF
# 📊 Reporte de Testing - Villa Mitre Admin Panel

**Fecha:** $(date +'%Y-%m-%d %H:%M:%S')

## Resumen Ejecutivo
- **Total de tests:** $TOTAL_TESTS
- **Tests exitosos:** $PASSED_TESTS
- **Tests fallidos:** $FAILED_TESTS
- **Tasa de éxito:** $SUCCESS_RATE%

## Fases Ejecutadas
1. ✅ Tests Unitarios
2. ✅ Tests de Integración  
3. ✅ Tests End-to-End
4. ✅ Tests de Performance
5. ✅ Cobertura de Código
6. ✅ Tests de Accesibilidad

## Próximos Pasos
- Revisar tests fallidos si los hay
- Mejorar cobertura de código si es necesario
- Optimizar performance según métricas
- Corregir issues de accesibilidad

---
*Generado automáticamente por test-all-features.sh*
EOF

success "Reporte generado: test-report.md"

# Exit code basado en resultados
if [ $FAILED_TESTS -eq 0 ]; then
    success "🎉 ¡Todos los tests pasaron exitosamente!"
    exit 0
else
    error "❌ Algunos tests fallaron. Revisar logs para más detalles."
    exit 1
fi
