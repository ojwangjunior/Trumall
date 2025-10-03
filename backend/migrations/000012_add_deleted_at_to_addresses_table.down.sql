DROP INDEX IF EXISTS idx_addresses_deleted_at;
ALTER TABLE addresses DROP COLUMN IF EXISTS deleted_at;