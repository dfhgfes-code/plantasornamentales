# Spec: Arreglos para Producción - Plataforma de Suscripción de Flores

**Status:** In Progress  
**Created:** 2026-07-02  
**Owner:** David (madridsystem@outlook.es)

## Resumen Ejecutivo

Completar la configuración y corrección de errores de la plataforma "Janneth Acevedo Plantas Ornamentales" en producción, con enfoque en:
1. Sincronización del esquema de base de datos Supabase
2. Configuración de autenticación con Google OAuth
3. Configuración de pagos recurrentes con Wompi (producción)

## Contexto del Negocio

**Modelo de Negocio:** Servicio de suscripción de flores ornamentales con pagos recurrentes automáticos y entregas programadas.

**Flujo del Cliente:**
1. Cliente se registra (email/password o Google)
2. Selecciona plan de suscripción (semanal/quincenal/mensual)
3. Ingresa datos de pago UNA VEZ
4. Sistema genera cargos automáticos según frecuencia
5. Sistema genera órdenes automáticas y programa entregas

## Ambiente Actual

**Backend:** Railway  
- URL: `https://plantasornamentales-production.up.railway.app/api/v1`
- Estado: ✅ Desplegado
- Base de datos: ✅ Conectado a Supabase

**Frontend:** Vercel  
- URL: `https://plantasornamentales-3cum.vercel.app`
- Estado: ✅ Desplegado
- CORS: ✅ Configurado correctamente

**Base de Datos:** Supabase PostgreSQL  
- Host: `aws-0-us-east-1.pooler.supabase.com`
- Estado: ⚠️ Esquema desincronizado con entidades TypeORM

**Credenciales Superadmin:**
- Email: `madridsystem@outlook.es`
- Password: `@Joshuamadrid27`
- Role: `super_admin`

## Problemas Actuales

### 🔴 CRÍTICO: Errores 500 por Columnas Faltantes

**Síntoma:** Dashboard y endpoints fallan con error 500

**Causa Raíz:** El esquema de Supabase no coincide con las entidades TypeORM del backend. Backend espera columnas que no existen en la base de datos.

**Columnas Faltantes Identificadas:**

**Tabla `users`:**
- ✅ `deleted_at` - TIMESTAMP (ya agregada)
- ✅ `auth_provider` - VARCHAR (ya agregada)
- ✅ `address` - TEXT (ya agregada)
- ✅ `city` - VARCHAR (ya agregada)

**Tabla `products`:**
- ⚠️ `images` - TEXT[]
- ⚠️ `additionals` - TEXT[]
- ⚠️ `is_available` - BOOLEAN
- ⚠️ `sku` - VARCHAR(100)
- ⚠️ `reviews_count` - INTEGER

**Tabla `plans`:**
- ⚠️ `interval_days` - INTEGER
- ⚠️ `delivery_count` - INTEGER

**Tabla `orders`:**
- ⚠️ `order_number` - VARCHAR(50)
- ⚠️ `delivery_fee` - DECIMAL
- ⚠️ `delivery_address` - TEXT
- ⚠️ `delivery_city` - VARCHAR(100)
- ⚠️ `sender_name` - VARCHAR(255)
- ⚠️ `sender_phone` - VARCHAR(20)
- ⚠️ `receiver_name` - VARCHAR(255)
- ⚠️ `receiver_phone` - VARCHAR(20)
- ⚠️ `scheduled_date` - TIMESTAMP
- ⚠️ `delivered_at` - TIMESTAMP
- ⚠️ `is_automatic` - BOOLEAN
- ⚠️ `subtotal` - DECIMAL
- ⚠️ `user_id` - UUID (FK a users)

**Script de Solución:** `ARREGLAR_TODO.sql` (PENDIENTE DE EJECUTAR)

### 🟡 ALTA: Google OAuth No Configurado

**Síntoma:** Error "Acceso bloqueado: error de autorización" al intentar registro con Google

**Causa:** Google Cloud Console no tiene configurado el dominio de Vercel

**Solución Requerida:**
1. Acceder a Google Cloud Console: https://console.cloud.google.com/apis/credentials
2. Localizar OAuth Client ID: `606760776980-m49qk52hum9m39cb21puvnqsih5ubcc7.apps.googleusercontent.com`
3. Agregar en "Authorized JavaScript origins":
   - `https://plantasornamentales-3cum.vercel.app`
4. Agregar en "Authorized redirect URIs":
   - `https://plantasornamentales-3cum.vercel.app/api/auth/callback/google`
5. Esperar 1-2 minutos para propagación
6. Probar registro con Google desde frontend

### 🟢 BAJA: Wompi Producción (Futuro)

**Estado Actual:** Usando claves de TEST  
**Claves Test:**
- `WOMPI_PUBLIC_KEY=pub_test_xxxxxxxxxxxx`
- `WOMPI_PRIVATE_KEY=prv_test_xxxxxxxxxxxx`

