# 🚀 Instrucciones de Deploy - Villa Mitre Admin

## 📋 Pre-requisitos

- Node.js 18+ instalado
- npm o yarn instalado
- Acceso al repositorio Git
- Credenciales del servidor de producción (si aplica)

---

## 🔧 Preparación Local

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno

Edita `.env.production` con los valores reales:

```env
# ⚠️ CAMBIAR ESTA URL A LA DE PRODUCCIÓN
VITE_API_BASE_URL=https://tu-dominio-produccion.com/api

VITE_APP_NAME=Villa Mitre Admin
VITE_APP_VERSION=1.0.0
VITE_DEBUG_API=false
```

### 3. Corregir Errores de TypeScript (CRÍTICO)

Antes de hacer el build, debes corregir los errores en estos archivos:

```bash
# Ver lista completa de errores
npm run build
```

**Archivos a corregir:**
- `src/components/admin/AssignmentFilters.tsx` (línea 81)
- `src/utils/testing.ts` (línea 69) - O eliminar si no es necesario
- `src/components/admin/AssignmentManagement.tsx` (línea 300)

---

## 🏗️ Build de Producción

### 1. Limpiar Build Anterior (Opcional)
```bash
# Windows
Remove-Item -Recurse -Force dist

# Linux/Mac
rm -rf dist
```

### 2. Crear Build
```bash
npm run build
```

✅ **Build exitoso cuando ves:**
```
✓ built in [tiempo]
dist/index.html                   [tamaño]
dist/assets/index-[hash].js       [tamaño]
dist/assets/index-[hash].css      [tamaño]
```

### 3. Probar Build Localmente
```bash
npm run preview
```

Abre `http://localhost:4173` y verifica:
- ✅ La app carga correctamente
- ✅ Login funciona
- ✅ Navegación entre páginas funciona
- ✅ API se conecta correctamente

---

## 🌐 Deploy a Diferentes Plataformas

### Opción 1: Vercel (Recomendado - Más Fácil)

#### Deploy Manual:
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### Deploy con Git:
1. Conecta tu repositorio en vercel.com
2. Configura variables de entorno en Vercel Dashboard
3. Push a la rama `main` - Deploy automático ✅

**Variables de entorno en Vercel:**
```
VITE_API_BASE_URL = https://tu-api-produccion.com/api
VITE_APP_NAME = Villa Mitre Admin
VITE_APP_VERSION = 1.0.0
VITE_DEBUG_API = false
```

---

### Opción 2: Netlify

#### Deploy Manual:
```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

#### Deploy con Git:
1. Conecta tu repositorio en netlify.com
2. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Configura variables de entorno
4. Deploy automático al push ✅

---

### Opción 3: Servidor Propio (VPS/Cloud)

#### 1. Build Local:
```bash
npm run build
```

#### 2. Subir a Servidor:
```bash
# SCP
scp -r dist/* user@tu-servidor:/var/www/villa-mitre-admin

# O usar FTP/SFTP client como FileZilla
```

#### 3. Configurar Nginx:
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    root /var/www/villa-mitre-admin;
    index index.html;

    # Rutas SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache de assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Compresión Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### 4. Reiniciar Nginx:
```bash
sudo systemctl reload nginx
```

---

### Opción 4: Docker

#### 1. Crear Dockerfile:
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. Build y Run:
```bash
# Build imagen
docker build -t villa-mitre-admin .

# Run contenedor
docker run -d -p 80:80 --name villa-mitre-admin villa-mitre-admin
```

---

## 🔍 Verificación Post-Deploy

### Checklist de Funcionalidad:
- [ ] ✅ App carga sin errores en consola
- [ ] ✅ Login funciona correctamente
- [ ] ✅ Dashboard muestra datos
- [ ] ✅ Navegación entre todas las páginas
- [ ] ✅ CRUD de ejercicios funciona
- [ ] ✅ CRUD de plantillas funciona
- [ ] ✅ Sistema de usuarios funciona
- [ ] ✅ Sistema de asignaciones funciona

### Checklist Técnico:
- [ ] ✅ API se conecta correctamente
- [ ] ✅ Autenticación persiste
- [ ] ✅ Sin errores 404 en assets
- [ ] ✅ SSL configurado (HTTPS)
- [ ] ✅ Compresión Gzip habilitada
- [ ] ✅ Cache de assets funcionando

---

## 🐛 Troubleshooting

### Error: "API Connection Failed"
```bash
# Verificar VITE_API_BASE_URL
cat .env.production

# Verificar que la API esté accesible
curl https://tu-api.com/api/health
```

### Error: 404 en Rutas
```
Causa: Configuración del servidor no maneja rutas SPA
Solución: Configurar try_files en Nginx o equivalente
```

### Error: Build Falla con TypeScript
```bash
# Ver errores específicos
npm run build 2>&1 | grep "error TS"

# Solución: Corregir errores antes de deploy
```

### Assets No Cargan
```
Causa: Problemas con base path o CORS
Solución: Verificar configuración en vite.config.ts
```

---

## 📊 Monitoreo Post-Deploy

### 1. Logs de Errores
Integrar Sentry:
```bash
npm install @sentry/react

# Configurar en main.tsx
```

### 2. Analytics
```bash
npm install @vercel/analytics
# o
npm install react-ga4
```

### 3. Performance Monitoring
Usar Lighthouse o WebPageTest para verificar:
- Performance Score > 90
- First Contentful Paint < 2s
- Time to Interactive < 3s

---

## 🔄 Actualización Futura

### Deploy de Updates:
```bash
# 1. Pull cambios
git pull origin main

# 2. Instalar nuevas dependencias (si hay)
npm install

# 3. Build
npm run build

# 4. Deploy según plataforma
vercel --prod
# o
netlify deploy --prod
# o
scp -r dist/* user@servidor:/var/www/villa-mitre-admin
```

### Rollback (si algo falla):
```bash
# Vercel
vercel rollback

# Netlify
netlify rollback

# Servidor propio
scp -r backup/* user@servidor:/var/www/villa-mitre-admin
```

---

## 📞 Soporte

### Enlaces Útiles:
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Vite Deploy Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router SPA Deployment](https://reactrouter.com/docs/en/v6/getting-started/tutorial#deploying)

### Comandos de Emergencia:
```bash
# Ver logs de build
npm run build --verbose

# Limpiar cache de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ Deploy Exitoso Cuando:

1. ✅ Build completa sin errores
2. ✅ Preview local funciona perfectamente
3. ✅ Deploy a plataforma exitoso
4. ✅ URL pública accesible
5. ✅ Todas las funcionalidades verificadas
6. ✅ API conectada y funcionando
7. ✅ Sin errores en consola del navegador

---

**¡Buena suerte con el deploy! 🚀**

Si encuentras problemas, revisa primero `DEPLOY_PREPARATION_STATUS.md` para verificar el estado actual.
