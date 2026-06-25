import { NextRequest, NextResponse } from 'next/server'
import { stripe, PRODUCTS } from '@/lib/stripe'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  try {
    const { product, auditResult } = await req.json()
    const productConfig = PRODUCTS[product as keyof typeof PRODUCTS]

    if (!productConfig) {
      return NextResponse.json({ error: 'Invalid product' }, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: 'usd',
        product_data: {
          name: productConfig.name,
          description: productConfig.description,
        },
        ...(productConfig.mode === 'subscription'
          ? {
              unit_amount: productConfig.price,
              recurring: { interval: 'month' },
            }
          : { unit_amount: productConfig.price }),
      },
      quantity: 1,
    }

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      line_items: [lineItem],
      mode: productConfig.mode,
      success_url: `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}&product=${product}`,
      cancel_url: `${appUrl}/results`,
      metadata: {
        product,
        skill_label: auditResult?.skillLabel || '',
        phase: auditResult?.phase || '',
        skill_category: auditResult?.skillCategory || '',
        monthly_potential: auditResult?.monthlyRevenuePotential?.toString() || '',
      },
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
