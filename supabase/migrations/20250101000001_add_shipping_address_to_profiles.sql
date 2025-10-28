/*
# [Operation Name]
Add Shipping Address to User Profiles

## Query Description: [This operation enhances the user profiles table by adding dedicated columns for storing a default shipping address. This change is non-destructive and will not affect existing user data. It allows the application to remember a user's address for a more streamlined checkout process in the future.]

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Table: public.profiles
- Columns Added:
  - shipping_address_line1 (TEXT)
  - shipping_city (TEXT)
  - shipping_state (TEXT)
  - shipping_pincode (TEXT)

## Security Implications:
- RLS Status: [Enabled]
- Policy Changes: [No]
- Auth Requirements: [Users can only update their own profile information. Existing RLS policies should cover this.]

## Performance Impact:
- Indexes: [None added]
- Triggers: [None added]
- Estimated Impact: [Negligible performance impact. The new columns are optional and will not slow down existing queries.]
*/
ALTER TABLE public.profiles
ADD COLUMN shipping_address_line1 TEXT,
ADD COLUMN shipping_city TEXT,
ADD COLUMN shipping_state TEXT,
ADD COLUMN shipping_pincode TEXT;
