-- This script runs automatically when the PostgreSQL container starts for the first time
-- It creates the database and any initial setup you need

-- The database is already created by POSTGRES_DB environment variable
-- But you can add any additional setup here

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- You can add initial data here if you want
-- But it's better to use Prisma seed for this
