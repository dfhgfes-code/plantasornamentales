-- ============================================================
-- MIGRACIÓN: frequency (enum) → interval_days (int)
-- Ejecutar en Supabase SQL Editor si el backend no la aplica
-- automáticamente con synchronize: true
-- ============================================================

-- 1. Agregar la nueva columna interval_days (si no existe)
ALTER TABLE plans 
  ADD COLUMN IF NOT EXISTS interval_days INT NOT NULL DEFAULT 30;

-- 2. Actualizar valores desde la columna frequency existente
UPDATE plans SET interval_days = 7  WHERE frequency = 'weekly';
UPDATE plans SET interval_days = 30 WHERE frequency = 'monthly';

-- 3. Eliminar la columna frequency (ya no se usa)
-- PRECAUCIÓN: Solo ejecutar si la aplicación ya está desplegada con interval_days
ALTER TABLE plans DROP COLUMN IF EXISTS frequency;

-- 4. Agregar columnas de invitado en orders (si no existen)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS sender_name   VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS sender_phone  VARCHAR(20);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS receiver_name  VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS receiver_phone VARCHAR(20);

-- 5. Hacer user_id opcional en orders
ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;

-- Verificar cambios
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'plans' ORDER BY ordinal_position;
