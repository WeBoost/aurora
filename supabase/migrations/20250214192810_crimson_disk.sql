/*
  # Website Builder Schema

  1. New Tables
    - `websites`
      - `id` (uuid, primary key)
      - `business_id` (uuid, references businesses)
      - `template_id` (text)
      - `subdomain` (text)
      - `custom_domain` (text, nullable)
      - `status` (text)
      - `published_at` (timestamptz)
      - `theme` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `website_content`
      - `id` (uuid, primary key)
      - `business_id` (uuid, references businesses)
      - `type` (text)
      - `content` (jsonb)
      - `order` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for website management
*/

-- Create websites table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS websites (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
    template_id text NOT NULL,
    subdomain text UNIQUE NOT NULL,
    custom_domain text,
    status text DEFAULT 'draft',
    published_at timestamptz,
    theme jsonb DEFAULT '{
      "colors": {
        "primary": "#45B08C",
        "secondary": "#9B4F96",
        "accent": "#A1D6E2",
        "background": "#FFFFFF",
        "text": "#0F172A"
      },
      "fonts": {
        "heading": "Inter",
        "body": "Inter"
      }
    }'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create website_content table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS website_content (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
    type text NOT NULL,
    content jsonb DEFAULT '{}',
    "order" integer NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Enable RLS
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;

-- Create policies for websites if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'websites' 
    AND policyname = 'Websites are viewable by everyone'
  ) THEN
    CREATE POLICY "Websites are viewable by everyone"
      ON websites
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'websites' 
    AND policyname = 'Business owners can manage their website'
  ) THEN
    CREATE POLICY "Business owners can manage their website"
      ON websites
      FOR ALL
      USING (
        auth.uid() IN (
          SELECT owner_id FROM businesses WHERE id = business_id
        )
      );
  END IF;
END $$;

-- Create policies for website_content if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'website_content' 
    AND policyname = 'Website content is viewable by everyone'
  ) THEN
    CREATE POLICY "Website content is viewable by everyone"
      ON website_content
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'website_content' 
    AND policyname = 'Business owners can manage their website content'
  ) THEN
    CREATE POLICY "Business owners can manage their website content"
      ON website_content
      FOR ALL
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
    WHERE tablename = 'websites' 
    AND indexname = 'websites_business_id_idx'
  ) THEN
    CREATE INDEX websites_business_id_idx ON websites(business_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'websites' 
    AND indexname = 'websites_subdomain_idx'
  ) THEN
    CREATE INDEX websites_subdomain_idx ON websites(subdomain);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'website_content' 
    AND indexname = 'website_content_business_id_idx'
  ) THEN
    CREATE INDEX website_content_business_id_idx ON website_content(business_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'website_content' 
    AND indexname = 'website_content_order_idx'
  ) THEN
    CREATE INDEX website_content_order_idx ON website_content("order");
  END IF;
END $$;