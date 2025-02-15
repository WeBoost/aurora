/*
  # Add services table if not exists

  1. New Tables
    - `services`
      - `id` (uuid, primary key)
      - `business_id` (uuid, foreign key to businesses)
      - `name` (text)
      - `description` (text, nullable)
      - `price` (numeric)
      - `duration` (interval)
      - `max_capacity` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `services` table if not already enabled
    - Add policies for:
      - Public read access
      - Business owners can manage their services
*/

-- Create services table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS services (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    duration interval NOT NULL,
    max_capacity integer DEFAULT 1,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'services' 
    AND policyname = 'Services are viewable by everyone'
  ) THEN
    CREATE POLICY "Services are viewable by everyone"
      ON services FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'services' 
    AND policyname = 'Business owners can manage their services'
  ) THEN
    CREATE POLICY "Business owners can manage their services"
      ON services FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM businesses
          WHERE id = services.business_id
          AND owner_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Create index if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'services' 
    AND indexname = 'services_business_id_idx'
  ) THEN
    CREATE INDEX services_business_id_idx ON services(business_id);
  END IF;
END $$;