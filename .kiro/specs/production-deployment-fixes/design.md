# Design: Arreglos para Producción - Plataforma de Suscripción de Flores

## Arquitectura Actual

```
┌─────────────────┐
│   Frontend      │
│   (Vercel)      │  https://plantasornamentales-3cum.vercel.app
│   Next.js       │
└────────┬────────┘
         │ HTTPS/REST
         │ CORS configurado
         ▼
┌─────────────────┐
│   Backend       │
│   (Railway)     │  https://plantasornamentales-production.up.railway.app
│   NestJS        │
└────────┬────────┘
         │ TypeORM
         │ PostgreSQL Driver
         ▼
┌─────────────────┐
│   Database      │
│   (Supabase)    │  aws-0-us-east-1.pooler.supabase.com
│   PostgreSQL    │  Database: postgres
└─────────────────┘

Integraciones Externas:
- Google OAuth (para registro de clientes)
- Wompi API (pagos recurrentes)
```

## Problema: Desincronización de Esquema

### Estado Actual

**Backend (TypeORM Entities)** → Define esquema esperado  
**Database (Supabase)** → Esquema real (desactualizado)

**Mismatch:** Backend intenta acceder a columnas que no existen en Supabase

### Ejemplo del Problema

```typescript
// backend/src/modules/users/entities/user.entity.ts
@Entity('users')
export class User extends BaseEntity {
  @Column({ name: 'auth_provider', default: 'local' })
  authProvider: string; // ← Backend espera esta columna
  
  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date; // ← Backend espera esta columna
}
```

```sql
-- Supabase actual (antes del fix)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(150),
  password VARCHAR(255)
  -- ❌ auth_provider NO EXISTE
  -- ❌ deleted_at NO EXISTE
);
```

### Solución: Migración SQL Manual

Ya que `synchronize: false` en producción, debemos ejecutar manualmente el script SQL.

## Diseño de Solución: ARREGLAR_TODO.sql

### Estrategia

1. **Usar `ADD COLUMN IF NOT EXISTS`** para evitar errores si columna ya existe
2. **Agregar valores por defecto** para columnas NOT NULL en registros existentes
3. **Crear índices** para optimizar queries frecuentes
4. **Mantener compatibilidad** con datos existentes

### Estructura del Script

```sql
-- FASE 1: Agregar columnas faltantes
ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;
-- ... más columnas

-- FASE 2: Actualizar datos existentes
UPDATE products SET is_available = (is_active IS TRUE) WHERE is_available IS NULL;

-- FASE 3: Crear índices
CREATE INDEX IF NOT EXISTS idx_products_is_available ON products(is_available);

-- FASE 4: Verificación
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'products';
```

### Tablas Afectadas

#### 1. Tabla `products`
**Columnas a Agregar:**
- `images TEXT[]` - Array de URLs de imágenes adicionales
- `additionals TEXT[]` - Array de productos adicionales/complementos
- `is_available BOOLEAN` - Disponibilidad en stock (mapea a `is_active`)
- `sku VARCHAR(100)` - Stock Keeping Unit
- `reviews_count INTEGER` - Conteo de reseñas

**Lógica de Migración:**
```sql
UPDATE products 
SET is_available = (is_active IS TRUE)
WHERE is_available IS NULL;
```

#### 2. Tabla `plans`
**Columnas a Agregar:**
- `interval_days INTEGER` - Días entre entregas (7/14/30)
- `delivery_count INTEGER` - Cantidad de entregas por ciclo

**Lógica de Migración:**
```sql
UPDATE plans 
SET interval_days = CASE 
    WHEN frequency = 'weekly' THEN 7
    WHEN frequency = 'biweekly' THEN 14
    WHEN frequency = 'monthly' THEN 30
END
WHERE interval_days IS NULL;
```

#### 3. Tabla `orders`
**Columnas a Agregar:**
- `order_number VARCHAR(50)` - Número de orden único (ORD-00000001)
- `delivery_fee DECIMAL(10,2)` - Costo de envío
- `delivery_address TEXT` - Dirección de entrega
- `delivery_city VARCHAR(100)` - Ciudad de entrega
- `sender_name VARCHAR(255)` - Nombre del remitente
- `sender_phone VARCHAR(20)` - Teléfono del remitente
- `receiver_name VARCHAR(255)` - Nombre del destinatario
- `receiver_phone VARCHAR(20)` - Teléfono del destinatario
- `scheduled_date TIMESTAMP` - Fecha programada de entrega
- `delivered_at TIMESTAMP` - Fecha real de entrega
- `is_automatic BOOLEAN` - Si fue generada automáticamente por suscripción
- `subtotal DECIMAL(10,2)` - Subtotal antes de delivery_fee
- `user_id UUID` - FK al usuario que hizo la orden

**Lógica de Migración:**
```sql
UPDATE orders 
SET order_number = 'ORD-' || LPAD(CAST(id AS TEXT), 8, '0')
WHERE order_number IS NULL;
```

