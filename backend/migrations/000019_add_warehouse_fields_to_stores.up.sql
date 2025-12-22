ALTER TABLE stores ADD COLUMN warehouse_street VARCHAR(255);
ALTER TABLE stores ADD COLUMN warehouse_city VARCHAR(100);
ALTER TABLE stores ADD COLUMN warehouse_state VARCHAR(100);
ALTER TABLE stores ADD COLUMN warehouse_country VARCHAR(100) DEFAULT 'KE';
ALTER TABLE stores ADD COLUMN warehouse_postal_code VARCHAR(20);
ALTER TABLE stores ADD COLUMN warehouse_latitude DOUBLE PRECISION;
ALTER TABLE stores ADD COLUMN warehouse_longitude DOUBLE PRECISION;
