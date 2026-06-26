interface LeadData {
  email: string
  first_name?: string
  last_name?: string
  skill?: string
  audience?: string
  dream_client?: string
  client_problem?: string
  result_delivered?: string
  result_timeframe?: string
  biggest_win?: string
  current_acquisition?: string
  groq_skill_label?: string
  groq_gateway_product?: string
  monthly_potential?: number
  phase?: string
  biggest_block?: string
  audit_complete?: boolean
  payment_complete?: boolean
  emails_sent?: EmailRecord[]
  city?: string
  industry?: string
  niche?: string
}

interface EmailRecord {
  type: string
  sent_at: string
  subject: string
}

interface GeneratedEmail {
  subject: string
  html: string
  text: string
  email_type: string
}

function getFunnelStage(lead: LeadData): string {
  if (lead.payment_complete) return 'paid_inactive'
  if (lead.audit_complete) return 'audit_complete_no_payment'
  if (lead.skill || lead.audience) return 'partial_audit'
  if (lead.first_name) return 'email_only'
  return 'email_only'
}

function getEmailsSentTypes(lead: LeadData): string[] {
  return (lead.emails_sent || []).map((e: EmailRecord) => e.type)
}

function daysSinceLastEmail(lead: LeadData): number {
  if (!lead.emails_sent || lead.emails_sent.length === 0) return 999
  const last = lead.emails_sent[lead.emails_sent.length - 1]
  const lastDate = new Date(last.sent_at)
  const now = new Date()
  return Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
}

function getNextEmailType(lead: LeadData): string | null {
  const sent = getEmailsSentTypes(lead)
  const stage = getFunnelStage(lead)
  const daysSince = daysSinceLastEmail(lead)

  // Don't send if last email was less than 2 days ago
  if (daysSince < 2) return null

  if (stage === 'email_only') {
    if (!sent.includes('welcome_incomplete')) return 'welcome_incomplete'
    if (!sent.includes('followup_incomplete') && daysSince >= 2) return 'followup_incomplete'
    if (!sent.includes('final_incomplete') && daysSince >= 5) return 'final_incomplete'
    return null
  }

  if (stage === 'partial_audit') {
    if (!sent.includes('partial_personalized')) return 'partial_personalized'
    if (!sent.includes('partial_followup') && daysSince >= 2) return 'partial_followup'
    if (!sent.includes('partial_final') && daysSince >= 5) return 'partial_final'
    return null
  }

  if (stage === 'audit_complete_no_payment') {
    if (!sent.includes('results_reveal')) return 'results_reveal'
    if (!sent.includes('results_followup') && daysSince >= 2) return 'results_followup'
    if (!sent.includes('results_social_proof') && daysSince >= 4) return 'results_social_proof'
    if (!sent.includes('results_urgency') && daysSince >= 7) return 'results_urgency'
    if (!sent.includes('results_final') && daysSince >= 12) return 'results_final'
    return null
  }

  if (stage === 'paid_inactive') {
    if (!sent.includes('paid_welcome')) return 'paid_welcome'
    if (!sent.includes('paid_mission_preview') && daysSince >= 3) return 'paid_mission_preview'
    return null
  }

  return null
}

