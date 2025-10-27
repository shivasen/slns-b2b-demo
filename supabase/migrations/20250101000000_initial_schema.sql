/*
          # [Initial Schema Setup for SLNS B2B Platform]
          This migration script sets up the foundational database structure for the SLNS application. It includes tables for user profiles, product catalog, and order management. It also establishes security rules (RLS) and automations (triggers) for a secure and efficient backend.

          ## Query Description: This script is safe to run on a new project. It creates new tables and does not modify or delete existing data. It establishes the core architecture for the application.
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Tables Created: `profiles`, `products`, `orders`, `order_items`
          - Triggers Created: `on_auth_user_created` to handle new profile creation.
          - RLS Policies: Enabled and configured for all new tables.
          
          ## Security Implications:
          - RLS Status: Enabled on all tables.
          - Policy Changes: Yes, new policies are created to restrict data access.
          - Auth Requirements: Policies are based on `auth.uid()`, linking data to authenticated users.
          
          ## Performance Impact:
          - Indexes: Primary keys and foreign keys are indexed by default.
          - Triggers: A single trigger on user creation, with minimal performance impact.
          - Estimated Impact: Low.
          */

-- 1. PROFILES TABLE
-- Stores B2B-specific user data, extending the auth.users table.
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT,
    business_type TEXT,
    gstin TEXT,
    status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'approved', 'rejected'
    is_admin BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'Stores B2B user profile information.';
COMMENT ON COLUMN public.profiles.status IS 'Approval status of the retailer account.';

-- 2. PRODUCTS TABLE
-- Stores the product catalog information.
CREATE TABLE public.products (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    moq INTEGER NOT NULL,
    stock INTEGER NOT NULL,
    image TEXT,
    fabric TEXT,
    color TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.products IS 'Contains all product information for the catalog.';

-- 3. ORDERS TABLE
-- Stores high-level order information.
CREATE TABLE public.orders (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.orders IS 'Represents a customer order.';

-- 4. ORDER_ITEMS TABLE
-- Stores individual items within an order.
CREATE TABLE public.order_items (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    order_id BIGINT REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id BIGINT REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price_at_purchase NUMERIC(10, 2) NOT NULL
);

COMMENT ON TABLE public.order_items IS 'Stores line items for each order.';

-- 5. TRIGGER FOR NEW USER PROFILE CREATION
-- This function is called by a trigger when a new user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, company_name, business_type, gstin)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'company_name',
    NEW.raw_user_meta_data->>'business_type',
    NEW.raw_user_meta_data->>'gstin'
  );
  RETURN NEW;
END;
$$;

-- The trigger that executes the function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. RLS POLICIES
-- Enable RLS for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- PROFILES RLS
CREATE POLICY "Users can view their own profile."
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles."
ON public.profiles FOR ALL
USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = TRUE
);

-- PRODUCTS RLS
CREATE POLICY "All authenticated users can view products."
ON public.products FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage products."
ON public.products FOR ALL
USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = TRUE
);

-- ORDERS RLS
CREATE POLICY "Users can view their own orders."
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders for themselves."
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all orders."
ON public.orders FOR ALL
USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = TRUE
);

-- ORDER_ITEMS RLS
CREATE POLICY "Users can view items in their own orders."
ON public.order_items FOR SELECT
USING (
  (SELECT user_id FROM public.orders WHERE id = order_id) = auth.uid()
);

CREATE POLICY "Users can insert items into their own new orders."
ON public.order_items FOR INSERT
WITH CHECK (
  (SELECT user_id FROM public.orders WHERE id = order_id) = auth.uid()
);

CREATE POLICY "Admins can manage all order items."
ON public.order_items FOR ALL
USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = TRUE
);

-- 7. SEED INITIAL DATA (PRODUCTS)
-- Insert mock products into the new products table.
INSERT INTO public.products (name, category, price, moq, stock, image, fabric, color, tags)
VALUES
  ('Kanjivaram Silk Saree - Royal Blue', 'Sarees', 1250.00, 6, 120, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600', 'Pure Kanjivaram Silk', 'Royal Blue with Gold Border', '{"new", "bestseller"}'),
  ('Designer Churidar Set - Pink', 'Churidars', 850.00, 12, 200, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600', 'Cotton with Embroidery', 'Pink', '{"bestseller"}'),
  ('Half Saree - Traditional Green', 'Half Sarees', 950.00, 6, 80, 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600', 'Silk Blend', 'Green with Gold', '{"new"}'),
  ('Pavadai Davani - Red & Gold', 'Pavadai Davani', 1100.00, 6, 60, 'https://images.unsplash.com/photo-1610030469964-76c16dd5e5b9?w=600', 'Pure Silk', 'Red with Gold Zari', '{}'),
  ('Men''s Traditional Dhoti - White', 'Men''s Dhotis', 450.00, 12, 150, 'https://images.unsplash.com/photo-1622052509928-e6ca8bc0e1d6?w=600', 'Pure Cotton', 'White with Gold Border', '{"bestseller"}'),
  ('Kids'' Dhoti - Cream', 'Kids'' Dhotis', 350.00, 12, 100, 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600', 'Soft Cotton', 'Cream', '{}'),
  ('Banarasi Silk Saree - Maroon', 'Sarees', 1450.00, 6, 45, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600', 'Banarasi Silk', 'Maroon with Silver', '{"new", "exclusive"}'),
  ('Cotton Churidar - Yellow', 'Churidars', 650.00, 12, 180, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600', 'Premium Cotton', 'Yellow', '{}'),
  ('Georgette Saree - Navy Blue', 'Sarees', 750.00, 6, 90, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600', 'Pure Georgette', 'Navy Blue', '{"bestseller"}');
