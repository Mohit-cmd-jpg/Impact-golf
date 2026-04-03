# IMPACT GOLF - Testing Guide

## Quick Start Testing

### 1. Local Development Setup

```bash
cd impact-golf
npm install
npm run dev
```

Open http://localhost:3000

### 2. Test User Flow

#### Step 1: Homepage
- [ ] Navigate to `/`
- [ ] Verify hero section displays neon gradient
- [ ] Check "How It Works" cards render
- [ ] Scroll to pricing section
- [ ] Verify charity partners carousel

**Expected:** Dark theme with #cafd00 neon accents, smooth scrolling

#### Step 2: Sign Up
- [ ] Click "Get Started" button
- [ ] Fill Step 1: Name, Email, Password
- [ ] Click Next → Step 2 appears
- [ ] Select Monthly or Yearly plan
- [ ] Click Next → Step 3: Charity selection
- [ ] Choose a charity and adjust slider
- [ ] Click Next → Step 4: Review & Payment
- [ ] Enter Stripe test card: `4242 4242 4242 4242`
- [ ] Expiry: Any future date (e.g., 12/25)
- [ ] CVC: Any 3 digits (e.g., 123)
- [ ] Click "Complete Purchase"

**Expected:** 
- Form validation works
- Stripe modal appears
- After payment, redirected to dashboard
- Welcome email sent (check Resend logs)

#### Step 3: Dashboard
- [ ] Verify user is logged in
- [ ] Check subscription status card
- [ ] Try entering a golf score (1-45)
- [ ] Verify score appears in recent scores list
- [ ] Check selected charity displays

**Expected:**
- User data loads from Supabase
- Scores are persisted
- No console errors

#### Step 4: Charities Page
- [ ] Navigate to `/charities`
- [ ] Test search functionality
- [ ] Test category filters
- [ ] Click on charity to view details

**Expected:**
- Filter works in real-time
- Charity list matches filter criteria

#### Step 5: Draws Page
- [ ] Navigate to `/draws`
- [ ] Verify current month draw displays
- [ ] Check winning numbers render as neon circles
- [ ] Scroll to see draw history sidebar
- [ ] View analytics section with bar chart

**Expected:**
- Draw data loads from API
- Charts render properly
- No layout issues

### 3. Admin Dashboard Testing

#### Setup Admin User
First, make yourself an admin in Supabase:

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-test-email@example.com';
```

Then navigate to `/admin`

#### Admin Dashboard Overview
- [ ] Left sidebar navigation loads
- [ ] Stats bento grid displays (4 cards)
- [ ] User management table shows test users
- [ ] Charity partners section displays cards with progress bars
- [ ] Draw engine section shows logic protocol buttons
- [ ] Winners queue displays (if any winners)
- [ ] Growth analytics chart displays

**Expected:** All sections load without errors, neon accents apply correctly

#### User Management (`/admin/users`)
- [ ] Page loads with all users
- [ ] Search works by name/email
- [ ] Status filter buttons work
- [ ] Export CSV downloads file
- [ ] Edit/Delete buttons appear

**Expected:** Table pagination, filter persist on updates

#### Draw Engine (`/admin/draws`)
- [ ] Current draw info displays
- [ ] Click "Run Simulation" → new draw created
- [ ] Winning numbers generate (5 numbers)
- [ ] Click "Publish Results" → winners calculated
- [ ] Draw history updates

**Expected:** Simulations generate different numbers each time, winner matching works

#### Winners (`/admin/winners`)
- [ ] Pending winners show with URGENT badge
- [ ] Click "Approve" → status changes to "Approved"
- [ ] Click "Mark Paid" → status changes to "Paid"
- [ ] Filters work (Pending/Approved/Paid)

**Expected:** Status badges update in real-time

#### Charities (`/admin/charities`)
- [ ] All charities display
- [ ] Click "Add Charity" → form opens
- [ ] Enter charity details and submit
- [ ] New charity appears in list
- [ ] Click Delete → charity removed

**Expected:** CRUD operations work, form validates

#### Analytics (`/admin/analytics`)
- [ ] Total users, revenue, impact cards display
- [ ] Monthly growth chart renders
- [ ] Subscription breakdown shows
- [ ] Top charities list displays
- [ ] Date range buttons work (7d/30d/90d/1y)

**Expected:** Charts render, data updates on date range change

### 4. Authentication Testing

#### Login with Valid Credentials
```
Email: test@example.com
Password: TestPassword123!
```

- [ ] Navigate to `/auth/login`
- [ ] Enter credentials
- [ ] Click "Sign In"
- [ ] Redirected to dashboard

**Expected:** Login successful, session stored in localStorage

#### Logout
- [ ] Click logout from dashboard or admin
- [ ] Redirected to login page
- [ ] localStorage cleared

**Expected:** Cannot access protected pages without re-login

#### Protected Routes
- [ ] Try accessing `/dashboard` without logining
- [ ] Should redirect to `/auth/login`

**Expected:** Auth guard works

### 5. Payment Integration Testing

#### Stripe Test Cards

**Successful Payment:**
```
Card: 4242 4242 4242 4242
Expiry: 12/25
CVC: 123
```

**Payment Required:**
```
Card: 4000 0027 6000 3184
Expiry: 12/25
CVC: 123
```

**Declined Card:**
```
Card: 4000 0000 0000 0002
Expiry: 12/25
CVC: 123
```

#### Payment Flow Validation
1. [ ] Complete signup with test card
2. [ ] Check Stripe Dashboard → Events:
   - `customer.subscription.created` fired
   - Webhook delivery successful
3. [ ] Verify subscription created in Supabase:
   ```sql
   SELECT * FROM subscriptions WHERE user_id = 'your_user_id';
   ```
4. [ ] Check email was sent (Resend dashboard)

**Expected:** 
- Subscription records in database
- Webhook logs show success
- Payment confirmation email received

### 6. Email Testing

#### Configure Resend Testing
1. Go to Resend Dashboard
2. Find "Domains" section
3. Check "Test Mode" to see emails without sending

#### Verify Emails Sent
- [ ] Welcome email after signup
- [ ] Payment confirmation after purchase
- [ ] Draw results (after publishing draw)
- [ ] Winner notification (if user wins)

**Expected:** All emails have correct template styling, neon brand colors

### 7. Database Integrity Testing

#### Check RLS Policies
Run these queries in Supabase SQL Editor:

```sql
-- Should return only logged-in user's data
SELECT * FROM users WHERE id = current_user_id();

