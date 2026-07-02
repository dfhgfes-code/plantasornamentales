# Tasks: Arreglos para Producción - Plataforma de Suscripción de Flores

## TASK-1: Ejecutar Migración SQL en Supabase ⚠️ CRÍTICO
**Status:** todo  
**Depends On:** -  
**Assigned To:** David (usuario)  
**Estimated Time:** 5 minutos

### Descripción
Ejecutar el script `ARREGLAR_TODO.sql` en Supabase SQL Editor para agregar todas las columnas faltantes que causan errores 500.

### Pasos de Implementación

1. **Abrir Supabase SQL Editor**
   - Ir a: https://supabase.com/dashboard/project/qbnyqiibvcouysoygsq
   - Login si es necesario
   - Click en "SQL Editor" en sidebar izquierdo

2. **Abrir archivo local**
   - Abrir `ARREGLAR_TODO.sql` en VS Code o editor de texto
   - Copiar TODO el contenido del archivo (Ctrl+A, Ctrl+C)

3. **Ejecutar en Supabase**
   - Pegar en SQL Editor de Supabase (Ctrl+V)
   - Click en botón "Run" (o F5)
   - Esperar confirmación de ejecución exitosa

4. **Verificar resultados**
   - Scroll hasta el final del output
   - Debe mostrar 3 tablas con listado de columnas:
     * Columnas de `products` (debe incluir `images`, `additionals`, `is_available`, etc.)
     * Columnas de `plans` (debe incluir `interval_days`, `delivery_count`)
     * Columnas de `orders` (debe incluir `order_number`, `delivery_address`, etc.)

5. **Probar en frontend**
   - Ir a: https://plantasornamentales-3cum.vercel.app
   - Login como superadmin: `madridsystem@outlook.es` / `@Joshuamadrid27`
   - Dashboard debe cargar SIN error 500
   - Navegar a Productos, Planes, Órdenes → No deben haber errores

### Criterios de Aceptación
- [x] Script SQL ejecutado sin errores en Supabase
- [ ] Todas las columnas verificadas en output
- [ ] Dashboard admin carga correctamente
- [ ] No hay errores 500 en consola del navegador
- [ ] Railway logs no muestran "column does not exist"

### Archivos Involucrados
- `ARREGLAR_TODO.sql` (INPUT)
- Supabase database (OUTPUT)

### Notas
- **IMPORTANTE:** Este script usa `IF NOT EXISTS`, por lo que es seguro ejecutarlo múltiples veces
- Si ya ejecutaste `AGREGAR_DELETED_AT.sql` o `AGREGAR_COLUMNAS_FALTANTES.sql`, este script NO duplicará columnas
- El script incluye queries de verificación al final para confirmar que todo se agregó correctamente

---

## TASK-2: Configurar Google OAuth en Google Cloud Console ⚠️ ALTA
**Status:** todo  
**Depends On:** TASK-1  
**Assigned To:** David (usuario)  
**Estimated Time:** 10 minutos

### Descripción
Agregar el dominio de Vercel a los orígenes autorizados de Google OAuth para permitir registro de clientes con Google.

### Pasos de Implementación

1. **Acceder a Google Cloud Console**
   - Ir a: https://console.cloud.google.com/apis/credentials
   - Login con cuenta que tiene el proyecto configurado
   - Seleccionar el proyecto correcto (si hay varios)

2. **Localizar OAuth Client ID**
   - Buscar en la lista de credenciales:
     * Client ID: `606760776980-m49qk52hum9m39cb21puvnqsih5ubcc7.apps.googleusercontent.com`
   - Click en el nombre o ícono de editar (lápiz)

3. **Agregar Orígenes JavaScript Autorizados**
   - Scroll a sección "Authorized JavaScript origins"
   - Click en "ADD URI"
   - Agregar: `https://plantasornamentales-3cum.vercel.app`
   - **NO** incluir trailing slash
   - **NO** incluir paths (solo el dominio base)

4. **Agregar URIs de Redirección Autorizadas**
   - Scroll a sección "Authorized redirect URIs"
   - Click en "ADD URI"
   - Agregar: `https://plantasornamentales-3cum.vercel.app/api/auth/callback/google`
   - Verificar que el path `/api/auth/callback/google` sea exacto

5. **Guardar y Esperar Propagación**
   - Click en botón "SAVE" al final
   - Esperar 1-2 minutos para que Google propague los cambios
   - No cerrar la ventana todavía

