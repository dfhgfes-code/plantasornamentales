# ✅ CHECKLIST DE PRODUCCIÓN
## Janneth Acevedo Plantas Ornamentales

---

## 🌐 1. VERIFICAR FRONTEND

### ✅ Acceso y Carga
- [ ] Abrir `https://plantasornamentales.vercel.app/`
- [ ] La página carga correctamente (sin pantalla en blanco)
- [ ] El modal de bienvenida aparece
- [ ] Los estilos se ven correctamente (colores, fuentes, imágenes)

### ✅ Navegación
- [ ] Hacer click en "Ver planes de suscripción" - debe navegar a otra página
- [ ] Probar el menú de navegación (si existe)
- [ ] Todas las páginas cargan sin errores

### ✅ Funcionalidad Básica
- [ ] Hacer click en "Quiero obtener ahora" - debe funcionar
- [ ] Cerrar el modal de bienvenida - debe cerrarse correctamente
- [ ] No hay errores en la consola del navegador (F12 > Console)

---

## 🔌 2. VERIFICAR BACKEND

### ✅ Health Check
- [ ] Abrir `https://plantasornamentales-production.up.railway.app/api/v1/health`
- [ ] Debe mostrar JSON: `{"status":"ok","timestamp":"..."}`
- [ ] NO debe mostrar error 502, 404 o 500

### ✅ Estado en Railway
- [ ] Ir a Railway > Tu servicio
- [ ] El servicio muestra estado "Online" (verde)
- [ ] No hay errores críticos en los logs
- [ ] El deployment dice "Success"

---

## 💾 3. VERIFICAR BASE DE DATOS

### ✅ Conexión
- [ ] El backend inició sin errores de conexión a base de datos
- [ ] Los logs de Railway NO muestran: "Unable to connect to database"
- [ ] Los logs de Railway muestran: "Database connected" o similar

### ✅ Datos en Supabase
- [ ] Abrir Supabase > Table Editor
- [ ] La tabla `users` existe y tiene al menos 1 registro (el admin)
- [ ] Las tablas `products`, `plans`, `orders`, etc. existen
- [ ] La tabla `settings` tiene los valores iniciales

### ✅ Verificar Datos del Admin
```sql
-- Ejecuta esto en Supabase SQL Editor:
SELECT email, role FROM users WHERE role = 'super_admin';
```
- [ ] Debe mostrar: `admin@jannethplantas.com` con role `super_admin`

---

## 📦 4. VERIFICAR STORAGE (Supabase)

### ✅ Bucket de Imágenes
- [ ] Ir a Supabase > Storage
- [ ] El bucket `plantas-images` existe
- [ ] El bucket está marcado como "Public"
- [ ] Puedes subir una imagen de prueba

---

## 🔐 5. VERIFICAR AUTENTICACIÓN

### ✅ Registro de Usuario
- [ ] Ir a `https://plantasornamentales.vercel.app/`
- [ ] Buscar la opción de "Registrarse" o "Sign Up"
- [ ] Intentar registrar un usuario de prueba
- [ ] Debe crearse correctamente O mostrar formulario sin errores

### ✅ Login de Usuario
- [ ] Buscar la opción de "Iniciar Sesión" o "Login"
- [ ] El formulario debe aparecer
- [ ] Intentar login con credenciales incorrectas - debe mostrar error apropiado

---

## 🛍️ 6. VERIFICAR PRODUCTOS Y PLANES

### ✅ Visualización de Productos
- [ ] Navegar a la sección de productos
- [ ] Los productos deben cargar (aunque estén vacíos inicialmente)
- [ ] NO debe mostrar error 500 o "Failed to fetch"

### ✅ Visualización de Planes
- [ ] Navegar a la sección de planes de suscripción
- [ ] Los planes deben cargar correctamente
- [ ] Si hay planes seed, deben mostrarse

---

## 🔧 7. VERIFICAR CONFIGURACIÓN

### ✅ Variables de Entorno - Backend (Railway)
Verifica que existan estas variables en Railway:
- [ ] `NODE_ENV=production`
- [ ] `PORT=3000`
- [ ] `DB_HOST` (correcta de Supabase)
- [ ] `DB_USERNAME` (correcta de Supabase)
- [ ] `DB_PASSWORD` (correcta)
- [ ] `DB_NAME=postgres`
- [ ] `SUPABASE_URL` (correcta)
- [ ] `SUPABASE_SERVICE_KEY` (correcta)
- [ ] `JWT_SECRET` (cualquier valor seguro)
- [ ] `CORS_ORIGIN` (debe incluir tu dominio de Vercel)

