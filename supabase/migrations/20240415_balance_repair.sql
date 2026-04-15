-- --- WALLET BALANCE REPAIR SCRIPT ---
-- This script recalculates your balance based on your transaction history.
-- Use this if your balance was accidentally reset to 0.

UPDATE public.wallets w
SET balance = (
    SELECT COALESCE(SUM(CASE WHEN transaction_type = 'credit' THEN amount ELSE -amount END), 0)
    FROM public.transactions t
    WHERE t.wallet_id = w.id
    AND t.status = 'success'
)
WHERE w.user_id = auth.uid(); -- Only repair the currently logged-in user's wallet

-- Verify the new balance
SELECT balance FROM public.wallets WHERE user_id = auth.uid();
