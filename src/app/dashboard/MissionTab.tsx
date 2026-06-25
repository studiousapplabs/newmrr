'use client'

import { useEffect, useState } from 'react'
import { AuditResult } from '@/lib/audit-engine'

interface Mission {
  week: number
  title: string
  why: string
  action: string
  script: string
  whenItWorks: string
  whenItDoesnt: string
  moranPrinciple: string
  metric: string
}

interface MissionData {
  mission: Mission
  trackInfo: { phase: string; block: string; trackName: string }
  weekNumber: number
}

export default function MissionTab({ result, biggestBlock }: { result: AuditResult | null; biggestBlock: string }) {
  const [missionData, setMissionData] = useState<MissionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [weekNumber, setWeekNumber] = useState(1)
  const [expandedSection, setExpandedSection] = useState<string | null>('action')

  useEffect(() => {
    // Get week number from localStorage or default to 1
    const stored = localStorage.getItem('newmrr_week')
    const week = stored ? parseInt(stored) : 1
    setWeekNumber(week)
    fetchMission(week)
  }, [result])

  async function fetchMission(week: number) {
    if (!result) return
    setLoading(true)
    try {
      const params = new URLSearchParams({
        phase: result.phase || 'foundation',
        block: biggestBlock || 'I don\'t have enough customers',
        week: week.toString(),
      })
      const res = await fetch(`/api/mission?${params}`)
      const data = await res.json()
      setMissionData(data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  function changeWeek(newWeek: number) {
    const w = Math.max(1, newWeek)
    setWeekNumber(w)
    localStorage.setItem('newmrr_week', w.toString())
    fetchMission(w)
  }

  const phaseColors: Record<string, string> = { grind: '#FF6432', growth: '#C9A84C', gold: '#2ECC71' }
  const phaseColor = result ? phaseColors[result.phase] : '#C9A84C'

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, flexDirection: 'column', gap: 16 }}>
        <div style={{ width: 32, height: 32, border: '2px solid var(--border)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading your mission…</p>
      </div>
    )
  }

  if (!missionData) return null

  const { mission, trackInfo } = missionData

  const sections = [
    { id: 'action', label: '🎯 Your Mission', content: mission.action },
    { id: 'script', label: '💬 Exact Script', content: mission.script },
    { id: 'why', label: '🧠 Why This Works', content: mission.why },
    { id: 'works', label: '✅ When It Works', content: mission.whenItWorks },
    { id: 'doesnt', label: '⚡ When It Doesn\'t', content: mission.whenItDoesnt },
    { id: 'metric', label: '📊 How to Know You\'re Done', content: mission.metric },
  ]

  return (
    <div>
      {/* Track info */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
          <span className={`phase-badge phase-${result?.phase || 'momentum'}`}>{trackInfo.phase}</span>
          <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>→</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{trackInfo.block} Track</span>
        </div>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
          Your mission track is built around your biggest block. Every week is a new action, a new script, a new result.
        </p>
      </div>

      {/* Week navigator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => changeWeek(weekNumber - 1)}
          disabled={weekNumber <= 1}
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 12px', color: weekNumber <= 1 ? 'var(--text-dim)' : 'var(--text-muted)', cursor: weekNumber <= 1 ? 'not-allowed' : 'pointer', fontSize: '0.85rem' }}
        >
          ← Prev
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Week</span>
          <span style={{ color: 'var(--gold)', fontWeight: 800, fontSize: '1.4rem', fontFamily: 'Syne, sans-serif', margin: '0 8px' }}>{weekNumber}</span>
          <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>of 12</span>
        </div>
        <button
          onClick={() => changeWeek(weekNumber + 1)}
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 12px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          Next →
        </button>
      </div>

      {/* Mission card */}
      <div className="card" style={{ marginBottom: 20, borderColor: phaseColor, background: `linear-gradient(135deg, var(--surface) 0%, ${phaseColor}08 100%)` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%', background: `${phaseColor}20`,
            border: `2px solid ${phaseColor}`, display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0, fontSize: '1.1rem', fontWeight: 800,
            color: phaseColor, fontFamily: 'Syne, sans-serif',
          }}>
            {weekNumber}
          </div>
          <div>
            <p style={{ color: phaseColor, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 4 }}>
              This Week's Mission
            </p>
            <h2 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', fontWeight: 800, lineHeight: 1.2 }}>
              {mission.title}
            </h2>
          </div>
        </div>

        <div style={{
          padding: '12px 16px', background: `${phaseColor}10`,
          borderRadius: 'var(--radius)', borderLeft: `3px solid ${phaseColor}`,
          marginBottom: 4,
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.7 }}>
            <strong style={{ color: phaseColor }}>Moran's Principle: </strong>
            {mission.moranPrinciple}
          </p>
        </div>
      </div>

      {/* Expandable sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {sections.map(section => (
          <div key={section.id} style={{
            background: 'var(--surface)',
            border: `1px solid ${expandedSection === section.id ? phaseColor : 'var(--border)'}`,
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            transition: 'border-color 0.2s',
          }}>
            <button
              onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
              style={{
                width: '100%', background: 'none', border: 'none', padding: '14px 20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: expandedSection === section.id ? phaseColor : 'var(--text)' }}>
                {section.label}
              </span>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                {expandedSection === section.id ? '▲' : '▼'}
              </span>
            </button>
            {expandedSection === section.id && (
              <div style={{ padding: '0 20px 20px' }}>
                <p style={{
                  color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.8,
                  whiteSpace: 'pre-line',
                }}>
                  {section.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Completion nudge */}
      <div className="card-sm" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 3 }}>Completed this mission?</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Move to next week when you've hit the metric above.</div>
        </div>
        <button
          onClick={() => changeWeek(weekNumber + 1)}
          style={{
            background: phaseColor, color: 'var(--charcoal)', border: 'none',
            borderRadius: 'var(--radius)', padding: '10px 20px', fontWeight: 700,
            fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'Syne, sans-serif',
            whiteSpace: 'nowrap',
          }}
        >
          Next Mission →
        </button>
      </div>
    </div>
  )
}
