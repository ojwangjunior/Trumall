ALTER TABLE users ADD COLUMN roles text[];
UPDATE users SET roles = string_to_array(role, ',') WHERE role IS NOT NULL;
ALTER TABLE users DROP COLUMN role;