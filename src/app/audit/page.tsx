'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { calculateAuditResult } from '@/lib/audit-engine'

const QUESTIONS = [
  {
    id: 'first_name',
    question: "What is your first name?",
    subtext: "We will use this to personalize everything for you.",
    type: 'text',
    placeholder: 'First name',
    autoSave: true,
  },
  {
    id: 'last_name',
    question: "And your last name?",
    type: 'text',
    placeholder: 'Last name',
    autoSave: true,
  },
  {
    id: 'email',
    question: "What's your best email address?",
    subtext: "We'll send your personalized results here.",
    type: 'email',
    placeholder: 'you@example.com',
    autoSave: true,
  },
  {
    id: 'skill',
    question: "What's the skill or service you get paid for — or want to get paid for?",
    subtext: 'Be specific. The more detail the better.',
    type: 'textarea',
    placeholder: 'e.g. I help small businesses set up their sales process and close more clients...',
  },
  {
    id: 'industry',
    question: 'What industry are you in?',
    subtext: 'The space your clients operate in.',
    type: 'text',
    placeholder: 'e.g. Real estate, Health and wellness, E-commerce, Finance...',
  },
  {
    id: 'niche',
    question: 'What specific niche within that industry?',
    subtext: 'The more specific, the better your results.',
    type: 'text',
    placeholder: 'e.g. Luxury residential real estate, Postpartum fitness, Shopify brands...',
  },
  {
    id: 'city',
    question: 'What city are you based in?',
    type: 'text',
    placeholder: 'e.g. Philadelphia, PA',
  },
  {
    id: 'dream_client',
    question: 'Describe your dream client in their own words.',
    subtext: 'Not a job title. How would THEY describe themselves?',
    type: 'textarea',
    placeholder: 'e.g. A solo consultant who is great at their work but struggling to find consistent clients...',
  },
  {
    id: 'client_problem',
    question: "What is the number one problem your clients have before they find you?",
    subtext: 'Use the exact words they would use to describe it.',
    type: 'textarea',
    placeholder: 'e.g. They say things like I have the skills but I do not know how to get clients consistently...',
  },
  {
    id: 'result_delivered',
    question: 'What specific result do you deliver for your clients?',
    subtext: 'Be as exact as possible. Numbers are gold.',
    type: 'textarea',
    placeholder: 'e.g. My clients typically land 3 to 5 new clients within their first 60 days working with me...',
  },
  {
    id: 'result_timeframe',
    question: 'How long does it take to get that result?',
    type: 'text',
    placeholder: 'e.g. 30 days, 90 days, 6 months...',
  },
  {
    id: 'biggest_win',
    question: "What is your biggest client win so far?",
    subtext: 'Your best story. Numbers if you have them.',
    type: 'textarea',
    placeholder: 'e.g. I helped a client go from zero to 8k per month in 45 days by restructuring their offer...',
  },
  {
    id: 'audience',
    question: 'Who would pay the most for this skill?',
    type: 'single',
    options: [
      'Small business owners / entrepreneurs',
      'Corporate professionals / employees',
      'Freelancers / solopreneurs',
      'Consumers (everyday people)',
    ],
  },
  {
    id: 'delivery',
    question: 'How do you currently deliver your service?',
    type: 'single',
    options: [
      '1-on-1 (calls, consulting, freelance work)',
      'Done-for-you (I handle everything for them)',
      'Teaching / coaching groups',
      'I have not monetized it yet',
    ],
  },
  {
    id: 'current_acquisition',
    question: 'How are you currently finding new clients?',
    type: 'single',
    options: [
      'Word of mouth / referrals only',
      'Social media (posting content)',
      'Cold outreach (DMs, emails, calls)',
      'I am not finding clients yet',
    ],
  },
  {
    id: 'priceComfort',
    question: 'What price feels natural to charge right now?',
    type: 'single',
    options: ['Under $100', '$100 to $500', '$500 to $2,000', '$2,000+'],
  },
  {
    id: 'timePerWeek',
    question: 'How many hours per week can you dedicate to building this?',
    type: 'single',
    options: ['1 to 5 hours', '5 to 15 hours', '15 to 30 hours', '30+ hours'],
  },
  {
    id: 'biggestBlock',
    question: "What is your biggest block right now?",
    type: 'single',
    options: [
      'I do not know what to sell or how to package it',
      'I do not have enough customers or leads',
      'I cannot scale because too much of my time is required',
      'I do not know how to make it recurring',
    ],
  },
  {
    id: 'revenueGoal',
    question: "What is your revenue target for the next 12 months?",
    type: 'single',
    options: [
      '$1,000 to $5,000 per month',
      '$5,000 to $10,000 per month',
      '$10,000 to $50,000 per month',
      '$50,000+ per month',
    ],
  },
]

