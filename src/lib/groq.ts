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
  const prompt = `You are a business positioning expert. Transform these raw audit answers into professional business language.

RAW ANSWERS:
- Skill: "${rawAnswers.skill}"
- Audience: "${rawAnswers.audience}"
- Delivery: "${rawAnswers.delivery}"
- Outcome: "${rawAnswers.outcome}"
- Price comfort: "${rawAnswers.priceComfort}"

Respond ONLY with valid JSON, no markdown, no explanation:
{
  "skillLabel": "2-4 word professional title e.g. Sales Coach or Brand Strategist",
  "gatewayProductName": "3-6 word entry offer name e.g. 90-Minute Strategy Session",
  "recurringModelName": "3-6 word monthly offer name e.g. Monthly Revenue Coaching",
  "dashboardHeadline": "One punchy sentence under 12 words about what they help clients achieve",
  "audienceLabel": "2-4 word ideal client description e.g. Early-Stage Founders"
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
      skillLabel: parsed.skillLabel || rawAnswers.skill.split(' ').slice(0,3).join(' ') + ' Consultant',
      gatewayProductName: parsed.gatewayProductName || 'Strategy Session',
      recurringModelName: parsed.recurringModelName || 'Monthly Coaching',
      dashboardHeadline: parsed.dashboardHeadline || 'Turn your skill into monthly recurring revenue.',
      audienceLabel: parsed.audienceLabel || rawAnswers.audience,
    }
  } catch {
    return {
      skillLabel: rawAnswers.skill.split(' ').slice(0,3).join(' ') + ' Consultant',
      gatewayProductName: 'Strategy Session',
      recurringModelName: 'Monthly Coaching Retainer',
      dashboardHeadline: 'Turn your expertise into monthly recurring revenue.',
      audienceLabel: rawAnswers.audience,
    }
  }
}
