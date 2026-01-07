-- DIAGNOSTIC AND FIX SCRIPT
-- This script aims to fix the 500 error by being even more explicit with metadata

-- 1. Ensure extensions
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
    -- 1. Auth check
    IF NOT EXISTS ( SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin' ) THEN
        RAISE EXCEPTION 'Unauthorized: Hanya super_admin yang bisa menambah anggota.';
    END IF;

    -- 2. Cleanup
    DELETE FROM auth.users WHERE email = target_email;

    -- 3. Create user in auth.users
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
        '',
        '',
        '',
        '00000000-0000-0000-0000-000000000000'
    )
    RETURNING id INTO new_user_id;

    -- 4. Create identity
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
        uuid_generate_v4(), -- Identity ID is its own UUID
        new_user_id,
        jsonb_build_object('sub', new_user_id, 'email', target_email, 'email_verified', true, 'phone_verified', false),
        'email',
        new_user_id::text, -- often user_id is used as provider_id for email
        now(),
        now(),
        now()
    );

    -- 5. Public profile (ON CONFLICT handles triggers)
    -- This part is usually handled by the trigger in schema.sql, 
    -- but we update extra fields like role and position.
    INSERT INTO public.users (id, email, full_name, role, position)
    VALUES (new_user_id, target_email, target_full_name, target_role, target_position)
    ON CONFLICT (id) DO UPDATE 
    SET 
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        position = EXCLUDED.position;

    RETURN new_user_id;
END;
$$;

-- Izin
GRANT EXECUTE ON FUNCTION admin_create_member TO authenticated;
GRANT EXECUTE ON FUNCTION admin_create_member TO service_role;
