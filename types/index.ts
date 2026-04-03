// User types
export interface User {
  id: string
  email: string
  name: string
  role: 'subscriber' | 'admin'
  subscription_status: 'active' | 'cancelled' | 'expired'
  subscription_plan: 'monthly' | 'yearly' | null
  subscription_renewal_date: string | null
  stripe_customer_id: string | null
  charity_id: string | null
  charity_contribution_percent: number
  created_at: string
}

// Score types
export interface Score {
  id: string
  user_id: string
  score: number // 1-45
  date_played: string
  created_at: string
}

// Charity types
export interface Charity {
  id: string
  name: string
  description: string
  image_url: string
  category: 'Water' | 'Education' | 'Health' | 'Reforestation'
  is_featured: boolean
  upcoming_events: Array<{
    id: string
    name: string
    date: string
    location: string
  }>
  created_at: string
}

// Draw types
export enum DrawType {
  Random = 'random',
  Algorithmic = 'algorithmic',
}

export enum DrawStatus {
  Draft = 'draft',
  Simulated = 'simulated',
  Published = 'published',
}

export interface Draw {
  id: string
  month: number
  year: number
  draw_type: DrawType
  status: DrawStatus
  winning_numbers: number[] // 5 numbers between 1-45
  jackpot_rollover: boolean
  created_at: string
}

// Draw Entry types
export interface DrawEntry {
  id: string
  draw_id: string
  user_id: string
  scores_snapshot: number[] // 5 scores
  match_tier: 3 | 4 | 5 | null
}

// Prize types
export interface Prize {
  id: string
  draw_id: string
  match_tier: 3 | 4 | 5
  pool_amount: number
  winner_count: number
  per_winner_amount: number
}

// Winner types
export enum VerificationStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export enum PaymentStatus {
  Pending = 'pending',
  Paid = 'paid',
}

export interface Winner {
  id: string
  draw_id: string
  user_id: string
  match_tier: 3 | 4 | 5
  prize_amount: number
  proof_url: string | null
  verification_status: VerificationStatus
  payment_status: PaymentStatus
  created_at: string
}

// Subscription types
export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id: string
  plan: 'monthly' | 'yearly'
  status: 'active' | 'cancelled' | 'expired'
  amount: number
  created_at: string
}

// Stripe types
export interface PriceConfig {
  monthlyPriceId: string
  yearlyPriceId: string
  monthlyAmount: number // in cents
  yearlyAmount: number // in cents
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}
