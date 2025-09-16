ALTER TABLE users ADD COLUMN role text DEFAULT 'buyer';
UPDATE users SET role = array_to_string(roles, ',') WHERE roles IS NOT NULL;
ALTER TABLE users DROP COLUMN roles;