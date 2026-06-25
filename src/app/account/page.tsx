'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [cancelled, setCancelled] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login') } else { setUser(data.user); setLoading(false) }
    })
  }, [router])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  async function handleCancelSubscription() {
    setCancelling(true)
    try {
      const res = await fetch('/api/cancel-subscription', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: user?.email }) })
      const data = await res.json()
      if (data.success) setCancelled(true)
    } catch (err) { console.error(err) }
    setCancelling(false)
  }

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: 'var(--text-muted)' }}>Loading…</div></div>

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '48px 24px 80px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Your Account</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 40 }}>Manage your NewMRR membership</p>
      <div className="card" style={{ marginBottom: 20 }}>
        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: 16, fontWeight: 600 }}>Profile</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{user?.email}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Member since {new Date(user?.created_at || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
          </div>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--gold-dim)', border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800, color: 'var(--gold)', fontFamily: 'Syne, sans-serif' }}>
            {user?.email?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
      <div className="card" style={{ marginBottom: 20, borderColor: cancelled ? 'rgba(255,100,50,0.3)' : 'var(--gold)' }}>
        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: 16, fontWeight: 600 }}>Subscription</p>
        {cancelled ? (
          <div>
            <div style={{ color: '#FF6432', fontWeight: 700, marginBottom: 8 }}>Subscription Cancelled</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Your access continues until the end of your billing period.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Founding Member</div>
              <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.1rem' }}>$47/month</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 4 }}>Active — renews monthly</div>
            </div>
            <button onClick={handleCancelSubscription} disabled={cancelling} style={{ background: 'none', border: '1px solid rgba(255,100,50,0.4)', borderRadius: 'var(--radius)', padding: '8px 16px', color: '#FF6432', fontSize: '0.85rem', cursor: 'pointer' }}>
              {cancelling ? 'Cancelling…' : 'Cancel Subscription'}
            </button>
          </div>
        )}
      </div>
      <div className="card-sm" style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Back to your dashboard</span>
        <a href="/dashboard" className="btn-ghost" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>Go to Dashboard →</a>
      </div>
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <button onClick={handleSignOut} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '0.85rem', cursor: 'pointer' }}>Sign out</button>
      </div>
    </div>
  )
}
