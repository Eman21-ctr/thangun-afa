-- DIAGNOSTIC AND FIX FOR users_phone_key
-- This script will find if the phone column exists in public.users and clean it up

DO $$
DECLARE
    column_exists BOOLEAN;
    extracted_phone TEXT := '081353087786'; -- The number that crashed
BEGIN
    -- 1. Check if 'phone' column exists in public.users
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'phone'
    ) INTO column_exists;

    IF column_exists THEN
        -- 2. Clean up any existing records with this phone number
        -- This is the culprit if the email was different but phone was same
        EXECUTE 'DELETE FROM public.users WHERE phone = $1' USING extracted_phone;
        
        -- 3. Also delete from auth.users to be safe
        DELETE FROM auth.users WHERE phone = extracted_phone;
        
        RAISE NOTICE 'Ditemukan kolom phone di public.users dan sudah dibersihkan.';
    ELSE
        RAISE NOTICE 'Kolom phone TIDAK ditemukan di public.users. Cek auth.users.';
    END IF;
END $$;

-- 4. Re-check the constraints
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'public.users'::regclass;