6. **Probar Registro con Google**
   - Abrir ventana de incógnito en navegador
   - Ir a: https://plantasornamentales-3cum.vercel.app
   - Click en "Registrarse"
   - Click en botón "Continuar con Google"
   - Debe abrir popup de Google sin error "Acceso bloqueado"
   - Autorizar permisos
   - Debe redirigir al dashboard del cliente

7. **Verificar Usuario en Base de Datos**
   - Ir a Supabase: https://supabase.com/dashboard/project/qbnyqiibvcouysoygsq
   - Click en "Table Editor" → tabla `users`
   - Buscar el usuario recién creado
   - Verificar:
     * `auth_provider` = 'google'
     * `google_id` tiene un valor
     * `role` = 'customer'
     * `email` corresponde al email de Google

### Criterios de Aceptación
- [ ] Dominio Vercel agregado a JavaScript origins
- [ ] URI de callback agregado a redirect URIs
- [ ] Usuario puede completar flujo de registro con Google
- [ ] Usuario aparece en tabla `users` con `auth_provider='google'`
- [ ] Login subsecuente con Google funciona
- [ ] No hay error "Acceso bloqueado" de Google

### Archivos Involucrados
- Ninguno (configuración externa en Google Cloud)

### Comandos de Prueba
```bash
# Verificar en Railway logs que el login con Google se registra:
# Buscar líneas como:
# [AuthService] Google login successful for: usuario@gmail.com
```

### Notas
- Si no tienes acceso a Google Cloud Console con esas credenciales, puede que necesites usar otro Client ID
- El Client ID actual ya está configurado en el frontend (`NEXT_PUBLIC_GOOGLE_CLIENT_ID`)
- Si creas un nuevo Client ID, deberás actualizar la variable en Vercel

### Troubleshooting
**Error: "Acceso bloqueado: Esta app no está verificada"**
- Solución: Click en "Avanzado" → "Ir a [nombre de app] (no seguro)"
- Esto es normal para apps en desarrollo

**Error: "redirect_uri_mismatch"**
- Verificar que el URI en Google Cloud coincida EXACTAMENTE con el del frontend
- Verificar que no haya espacios antes/después

---

## TASK-3: Probar Flujo Completo de Suscripción con Wompi TEST ⚠️ MEDIA
**Status:** todo  
**Depends On:** TASK-1, TASK-2  
**Assigned To:** Kiro (agent) + David (pruebas)  
**Estimated Time:** 20 minutos

### Descripción
Validar que el flujo end-to-end de suscripción funciona correctamente con las claves TEST de Wompi.

### Pasos de Implementación

1. **Verificar Variables de Wompi en Railway**
   ```bash
   # Ir a: https://railway.app/project/<project-id>/service/<service-id>/variables
   # Verificar que existen:
   WOMPI_PUBLIC_KEY=pub_test_xxxxxxxxxxxx
   WOMPI_PRIVATE_KEY=prv_test_xxxxxxxxxxxx
   WOMPI_EVENTS_SECRET=<valor>
   ```

2. **Preparar Datos de Prueba Wompi**
   - Tarjeta de prueba APROBADA:
     * Número: `4242 4242 4242 4242` (Visa)
     * CVV: `123`
     * Fecha: Cualquier fecha futura (ej: 12/25)
     * Nombre: Cualquier nombre
   
   - Tarjeta de prueba RECHAZADA (para probar manejo de errores):
     * Número: `4111 1111 1111 1111`

3. **Registrar Usuario de Prueba**
   - Ir a: https://plantasornamentales-3cum.vercel.app
   - Registrar con email: `test-sub@example.com` / password: `Test1234`
   - O usar registro con Google

4. **Seleccionar Plan**
   - Ir a sección "Planes" o "Suscripciones"
   - Elegir plan (ej: Plan Semanal)
   - Click en "Suscribirme" o botón similar

5. **Ingresar Datos de Pago**
   - Ingresar tarjeta de prueba: `4242 4242 4242 4242`
   - CVV: `123`, Fecha: `12/25`
   - Click en "Pagar" o "Confirmar"

6. **Verificar Flujo de Pago**
   - Frontend debe mostrar loading
   - Wompi debe procesar el pago
   - Frontend debe recibir confirmación
   - Debe redirigir a página de éxito o dashboard

