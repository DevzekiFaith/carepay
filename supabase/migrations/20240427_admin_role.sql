-- ADD ROLE TO PROFILES
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer' 
CHECK (role IN ('customer', 'worker', 'admin'));

-- Set existing specific user as admin (optional, user can do this in SQL editor)
-- UPDATE public.profiles SET role = 'admin' WHERE id = '...';

-- Update RLS for store_orders to allow admins to view all
DROP POLICY IF EXISTS "Admins can view all orders" ON public.store_orders;
CREATE POLICY "Admins can view all orders" ON public.store_orders 
FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

DROP POLICY IF EXISTS "Admins can update orders" ON public.store_orders;
CREATE POLICY "Admins can update orders" ON public.store_orders 
FOR UPDATE USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Update RLS for service_requests to allow admins to view all
DROP POLICY IF EXISTS "Admins can view all requests" ON public.service_requests;
CREATE POLICY "Admins can view all requests" ON public.service_requests 
FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

DROP POLICY IF EXISTS "Admins can update requests" ON public.service_requests;
CREATE POLICY "Admins can update requests" ON public.service_requests 
FOR UPDATE USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
