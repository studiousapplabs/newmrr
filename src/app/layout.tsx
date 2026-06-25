import type { Metadata } from 'next'
import '@/styles/globals.css'
import NavClient from './NavClient'

export const metadata: Metadata = {
  title: 'NewMRR Wealth Group — Turn Your Skill Into Monthly Recurring Revenue',
  description: 'Take the free Skill Audit and get your personalized path to $1M/year.',
  openGraph: {
    title: 'NewMRR Wealth Group',
    description: 'Your skill is worth more than you are charging. Find out exactly how much.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavClient />
        <main style={{ paddingTop: 64 }}>
          {children}
        </main>
      </body>
    </html>
  )
}
