# 🚀 Guía de Despliegue - Villa Mitre Admin

Esta guía detalla el proceso completo para desplegar la aplicación en un servidor de producción.

## 📋 Prerrequisitos en el Servidor

### Software Requerido
- **Node.js**: v18.x o superior
- **npm**: v9.x o superior
- **Git**: Para clonar el repositorio
- **Servidor Web**: Nginx o Apache (recomendado Nginx)
- **SSL**: Certificado SSL/TLS configurado

### Verificar versiones
```bash
node --version
npm --version
git --version
```

## 🔧 Configuración Inicial

### 1. Clonar el repositorio
```bash
cd /var/www
git clone https://github.com/[tu-usuario]/villa-mitre-admin.git
cd villa-mitre-admin
```

### 2. Configurar variables de entorno
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar con las variables de producción
nano .env
```

**Variables de Producción:**
```env
# API Configuration
VITE_API_BASE_URL=https://appvillamitre.surtekbb.com/api

# App Configuration
VITE_APP_NAME=Villa Mitre Admin
VITE_APP_VERSION=1.0.0

# Debug Mode (DESACTIVAR EN PRODUCCIÓN)
VITE_DEBUG_API=false
```

### 3. Instalar dependencias
```bash
npm install --production
```

### 4. Compilar para producción
```bash
npm run build
```

Este comando:
- ✅ Compila TypeScript
- ✅ Optimiza el código (minificación, tree-shaking)
- ✅ Genera bundle optimizado en `/dist`
- ✅ Procesa CSS con PostCSS y Tailwind
- ✅ Optimiza assets (imágenes, fuentes)

## 🌐 Configuración de Nginx

### Archivo de configuración
Crear: `/etc/nginx/sites-available/villa-mitre-admin`

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name admin.villamitre.com;

    # Redirigir HTTP a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name admin.villamitre.com;

    # Certificados SSL
    ssl_certificate /etc/letsencrypt/live/admin.villamitre.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.villamitre.com/privkey.pem;

    # Configuración SSL (Mozilla Intermediate)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Root directory
    root /var/www/villa-mitre-admin/dist;
    index index.html;

    # Logs
    access_log /var/log/nginx/villa-mitre-admin.access.log;
    error_log /var/log/nginx/villa-mitre-admin.error.log;

    # Compresión Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Cache de assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # API Proxy (si es necesario)
    location /api {
        proxy_pass https://appvillamitre.surtekbb.com/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # SPA - Todas las rutas apuntan a index.html
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

### Activar configuración
```bash
# Crear symlink
sudo ln -s /etc/nginx/sites-available/villa-mitre-admin /etc/nginx/sites-enabled/

# Verificar configuración
sudo nginx -t

# Recargar Nginx
sudo systemctl reload nginx
```

## 🔄 Script de Despliegue Automático

Crear: `/var/www/villa-mitre-admin/deploy.sh`

```bash
#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Iniciando despliegue de Villa Mitre Admin...${NC}"

# 1. Verificar que estamos en la rama correcta
BRANCH=$(git branch --show-current)
echo -e "${YELLOW}📌 Rama actual: $BRANCH${NC}"

# 2. Pull últimos cambios
echo -e "${YELLOW}📥 Descargando últimos cambios...${NC}"
git pull origin main
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al descargar cambios${NC}"
    exit 1
fi

# 3. Instalar/actualizar dependencias
echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
npm install --production
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al instalar dependencias${NC}"
    exit 1
fi

# 4. Compilar para producción
echo -e "${YELLOW}🔨 Compilando aplicación...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al compilar${NC}"
    exit 1
fi

# 5. Verificar que dist existe
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ El directorio dist no existe${NC}"
    exit 1
fi

# 6. Recargar Nginx
echo -e "${YELLOW}🔄 Recargando Nginx...${NC}"
sudo systemctl reload nginx
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al recargar Nginx${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Despliegue completado exitosamente!${NC}"
echo -e "${GREEN}🌐 Aplicación disponible en: https://admin.villamitre.com${NC}"
```

### Hacer ejecutable el script
```bash
chmod +x deploy.sh
```

### Ejecutar despliegue
```bash
./deploy.sh
```

## 🔐 Configuración de Permisos

```bash
# Propietario del directorio
sudo chown -R www-data:www-data /var/www/villa-mitre-admin

# Permisos de archivos
sudo find /var/www/villa-mitre-admin -type f -exec chmod 644 {} \;
sudo find /var/www/villa-mitre-admin -type d -exec chmod 755 {} \;

# Permisos del script de despliegue
chmod +x /var/www/villa-mitre-admin/deploy.sh
```

## 📊 Monitoreo y Logs

### Ver logs de Nginx
```bash
# Logs de acceso
sudo tail -f /var/log/nginx/villa-mitre-admin.access.log

# Logs de errores
sudo tail -f /var/log/nginx/villa-mitre-admin.error.log
```

### Verificar estado de Nginx
```bash
sudo systemctl status nginx
```

## 🔄 Actualización de la Aplicación

Para actualizar la aplicación a una nueva versión:

```bash
cd /var/www/villa-mitre-admin
./deploy.sh
```

El script automáticamente:
1. ✅ Descarga los últimos cambios
2. ✅ Instala dependencias actualizadas
3. ✅ Compila nueva versión
4. ✅ Recarga Nginx

## 🔍 Verificación Post-Despliegue

### Checklist
- [ ] La aplicación carga correctamente en el navegador
- [ ] La API se conecta sin errores
- [ ] El login funciona correctamente
- [ ] Las rutas de navegación funcionan (SPA routing)
- [ ] Los assets se cargan correctamente
- [ ] SSL está activo y funcionando
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores en los logs de Nginx

### URLs de prueba
```
https://admin.villamitre.com/
https://admin.villamitre.com/login
https://admin.villamitre.com/gym/dashboard
https://admin.villamitre.com/professor/students
https://admin.villamitre.com/admin/dashboard
```

## 🚨 Rollback (Revertir Cambios)

Si algo sale mal:

```bash
# Ver commits recientes
git log --oneline -n 5

# Revertir al commit anterior
git checkout [commit-hash]

# Recompilar
npm run build

# Recargar Nginx
sudo systemctl reload nginx
```

## 📝 Notas Importantes

1. **Variables de Entorno**: Nunca commitar el archivo `.env` al repositorio
2. **Debug Mode**: Asegurarse de que `VITE_DEBUG_API=false` en producción
3. **Cache**: Limpiar cache del navegador después de actualizar
4. **Backup**: Hacer backup del directorio `dist` antes de actualizar
5. **SSL**: Renovar certificados SSL cada 90 días (si usa Let's Encrypt)

## 🔧 Troubleshooting

### Problema: La aplicación no carga
**Solución:**
```bash
# Verificar logs de Nginx
sudo tail -f /var/log/nginx/villa-mitre-admin.error.log

# Verificar permisos
ls -la /var/www/villa-mitre-admin/dist

# Verificar configuración de Nginx
sudo nginx -t
```

### Problema: Rutas 404 en SPA
**Solución:** Verificar que `try_files $uri $uri/ /index.html;` esté en la configuración de Nginx

### Problema: API no se conecta
**Solución:** Verificar `VITE_API_BASE_URL` en `.env` y CORS en el backend

## 📞 Soporte

Para problemas o dudas:
- **Email**: soporte@villamitre.com
- **Documentación**: Ver README.md del proyecto
- **Logs**: Revisar `/var/log/nginx/` para más detalles

---

**Última actualización:** Enero 2025  
**Versión:** 1.0.0
