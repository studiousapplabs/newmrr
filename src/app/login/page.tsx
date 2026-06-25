'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    if (!email || !password) return
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="nav-logo" style={{ fontSize: '1.5rem', marginBottom: 12 }}>New<span style={{ color: 'var(--gold)' }}>MRR</span></div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in to your dashboard</p>
        </div>
        <div className="card" style={{ padding: 32 }}>
          {error && (
            <div style={{ background: 'rgba(255,100,50,0.1)', border: '1px solid rgba(255,100,50,0.3)', borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: 20, color: '#FF6432', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 8 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" onKeyDown={e => e.key === 'Enter' && handleLogin()} style={{ width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px 16px', color: 'var(--text)', fontSize: '0.95rem', outline: 'none' }} onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 8 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleLogin()} style={{ width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px 16px', color: 'var(--text)', fontSize: '0.95rem', outline: 'none' }} onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          </div>
          <button onClick={handleLogin} disabled={loading || !email || !password} className="btn-primary" style={{ width: '100%', fontSize: '1rem', padding: '14px' }}>
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Link href="/signup" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Don&apos;t have an account? <span style={{ color: 'var(--gold)' }}>Sign up</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
