// The Skill-to-Revenue Mapping Engine
// Built on proven entrepreneur framework

export type SkillCategory = 'consultant' | 'coach' | 'creator' | 'productized'

export interface AuditAnswer {
  questionId: string
  value: string | string[]
}

export interface AuditResult {
  skillCategory: SkillCategory
  skillLabel: string
  audience: string
  entryOffer: string
  gatewayPrice: number
  recurringModel: string
  recurringPrice: number
  dailySalesTarget: number
  monthlyRevenuePotential: number
  annualRevenuePotential: number
  phase: 'foundation' | 'momentum' | 'scale'
  phaseLabel: string
  actionPlan: string[]
  headline: string
  subheadline: string
}

export const AUDIT_QUESTIONS = [
  {
    id: 'skill',
    question: "What's the ONE thing people consistently come to you for?",
    subtext: 'The skill you could teach in your sleep. Be specific.',
    type: 'text',
    placeholder: 'e.g. closing high-ticket sales, building Shopify stores, writing copy...',
  },
  {
    id: 'years',
    question: 'How long have you been doing this?',
    type: 'single',
    options: ['Under 1 year', '1–3 years', '3–7 years', '7+ years'],
  },
  {
    id: 'audience',
    question: 'Who would pay the most for this skill?',
    subtext: 'Think about who has the PROBLEM your skill solves.',
    type: 'single',
    options: [
      'Small business owners / entrepreneurs',
      'Corporate professionals / employees',
      'Freelancers / solopreneurs',
      'Consumers (everyday people)',
    ],
  },
  {
    id: 'outcome',
    question: "What's the #1 outcome your skill delivers?",
    subtext: 'What changes for them after working with you?',
    type: 'single',
    options: [
      'They make more money',
      'They save significant time',
      'They feel less stressed / more confident',
      'They build something they couldn\'t before',
    ],
  },
  {
    id: 'delivery',
    question: 'How do you currently deliver this skill?',
    type: 'single',
    options: [
      '1-on-1 (calls, consulting, freelance work)',
      'Done-for-you (I just do it for them)',
      'Teaching / coaching groups',
      'I haven\'t monetized it yet',
    ],
  },
  {
    id: 'priceComfort',
    question: 'What price feels natural for your skill right now?',
    type: 'single',
    options: [
      'Under $100',
      '$100–$500',
      '$500–$2,000',
      '$2,000+',
    ],
  },
  {
    id: 'timePerWeek',
    question: 'How many hours per week can you dedicate to building this?',
    type: 'single',
    options: ['1–5 hours', '5–15 hours', '15–30 hours', '30+ hours'],
  },
  {
    id: 'audienceBuilt',
    question: 'Do you already have an audience or following?',
    subtext: 'Email list, social following, past clients — any of these count.',
    type: 'single',
    options: [
      'No audience yet',
      'Small — under 100 people',
      'Medium — 100–1,000 people',
      'Large — 1,000+ people',
    ],
  },
  {
    id: 'biggestBlock',
    question: "What's your biggest block right now?",
    type: 'single',
    options: [
      'I don\'t know what to sell or how to package it',
      'I don\'t have enough customers / leads',
      'I can\'t scale — too much of my time required',
      'I don\'t know how to make it recurring',
    ],
  },
  {
    id: 'revenueGoal',
    question: "What's your revenue target for the next 12 months?",
    type: 'single',
    options: [
      '$1,000–$5,000/month',
      '$5,000–$10,000/month',
      '$10,000–$50,000/month',
      '$50,000+/month',
    ],
  },
]

function detectSkillCategory(answers: AuditAnswer[]): SkillCategory {
  const delivery = answers.find(a => a.questionId === 'delivery')?.value as string
  const priceComfort = answers.find(a => a.questionId === 'priceComfort')?.value as string
  const block = answers.find(a => a.questionId === 'biggestBlock')?.value as string

  if (delivery === 'Done-for-you (I just do it for them)') return 'productized'
  if (delivery === 'Teaching / coaching groups') return 'coach'
  if (priceComfort === '$2,000+' || delivery === '1-on-1 (calls, consulting, freelance work)') return 'consultant'
  if (block === 'I can\'t scale — too much of my time required') return 'productized'
  return 'creator'
}

function getSkillLabel(category: SkillCategory, skill: string): string {
  const labels: Record<SkillCategory, string> = {
    consultant: `${skill} Consultant`,
    coach: `${skill} Coach`,
    creator: `${skill} Expert`,
    productized: `${skill} Service`,
  }
  return labels[category]
}

function getGatewayProduct(category: SkillCategory, skill: string, audience: string): { product: string; price: number } {
  const products: Record<SkillCategory, { product: string; price: number }> = {
    consultant: {
      product: `90-Minute ${skill} Strategy Session`,
      price: 197,
    },
    coach: {
      product: `${skill} Starter Workshop (4 weeks)`,
      price: 297,
    },
    creator: {
      product: `${skill} Masterclass + Resource Pack`,
      price: 97,
    },
    productized: {
      product: `Done-For-You ${skill} Starter Package`,
      price: 497,
    },
  }
  return products[category]
}

