-- VERSI TERAKHIR (Fix email_change Scan Error)
-- Script ini memperbaiki error "converting NULL to string is unsupported" pada kolom email_change

-- 1. Ekstensi
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION admin_create_member(
    target_email TEXT,
    target_password TEXT,
    target_full_name TEXT,
    target_role TEXT,
    target_position TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public, auth, extensions
AS $$
DECLARE
    new_user_id UUID;
BEGIN
    -- 1. Otorisasi
    IF NOT EXISTS ( SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin' ) THEN
        RAISE EXCEPTION 'Unauthorized: Hanya super_admin yang bisa menambah anggota.';
    END IF;

    -- 2. Bersihkan jejak lama
    DELETE FROM auth.users WHERE email = target_email;

    -- 3. Insert ke auth.users
    -- Kita masukkan string kosong '' untuk kolom-kolom yang rawan error NULL
    INSERT INTO auth.users (
        id, 
        aud, 
        role, 
        email, 
        encrypted_password, 
        email_confirmed_at,
        raw_app_meta_data, 
        raw_user_meta_data, 
        created_at, 
        updated_at,
        confirmation_token, 
        recovery_token, 
        email_change_token_new,
        email_change, -- Kolom bermasalah
        email_change_token_current,
        phone,
        phone_change,
        phone_change_token,
        instance_id
    )
    VALUES (
        uuid_generate_v4(), 
        'authenticated', 
        'authenticated', 
        target_email,
        crypt(target_password, gen_salt('bf')), 
        now(),
        '{"provider":"email","providers":["email"]}',
        jsonb_build_object('full_name', target_full_name, 'role', target_role),
        now(), 
        now(), 
        '', -- confirmation_token
        '', -- recovery_token
        '', -- email_change_token_new
        '', -- email_change
        '', -- email_change_token_current
        '', -- phone
        '', -- phone_change
        '', -- phone_change_token
        '00000000-0000-0000-0000-000000000000'
    )
    RETURNING id INTO new_user_id;

    -- 4. Insert ke auth.identities
    INSERT INTO auth.identities (
        id, 
        user_id, 
        identity_data, 
        provider, 
        provider_id, 
        last_sign_in_at, 
        created_at, 
        updated_at
    )
    VALUES (
        uuid_generate_v4(), 
        new_user_id,
        jsonb_build_object('sub', new_user_id, 'email', target_email, 'email_verified', true),
        'email',
        new_user_id::text, 
        now(), now(), now()
    );

    -- 5. Profil publik
    INSERT INTO public.users (id, email, full_name, role, position)
    VALUES (new_user_id, target_email, target_full_name, target_role, target_position)
    ON CONFLICT (id) DO UPDATE 
    SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, position = EXCLUDED.position;

    RETURN new_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION admin_create_member TO authenticated;
GRANT EXECUTE ON FUNCTION admin_create_member TO service_role;
