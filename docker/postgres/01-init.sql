-- Hacchobori App Database Initialization
-- This script runs when the PostgreSQL container starts for the first time

-- Create the main database (if not exists)
-- Note: POSTGRES_DB environment variable already creates the database,
-- but this ensures it exists and provides a place for additional setup

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pg_trgm extension for faster text search (optional)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create any additional schemas if needed (currently using public schema)
-- CREATE SCHEMA IF NOT EXISTS app_schema;

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'Hacchobori App database initialized successfully';
END
$$;