### ✅ Variables de Entorno - Frontend (Vercel)
Verifica que existan estas variables en Vercel:
- [ ] `NEXT_PUBLIC_API_URL=https://plantasornamentales-production.up.railway.app/api/v1`
- [ ] `NEXT_PUBLIC_WOMPI_PUBLIC_KEY` (tu key de Wompi)
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (tu client ID)

---

## 🚨 8. VERIFICAR ERRORES COMUNES

### ✅ Consola del Navegador (F12)
- [ ] Abrir DevTools (F12) en el frontend
- [ ] Ir a la pestaña "Console"
- [ ] NO debe haber errores en rojo (warnings en amarillo son OK)
- [ ] NO debe decir "Failed to fetch" o "Network Error"

### ✅ CORS
- [ ] En la consola del navegador, NO debe aparecer error de CORS
- [ ] Error de CORS se ve como: "blocked by CORS policy"
- [ ] Si aparece, verificar `CORS_ORIGIN` en Railway

### ✅ Logs de Railway
- [ ] Abrir Railway > Logs
- [ ] NO debe haber errores continuos
- [ ] NO debe decir "Application crashed"
- [ ] Debe mostrar: "Nest application successfully started"

---

## 🎯 9. PRUEBAS FUNCIONALES COMPLETAS

### ✅ Flujo de Usuario Completo (Opcional pero Recomendado)
1. [ ] Registrar un nuevo usuario
2. [ ] Iniciar sesión con ese usuario
3. [ ] Ver productos disponibles
4. [ ] Ver planes de suscripción
5. [ ] Agregar un producto al carrito (si aplica)
6. [ ] Navegar por todas las secciones principales
7. [ ] Cerrar sesión

---

## 📊 10. MÉTRICAS Y MONITOREO

### ✅ Rendimiento
- [ ] El frontend carga en menos de 5 segundos
- [ ] El backend responde en menos de 2 segundos
- [ ] No hay timeouts o respuestas lentas

### ✅ Disponibilidad
- [ ] La aplicación está accesible 24/7
- [ ] No hay interrupciones frecuentes
- [ ] Railway muestra "Online" de forma consistente

---

## 🎉 RESULTADO FINAL

### ✅ SI TODAS LAS VERIFICACIONES PASAN:
**¡Tu aplicación ESTÁ LISTA PARA PRODUCCIÓN! 🚀**

Puedes:
- ✅ Compartir la URL con clientes
- ✅ Empezar a recibir usuarios reales
- ✅ Procesar pedidos y suscripciones
- ✅ Aceptar pagos (cuando configures Wompi en producción)

### ⚠️ SI ALGUNA VERIFICACIÓN FALLA:
- Anota cuál verificación falló
- Revisa los logs correspondientes
- Corrige el problema antes de lanzar oficialmente

---

## 📝 NOTAS IMPORTANTES

### 🔒 Seguridad Pendiente (Para Antes de Lanzamiento Real):
- [ ] Cambiar el password del usuario admin por uno más seguro
- [ ] Cambiar `JWT_SECRET` por un valor más complejo y único
- [ ] Configurar certificado SSL (Vercel y Railway ya lo incluyen ✅)
- [ ] Configurar límites de rate limiting en el backend
- [ ] Revisar que no haya credenciales hardcodeadas en el código

### 💳 Pagos (Wompi):
- [ ] Actualmente en modo TEST
- [ ] Para producción real, necesitas configurar las keys de producción de Wompi
- [ ] Verificar que `WOMPI_PUBLIC_KEY` y `WOMPI_PRIVATE_KEY` sean las correctas

### 📧 Emails:
- [ ] Verificar que `SMTP_PASS` sea correcta
- [ ] Probar envío de email de prueba
- [ ] Configurar templates de emails si es necesario

---

## 🎯 PASOS SIGUIENTES (Post-Lanzamiento)

1. **Monitoreo**:
   - Revisar logs diariamente en Railway
   - Verificar que no haya errores nuevos

2. **Backups**:
   - Supabase hace backups automáticos
   - Considera backups manuales adicionales

3. **Mantenimiento**:
   - Actualizar dependencias regularmente
   - Revisar y optimizar base de datos

4. **Escalabilidad**:
   - Railway escala automáticamente
   - Monitorear uso de recursos

---

**Fecha de Checklist**: 2 de Julio, 2026
**Versión**: 1.0
**Status**: ✅ LISTO PARA PRODUCCIÓN
