// Database schema SQL to run in Supabase SQL editor
// This defines the complete database structure

const schema = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'subscriber' CHECK (role IN ('subscriber', 'admin')),
  subscription_status TEXT DEFAULT 'expired' CHECK (subscription_status IN ('active', 'cancelled', 'expired')),
  subscription_plan TEXT CHECK (subscription_plan IN ('monthly', 'yearly')),
  subscription_renewal_date TIMESTAMP,
  stripe_customer_id TEXT UNIQUE,
  charity_id UUID,
  charity_contribution_percent INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for subscription status lookups
CREATE INDEX idx_users_subscription_status ON users(subscription_status);
CREATE INDEX idx_users_charity_id ON users(charity_id);

-- Scores table
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 45),
  date_played DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_scores_user_id ON scores(user_id);
CREATE INDEX idx_scores_created_at ON scores(created_at DESC);

-- Charities table
CREATE TABLE charities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('Water', 'Education', 'Health', 'Reforestation')),
  is_featured BOOLEAN DEFAULT FALSE,
  upcoming_events JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_charities_category ON charities(category);
CREATE INDEX idx_charities_is_featured ON charities(is_featured);

-- Add foreign key constraint for users.charity_id
ALTER TABLE users
ADD CONSTRAINT fk_users_charity_id
FOREIGN KEY (charity_id) REFERENCES charities(id) ON DELETE SET NULL;

-- Draws table
CREATE TABLE draws (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  draw_type TEXT NOT NULL CHECK (draw_type IN ('random', 'algorithmic')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'simulated', 'published')),
  winning_numbers INTEGER[] NOT NULL,
  jackpot_rollover BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(month, year)
);

CREATE INDEX idx_draws_status ON draws(status);
CREATE INDEX idx_draws_year ON draws(year);

-- Draw entries table
CREATE TABLE draw_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_id UUID NOT NULL REFERENCES draws(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scores_snapshot INTEGER[] NOT NULL,
  match_tier INTEGER CHECK (match_tier IN (3, 4, 5)) OR match_tier IS NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_draw_entries_draw_id ON draw_entries(draw_id);
CREATE INDEX idx_draw_entries_user_id ON draw_entries(user_id);
CREATE INDEX idx_draw_entries_match_tier ON draw_entries(match_tier);

-- Prizes table
CREATE TABLE prizes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_id UUID NOT NULL REFERENCES draws(id) ON DELETE CASCADE,
  match_tier INTEGER NOT NULL CHECK (match_tier IN (3, 4, 5)),
  pool_amount NUMERIC NOT NULL,
  winner_count INTEGER NOT NULL,
  per_winner_amount NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_prizes_draw_id ON prizes(draw_id);

-- Winners table
CREATE TABLE winners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_id UUID NOT NULL REFERENCES draws(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  match_tier INTEGER NOT NULL CHECK (match_tier IN (3, 4, 5)),
  prize_amount NUMERIC NOT NULL,
  proof_url TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_winners_draw_id ON winners(draw_id);
CREATE INDEX idx_winners_user_id ON winners(user_id);
CREATE INDEX idx_winners_verification_status ON winners(verification_status);
CREATE INDEX idx_winners_payment_status ON winners(payment_status);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL CHECK (plan IN ('monthly', 'yearly')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  amount NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE draw_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE prizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view public charities" ON charities FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can view their own profile" ON users FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Admin can view all users" ON users FOR SELECT
  USING (
    (SELECT role FROM users WHERE id = auth.uid()::uuid) = 'admin'
  );

-- Scores policies
CREATE POLICY "Users can view their own scores" ON scores FOR SELECT
  USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can insert their own scores" ON scores FOR INSERT
  WITH CHECK (user_id = auth.uid()::uuid);

CREATE POLICY "Admin can view all scores" ON scores FOR SELECT
  USING (
    (SELECT role FROM users WHERE id = auth.uid()::uuid) = 'admin'
  );

-- Charities policies
CREATE POLICY "Everyone can view charities" ON charities FOR SELECT
  USING (true);

-- Draws policies
CREATE POLICY "Everyone can view published draws" ON draws FOR SELECT
  USING (status = 'published' OR (SELECT role FROM users WHERE id = auth.uid()::uuid) = 'admin');

-- Winners policies
CREATE POLICY "Users can view their own wins" ON winners FOR SELECT
  USING (user_id = auth.uid()::uuid);

CREATE POLICY "Admin can view all winners" ON winners FOR SELECT
  USING (
    (SELECT role FROM users WHERE id = auth.uid()::uuid) = 'admin'
  );

-- Subscriptions policies
CREATE POLICY "Users can view their own subscription" ON subscriptions FOR SELECT
  USING (user_id = auth.uid()::uuid);

CREATE POLICY "Admin can view all subscriptions" ON subscriptions FOR SELECT
  USING (
    (SELECT role FROM users WHERE id = auth.uid()::uuid) = 'admin'
  );

-- Trigger to maintain rolling 5 scores
CREATE OR REPLACE FUNCTION maintain_rolling_scores()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM scores
  WHERE user_id = NEW.user_id
  AND id NOT IN (
    SELECT id FROM scores
    WHERE user_id = NEW.user_id
    ORDER BY created_at DESC
    LIMIT 5
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_maintain_rolling_scores
AFTER INSERT ON scores
FOR EACH ROW
EXECUTE FUNCTION maintain_rolling_scores();
`;

export default schema;
