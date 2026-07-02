-- ============================================
-- CREAR SUPERADMINISTRADOR
-- ============================================
-- Email: madridsystem@outlook.es
-- Password: @Joshuamadrid27
-- ============================================

-- Paso 1: Eliminar admin de ejemplo si existe
DELETE FROM users WHERE email = 'admin@jannethplantas.com';

-- Paso 2: Eliminar usuario si ya existe (por si acaso)
DELETE FROM users WHERE email = 'madridsystem@outlook.es';

-- Paso 3: Crear nuevo superadministrador
INSERT INTO users (
    first_name, 
    last_name, 
    email, 
    password, 
    role, 
    is_active, 
    email_verified,
    created_at,
    updated_at
)
VALUES (
    'David',
    'Madrid',
    'madridsystem@outlook.es',
    '$2b$10$rH4lOGoocdQMks2AB5WiuOI7MiAjKcsq6IdGjHFxz0DSBTkh4OUK.',
    'super_admin',
    true,
    true,
    NOW(),
    NOW()
);

-- Verificar que se creó correctamente
SELECT id, first_name, last_name, email, role, is_active, email_verified 
FROM users 
WHERE email = 'madridsystem@outlook.es';
