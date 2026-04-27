-- PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_store_orders_user_id ON public.store_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_store_orders_order_ref ON public.store_orders(order_ref);
CREATE INDEX IF NOT EXISTS idx_service_requests_customer_id ON public.service_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ANALYZE
ANALYZE public.store_orders;
ANALYZE public.service_requests;
ANALYZE public.profiles;
