// Centralized TypeScript interfaces for the entire Impact Golf platform.
// Matches the Supabase database schema defined in lib/database-schema.ts.

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'subscriber' | 'admin';
  subscription_status: 'active' | 'cancelled' | 'expired';
  subscription_plan: 'monthly' | 'yearly' | null;
  subscription_renewal_date: string | null;
  stripe_customer_id: string | null;
  charity_id: string | null;
  charity_contribution_percent: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  charity?: Charity | null;
  subscription?: Subscription | null;
}

export interface Score {
  id: string;
  user_id: string;
  score: number; // 1–45 Stableford
  date_played: string;
  created_at: string;
  updated_at: string;
}

export interface Charity {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  category: 'Water' | 'Education' | 'Health' | 'Reforestation';
  is_featured: boolean;
  upcoming_events: CharityEvent[];
  created_at: string;
  updated_at: string;
}

export interface CharityEvent {
  title: string;
  date: string;
  description: string;
}

export interface Draw {
  id: string;
  month: number;
  year: number;
  draw_type: 'random' | 'algorithmic';
  status: 'draft' | 'simulated' | 'published';
  winning_numbers: number[];
  jackpot_rollover: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  prizes?: Prize[];
  draw_entries?: DrawEntry[];
}

export interface DrawEntry {
  id: string;
  draw_id: string;
  user_id: string;
  scores_snapshot: number[];
  match_tier: 3 | 4 | 5 | null;
  created_at: string;
}

export interface Prize {
  id: string;
  draw_id: string;
  match_tier: 3 | 4 | 5;
  pool_amount: number;
  winner_count: number;
  per_winner_amount: number;
  created_at: string;
}

export interface Winner {
  id: string;
  draw_id: string;
  user_id: string;
  match_tier: 3 | 4 | 5;
  prize_amount: number;
  proof_url: string | null;
  verification_status: 'pending' | 'approved' | 'rejected';
  payment_status: 'pending' | 'paid';
  created_at: string;
  updated_at: string;
  // Joined
  user?: Pick<User, 'name' | 'email'>;
  draw?: Pick<Draw, 'month' | 'year'>;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string | null;
  plan: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired';
  amount: number;
  created_at: string;
  updated_at: string;
}

/** Prize pool distribution percentages per PRD §07 */
export const PRIZE_POOL_DISTRIBUTION = {
  5: 0.40, // 5-Number Match → 40%
  4: 0.35, // 4-Number Match → 35%
  3: 0.25, // 3-Number Match → 25%
} as const;

/** Subscription pricing */
export const PRICING = {
  monthly: 29,
  yearly: 249,
} as const;
