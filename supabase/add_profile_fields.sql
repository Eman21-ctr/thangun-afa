-- SQL Migration: Add profile fields for farm information
-- Run this in your Supabase SQL Editor

-- Add land_area column (stores area like "500 m²" or "2 hektar")
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS land_area TEXT;

-- Add cultivated_commodities column (array of commodity names)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS cultivated_commodities TEXT[];

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('land_area', 'cultivated_commodities');
