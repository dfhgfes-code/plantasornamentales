-- Actualizar roles de administradores
UPDATE users SET role = 'super_admin' WHERE email = 'janneth@jannethplantas.com';
UPDATE users SET role = 'admin'       WHERE email = 'admin@jannethplantas.com';

-- Verificar
SELECT email, role, is_active FROM users WHERE email IN ('janneth@jannethplantas.com','admin@jannethplantas.com');
