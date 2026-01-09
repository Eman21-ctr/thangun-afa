-- STANDARDIZED FIX FOR LOGIN (500 ERROR)
-- This version uses the User ID as Identity ID, which is the standard for Supabase primary email accounts.

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
    -- 1. Authorization check
    IF NOT EXISTS ( SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin' ) THEN
        RAISE EXCEPTION 'Unauthorized: Hanya super_admin yang bisa menambah anggota.';
    END IF;

    -- 2. Aggressive Cleanup
    DELETE FROM auth.identities WHERE identity_data->>'email' = target_email;
    DELETE FROM auth.users WHERE email = target_email;
    DELETE FROM public.users WHERE email = target_email;

    -- 3. Create user in auth.users
    INSERT INTO auth.users (
        instance_id, id, aud, role, email,
        encrypted_password, email_confirmed_at, last_sign_in_at,
        raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at, confirmation_token, email_change_token_new, recovery_token
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000', uuid_generate_v4(),
        'authenticated', 'authenticated', target_email,
        crypt(target_password, gen_salt('bf')), now(), now(),
        jsonb_build_object('provider', 'email', 'providers', array['email']),
        jsonb_build_object('full_name', target_full_name, 'role', target_role),
        now(), now(), '', '', ''
    )
    RETURNING id INTO new_user_id;

    -- 4. Create identity (Standard linking)
    -- Important: In many Supabase versions, identity id matches user id for primary email
    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    )
    VALUES (
        new_user_id, -- Identity ID matches User ID
        new_user_id,
        jsonb_build_object('sub', new_user_id, 'email', target_email, 'email_verified', true, 'phone_verified', false),
        'email',
        target_email,
        now(), now(), now()
    );

    -- 5. Finalize profile (Trigger handle_new_user handles initial insert)
    -- We update with extra fields like position
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
