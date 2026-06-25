export async function cleanAuditLanguage(rawAnswers: {
  skill: string
  audience: string
  delivery: string
  priceComfort: string
  outcome: string
}): Promise<{
  skillLabel: string
  gatewayProductName: string
  recurringModelName: string
  dashboardHeadline: string
  audienceLabel: string
}> {
  const skillSummary = rawAnswers.skill.length > 80
    ? rawAnswers.skill.substring(0, 80) + '...'
    : rawAnswers.skill

  const prompt = `You are a sharp business brand strategist. Distill raw descriptions into crisp professional labels.

CRITICAL RULES:
- NEVER copy the person's words directly into the output
- ALWAYS create a fresh, professional 2-4 word title capturing the ESSENCE of what they do
- Think: if this person had a business card, what would their title say?
- "Sales Coach" beats "Creating sales processes consultant"

WHAT THEY DO: "${skillSummary}"
WHO THEY SERVE: "${rawAnswers.audience}"
HOW THEY DELIVER: "${rawAnswers.delivery}"
OUTCOME THEY CREATE: "${rawAnswers.outcome}"

Distillation examples:
- "I help people build websites and brand themselves online" becomes "Brand & Web Consultant"
- "Creating the flow of a new company from beginning to end on branding and sales" becomes "Business Launch Consultant"
- "I coach executives on leadership and communication" becomes "Executive Leadership Coach"

Respond ONLY with valid JSON, no markdown:
{
  "skillLabel": "2-4 word professional title distilled from their description",
  "gatewayProductName": "3-5 word premium entry offer name",
  "recurringModelName": "3-5 word monthly recurring offer name",
  "dashboardHeadline": "One punchy sentence under 10 words about client outcomes",
  "audienceLabel": "2-3 word ideal client label"
}`

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 300,
      }),
    })
    const data = await response.json()
    const content = data.choices[0]?.message?.content?.trim()
    const clean = content.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    return {
      skillLabel: parsed.skillLabel || rawAnswers.skill.split(' ').slice(0, 3).join(' ') + ' Consultant',
      gatewayProductName: parsed.gatewayProductName || 'Strategy Session',
      recurringModelName: parsed.recurringModelName || 'Monthly Coaching Retainer',
      dashboardHeadline: parsed.dashboardHeadline || 'Turn your expertise into monthly recurring revenue.',
      audienceLabel: parsed.audienceLabel || rawAnswers.audience,
    }
  } catch {
    return {
      skillLabel: rawAnswers.skill.split(' ').slice(0, 3).join(' ') + ' Consultant',
      gatewayProductName: 'Strategy Session',
      recurringModelName: 'Monthly Coaching Retainer',
      dashboardHeadline: 'Turn your expertise into monthly recurring revenue.',
      audienceLabel: rawAnswers.audience,
    }
  }
}
