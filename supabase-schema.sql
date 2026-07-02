-- ============================================
-- JANNETH ACEVEDO PLANTAS - SCHEMA COMPLETO
-- Base de datos para Supabase PostgreSQL
-- ============================================

-- Habilitar extensión para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TIPOS ENUM
-- ============================================

CREATE TYPE user_role_enum AS ENUM ('customer', 'wholesaler', 'admin', 'super_admin');
CREATE TYPE subscription_status_enum AS ENUM ('active', 'paused', 'cancelled', 'expired');
CREATE TYPE plan_frequency_enum AS ENUM ('weekly', 'biweekly', 'monthly');
CREATE TYPE order_status_enum AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_status_enum AS ENUM ('pending', 'approved', 'declined', 'error', 'voided');

-- ============================================
-- TABLA: users
-- ============================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    phone VARCHAR(20),
    role user_role_enum NOT NULL DEFAULT 'customer',
    is_active BOOLEAN NOT NULL DEFAULT true,
    email_verified BOOLEAN NOT NULL DEFAULT false,
    google_id VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_google_id ON users(google_id);

-- ============================================
-- TABLA: products
-- ============================================

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    wholesale_price DECIMAL(10,2),
    stock INTEGER NOT NULL DEFAULT 0,
    category VARCHAR(100),
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    rating DOUBLE PRECISION NOT NULL DEFAULT 5,
    reviews_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);

-- ============================================
-- TABLA: plans
-- ============================================

CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    frequency plan_frequency_enum NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    features TEXT[],
    image_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_plans_is_active ON plans(is_active);
CREATE INDEX idx_plans_frequency ON plans(frequency);

-- ============================================
-- TABLA: recipients
-- ============================================

CREATE TABLE recipients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    postal_code VARCHAR(20),
    notes TEXT,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recipients_user_id ON recipients(user_id);
CREATE INDEX idx_recipients_is_default ON recipients(is_default);

-- ============================================
-- TABLA: subscriptions
-- ============================================

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
    recipient_id UUID REFERENCES recipients(id) ON DELETE SET NULL,
    status subscription_status_enum NOT NULL DEFAULT 'active',
    start_date TIMESTAMP NOT NULL,
    next_delivery_date TIMESTAMP,
    end_date TIMESTAMP,
    greeting_card TEXT,
    special_instructions TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_plan_id ON subscriptions(plan_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_next_delivery ON subscriptions(next_delivery_date);

-- ============================================
-- TABLA: orders
-- ============================================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES recipients(id) ON DELETE SET NULL,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    status order_status_enum NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    greeting_card TEXT,
    notes TEXT,
    tracking_number VARCHAR(255),
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_subscription_id ON orders(subscription_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- ============================================
-- TABLA: order_items
-- ============================================

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- ============================================
-- TABLA: payments
-- ============================================

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'COP',
    status payment_status_enum NOT NULL DEFAULT 'pending',
    payment_method VARCHAR(100),
    transaction_id VARCHAR(255),
    wompi_transaction_id VARCHAR(255),
    wompi_reference VARCHAR(255),
    payment_link TEXT,
    error_message TEXT,
    paid_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_payments_wompi_transaction_id ON payments(wompi_transaction_id);

-- ============================================
-- TABLA: settings
-- ============================================

CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) NOT NULL UNIQUE,
    value TEXT,
    description VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_settings_key ON settings(key);

-- ============================================
-- DATOS INICIALES (SEEDS)
-- ============================================

-- Usuario administrador por defecto
INSERT INTO users (first_name, last_name, email, password, role, is_active, email_verified)
VALUES (
    'Admin',
    'Sistema',
    'admin@jannethplantas.com',
    '$2b$10$rJ5H4w6vH7xY3YqZ6N1TXOQc6Qa0KXhYZ7XrR1VwZxT9Q1w5Q2w5Q',
    'super_admin',
    true,
    true
);

-- Configuraciones iniciales
INSERT INTO settings (key, value, description) VALUES
('site_name', 'Janneth Acevedo Plantas Ornamentales', 'Nombre del sitio'),
('contact_email', 'contacto@jannethplantas.com', 'Email de contacto'),
('contact_phone', '+57 300 123 4567', 'Teléfono de contacto'),
('shipping_cost_default', '15000', 'Costo de envío por defecto en COP'),
('free_shipping_threshold', '150000', 'Compra mínima para envío gratis en COP');

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
