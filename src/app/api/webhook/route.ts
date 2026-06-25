import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const email = session.customer_email || session.customer_details?.email
      console.log('Payment complete:', { customer: email, product: session.metadata?.product })
      if (email && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
          const supabase = createAdminClient()
          const { error } = await supabase.auth.admin.createUser({
            email,
            email_confirm: true,
            user_metadata: {
              product: session.metadata?.product,
              skill_label: session.metadata?.skill_label,
              phase: session.metadata?.phase,
              stripe_customer_id: session.customer,
            },
          })
          if (error && error.message !== 'User already registered') console.error('Supabase user creation error:', error)
          await supabase.auth.admin.generateLink({
            type: 'magiclink',
            email,
            options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard` },
          })
        } catch (err) { console.error('Error creating user:', err) }
      }
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      console.log('Subscription cancelled:', sub.id)
      break
    }
  }
  return NextResponse.json({ received: true })
}
