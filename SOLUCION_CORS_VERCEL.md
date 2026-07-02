# 🔧 SOLUCIÓN AL PROBLEMA DE CORS Y VERCEL

## 📊 SITUACIÓN ACTUAL:
- ❌ Frontend llama a URL incorrecta: `janneth-acevedo-plantas-production`
- ❌ Backend correcto está en: `plantasornamentales-production`
- ❌ Vercel no te deja hacer redeploy por permisos de Git
- ❌ Error CORS bloquea todas las peticiones

---

## ✅ SOLUCIÓN INMEDIATA (5 minutos):

### PASO 1: Actualizar CORS en Railway

1. Ve a **Railway** > Variables
2. Busca `CORS_ORIGIN`
3. Cámbiala a AMBAS URLs separadas por coma:
   ```
   https://plantasornamentales.vercel.app,https://plantasornamentales-despliegue-dfhgfes-code-projects.vercel.app
   ```
4. Guarda y espera que Railway haga redeploy (1-2 minutos)

### PASO 2: Crear un Nuevo Proyecto en Vercel CON TU CUENTA

Ya que el proyecto actual está vinculado a otra cuenta de Git y te da problemas:

1. **Importa el proyecto de nuevo**:
   - Ve a Vercel Dashboard
   - Click en **"Add New"** > **"Project"**
   - Selecciona el repositorio `dfhgfes-code/plantasornamentales`
   - Configure:
     - **Framework Preset**: Next.js
     - **Root Directory**: `frontend`
     
2. **Configura las variables de entorno CORRECTAS**:
   ```
   NEXT_PUBLIC_API_URL=https://plantasornamentales-production.up.railway.app/api/v1
   NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_xxxxxxxxxxxx
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=606760776980-m49qk52hum9m39cb21puvnqsih5ubcc7.apps.googleusercontent.com
   ```

3. **Deploy**

4. **Elimina el proyecto viejo** (el que te da problemas)

---

## 🎯 ALTERNATIVA MÁS RÁPIDA (2 minutos):

Si no quieres crear proyecto nuevo, simplemente:

### Actualiza el backend para aceptar AMBAS URLs:

1. **Railway** > Variables > `CORS_ORIGIN`
2. Pon todas las posibles URLs de Vercel:
   ```
   https://plantasornamentales.vercel.app,https://plantasornamentales-despliegue-dfhgfes-code-projects.vercel.app,https://*.vercel.app
   ```

Esto permitirá que CUALQUIER URL de Vercel se conecte al backend.

Luego, simplemente espera. Vercel eventualmente hará un deployment automático cuando detecte cambios.

---

## 🚀 OPCIÓN NUCLEAR (Si nada funciona):

Actualiza el código del frontend para usar la URL correcta hardcodeada temporalmente:

1. Ve a `frontend/src/config` o donde esté la configuración de la API
2. Busca donde se define `API_URL`
3. Cambia directamente en el código a: `https://plantasornamentales-production.up.railway.app/api/v1`
4. Haz commit y push
5. Vercel detectará el cambio y hará deploy automático

---

## 📋 MI RECOMENDACIÓN:

**HAZ ESTO AHORA**:

1. **Railway** > Variables > `CORS_ORIGIN`:
   ```
   https://plantasornamentales.vercel.app,https://*.vercel.app
   ```
   
2. Espera 2 minutos para que Railway redeploy

3. Prueba tu aplicación de nuevo

El uso de `https://*.vercel.app` permitirá que CUALQUIER subdominio de Vercel funcione.

---

¿Quieres que actualice el CORS en Railway para permitir todas las URLs de Vercel?
