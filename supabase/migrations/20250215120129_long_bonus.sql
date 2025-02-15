/*
  # Website Deployment Schema

  1. New Tables
    - `deployments`
      - `id` (uuid, primary key)
      - `website_id` (uuid, references websites)
      - `status` (text)
      - `deploy_url` (text)
      - `error` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `deployment_logs`
      - `id` (uuid, primary key)
      - `deployment_id` (uuid, references deployments)
      - `message` (text)
      - `level` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for business owners
*/

-- Create deployments table
CREATE TABLE IF NOT EXISTS deployments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  website_id uuid REFERENCES websites(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('pending', 'building', 'deployed', 'failed')),
  deploy_url text,
  error text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create deployment_logs table
CREATE TABLE IF NOT EXISTS deployment_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  deployment_id uuid REFERENCES deployments(id) ON DELETE CASCADE,
  message text NOT NULL,
  level text NOT NULL CHECK (level IN ('info', 'warning', 'error')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployment_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for deployments
CREATE POLICY "Deployments are viewable by business owners"
  ON deployments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM websites w
      JOIN businesses b ON b.id = w.business_id
      WHERE w.id = deployments.website_id
      AND b.owner_id = auth.uid()
    )
  );

CREATE POLICY "Deployments are manageable by business owners"
  ON deployments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM websites w
      JOIN businesses b ON b.id = w.business_id
      WHERE w.id = deployments.website_id
      AND b.owner_id = auth.uid()
    )
  );

-- Create policies for deployment logs
CREATE POLICY "Deployment logs are viewable by business owners"
  ON deployment_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM deployments d
      JOIN websites w ON w.id = d.website_id
      JOIN businesses b ON b.id = w.business_id
      WHERE d.id = deployment_logs.deployment_id
      AND b.owner_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS deployments_website_id_idx ON deployments(website_id);
CREATE INDEX IF NOT EXISTS deployments_status_idx ON deployments(status);
CREATE INDEX IF NOT EXISTS deployment_logs_deployment_id_idx ON deployment_logs(deployment_id);

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_deployments_updated_at
  BEFORE UPDATE ON deployments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();