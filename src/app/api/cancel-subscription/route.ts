import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    const customers = await stripe.customers.list({ email, limit: 1 })
    if (customers.data.length === 0) return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    const customer = customers.data[0]
    const subscriptions = await stripe.subscriptions.list({ customer: customer.id, status: 'active', limit: 1 })
    if (subscriptions.data.length === 0) return NextResponse.json({ error: 'No active subscription' }, { status: 404 })
    await stripe.subscriptions.update(subscriptions.data[0].id, { cancel_at_period_end: true })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Cancel error:', err)
    return NextResponse.json({ error: 'Failed to cancel' }, { status: 500 })
  }
}
