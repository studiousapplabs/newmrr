# NewMRR Wealth Group

> Turn your skill into monthly recurring revenue. Built on Ryan Daniel Moran's 12 Months to $1M framework.

**Flow:** Landing Page → Skill Audit (10 questions) → Personalized Results → Stripe Payment → Member Dashboard

---

## Deploy in 15 Minutes

### Step 1 — Push to GitHub

```bash
# Create a new repo on github.com, then:
git init
git add .
git commit -m "Initial NewMRR platform"
git remote add origin https://github.com/YOUR_USERNAME/newmrr.git
git push -u origin main
```

### Step 2 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Framework: **Next.js** (auto-detected)
4. Click **Deploy** — it builds automatically

### Step 3 — Add Environment Variables

In Vercel → Project → Settings → Environment Variables, add:

```
STRIPE_SECRET_KEY          = sk_live_xxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_xxxx
STRIPE_WEBHOOK_SECRET      = whsec_xxxx
NEXT_PUBLIC_APP_URL        = https://your-vercel-url.vercel.app
```

**Get Stripe keys:** [dashboard.stripe.com](https://dashboard.stripe.com) → Developers → API Keys

### Step 4 — Set Up Stripe Webhook

1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://your-vercel-url.vercel.app/api/webhook`
3. Events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
4. Copy the **Signing Secret** → paste as `STRIPE_WEBHOOK_SECRET` in Vercel

### Step 5 — Redeploy

In Vercel → Deployments → Redeploy (so env vars take effect)

---

## What's Built

| Route | What It Does |
|-------|-------------|
| `/` | Landing page — Moran framework, social proof, CTA |
| `/audit` | 10-question Skill Audit (no email required) |
| `/results` | Personalized revenue map + Stripe checkout |
| `/dashboard` | Member dashboard — Overview, 90-Day Plan, Revenue Calculator, Resources |
| `/api/checkout` | Creates Stripe checkout session |
| `/api/webhook` | Handles Stripe payment events |

## Products / Pricing

| Product | Price | Type |
|---------|-------|------|
| Founding Member | $47/month | Subscription |
| Founding Access (Pre-sell) | $297 | One-time |
| 1-on-1 Strategy Session | $197 | One-time |

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Stripe** (payments + webhooks)
- **Vercel** (hosting, free tier)
- Zero external database — audit results stored in sessionStorage
- Zero auth required to see results (by design — reduces friction)

## Customization

**Change prices:** Edit `src/lib/stripe.ts` → `PRODUCTS` object

**Change audit questions:** Edit `src/lib/audit-engine.ts` → `AUDIT_QUESTIONS`

**Change brand colors:** Edit `src/styles/globals.css` → `:root` variables

**Add email on purchase:** The webhook in `src/app/api/webhook/route.ts` has a TODO comment — wire Resend (free tier: 3k emails/month) there.

## Add Email (Optional, Free)

1. Sign up at [resend.com](https://resend.com) — free tier is 3,000 emails/month
2. Get API key → add as `RESEND_API_KEY` in Vercel
3. Uncomment the email line in `src/app/api/webhook/route.ts`

---

Built for NewMRR Wealth Group. The Grind. The Growth. The Gold.
