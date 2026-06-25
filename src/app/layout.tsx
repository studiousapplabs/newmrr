import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'NewMRR Wealth Group — Turn Your Skill Into Monthly Recurring Revenue',
  description: 'Take the free Skill Audit and get your personalized path to $1M/year. Built on the framework that\'s helped 300+ entrepreneurs hit 7 figures.',
  openGraph: {
    title: 'NewMRR Wealth Group',
    description: 'Your skill is worth more than you\'re charging. Find out exactly how much.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <div className="container nav-inner">
            <a href="/" className="nav-logo">
              New<span>MRR</span>
            </a>
            <a href="/audit" className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.85rem' }}>
              Take the Free Audit →
            </a>
          </div>
        </nav>
        <main style={{ paddingTop: 64 }}>
          {children}
        </main>
      </body>
    </html>
  )
}
