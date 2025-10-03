-- Rollback UX enhancement fields from products table
ALTER TABLE products
DROP COLUMN IF EXISTS key_features,
DROP COLUMN IF EXISTS specifications,
DROP COLUMN IF EXISTS average_rating,
DROP COLUMN IF EXISTS review_count,
DROP COLUMN IF EXISTS rating_breakdown;

-- Rollback reviews table changes
ALTER TABLE reviews
DROP COLUMN IF EXISTS images,
DROP COLUMN IF EXISTS verified_purchase,
DROP COLUMN IF EXISTS user_name,
DROP COLUMN IF EXISTS updated_at;

-- Drop indexes
DROP INDEX IF EXISTS idx_products_average_rating;
DROP INDEX IF EXISTS idx_reviews_product_id;
