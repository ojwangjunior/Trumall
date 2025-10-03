CREATE TABLE shipping_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'Kenya',
    state VARCHAR(100),
    city VARCHAR(100),
    postal_code_pattern VARCHAR(50),
    additional_cost_cents BIGINT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    priority INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_shipping_zones_country ON shipping_zones(country);
CREATE INDEX idx_shipping_zones_city ON shipping_zones(city);
CREATE INDEX idx_shipping_zones_active ON shipping_zones(is_active);

-- Insert default Kenya shipping zones
INSERT INTO shipping_zones (name, country, city, additional_cost_cents, priority) VALUES
('Nairobi Metro', 'Kenya', 'Nairobi', 10000, 1),
('Mombasa Coast', 'Kenya', 'Mombasa', 20000, 2),
('Kisumu Western', 'Kenya', 'Kisumu', 25000, 3),
('Nakuru Rift Valley', 'Kenya', 'Nakuru', 18000, 4),
('Other Kenya Cities', 'Kenya', NULL, 30000, 10);
