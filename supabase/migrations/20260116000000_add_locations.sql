/*
  # Add Locations Table and Link to Menu Items

  1. New Tables
    - `locations`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `address` (text, optional)
      - `active` (boolean, default true)
      - `sort_order` (integer, default 0)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Changes to Existing Tables
    - Add `location_id` foreign key to `menu_items` table

  3. Security
    - Enable RLS on `locations` table
    - Add policies for public read access and authenticated write access
*/

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  address text,
  active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to locations
CREATE POLICY "Allow public read access to locations"
  ON locations
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage locations
CREATE POLICY "Allow authenticated users to manage locations"
  ON locations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add location_id to menu_items
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS location_id uuid REFERENCES locations(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_menu_items_location_id ON menu_items(location_id);
