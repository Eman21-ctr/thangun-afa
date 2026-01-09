-- SQL FIX: FUNCTION FOR DELETING MEMBERS
-- This function deletes both the auth and public records for a user

CREATE OR REPLACE FUNCTION admin_delete_user(target_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
BEGIN
    -- 1. Authorization check (Only Super Admin)
    -- We use a direct check on the public.users table for safety
    IF NOT EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'super_admin'
    ) THEN
        RAISE EXCEPTION 'Unauthorized: Hanya super_admin yang bisa menghapus anggota.';
    END IF;

    -- 2. Delete Identities first
    DELETE FROM auth.identities WHERE user_id = target_user_id;
    
    -- 3. Delete Auth User (Cascades to public.users if FK is set to CASCADE)
    DELETE FROM auth.users WHERE id = target_user_id;
    
    -- 4. Just in case cascade didn't catch it or wasn't set up
    DELETE FROM public.users WHERE id = target_user_id;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION admin_delete_user TO authenticated;
GRANT EXECUTE ON FUNCTION admin_delete_user TO service_role;
