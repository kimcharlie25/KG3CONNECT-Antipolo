/*
  # Add Messenger URL to Locations

  Adds a `messenger_url` column to the `locations` table to store
  the Facebook Messenger Page URL for each branch/location.

  This enables location-based ordering where customers are redirected
  to the correct branch's Messenger when placing orders.
*/

-- Add messenger_url column to locations table
ALTER TABLE locations ADD COLUMN IF NOT EXISTS messenger_url text;

-- Add a comment for documentation
COMMENT ON COLUMN locations.messenger_url IS 'Facebook Messenger Page URL for this location (e.g., https://m.me/12345678)';
