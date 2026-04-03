# IMPACT GOLF - Deployment Guide

## Pre-Deployment Checklist

Before deploying to Vercel, ensure you have completed all these steps:

### 1. Environment Variables Setup

All environment variables must be configured in both `.env.local` (local development) and Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_MONTHLY_PRICE_ID=
STRIPE_YEARLY_PRICE_ID=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

### 2. Supabase Configuration

✅ Database schema created with 8 tables:
- `users` - User profiles and subscriptions
- `scores` - Golf scores for draws
- `charities` - Charity partners
- `draws` - Monthly draw events
- `draw_entries` - User entries for draws
- `prizes` - Prize tier definitions
- `winners` - Draw winners
- `subscriptions` - Stripe subscription tracking

✅ Row Level Security (RLS) policies enabled on all tables

✅ PostgreSQL trigger `maintain_rolling_scores()` deployed

### 3. Stripe Configuration

1. **Create Products in Stripe Dashboard:**
   - Monthly Plan: $29/month
   - Yearly Plan: $249/year

2. **Get Price IDs:**
   - Go to Product settings → Pricing
   - Copy the monthly and yearly price IDs to env variables

3. **Setup Webhook Endpoint:**
   - In Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Select events:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
   - Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 4. Resend Email Setup

1. **Create Resend Account:**
   - Visit https://resend.com
   - Create a new project
   - Get API key

2. **Domain Configuration (Optional but Recommended):**
   - Add custom domain for professional emails
   - Currently uses `noreply@impact-golf.io`

### 5. GitHub Repository Setup

```bash
git init
git add .
git commit -m "Initial IMPACT GOLF commit"
git remote add origin https://github.com/YOUR_USERNAME/impact-golf.git
git push -u origin main
```

## Deployment Steps to Vercel

### Option 1: Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import the GitHub repository
4. Configure project settings:
   - **Framework Preset:** Next.js
   - **Root Directory:** `.`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

5. Add Environment Variables:
   - Add all variables from `.env.local.example`
   - Ensure `NEXT_PUBLIC_APP_URL` is set to your production domain

6. Deploy by clicking "Deploy"

### Option 2: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

Then add environment variables:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
# ... add all other variables
```

## Post-Deployment Configuration

### 1. Update Stripe Webhook

After deploying, update the Stripe webhook endpoint to your production URL:
```
https://your-vercel-domain.vercel.app/api/webhooks/stripe
```

### 2. Test Payment Flow

1. Go to your production domain
2. Complete signup → payment flow
3. Check Stripe dashboard for subscription event
4. Verify email was sent via Resend

### 3. Admin Dashboard Access

- Admin route: `/admin`
- Admin pages require `role = 'admin'` in database
- To create first admin:

```sql
-- In Supabase SQL Editor
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### 4. Enable CORS (if needed)

If frontend and API are on different domains, add to `next.config.js`:

```javascript
const nextConfig = {
  headers: async () => {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NEXT_PUBLIC_APP_URL,
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

## Monitoring & Analytics

### 1. Vercel Analytics

- Dashboard automatically tracks Core Web Vitals
- Check Performance tab in Vercel dashboard

### 2. Supabase Monitoring

- Query performance in Supabase dashboard
- Check for slow queries and optimize indexes

### 3. Stripe Monitoring

- Dashboard shows all payment events
- Configure alerts for payment failures

## Troubleshooting

### Build Errors

If build fails, check:
1. All env variables are set correctly
2. No TypeScript errors: `npm run build` locally
3. Dependencies installed: `npm install`

### Payment Issues

If Stripe webhook isn't working:
1. Check webhook endpoint is accessible
2. Verify webhook secret matches Stripe dashboard
3. Check Stripe dashboard "Developers" → "Webhooks" for delivery logs

### Database Connection Issues

If queries fail:
1. Verify SUPABASE_SERVICE_ROLE_KEY is correct
2. Check RLS policies allow operations
3. Verify table names and columns match schema

## Rollback Plan

To rollback to previous deployment:

1. Vercel Dashboard → Deployments
2. Click on previous deployment
3. Click "Redeploy"

## Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **Resend Docs:** https://resend.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Docs:** https://vercel.com/docs

---

**Last Updated:** April 3, 2026
**Version:** 1.0.0
