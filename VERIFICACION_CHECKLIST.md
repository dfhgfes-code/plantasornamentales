# ✅ CHECKLIST DE VERIFICACIÓN

Marca cada item cuando lo completes:

---

## 📍 PASO 1: BASE DE DATOS SUPABASE

### Antes de ejecutar el script:
- [ ] Entré a https://supabase.com/dashboard
- [ ] Seleccioné el proyecto: `qbnyqiibvcouysoygsq`
- [ ] Abrí SQL Editor
- [ ] Copié el contenido de `ARREGLAR_BD_SUPABASE.sql`
- [ ] Pegué en el editor

### Después de ejecutar:
- [ ] Dice "Success" o mensaje verde
- [ ] No aparecen errores rojos
- [ ] Al final veo el usuario `madridsystem@outlook.es`
- [ ] El usuario tiene `role: super_admin`

**Si ves errores, DETENTE y manda screenshot.**

---

## 📍 PASO 2: VARIABLE CORS EN RAILWAY

### Antes:
- [ ] Entré a https://railway.app
- [ ] Abrí el proyecto `plantasornamentales-production`
- [ ] Click en el servicio backend
- [ ] Abrí pestaña "Variables"
- [ ] Click en "Raw Editor"

### Cambios:
- [ ] Busqué la línea con `"CORS_ORIGIN"`
- [ ] La cambié a: `"CORS_ORIGIN": "https://plantasornamentales.vercel.app,https://*.vercel.app",`
- [ ] Click en "Save" o "Deploy"

### Después:
- [ ] Railway dice "Deploying..."
- [ ] Espero 1-2 minutos
- [ ] Dice "Active" con circulo verde

---

## 📍 PASO 3: VERIFICAR LOGS DEL BACKEND

### En Railway > Deployments > View Logs:
- [ ] NO veo errores de "email column"
- [ ] NO veo "error: error: column 'email' of relation 'users'"
- [ ] VEO: "🚀 Application is running on port 3000" o similar
- [ ] VEO: "Nest application successfully started"

**Si siguen apareciendo errores de "email", DETENTE y manda screenshot.**

---

## 📍 PASO 4: NUEVO PROYECTO EN VERCEL

### Crear proyecto:
- [ ] Entré a https://vercel.com/new
- [ ] Veo mi repositorio: `dfhgfes-code/plantasornamentales`
- [ ] Click en "Import"

### Configurar:
- [ ] Framework Preset: `Next.js` ✓
- [ ] Root Directory: Click "Edit" → Seleccioné `frontend` ✓
- [ ] Agregué las 3 variables del archivo `VARIABLES_VERCEL.txt`:
  - [ ] `NEXT_PUBLIC_API_URL`
  - [ ] `NEXT_PUBLIC_WOMPI_PUBLIC_KEY`
  - [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

### Desplegar:
- [ ] Click en "Deploy"
- [ ] Espero 2-3 minutos
- [ ] Dice "Your project has been successfully deployed"
- [ ] Tengo una URL nueva: `https://plantasornamentales-xxxxx.vercel.app`

---

## 📍 PASO 5: PROBAR LOGIN

### En el navegador:
- [ ] Abrí la nueva URL de Vercel
- [ ] La página carga correctamente (sin errores)
- [ ] Click en "Iniciar Sesión" o "Login"
- [ ] Puse email: `madridsystem@outlook.es`
- [ ] Puse password: `@Joshuamadrid27`
- [ ] Click en "Ingresar" o "Login"

### Resultado esperado:
- [ ] Entraste al panel de administración
- [ ] Ves opciones como "Productos", "Pedidos", "Suscripciones", etc.
- [ ] Arriba dice tu nombre o "Super Admin"

### Si NO funciona:
- [ ] Abrí la consola del navegador (F12)
- [ ] Pestaña "Console"
- [ ] Busco errores en rojo
- [ ] Tomo screenshot y lo mando

---

## 🎉 CUANDO TODO ESTÉ ✓

Si todos los checks están marcados, **la aplicación está funcionando correctamente**.

### URLs finales:
- Frontend: `https://plantasornamentales-xxxxx.vercel.app` (la nueva)
- Backend: `https://plantasornamentales-production.up.railway.app/api/v1`

### Acceso superadmin:
- Email: `madridsystem@outlook.es`
- Password: `@Joshuamadrid27`

---

## 🔥 LO QUE FALTA (PARA DESPUÉS):

- [ ] Agregar productos reales (actualmente hay productos de ejemplo)
- [ ] Agregar planes de suscripción reales
- [ ] Configurar claves de producción de Wompi
- [ ] Configurar dominio personalizado (opcional)
- [ ] Cambiar contraseña del superadmin
- [ ] Cambiar JWT_SECRET por uno más seguro

---

**¿Todo listo? Manda "LISTO" cuando hayas completado todos los checkboxes.**
