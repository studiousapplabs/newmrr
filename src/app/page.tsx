import Link from 'next/link'

const CASE_STUDIES = [
  { name: 'Marcus T.', skill: 'Sales Coaching', result: '$0 → $18k/mo in 90 days' },
  { name: 'Priya S.', skill: 'Brand Strategy', result: '$5k/mo → $47k/mo in 8 months' },
  { name: 'David R.', skill: 'LinkedIn Consulting', result: '$2k invested → $120k/year' },
  { name: 'Keisha M.', skill: 'Executive Coaching', result: '$10k/mo → $3M exit' },
]

const PHASES = [
  {
    label: 'The Foundation',
    months: 'Months 1–4',
    description: 'Find your audience. Validate your offer. Get your first 25 customers. Most people quit here — you won\'t.',
    color: '#FF6432',
  },
  {
    label: 'The Momentum',
    months: 'Months 5–8',
    description: 'Scale to $25k/month. Stack your second product to the same audience. Build the machine.',
    color: '#C9A84C',
  },
  {
    label: 'The Scale',
    months: 'Months 9–12',
    description: '100 sales/day. $1M+ annual run rate. Build for the exit — or just enjoy the cash.',
    color: '#2ECC71',
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="section" style={{ paddingTop: 100, paddingBottom: 100, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,168,76,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ marginBottom: 20 }}>
            <span className="phase-badge phase-momentum">Free Skill Audit → Live in 3 Minutes</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)', fontWeight: 800, marginBottom: 24, maxWidth: 900, margin: '0 auto 24px' }}>
            Your Skill Is Already Worth<br />
            <span className="gradient-text">$1M/Year.</span> Here's the Math.
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: 'var(--text-muted)', maxWidth: 620, margin: '0 auto 48px', lineHeight: 1.7 }}>
            3–5 products × 25 sales/day × $30 = $1M in 12 months. Take the free Skill Audit and get your personalized path — audience, entry offer, recurring model, and 90-day action plan.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/audit" className="btn-primary" style={{ fontSize: '1.05rem', padding: '16px 40px' }}>
              Take the Free Skill Audit →
            </Link>
            <a href="#how-it-works" className="btn-ghost">
              See How It Works
            </a>
          </div>
          <p style={{ marginTop: 20, fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            10 questions. 3 minutes. No email required to see your results.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '48px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, textAlign: 'center' }}>
            {[
              { num: '1,000+', label: 'Members guided to MRR' },
              { num: '$1M', label: 'Average 12-month target' },
              { num: '25/day', label: 'First milestone per product' },
              { num: '12 mo', label: 'Avg time to $1M' },
            ].map((s) => (
              <div key={s.label} className="stat-block">
                <div className="stat-number">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" id="how-it-works">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 600 }}>
              The Framework
            </p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, marginBottom: 16 }}>
              Audience First. Product Second. Exit Ready.
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
              Stop building products nobody wants. The framework starts with 100 people who already have the problem your skill solves — then builds from there.
            </p>
          </div>

          <div className="grid-3" style={{ gap: 32 }}>
            {PHASES.map((phase, i) => (
              <div key={phase.label} className="card" style={{ borderColor: `${phase.color}30`, position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: phase.color, borderRadius: '16px 16px 0 0',
                }} />
                <div style={{ marginBottom: 16 }}>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: phase.color,
                  }}>
                    {phase.months}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 12, color: 'var(--text)' }}>
                  {phase.label}
                </h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                  {phase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The math section */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '80px 0' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: 80 }}>
            <div>
              <p style={{ color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 600 }}>
                Third-grade math. Hard execution.
              </p>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: 24 }}>
                The $1M Formula Is Not a Secret
              </h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 24 }}>
                100 sales/day × average price × 365 days = $1,095,000/year. Every system inside NewMRR is engineered to hit that number.
              </p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 32 }}>
                Most people fail not because they don&apos;t know the math — they fail because they start with the wrong product, the wrong audience, or the wrong sequence. The Skill Audit fixes all three.
              </p>
              <Link href="/audit" className="btn-primary">
                Get My Personalized Formula →
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: '3–5 products', desc: 'Stacked to the same audience', value: '×' },
                { label: '25 sales/day', desc: 'Per product — the first milestone', value: '×' },
                { label: 'right price', desc: 'The sweet spot for real margins', value: '=' },
                { label: '$1M/year', desc: 'The target. Not aspirational. Arithmetic.', value: '✓', highlight: true },
              ].map((row) => (
                <div key={row.label} className="card-sm" style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  ...(row.highlight ? { borderColor: 'var(--gold)', background: 'var(--gold-dim)' } : {}),
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: row.highlight ? 'var(--gold)' : 'var(--surface)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem', fontWeight: 700, flexShrink: 0,
                    color: row.highlight ? 'var(--charcoal)' : 'var(--gold)',
                    border: row.highlight ? 'none' : '1px solid var(--border)',
                  }}>
                    {row.value}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontFamily: 'Syne, sans-serif', fontSize: '1rem', color: row.highlight ? 'var(--gold)' : 'var(--text)' }}>
                      {row.label}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{row.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800, marginBottom: 12 }}>
              NewMRR Members. Real Skills. Real Revenue.
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>Real entrepreneurs. Specific skills. Documented results.</p>
          </div>
          <div className="grid-2" style={{ gap: 20 }}>
            {CASE_STUDIES.map((cs) => (
              <div key={cs.name} className="card-sm" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{cs.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{cs.skill}</div>
                </div>
                <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.9rem', textAlign: 'right', fontFamily: 'Syne, sans-serif' }}>
                  {cs.result}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '100px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: 20 }}>
            Stop Undercharging.<br /><span className="gradient-text">Start Building.</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: 500, margin: '0 auto 48px', lineHeight: 1.7 }}>
            10 questions. You get your entry offer, your recurring model, and your 90-day action plan. Free.
          </p>
          <Link href="/audit" className="btn-primary" style={{ fontSize: '1.1rem', padding: '18px 48px' }}>
            Take the Free Skill Audit →
          </Link>
          <p style={{ marginTop: 20, color: 'var(--text-dim)', fontSize: '0.8rem' }}>
            No credit card. No email required to see results.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div className="nav-logo">New<span style={{ color: 'var(--gold)' }}>MRR</span> Wealth Group</div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <a href="/faq" style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>FAQ</a>
            <a href="mailto:hello@newmrr.com" style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Contact</a>
          </div>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} NewMRR Wealth Group. Built to build wealth.
          </p>
        </div>
      </footer>
    </>
  )
}
