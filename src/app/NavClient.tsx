'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function NavClient() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="nav">
      <div className="container nav-inner">
        <a href="/" className="nav-logo">
          New<span style={{ color: 'var(--gold)' }}>MRR</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <>
              <a href="/dashboard" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Dashboard
              </a>
              <a href="/account" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Account
              </a>
              <button
                onClick={handleSignOut}
                style={{
                  background: 'none', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', padding: '8px 16px',
                  color: 'var(--text-muted)', fontSize: '0.82rem', cursor: 'pointer',
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <a href="/faq" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>FAQ</a>
              <a href="/login" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Sign in
              </a>
              <a href="/audit" className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.85rem' }}>
                Take the Free Audit →
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