-- Should return only user's scores
SELECT * FROM scores WHERE user_id = current_user_id();

-- Should not allow deleting other users (RLS should block)
DELETE FROM users WHERE id != current_user_id();
```

**Expected:** RLS policies enforce security

#### Check Trigger Functions
```sql
-- Insert 6 scores for a user, verify only 5 kept
INSERT INTO scores (user_id, score, created_at) VALUES
  ('test-user-id', 80, NOW()),
  ('test-user-id', 75, NOW()),
  ('test-user-id', 82, NOW()),
  ('test-user-id', 78, NOW()),
  ('test-user-id', 85, NOW()),
  ('test-user-id', 72, NOW());

-- Query should return only 5 scores
SELECT COUNT(*) FROM scores WHERE user_id = 'test-user-id';
```

**Expected:** Count = 5 (oldest score deleted by trigger)

## Performance Testing

### Lighthouse Audit
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Click "Analyze page load"
4. Check scores:
   - Performance: > 80
   - Accessibility: > 90
   - Best Practices: > 90
   - SEO: > 90

**Expected:** Good scores on all metrics

### Database Query Performance
- Check Supabase Dashboard → "Query Performance"
- Look for slow queries (> 1s response time)
- Add indexes if needed

### API Response Times
```bash
curl -w "Time: %{time_total}s\n" https://localhost:3000/api/draws
```

**Expected:** < 500ms response time

## Security Testing

### SQL Injection Attempt
- [ ] Try searching charities with: `'); DROP TABLE users; --`
- [ ] Should return safe results, no database corruption

**Expected:** Input sanitized, no SQL executed

### XSS Prevention
- [ ] Try entering HTML in charity search: `<script>alert('xss')</script>`
- [ ] Should be escaped, no alert appears

**Expected:** HTML rendered as text, not executed

### CSRF Protection
- [ ] Submit forms without CSRF token (Stripe, payment)
- [ ] Should fail or show error

**Expected:** Each request validates CSRF or uses Stripe's built-in protection

## Responsive Design Testing

### Mobile (iPhone 12)
- [ ] Homepage responsive on mobile
- [ ] Navigation menu accessible
- [ ] Forms stack vertically
- [ ] Images scale properly

### Tablet (iPad)
- [ ] Layout adapts to tablet width
- [ ] Tables have horizontal scroll if needed
- [ ] Spacing appropriate for tablet

### Desktop (1920px)
- [ ] No excessive whitespace
- [ ] Multi-column layouts display properly
- [ ] Sidebar navigation visible

**Expected:** Good UX on all screen sizes

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Expected:** No console errors, all features work

## Known Issues & Limitations

- Email templates use HTML (some clients may not support full styling)
- Charts on analytics page use CSS-based bars (not library-based)
- Admin auth uses Bearer token in Authorization header (ensure HTTPS in production)

## Pre-Deployment Checklist

Before deploying to Vercel:

- [ ] All tests pass locally
- [ ] No console errors in production build: `npm run build`
- [ ] Environment variables configured
- [ ] Stripe webhook endpoints set to production
- [ ] Database backups created
- [ ] Email templates verified
- [ ] Admin user created
- [ ] Test payment processed successfully
- [ ] Redirect URLs updated (if custom domain)

## Running Production Build Locally

```bash
npm run build
npm run start
```

Then test all flows on this production build to catch any production-specific issues.

---

**Testing Completed:** _____ (date)
**Tested By:** _____ (name)
**Any Issues Found:** 