### Índices Propuestos

```sql
-- Performance para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_scheduled_date ON orders(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
```

## Diseño de Solución: Google OAuth

### Flujo Actual (Con Error)

```
Usuario hace click en "Continuar con Google"
  ↓
Frontend redirige a Google OAuth
  ↓
Google rechaza: "Acceso bloqueado: error de autorización"
  ↓
Causa: Dominio Vercel no está en lista de orígenes autorizados
```

### Flujo Esperado (Después del Fix)

```
Usuario hace click en "Continuar con Google"
  ↓
Frontend redirige a Google OAuth con Client ID
  ↓
Usuario autoriza permisos (email, profile)
  ↓
Google redirige a: https://plantasornamentales-3cum.vercel.app/api/auth/callback/google
  ↓
Frontend recibe token y datos de perfil
  ↓
Frontend envía a Backend: POST /api/v1/auth/google-login
  ↓
Backend crea o actualiza usuario con:
  - auth_provider: 'google'
  - google_id: <Google User ID>
  - email: <email de Google>
  - firstName: <nombre de Google>
  - role: 'customer' (por defecto)
  ↓
Backend devuelve JWT token
  ↓
Frontend guarda token y redirige a dashboard del cliente
```

### Configuración Requerida en Google Cloud Console

**Paso 1:** Acceder a https://console.cloud.google.com/apis/credentials

**Paso 2:** Localizar OAuth 2.0 Client ID existente:
- Client ID: `606760776980-m49qk52hum9m39cb21puvnqsih5ubcc7.apps.googleusercontent.com`

**Paso 3:** Editar configuración:

```yaml
Authorized JavaScript origins:
  - https://plantasornamentales-3cum.vercel.app
  
Authorized redirect URIs:
  - https://plantasornamentales-3cum.vercel.app/api/auth/callback/google
```

**Paso 4:** Guardar y esperar propagación (1-2 minutos)

### Validación en Backend

El backend ya tiene el endpoint implementado:

```typescript
// backend/src/modules/auth/auth.controller.ts
@Post('google-login')
async googleLogin(@Body() googleLoginDto: GoogleLoginDto) {
  return this.authService.googleLogin(googleLoginDto);
}

// backend/src/modules/auth/auth.service.ts
async googleLogin(dto: GoogleLoginDto) {
  // Busca usuario por google_id
  let user = await this.usersService.findByGoogleId(dto.googleId);
  
  if (!user) {
    // Crea nuevo usuario con auth_provider = 'google'
    user = await this.usersService.create({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      authProvider: 'google',
      googleId: dto.googleId,
      role: UserRole.CUSTOMER,
    });
  }
  
  return this.generateToken(user);
}
```

## Diseño de Solución: Wompi Pagos Recurrentes

### Estado Actual (TEST)

```yaml
Variables en Railway:
  WOMPI_PUBLIC_KEY: pub_test_xxxxxxxxxxxx
  WOMPI_PRIVATE_KEY: prv_test_xxxxxxxxxxxx
  WOMPI_EVENTS_SECRET: (vacío o test)
```

**Funcionalidad Disponible:**
- ✅ Pagos únicos de prueba
- ✅ Tokenización de tarjetas (guardar tarjeta para uso futuro)
- ✅ Webhooks para confirmación de pago
- ⚠️ NO genera cargos reales

### Flujo de Suscripción con Wompi

```
1. Cliente selecciona plan (weekly/biweekly/monthly)
   ↓
2. Cliente ingresa datos de tarjeta
   ↓
3. Frontend envía a Wompi: tokenizar tarjeta
   ↓
4. Wompi devuelve: payment_token (representa la tarjeta guardada)
   ↓
5. Frontend envía a Backend: 
      POST /api/v1/subscriptions
      { planId, paymentToken }
   ↓
6. Backend crea registro en tabla 'subscriptions':
      - status: 'pending_payment'
      - payment_token: <token de Wompi>
   ↓
7. Backend hace cargo inicial a Wompi:
      POST https://api.wompi.co/v1/transactions
      { payment_token, amount }
   ↓
8. Wompi procesa pago y envía webhook a:
      POST /api/v1/payments/webhook
   ↓
9. Backend actualiza suscripción:
      - status: 'active'
      - next_payment_date: now() + interval_days
   ↓
10. Backend genera primera orden automáticamente
   ↓
11. Cron job diario revisa suscripciones vencidas:
      - Si today >= next_payment_date
      - Hace cargo automático con payment_token
      - Genera nueva orden
      - Actualiza next_payment_date
```

### Migración a Producción (Futuro)

**Cuando el negocio esté validado:**

1. Registrar cuenta comercial: https://comercios.wompi.co/register
2. Proveer documentos:
   - RUT
   - Cédula representante legal
   - Certificado de cámara de comercio
