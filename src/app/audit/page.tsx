'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AUDIT_QUESTIONS, calculateAuditResult, AuditAnswer } from '@/lib/audit-engine'

export default function AuditPage() {
  const router = useRouter()
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<AuditAnswer[]>([])
  const [textValue, setTextValue] = useState('')
  const [isTransitioning, setIsTransitioning] = useState(false)

  const question = AUDIT_QUESTIONS[currentQ]
  const progress = ((currentQ) / AUDIT_QUESTIONS.length) * 100
  const currentAnswer = answers.find(a => a.questionId === question.id)

  function handleOption(value: string) {
    const updated = answers.filter(a => a.questionId !== question.id)
    updated.push({ questionId: question.id, value })
    setAnswers(updated)
    advance(updated)
  }

  function handleTextNext() {
    if (!textValue.trim()) return
    const updated = answers.filter(a => a.questionId !== question.id)
    updated.push({ questionId: question.id, value: textValue.trim() })
    setAnswers(updated)
    advance(updated)
  }

  function advance(updatedAnswers: AuditAnswer[]) {
    setIsTransitioning(true)
    setTimeout(() => {
      if (currentQ < AUDIT_QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1)
        setTextValue('')
        setIsTransitioning(false)
      } else {
        // Calculate results and navigate
        const result = calculateAuditResult(updatedAnswers)
        sessionStorage.setItem('auditResult', JSON.stringify(result))
        sessionStorage.setItem('auditAnswers', JSON.stringify(updatedAnswers))
        router.push('/results')
      }
    }, 300)
  }

  function goBack() {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1)
      const prevAnswer = answers.find(a => a.questionId === AUDIT_QUESTIONS[currentQ - 1].id)
      if (prevAnswer && typeof prevAnswer.value === 'string') {
        setTextValue(prevAnswer.value)
      }
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Progress */}
      <div style={{ position: 'fixed', top: 64, left: 0, right: 0, zIndex: 50 }}>
        <div className="progress-track" style={{ borderRadius: 0 }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px 40px',
      }}>
        <div style={{ width: '100%', maxWidth: 620 }}>

          {/* Question counter */}
          <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Question <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{currentQ + 1}</span> of {AUDIT_QUESTIONS.length}
            </span>
            {currentQ > 0 && (
              <button onClick={goBack} style={{ color: 'var(--text-muted)', fontSize: '0.85rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                ← Back
              </button>
            )}
          </div>

          {/* Question */}
          <div style={{ opacity: isTransitioning ? 0 : 1, transform: isTransitioning ? 'translateY(-10px)' : 'translateY(0)', transition: 'all 0.3s ease' }}>
            <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>
              {question.question}
            </h2>
            {question.subtext && (
              <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: '0.95rem' }}>
                {question.subtext}
              </p>
            )}
            {!question.subtext && <div style={{ marginBottom: 32 }} />}

            {/* Text input */}
            {question.type === 'text' && (
              <div>
                <textarea
                  value={textValue}
                  onChange={e => setTextValue(e.target.value)}
                  placeholder={question.placeholder}
                  rows={3}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTextNext() } }}
                  style={{
                    width: '100%', background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)', padding: '16px 20px', color: 'var(--text)',
                    fontSize: '1rem', resize: 'none', outline: 'none', lineHeight: 1.6,
                    transition: 'border-color 0.2s',
                  }}
                  autoFocus
                  onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Press Enter to continue</span>
                  <button
                    onClick={handleTextNext}
                    disabled={!textValue.trim()}
                    className="btn-primary"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Single select */}
            {question.type === 'single' && question.options && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {question.options.map((opt) => {
                  const isSelected = currentAnswer?.value === opt
                  return (
                    <button
                      key={opt}
                      onClick={() => handleOption(opt)}
                      style={{
                        background: isSelected ? 'var(--gold-dim)' : 'var(--surface)',
                        border: `1px solid ${isSelected ? 'var(--gold)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius)',
                        padding: '16px 20px',
                        color: isSelected ? 'var(--gold)' : 'var(--text)',
                        fontSize: '0.95rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontWeight: isSelected ? 600 : 400,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                      }}
                    >
                      <span style={{
                        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                        border: `2px solid ${isSelected ? 'var(--gold)' : 'var(--border)'}`,
                        background: isSelected ? 'var(--gold)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {isSelected && (
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--charcoal)' }} />
                        )}
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

      {/* Bottom note */}
      <div style={{ textAlign: 'center', padding: '0 0 32px', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
        Free audit. No email required. Your results appear immediately.
      </div>
    </div>
  )
}
