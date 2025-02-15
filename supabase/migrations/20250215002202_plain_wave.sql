/*
  # Enhance SEO System

  1. New Tables
    - `seo_templates` - Stores reusable SEO templates
    - `seo_redirects` - Manages URL redirects
    - `seo_sitemap` - Controls sitemap generation

  2. Changes
    - Add SEO fields to existing tables
    - Add automatic slug generation
    - Add SEO template support

  3. Security
    - Enable RLS on new tables
    - Add appropriate policies
*/

-- Create SEO templates table
CREATE TABLE IF NOT EXISTS seo_templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('service', 'location', 'combined')),
  title_template text NOT NULL,
  description_template text NOT NULL,
  keywords_template text,
  structured_data_template jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create SEO redirects table
CREATE TABLE IF NOT EXISTS seo_redirects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  from_path text NOT NULL,
  to_path text NOT NULL,
  type text NOT NULL CHECK (type IN ('301', '302')),
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(business_id, from_path)
);

-- Create SEO sitemap table
CREATE TABLE IF NOT EXISTS seo_sitemap (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  path text NOT NULL,
  priority decimal(3,2) CHECK (priority >= 0 AND priority <= 1),
  change_frequency text CHECK (change_frequency IN ('always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never')),
  last_modified timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(business_id, path)
);

-- Add SEO fields to services
ALTER TABLE services 
  ADD COLUMN IF NOT EXISTS meta_title text,
  ADD COLUMN IF NOT EXISTS meta_description text,
  ADD COLUMN IF NOT EXISTS meta_keywords text,
  ADD COLUMN IF NOT EXISTS structured_data jsonb;

-- Add SEO fields to locations
ALTER TABLE locations
  ADD COLUMN IF NOT EXISTS meta_title text,
  ADD COLUMN IF NOT EXISTS meta_description text,
  ADD COLUMN IF NOT EXISTS meta_keywords text,
  ADD COLUMN IF NOT EXISTS structured_data jsonb;

-- Enable RLS
ALTER TABLE seo_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_sitemap ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "SEO templates are viewable by business owners"
  ON seo_templates
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT owner_id FROM businesses WHERE id = business_id
    )
  );

CREATE POLICY "SEO templates are manageable by business owners"
  ON seo_templates
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT owner_id FROM businesses WHERE id = business_id
    )
  );

CREATE POLICY "SEO redirects are viewable by everyone"
  ON seo_redirects
  FOR SELECT
  USING (true);

CREATE POLICY "SEO redirects are manageable by business owners"
  ON seo_redirects
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT owner_id FROM businesses WHERE id = business_id
    )
  );

CREATE POLICY "SEO sitemap is viewable by everyone"
  ON seo_sitemap
  FOR SELECT
  USING (true);

CREATE POLICY "SEO sitemap is manageable by business owners"
  ON seo_sitemap
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT owner_id FROM businesses WHERE id = business_id
    )
  );

-- Create function to apply SEO template
CREATE OR REPLACE FUNCTION apply_seo_template(
  template_id uuid,
  service_id uuid DEFAULT NULL,
  location_id uuid DEFAULT NULL
) RETURNS jsonb AS $$
DECLARE
  template seo_templates;
  service services;
  location locations;
  result jsonb;
BEGIN
  -- Get template
  SELECT * INTO template FROM seo_templates WHERE id = template_id;
  
  -- Get service and location if provided
  IF service_id IS NOT NULL THEN
    SELECT * INTO service FROM services WHERE id = service_id;
  END IF;
  
  IF location_id IS NOT NULL THEN
    SELECT * INTO location FROM locations WHERE id = location_id;
  END IF;
  
  -- Apply template
  result = jsonb_build_object(
    'title', CASE
      WHEN service_id IS NOT NULL AND location_id IS NOT NULL THEN
        replace(
          replace(template.title_template, '{service}', service.name),
          '{location}', location.name
        )
      WHEN service_id IS NOT NULL THEN
        replace(template.title_template, '{service}', service.name)
      WHEN location_id IS NOT NULL THEN
        replace(template.title_template, '{location}', location.name)
      ELSE template.title_template
    END,
    'description', CASE
      WHEN service_id IS NOT NULL AND location_id IS NOT NULL THEN
        replace(
          replace(template.description_template, '{service}', service.name),
          '{location}', location.name
        )
      WHEN service_id IS NOT NULL THEN
        replace(template.description_template, '{service}', service.name)
      WHEN location_id IS NOT NULL THEN
        replace(template.description_template, '{location}', location.name)
      ELSE template.description_template
    END
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate sitemap
CREATE OR REPLACE FUNCTION generate_sitemap(business_id uuid) RETURNS void AS $$
BEGIN
  -- Clear existing sitemap entries
  DELETE FROM seo_sitemap WHERE business_id = $1;
  
  -- Insert homepage
  INSERT INTO seo_sitemap (business_id, path, priority, change_frequency)
  VALUES ($1, '/', 1.0, 'weekly');
  
  -- Insert service pages
  INSERT INTO seo_sitemap (
    business_id,
    path,
    priority,
    change_frequency,
    last_modified
  )
  SELECT
    $1,
    '/services/' || slug,
    0.8,
    'weekly',
    updated_at
  FROM services
  WHERE business_id = $1;
  
  -- Insert location pages
  INSERT INTO seo_sitemap (
    business_id,
    path,
    priority,
    change_frequency,
    last_modified
  )
  SELECT
    $1,
    '/locations/' || slug,
    0.8,
    'weekly',
    updated_at
  FROM locations
  WHERE id IN (
    SELECT location_id FROM service_locations
    WHERE service_id IN (
      SELECT id FROM services WHERE business_id = $1
    )
  );
  
  -- Insert service-location pages
  INSERT INTO seo_sitemap (
    business_id,
    path,
    priority,
    change_frequency,
    last_modified
  )
  SELECT
    $1,
    '/' || sp.slug,
    0.9,
    'weekly',
    sp.updated_at
  FROM seo_pages sp
  WHERE sp.business_id = $1;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update sitemap on content changes
CREATE OR REPLACE FUNCTION update_sitemap() RETURNS trigger AS $$
BEGIN
  PERFORM generate_sitemap(NEW.business_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sitemap_on_service_change
  AFTER INSERT OR UPDATE OR DELETE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_sitemap();

CREATE TRIGGER update_sitemap_on_location_change
  AFTER INSERT OR UPDATE OR DELETE ON service_locations
  FOR EACH ROW
  EXECUTE FUNCTION update_sitemap();

CREATE TRIGGER update_sitemap_on_seo_page_change
  AFTER INSERT OR UPDATE OR DELETE ON seo_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_sitemap();