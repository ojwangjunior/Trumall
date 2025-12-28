ALTER TABLE stores
ADD COLUMN warehouse_street VARCHAR(255),
ADD COLUMN warehouse_city VARCHAR(100),
ADD COLUMN warehouse_state VARCHAR(100),
ADD COLUMN warehouse_country VARCHAR(100) DEFAULT 'KE',
ADD COLUMN warehouse_postal_code VARCHAR(20),
ADD COLUMN warehouse_latitude DOUBLE PRECISION DEFAULT 0,
ADD COLUMN warehouse_longitude DOUBLE PRECISION DEFAULT 0;
