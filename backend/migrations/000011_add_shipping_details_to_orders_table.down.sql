ALTER TABLE orders
DROP CONSTRAINT IF EXISTS fk_orders_shipping_address;

DROP INDEX IF EXISTS idx_orders_shipping_address_id;

ALTER TABLE orders
DROP COLUMN IF EXISTS shipping_address_id,
DROP COLUMN IF EXISTS shipping_cost_cents,
DROP COLUMN IF EXISTS shipping_method,
DROP COLUMN IF EXISTS estimated_delivery;