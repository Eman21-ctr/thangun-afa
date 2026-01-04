-- SUPABASE SCHEMA FOR THANGUN AFA
-- Run this in your Supabase SQL Editor

-- 1. Create Tables
-- public.users table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('super_admin', 'member', 'advisor')),
  position TEXT,
  photo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_password_change TIMESTAMPTZ,
  deactivated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- expense_categories
CREATE TABLE IF NOT EXISTS public.expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- commodities
CREATE TABLE IF NOT EXISTS public.commodities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT, -- e.g. Sayuran Buah, Sayuran Daun
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT, -- For expenses
  commodity TEXT, -- For income
  description TEXT NOT NULL,
  quantity DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  unit_price DECIMAL NOT NULL,
  total_amount DECIMAL NOT NULL,
  buyer TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT chk_positive_quantity CHECK (quantity > 0),
  CONSTRAINT chk_positive_price CHECK (unit_price > 0),
  CONSTRAINT chk_positive_total CHECK (total_amount > 0),
  CONSTRAINT chk_total_calculation CHECK (total_amount = quantity * unit_price),
  CONSTRAINT chk_future_date CHECK (date <= CURRENT_DATE + INTERVAL '1 day')
);

-- news_articles
CREATE TABLE IF NOT EXISTS public.news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  thumbnail_url TEXT,
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- gallery_photos
CREATE TABLE IF NOT EXISTS public.gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_url TEXT NOT NULL,
  caption TEXT,
  uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Triggers for public.users sync
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'member')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if trigger exists before creating
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'sync_user_metadata') THEN
    CREATE TRIGGER sync_user_metadata
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
  END IF;
END $$;

-- Soft delete user cascade
CREATE OR REPLACE FUNCTION handle_user_deactivation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = false AND OLD.is_active = true THEN
    NEW.deactivated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'soft_delete_user_cascade') THEN
    CREATE TRIGGER soft_delete_user_cascade
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION handle_user_deactivation();
  END IF;
END $$;

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_tx_user_date_type ON transactions(user_id, date DESC, type);
CREATE INDEX IF NOT EXISTS idx_tx_type_category_date ON transactions(type, category, date DESC);
CREATE INDEX IF NOT EXISTS idx_news_published ON news_articles(published_at DESC) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_users_active ON users(role, is_active) WHERE is_active = true;

-- 4. RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commodities ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin'));

CREATE POLICY "Super admin can manage all users" ON public.users
  FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin'));

-- Transactions policies
CREATE POLICY "transactions_select_policy" ON transactions 
  FOR SELECT USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('super_admin', 'advisor')));

CREATE POLICY "transactions_insert_policy" ON transactions 
  FOR INSERT WITH CHECK (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin'));

CREATE POLICY "transactions_update_policy" ON transactions 
  FOR UPDATE USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin'));

CREATE POLICY "transactions_delete_policy" ON transactions 
  FOR DELETE USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin'));

-- Public data (read-only for all)
CREATE POLICY "Public can view active news" ON news_articles
  FOR SELECT USING (is_published = true OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin'));

CREATE POLICY "Public can view gallery" ON gallery_photos
  FOR SELECT USING (true);

-- 5. Seed Data
INSERT INTO expense_categories (name) VALUES 
  ('Bibit'), ('Pupuk'), ('Pestisida'), ('Alat Pertanian'), 
  ('Tenaga Kerja'), ('Transportasi'), ('Lainnya')
ON CONFLICT (name) DO NOTHING;

INSERT INTO commodities (name, category) VALUES 
  ('Tomat', 'Sayuran Buah'),
  ('Cabai Rawit', 'Sayuran Buah'),
  ('Cabai Merah', 'Sayuran Buah'),
  ('Terong', 'Sayuran Buah'),
  ('Timun', 'Sayuran Buah'),
  ('Kangkung', 'Sayuran Daun'),
  ('Bayam', 'Sayuran Daun'),
  ('Sawi', 'Sayuran Daun'),
  ('Selada', 'Sayuran Daun'),
  ('Wortel', 'Sayuran Umbi'),
  ('Kentang', 'Sayuran Umbi'),
  ('Bawang Merah', 'Sayuran Umbi'),
  ('Bawang Putih', 'Sayuran Umbi')
ON CONFLICT (name) DO NOTHING;
