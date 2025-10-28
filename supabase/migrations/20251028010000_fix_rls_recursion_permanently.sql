/*
# [Function] Fix RLS Infinite Recursion

This migration replaces the `is_admin()` function with a more robust version to permanently fix the "infinite recursion" error.

## Query Description:
This operation redefines the `is_admin()` function. It uses `SECURITY DEFINER` which causes the function to execute with the permissions of the user that created it, rather than the user calling it. This is a standard and safe way to break RLS recursion loops, as it allows the function to check the user's role in the `profiles` table without re-triggering the RLS policy that called it. There is no risk to existing data.

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Function `is_admin()` will be replaced.

## Security Implications:
- RLS Status: Unchanged
- Policy Changes: No
- Auth Requirements: This function is used by RLS policies. The `SECURITY DEFINER` context is a standard security practice for this specific scenario.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: Negligible. This change fixes a performance-blocking error.
*/
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin_result boolean;
BEGIN
  SELECT (role = 'admin')
  INTO is_admin_result
  FROM public.profiles
  WHERE id = auth.uid();
  
  RETURN COALESCE(is_admin_result, false);
END;
$$;