7. **Verificar en Base de Datos**
   - Ir a Supabase Table Editor
   - Tabla `subscriptions`:
     * Debe existir registro con `status='active'`
     * Debe tener `payment_token` (token de Wompi)
     * Debe tener `next_payment_date` calculado
   - Tabla `orders`:
     * Debe existir orden generada automáticamente
     * `is_automatic = true`
     * `user_id` corresponde al usuario de prueba
     * `status = 'pending'` o `'processing'`

8. **Verificar Railway Logs**
   ```bash
   # Buscar en Railway logs:
   # [PaymentsService] Payment successful: transaction_id
   # [SubscriptionsService] Subscription activated: sub_id
   # [OrdersService] Automatic order created: order_number
   ```

### Criterios de Aceptación
- [ ] Usuario puede seleccionar plan de suscripción
- [ ] Formulario de pago Wompi se carga correctamente
- [ ] Tarjeta de prueba se tokeniza exitosamente
- [ ] Pago inicial se procesa sin errores
- [ ] Suscripción se crea con `status='active'`
- [ ] Orden automática se genera correctamente
- [ ] `next_payment_date` se calcula según frecuencia del plan
- [ ] Frontend muestra confirmación de suscripción activa

### Archivos Involucrados
- `backend/src/modules/payments/payments.service.ts`
- `backend/src/modules/subscriptions/subscriptions.service.ts`
- `backend/src/modules/orders/orders.service.ts`
- `frontend/src/app/(protected)/subscriptions/page.tsx` (o similar)

### Comandos de Prueba
```sql
-- Verificar suscripción creada
SELECT * FROM subscriptions 
WHERE user_id = (SELECT id FROM users WHERE email = 'test-sub@example.com')
ORDER BY created_at DESC LIMIT 1;

-- Verificar orden automática
SELECT * FROM orders 
WHERE is_automatic = true 
  AND user_id = (SELECT id FROM users WHERE email = 'test-sub@example.com')
ORDER BY created_at DESC LIMIT 1;

-- Verificar payment_token guardado
SELECT payment_token, status, next_payment_date 
FROM subscriptions 
WHERE user_id = (SELECT id FROM users WHERE email = 'test-sub@example.com');
```

### Notas
- Este flujo usa claves TEST, por lo que NO se generan cargos reales
- El `payment_token` es simulado por Wompi TEST pero permite probar la lógica
- Los pagos recurrentes automáticos requieren un cron job (puede estar en backend o ser configurado aparte)

### Troubleshooting
**Error: "Payment method not accepted"**
- Verificar que `WOMPI_PUBLIC_KEY` en Vercel coincida con el del backend

**Error: "Webhook signature invalid"**
- Verificar `WOMPI_EVENTS_SECRET` en Railway

**Suscripción se crea pero no se activa**
- Revisar Railway logs para ver error de Wompi
- Verificar que webhook de Wompi esté configurado: `https://plantasornamentales-production.up.railway.app/api/v1/payments/webhook`

---

## TASK-4: Documentar Migración a Wompi Producción (Futuro) ℹ️ BAJA
**Status:** todo  
**Depends On:** TASK-3  
**Assigned To:** Kiro (agent)  
**Estimated Time:** 15 minutos

### Descripción
Crear guía paso a paso para cuando el usuario esté listo para migrar de claves TEST a claves de producción de Wompi.

### Pasos de Implementación

1. **Crear archivo de documentación**
   ```bash
   # Crear: GUIA_WOMPI_PRODUCCION.md
   ```

2. **Incluir en la guía:**
   - Requisitos para cuenta comercial Wompi
   - Documentos necesarios (RUT, cédula, etc.)
   - Cómo habilitar "Tokenization" en panel de Wompi
   - Cómo obtener claves de producción
   - Cómo actualizar variables en Railway y Vercel
   - Cómo probar con monto pequeño antes de lanzar
   - Checklist de seguridad (HTTPS, webhooks, etc.)
   - Qué hacer si un cargo falla
   - Cómo manejar cancelaciones de suscripción

3. **Incluir tarjetas de prueba reales**
   - Tarjetas colombianas para pruebas en producción
   - Límites de montos de prueba

### Criterios de Aceptación
- [ ] Guía creada en formato Markdown
- [ ] Incluye todos los pasos de registro en Wompi
- [ ] Incluye checklist de seguridad
- [ ] Incluye troubleshooting común
- [ ] Referencias a documentación oficial de Wompi

### Archivos Involucrados
- `GUIA_WOMPI_PRODUCCION.md` (OUTPUT - nuevo archivo)

