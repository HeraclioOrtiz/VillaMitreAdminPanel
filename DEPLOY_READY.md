# 🚀 BUILD DE PRODUCCIÓN LISTO - INSTRUCCIONES DEVOPS

**Fecha:** 08/01/2025  
**Versión:** 1.0.0  
**Servidor:** 38.242.206.48  
**Dominio:** panel.appvillamitre.surtekbb.com

---

## ✅ BUILD COMPLETADO

**Carpeta:** `dist/`  
**Tamaño:** ~820 KB (0.82 MB)  
**Archivos:**
- `index.html` (archivo principal)
- `assets/` (CSS + JavaScript compilados)
- `vite.svg` (favicon)

---

## 📋 INSTRUCCIONES PARA SUBIR AL SERVIDOR

### **OPCIÓN 1: Comprimir y Subir (Recomendado)**

1. **Comprimir la carpeta `dist/` en un ZIP:**
   - Archivo: `villa-mitre-admin-build.zip`
   - Contenido: Toda la carpeta `dist/` completa

2. **Subir al servidor:**
   ```bash
   # En el servidor (38.242.206.48)
   cd /var/www/panel
   
   # Descomprimir
   unzip villa-mitre-admin-build.zip
   
   # Verificar contenido
   ls -la dist/
   ```

3. **Configurar permisos:**
   ```bash
   sudo chown -R www-data:www-data dist/
   sudo chmod -R 755 dist/
   ```

---

### **OPCIÓN 2: SCP Directo (Más Rápido)**

```bash
# Desde tu PC local (si tienes acceso SSH)
scp -r dist/* root@38.242.206.48:/var/www/panel/dist/
```

---

## 🌐 CONFIGURACIÓN NGINX REQUERIDA

Crear o actualizar: `/etc/nginx/sites-available/panel.appvillamitre.conf`

```nginx
server {
    listen 80;
    server_name panel.appvillamitre.surtekbb.com;

    root /var/www/panel/dist;
    index index.html;

    # SPA Routing - Todas las rutas a index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache de assets estáticos
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Compresión Gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml font/truetype font/opentype 
               application/vnd.ms-fontobject image/svg+xml;
}
```

**Activar configuración:**
```bash
sudo ln -s /etc/nginx/sites-available/panel.appvillamitre.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔒 CERTIFICADO SSL (HTTPS)

```bash
sudo certbot --nginx -d panel.appvillamitre.surtekbb.com
sudo systemctl reload nginx
```

---

## ✅ VERIFICACIÓN POST-DEPLOY

### **1. Verificar archivos:**
```bash
ls -lah /var/www/panel/dist/
# Debe mostrar: index.html, assets/, vite.svg
```

### **2. Probar en navegador:**
```
http://panel.appvillamitre.surtekbb.com
```

**Checklist:**
- [ ] La página carga (no muestra 404)
- [ ] Login funciona
- [ ] No hay errores en consola del navegador (F12)
- [ ] La API conecta: `https://appvillamitre.surtekbb.com/api`

### **3. Verificar logs:**
```bash
# Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🐛 TROUBLESHOOTING

### **Error: "Cannot GET /"**
```
Problema: Nginx no encuentra index.html
Solución: Verificar root path en nginx.conf
```

### **Error: "404 en rutas /admin, /gym, etc."**
```
Problema: Falta configuración SPA
Solución: Agregar try_files $uri $uri/ /index.html;
```

### **Error: "ERR_CERT_AUTHORITY_INVALID"**
```
Problema: SSL no configurado o certificado inválido
Solución: Ejecutar certbot para instalar certificado
```

### **Assets no cargan (archivos .js .css)**
```
Problema: Permisos incorrectos
Solución: sudo chmod -R 755 dist/
```

---

## 📊 INFORMACIÓN TÉCNICA

**Stack:**
- React 19.1.1
- Vite 7.1.6
- TypeScript 5.8.3
- Tailwind CSS 3.3.6

**Variables de Entorno (compiladas en el build):**
- `VITE_API_BASE_URL`: https://appvillamitre.surtekbb.com/api
- `VITE_DEBUG_API`: false (producción)

**Navegadores Soportados:**
- Chrome/Edge: últimas 2 versiones
- Firefox: últimas 2 versiones
- Safari: últimas 2 versiones

---

## 🔄 ACTUALIZACIONES FUTURAS

Para futuros deploys:

1. **Desarrollador hace build:**
   ```bash
   npm run build
   ```

2. **Comprimir y enviar:**
   - ZIP de `dist/`
   - Enviar a DevOps

3. **DevOps sube al servidor:**
   ```bash
   cd /var/www/panel
   rm -rf dist.old
   mv dist dist.old  # Backup
   unzip nueva-version.zip
   sudo systemctl reload nginx
   ```

4. **Rollback si falla:**
   ```bash
   rm -rf dist
   mv dist.old dist
   sudo systemctl reload nginx
   ```

---

## ✅ DEPLOY EXITOSO CUANDO:

- [x] Build completado sin errores
- [ ] Archivos subidos al servidor
- [ ] Nginx configurado correctamente
- [ ] SSL (HTTPS) funcionando
- [ ] Página carga en navegador
- [ ] Login funciona
- [ ] API conecta correctamente
- [ ] Sin errores en consola

---

## 📞 CONTACTO

**Desarrollador:** [Tu nombre]  
**Email:** [Tu email]  
**Repositorio:** https://github.com/HeraclioOrtiz/VillaMitreAdminPanel

---

**¡Build listo para deploy! 🎉**
