-- Add additional product detail fields for better card/detail separation
ALTER TABLE products
ADD COLUMN IF NOT EXISTS brand TEXT,
ADD COLUMN IF NOT EXISTS whats_in_box TEXT[],
ADD COLUMN IF NOT EXISTS warranty_info TEXT,
ADD COLUMN IF NOT EXISTS original_price_cents BIGINT,
ADD COLUMN IF NOT EXISTS discount INTEGER;

-- Create index on brand for filtering
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