export async function generateDripEmail(lead: LeadData): Promise<GeneratedEmail | null> {
  const emailType = getNextEmailType(lead)
  if (!emailType) return null

  const name = lead.first_name || 'there'
  const skillLabel = lead.groq_skill_label || lead.skill || 'your skill'
  const audience = lead.dream_client || lead.audience || 'your clients'
  const problem = lead.client_problem || 'the problem they face'
  const result = lead.result_delivered || 'real results'
  const timeframe = lead.result_timeframe || 'quickly'
  const monthlyTarget = lead.monthly_potential ? `$${lead.monthly_potential.toLocaleString()}` : 'serious money'
  const gateway = lead.groq_gateway_product || 'Strategy Session'
  const biggestWin = lead.biggest_win || ''

  const prompts: Record<string, string> = {
    welcome_incomplete: `Write a short, warm email to ${name} who just entered their email on NewMRR.com but didn't finish the free skill audit. 
They haven't told us anything about their skill yet.
Tone: curious, warm, like a smart friend checking in. NOT salesy.
Goal: get them to come back and finish the audit.
Keep it under 120 words. No fluff. 
Subject line should feel personal, not promotional.
Return JSON: {"subject": "...", "body": "..."}`,

    followup_incomplete: `Write a follow-up email to ${name} who started the NewMRR skill audit 2 days ago but never finished.
We don't know their skill yet but we know they were curious about turning their expertise into monthly recurring revenue.
Tone: direct, a little urgent, like someone who genuinely wants to help them.
Reference that we noticed they started something. 
Goal: get them back to finish the audit.
Under 100 words.
Return JSON: {"subject": "...", "body": "..."}`,

    final_incomplete: `Write a final email to ${name} who started the NewMRR audit 7+ days ago and never finished.
Be honest — this is the last email. Make it count.
Tone: real, human, not corporate. A little personal.
Goal: one last shot to get them back.
Under 80 words.
Return JSON: {"subject": "...", "body": "..."}`,

    partial_personalized: `Write a personalized email to ${name} who started the NewMRR skill audit but didn't finish.
What we know about them:
- Their skill: ${lead.skill || 'not yet captured'}
- Their audience: ${lead.audience || 'not yet captured'}
- Their delivery method: ${lead.delivery || 'not yet captured'}

Use what we know to make this email feel like we were paying attention.
Reference their specific skill and audience in the email.
Goal: get them to finish the audit and see their personalized results.
Tone: warm, smart, direct. Like a mentor who noticed them.
Under 130 words.
Return JSON: {"subject": "...", "body": "..."}`,

    partial_followup: `Write a follow-up email to ${name}.
They told us they help ${audience} with ${skillLabel} but never finished their audit.
Make them feel the pain of not knowing what they're leaving on the table.
Be specific about THEM — use their skill and audience in the copy.
Goal: finish the audit.
Under 100 words. Direct. No fluff.
Return JSON: {"subject": "...", "body": "..."}`,

    partial_final: `Final email to ${name}. 
They help ${audience} with ${skillLabel}.
They started but never finished their free audit on NewMRR.
Write this like it's the last time we'll reach out.
Be real. Reference what they told us. Make it personal.
Under 80 words.
Return JSON: {"subject": "...", "body": "..."}`,

    results_reveal: `Write an email to ${name} who just completed the NewMRR skill audit but hasn't paid yet.
Their results:
- Skill: ${skillLabel}
- Audience: ${audience}
- Their monthly revenue potential: ${monthlyTarget}/month
- Their biggest block: ${lead.biggest_block || 'unclear'}
- Their biggest win so far: ${biggestWin}

The email should reveal a key insight from their audit — something specific that makes them feel seen.
Reference their actual numbers and skill.
Goal: get them to unlock the full dashboard at $47/month.
Tone: excited on their behalf, like you just saw their numbers and couldn't wait to tell them.
Under 150 words.
Return JSON: {"subject": "...", "body": "..."}`,

    results_followup: `Follow-up email to ${name} who completed their NewMRR audit 2 days ago but hasn't joined yet.
They learned their ${skillLabel} could generate ${monthlyTarget}/month.
Their biggest client win: ${biggestWin || 'helping their clients get results'}.
Write something that addresses their hesitation without being pushy.
Reference what they told us about their skill specifically.
Goal: join for $47/month.
Under 120 words.
Return JSON: {"subject": "...", "body": "..."}`,

    results_social_proof: `Email to ${name} about NewMRR. They know their audit results but haven't joined.
Their skill: ${skillLabel}. Their potential: ${monthlyTarget}/month.
Write an email that leads with a brief story of someone similar to them who took action.
Keep the story realistic and relatable — not hype.
Goal: $47/month membership.
Under 140 words.
Return JSON: {"subject": "...", "body": "..."}`,

    results_urgency: `Email to ${name}. It's been a week since they saw their audit results showing ${monthlyTarget}/month potential from their ${skillLabel}.
Create genuine urgency — not fake countdown timers. Real urgency about opportunity cost.
How much have they already left on the table this week?
Goal: join for $47/month. Link: newmrr.com/results
Under 100 words. Punch them a little.
Return JSON: {"subject": "...", "body": "..."}`,

    results_final: `Final email to ${name}. 12+ days since they completed their audit.
Their ${skillLabel} could be generating ${monthlyTarget}/month. It isn't yet.
Write the most honest, human email in the sequence.
No pitch. Just real talk about what happens when people sit on their potential.
If it's right for them, the link is there. If not, wish them well.
Under 100 words.
Return JSON: {"subject": "...", "body": "..."}`,

    paid_welcome: `Welcome email to ${name} who just paid for NewMRR membership.
Their skill: ${skillLabel}. Their audience: ${audience}.
Their monthly target: ${monthlyTarget}.
Make them feel amazing about their decision.
Tell them exactly what to do first — go to their dashboard and check their Week 1 mission.
Tone: celebratory but focused. Like a great coach on day 1.
Under 150 words.
Return JSON: {"subject": "...", "body": "..."}`,

    paid_mission_preview: `Email to ${name} who is a paying NewMRR member but hasn't logged in recently.
Their skill: ${skillLabel}. Their Week 1 mission is waiting.
Write an email that previews what their mission is about without giving it all away.
Make them curious enough to log in.
Goal: log into dashboard.
Under 100 words.
Return JSON: {"subject": "...", "body": "..."}`,
  }

  const prompt = prompts[emailType]
  if (!prompt) return null

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are an expert email copywriter for NewMRR Wealth Group. Write emails that sound human, warm, and direct. Never use corporate speak. Always return valid JSON only with "subject" and "body" keys. The body should be plain text with line breaks, no HTML.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    })

    const data = await response.json()
    const content = data.choices[0]?.message?.content?.trim()
    const clean = content.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    const bodyHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a; line-height: 1.7;">
  <div style="margin-bottom: 32px;">
    <span style="font-family: sans-serif; font-weight: 800; font-size: 1rem; letter-spacing: -0.02em;">New<span style="color: #C9A84C;">MRR</span></span>
  </div>
  ${parsed.body.split('\n').filter((l: string) => l.trim()).map((line: string) => `<p style="margin: 0 0 16px;">${line}</p>`).join('')}
  <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #eee;">
    <a href="https://newmrr.com/audit" style="background: #C9A84C; color: #0E0E10; padding: 12px 28px; text-decoration: none; font-family: sans-serif; font-weight: 700; border-radius: 6px; display: inline-block; font-size: 0.9rem;">
      ${emailType.includes('paid') ? 'Go to My Dashboard →' : 'Continue My Audit →'}
    </a>
  </div>
  <p style="margin-top: 32px; font-size: 0.78rem; color: #999; font-family: sans-serif;">
    NewMRR Wealth Group · <a href="https://newmrr.com" style="color: #999;">newmrr.com</a>
  </p>
</body>
</html>`

    return {
      subject: parsed.subject,
      html: bodyHtml,
      text: parsed.body,
      email_type: emailType,
    }
  } catch (err) {
    console.error('Groq email generation error:', err)
    return null
  }
}

export { getNextEmailType, getFunnelStage, type LeadData, type GeneratedEmail }
