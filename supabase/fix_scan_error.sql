-- ULTIMATE FIX FOR "Scan error on column email_change"
-- This version ensures ALL token and change columns are initialized with '' instead of NULL

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
    -- 1. Authorization
    IF NOT EXISTS ( SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin' ) THEN
        RAISE EXCEPTION 'Unauthorized: Hanya super_admin yang bisa menambah anggota.';
    END IF;

    -- 2. Aggressive Cleanup
    DELETE FROM auth.identities WHERE identity_data->>'email' = target_email;
    DELETE FROM auth.users WHERE email = target_email;
    DELETE FROM public.users WHERE email = target_email;

    -- 3. Set User ID
    new_user_id := uuid_generate_v4();

    -- 4. Create User in auth.users
    -- We explicitly set empty strings for columns that cause Scan Errors when NULL
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_superuser,
        created_at,
        updated_at,
        -- MANDATORY NON-NULL STRINGS FOR GOTRUE SCANNING:
        confirmation_token,
        recovery_token,
        email_change_token_new,
        email_change,
        email_change_token_current,
        phone,
        phone_change,
        phone_change_token
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000',
        new_user_id,
        'authenticated',
        'authenticated',
        target_email,
        crypt(target_password, gen_salt('bf')),
        now(),
        now(),
        jsonb_build_object('provider', 'email', 'providers', array['email']),
        jsonb_build_object('full_name', target_full_name, 'role', target_role),
        false,
        now(),
        now(),
        '', -- confirmation_token
        '', -- recovery_token
        '', -- email_change_token_new
        '', -- email_change
        '', -- email_change_token_current
        '', -- phone
        '', -- phone_change
        ''  -- phone_change_token
    );

    -- 5. Create Identity
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
        new_user_id,
        new_user_id,
        jsonb_build_object('sub', new_user_id, 'email', target_email, 'email_verified', true, 'phone_verified', false),
        'email',
        target_email,
        now(),
        now(),
        now()
    );

    -- 6. Finalize public profile
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
