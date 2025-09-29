# 🚀 Guía de Despliegue en Vercel

## 📋 Checklist Pre-Despliegue

- [ ] ✅ Proyecto funcionando localmente
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Build de producción exitoso (`npm run build`)
- [ ] ✅ Tests pasando (`npm run test`)
- [ ] ✅ Linting sin errores (`npm run lint`)

## 🔧 Opción 1: GitHub + Vercel (Recomendado)

### **Paso 1: Subir a GitHub**

1. **Crear repositorio en GitHub**:
   - Ve a https://github.com/new
   - Nombre: `villa-mitre-admin-panel`
   - Descripción: "Panel de administración para Villa Mitre Gym"
   - Privado: ✅ (recomendado)

2. **Subir código**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Villa Mitre Admin Panel"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/villa-mitre-admin-panel.git
   git push -u origin main
   ```

### **Paso 2: Conectar con Vercel**

1. **Ir a Vercel**:
   - Ve a https://vercel.com
   - Login con tu cuenta (User ID: QKF52uJqtpcZ4Yw5VZ8G22NM)

2. **Importar proyecto**:
   - Click "New Project"
   - Selecciona tu repositorio de GitHub
   - Framework Preset: "Vite" (se detecta automáticamente)

3. **Configurar variables de entorno**:
   ```
   VITE_API_BASE_URL = https://villamitre.loca.lt/api
   VITE_APP_NAME = Villa Mitre Admin
   VITE_APP_VERSION = 1.0.0
   VITE_DEBUG_API = false
   ```

4. **Deploy**:
   - Click "Deploy"
   - Esperar 2-3 minutos
   - ¡Listo! 🎉

## 🔧 Opción 2: Deploy Directo con Vercel CLI

### **Instalación**
```bash
npm install -g vercel
```

### **Login**
```bash
vercel login
```

### **Deploy**
```bash
# Deploy de prueba
vercel

# Deploy a producción
vercel --prod
```

## 🌐 Configuración de Dominio Personalizado

Si tienes un dominio propio:

1. **En Vercel Dashboard**:
   - Ve a tu proyecto
   - Settings → Domains
   - Add domain: `admin.villamitre.com`

2. **Configurar DNS**:
   - Agregar CNAME record apuntando a Vercel

## 🔄 Despliegues Automáticos

Una vez conectado con GitHub:

- ✅ **Push a `main`** → Deploy automático a producción
- ✅ **Pull Request** → Deploy preview automático
- ✅ **Rollback** → Un click para volver a versión anterior

## 📊 Monitoreo Post-Despliegue

### **Verificar que funciona**:
1. ✅ Página carga correctamente
2. ✅ Login funciona
3. ✅ API se conecta correctamente
4. ✅ Todas las rutas funcionan
5. ✅ Responsive en móviles

### **Performance**:
- Lighthouse Score > 90
- First Contentful Paint < 2s
- Time to Interactive < 3s

## 🚨 Troubleshooting

### **Error: Build Failed**
```bash
# Verificar build local
npm run build

# Si falla, revisar errores TypeScript
npm run type-check
```

### **Error: Environment Variables**
- Verificar que todas las variables estén configuradas en Vercel
- Nombres deben empezar con `VITE_`

### **Error: API Connection**
- Verificar que la URL de API sea correcta
- Verificar CORS en el backend
- Verificar que el backend esté online

## 📱 URLs Finales

Después del deploy tendrás:

- **Producción**: `https://villa-mitre-admin-panel.vercel.app`
- **Preview**: `https://villa-mitre-admin-panel-git-branch.vercel.app`
- **Dominio personalizado**: `https://admin.villamitre.com` (opcional)

## 🔐 Configuración de Seguridad

### **Variables de Entorno Sensibles**
- Nunca commitear archivos `.env` con datos reales
- Usar Vercel Environment Variables para producción
- Diferentes valores para development/production

### **CORS Backend**
Asegurar que el backend permita requests desde:
- `https://villa-mitre-admin-panel.vercel.app`
- Tu dominio personalizado (si lo tienes)

## 📞 Soporte

Si necesitas ayuda:
1. Revisar logs en Vercel Dashboard
2. Verificar Network tab en DevTools
3. Contactar soporte técnico

---

**¡Tu panel estará online en menos de 10 minutos! 🚀**
