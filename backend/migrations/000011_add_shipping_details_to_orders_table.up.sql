ALTER TABLE orders
ADD COLUMN shipping_address_id UUID,
ADD COLUMN shipping_cost_cents BIGINT DEFAULT 0,
ADD COLUMN shipping_method VARCHAR(50),
ADD COLUMN estimated_delivery TIMESTAMP WITH TIME ZONE;

ALTER TABLE orders
ADD CONSTRAINT fk_orders_shipping_address
FOREIGN KEY (shipping_address_id) REFERENCES addresses(id) ON DELETE SET NULL;

CREATE INDEX idx_orders_shipping_address_id ON orders(shipping_address_id);