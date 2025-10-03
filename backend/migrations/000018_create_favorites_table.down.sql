-- Rollback favorites table
DROP INDEX IF EXISTS idx_favorites_product_id;
DROP INDEX IF EXISTS idx_favorites_user_id;
DROP TABLE IF EXISTS favorites;
