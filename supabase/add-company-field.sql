-- Add company field to users table
ALTER TABLE users ADD COLUMN company TEXT;

-- Update the existing users table to allow company field
COMMENT ON COLUMN users.company IS 'Company or business name of the user';
