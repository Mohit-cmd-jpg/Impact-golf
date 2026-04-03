// Next Steps & Completion Guide for IMPACT GOLF

## 🎯 Immediate Next Steps (Priority Order)

### 1. **Winner Matching Algorithm** (CRITICAL)
File: `/lib/draw-matching.ts`

```typescript
export function calculateMatches(userScores: number[], drawnNumbers: number[]) {
  const matches = userScores.filter(score => drawnNumbers.includes(score)).length;
  if (matches === 5) return { tier: 5, matched: 5 };
  if (matches === 4) return { tier: 4, matched: 4 };
  if (matches === 3) return { tier: 3, matched: 3 };
  return null;
}
```

### 2. **Admin Dashboard Pages**
File structure needed:
```
/app/admin/
  ├── page.tsx          # Dashboard overview
  ├── users/
  │   └── page.tsx      # User management table
  ├── draws/
  │   └── page.tsx      # Draw management
  ├── charities/
  │   └── page.tsx      # Charity CRUD
  └── winners/
      └── page.tsx      # Winner verification queue
```

### 3. **Email Notifications**
File: `/lib/email-service.ts`

Required templates:
- Welcome email
- Draw results email
- Winner announcement
- Subscription confirmation
- Payment receipt

### 4. **Database Seed Data**
File: `/lib/seed-data.ts`

Add sample charities and test data for development.

---

## 📋 Remaining API Routes to Complete

```
POST /api/admin/users              # Search, edit users
POST /api/admin/charities          # Manage charities
POST /api/admin/draws/publish      # Publish draw with winners
POST /api/admin/winners/verify     # Verify winner proofs
POST /api/admin/winners/payout     # Mark winner as paid
POST /api/winners/upload-proof     # User uploads proof image
GET  /api/analytics                # Dashboard stats
POST /api/email/send              # Email notifications
```

---

## 🎨 Remaining UI Components

```
components/
├── Admin/
│   ├── UserTable.tsx
│   ├── DrawManager.tsx
│   ├── CharityForm.tsx
│   └── WinnerQueue.tsx
├── Forms/
│   ├── ScoreForm.tsx
│   ├── CharityForm.tsx
│   └── FileUpload.tsx
├── Cards/
│   ├── DrawCard.tsx
│   ├── WinnerCard.tsx
│   └── CharityCard.tsx
└── Charts/
    ├── GrowthChart.tsx
    └── StatsSnapshot.tsx
```

---

## 🗄️ Database Completion Tasks

- [ ] Add sample charities (Water for All, Education First, Health Initiative, Green Earth)
- [ ] Create test users
- [ ] Run test draws
- [ ] Verify trigger functionality
- [ ] Test RLS policies

---

## 🧪 Testing Checklist

### Authentication Flow
- [ ] Signup completes successfully
- [ ] User created in database
- [ ] Login works with credentials
- [ ] Jwt token is valid
- [ ] Logout clears session

### Subscription Flow
- [ ] Stripe checkout loads
- [ ] Payment processes
- [ ] Webhook updates subscription
- [ ] User status changes to "active"

### Score System
- [ ] Score added successfully
- [ ] Rolling 5 enforced (6th score deletes oldest)
- [ ] Scores display in dashboard
- [ ] Can edit/delete scores (admin)

### Draw System
- [ ] Draw created by admin
- [ ] User can enter draw with 5 scores
- [ ] Winner matching calculates correctly
- [ ] Winners table populated
- [ ] Payouts tracked

### Charity System
- [ ] Charity selection at signup
- [ ] Can change charity from dashboard
- [ ] Contribution % updates
- [ ] Winnings split correctly

---

## 🚀 Deployment Preparation

1. **Environment Setup**
   - [ ] Create Vercel account
   - [ ] Connect GitHub repository
   - [ ] Configure environment variables
   - [ ] Test production build locally: `npm run build && npm start`

2. **Database**
   - [ ] Create production Supabase project
   - [ ] Run schema on production DB
   - [ ] Enable backups
   - [ ] Test production Stripe keys

3. **Security**
   - [ ] Enable CORS in Next.js
   - [ ] Add rate limiting
   - [ ] Configure security headers
   - [ ] Setup error monitoring (Sentry)

4. **Monitoring**
   - [ ] Google Analytics setup
   - [ ] Error tracking (Sentry)
   - [ ] Performance monitoring
   - [ ] Email alert setup

---

## 📧 Email Templates to Create (Resend)

### 1. Welcome Email
```
Subject: Welcome to IMPACT GOLF
- Welcome message
- Link to start scoring
- Platform overview
```

### 2. Draw Results Email
```
Subject: IMPACT GOLF - [MONTH] Draw Results
- Your numbers
- Drawn numbers
- Your matches
- Prize information
- Charity impact
```

###3. Winner Notification
```
Subject: 🎉 You Won! Claim Your Prize
- Match tier
- Prize amount
- Proof upload link
- Timeline for payout
```

---

## 💡 Code Patterns Reference

### Protected API Route
```typescript
export async function POST(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser(token);
  
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  // Your logic here...
}
```

### Admin Check
```typescript
async function isAdmin(userId: string) {
  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();
  return user?.role === 'admin';
}
```

### Database Insert with Error Handling
```typescript
const { data, error } = await supabase
  .from('table_name')
  .insert({ /* data */ })
  .select()
  .single();

if (error) return NextResponse.json({ error: error.message }, { status: 400 });
return NextResponse.json({ success: true, data });
```

---

## 📊 Monitoring & Analytics

### Key Metrics to Track
- User signups per day
- Active subscriptions
- Monthly recurring revenue (MRR)
- Draw participation rate
- Average prize won
- Charity donation total

### Dashboard Stats Needed
- Total users
- Active subscribers
- Prize pool
- Charity donations
- This month's draw schedule

---

## 🔗 Integration Checklist

- [ ] Stripe customer portal integration
- [ ] Google OAuth setup (optional)
- [ ] Apple login setup (optional)
- [ ] SMS notifications (optional)
- [ ] Slack integration for admin alerts

---

## 📱 Mobile Optimization

- [ ] Test responsive layout
- [ ] Bottom nav for mobile
- [ ] Touch-friendly buttons
- [ ] Mobile form optimization
- [ ] PWA setup (optional)

---

## 🎯 Final Verification Before Launch

- [ ] All pages fully functional
- [ ] Mobile responsive tested
- [ ] No console errors
- [ ] All API routes working
- [ ] Payment flow tested with Stripe test cards
- [ ] Email notifications sending
- [ ] Database backups configured
- [ ] Error monitoring active
- [ ] Analytics tracking
- [ ] Security headers configured

---

## 🆘 Troubleshooting Reference

**Stripe webhook not firing:**
- Check endpoint URL is public
- Verify webhook secret matches
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

**RLS policies blocking**
- Verify user ID in token
- Check auth context in database
- Test with ANON vs SERVICE_ROLE key

**Rolling scores not working**
- Check trigger exists in Supabase
- Monitor function execution
- Query trigger logs

---

This guide provides a structured path to completion!
