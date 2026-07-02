-- ============================================
-- AGREGAR COLUMNAS FALTANTES A LA TABLA USERS
-- Ejecutar en: Supabase > SQL Editor
-- ============================================

-- Agregar auth_provider (para diferenciar login local vs Google)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'local';

-- Agregar address (dirección del usuario)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS address TEXT;

-- Agregar city (ciudad del usuario)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS city VARCHAR(100);

-- Actualizar usuarios existentes para que tengan auth_provider = 'local'
UPDATE users 
SET auth_provider = 'local' 
WHERE auth_provider IS NULL;

-- Crear índice para mejorar búsquedas por auth_provider
CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON users(auth_provider);

-- Verificar que todas las columnas existen
SELECT 
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- ============================================
-- LISTO: Ahora el login debería funcionar
-- ============================================
