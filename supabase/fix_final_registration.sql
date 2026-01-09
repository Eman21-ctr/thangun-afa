-- FINAL CLEAN FIX FOR REGISTRATION
-- Removes 'is_superuser' and ensures duplicate phone/email cleanup

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
    extracted_phone TEXT;
BEGIN
    -- 1. Authorization check
    IF NOT EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'super_admin'
    ) THEN
        RAISE EXCEPTION 'Unauthorized: Hanya super_admin yang bisa menambah anggota.';
    END IF;

    -- 2. Extract potential phone number from virtual email
    IF target_email LIKE '%@thangun.afa' THEN
        extracted_phone := split_part(target_email, '@', 1);
    ELSE
        extracted_phone := NULL;
    END IF;

    -- 3. CLEANUP: Remove any existing users that might conflict
    DELETE FROM auth.users WHERE email = target_email;
    IF extracted_phone IS NOT NULL AND extracted_phone <> '' THEN
        DELETE FROM auth.users WHERE phone = extracted_phone;
    END IF;
    
    DELETE FROM public.users WHERE email = target_email;

    -- 4. Create user in auth.users (Removed is_superuser)
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        phone,
        encrypted_password,
        email_confirmed_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change_token_new,
        recovery_token
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000',
        uuid_generate_v4(),
        'authenticated',
        'authenticated',
        target_email,
        extracted_phone,
        crypt(target_password, gen_salt('bf')),
        now(),
        now(),
        '{"provider":"email","providers":["email"]}',
        jsonb_build_object('full_name', target_full_name, 'role', target_role),
        now(),
        now(),
        '',
        '',
        ''
    )
    RETURNING id INTO new_user_id;

    -- 5. Create identity
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
        jsonb_build_object('sub', new_user_id, 'email', target_email, 'email_verified', true),
        'email',
        new_user_id::text,
        now(),
        now(),
        now()
    );

    -- 6. Finalize profile in public.users
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
