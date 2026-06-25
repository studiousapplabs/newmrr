import { NextRequest, NextResponse } from 'next/server'

function generateContent(resource: string, data: Record<string, string>): string {
  const { skill, audience, gatewayProduct, gatewayPrice, recurringModel, recurringPrice, monthlyTarget, dailyTarget } = data

  const resources: Record<string, string> = {
    'outreach-script': `OUTREACH SCRIPT (TAG FORMULA)\nPersonalized for: ${skill}\nNewMRR Wealth Group\n${'='.repeat(40)}\n\nT — TELL THEM WHAT YOU DO\n"Hey [Name], I help ${audience} with ${skill}. I put together a [${gatewayProduct}] that gets results fast."\n\nA — ASK IF THEY WANT TO BE INVOLVED\n"Is ${skill} something you've been trying to improve? I'm looking for people to work with this month."\n\nG — GO FOR THE SMALLEST YES\n"Would it be okay if I sent you some info about the ${gatewayProduct}? It's $${gatewayPrice}. No pressure."\n\nFOLLOW UP\nDay 1: Send the script above\nDay 3: "Did you get a chance to look?"\nDay 7: "Last follow up — one spot left."\n\nYOUR TARGET: ${dailyTarget} new customers/month\nYOUR MRR GOAL: $${monthlyTarget}/month\n\nnewmrr.com`,

    'gateway-checklist': `GATEWAY PRODUCT LAUNCH CHECKLIST\nPersonalized for: ${skill}\nNewMRR Wealth Group\n${'='.repeat(40)}\n\nYOUR GATEWAY PRODUCT: ${gatewayProduct}\nPRICE: $${gatewayPrice}\nTARGET: ${audience}\n\nWEEK 1 — BUILD\n[ ] Write one sentence describing ${gatewayProduct}\n[ ] Identify 20 specific ${audience} with this problem\n[ ] Set up payment link for $${gatewayPrice}\n[ ] Write 3 bullet points of what they get\n[ ] Get one testimonial (free work counts)\n\nWEEK 2 — REACH OUT\n[ ] Contact first 5 prospects using TAG formula\n[ ] Post once where ${audience} hang out\n[ ] Follow up with non-responders\n[ ] Ask 3 people for referrals\n[ ] Pre-sell to at least 1 person\n\nWEEK 3 — DELIVER\n[ ] Deliver ${gatewayProduct} to first customer\n[ ] Ask for testimonial immediately\n[ ] Document what worked\n[ ] Offer ${recurringModel} at $${recurringPrice}/mo\n\nTARGET: First sale Week 2, First MRR Month 2\n\nnewmrr.com`,

    'prelaunch-playbook': `STACK THE DECK: PRE-LAUNCH PLAYBOOK\nPersonalized for: ${skill}\nNewMRR Wealth Group\n${'='.repeat(40)}\n\nTHE 1000/10/1 METHOD\nFor: ${gatewayProduct} at $${gatewayPrice}\n\nPHASE 1: THE 1000 (4 weeks before)\n[ ] Post 3x/week about ${skill}\n[ ] Join 5 communities where ${audience} gather\n[ ] Comment value on 10 posts/day\n[ ] Collect emails — 100 is enough to launch\n\nContent angles:\n→ "The #1 mistake ${audience} make with ${skill}"\n→ "How I helped a client get [result]"\n→ "3 things I wish I knew about ${skill}"\n\nPHASE 2: THE 10 (2 weeks before)\n[ ] Find 10 micro-influencers with ${audience}\n[ ] Use TAG formula to reach out\n[ ] Offer free access to ${gatewayProduct}\n[ ] Brief them on launch day posting\n\nPHASE 3: THE 1 (Launch week)\n[ ] Email list day before: "Tomorrow is the day"\n[ ] Post on every platform launch morning\n[ ] Have 10 partners post simultaneously\n[ ] Respond to every comment personally\n\nLAUNCH TARGET: 3 sales in first 48 hours\nMRR TARGET: $${monthlyTarget}/month\n\nnewmrr.com`,

    'email-sequence': `5-EMAIL WELCOME SEQUENCE\nPersonalized for: ${skill}\nNewMRR Wealth Group\n${'='.repeat(40)}\n\nEMAIL 1 — DAY 0\nSubject: You are in — here's what happens next\n\nHey [First Name],\nWelcome. I help ${audience} with ${skill}.\nOver the next 7 days I will show you exactly how.\n[Your Name]\n\nEMAIL 2 — DAY 1\nSubject: The ${skill} mistake costing you money\n\nMost ${audience} undercharge for ${skill}.\nI have seen people go from $0 to $${recurringPrice}/month\njust by packaging it right.\n[Your Name]\n\nEMAIL 3 — DAY 3\nSubject: The $${monthlyTarget}/month formula\n\n${dailyTarget} customers x $${recurringPrice}/month = $${monthlyTarget}/month.\nYour gateway: ${gatewayProduct} at $${gatewayPrice}.\nReply YES if you want to know how.\n[Your Name]\n\nEMAIL 4 — DAY 5\nSubject: The #1 mistake ${audience} make\n\nThey wait until they are ready.\nYour ${skill} is already valuable enough.\nStart with one customer. Then ${dailyTarget}.\n[Your Name]\n\nEMAIL 5 — DAY 7\nSubject: One spot left this month\n\nOne spot available for ${audience} who want\n$${monthlyTarget}/month from their ${skill}.\n→ ${gatewayProduct} — $${gatewayPrice}\n[Your Name]\n\nnewmrr.com`,

    'pricing-worksheet': `PRICING CALCULATOR WORKSHEET\nPersonalized for: ${skill}\nNewMRR Wealth Group\n${'='.repeat(40)}\n\nYOUR NUMBERS\nAudience: ${audience}\nMonthly Target: $${monthlyTarget}\nCustomers Needed: ${dailyTarget}\n\nGATEWAY PRODUCT\n${gatewayProduct}: $${gatewayPrice}\nMargin: ~80%\nProfit per sale: $${Math.round(Number(gatewayPrice) * 0.8)}\n\nRECURRING MODEL\n${recurringModel}: $${recurringPrice}/mo\nAt ${dailyTarget} customers: $${monthlyTarget}/mo\nAnnual: $${Number(monthlyTarget) * 12}\n\nPRICE INCREASE SCENARIOS\n$${recurringPrice}/mo x ${dailyTarget} = $${monthlyTarget}/mo (current)\n$${Math.round(Number(recurringPrice)*1.25)}/mo x ${dailyTarget} = $${Math.round(Number(recurringPrice)*1.25*Number(dailyTarget))}/mo (+25%)\n$${Math.round(Number(recurringPrice)*1.5)}/mo x ${dailyTarget} = $${Math.round(Number(recurringPrice)*1.5*Number(dailyTarget))}/mo (+50%)\n\nPATH TO $1M/YEAR\nCustomers needed: ${Math.ceil(1000000/(Number(recurringPrice)*12))}\nProducts needed at ${dailyTarget} customers: ${Math.ceil(Math.ceil(1000000/(Number(recurringPrice)*12))/Number(dailyTarget))}\n\nnewmrr.com`,

    'product-stacking': `PRODUCT STACKING FRAMEWORK\nPersonalized for: ${skill}\nNewMRR Wealth Group\n${'='.repeat(40)}\n\nYOUR 4-PRODUCT STACK\n\nPRODUCT 1 (Now — Entry Point)\n${gatewayProduct}\nPrice: $${gatewayPrice} one-time\nGoal: First sale within 30 days\n\nPRODUCT 2 (Month 2 — Recurring)\n${recurringModel}\nPrice: $${recurringPrice}/month\nGoal: Convert Product 1 buyers to MRR\n\nPRODUCT 3 (Month 4 — Premium)\nAdvanced ${skill} Intensive\nPrice: $${Math.round(Number(recurringPrice)*3)}-$${Math.round(Number(recurringPrice)*5)}\nGoal: High-ticket for best customers\n\nPRODUCT 4 (Month 6 — Scalable)\n${skill} Group Program\nPrice: $${Math.round(Number(gatewayPrice)*2)}-$${Math.round(Number(gatewayPrice)*4)}\nGoal: Serve more without more time\n\nFULL STACK REVENUE\nProduct 1 (${Math.round(Number(dailyTarget)/2)}/mo): $${Math.round(Number(dailyTarget)/2*Number(gatewayPrice))}/mo\nProduct 2 (${dailyTarget} customers): $${monthlyTarget}/mo\nProduct 3 (2/mo): $${Math.round(Number(recurringPrice)*4*2)}/mo\nProduct 4 (5/mo): $${Math.round(Number(gatewayPrice)*3*5)}/mo\n\nnewmrr.com`,

    'exit-checklist': `EXIT READINESS CHECKLIST\nPersonalized for: ${skill}\nNewMRR Wealth Group\n${'='.repeat(40)}\n\nFINANCIAL READINESS\n[ ] Clean books — separate business account\n[ ] Track MRR monthly (target: $${monthlyTarget}/mo)\n[ ] Document all revenue streams\n[ ] Know your churn rate\n[ ] Calculate LTV: $${recurringPrice} x avg months\n\nExit target MRR: $${Math.round(Number(monthlyTarget)*3)}\nEstimated exit value: $${Math.round(Number(monthlyTarget)*3*12*3).toLocaleString()}-$${Math.round(Number(monthlyTarget)*3*12*5).toLocaleString()}\n(3-5x annual revenue)\n\nBRAND EQUITY\n[ ] Own your customer email list\n[ ] Have documented case studies\n[ ] ${audience} know your name\n[ ] Testimonials collected\n[ ] Brand assets documented\n\nOPERATIONS\n[ ] ${skill} delivery documented\n[ ] Onboarding process written\n[ ] Customer templates created\n[ ] Refund policy documented\n\nMoran: "Build for the exit from day one."\n\nnewmrr.com`,

    'email-flows': `7 EMAIL FLOWS FOR RECURRING REVENUE\nPersonalized for: ${skill}\nNewMRR Wealth Group\n${'='.repeat(40)}\n\nFLOW 1: WELCOME (New sub → First sale)\nTrigger: Joins email list\nGoal: Convert to ${gatewayProduct} at $${gatewayPrice}\nDay 0: Welcome + your story\nDay 1: The problem ${audience} face\nDay 3: Social proof\nDay 5: How ${gatewayProduct} works\nDay 7: CTA — $${gatewayPrice}\n\nFLOW 2: POST-PURCHASE (Buyer → Happy customer)\nTrigger: Buys ${gatewayProduct}\nGoal: Great experience + upsell to $${recurringPrice}/mo\nDay 0: You are in — here's what happens\nDay 2: Check in\nDay 5: Success tip for ${skill}\nDay 7: Introduce ${recurringModel}\n\nFLOW 3: ABANDONED CART\nTrigger: Visited payment page, no purchase\n30 min: "Did something go wrong?"\n6 hrs: Reminder of what they get\n24 hrs: "Last chance"\n\nFLOW 4: RECURRING UPSELL\nTrigger: 7 days after gateway purchase\nDay 7: "Ready for the next level?"\nDay 10: ${recurringModel} at $${recurringPrice}/mo\n\nFLOW 5: PROFIT MAKER\nTrigger: 30 days as member\nDay 30: Premium ${skill} offer\n\nFLOW 6: VIP REPEAT CUSTOMER\nTrigger: 90 days as customer\nDay 90: Special offer + testimonial ask\n\nFLOW 7: RE-ENGAGEMENT\nTrigger: No open in 60 days\nDay 0: "Still interested in ${skill}?"\nDay 7: "One more thing"\nDay 14: "Unsubscribing you now"\n\nEmail flows = 15-30% of total revenue.\n\nnewmrr.com`,
  }

  return resources[resource] || 'Resource not found'
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const resource = searchParams.get('resource') || ''
  const data: Record<string, string> = {
    skill: searchParams.get('skill') || 'Your Skill',
    audience: searchParams.get('audience') || 'Your Audience',
    gatewayProduct: searchParams.get('gatewayProduct') || 'Your Gateway Product',
    gatewayPrice: searchParams.get('gatewayPrice') || '197',
    recurringModel: searchParams.get('recurringModel') || 'Your Recurring Model',
    recurringPrice: searchParams.get('recurringPrice') || '97',
    phase: searchParams.get('phase') || 'grind',
    monthlyTarget: searchParams.get('monthlyTarget') || '5000',
    dailyTarget: searchParams.get('dailyTarget') || '25',
  }

  const content = generateContent(resource, data)
  const filename = `newmrr-${resource}-${data.skill.toLowerCase().replace(/\s+/g, '-')}.txt`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
