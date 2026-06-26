import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateDripEmail } from '@/lib/email-generator'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const supabase = getAdminClient()

    // Get full lead data
    const { data: lead, error: fetchError } = await supabase
      .from('leads')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (fetchError || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Generate personalized email via Groq
    const emailContent = await generateDripEmail(lead)

    if (!emailContent) {
      return NextResponse.json({ message: 'No email needed at this time' })
    }

    // Send via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'NewMRR Wealth Group <hello@newmrr.com>',
        to: [lead.email],
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      }),
    })

    if (!resendResponse.ok) {
      const resendError = await resendResponse.json()
      console.error('Resend error:', resendError)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    // Log email in Supabase
    const emailRecord = {
      type: emailContent.email_type,
      sent_at: new Date().toISOString(),
      subject: emailContent.subject,
    }

    const existingEmails = lead.emails_sent || []
    await supabase
      .from('leads')
      .update({
        emails_sent: [...existingEmails, emailRecord],
        last_email_sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('email', lead.email)

    return NextResponse.json({
      success: true,
      email_type: emailContent.email_type,
      subject: emailContent.subject,
    })
  } catch (err) {
    console.error('Send drip error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
