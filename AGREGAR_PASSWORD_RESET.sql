-- ============================================
-- AGREGAR COLUMNAS PARA PASSWORD RESET
-- Ejecutar en: Supabase > SQL Editor
-- ============================================

-- Agregar columnas para recuperación de contraseña
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP;

-- Crear índice para búsqueda rápida por token
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);

-- Verificar que las columnas se agregaron
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND column_name IN ('reset_token', 'reset_token_expiry')
ORDER BY ordinal_position;
