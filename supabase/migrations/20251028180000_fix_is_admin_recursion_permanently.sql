/*
# [Function] Redefine is_admin to Prevent Recursion
[This function checks if the currently authenticated user has the 'admin' role. It is being redefined with SECURITY DEFINER to prevent an infinite recursion loop that occurs when it's called from within a Row Level Security (RLS) policy that itself depends on this function. This is a critical fix for a recurring database error.]

## Query Description: [This operation redefines the is_admin() function. It is a safe, non-destructive change designed to fix a critical bug where database queries fail due to an infinite loop in security policies. It does not alter any user data.]

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Function: public.is_admin()

## Security Implications:
- RLS Status: [Affected] - This change fixes broken RLS policies.
- Policy Changes: [No]
- Auth Requirements: [Any authenticated user]

## Performance Impact:
- Indexes: [N/A]
- Triggers: [N/A]
- Estimated Impact: [Positive. Fixes an infinite loop, allowing queries to complete successfully and quickly.]
*/
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
-- SECURITY DEFINER is the key to this fix. It makes the function run with the permissions
-- of the user who created it, bypassing the RLS policy of the user calling it.
-- This breaks the infinite recursion loop.
SECURITY DEFINER
-- SET search_path is a security best practice for SECURITY DEFINER functions.
SET search_path = public
AS $$
BEGIN
  -- Service roles are always admins.
  IF auth.role() = 'service_role' THEN
    RETURN true;
  END IF;
  -- Check the profiles table for the user's role.
  -- This query will not re-trigger RLS because of SECURITY DEFINER.
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;
