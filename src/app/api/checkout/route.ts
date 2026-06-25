import { NextRequest, NextResponse } from 'next/server'
import { stripe, PRODUCTS } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const { product, auditResult } = await req.json()
    const productConfig = PRODUCTS[product as keyof typeof PRODUCTS]

    if (!productConfig) {
      return NextResponse.json({ error: 'Invalid product' }, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const sessionConfig: Parameters<typeof stripe.checkout.sessions.create>[0] = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productConfig.name,
              description: productConfig.description,
              metadata: {
                skill_category: auditResult?.skillCategory || '',
                monthly_potential: auditResult?.monthlyRevenuePotential?.toString() || '',
              },
            },
            ...(productConfig.mode === 'subscription'
              ? {
                  unit_amount: productConfig.price,
                  recurring: { interval: 'month' },
                }
              : { unit_amount: productConfig.price }),
          },
          quantity: 1,
        },
      ],
      mode: productConfig.mode,
      success_url: `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}&product=${product}`,
      cancel_url: `${appUrl}/results`,
      metadata: {
        product,
        skill_label: auditResult?.skillLabel || '',
        phase: auditResult?.phase || '',
      },
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
