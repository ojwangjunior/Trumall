CREATE TABLE shipping_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    base_cost_cents BIGINT NOT NULL DEFAULT 0,
    cost_per_kg_cents BIGINT DEFAULT 0,
    delivery_days_min INT NOT NULL DEFAULT 1,
    delivery_days_max INT NOT NULL DEFAULT 3,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_shipping_methods_code ON shipping_methods(code);
CREATE INDEX idx_shipping_methods_active ON shipping_methods(is_active);

-- Insert default shipping methods
INSERT INTO shipping_methods (name, code, description, base_cost_cents, delivery_days_min, delivery_days_max) VALUES
('Standard Shipping', 'standard', 'Regular delivery within 3-5 business days', 30000, 3, 5),
('Express Shipping', 'express', 'Fast delivery within 1-2 business days', 50000, 1, 2),
('Pickup Point', 'pickup', 'Collect from nearest pickup point', 15000, 2, 4);