function getRecurringModel(category: SkillCategory, skill: string): { model: string; price: number } {
  const models: Record<SkillCategory, { model: string; price: number }> = {
    consultant: {
      model: `Monthly ${skill} Retainer (2 calls + async support)`,
      price: 997,
    },
    coach: {
      model: `${skill} Membership Community`,
      price: 97,
    },
    creator: {
      model: `${skill} Content Subscription`,
      price: 47,
    },
    productized: {
      model: `Monthly ${skill} Maintenance Plan`,
      price: 497,
    },
  }
  return models[category]
}

function getDailySalesTarget(revenueGoal: string, recurringPrice: number): number {
  const goalMap: Record<string, number> = {
    '$1,000–$5,000/month': 3000,
    '$5,000–$10,000/month': 7500,
    '$10,000–$50,000/month': 25000,
    '$50,000+/month': 50000,
  }
  const monthlyTarget = goalMap[revenueGoal] || 5000
  // formula: daily sales to hit target
  return Math.ceil(monthlyTarget / recurringPrice)
}

function getPhase(audienceBuilt: string, delivery: string): { phase: 'foundation' | 'momentum' | 'scale'; label: string } {
  if (audienceBuilt === 'Large — 1,000+ people') {
    return { phase: 'scale', label: 'The Scale — Ready to Scale' }
  }
  if (audienceBuilt === 'Medium — 100–1,000 people' || delivery !== 'I haven\'t monetized it yet') {
    return { phase: 'momentum', label: 'The Momentum — Building Momentum' }
  }
  return { phase: 'foundation', label: 'The Foundation — Where It All Starts' }
}

function getActionPlan(phase: 'foundation' | 'momentum' | 'scale', category: SkillCategory): string[] {
  const plans: Record<'foundation' | 'momentum' | 'scale', string[]> = {
    foundation: [
      'This week: Identify your first 100 target audience members (LinkedIn, Facebook groups, Reddit)',
      'Week 2: Reach out to 10 of them. Ask what their #1 pain point is — don\'t sell yet',
      'Week 3: Package your skill into the entry offer. Price it. Build a simple checkout page',
      'Week 4: Pre-sell to the people you\'ve been talking to. Goal: 3 paying customers',
      'Month 2: Deliver exceptional results. Get testimonials. Ask for referrals',
      'Month 3: Launch your recurring model to your first buyers. This is where MRR starts',
    ],
    momentum: [
      'This week: Set up your recurring offer and payment link if you haven\'t already',
      'Week 2: Email your existing audience or past clients. Offer the entry offer',
      'Week 3: Post 3x per week on the platform where your audience lives — teach, don\'t pitch',
      'Month 2: Run a small paid campaign ($10/day) to your best-performing content',
      'Month 3: Add a second product to your existing buyers — they already trust you',
      'Month 4: Hire a VA to handle fulfillment tasks so your time goes to growth',
    ],
    scale: [
      'This week: Audit your current offers — identify what has the highest LTV',
      'Week 2: Build a referral system. Your existing audience will grow your next audience',
      'Week 3: Launch product #2 to your existing audience. Same people, new offer',
      'Month 2: Test paid traffic to your best-converting offer. Scale what works',
      'Month 3: Document your systems. Build for exit readiness from now',
      'Month 4: Stack product #3. You\'re in The Scale phase — 100 sales/day is achievable',
    ],
  }
  return plans[phase]
}

function getHeadline(skillLabel: string, monthlyRevenuePotential: number): string {
  return `Your ${skillLabel} Is Worth $${(monthlyRevenuePotential).toLocaleString()}/Month`
}

export function calculateAuditResult(answers: AuditAnswer[]): AuditResult {
  const skillAnswer = answers.find(a => a.questionId === 'skill')?.value as string || 'Your Skill'
  const audienceAnswer = answers.find(a => a.questionId === 'audience')?.value as string || 'Business Owners'
  const revenueGoal = answers.find(a => a.questionId === 'revenueGoal')?.value as string || '$5,000–$10,000/month'
  const audienceBuilt = answers.find(a => a.questionId === 'audienceBuilt')?.value as string || 'No audience yet'
  const deliveryAnswer = answers.find(a => a.questionId === 'delivery')?.value as string || ''

  const category = detectSkillCategory(answers)
  const skillLabel = getSkillLabel(category, skillAnswer)
  const { product: entryOffer, price: gatewayPrice } = getGatewayProduct(category, skillAnswer, audienceAnswer)
  const { model: recurringModel, price: recurringPrice } = getRecurringModel(category, skillAnswer)
  const dailySalesTarget = getDailySalesTarget(revenueGoal, recurringPrice)
  const monthlyRevenuePotential = dailySalesTarget * recurringPrice
  const { phase, label: phaseLabel } = getPhase(audienceBuilt, deliveryAnswer)
  const actionPlan = getActionPlan(phase, category)

  return {
    skillCategory: category,
    skillLabel,
    audience: audienceAnswer,
    entryOffer,
    gatewayPrice,
    recurringModel,
    recurringPrice,
    dailySalesTarget,
    monthlyRevenuePotential,
    annualRevenuePotential: monthlyRevenuePotential * 12,
    phase,
    phaseLabel,
    actionPlan,
    headline: getHeadline(skillLabel, monthlyRevenuePotential),
    subheadline: `Here's your personalized path to $${(monthlyRevenuePotential * 12).toLocaleString()}/year — built on the framework that's helped 300+ entrepreneurs hit 7 figures.`,
  }
}
