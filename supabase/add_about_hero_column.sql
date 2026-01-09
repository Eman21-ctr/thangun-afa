-- Add about_hero_image_url to site_settings
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_hero_image_url TEXT;
