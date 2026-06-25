import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

export const PRODUCTS = {
  founding_member: {
    name: 'NewMRR Founding Member',
    description: 'Full platform access — Skill Audit, Dashboard, 90-Day Action Plan, Revenue Calculator',
    price: 4700, // $47/month in cents
    mode: 'subscription' as const,
  },
  strategy_session: {
    name: '1-on-1 Strategy Session',
    description: '90-minute deep-dive — your skill mapped to a $1M revenue path',
    price: 19700, // $197 in cents
    mode: 'payment' as const,
  },
  presell: {
    name: 'NewMRR Founding Access (Pre-sell)',
    description: 'Lock in lifetime founding member rate — full platform on launch',
    price: 29700, // $297 one-time in cents
    mode: 'payment' as const,
  },
}
