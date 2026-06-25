'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuditResult } from '@/lib/audit-engine'

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<AuditResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('auditResult')
    const answersStored = sessionStorage.getItem('auditAnswers')
    if (!stored) {
      router.push('/audit')
      return
    }
    const rawResult = JSON.parse(stored)
    if (rawResult._groqCleaned) {
      setResult(rawResult)
      setLoading(false)
      return
    }
    async function processWithGroq() {
      try {
        const answers = answersStored ? JSON.parse(answersStored) : []
        const res = await fetch('/api/process-audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers }),
        })
        const data = await res.json()
        if (data.success && data.cleaned) {
          const enhanced = {
            ...rawResult,
            skillLabel: data.cleaned.skillLabel,
            gatewayProduct: data.cleaned.gatewayProductName,
            recurringModel: data.cleaned.recurringModelName,
            audience: data.cleaned.audienceLabel,
            headline: 'Your ' + data.cleaned.skillLabel + ' Is Worth $' + rawResult.monthlyRevenuePotential.toLocaleString() + '/Month',
            _groqCleaned: true,
          }
          sessionStorage.setItem('auditResult', JSON.stringify(enhanced))
          setResult(enhanced)
        } else {
          setResult(rawResult)
        }
      } catch {
        setResult(rawResult)
      }
      setLoading(false)
    }
    setTimeout(processWithGroq, 600)
  }, [router])

  async function handleCheckout(product: 'founding_member' | 'strategy_session' | 'presell') {
    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, auditResult: result }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (err) {
      console.error(err)
      setCheckoutLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid var(--border)', borderTopColor: 'var(--gold)', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Analyzing your answers…</p>
      </div>
    )
  }

  if (!result) return null

  const phaseColors = { grind: '#FF6432', growth: '#C9A84C', gold: '#2ECC71' }
  const phaseColor = phaseColors[result.phase]

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '48px 24px 80px' }}>
      <div style={{ marginBottom: 48 }}>
        <div style={{ marginBottom: 16 }}>
          <span className={`phase-badge phase-${result.phase}`}>{result.phaseLabel}</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 16 }}>
          {result.headline}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 640 }}>
          {result.subheadline}
        </p>
      </div>

      <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, var(--surface) 0%, rgba(201,168,76,0.05) 100%)' }}>
        <p style={{ color: 'var(--gold)', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 20 }}>
          Your Revenue Projection
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, textAlign: 'center' }}>
          {[
            { label: 'Per Customer / Month', value: `$${result.recurringPrice.toLocaleString()}` },
            { label: 'Monthly Target', value: `$${result.monthlyRevenuePotential.toLocaleString()}` },
            { label: 'Annual Potential', value: `$${result.annualRevenuePotential.toLocaleString()}` },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--gold)', fontFamily: 'Syne, sans-serif', lineHeight: 1 }}>{s.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24, gap: 16 }}>
        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-dim)', fontWeight: 600, marginBottom: 12 }}>Your Gateway Product</p>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{result.gatewayProduct}</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ color: 'var(--gold)', fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Syne, sans-serif' }}>${result.gatewayPrice}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>one-time entry point</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 10, lineHeight: 1.6 }}>Validate demand before going all in. Sell this first.</p>
        </div>
        <div className="card" style={{ padding: 24, borderColor: 'var(--gold)', background: 'var(--gold-dim)' }}>
          <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold)', fontWeight: 600, marginBottom: 12 }}>Your Recurring Model (MRR)</p>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{result.recurringModel}</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ color: 'var(--gold)', fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Syne, sans-serif' }}>${result.recurringPrice}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>/month per customer</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 10, lineHeight: 1.6 }}>This is where MRR starts. {result.dailySalesTarget} customers = your target.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 48 }}>
        <p style={{ color: phaseColor, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>{result.phaseLabel}</p>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 24 }}>Your 90-Day Action Plan</h3>
        <div>
          {result.actionPlan.map((step, i) => (
            <div key={i} className="check-item">
              <div className="check-dot" style={{ borderColor: phaseColor, background: `${phaseColor}20` }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: phaseColor }} />
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, var(--surface) 0%, rgba(201,168,76,0.08) 100%)', borderColor: 'var(--gold)' }}>
        <p style={{ color: 'var(--gold)', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>Ready to Build</p>
        <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, marginBottom: 12 }}>Unlock Your Full NewMRR Dashboard</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.7, fontSize: '0.95rem' }}>
          Weekly missions. Revenue calculator. Resource library. 90-Day plan. Everything personalized from your audit.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420, margin: '0 auto' }}>
          <button onClick={() => handleCheckout('founding_member')} disabled={checkoutLoading} className="btn-primary" style={{ fontSize: '1rem', padding: '16px 32px', width: '100%' }}>
            {checkoutLoading ? 'Loading…' : 'Join as Founding Member — $47/mo →'}
          </button>
          <button onClick={() => handleCheckout('presell')} disabled={checkoutLoading} className="btn-ghost" style={{ width: '100%' }}>
            One-time Founding Access — $297
          </button>
          <button onClick={() => handleCheckout('strategy_session')} disabled={checkoutLoading} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '0.85rem', cursor: 'pointer', padding: '8px' }}>
            Book a 1-on-1 Strategy Session ($197) →
          </button>
        </div>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.78rem', marginTop: 20 }}>Cancel anytime. 30-day refund policy. Stripe-secured checkout.</p>
      </div>

      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <Link href="/audit" style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>← Retake the audit with different answers</Link>
      </div>
    </div>
  )
}