### Notas
- Esta tarea NO requiere cambios en código
- Solo es documentación para el futuro
- Prioridad BAJA porque el negocio puede validarse con TEST primero

---

## TASK-5: Crear Tests E2E para Flujos Críticos (Opcional) ℹ️ BAJA
**Status:** todo  
**Depends On:** TASK-1, TASK-2, TASK-3  
**Assigned To:** Kiro (agent)  
**Estimated Time:** 60 minutos

### Descripción
Crear tests automatizados para los flujos críticos y prevenir regresiones en el futuro.

### Pasos de Implementación

1. **Setup de Playwright o Cypress**
   ```bash
   cd frontend
   npm install -D @playwright/test
   # o
   npm install -D cypress
   ```

2. **Crear test: Login de Superadmin**
   ```typescript
   // tests/e2e/admin-login.spec.ts
   test('superadmin can login and access dashboard', async ({ page }) => {
     await page.goto('https://plantasornamentales-3cum.vercel.app');
     await page.fill('[name="email"]', 'madridsystem@outlook.es');
     await page.fill('[name="password"]', '@Joshuamadrid27');
     await page.click('button[type="submit"]');
     await expect(page).toHaveURL(/.*admin\/dashboard/);
     await expect(page.locator('h1')).toContainText('Dashboard');
   });
   ```

3. **Crear test: Registro con Google**
   ```typescript
   // tests/e2e/google-oauth.spec.ts
   test('customer can register with Google', async ({ page }) => {
     // Mock Google OAuth response
     // Verificar que usuario se crea con auth_provider='google'
   });
   ```

4. **Crear test: Flujo de Suscripción**
   ```typescript
   // tests/e2e/subscription-flow.spec.ts
   test('customer can create subscription with Wompi TEST', async ({ page }) => {
     // Registrar usuario
     // Seleccionar plan
     // Ingresar tarjeta de prueba
     // Verificar suscripción activa
   });
   ```

5. **Configurar CI/CD**
   ```yaml
   # .github/workflows/e2e-tests.yml
   name: E2E Tests
   on: [push, pull_request]
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - run: npm ci
         - run: npx playwright install
         - run: npm run test:e2e
   ```

### Criterios de Aceptación
- [ ] Tests E2E configurados
- [ ] Test de login admin pasa
- [ ] Test de registro Google pasa (con mock)
- [ ] Test de suscripción pasa
- [ ] CI/CD ejecuta tests automáticamente

### Archivos Involucrados
- `frontend/tests/e2e/` (nueva carpeta)
- `.github/workflows/e2e-tests.yml` (nuevo archivo)
- `frontend/playwright.config.ts` (nuevo archivo)

### Notas
- Prioridad BAJA porque la app ya funciona
- Útil para prevenir regresiones en el futuro
- Puede usar Playwright, Cypress, o cualquier framework E2E

---

## Resumen de Prioridades

### 🔴 CRÍTICO (Hacer Ahora)
- **TASK-1:** Ejecutar migración SQL (5 min) - **BLOQUEANTE**

### 🟡 ALTA (Hacer Hoy)
- **TASK-2:** Configurar Google OAuth (10 min)
- **TASK-3:** Probar flujo de suscripción (20 min)

### 🟢 BAJA (Hacer Cuando Haya Tiempo)
- **TASK-4:** Documentar migración Wompi producción (15 min)
- **TASK-5:** Tests E2E (60 min)

## Orden de Ejecución Recomendado

```
1. TASK-1 (SQL) ← Usuario ejecuta manualmente en Supabase
2. Probar login admin para verificar TASK-1
3. TASK-2 (Google OAuth) ← Usuario configura en Google Cloud
4. Probar registro con Google para verificar TASK-2
5. TASK-3 (Wompi TEST) ← Agent + Usuario prueban juntos
6. TASK-4 (Documentación) ← Agent crea archivo
7. TASK-5 (Tests) ← Opcional para el futuro
```

## Tiempo Total Estimado
- **Tareas Críticas:** ~35 minutos
- **Tareas Opcionales:** ~75 minutos
- **TOTAL:** ~110 minutos (1h 50min)

## Notas Finales
- TASK-1 es BLOQUEANTE: nada funciona sin ella
- TASK-2 y TASK-3 pueden hacerse en paralelo si hay dos personas
- TASK-4 y TASK-5 son "nice to have" pero no urgentes
