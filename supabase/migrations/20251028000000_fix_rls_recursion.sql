/*
# [Fix] Resolve RLS Infinite Recursion

This migration redefines the `is_admin` function to prevent an infinite recursion loop caused by Row Level Security policies.

## Query Description:
This operation modifies a database function. It changes the function's security context and language to `plpgsql` to safely bypass RLS checks during its execution. This is a safe and standard way to resolve this specific Supabase issue and has no impact on existing data.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Function `is_admin` will be dropped and recreated.

## Security Implications:
- RLS Status: Unchanged
- Policy Changes: No
- Auth Requirements: This function relies on `auth.uid()` to identify the current user.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: Negligible. This is a performance *fix* for the recursion issue.
*/

-- Drop the existing function if it exists to avoid conflicts
DROP FUNCTION IF EXISTS is_admin();

-- Recreate the function using plpgsql and security definer to break recursion
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin_user boolean;
BEGIN
  -- We must use `auth.uid()` to get the current user's ID
  -- and check their role in the `profiles` table.
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ) INTO is_admin_user;
  
  RETURN is_admin_user;
END;
$$;

-- Grant execute permission to the authenticated role so RLS can use it
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
