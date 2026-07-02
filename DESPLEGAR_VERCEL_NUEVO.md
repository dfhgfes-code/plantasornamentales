# 🚀 CREAR NUEVO PROYECTO EN VERCEL
## (Con la URL correcta del backend)

---

## 📋 PASOS:

### 1. Crear Nuevo Proyecto en Vercel

1. Ve a: https://vercel.com/new
2. Inicia sesión con **TU cuenta actual** (no la otra)
3. Click en **"Import Project"**
4. Selecciona **"Import Git Repository"**
5. Busca el repositorio: `dfhgfes-code/plantasornamentales`
6. Click en **"Import"**

### 2. Configurar el Proyecto

En la página de configuración:

**Framework Preset**: Next.js (debe detectarse automáticamente)

**Root Directory**: `frontend` 👈 MUY IMPORTANTE

**Build Command**: (dejar por defecto)

**Output Directory**: (dejar por defecto)

### 3. Agregar Variables de Entorno

En la sección **"Environment Variables"**, agrega estas 3:

```
NEXT_PUBLIC_API_URL=https://plantasornamentales-production.up.railway.app/api/v1

NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_xxxxxxxxxxxx

NEXT_PUBLIC_GOOGLE_CLIENT_ID=606760776980-m49qk52hum9m39cb21puvnqsih5ubcc7.apps.googleusercontent.com
```

**Environment**: Selecciona las 3 opciones (Production, Preview, Development)

### 4. Deploy

1. Click en **"Deploy"**
2. Espera 2-3 minutos
3. Vercel te mostrará la URL cuando termine

### 5. Probar

Una vez termine el deploy:
1. Abre la nueva URL que te dio Vercel
2. Debería funcionar sin errores de CORS
3. Intenta hacer login con:
   - Email: `madridsystem@outlook.es`
   - Password: `@Joshuamadrid27`

---

## ✅ RESULTADO

Tendrás un nuevo proyecto en Vercel con:
- ✅ URL correcta del backend
- ✅ Variables de entorno correctas
- ✅ Sin problemas de permisos de Git
- ✅ Todo funcionando correctamente

---

## 🗑️ DESPUÉS (Opcional)

Una vez el nuevo proyecto funcione, puedes **eliminar el proyecto viejo** (`plantasornamentales`) que tiene los problemas.

---

## 💡 ALTERNATIVA MÁS RÁPIDA

Si no quieres crear proyecto nuevo, puedes **hacer un pequeño cambio en el código** y push a Git, lo cual forzará que Vercel redeploy automáticamente.

¿Prefieres crear el nuevo proyecto o intentar forzar el redeploy con un cambio de código?
