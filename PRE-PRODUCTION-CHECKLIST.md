# ✅ Checklist Pre-Producción - Villa Mitre Admin

Este checklist debe ser completado antes de desplegar a producción.

## 📋 Configuración

### Variables de Entorno
- [ ] Archivo `.env` creado en el servidor
- [ ] `VITE_API_BASE_URL` apunta al servidor de producción
- [ ] `VITE_DEBUG_API=false` en producción
- [ ] Variables de entorno NO están en el repositorio
- [ ] `.env.example` actualizado con todas las variables necesarias

### Git y Repositorio
- [ ] Todos los cambios están commiteados
- [ ] Push realizado a GitHub/GitLab
- [ ] `.gitignore` actualizado (incluye `.env`, `dist`, etc.)
- [ ] README.md actualizado con información correcta
- [ ] Sin archivos sensibles en el repositorio

## 🔧 Código y Compilación

### TypeScript
- [ ] `npx tsc --noEmit` pasa sin errores
- [ ] No hay `any` types sin justificación
- [ ] Todos los imports resuelven correctamente
- [ ] No hay código comentado innecesario

### Build de Producción
- [ ] `npm run build` ejecuta sin errores
- [ ] Directorio `/dist` se genera correctamente
- [ ] Tamaño del bundle es razonable (< 1MB ideal)
- [ ] Assets se copian correctamente (imágenes, fuentes)

### Testing
- [ ] No hay console.log innecesarios en producción
- [ ] Todas las rutas principales cargán correctamente
- [ ] El login funciona correctamente
- [ ] La navegación entre páginas funciona
- [ ] Los formularios validan correctamente

## 🌐 Servidor y Deployment

### Servidor
- [ ] Node.js v18+ instalado
- [ ] npm actualizado
- [ ] Git instalado
- [ ] Nginx o Apache configurado
- [ ] SSL/TLS certificado instalado y activo

### Nginx
- [ ] Archivo de configuración creado
- [ ] `try_files` configurado para SPA routing
- [ ] Proxy para `/api` configurado (si es necesario)
- [ ] Gzip compression activado
- [ ] Cache headers configurados
- [ ] Security headers añadidos
- [ ] `nginx -t` pasa sin errores
- [ ] Nginx reload ejecutado

### Permisos
- [ ] Directorio propiedad de `www-data` (o usuario web)
- [ ] Permisos 644 para archivos
- [ ] Permisos 755 para directorios
- [ ] Script `deploy.sh` es ejecutable (755)

## 🔐 Seguridad

### Headers de Seguridad
- [ ] `X-Frame-Options` configurado
- [ ] `X-Content-Type-Options` configurado
- [ ] `X-XSS-Protection` configurado
- [ ] `Referrer-Policy` configurado
- [ ] HTTPS activo y funcionando
- [ ] Certificado SSL válido

### Autenticación
- [ ] Tokens se almacenan de forma segura
- [ ] Logout limpia correctamente el estado
- [ ] Rutas protegidas no son accesibles sin auth
- [ ] Roles y permisos funcionan correctamente

## 🎨 Frontend

### UI/UX
- [ ] Logo del club se muestra correctamente
- [ ] Colores Villa Mitre aplicados
- [ ] Responsive design funciona (mobile, tablet, desktop)
- [ ] Sidebar colapsable funciona
- [ ] Menú de usuario funciona
- [ ] Toast notifications funcionan
- [ ] Loading states se muestran correctamente
- [ ] Empty states se muestran cuando corresponde

### Funcionalidades Principales
- [ ] Login/Logout funciona
- [ ] Dashboard muestra mensaje de bienvenida
- [ ] Lista de ejercicios carga y filtra
- [ ] Crear/editar ejercicios funciona
- [ ] Lista de plantillas carga
- [ ] Crear plantillas con wizard funciona
- [ ] Gestión de estudiantes (profesor) funciona
- [ ] Asignación de plantillas funciona
- [ ] Gestión de usuarios (admin) funciona

## 🔌 API y Backend

### Conexión
- [ ] API responde correctamente
- [ ] CORS configurado correctamente
- [ ] Autenticación con backend funciona
- [ ] Todas las rutas API existen
- [ ] Error handling funciona correctamente

