-- ============================================
-- SCRIPT COMPLETO PARA ARREGLAR TODAS LAS COLUMNAS FALTANTES
-- Ejecutar en: Supabase > SQL Editor
-- ============================================

-- ===========================
-- TABLA: products
-- ===========================

-- Agregar columnas faltantes
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS images TEXT[],
ADD COLUMN IF NOT EXISTS additionals TEXT[],
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS sku VARCHAR(100),
ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;

-- Actualizar productos existentes
UPDATE products 
SET is_available = (is_active IS TRUE)
WHERE is_available IS NULL;

-- ===========================
-- TABLA: plans
-- ===========================

-- Agregar columnas faltantes
ALTER TABLE plans 
ADD COLUMN IF NOT EXISTS interval_days INTEGER,
ADD COLUMN IF NOT EXISTS delivery_count INTEGER;

-- Mapear frequency a interval_days
UPDATE plans 
SET interval_days = CASE 
    WHEN frequency = 'weekly' THEN 7
    WHEN frequency = 'biweekly' THEN 14
    WHEN frequency = 'monthly' THEN 30
    ELSE 7
END
WHERE interval_days IS NULL;

-- Establecer delivery_count por defecto
UPDATE plans 
SET delivery_count = CASE 
    WHEN frequency = 'weekly' THEN 4
    WHEN frequency = 'biweekly' THEN 2
    WHEN frequency = 'monthly' THEN 1
    ELSE 1
END
WHERE delivery_count IS NULL;

-- ===========================
-- TABLA: orders
-- ===========================

-- Agregar columnas faltantes
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS order_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS delivery_address TEXT,
ADD COLUMN IF NOT EXISTS delivery_city VARCHAR(100),
ADD COLUMN IF NOT EXISTS sender_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS sender_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS receiver_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS receiver_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS scheduled_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS is_automatic BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

-- Renombrar columna si existe con nombre diferente
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='total_amount') THEN
        ALTER TABLE orders RENAME COLUMN total_amount TO total;
    END IF;
END $$;

-- Generar order_number para órdenes existentes sin número
UPDATE orders 
SET order_number = 'ORD-' || LPAD(CAST(id AS TEXT), 8, '0')
WHERE order_number IS NULL;

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_scheduled_date ON orders(scheduled_date);

-- ===========================
-- CREAR ÍNDICES ADICIONALES
-- ===========================

CREATE INDEX IF NOT EXISTS idx_products_is_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_plans_interval_days ON plans(interval_days);

-- ===========================
-- VERIFICACIÓN FINAL
-- ===========================

-- Verificar columnas de products
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'products' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar columnas de plans
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'plans' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar columnas de orders
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- ============================================
-- LISTO: Todas las columnas deberían estar agregadas
-- ============================================
