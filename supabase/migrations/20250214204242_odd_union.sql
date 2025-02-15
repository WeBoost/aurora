/*
  # Add commission rate to businesses

  1. Changes
    - Add commission_rate column to businesses table
    - Add package_type column to businesses table
    - Add check constraint for valid commission rates
    - Add trigger to update commission rate when package changes

  2. Security
    - Only allow business owners to update their package
*/

-- Add commission rate and package columns
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS commission_rate numeric(4,2) DEFAULT 5.0,
ADD COLUMN IF NOT EXISTS package_type text DEFAULT 'starter'
  CHECK (package_type IN ('starter', 'professional', 'enterprise'));

-- Add check constraint for valid commission rates
ALTER TABLE businesses
ADD CONSTRAINT valid_commission_rate 
  CHECK (commission_rate IN (1.0, 3.0, 5.0));

-- Create function to set commission rate based on package
CREATE OR REPLACE FUNCTION set_commission_rate()
RETURNS TRIGGER AS $$
BEGIN
  NEW.commission_rate := 
    CASE NEW.package_type
      WHEN 'starter' THEN 5.0
      WHEN 'professional' THEN 3.0
      WHEN 'enterprise' THEN 1.0
    END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set commission rate
CREATE TRIGGER set_commission_rate_trigger
  BEFORE INSERT OR UPDATE OF package_type
  ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION set_commission_rate();

-- Update payments table to use dynamic commission rate
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS commission_rate numeric(4,2);

-- Create function to calculate payment amounts
CREATE OR REPLACE FUNCTION calculate_payment_amounts()
RETURNS TRIGGER AS $$
BEGIN
  -- Get commission rate from business
  SELECT commission_rate INTO NEW.commission_rate
  FROM businesses
  WHERE id = NEW.business_id;

  -- Calculate amounts
  NEW.business_amount := NEW.amount * (1 - NEW.commission_rate / 100);
  NEW.platform_amount := NEW.amount * (NEW.commission_rate / 100);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically calculate payment amounts
CREATE TRIGGER calculate_payment_amounts_trigger
  BEFORE INSERT
  ON payments
  FOR EACH ROW
  EXECUTE FUNCTION calculate_payment_amounts();