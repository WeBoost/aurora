-- Create SEO keywords table
CREATE TABLE IF NOT EXISTS seo_keywords (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  keyword text NOT NULL,
  type text NOT NULL CHECK (type IN ('primary', 'secondary', 'long-tail')),
  search_volume integer,
  difficulty integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(business_id, keyword)
);

-- Create SEO content variations table
CREATE TABLE IF NOT EXISTS seo_content_variations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id uuid REFERENCES seo_pages(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  content jsonb,
  meta_tags jsonb,
  language text DEFAULT 'en',
  is_active boolean DEFAULT false,
  performance_score numeric(3,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add performance tracking fields to seo_pages
ALTER TABLE seo_pages
  ADD COLUMN IF NOT EXISTS views integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS clicks integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS avg_time_on_page interval,
  ADD COLUMN IF NOT EXISTS bounce_rate numeric(5,2);

-- Create function to generate location-based variations
CREATE OR REPLACE FUNCTION generate_location_variations(
  page_id uuid,
  location_id uuid
) RETURNS void AS $$
DECLARE
  base_page seo_pages;
  location locations;
  nearby_locations CURSOR FOR
    SELECT l.*
    FROM locations l
    WHERE 
      l.id != location_id
      AND ST_DWithin(
        ST_MakePoint(l.longitude, l.latitude),
        ST_MakePoint(location.longitude, location.latitude),
        50000  -- 50km radius
      );
BEGIN
  -- Get base page and location
  SELECT * INTO base_page FROM seo_pages WHERE id = page_id;
  SELECT * INTO location FROM locations WHERE id = location_id;
  
  -- Generate variations for nearby locations
  FOR nearby IN nearby_locations LOOP
    INSERT INTO seo_content_variations (
      page_id,
      title,
      description,
      content,
      meta_tags
    )
    VALUES (
      page_id,
      replace(base_page.title, location.name, nearby.name),
      replace(base_page.description, location.name, nearby.name),
      jsonb_set(
        base_page.content,
        '{location}',
        to_jsonb(nearby.name)
      ),
      jsonb_set(
        base_page.meta_tags,
        '{location}',
        to_jsonb(nearby.name)
      )
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create function to track page performance
CREATE OR REPLACE FUNCTION track_page_view(
  page_id uuid,
  session_duration interval DEFAULT NULL,
  bounced boolean DEFAULT false
) RETURNS void AS $$
BEGIN
  UPDATE seo_pages
  SET
    views = views + 1,
    avg_time_on_page = CASE
      WHEN session_duration IS NOT NULL THEN
        (avg_time_on_page * views + session_duration) / (views + 1)
      ELSE avg_time_on_page
    END,
    bounce_rate = CASE
      WHEN bounced THEN
        ((bounce_rate * views) + 100) / (views + 1)
      ELSE
        (bounce_rate * views) / (views + 1)
    END
  WHERE id = page_id;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE seo_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_content_variations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "SEO keywords are viewable by business owners"
  ON seo_keywords
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT owner_id FROM businesses WHERE id = business_id
    )
  );

CREATE POLICY "SEO keywords are manageable by business owners"
  ON seo_keywords
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT owner_id FROM businesses WHERE id = business_id
    )
  );

CREATE POLICY "Content variations are viewable by everyone"
  ON seo_content_variations
  FOR SELECT
  USING (true);

CREATE POLICY "Content variations are manageable by business owners"
  ON seo_content_variations
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT owner_id FROM businesses 
      WHERE id = (
        SELECT business_id FROM seo_pages 
        WHERE id = seo_content_variations.page_id
      )
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS seo_keywords_business_id_idx ON seo_keywords(business_id);
CREATE INDEX IF NOT EXISTS seo_keywords_type_idx ON seo_keywords(type);
CREATE INDEX IF NOT EXISTS seo_content_variations_page_id_idx ON seo_content_variations(page_id);
CREATE INDEX IF NOT EXISTS seo_content_variations_language_idx ON seo_content_variations(language);