3. Habilitar "Tokenization" en panel de Wompi
4. Obtener claves de producción:
   - `WOMPI_PUBLIC_KEY`: `pub_prod_xxxxx`
   - `WOMPI_PRIVATE_KEY`: `prv_prod_xxxxx`
   - `WOMPI_EVENTS_SECRET`: `secret_prod_xxxxx`
5. Actualizar variables en Railway
6. Probar con tarjeta real (monto pequeño)
7. Activar en frontend

## Matriz de Decisiones Técnicas

| Decisión | Opción Elegida | Alternativas Consideradas | Justificación |
|----------|----------------|---------------------------|---------------|
| Migración DB | SQL manual | TypeORM migrations, Supabase UI | TypeORM sync deshabilitado; Supabase no tiene UI para ALTER TABLE |
| Google OAuth | Client ID existente | Crear nuevo Client ID | Ya configurado en backend y frontend |
| Wompi | Iniciar con TEST | Ir directo a producción | Validar flujo sin riesgo de cargos reales |
| Orden de fixes | DB → Google → Wompi | Cualquier orden | DB bloquea todo; Google es rápido; Wompi es opcional inicial |

## Plan de Rollback

### Si falla migración SQL:
```sql
-- Rollback de columnas agregadas (si causan problemas)
ALTER TABLE products DROP COLUMN IF EXISTS images;
ALTER TABLE products DROP COLUMN IF EXISTS additionals;
-- ... etc
```

### Si falla Google OAuth:
- Remover dominio de Google Cloud Console
- Usuario puede seguir usando email/password

### Si falla Wompi:
- Usar claves TEST indefinidamente
- Pagos solo para demostración, no producción

## Métricas de Éxito

### Post-Migración DB
- ✅ 0 errores 500 relacionados con columnas faltantes
- ✅ Dashboard admin carga en < 2 segundos
- ✅ Todas las queries de verificación retornan columnas esperadas

### Post-Google OAuth
- ✅ Usuario puede completar registro con Google
- ✅ Usuario aparece en tabla `users` con `auth_provider='google'`
- ✅ Login subsecuente con Google funciona

### Post-Wompi TEST
- ✅ Usuario puede tokenizar tarjeta de prueba
- ✅ Pago inicial se procesa
- ✅ Suscripción se activa
- ✅ Orden se genera automáticamente

## Diagrama de Entidades (Después de Migración)

```
users
├── id (UUID, PK)
├── email (VARCHAR, UNIQUE)
├── first_name (VARCHAR)
├── last_name (VARCHAR)
├── password (VARCHAR, nullable para Google)
├── auth_provider (VARCHAR: 'local' | 'google')
├── google_id (VARCHAR, nullable)
├── role (ENUM: customer | admin | super_admin)
├── deleted_at (TIMESTAMP, nullable) ← NUEVO
├── address (TEXT, nullable) ← NUEVO
└── city (VARCHAR, nullable) ← NUEVO

products
├── id (UUID, PK)
├── name (VARCHAR)
├── description (TEXT)
├── price (DECIMAL)
├── image_url (VARCHAR)
├── images (TEXT[]) ← NUEVO
├── additionals (TEXT[]) ← NUEVO
├── is_available (BOOLEAN) ← NUEVO
├── sku (VARCHAR) ← NUEVO
└── reviews_count (INTEGER) ← NUEVO

plans
├── id (UUID, PK)
├── name (VARCHAR)
├── price (DECIMAL)
├── frequency (ENUM: weekly | biweekly | monthly)
├── interval_days (INTEGER) ← NUEVO
└── delivery_count (INTEGER) ← NUEVO

orders
├── id (UUID, PK)
├── user_id (UUID, FK) ← NUEVO
├── status (ENUM)
├── total (DECIMAL)
├── order_number (VARCHAR) ← NUEVO
├── delivery_address (TEXT) ← NUEVO
├── delivery_city (VARCHAR) ← NUEVO
├── sender_name (VARCHAR) ← NUEVO
├── receiver_name (VARCHAR) ← NUEVO
├── scheduled_date (TIMESTAMP) ← NUEVO
├── delivered_at (TIMESTAMP) ← NUEVO
├── is_automatic (BOOLEAN) ← NUEVO
└── subtotal (DECIMAL) ← NUEVO

subscriptions
├── id (UUID, PK)
├── user_id (UUID, FK to users)
├── plan_id (UUID, FK to plans)
├── status (ENUM)
├── payment_token (VARCHAR) ← Token de Wompi
├── next_payment_date (TIMESTAMP)
└── created_at (TIMESTAMP)
```

## Archivos Clave

```
ARREGLAR_TODO.sql                           ← Script de migración
backend/src/modules/users/entities/user.entity.ts
backend/src/modules/products/entities/product.entity.ts
backend/src/modules/plans/entities/plan.entity.ts
backend/src/modules/orders/entities/order.entity.ts
backend/src/modules/auth/auth.service.ts    ← Lógica Google OAuth
backend/src/modules/payments/payments.service.ts ← Integración Wompi
VARIABLES_COMPLETAS_RAILWAY.txt             ← Todas las env vars
```