**Para Producción (cuando esté listo para cobros reales):**
1. Registrar cuenta comercial: https://comercios.wompi.co/register
2. Completar verificación de identidad
3. Habilitar "Tokenization" para pagos recurrentes
4. Obtener claves de producción
5. Actualizar variables en Railway
6. Probar flujo completo end-to-end

## Requerimientos Funcionales

### RF-1: Base de Datos Sincronizada
- **Prioridad:** CRÍTICA
- **Descripción:** Todas las columnas requeridas por las entidades TypeORM deben existir en Supabase
- **Criterios de Aceptación:**
  - Script `ARREGLAR_TODO.sql` ejecutado exitosamente
  - No hay errores 500 relacionados con columnas faltantes
  - Dashboard de admin carga correctamente
  - Login y operaciones CRUD funcionan sin errores de base de datos

### RF-2: Registro con Google Funcional
- **Prioridad:** ALTA
- **Descripción:** Los clientes pueden registrarse usando su cuenta de Google
- **Criterios de Aceptación:**
  - Botón "Continuar con Google" funciona sin errores
  - Usuario se registra correctamente con role `customer`
  - Datos de perfil (nombre, email) se importan desde Google
  - Usuario puede hacer login subsecuente con Google

### RF-3: Flujo de Suscripción Completo (con claves TEST)
- **Prioridad:** ALTA
- **Descripción:** Cliente puede crear suscripción y realizar pago de prueba
- **Criterios de Aceptación:**
  - Cliente selecciona plan
  - Ingresa datos de tarjeta de prueba Wompi
  - Pago se procesa correctamente
  - Suscripción se activa
  - Orden inicial se genera automáticamente

### RF-4: Panel de Administración Funcional
- **Prioridad:** ALTA
- **Descripción:** Superadmin puede gestionar productos, planes, órdenes y usuarios
- **Criterios de Aceptación:**
  - Login como superadmin exitoso
  - Dashboard muestra estadísticas sin error 500
  - CRUD de productos funciona
  - CRUD de planes funciona
  - Visualización de órdenes funciona
  - Gestión de usuarios funciona

## Requerimientos No Funcionales

### RNF-1: Seguridad
- Credenciales no expuestas en logs
- CORS configurado para dominios específicos
- JWT tokens con expiración adecuada
- Passwords hasheados con bcrypt

### RNF-2: Disponibilidad
- Backend: 99% uptime en Railway
- Frontend: 99.9% uptime en Vercel
- Base de datos: 99.95% uptime en Supabase

### RNF-3: Performance
- Tiempo de respuesta API < 500ms para operaciones CRUD
- Dashboard carga en < 2 segundos
- Catálogo de productos carga en < 1 segundo

## Dependencias y Restricciones

### Dependencias Externas
- **Supabase:** Base de datos PostgreSQL (sin acceso a consola, solo SQL Editor)
- **Railway:** Hosting backend (configuración vía variables de entorno)
- **Vercel:** Hosting frontend (configuración vía dashboard)
- **Google Cloud:** OAuth credentials
- **Wompi:** Gateway de pagos Colombia

### Restricciones Técnicas
- No hay PostgreSQL local instalado
- Usuario tiene dos cuentas de GitHub (puede causar problemas de permisos)
- TypeORM `synchronize: false` en producción (cambios de esquema vía migraciones SQL manuales)

### Restricciones de Negocio
- Debe funcionar PRIMERO con claves TEST de Wompi
- Migración a producción de Wompi solo cuando negocio esté validado
- Precio de planes debe ser configurable por admin

## Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Script SQL falla por dependencias de FK | Media | Alto | Revisar orden de ALTER TABLE, usar IF NOT EXISTS |
| Google OAuth rechaza dominio Vercel | Baja | Medio | Verificar configuración en Google Cloud Console |
| Wompi TEST tiene límites de uso | Baja | Bajo | Documentar claves de producción como siguiente paso |
| Nuevas migraciones causan desincronización | Alta | Alto | Crear proceso de revisión de entidades vs esquema |

## Entregables

1. ✅ Script SQL completo (`ARREGLAR_TODO.sql`)
2. ⚠️ Verificación de ejecución exitosa en Supabase
3. ⚠️ Guía de configuración Google OAuth
4. ⚠️ Prueba end-to-end de registro con Google
5. ⚠️ Prueba end-to-end de dashboard admin
6. ⚠️ Prueba de creación de suscripción con Wompi TEST
7. ⏳ Documentación para migración a Wompi producción (futuro)

## Referencias

- Backend Entities: `backend/src/modules/*/entities/*.entity.ts`
- Script de Fix: `ARREGLAR_TODO.sql`
- Variables de Railway: `VARIABLES_COMPLETAS_RAILWAY.txt`
- Esquema Original: `supabase-schema.sql`

## Notas Adicionales

- Usuario prefiere comunicación en español
- Aplicación ya tiene toda la lógica implementada, solo requiere configuración
- Password `@Joshuamadrid27` contiene carácter especial que requiere URL encoding (`%40Joshuamadrid27`)
