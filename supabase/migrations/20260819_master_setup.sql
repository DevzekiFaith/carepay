-- ==============================================================================
-- MASTER SUPABASE SETUP FOR CAREPAY / HOMECARE
-- Project: https://iqvizntilpgitzyxmgoa.supabase.co
-- Run this entire script in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    subscription_tier TEXT DEFAULT 'basic' CHECK (subscription_tier IN ('basic', 'pro', 'elite')),
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'worker', 'admin')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. WALLETS TABLE
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    balance DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    transaction_type TEXT CHECK (transaction_type IN ('credit', 'debit')) NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'success' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. SERVICE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    service_type TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    preferred_time TIMESTAMPTZ,
    image_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'new')),
    assigned_worker_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    tier TEXT CHECK (tier IN ('basic', 'pro', 'elite')) NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. PAYMENT VERIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.payment_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    sender_name TEXT NOT NULL,
    receipt_url TEXT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. STORE ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.store_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_ref TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    notes TEXT,
    items JSONB NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    delivery_fee DECIMAL(12, 2) NOT NULL,
    total DECIMAL(12, 2) NOT NULL,
    status TEXT DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'processing', 'shipped', 'delivered', 'cancelled')),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. PROFESSIONALS (WORKERS) TABLE
CREATE TABLE IF NOT EXISTS public.professionals (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    nin TEXT,
    primary_skill TEXT NOT NULL,
    experience_years INTEGER DEFAULT 0,
    areas TEXT[] DEFAULT '{}',
    bio TEXT,
    is_verified BOOLEAN DEFAULT false,
    ai_verified BOOLEAN DEFAULT false,
    ai_verification_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. CHAT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.service_requests(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Wallets Policies
DROP POLICY IF EXISTS "Users can view their own wallet" ON public.wallets;
DROP POLICY IF EXISTS "Users can update their own wallet" ON public.wallets;
DROP POLICY IF EXISTS "Users can insert their own wallet" ON public.wallets;
CREATE POLICY "Users can view their own wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Users can insert their own wallet" ON public.wallets FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own wallet" ON public.wallets FOR UPDATE USING (auth.uid() = user_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Transactions Policies
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.transactions;
CREATE POLICY "Users can view their own transactions" ON public.transactions FOR SELECT 
USING (wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid()) OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Users can insert their own transactions" ON public.transactions FOR INSERT 
WITH CHECK (wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid()) OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Service Requests Policies
DROP POLICY IF EXISTS "Anyone can view requests" ON public.service_requests;
DROP POLICY IF EXISTS "Anyone can insert requests" ON public.service_requests;
DROP POLICY IF EXISTS "Authorized users can update requests" ON public.service_requests;
CREATE POLICY "Anyone can view requests" ON public.service_requests FOR SELECT USING (true);
CREATE POLICY "Anyone can insert requests" ON public.service_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Authorized users can update requests" ON public.service_requests FOR UPDATE 
USING (auth.uid() = customer_id OR auth.uid() = assigned_worker_id OR assigned_worker_id IS NULL OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Subscriptions Policies
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Users can insert their own subscriptions" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Payment Verifications Policies
DROP POLICY IF EXISTS "Users can view their own verifications" ON public.payment_verifications;
DROP POLICY IF EXISTS "Users can insert their own verifications" ON public.payment_verifications;
DROP POLICY IF EXISTS "Admins can update verifications" ON public.payment_verifications;
CREATE POLICY "Users can view their own verifications" ON public.payment_verifications FOR SELECT USING (auth.uid() = user_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Users can insert their own verifications" ON public.payment_verifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update verifications" ON public.payment_verifications FOR UPDATE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Store Orders Policies
DROP POLICY IF EXISTS "Public can insert orders" ON public.store_orders;
DROP POLICY IF EXISTS "Users and Admins can view orders" ON public.store_orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.store_orders;
CREATE POLICY "Public can insert orders" ON public.store_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Users and Admins can view orders" ON public.store_orders FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Admins can update orders" ON public.store_orders FOR UPDATE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Professionals Policies
DROP POLICY IF EXISTS "Public can view professionals" ON public.professionals;
DROP POLICY IF EXISTS "Workers can insert their professional profile" ON public.professionals;
DROP POLICY IF EXISTS "Workers and Admins can update professional profile" ON public.professionals;
CREATE POLICY "Public can view professionals" ON public.professionals FOR SELECT USING (true);
CREATE POLICY "Workers can insert their professional profile" ON public.professionals FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Workers and Admins can update professional profile" ON public.professionals FOR UPDATE USING (auth.uid() = id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Messages Policies
DROP POLICY IF EXISTS "Users can view messages for their requests" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages for their requests" ON public.messages;
CREATE POLICY "Users can view messages for their requests" ON public.messages FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.service_requests
        WHERE id = messages.request_id
        AND (customer_id = auth.uid() OR assigned_worker_id = auth.uid())
    )
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "Users can insert messages for their requests" ON public.messages FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.service_requests
        WHERE id = request_id
        AND (customer_id = auth.uid() OR assigned_worker_id = auth.uid())
    )
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- ==============================================================================
-- AUTOMATIC PROFILE & WALLET CREATION TRIGGER
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role, subscription_tier)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', ''), 
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'customer'),
    'basic'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role;
  
  INSERT INTO public.wallets (user_id, balance)
  VALUES (new.id, 0.00)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- PERFORMANCE INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_store_orders_user_id ON public.store_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_store_orders_order_ref ON public.store_orders(order_ref);
CREATE INDEX IF NOT EXISTS idx_service_requests_customer_id ON public.service_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_assigned_worker_id ON public.service_requests(assigned_worker_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON public.wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_request_id ON public.messages(request_id);

-- ==============================================================================
-- REALTIME SUBSCRIPTIONS
-- ==============================================================================

DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.service_requests;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.wallets;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.store_orders;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END $$;

-- ==============================================================================
-- STORAGE SETUP (job-photos bucket for photos & receipts)
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public) 
VALUES ('job-photos', 'job-photos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access to Job Photos" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload to Job Photos" ON storage.objects;
DROP POLICY IF EXISTS "Public Update to Job Photos" ON storage.objects;

CREATE POLICY "Public Access to Job Photos" ON storage.objects FOR SELECT USING (bucket_id = 'job-photos');
CREATE POLICY "Public Upload to Job Photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'job-photos');
CREATE POLICY "Public Update to Job Photos" ON storage.objects FOR UPDATE USING (bucket_id = 'job-photos');
