#!/bin/bash

# 🔄 SCRIPT DE TESTING CONTINUO - Villa Mitre Admin Panel
# Este script ejecuta tests en modo watch para desarrollo activo

echo "🔄 Iniciando testing continuo para desarrollo..."
echo "=============================================="

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

# Función para mostrar menú
show_menu() {
    echo ""
    echo "🎯 OPCIONES DE TESTING CONTINUO"
    echo "==============================="
    echo "1. 🧪 Tests unitarios en watch mode"
    echo "2. 🔗 Tests de integración en watch mode"
    echo "3. 🌐 Tests E2E en modo UI"
    echo "4. 📊 Cobertura en tiempo real"
    echo "5. ⚡ Performance monitoring"
    echo "6. 🎨 Tests de componentes específicos"
    echo "7. 📱 Tests responsive en tiempo real"
    echo "8. 🔍 Tests de un feature específico"
    echo "9. 🚀 Todos los tests en paralelo"
    echo "0. ❌ Salir"
    echo ""
    read -p "Selecciona una opción (0-9): " choice
}

# Función para tests unitarios en watch
unit_tests_watch() {
    log "Iniciando tests unitarios en modo watch..."
    success "Presiona 'q' para salir del modo watch"
    npm run test:watch
}

# Función para tests de integración en watch
integration_tests_watch() {
    log "Iniciando tests de integración en modo watch..."
    success "Los tests se ejecutarán automáticamente al cambiar archivos"
    npm run test:integration -- --watch
}

# Función para tests E2E con UI
e2e_tests_ui() {
    log "Iniciando tests E2E con interfaz visual..."
    success "Se abrirá la interfaz de Playwright"
    npm run test:e2e:ui
}

# Función para cobertura en tiempo real
coverage_watch() {
    log "Iniciando monitoreo de cobertura en tiempo real..."
    success "La cobertura se actualizará automáticamente"
    npm run test:coverage -- --watch --reporter=verbose
}

# Función para performance monitoring
performance_monitoring() {
    log "Iniciando monitoreo de performance..."
    
    # Crear script de monitoreo
    cat > temp-performance-monitor.js << 'EOF'
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Monitoreando performance...');

setInterval(() => {
    try {
        // Ejecutar lighthouse en modo headless
        const result = execSync('lighthouse http://localhost:5173 --only-categories=performance --output=json --quiet', 
            { encoding: 'utf8' });
        
        const report = JSON.parse(result);
        const score = Math.round(report.lhr.categories.performance.score * 100);
        
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] Performance Score: ${score}/100`);
        
        // Alertar si el score baja mucho
        if (score < 80) {
            console.log('⚠️  Performance score bajo detectado!');
        }
        
    } catch (error) {
        console.log('❌ Error en monitoreo de performance');
    }
}, 30000); // Cada 30 segundos
EOF

    node temp-performance-monitor.js
}

# Función para tests de componentes específicos
component_tests() {
    echo ""
    echo "🎨 TESTS DE COMPONENTES ESPECÍFICOS"
    echo "=================================="
    echo "1. Button component"
    echo "2. DataTable component"
    echo "3. Toast system"
    echo "4. UserActions component"
    echo "5. ExerciseCard component"
    echo "6. Modal component"
    echo "7. Todos los componentes UI"
    echo ""
    read -p "Selecciona componente (1-7): " comp_choice
    
    case $comp_choice in
        1) npm run test:watch -- Button.test.tsx ;;
        2) npm run test:watch -- DataTable.test.tsx ;;
        3) npm run test:watch -- Toast.test.tsx ;;
        4) npm run test:watch -- UserActions.test.tsx ;;
        5) npm run test:watch -- ExerciseCard.test.tsx ;;
        6) npm run test:watch -- Modal.test.tsx ;;
        7) npm run test:watch -- src/test/unit/components/ui ;;
        *) error "Opción inválida" ;;
    esac
}

# Función para tests responsive
responsive_tests() {
    log "Iniciando tests responsive en tiempo real..."
    
    # Crear script de tests responsive
    cat > temp-responsive-test.js << 'EOF'
const { chromium } = require('playwright');

async function testResponsive() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const viewports = [
        { width: 375, height: 667, name: 'Mobile' },
        { width: 768, height: 1024, name: 'Tablet' },
        { width: 1024, height: 768, name: 'Tablet Landscape' },
        { width: 1440, height: 900, name: 'Desktop' },
        { width: 1920, height: 1080, name: 'Large Desktop' }
    ];
    
    for (const viewport of viewports) {
        console.log(`📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
        
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('http://localhost:5173');
        await page.waitForLoadState('networkidle');
        
        // Screenshot para cada viewport
        await page.screenshot({ 
            path: `screenshots/responsive-${viewport.name.toLowerCase().replace(' ', '-')}.png`,
            fullPage: true 
        });
        
        await page.waitForTimeout(2000);
    }
    
    await browser.close();
    console.log('✅ Tests responsive completados. Screenshots guardados en /screenshots');
}

testResponsive().catch(console.error);
EOF

    # Crear directorio de screenshots
    mkdir -p screenshots
    node temp-responsive-test.js
}

