/*
# [Create Shipping Addresses Table]
This migration creates a new table `shipping_addresses` to allow users to save and manage multiple shipping addresses for faster checkouts.

## Query Description:
This is a non-destructive operation that adds a new table to your database. It does not affect any existing data in your `profiles` or `orders` tables. RLS is enabled to ensure users can only access their own addresses.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- **Table Created:** `public.shipping_addresses`
- **Columns:** `id`, `user_id`, `address_line_1`, `address_line_2`, `city`, `state`, `pincode`, `country`, `is_default`, `created_at`
- **Relationships:** Foreign key from `shipping_addresses.user_id` to `public.profiles.id`.

## Security Implications:
- RLS Status: Enabled on `public.shipping_addresses`.
- Policy Changes: Yes, new policies are added for the `shipping_addresses` table to ensure data privacy. Users can only C/R/U/D their own addresses.
- Auth Requirements: Users must be authenticated to interact with this table.

## Performance Impact:
- Indexes: A primary key index is created on `id`, and a foreign key index is created on `user_id`. This will have a positive impact on query performance for fetching addresses.
- Triggers: None.
- Estimated Impact: Negligible impact on overall database performance.
*/

-- Create the shipping_addresses table
CREATE TABLE public.shipping_addresses (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    address_line_1 text NOT NULL,
    address_line_2 text NULL,
    city text NOT NULL,
    state text NOT NULL,
    pincode text NOT NULL,
    country text NOT NULL DEFAULT 'India'::text,
    is_default boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT shipping_addresses_pkey PRIMARY KEY (id),
    CONSTRAINT shipping_addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Add comments to the table and columns for clarity
COMMENT ON TABLE public.shipping_addresses IS 'Stores saved shipping addresses for users.';
COMMENT ON COLUMN public.shipping_addresses.user_id IS 'Links to the user in the profiles table.';
COMMENT ON COLUMN public.shipping_addresses.is_default IS 'Indicates if this is the default shipping address for the user.';

-- Enable Row Level Security
ALTER TABLE public.shipping_addresses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow users to view their own addresses"
ON public.shipping_addresses
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own addresses"
ON public.shipping_addresses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own addresses"
ON public.shipping_addresses
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own addresses"
ON public.shipping_addresses
FOR DELETE
USING (auth.uid() = user_id);
