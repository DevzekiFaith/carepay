-- Wallets Table
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
    balance DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    transaction_type TEXT CHECK (transaction_type IN ('credit', 'debit')) NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'success',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Payment Verifications Table
CREATE TABLE IF NOT EXISTS payment_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    sender_name TEXT NOT NULL,
    receipt_url TEXT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_verifications ENABLE ROW LEVEL SECURITY;

-- Wallets Policies
CREATE POLICY "Users can view their own wallet" ON wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own wallet" ON wallets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own wallet" ON wallets FOR UPDATE USING (auth.uid() = user_id);

-- Transactions Policies
CREATE POLICY "Users can view their own transactions" ON transactions FOR SELECT 
USING (wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert their own transactions" ON transactions FOR INSERT 
WITH CHECK (wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid()));

-- Payment Verifications Policies
CREATE POLICY "Users can view their own verifications" ON payment_verifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own verifications" ON payment_verifications FOR INSERT WITH CHECK (auth.uid() = user_id);