# Función para tests de feature específico
feature_tests() {
    echo ""
    echo "🔍 TESTS DE FEATURE ESPECÍFICO"
    echo "============================="
    echo "1. 👥 User Management (MICROPASO 17-21)"
    echo "2. 💪 Exercise System (MICROPASO 8-16)"
    echo "3. 📋 Template System (MICROPASO 8-13)"
    echo "4. 🎨 UI Components (MICROPASO 1-7)"
    echo "5. 🔧 Performance System (MICROPASO 16)"
    echo ""
    read -p "Selecciona feature (1-5): " feature_choice
    
    case $feature_choice in
        1) 
            log "Testing User Management System..."
            npm run test:watch -- "src/test/unit/components/admin|src/test/unit/hooks/useUsers|src/test/e2e/user-management"
            ;;
        2) 
            log "Testing Exercise System..."
            npm run test:watch -- "src/test/unit/components/gym|src/test/unit/hooks/useExercises|src/test/e2e/exercise-management"
            ;;
        3) 
            log "Testing Template System..."
            npm run test:watch -- "src/test/unit/components/gym.*Template|src/test/unit/hooks/useTemplates"
            ;;
        4) 
            log "Testing UI Components..."
            npm run test:watch -- "src/test/unit/components/ui"
            ;;
        5) 
            log "Testing Performance Optimizations..."
            npm run test:watch -- "src/test/unit/performance"
            ;;
        *) error "Opción inválida" ;;
    esac
}

# Función para todos los tests en paralelo
all_tests_parallel() {
    log "Iniciando todos los tests en paralelo..."
    warning "Esto puede consumir muchos recursos del sistema"
    
    # Ejecutar en background
    npm run test:watch &
    UNIT_PID=$!
    
    npm run test:e2e:ui &
    E2E_PID=$!
    
    # Función para cleanup
    cleanup() {
        log "Deteniendo todos los procesos..."
        kill $UNIT_PID 2>/dev/null
        kill $E2E_PID 2>/dev/null
        exit 0
    }
    
    # Trap para cleanup
    trap cleanup SIGINT SIGTERM
    
    success "Tests ejecutándose en paralelo. Presiona Ctrl+C para detener."
    wait
}

# Función principal
main() {
    # Verificar que estamos en el directorio correcto
    if [ ! -f "package.json" ]; then
        error "Este script debe ejecutarse desde el directorio raíz del proyecto"
        exit 1
    fi
    
    # Verificar que las dependencias están instaladas
    if [ ! -d "node_modules" ]; then
        warning "Dependencias no encontradas. Instalando..."
        npm install
    fi
    
    # Loop principal
    while true; do
        show_menu
        
        case $choice in
            1) unit_tests_watch ;;
            2) integration_tests_watch ;;
            3) e2e_tests_ui ;;
            4) coverage_watch ;;
            5) performance_monitoring ;;
            6) component_tests ;;
            7) responsive_tests ;;
            8) feature_tests ;;
            9) all_tests_parallel ;;
            0) 
                success "¡Hasta luego! 👋"
                # Cleanup archivos temporales
                rm -f temp-*.js
                exit 0
                ;;
            *) error "Opción inválida. Por favor selecciona 0-9." ;;
        esac
        
        echo ""
        read -p "Presiona Enter para volver al menú principal..."
    done
}

# Cleanup al salir
cleanup_on_exit() {
    rm -f temp-*.js
}
trap cleanup_on_exit EXIT

# Ejecutar función principal
main
