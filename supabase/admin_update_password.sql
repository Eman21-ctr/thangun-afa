-- RPC: ADMIN RESET PASSWORD
-- This function allows a super_admin to update another user's password in auth.users

CREATE OR REPLACE FUNCTION admin_update_password(
    target_user_id UUID,
    new_password TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
BEGIN
    -- 1. Authorization check (Only Super Admin)
    IF NOT EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'super_admin'
    ) THEN
        RAISE EXCEPTION 'Unauthorized: Hanya super_admin yang bisa meriset password.';
    END IF;

    -- 2. Update Auth User's encrypted password
    UPDATE auth.users
    SET 
        encrypted_password = crypt(new_password, gen_salt('bf')),
        updated_at = NOW()
    WHERE id = target_user_id;

    -- 3. Update public.users meta (optional but good for tracking)
    UPDATE public.users
    SET 
        last_password_change = NOW(),
        updated_at = NOW()
    WHERE id = target_user_id;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION admin_update_password TO authenticated;
GRANT EXECUTE ON FUNCTION admin_update_password TO service_role;
