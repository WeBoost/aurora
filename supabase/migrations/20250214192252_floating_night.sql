/*
  # Business Hours Management

  1. New Tables
    - `business_hours`
      - `id` (uuid, primary key)
      - `business_id` (uuid, references businesses)
      - `day_of_week` (integer, 0-6)
      - `open_time` (time)
      - `close_time` (time)
      - `is_closed` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `business_special_hours`
      - `id` (uuid, primary key)
      - `business_id` (uuid, references businesses)
      - `date` (date)
      - `open_time` (time, nullable)
      - `close_time` (time, nullable)
      - `is_closed` (boolean)
      - `note` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for business owners to manage their hours
    - Allow public read access
*/

-- Create business_hours table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS business_hours (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
    day_of_week smallint NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    open_time time without time zone,
    close_time time without time zone,
    is_closed boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(business_id, day_of_week)
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create business_special_hours table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS business_special_hours (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
    date date NOT NULL,
    open_time time without time zone,
    close_time time without time zone,
    is_closed boolean DEFAULT false,
    note text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(business_id, date)
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Enable RLS
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_special_hours ENABLE ROW LEVEL SECURITY;

-- Create policies for business_hours if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'business_hours' 
    AND policyname = 'Business hours are viewable by everyone'
  ) THEN
    CREATE POLICY "Business hours are viewable by everyone"
      ON business_hours
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'business_hours' 
    AND policyname = 'Business owners can manage their business hours'
  ) THEN
    CREATE POLICY "Business owners can manage their business hours"
      ON business_hours
      USING (
        auth.uid() IN (
          SELECT owner_id FROM businesses WHERE id = business_id
        )
      );
  END IF;
END $$;

-- Create policies for business_special_hours if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'business_special_hours' 
    AND policyname = 'Special hours are viewable by everyone'
  ) THEN
    CREATE POLICY "Special hours are viewable by everyone"
      ON business_special_hours
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'business_special_hours' 
    AND policyname = 'Business owners can manage their special hours'
  ) THEN
    CREATE POLICY "Business owners can manage their special hours"
      ON business_special_hours
      USING (
        auth.uid() IN (
          SELECT owner_id FROM businesses WHERE id = business_id
        )
      );
  END IF;
END $$;

-- Create indexes if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'business_hours' 
    AND indexname = 'business_hours_business_id_idx'
  ) THEN
    CREATE INDEX business_hours_business_id_idx ON business_hours(business_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'business_special_hours' 
    AND indexname = 'business_special_hours_business_id_idx'
  ) THEN
    CREATE INDEX business_special_hours_business_id_idx ON business_special_hours(business_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'business_special_hours' 
    AND indexname = 'business_special_hours_date_idx'
  ) THEN
    CREATE INDEX business_special_hours_date_idx ON business_special_hours(date);
  END IF;
END $$;