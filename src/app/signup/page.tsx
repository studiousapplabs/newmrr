'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSignup() {
    if (!email || !password) return
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/dashboard` } })
    if (error) { setError(error.message); setLoading(false) } else { setSuccess(true); setLoading(false) }
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: '3rem', marginBottom: 20 }}>✉️</div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 12 }}>Check your email</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>We sent a confirmation link to <strong style={{ color: 'var(--gold)' }}>{email}</strong>. Click it to activate your account.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="nav-logo" style={{ fontSize: '1.5rem', marginBottom: 12 }}>New<span style={{ color: 'var(--gold)' }}>MRR</span></div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>Create your account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Access your personalized dashboard</p>
        </div>
        <div className="card" style={{ padding: 32 }}>
          {error && <div style={{ background: 'rgba(255,100,50,0.1)', border: '1px solid rgba(255,100,50,0.3)', borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: 20, color: '#FF6432', fontSize: '0.85rem' }}>{error}</div>}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 8 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={{ width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px 16px', color: 'var(--text)', fontSize: '0.95rem', outline: 'none' }} onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 8 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" onKeyDown={e => e.key === 'Enter' && handleSignup()} style={{ width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px 16px', color: 'var(--text)', fontSize: '0.95rem', outline: 'none' }} onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          </div>
          <button onClick={handleSignup} disabled={loading || !email || !password} className="btn-primary" style={{ width: '100%', fontSize: '1rem', padding: '14px' }}>
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Link href="/login" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Already have an account? <span style={{ color: 'var(--gold)' }}>Sign in</span></Link>
          </div>
        </div>
      </div>
    </div>
  )
}
