/*
          # [Operation Name]
          Fix RLS Infinite Recursion

          ## Query Description: This migration fixes an infinite recursion bug in the database's Row Level Security (RLS) policies. The `is_admin()` helper function was defined in a way that caused it to be called recursively when checking policies on the `profiles` table.

          This change redefines the function to use `plpgsql`, which prevents its internal logic from re-triggering the same RLS policies, thus breaking the loop. This is a critical security and stability fix.

          ## Metadata:
          - Schema-Category: ["Safe"]
          - Impact-Level: ["Low"]
          - Requires-Backup: false
          - Reversible: true

          ## Structure Details:
          - Modifies the function `public.is_admin()`

          ## Security Implications:
          - RLS Status: [No Change]
          - Policy Changes: [No]
          - Auth Requirements: [None]

          ## Performance Impact:
          - Indexes: [None]
          - Triggers: [None]
          - Estimated Impact: [Positive, as it resolves an infinite loop]
          */

-- Drop the old function to ensure a clean replacement
drop function if exists public.is_admin();

-- Recreate the function using plpgsql to prevent inlining and break the recursive loop
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
-- Set a secure search path as a security best practice for SECURITY DEFINER functions
set search_path = public
stable
as $$
begin
  return exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$;