### Datos
- [ ] Los datos se cargan correctamente
- [ ] Las mutaciones (crear/actualizar/eliminar) funcionan
- [ ] Validaciones del backend se manejan bien
- [ ] Foreign key constraints se respetan

## 📊 Performance

### Optimización
- [ ] React Query cache configurado
- [ ] Componentes críticos memoizados
- [ ] Imágenes optimizadas
- [ ] CSS minificado
- [ ] JavaScript minificado
- [ ] No hay memory leaks visibles
- [ ] Navegación es fluida

### Tamaño
- [ ] Bundle total < 1MB (ideal)
- [ ] Chunks separados por ruta (code splitting)
- [ ] Vendor bundle separado
- [ ] Assets cacheables configurados

## 🔍 Testing Final

### Manual Testing
- [ ] Probado en Chrome
- [ ] Probado en Firefox
- [ ] Probado en Safari (si aplica)
- [ ] Probado en móvil
- [ ] Probado en tablet
- [ ] Todas las rutas funcionan
- [ ] Refresh no rompe la navegación (SPA)

### Flujos Críticos
- [ ] **Flujo de Login**: DNI/Password → Dashboard
- [ ] **Flujo Profesor**: Login → Mis Estudiantes → Asignar Plantilla
- [ ] **Flujo Admin**: Login → Usuarios → Crear Usuario
- [ ] **Flujo Gimnasio**: Login → Ejercicios → Crear Ejercicio

## 📝 Documentación

### Archivos
- [ ] `README.md` actualizado
- [ ] `DEPLOYMENT.md` creado y completo
- [ ] `PRE-PRODUCTION-CHECKLIST.md` completado
- [ ] `.env.example` tiene todas las variables
- [ ] Comentarios de código actualizados

### Comunicación
- [ ] Equipo notificado del deployment
- [ ] URLs de producción compartidas
- [ ] Credenciales de prueba disponibles
- [ ] Plan de rollback definido

## 🚀 Deployment

### Antes de Desplegar
- [ ] Backup del servidor actual (si aplica)
- [ ] Base de datos respaldada
- [ ] Ventana de mantenimiento coordinada
- [ ] Equipo de soporte disponible

### Durante el Deployment
- [ ] Repositorio clonado en el servidor
- [ ] Dependencias instaladas
- [ ] Variables de entorno configuradas
- [ ] Build de producción ejecutado
- [ ] Nginx configurado y recargado
- [ ] HTTPS funcionando

### Después de Desplegar
- [ ] Aplicación carga correctamente
- [ ] Login funciona
- [ ] API conecta correctamente
- [ ] No hay errores en consola
- [ ] No hay errores en logs de Nginx
- [ ] SSL activo y válido
- [ ] Todas las rutas funcionan

## 🔄 Monitoreo Post-Deployment

### Primeros 15 minutos
- [ ] Monitorear logs de Nginx
- [ ] Verificar que no hay errores 500
- [ ] Probar flujos críticos
- [ ] Verificar que API responde

### Primeras 24 horas
- [ ] Monitorear performance
- [ ] Revisar logs de errores
- [ ] Recopilar feedback de usuarios
- [ ] Verificar métricas de uso

## 🚨 Rollback Plan

### Si algo falla
1. Identificar el problema (logs, errores)
2. Evaluar si es crítico o puede esperar
3. Si es crítico:
   - Revertir al commit anterior: `git checkout [hash]`
   - Recompilar: `npm run build`
   - Recargar Nginx: `sudo systemctl reload nginx`
4. Investigar el problema en desarrollo
5. Fijar y redesplegar

### Contactos de Emergencia
- **DevOps**: [nombre/email]
- **Backend**: [nombre/email]
- **Frontend**: [nombre/email]

---

## ✅ Aprobación Final

**Fecha**: ___________  
**Revisado por**: ___________  
**Aprobado para producción**: [ ] SÍ / [ ] NO

**Notas adicionales**:
___________________________________________
___________________________________________
___________________________________________

---

**Versión:** 1.0.0  
**Última actualización:** Enero 2025
