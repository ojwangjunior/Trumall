CREATE TABLE shipping_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipping_method_id UUID NOT NULL REFERENCES shipping_methods(id) ON DELETE CASCADE,
    shipping_zone_id UUID NOT NULL REFERENCES shipping_zones(id) ON DELETE CASCADE,
    cost_override_cents BIGINT,
    min_order_value_cents BIGINT DEFAULT 0,
    max_order_value_cents BIGINT,
    free_shipping_threshold_cents BIGINT,
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(shipping_method_id, shipping_zone_id)
);

CREATE INDEX idx_shipping_rules_method ON shipping_rules(shipping_method_id);
CREATE INDEX idx_shipping_rules_zone ON shipping_rules(shipping_zone_id);
CREATE INDEX idx_shipping_rules_available ON shipping_rules(is_available);

-- Create some default rules (optional - can be managed via admin)
-- Free shipping for orders above 10,000 KES in Nairobi
INSERT INTO shipping_rules (shipping_method_id, shipping_zone_id, free_shipping_threshold_cents, is_available)
SELECT sm.id, sz.id, 1000000, true
FROM shipping_methods sm, shipping_zones sz
WHERE sm.code = 'standard' AND sz.city = 'Nairobi';
