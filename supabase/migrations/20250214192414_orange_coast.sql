/*
  # Booking Management System

  1. New Tables
    - `booking_rules`
      - Advance notice requirements
      - Cancellation policies
      - Capacity rules
    
    - `bookings`
      - Core booking information
      - Status tracking
      - Customer details
      - Payment status

  2. Security
    - Enable RLS
    - Business owners can manage their bookings
    - Customers can view their own bookings
*/

-- Create booking_rules table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS booking_rules (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
    min_advance_hours integer DEFAULT 24,
    max_advance_days integer DEFAULT 90,
    cancellation_hours integer DEFAULT 24,
    allow_instant_booking boolean DEFAULT true,
    require_payment boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(business_id)
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create bookings table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS bookings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
    service_id uuid REFERENCES services(id) ON DELETE SET NULL,
    customer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    booking_date date NOT NULL,
    start_time time NOT NULL,
    end_time time NOT NULL,
    status text NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    number_of_people integer DEFAULT 1,
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    customer_phone text,
    special_requests text,
    total_amount numeric(10,2) NOT NULL,
    payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Enable RLS
ALTER TABLE booking_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for booking_rules if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'booking_rules' 
    AND policyname = 'Booking rules are viewable by everyone'
  ) THEN
    CREATE POLICY "Booking rules are viewable by everyone"
      ON booking_rules
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'booking_rules' 
    AND policyname = 'Business owners can manage their booking rules'
  ) THEN
    CREATE POLICY "Business owners can manage their booking rules"
      ON booking_rules
      FOR ALL
      USING (
        auth.uid() IN (
          SELECT owner_id FROM businesses WHERE id = business_id
        )
      );
  END IF;
END $$;

-- Create policies for bookings if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookings' 
    AND policyname = 'Business owners can view their bookings'
  ) THEN
    CREATE POLICY "Business owners can view their bookings"
      ON bookings
      FOR SELECT
      USING (
        auth.uid() IN (
          SELECT owner_id FROM businesses WHERE id = business_id
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookings' 
    AND policyname = 'Customers can view their own bookings'
  ) THEN
    CREATE POLICY "Customers can view their own bookings"
      ON bookings
      FOR SELECT
      USING (
        auth.uid() = customer_id
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookings' 
    AND policyname = 'Business owners can manage bookings'
  ) THEN
    CREATE POLICY "Business owners can manage bookings"
      ON bookings
      FOR ALL
      USING (
        auth.uid() IN (
          SELECT owner_id FROM businesses WHERE id = business_id
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookings' 
    AND policyname = 'Customers can create bookings'
  ) THEN
    CREATE POLICY "Customers can create bookings"
      ON bookings
      FOR INSERT
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookings' 
    AND policyname = 'Customers can update their own bookings'
  ) THEN
    CREATE POLICY "Customers can update their own bookings"
      ON bookings
      FOR UPDATE
      USING (
        auth.uid() = customer_id AND
        status NOT IN ('completed', 'cancelled')
      );
  END IF;
END $$;

-- Create indexes if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'bookings' 
    AND indexname = 'bookings_business_id_idx'
  ) THEN
    CREATE INDEX bookings_business_id_idx ON bookings(business_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'bookings' 
    AND indexname = 'bookings_customer_id_idx'
  ) THEN
    CREATE INDEX bookings_customer_id_idx ON bookings(customer_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'bookings' 
    AND indexname = 'bookings_service_id_idx'
  ) THEN
    CREATE INDEX bookings_service_id_idx ON bookings(service_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'bookings' 
    AND indexname = 'bookings_date_idx'
  ) THEN
    CREATE INDEX bookings_date_idx ON bookings(booking_date);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'bookings' 
    AND indexname = 'bookings_status_idx'
  ) THEN
    CREATE INDEX bookings_status_idx ON bookings(status);
  END IF;
END $$;