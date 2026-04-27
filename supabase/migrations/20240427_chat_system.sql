-- CHAT SYSTEM SCHEMA
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.service_requests(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view messages for requests they are part of
DROP POLICY IF EXISTS "Users can view messages for their own requests" ON public.messages;
CREATE POLICY "Users can view messages for their own requests" ON public.messages
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.service_requests
        WHERE id = messages.request_id
        AND (customer_id = auth.uid() OR assigned_worker_id = auth.uid())
    )
);

-- Policy: Users can insert messages for requests they are part of
DROP POLICY IF EXISTS "Users can insert messages for their own requests" ON public.messages;
CREATE POLICY "Users can insert messages for their own requests" ON public.messages
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.service_requests
        WHERE id = request_id
        AND (customer_id = auth.uid() OR assigned_worker_id = auth.uid())
    )
    AND auth.uid() = sender_id
);

-- Enable Realtime for the messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
