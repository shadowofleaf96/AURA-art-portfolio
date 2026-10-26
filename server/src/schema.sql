-- AURA Photography Portfolio Database Schema (PostgreSQL)
-- Designed for plain-English explanation at oral assessment

-- 1. USERS TABLE
-- Stores client & admin accounts with securely hashed passwords
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. ITEMS TABLE (Gallery Artworks)
-- Stores photography portfolio items previously hardcoded in Week 2
CREATE TABLE IF NOT EXISTS items (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  filter_category VARCHAR(100) NOT NULL,
  location VARCHAR(255),
  camera VARCHAR(255),
  image VARCHAR(255) NOT NULL,
  alt TEXT NOT NULL,
  featured VARCHAR(50) DEFAULT 'standard',
  description TEXT NOT NULL,
  specs JSONB NOT NULL DEFAULT '[]'::jsonb,
  price NUMERIC(10, 2) NOT NULL,
  edition VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. SERVICES TABLE (Photography Commission Packages)
-- Stores photography service rates and deliverables
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(100) PRIMARY KEY,
  tag VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  price VARCHAR(100) NOT NULL,
  rate_unit VARCHAR(100),
  badge VARCHAR(100),
  description TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. ORDERS & INQUIRIES TABLE
-- Connects client bookings & print orders to registered users
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
