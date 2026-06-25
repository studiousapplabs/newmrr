'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AuditResult } from '@/lib/audit-engine'
import MissionTab from './MissionTab'
import { Suspense } from 'react'

function DashboardContent() {
  const searchParams = useSearchParams()
  const [result, setResult] = useState<AuditResult | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'plan' | 'calculator' | 'resources' | 'mission'>('mission')
  const [calcPrice, setCalcPrice] = useState(47)
  const [calcCustomers, setCalcCustomers] = useState(25)
  const [calcProducts, setCalcProducts] = useState(3)

  const sessionId = searchParams.get('session_id')
  const product = searchParams.get('product')

  const [biggestBlock, setBiggestBlock] = useState('')

  useEffect(() => {
    const stored = sessionStorage.getItem('auditResult')
    if (stored) {
      const r = JSON.parse(stored)
      setResult(r)
      setCalcPrice(r.recurringPrice || 47)
      setCalcCustomers(r.dailySalesTarget || 25)
      const answers = JSON.parse(sessionStorage.getItem('auditAnswers') || '[]')
      const block = answers.find((a: {questionId: string; value: string}) => a.questionId === 'biggestBlock')?.value || ''
      setBiggestBlock(block)
    }
  }, [])

  const monthlyRevenue = calcPrice * calcCustomers * calcProducts
  const annualRevenue = monthlyRevenue * 12
  const toMillion = Math.max(0, 1000000 - annualRevenue)
  const progressToMillion = Math.min(100, (annualRevenue / 1000000) * 100)

  const phaseColors: Record<string, string> = { grind: '#FF6432', growth: '#C9A84C', gold: '#2ECC71' }
  const phaseColor = result ? phaseColors[result.phase] : '#C9A84C'

  function getDownloadUrl(resourceId: string) {
    if (!result) return '#'
    const params = new URLSearchParams({
      resource: resourceId,
      skill: result.skillLabel || 'Your Skill',
      audience: result.audience || 'Your Audience',
      entryOffer: result.entryOffer || 'Your Entry Offer',
      gatewayPrice: result.gatewayPrice?.toString() || '197',
      recurringModel: result.recurringModel || 'Your Recurring Model',
      recurringPrice: result.recurringPrice?.toString() || '97',
      phase: result.phase || 'foundation',
      monthlyTarget: result.monthlyRevenuePotential?.toString() || '5000',
      dailyTarget: result.dailySalesTarget?.toString() || '25',
    })
    return `/api/download?${params.toString()}`
  }

  const RESOURCES = [
    { category: 'The Foundation', title: 'Outreach Script (Connect Script)', desc: 'Tell/Ask/Go — personalized with your skill and audience', tag: 'Script', id: 'outreach-script' },
    { category: 'The Foundation', title: 'Entry Offer Launch Checklist', desc: '14 steps personalized to your entry offer and price', tag: 'Checklist', id: 'gateway-checklist' },
    { category: 'The Momentum', title: 'Launch Blitz: Pre-Launch Playbook', desc: 'The Influence Method tailored to your audience and offer', tag: 'Playbook', id: 'prelaunch-playbook' },
    { category: 'The Momentum', title: '5-Email Welcome Sequence', desc: 'Email scripts with your skill, price, and audience filled in', tag: 'Templates', id: 'email-sequence' },
    { category: 'The Momentum', title: 'Pricing Calculator Worksheet', desc: 'Your numbers, your path to $1M — pre-calculated', tag: 'Worksheet', id: 'pricing-worksheet' },
    { category: 'The Scale', title: 'Offer Stacking Framework', desc: '4-product stack built around your specific skill', tag: 'Framework', id: 'product-stacking' },
    { category: 'The Scale', title: 'Exit Readiness Checklist', desc: 'Exit targets calculated from your current revenue model', tag: 'Checklist', id: 'exit-checklist' },
    { category: 'The Scale', title: 'Revenue Email System for Recurring Revenue', desc: 'All 7 flows written for your skill and audience', tag: 'Templates', id: 'email-flows' },
  ]

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px' }}>

      {/* Welcome banner */}
      {sessionId && (
        <div style={{
          background: 'rgba(46,204,113,0.1)', border: '1px solid rgba(46,204,113,0.3)',
          borderRadius: 'var(--radius)', padding: '16px 20px', marginBottom: 32,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: '1.2rem' }}>✓</span>
          <div>
            <div style={{ fontWeight: 700, color: '#2ECC71', fontSize: '0.9rem' }}>Payment confirmed — welcome to NewMRR</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Your dashboard is live. Start with your 90-Day Action Plan.</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, marginBottom: 8 }}>
          {result ? result.skillLabel : 'Your'} Dashboard
        </h1>
        {result && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span className={`phase-badge phase-${result.phase}`}>{result.phaseLabel}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Target: <strong style={{ color: 'var(--gold)' }}>${result.monthlyRevenuePotential.toLocaleString()}/mo</strong>
            </span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 32, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {(['mission', 'overview', 'plan', 'calculator', 'resources'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            background: 'none', border: 'none', padding: '10px 16px',
            fontSize: '0.88rem', fontWeight: activeTab === tab ? 700 : 400,
            color: activeTab === tab ? 'var(--gold)' : 'var(--text-muted)',
            borderBottom: activeTab === tab ? '2px solid var(--gold)' : '2px solid transparent',
            marginBottom: -1, cursor: 'pointer', textTransform: 'capitalize',
            transition: 'all 0.15s ease',
          }}>
            {tab === 'mission' ? '🎯 This Week' : tab === 'plan' ? '90-Day Plan' : tab === 'calculator' ? 'Revenue Calc' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'mission' && (
        <MissionTab result={result} biggestBlock={biggestBlock} />
      )}

      {activeTab === 'overview' && result && (
        <div>
          {/* Revenue cards */}
          <div className="grid-3" style={{ marginBottom: 24 }}>
            {[
              { label: 'Monthly Target', value: `$${result.monthlyRevenuePotential.toLocaleString()}`, sub: 'at your target customer count' },
              { label: 'Annual Potential', value: `$${result.annualRevenuePotential.toLocaleString()}`, sub: 'if you hit the milestone' },
              { label: 'Customers Needed', value: result.dailySalesTarget.toString(), sub: `at $${result.recurringPrice}/mo each` },
            ].map(s => (
              <div key={s.label} className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gold)', fontFamily: 'Syne, sans-serif', lineHeight: 1, marginBottom: 8 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 4 }}>
                  {s.label}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Progress to $1M */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>Progress to $1M/year</span>
              <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.9rem' }}>
                {progressToMillion.toFixed(0)}%
              </span>
            </div>
            <div className="progress-track" style={{ height: 8, marginBottom: 12 }}>
              <div className="progress-fill" style={{ width: `${progressToMillion}%` }} />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              {annualRevenue >= 1000000
                ? '🎯 You\'ve hit $1M annual run rate. Time to stack the next product.'
                : `$${toMillion.toLocaleString()} to go. Stack more customers or launch product #2.`}
            </p>
          </div>

          {/* Offers */}
          <div className="grid-2" style={{ gap: 16 }}>
            <div className="card" style={{ padding: 24 }}>
              <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: 10, fontWeight: 600 }}>
                Entry Offer
              </p>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{result.entryOffer}</h3>
              <div style={{ color: 'var(--gold)', fontWeight: 800, fontSize: '1.4rem', fontFamily: 'Syne, sans-serif' }}>
                ${result.gatewayPrice}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 8 }}>Sell this first. Validate before scaling.</p>
            </div>
            <div className="card" style={{ padding: 24, borderColor: 'var(--gold)' }}>
              <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: 10, fontWeight: 600 }}>
                Recurring Model (MRR)
              </p>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{result.recurringModel}</h3>
              <div style={{ color: 'var(--gold)', fontWeight: 800, fontSize: '1.4rem', fontFamily: 'Syne, sans-serif' }}>
                ${result.recurringPrice}<span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-muted)' }}>/mo</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 8 }}>This is your MRR engine.</p>
            </div>
          </div>
        </div>
      )}

      {/* 90-DAY PLAN TAB */}
      {activeTab === 'plan' && result && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>Your 90-Day Action Plan</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Based on your phase: <span style={{ color: phaseColor, fontWeight: 600 }}>{result.phaseLabel}</span>
            </p>
          </div>
          <div className="card">
            {result.actionPlan.map((step, i) => (
              <div key={i} style={{
                display: 'flex', gap: 16, padding: '18px 0',
                borderBottom: i < result.actionPlan.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', background: `${phaseColor}20`,
                  border: `1px solid ${phaseColor}`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0, fontSize: '0.75rem', fontWeight: 700,
                  color: phaseColor, fontFamily: 'Syne, sans-serif',
                }}>
                  {i + 1}
                </div>
                <div>
                  <p style={{ color: 'var(--text)', fontSize: '0.92rem', lineHeight: 1.7 }}>{step}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="card-sm" style={{ marginTop: 20, borderColor: 'rgba(201,168,76,0.2)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.7 }}>
              <strong style={{ color: 'var(--gold)' }}>The rule:</strong> You don&apos;t get 25 sales/day by building complex systems. You get there by doing small things consistently — one customer, one review, one post at a time.
            </p>
          </div>
        </div>
      )}

      {/* REVENUE CALCULATOR TAB */}
      {activeTab === 'calculator' && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>Revenue Calculator</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Adjust the inputs to model your $1M path. The formula: products × customers × price.
            </p>
          </div>

          <div className="grid-2" style={{ gap: 24, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { label: 'Price per customer / month ($)', value: calcPrice, setter: setCalcPrice, min: 10, max: 10000, step: 1 },
                { label: 'Customers / month', value: calcCustomers, setter: setCalcCustomers, min: 1, max: 500, step: 1 },
                { label: 'Products in your stack', value: calcProducts, setter: setCalcProducts, min: 1, max: 10, step: 1 },
              ].map(({ label, value, setter, min, max, step }) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{label}</label>
                    <span style={{ fontWeight: 700, color: 'var(--gold)', fontFamily: 'Syne, sans-serif' }}>
                      {label.includes('$') ? `$${value.toLocaleString()}` : value}
                    </span>
                  </div>
                  <input type="range" min={min} max={max} step={step} value={value}
                    onChange={e => setter(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--gold)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: 4 }}>
                    <span>{label.includes('$') ? `$${min}` : min}</span>
                    <span>{label.includes('$') ? `$${max.toLocaleString()}` : max}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Monthly Revenue', value: `$${monthlyRevenue.toLocaleString()}`, highlight: false },
                { label: 'Annual Revenue', value: `$${annualRevenue.toLocaleString()}`, highlight: true },
                { label: 'To $1M/year', value: toMillion <= 0 ? 'REACHED 🎯' : `$${toMillion.toLocaleString()}`, highlight: false },
              ].map(s => (
                <div key={s.label} className="card" style={{
                  padding: 20, textAlign: 'center',
                  ...(s.highlight ? { borderColor: 'var(--gold)', background: 'var(--gold-dim)' } : {}),
                }}>
                  <div style={{
                    fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Syne, sans-serif',
                    color: s.highlight ? 'var(--gold)' : 'var(--text)', lineHeight: 1, marginBottom: 6,
                  }}>{s.value}</div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                    {s.label}
                  </div>
                </div>
              ))}
              <div className="card-sm">
                <div className="progress-track" style={{ height: 6, marginBottom: 8 }}>
                  <div className="progress-fill" style={{ width: `${progressToMillion}%` }} />
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {progressToMillion.toFixed(1)}% of the way to $1M/year
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESOURCES TAB */}
      {activeTab === 'resources' && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>Resource Library</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Templates, scripts, and playbooks organized by phase.</p>
          </div>
          {(['The Foundation', 'The Momentum', 'The Scale'] as const).map(phase => {
            const phaseResources = RESOURCES.filter(r => r.category === phase)
            const colors: Record<string, string> = { 'The Foundation': '#FF6432', 'The Momentum': '#C9A84C', 'The Scale': '#2ECC71' }
            const c = colors[phase]
            return (
              <div key={phase} style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: c, flexShrink: 0 }} />
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: c }}>{phase}</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {phaseResources.map(r => (
                    <div key={r.title} className="card-sm" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 3 }}>{r.title}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{r.desc}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, marginLeft: 16 }}>
                        <span style={{
                          fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase',
                          letterSpacing: '0.08em', padding: '3px 8px', borderRadius: 4,
                          background: `${c}15`, color: c, border: `1px solid ${c}30`,
                        }}>{r.tag}</span>
                        <a
                          href={getDownloadUrl(r.id)}
                          download
                          style={{
                            background: 'none', border: '1px solid var(--border)', borderRadius: 4,
                            color: 'var(--text-muted)', fontSize: '0.78rem', padding: '4px 10px',
                            cursor: 'pointer', textDecoration: 'none', display: 'inline-block',
                          }}
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
          <div className="card" style={{ textAlign: 'center', padding: 32 }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 16 }}>
              More resources added weekly. Have a specific tool you need?
            </p>
            <a href="mailto:hello@newmrr.com" className="btn-ghost" style={{ display: 'inline-flex' }}>
              Request a Resource →
            </a>
          </div>
        </div>
      )}

    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-muted)' }}>Loading your dashboard…</div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
