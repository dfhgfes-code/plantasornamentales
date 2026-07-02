-- ============================================
-- AGREGAR COLUMNA deleted_at A TODAS LAS TABLAS
-- Ejecutar en: Supabase > SQL Editor
-- ============================================

-- Agregar deleted_at a users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;

-- Agregar deleted_at a products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;

-- Agregar deleted_at a plans
ALTER TABLE plans 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;

-- Agregar deleted_at a recipients
ALTER TABLE recipients 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;

-- Agregar deleted_at a subscriptions
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;

-- Agregar deleted_at a orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;

-- Agregar deleted_at a order_items
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;

-- Agregar deleted_at a payments
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;

-- Agregar deleted_at a settings
ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;

-- Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);
CREATE INDEX IF NOT EXISTS idx_products_deleted_at ON products(deleted_at);
CREATE INDEX IF NOT EXISTS idx_plans_deleted_at ON plans(deleted_at);
CREATE INDEX IF NOT EXISTS idx_recipients_deleted_at ON recipients(deleted_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_deleted_at ON subscriptions(deleted_at);
CREATE INDEX IF NOT EXISTS idx_orders_deleted_at ON orders(deleted_at);
CREATE INDEX IF NOT EXISTS idx_order_items_deleted_at ON order_items(deleted_at);
CREATE INDEX IF NOT EXISTS idx_payments_deleted_at ON payments(deleted_at);
CREATE INDEX IF NOT EXISTS idx_settings_deleted_at ON settings(deleted_at);

-- Verificar que todo esté bien
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE column_name = 'deleted_at' 
    AND table_schema = 'public'
ORDER BY table_name;

-- ============================================
-- LISTO: Ahora el backend debería funcionar
-- ============================================
