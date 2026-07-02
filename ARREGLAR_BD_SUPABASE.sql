-- ============================================
-- SCRIPT PARA ARREGLAR BASE DE DATOS SUPABASE
-- Ejecutar en: Supabase > SQL Editor
-- ============================================

-- PASO 1: Limpiar registros con email NULL
DELETE FROM users WHERE email IS NULL;

-- PASO 2: Verificar la definición de la columna email
-- Si existe, modificarla para que coincida con lo esperado
ALTER TABLE users 
ALTER COLUMN email TYPE VARCHAR(255),
ALTER COLUMN email SET NOT NULL;

-- PASO 3: Asegurar que el índice UNIQUE existe
DROP INDEX IF EXISTS idx_users_email;
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- PASO 4: Verificar que el usuario superadmin existe
SELECT id, first_name, last_name, email, role, is_active 
FROM users 
WHERE role = 'super_admin';

-- Si no existe, crear el superadmin:
INSERT INTO users (first_name, last_name, email, password, role, is_active, email_verified)
VALUES (
    'Super',
    'Admin',
    'madridsystem@outlook.es',
    '$2b$10$rH4lOGoocdQMks2AB5WiuOI7MiAjKcsq6IdGjHFxz0DSBTkh4OUK.',
    'super_admin',
    true,
    true
)
ON CONFLICT (email) DO UPDATE SET
    password = '$2b$10$rH4lOGoocdQMks2AB5WiuOI7MiAjKcsq6IdGjHFxz0DSBTkh4OUK.',
    role = 'super_admin',
    is_active = true,
    email_verified = true;

-- PASO 5: Verificar todos los usuarios
SELECT id, first_name, last_name, email, role, is_active, email_verified
FROM users
ORDER BY created_at DESC;

-- ============================================
-- LISTO: La base de datos ahora debe estar limpia
-- ============================================
