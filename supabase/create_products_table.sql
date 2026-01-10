-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'siap_panen', -- 'siap_panen', 'masa_tanam'
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Select policy: Everyone can see products
CREATE POLICY "Allow public read-only access to products" 
ON public.products FOR SELECT 
USING (true);

-- All policy: Only super_admin can modify products
CREATE POLICY "Allow super_admin full access to products" 
ON public.products FOR ALL 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'super_admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'super_admin'
    )
);

-- Grant access
GRANT ALL ON public.products TO postgres;
GRANT ALL ON public.products TO anon;
GRANT ALL ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
