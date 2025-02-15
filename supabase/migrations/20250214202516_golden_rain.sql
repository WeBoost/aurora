/*
  # Payment Integration Schema

  1. New Tables
    - `payment_accounts`
      - Stores Stripe Connect account info for businesses
    - `payments`
      - Tracks all payments and splits
    - `payment_methods`
      - Saved payment methods for customers

  2. Changes
    - Add payment fields to bookings table
    - Add Stripe account fields to businesses table

  3. Security
    - Enable RLS on all new tables
    - Add policies for secure access
*/

-- Add Stripe fields to businesses
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS stripe_account_id text;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS stripe_account_status text DEFAULT 'pending';

-- Create payment_accounts table
CREATE TABLE IF NOT EXISTS payment_accounts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  stripe_account_id text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  country text NOT NULL DEFAULT 'IS',
  currency text NOT NULL DEFAULT 'ISK',
  capabilities jsonb DEFAULT '{}',
  payouts_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  customer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  business_id uuid REFERENCES businesses(id) ON DELETE SET NULL,
  stripe_payment_intent_id text,
  amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'ISK',
  status text NOT NULL DEFAULT 'pending',
  business_amount integer NOT NULL, -- 95% of amount
  platform_amount integer NOT NULL, -- 5% of amount
  refunded boolean DEFAULT false,
  refund_reason text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_method_id text NOT NULL,
  type text NOT NULL,
  last4 text,
  exp_month integer,
  exp_year integer,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add payment fields to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_required boolean DEFAULT true;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_id uuid REFERENCES payments(id);

-- Enable RLS
ALTER TABLE payment_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Payment accounts viewable by business owners"
  ON payment_accounts
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT owner_id FROM businesses WHERE id = business_id
    )
  );

CREATE POLICY "Payment accounts manageable by business owners"
  ON payment_accounts
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT owner_id FROM businesses WHERE id = business_id
    )
  );

CREATE POLICY "Payments viewable by involved parties"
  ON payments
  FOR SELECT
  USING (
    auth.uid() = customer_id OR
    auth.uid() IN (
      SELECT owner_id FROM businesses WHERE id = business_id
    )
  );

CREATE POLICY "Payments insertable by system"
  ON payments
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Payment methods viewable by owner"
  ON payment_methods
  FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Payment methods manageable by owner"
  ON payment_methods
  FOR ALL
  USING (auth.uid() = customer_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS payments_booking_id_idx ON payments(booking_id);
CREATE INDEX IF NOT EXISTS payments_customer_id_idx ON payments(customer_id);
CREATE INDEX IF NOT EXISTS payments_business_id_idx ON payments(business_id);
CREATE INDEX IF NOT EXISTS payment_methods_customer_id_idx ON payment_methods(customer_id);