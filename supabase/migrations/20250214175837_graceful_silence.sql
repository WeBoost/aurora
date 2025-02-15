/*
  # Initial Schema Setup for Aurora

  1. New Tables
    - profiles
      - id (uuid, references auth.users)
      - username (text)
      - full_name (text)
      - avatar_url (text)
      - website (text)
      - updated_at (timestamp)
    
    - businesses
      - id (uuid)
      - owner_id (uuid, references profiles)
      - name (text)
      - slug (text)
      - description (text)
      - logo_url (text)
      - website (text)
      - phone (text)
      - email (text)
      - address (text)
      - city (text)
      - postal_code (text)
      - country (text)
      - latitude (float)
      - longitude (float)
      - category (text)
      - subcategory (text)
      - status (text)
      - created_at (timestamp)
      - updated_at (timestamp)

    - business_hours
      - id (uuid)
      - business_id (uuid, references businesses)
      - day_of_week (int)
      - open_time (time)
      - close_time (time)
      - is_closed (boolean)

    - services
      - id (uuid)
      - business_id (uuid, references businesses)
      - name (text)
      - description (text)
      - price (numeric)
      - duration (interval)
      - max_capacity (int)
      - created_at (timestamp)
      - updated_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for business owners
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  website text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (id)
);

-- Create businesses table
CREATE TABLE businesses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  logo_url text,
  website text,
  phone text,
  email text,
  address text,
  city text,
  postal_code text,
  country text DEFAULT 'Iceland',
  latitude double precision,
  longitude double precision,
  category text NOT NULL,
  subcategory text,
  status text DEFAULT 'draft',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create business_hours table
CREATE TABLE business_hours (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  day_of_week smallint NOT NULL,
  open_time time without time zone,
  close_time time without time zone,
  is_closed boolean DEFAULT false,
  UNIQUE(business_id, day_of_week)
);

-- Create services table
CREATE TABLE services (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  duration interval NOT NULL,
  max_capacity integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Businesses policies
CREATE POLICY "Businesses are viewable by everyone"
  ON businesses FOR SELECT
  USING (true);

CREATE POLICY "Business owners can insert their business"
  ON businesses FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Business owners can update their business"
  ON businesses FOR UPDATE
  USING (auth.uid() = owner_id);

-- Business hours policies
CREATE POLICY "Business hours are viewable by everyone"
  ON business_hours FOR SELECT
  USING (true);

CREATE POLICY "Business owners can manage their business hours"
  ON business_hours FOR ALL
  USING (
    auth.uid() IN (
      SELECT owner_id FROM businesses WHERE id = business_id
    )
  );

-- Services policies
CREATE POLICY "Services are viewable by everyone"
  ON services FOR SELECT
  USING (true);

CREATE POLICY "Business owners can manage their services"
  ON services FOR ALL
  USING (
    auth.uid() IN (
      SELECT owner_id FROM businesses WHERE id = business_id
    )
  );

-- Create indexes for better performance
CREATE INDEX businesses_owner_id_idx ON businesses(owner_id);
CREATE INDEX businesses_category_idx ON businesses(category);
CREATE INDEX businesses_status_idx ON businesses(status);
CREATE INDEX services_business_id_idx ON services(business_id);
CREATE INDEX business_hours_business_id_idx ON business_hours(business_id);