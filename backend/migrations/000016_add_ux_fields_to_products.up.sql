-- Add UX enhancement fields to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS key_features TEXT[],
ADD COLUMN IF NOT EXISTS specifications JSONB,
ADD COLUMN IF NOT EXISTS average_rating FLOAT DEFAULT 0,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating_breakdown JSONB;

-- Update reviews table with new fields
ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS images TEXT[],
ADD COLUMN IF NOT EXISTS verified_purchase BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS user_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create index on average_rating for better performance when sorting by rating
CREATE INDEX IF NOT EXISTS idx_products_average_rating ON products(average_rating DESC);

-- Create index on product_id for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
