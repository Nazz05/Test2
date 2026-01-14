-- Create auth_user role if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'auth_user') THEN
    CREATE USER auth_user WITH PASSWORD '1234';
  END IF;
END
$$;

-- Create auth_db database if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'auth_db') THEN
    CREATE DATABASE auth_db OWNER auth_user;
  END IF;
END
$$;

-- Grant privileges
ALTER USER auth_user WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE auth_db TO auth_user;
