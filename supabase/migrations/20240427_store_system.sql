-- STORE ORDERS TABLE
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

-- ENABLE RLS
ALTER TABLE public.store_orders ENABLE ROW LEVEL SECURITY;

-- POLICIES
DROP POLICY IF EXISTS "Public can insert orders" ON public.store_orders;
CREATE POLICY "Public can insert orders" ON public.store_orders 
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view their own orders" ON public.store_orders;
CREATE POLICY "Users can view their own orders" ON public.store_orders 
FOR SELECT USING (
    (auth.uid() = user_id) OR 
    (auth.uid() IS NULL) -- Allow anonymous tracking via specific queries
);
