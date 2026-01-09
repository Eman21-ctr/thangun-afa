-- DIAGNOSTIC SCRIPT
-- Run this to see if the user and identity were created correctly

-- 1. Check the user record
SELECT id, email, phone, confirmed_at, last_sign_in_at, recovery_sent_at, raw_app_meta_data, raw_user_meta_data
FROM auth.users
WHERE email LIKE '%@thangun.afa' OR email = 'email_yang_bermasalah@anda.com'
LIMIT 5;

-- 2. Check the identity record (This is often where 500 errors happen)
SELECT id, user_id, identity_data, provider, provider_id, last_sign_in_at
FROM auth.identities
WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@thangun.afa')
LIMIT 5;

-- 3. Check for any missing columns or schema changes
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'auth' AND table_name IN ('users', 'identities')
ORDER BY table_name, column_name;
