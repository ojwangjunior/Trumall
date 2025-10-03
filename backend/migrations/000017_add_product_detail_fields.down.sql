-- Rollback product detail fields
ALTER TABLE products
DROP COLUMN IF EXISTS brand,
DROP COLUMN IF EXISTS whats_in_box,
DROP COLUMN IF EXISTS warranty_info,
DROP COLUMN IF EXISTS original_price_cents,
DROP COLUMN IF EXISTS discount;

DROP INDEX IF EXISTS idx_products_brand;
