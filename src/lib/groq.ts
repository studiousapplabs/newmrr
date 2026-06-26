export async function cleanAuditLanguage(rawAnswers: {
  skill: string
  audience: string
  delivery: string
  priceComfort: string
  outcome: string
  dreamClient?: string
  clientProblem?: string
  industry?: string
  niche?: string
  biggestWin?: string
  resultTimeframe?: string
}): Promise<{
  skillLabel: string
  gatewayProductName: string
  recurringModelName: string
  dashboardHeadline: string
  audienceLabel: string
}> {
  const skillSummary = rawAnswers.skill.length > 100
    ? rawAnswers.skill.substring(0, 100) + '...'
    : rawAnswers.skill

  const context = [
    rawAnswers.industry && `Industry: ${rawAnswers.industry}`,
    rawAnswers.niche && `Niche: ${rawAnswers.niche}`,
    rawAnswers.dreamClient && `Dream client: ${rawAnswers.dreamClient.substring(0, 80)}`,
    rawAnswers.outcome && `Result they deliver: ${rawAnswers.outcome.substring(0, 80)}`,
    rawAnswers.resultTimeframe && `Timeframe: ${rawAnswers.resultTimeframe}`,
    rawAnswers.biggestWin && `Biggest win: ${rawAnswers.biggestWin.substring(0, 80)}`,
  ].filter(Boolean).join('\n')

  const prompt = `You are a sharp business brand strategist. Distill raw descriptions into crisp professional labels.

CRITICAL RULES:
- NEVER copy the person's words directly into the output
- Create a fresh, professional 2-4 word title capturing the ESSENCE of what they do
- Think: business card title. What would it say?
- Specific beats generic. "SaaS Sales Coach" beats "Sales Coach"

WHAT THEY DO: "${skillSummary}"
WHO THEY SERVE: "${rawAnswers.audience}"
HOW THEY DELIVER: "${rawAnswers.delivery}"
ADDITIONAL CONTEXT:
${context}

Distillation examples:
- "I help companies with their go-to-market strategy and sales" + SaaS industry = "SaaS GTM Strategist"
- "I help new moms get their body back after having a baby" + fitness = "Postpartum Fitness Coach"
- "Creating the flow of a new company from beginning to end on branding and sales" + consulting = "Business Launch Consultant"
- "I write email campaigns for e-commerce brands" + e-commerce = "E-Commerce Email Strategist"

Respond ONLY with valid JSON, no markdown:
{
  "skillLabel": "2-4 word professional title — distilled, NOT copied from their description",
  "gatewayProductName": "3-5 word premium entry offer name specific to their skill",
  "recurringModelName": "3-5 word monthly recurring offer name specific to their skill",
  "dashboardHeadline": "One punchy sentence under 10 words about the specific outcome they create",
  "audienceLabel": "2-3 word ideal client label specific to their niche"
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
      skillLabel: parsed.skillLabel || 'Business Consultant',
      gatewayProductName: parsed.gatewayProductName || 'Strategy Session',
      recurringModelName: parsed.recurringModelName || 'Monthly Coaching Retainer',
      dashboardHeadline: parsed.dashboardHeadline || 'Turn your expertise into monthly recurring revenue.',
      audienceLabel: parsed.audienceLabel || rawAnswers.audience,
    }
  } catch {
    return {
      skillLabel: 'Business Consultant',
      gatewayProductName: 'Strategy Session',
      recurringModelName: 'Monthly Coaching Retainer',
      dashboardHeadline: 'Turn your expertise into monthly recurring revenue.',
      audienceLabel: rawAnswers.audience,
    }
  }
}
