# IMPACT GOLF - Full Stack Golf Charity Subscription Platform

## Project Overview

IMPACT GOLF is a comprehensive full-stack platform that combines golf score tracking, monthly prize draws, charitable giving, and subscription management. Users participate in monthly draws based on their golf scores, with the opportunity to win prizes while supporting their chosen charity.

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (JWT)
- **Payments:** Stripe (Subscriptions & Webhooks)
- **Email:** Resend (Notifications)
- **Storage:** Supabase Storage (Images, Proofs)
- **Deployment:** Vercel

## Project Structure

```
impact-golf/
├── app/
│   ├── page.tsx                 # Homepage
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles with design tokens
│   ├── auth/
│   │   ├── login/page.tsx       # Login page
│   │   └── signup/page.tsx      # Multi-step signup flow
│   ├── dashboard/page.tsx       # User dashboard
│   ├── charities/page.tsx       # Charity directory
│   ├── draws/page.tsx           # Draw results & history
│   ├── admin/                   # Admin dashboard (to be built)
│   └── api/
│       ├── auth/
│       │   ├── signup.ts        # Signup API
│       │   └── login.ts         # Login API
│       ├── payments/
│       │   └── checkout.ts      # Stripe checkout
│       ├── scores/route.ts      # Score CRUD operations
│       ├── charities/route.ts   # Charity management
│       ├── draws/route.ts       # Draw operations
│       ├── admin/
│       │   └── draws.ts         # Admin draw management
│       ├── user/
│       │   └── profile.ts       # User profile API
│       └── webhooks/
│           └── stripe.ts        # Stripe webhook handler
├── components/                  # Reusable components (to be built)
├── lib/
│   ├── supabase.ts             # Supabase client
│   ├── auth.ts                 # Auth utilities
│   ├── database-schema.ts       # Database schema SQL
├── types/
│   └── index.ts                # TypeScript types & interfaces
├── tailwind.config.ts          # Tailwind configuration with custom colors
├── .env.local.example          # Environment variables template
└── package.json

```

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm
- A Supabase account (https://supabase.com)
- A Stripe account (https://stripe.com)
- A Resend account for emails (https://resend.com)
- Vercel account for deployment (https://vercel.com)

### 2. Clone & Install

```bash
cd impact-golf
npm install
```

### 3. Supabase Setup

#### Create a new Supabase project:

1. Go to https://supabase.com and create a new project
2. Get your project credentials (URL and Anon Key)
3. Create a new .env.local file at the root of the project
4. Add the Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### Run the database schema:

1. Go to your Supabase dashboard
2. Open SQL Editor
3. Copy all the SQL from `lib/database-schema.ts`
4. Execute the schema in Supabase SQL editor
5. This will create all tables, indexes, triggers, and RLS policies

### 4. Stripe Setup

1. Go to https://stripe.com and log in
2. Create two products:
   - **Monthly Plan:** $29/month
   - **Yearly Plan:** $249/year
3. Get the Price IDs for each
4. Add to .env.local:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_MONTHLY_PRICE_ID=price_...
STRIPE_YEARLY_PRICE_ID=price_...
```

#### Setup Stripe Webhooks:

1. In Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Subscribe to events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

### 5. Resend Setup

1. Sign up at https://resend.com
2. Get your API key
3. Add to .env.local:

```
RESEND_API_KEY=re_...
```

### 6. Environment Variables

Create `.env.local` with all variables (copy from `.env.local.example`):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_MONTHLY_PRICE_ID=
STRIPE_YEARLY_PRICE_ID=

# Resend
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 7. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

## Completed Features

### ✅ Pages Built
- Homepage (hero, features, pricing, footer)
- Login page
- Multi-step signup flow (4 steps: identity, plan, charity, payment)
- User dashboard (subscription status, scores, charity selection)
- Charity directory with filtering
- (Additional pages for draws and admin dashboard to be completed)

### ✅ API Routes Implemented
- `/api/auth/signup` - User registration
- `/api/auth/login` - User authentication
- `/api/payments/checkout` - Stripe checkout session creation
- `/api/scores` - Score CRUD operations with rolling 5-score enforcement
- `/api/charities` - Charity listing and selection
- `/api/draws` - Draw management and entry creation
- `/api/admin/draws` - Admin draw operations
- `/api/user/profile` - User profile management
- `/api/webhooks/stripe` - Stripe webhook handler

### ✅ Design System
- Custom Tailwind configuration with brand colors
- Google Fonts integration (Manrope, Inter)
- Glass-morphism effects and neon glow utilities
- Responsive mobile-first design
- Custom colors: primary-container (#cafd00), surface (#0e0e0e), etc.

### ✅ Database
- Complete PostgreSQL schema in Supabase
- All tables: users, scores, charities, draws, draw_entries, prizes, winners, subscriptions
- Triggers for rolling 5-score maintenance
- Row Level Security (RLS) policies configured
- Indexes for performance optimization

### ✅ Authentication
- Email/password signup and login
- Supabase Auth integration
- Protected routes via authentication tokens
- User profile management

### ✅ Subscriptions & Stripe
- Monthly ($29) and Yearly ($249) plans
- Stripe Checkout integration
- Webhook handlers for subscription events
- Automatic subscription status updates

## Features Still to Complete

### 🔨 Pages to Build
- Admin Dashboard (users table, draws management, charities CRUD, winner verification, analytics)
- Draw Results page (winning numbers, prize breakdown, history)
- Winner verification flow
- Charity management pages

### 🔨 Features to Complete
- Email notifications (Resend integration for draw results, winner alerts)
- Winner matching algorithm (compare 5 scores against drawn numbers)
- Draw simulation and publishing
- Prize calculation and distribution logic
- File upload for winner proof (Supabase Storage)
- Analytics dashboard (charts, user metrics)
- Payment status tracking

### 🔨 Admin Functionality
- User management (view, edit, search)
- Draws: create, simulate, publish
- Charities: CRUD operations with image uploads
- Winner verification queue
- Payout tracking
- Growth analytics

## Key Implementation Details

### Rolling 5-Score Logic
- Automatically enforced via PostgreSQL trigger `maintain_rolling_scores()`
- On each score insert, keeps only the 5 most recent scores
- Older scores beyond 5 are automatically deleted

### Prize Pool Distribution
- 40% Jackpot (5-match, rolls over if unclaimed)
- 35% (4-match winners)
- 25% (3-match winners)
- Split equally among multiple winners per tier

### Draw Matching
- Each user's 5 scores matched against 5 drawn numbers
- Classification: 5-match, 4-match, 3-match, or no match
- Winning entry creation with match_tier stored

### Charity Contribution
- Minimum 10%, user-adjustable up to 100%
- Applied to winnings: user chooses percentage going to charity
- Tracked per user and updated in real-time

## Testing the Full Flow

1. **Sign Up:**
   - Go to `/signup`
   - Complete 4-step flow with email/password
   - Select monthly or yearly plan
   - Choose charity and contribution percentage
   - Complete Stripe payment

2. **Add Scores:**
   - Navigate to `/dashboard`
   - Enter golf scores (1-45) for 5 different dates
   - Watch rolling 5 score system maintain latest scores

3. **View Charities:**
   - Click "Charities" in header
   - Search and filter by category
   - Change selected charity from dashboard

4. **Manage Subscription:**
   - View subscription status in dashboard
   - Update charity contribution percentage
   - (Stripe customer portal for payment methods - to be added)

## Deployment to Vercel

1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Set environment variables in Vercel project settings
4. Deploy with `vercel deploy`

### Production Environment Variables:
- All .env.local variables must be set in Vercel
- Use production Stripe keys (not test keys)
- Ensure Stripe webhook endpoint points to production domain
- Set `NEXT_PUBLIC_APP_URL` to production domain

## Database Backup & Migration

### Backup Supabase data:
```bash
# Use Supabase CLI
supabase db pull  # Backup schema locally
supabase db dump  # Create SQL dump
```

### Restore on new Supabase project:
```bash
supabase db push  # Restore schema
```

## Useful Commands

```bash
# Development
npm run dev              # Start dev server

# Build
npm run build           # Build for production
npm run start           # Start production server

# Type checking
npx tsc --noEmit       # Check TypeScript errors

# Database
npm install -g supabase  # Install Supabase CLI
supabase login           # Login to Supabase
supabase db pull         # Pull schema from remote
```

## Common Issues & Troubleshooting

### Stripe webhook not working
- Ensure webhook secret is correct
- Check Stripe dashboard for event attempts
- Verify endpoint URL is publicly accessible
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### RLS policies blocking queries
- Check auth token is being passed correctly
- Verify user ID in token matches table
- Test in Supabase SQL editor with appropriate role

### Rolling scores not working
- Check PostgreSQL trigger exists in Supabase
- Verify trigger function syntax
- Monitor execution in Supabase logs

## File Size Notes

- This project uses minimal dependencies for fast performance
- Tailwind CSS is optimized with tree-shaking
- API routes are lightweight server-side functions
- Database queries are indexed for performance

## Next Steps

1. Test signup and login flows in development
2. Complete Stripe integration testing
3. Build admin dashboard pages
4. Implement winner matching algorithm
5. Set up Resend email templates
6. Create comprehensive test suite
7. Deploy to staging environment
8. Conduct full end-to-end testing
9. Deploy to production

## Support

For issues or questions:
1. Check Supabase documentation: https://supabase.com/docs
2. Check Stripe documentation: https://stripe.com/docs
3. Check Next.js documentation: https://nextjs.org/docs

---

**Project Status:** In Active Development
**Current Phase:** Core infrastructure and authentication complete, pages in progress
**Target Completion:** All features implemented and tested
