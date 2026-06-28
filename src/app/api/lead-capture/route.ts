import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { 
      email, 
      first_name,
      last_name, 
      city,
      state,
      industry,
      niche,
      skill,
      audience,
      dream_client,
      client_problem,
      result_delivered,
      result_timeframe,
      biggest_win,
      current_acquisition,
      delivery,
      price_comfort,
      revenue_goal,
      biggest_block,
      time_per_week,
      audit_complete,
      payment_complete,
      groq_skill_label,
      groq_gateway_product,
      groq_recurring_model,
      monthly_potential,
      phase,
    } = body

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const supabase = getAdminClient()

    // Upsert lead — update if email exists, insert if new
    const { data: lead, error } = await supabase
      .from('leads')
      .upsert({
        email: email.toLowerCase().trim(),
        ...(first_name && { first_name }),
        ...(last_name && { last_name }),
        ...(last_name && { last_name }),
        ...(city && { city }),
        ...(state && { state }),
        ...(industry && { industry }),
        ...(niche && { niche }),
        ...(skill && { skill }),
        ...(audience && { audience }),
        ...(dream_client && { dream_client }),
        ...(client_problem && { client_problem }),
        ...(result_delivered && { result_delivered }),
        ...(result_timeframe && { result_timeframe }),
        ...(biggest_win && { biggest_win }),
        ...(current_acquisition && { current_acquisition }),
        ...(delivery && { delivery }),
        ...(price_comfort && { price_comfort }),
        ...(revenue_goal && { revenue_goal }),
        ...(biggest_block && { biggest_block }),
        ...(time_per_week && { time_per_week }),
        ...(audit_complete !== undefined && { audit_complete }),
        ...(payment_complete !== undefined && { payment_complete }),
        ...(groq_skill_label && { groq_skill_label }),
        ...(groq_gateway_product && { groq_gateway_product }),
        ...(groq_recurring_model && { groq_recurring_model }),
        ...(monthly_potential && { monthly_potential }),
        ...(phase && { phase }),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'email',
        ignoreDuplicates: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase upsert error:', error)
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
    }

    // Trigger drip email in background (don't await — don't block the response)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://newmrr.com'
    fetch(`${appUrl}/api/send-drip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.toLowerCase().trim(), trigger: body.trigger || 'capture' }),
    }).catch(err => console.error('Drip trigger error:', err))

    return NextResponse.json({ success: true, lead_id: lead?.id })
  } catch (err) {
    console.error('Lead capture error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
