# 🚨 SOLUCIONAR ERRORES - PASOS EXACTOS

## PROBLEMA ACTUAL:
- El backend en Railway da errores sobre la columna `email` en la tabla `users`
- Hay registros con email NULL en la base de datos
- Frontend conecta a URL incorrecta (janneth-acevedo-plantas en lugar de plantasornamentales)

---

## ✅ PASO 1: ARREGLAR LA BASE DE DATOS EN SUPABASE

1. Ve a **Supabase** → https://supabase.com/dashboard
2. Selecciona el proyecto: `qbnyqiibvcouysoygsq`
3. En el menú izquierdo, click en **SQL Editor**
4. Click en **New Query**
5. Copia y pega TODO el contenido del archivo `ARREGLAR_BD_SUPABASE.sql`
6. Click en **Run** (o presiona Ctrl+Enter)
7. Verifica que aparezca el usuario superadmin al final

**RESULTADO ESPERADO:**
```
✓ DELETE FROM users WHERE email IS NULL
✓ ALTER TABLE users ALTER COLUMN email...
✓ CREATE UNIQUE INDEX...
✓ INSERT INTO users... (superadmin creado)
✓ SELECT muestra el usuario madridsystem@outlook.es
```

---

## ✅ PASO 2: ACTUALIZAR VARIABLE EN RAILWAY

1. Ve a **Railway** → https://railway.app
2. Abre el proyecto: `plantasornamentales-production`
3. Click en el servicio del **backend**
4. Click en la pestaña **Variables**
5. Click en **Raw Editor** (arriba a la derecha)
6. Busca la línea que dice `"CORS_ORIGIN"`
7. Cámbiala a:
   ```json
   "CORS_ORIGIN": "https://plantasornamentales.vercel.app,https://*.vercel.app",
   ```
8. Click en **Save** o **Deploy**

---

## ✅ PASO 3: VERIFICAR QUE EL BACKEND INICIE SIN ERRORES

1. En Railway, ve a la pestaña **Deployments**
2. Espera a que termine el deploy (puede tardar 1-2 minutos)
3. Click en **View Logs**
4. Verifica que NO aparezcan errores de "email column"
5. Busca el mensaje: `🚀 Application is running on port 3000`

**SI SIGUE DANDO ERRORES:**
- Manda screenshot de los logs completos
- NO CONTINÚES al Paso 4 hasta que esto funcione

---

## ✅ PASO 4: CREAR NUEVO PROYECTO EN VERCEL (CON TU CUENTA)

**IMPORTANTE:** Como el proyecto actual de Vercel está conectado a otra cuenta de GitHub, necesitas crear uno nuevo.

### 4.1 - Eliminar proyecto viejo (Opcional)
Si tienes acceso:
1. Ve a Vercel → https://vercel.com/dashboard
2. Busca el proyecto `plantasornamentales`
3. Settings → Delete Project

### 4.2 - Crear proyecto nuevo
1. Ve a https://vercel.com/new
2. Selecciona tu repositorio de GitHub: `dfhgfes-code/plantasornamentales`
3. Click en **Import**

### 4.3 - Configurar el proyecto
En la pantalla de configuración:

**Framework Preset:** Next.js

**Root Directory:** Click en "Edit" → Selecciona `frontend`

**Environment Variables:** Click en "Add" y agrega estas 3 variables:

```
NEXT_PUBLIC_API_URL=https://plantasornamentales-production.up.railway.app/api/v1

NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_xxxxxxxxxxxx

NEXT_PUBLIC_GOOGLE_CLIENT_ID=606760776980-m49qk52hum9m39cb21puvnqsih5ubcc7.apps.googleusercontent.com
```

### 4.4 - Deploy
1. Click en **Deploy**
2. Espera 2-3 minutos
3. Cuando termine, te dará una URL como: `https://plantasornamentales-xxxx.vercel.app`

---

## ✅ PASO 5: PROBAR EL LOGIN

1. Abre la nueva URL de Vercel en tu navegador
2. Ve a **Iniciar Sesión**
3. Usa estas credenciales:
   - **Email:** `madridsystem@outlook.es`
   - **Contraseña:** `@Joshuamadrid27`
4. Si todo está bien, deberías entrar al panel de administración

---

## 📋 RESUMEN DE URLS:

- **Frontend nuevo:** `https://plantasornamentales-xxxx.vercel.app` (la que te de Vercel)
- **Backend:** `https://plantasornamentales-production.up.railway.app/api/v1`
- **Health check:** `https://plantasornamentales-production.up.railway.app/api/v1/health`

---

## 🆘 SI ALGO FALLA:

### Error en Paso 1 (Supabase):
- Manda screenshot del error en SQL Editor
- Puede que necesites borrar la tabla `users` completamente y recrearla

### Error en Paso 2 (Railway):
- Verifica que copiaste EXACTAMENTE la variable CORS_ORIGIN
- Asegúrate de hacer click en "Deploy" después de guardar

### Error en Paso 3 (Backend no inicia):
- Manda screenshot de los logs de Railway
- Verifica que todas las 24 variables estén configuradas

### Error en Paso 4 (Vercel):
- Si no puedes seleccionar el repositorio, verifica que estás logueado con la cuenta correcta
- Si no puedes seleccionar `frontend` como Root Directory, configúralo después en Settings

### Error en Paso 5 (Login no funciona):
- Abre la consola del navegador (F12)
- Manda screenshot de los errores en la pestaña Console
- Verifica que la URL del backend sea correcta en las variables de Vercel

---

## 🎯 DESPUÉS DE QUE TODO FUNCIONE:

1. Configurar dominio personalizado (opcional)
2. Agregar productos reales
3. Agregar planes de suscripción reales
4. Configurar Wompi con claves de producción
5. Cambiar contraseña del superadmin
6. Cambiar JWT_SECRET

---

**Empieza con el PASO 1 y avísame cuando termines cada paso.**
