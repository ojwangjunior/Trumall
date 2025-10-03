ALTER TABLE addresses ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
CREATE INDEX idx_addresses_deleted_at ON addresses(deleted_at);