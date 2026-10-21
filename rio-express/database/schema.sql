-- ====================================================================
-- RIOEXPRESS SUPABASE POSTGRESQL DATABASE SCHEMA & SECURITY RULES
-- Developed & Powered by: Bataan Creation
-- Developer & Owner: Reynold P. Rio (09365810610 / bataancreation@gmail.com)
-- ====================================================================

-- 1. USERS & PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone_number TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('CUSTOMER', 'RIDER', 'MERCHANT', 'SUPER_ADMIN')),
  kyc_status TEXT DEFAULT 'PENDING' CHECK (kyc_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
  kyc_id_url TEXT,
  kyc_selfie_url TEXT,
  unpaid_balance DECIMAL(10,2) DEFAULT 0.00,
  is_banned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.profiles(id),
  rider_id UUID REFERENCES public.profiles(id),
  pickup_address TEXT NOT NULL,
  dropoff_address TEXT NOT NULL,
  dropoff_barangay TEXT NOT NULL,
  item_cost DECIMAL(10,2) DEFAULT 0.00,
  delivery_fee DECIMAL(10,2) DEFAULT 0.00,
  total_amount DECIMAL(10,2) DEFAULT 0.00,
  required_downpayment DECIMAL(10,2) DEFAULT 0.00,
  payment_status TEXT DEFAULT 'PENDING_DOWNPAYMENT',
  order_status TEXT DEFAULT 'PENDING',
  delivery_otp VARCHAR(4) NOT NULL,
  proof_store_url TEXT,
  proof_receipt_url TEXT,
  proof_dropoff_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. MERCHANT MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES public.profiles(id),
  item_name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category TEXT DEFAULT 'General',
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- DEFAULT ACCESS POLICIES
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Orders are viewable by owner or rider." ON public.orders FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = rider_id);