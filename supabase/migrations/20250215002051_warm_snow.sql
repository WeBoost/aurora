/*
  # Add SEO Slugs and Location Support

  1. New Tables
    - `locations` - Stores location data for SEO
    - `service_locations` - Links services to locations
    - `seo_pages` - Stores generated SEO pages

  2. Changes
    - Add slug fields to services table
    - Add location fields to businesses table

  3. Security
    - Enable RLS on new tables
    - Add appropriate policies
*/

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  parent_id uuid REFERENCES locations(id),
  type text NOT NULL CHECK (type IN ('region', 'city', 'area')),
  latitude double precision,
  longitude double precision,
  population integer,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create service_locations table
CREATE TABLE IF NOT EXISTS service_locations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  location_id uuid REFERENCES locations(id) ON DELETE CASCADE,
  custom_title text,
  custom_description text,
  custom_content jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(service_id, location_id)
);

-- Create seo_pages table
CREATE TABLE IF NOT EXISTS seo_pages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  content jsonb,
  meta_tags jsonb,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  location_id uuid REFERENCES locations(id) ON DELETE CASCADE,
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add slug to services
ALTER TABLE services ADD COLUMN IF NOT EXISTS slug text UNIQUE;
CREATE INDEX IF NOT EXISTS services_slug_idx ON services(slug);

-- Add location fields to businesses
ALTER TABLE businesses 
  ADD COLUMN IF NOT EXISTS service_area jsonb,
  ADD COLUMN IF NOT EXISTS primary_location_id uuid REFERENCES locations(id);

-- Enable RLS
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_pages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Locations are viewable by everyone"
  ON locations FOR SELECT
  USING (true);

CREATE POLICY "Service locations are viewable by everyone"
  ON service_locations FOR SELECT
  USING (true);

CREATE POLICY "Business owners can manage their service locations"
  ON service_locations
  USING (
    auth.uid() IN (
      SELECT owner_id FROM businesses 
      WHERE id = (
        SELECT business_id FROM services 
        WHERE id = service_locations.service_id
      )
    )
  );

CREATE POLICY "SEO pages are viewable by everyone"
  ON seo_pages FOR SELECT
  USING (true);

CREATE POLICY "Business owners can manage their SEO pages"
  ON seo_pages
  USING (
    auth.uid() IN (
      SELECT owner_id FROM businesses WHERE id = business_id
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS locations_slug_idx ON locations(slug);
CREATE INDEX IF NOT EXISTS locations_type_idx ON locations(type);
CREATE INDEX IF NOT EXISTS service_locations_service_id_idx ON service_locations(service_id);
CREATE INDEX IF NOT EXISTS service_locations_location_id_idx ON service_locations(location_id);
CREATE INDEX IF NOT EXISTS seo_pages_slug_idx ON seo_pages(slug);
CREATE INDEX IF NOT EXISTS seo_pages_service_id_idx ON seo_pages(service_id);
CREATE INDEX IF NOT EXISTS seo_pages_location_id_idx ON seo_pages(location_id);
CREATE INDEX IF NOT EXISTS seo_pages_business_id_idx ON seo_pages(business_id);

-- Create function to generate slugs
CREATE OR REPLACE FUNCTION generate_service_location_slug(
  service_name text,
  location_name text
) RETURNS text AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        service_name || '-' || location_name,
        '[^a-zA-Z0-9\s-]',
        '',
        'g'
      ),
      '\s+',
      '-',
      'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to auto-generate SEO pages
CREATE OR REPLACE FUNCTION generate_seo_page() RETURNS trigger AS $$
BEGIN
  INSERT INTO seo_pages (
    slug,
    title,
    description,
    content,
    meta_tags,
    service_id,
    location_id,
    business_id
  )
  SELECT
    generate_service_location_slug(s.name, l.name),
    COALESCE(
      NEW.custom_title,
      s.name || ' in ' || l.name
    ),
    COALESCE(
      NEW.custom_description,
      'Find ' || s.name || ' in ' || l.name || '. Book online today!'
    ),
    COALESCE(
      NEW.custom_content,
      jsonb_build_object(
        'service', s.name,
        'location', l.name,
        'description', s.description,
        'price', s.price,
        'duration', s.duration
      )
    ),
    jsonb_build_object(
      'title', s.name || ' in ' || l.name,
      'description', 'Find ' || s.name || ' in ' || l.name || '. Book online today!',
      'keywords', s.name || ', ' || l.name || ', booking'
    ),
    NEW.service_id,
    NEW.location_id,
    (SELECT business_id FROM services WHERE id = NEW.service_id)
  FROM
    services s,
    locations l
  WHERE
    s.id = NEW.service_id
    AND l.id = NEW.location_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-generating SEO pages
CREATE TRIGGER generate_seo_page_trigger
  AFTER INSERT ON service_locations
  FOR EACH ROW
  EXECUTE FUNCTION generate_seo_page();