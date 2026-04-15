-- CORE SCHEMA SETUP FOR HOMECARE PLATFORM

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    subscription_tier TEXT DEFAULT 'basic' CHECK (subscription_tier IN ('basic', 'pro', 'elite')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. WALLETS TABLE
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    balance DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    transaction_type TEXT CHECK (transaction_type IN ('credit', 'debit')) NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'success' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. SERVICE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    service_type TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    preferred_time TIMESTAMPTZ,
    image_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    tier TEXT CHECK (tier IN ('basic', 'pro', 'elite')) NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. PAYMENT VERIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.payment_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    sender_name TEXT NOT NULL,
    receipt_url TEXT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- --- ROW LEVEL SECURITY (RLS) ---

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_verifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can view, only owner can update
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Wallets: Only owner can view/update
DROP POLICY IF EXISTS "Users can view their own wallet" ON public.wallets;
DROP POLICY IF EXISTS "Users can update their own wallet (via triggers/logic)" ON public.wallets;
DROP POLICY IF EXISTS "Users can insert their own wallet" ON public.wallets;
CREATE POLICY "Users can view their own wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own wallet (via triggers/logic)" ON public.wallets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own wallet" ON public.wallets FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Transactions: Only owner can view
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.transactions;
CREATE POLICY "Users can view their own transactions" ON public.transactions FOR SELECT 
USING (wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert their own transactions" ON public.transactions FOR INSERT 
WITH CHECK (wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid()));

-- Service Requests: Only owner can view/update
DROP POLICY IF EXISTS "Customers can view their own requests" ON public.service_requests;
DROP POLICY IF EXISTS "Customers can insert their own requests" ON public.service_requests;
CREATE POLICY "Customers can view their own requests" ON public.service_requests FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Customers can insert their own requests" ON public.service_requests FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Subscriptions: Only owner can view
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Payment Verifications: Only owner can view
DROP POLICY IF EXISTS "Users can view their own verifications" ON public.payment_verifications;
DROP POLICY IF EXISTS "Users can insert their own verifications" ON public.payment_verifications;
CREATE POLICY "Users can view their own verifications" ON public.payment_verifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own verifications" ON public.payment_verifications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- --- TRIGGERS ---

-- Trigger to create a profile and wallet automatically on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, subscription_tier)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'basic')
  ON CONFLICT (id) DO NOTHING;
  
  INSERT INTO public.wallets (user_id, balance)
  VALUES (new.id, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists before creating
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