export default function AuditPage() {
  const router = useRouter()
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [textValue, setTextValue] = useState('')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const emailRef = useRef<string>('')

  const question = QUESTIONS[currentQ]
  const progress = (currentQ / QUESTIONS.length) * 100
  const currentAnswer = answers[question.id]

  async function autoSave(fieldId: string, value: string, currentAnswers?: Record<string, string>) {
    const allAnswers = currentAnswers || answers
    const emailToUse = fieldId === 'email' ? value : (emailRef.current || allAnswers.email)
    if (!emailToUse) return

    // Build payload from ALL answers we have so far
    const payload: Record<string, string> = {
      email: emailToUse,
      trigger: 'partial',
    }

    // Include all existing answers
    Object.entries(allAnswers).forEach(([key, val]) => {
      if (val) payload[key] = val
    })

    // Override with the current field being saved
    payload[fieldId] = value

    // Map field IDs to Supabase column names
    const fieldMap: Record<string, string> = {
      priceComfort: 'price_comfort',
      biggestBlock: 'biggest_block',
      revenueGoal: 'revenue_goal',
      timePerWeek: 'time_per_week',
    }
    Object.entries(fieldMap).forEach(([key, dbKey]) => {
      if (payload[key]) {
        payload[dbKey] = payload[key]
      }
    })

    try {
      await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch (err) {
      console.error('Auto-save error:', err)
    }
  }

  function handleOption(value: string) {
    const updated = { ...answers, [question.id]: value }
    setAnswers(updated)
    autoSave(question.id, value, updated)
    advance(updated)
  }

  function handleTextNext() {
    if (!textValue.trim()) return
    const updated = { ...answers, [question.id]: textValue.trim() }
    if (question.id === 'email') emailRef.current = textValue.trim()
    // Always auto-save every field
    autoSave(question.id, textValue.trim(), updated)
    setAnswers(updated)
    advance(updated)
  }

  function handleTextBlur() {
    if (!textValue.trim()) return
    if (question.id === 'email') emailRef.current = textValue.trim()
    // Save on blur for every field
    autoSave(question.id, textValue.trim())
  }

  function advance(updatedAnswers: Record<string, string>) {
    setIsTransitioning(true)
    setTimeout(async () => {
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1)
        setTextValue('')
        setIsTransitioning(false)
      } else {
        setSubmitting(true)
        await submitAudit(updatedAnswers)
      }
    }, 300)
  }

  async function submitAudit(finalAnswers: Record<string, string>) {
    const auditAnswers = Object.entries(finalAnswers).map(([questionId, value]) => ({ questionId, value }))
    const result = calculateAuditResult(auditAnswers)
    sessionStorage.setItem('auditResult', JSON.stringify(result))
    sessionStorage.setItem('auditAnswers', JSON.stringify(auditAnswers))

    try {
      await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: finalAnswers.email,
          first_name: finalAnswers.first_name,
          last_name: finalAnswers.last_name,
          skill: finalAnswers.skill,
          industry: finalAnswers.industry,
          niche: finalAnswers.niche,
          city: finalAnswers.city,
          dream_client: finalAnswers.dream_client,
          client_problem: finalAnswers.client_problem,
          result_delivered: finalAnswers.result_delivered,
          result_timeframe: finalAnswers.result_timeframe,
          biggest_win: finalAnswers.biggest_win,
          audience: finalAnswers.audience,
          delivery: finalAnswers.delivery,
          current_acquisition: finalAnswers.current_acquisition,
          price_comfort: finalAnswers.priceComfort,
          biggest_block: finalAnswers.biggestBlock,
          revenue_goal: finalAnswers.revenueGoal,
          audit_complete: true,
          phase: result.phase,
          monthly_potential: result.monthlyRevenuePotential,
          trigger: 'audit_complete',
        }),
      })
    } catch (err) {
      console.error('Submit error:', err)
    }

    router.push('/results')
  }

  function goBack() {
    if (currentQ > 0) {
      const prevQ = QUESTIONS[currentQ - 1]
      setCurrentQ(currentQ - 1)
      setTextValue(answers[prevQ.id] || '')
    }
  }

  if (submitting) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid var(--border)', borderTopColor: 'var(--gold)', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Building your revenue map...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'fixed', top: 64, left: 0, right: 0, zIndex: 50 }}>
        <div className="progress-track" style={{ borderRadius: 0 }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 40px' }}>
        <div style={{ width: '100%', maxWidth: 620 }}>

          <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Question <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{currentQ + 1}</span> of {QUESTIONS.length}
            </span>
            {currentQ > 0 && (
              <button onClick={goBack} style={{ color: 'var(--text-muted)', fontSize: '0.85rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                Back
              </button>
            )}
          </div>

          <div style={{ opacity: isTransitioning ? 0 : 1, transform: isTransitioning ? 'translateY(-10px)' : 'translateY(0)', transition: 'all 0.3s ease' }}>
            <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>
              {question.question}
            </h2>
            {question.subtext && (
              <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: '0.95rem' }}>{question.subtext}</p>
            )}
            {!question.subtext && <div style={{ marginBottom: 32 }} />}

            {(question.type === 'text' || question.type === 'email') && (
              <div>
                <input
                  type={question.type}
                  value={textValue}
                  onChange={e => setTextValue(e.target.value)}
                  onBlur={handleTextBlur}
                  placeholder={question.placeholder}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleTextNext() } }}
                  style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px', color: 'var(--text)', fontSize: '1rem', outline: 'none' }}
                  autoFocus
                  onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Press Enter to continue</span>
                  <button onClick={handleTextNext} disabled={!textValue.trim()} className="btn-primary">Next</button>
                </div>
              </div>
            )}

            {question.type === 'textarea' && (
              <div>
                <textarea
                  value={textValue}
                  onChange={e => setTextValue(e.target.value)}
                  placeholder={question.placeholder}
                  rows={4}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTextNext() } }}
                  style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px', color: 'var(--text)', fontSize: '1rem', resize: 'none', outline: 'none', lineHeight: 1.6 }}
                  autoFocus
                  onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Shift+Enter for new line</span>
                  <button onClick={handleTextNext} disabled={!textValue.trim()} className="btn-primary">Next</button>
                </div>
              </div>
            )}

            {question.type === 'single' && question.options && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {question.options.map((opt) => {
                  const isSelected = currentAnswer === opt
                  return (
                    <button key={opt} onClick={() => handleOption(opt)} style={{ background: isSelected ? 'var(--gold-dim)' : 'var(--surface)', border: `1px solid ${isSelected ? 'var(--gold)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '16px 20px', color: isSelected ? 'var(--gold)' : 'var(--text)', fontSize: '0.95rem', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease', fontWeight: isSelected ? 600 : 400, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, border: `2px solid ${isSelected ? 'var(--gold)' : 'var(--border)'}`, background: isSelected ? 'var(--gold)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isSelected && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--charcoal)' }} />}
                      </span>
                      {opt}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '0 0 32px', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
        Your answers are saved automatically. Free assessment — no credit card required.
      </div>
    </div>
  )
}
