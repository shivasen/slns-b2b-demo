/*
# [Function] Redefine is_admin to prevent recursion
[This function checks if the currently authenticated user has the 'admin' role.]

## Query Description: [This operation redefines the is_admin function to prevent a critical infinite recursion error caused by Row Level Security (RLS) policies. By using `SECURITY DEFINER`, the function's internal query will bypass the caller's RLS policies, safely breaking the loop. This is a low-risk, essential fix for application stability.]

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Function: public.is_admin()

## Security Implications:
- RLS Status: [N/A]
- Policy Changes: [No]
- Auth Requirements: [Uses auth.uid()]

## Performance Impact:
- Indexes: [N/A]
- Triggers: [N/A]
- Estimated Impact: [Positive. Fixes a critical performance bottleneck (infinite loop).]
*/
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
-- SET search_path = public, extensions; -- Recommended for security
set search_path = public
as $$
begin
  if auth.role() = 'authenticated' then
    return (
      select role = 'admin'
      from public.profiles
      where id = auth.uid()
    );
  else
    return false;
  end if;
end;
$$;
