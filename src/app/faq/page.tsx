'use client'

import { useState } from 'react'
import Link from 'next/link'

const FAQ_SECTIONS = [
  {
    category: 'About NewMRR',
    color: '#C9A84C',
    questions: [
      {
        q: 'What exactly is NewMRR?',
        a: 'NewMRR is a business automation platform that takes your skill — whatever you are great at — and builds a complete revenue system around it. You take a free assessment, we map out your entry offer, your monthly recurring model, and your 90-day action plan. Then the platform coaches you every single week on exactly what to do next to grow.',
      },
      {
        q: 'Who is NewMRR built for?',
        a: 'NewMRR is built for small business owners, entrepreneurs, consultants, coaches, freelancers, and service providers who are great at what they do but stuck in a feast-or-famine revenue cycle. If you are manually chasing every lead, your income is unpredictable, and you feel like the bottleneck in your own business — this was built for you.',
      },
      {
        q: 'What makes NewMRR different from other business coaching tools?',
        a: 'Most coaching tools give you generic advice. NewMRR gives you a personalized system built from your specific answers. Your skill, your audience, your price point, your biggest block — everything is fed into the platform and your weekly missions, your resource library, your revenue calculator, and your action plan are all built specifically for your business. No two dashboards look the same.',
      },
      {
        q: 'Is this a course, a software, or a coaching program?',
        a: 'None of those exactly. NewMRR is a business operating system. It combines the structure of a coaching program with the automation of software. You get a personalized assessment, a weekly mission engine that tells you exactly what to do this week, downloadable resources tailored to your skill, and a revenue calculator built on your numbers. It runs on autopilot so you can focus on your craft.',
      },
    ],
  },
  {
    category: 'The Assessment',
    color: '#FF6432',
    questions: [
      {
        q: 'What happens when I take the free assessment?',
        a: 'You answer 18 questions about your skill, your industry, your ideal client, the results you deliver, and where you are right now in business. The platform uses your answers to generate a personalized revenue map — your skill label, your entry offer, your monthly recurring model, your target revenue, and your 90-day action plan. All of it is specific to you.',
      },
      {
        q: 'Do I need to have a business already to take the assessment?',
        a: 'No. The assessment works whether you have zero clients or a thriving practice. It meets you where you are. If you have not monetized your skill yet, it shows you the fastest path to your first paying client. If you already have clients, it shows you how to systematize and scale what you are already doing.',
      },
      {
        q: 'What if I do not know how to describe my skill?',
        a: 'Just describe what you do in plain language. The platform uses AI to distill your raw description into a clean, professional skill label and offer names. You do not need to know the right words — just be honest about what you actually do for people and what changes for them when they work with you.',
      },
      {
        q: 'Are my answers saved if I have to stop mid-assessment?',
        a: 'Yes. The moment you enter your name and email, your information is saved automatically. Every answer after that is saved as you go. If life happens and you close the browser, you have not lost anything. You will also receive a follow-up email to help you pick up where you left off.',
      },
      {
        q: 'What industry is NewMRR designed for?',
        a: 'NewMRR works across industries because it is built around your skill, not a specific niche. We have seen it work for brand strategists, floral business owners, executive coaches, sales consultants, digital marketers, funnel architects, fitness coaches, real estate professionals, e-commerce operators, and service businesses of every kind. If you have a skill that delivers a result for someone, NewMRR can build a revenue system around it.',
      },
    ],
  },
  {
    category: 'Pricing and Payment',
    color: '#2ECC71',
    questions: [
      {
        q: 'How much does NewMRR cost?',
        a: 'The assessment is completely free. To unlock your full dashboard — including your weekly missions, personalized resource library, revenue calculator, and 90-day action plan — it is $47 per month as a Founding Member. There is also a one-time Founding Access option at $297 if you prefer not to pay monthly. For hands-on help, a 1-on-1 Strategy Session is available at $197.',
      },
      {
        q: 'What do I get for $47 per month?',
        a: 'You get full access to your personalized dashboard with four sections: your revenue overview with progress toward your goals, your 90-day action plan built from your assessment, a revenue calculator using your exact numbers, and a resource library with downloadable scripts, templates, checklists, and playbooks — all personalized to your skill and phase. You also get a new weekly mission every week that tells you exactly what to do, gives you the exact script to use, and tells you how to know when it worked.',
      },
      {
        q: 'Can I cancel anytime?',
        a: 'Yes. You can cancel your subscription at any time from your Account page with one click. There are no contracts, no cancellation fees, and no runaround. If you cancel, your access continues through the end of your current billing period.',
      },
      {
        q: 'Is there a refund policy?',
        a: 'Yes. We offer a 30-day refund policy. If you go through the platform and feel it was not right for you, reach out to hello@newmrr.com within 30 days of your purchase and we will make it right.',
      },
      {
        q: 'Why is the price so low compared to business coaching?',
        a: 'Because the system is automated. A traditional business coach charges $500 to $5,000 per month because their time is the product. NewMRR runs on software — your assessment data drives the platform, AI personalizes your resources, and the weekly mission engine coaches you without anyone manually doing it. That is what keeps the cost down while keeping the value high.',
      },
    ],
  },
  {
    category: 'Weekly Missions',
    color: '#C9A84C',
    questions: [
      {
        q: 'What is a weekly mission?',
        a: 'Every week, your dashboard shows you one specific action to take — not a list of 20 things, just one. It includes exactly what to do, the exact words to say (a script), why it works, what to do when it works, what to do when it does not, and a clear metric so you know when you are done. The mission is based on your phase and your biggest block, so it is always relevant to exactly where you are in your business.',
      },
      {
        q: 'How are the weekly missions personalized to me?',
        a: 'Your assessment tells us two things: what phase you are in (The Foundation, The Momentum, or The Scale) and what your biggest block is right now (packaging, finding customers, scaling your time, or building recurring revenue). Those two factors determine your mission track. There are 192 unique missions across 16 tracks. You never see a generic tip — every mission is matched to your exact situation.',
      },
      {
        q: 'What if I finish a mission early and want to move ahead?',
        a: 'You can advance to the next week anytime by clicking Next Mission on your dashboard. The platform moves at your pace. The missions are designed to be done in order because each one builds on the last, but if you have already done the work, you can move forward.',
      },
      {
        q: 'What if a mission does not apply to my situation?',
        a: 'Every mission includes a section called When It Does Not Work. It tells you exactly what to do if the action does not land the way it should. If you feel your mission track is off, you can retake the assessment with updated answers and your track will recalibrate.',
      },
    ],
  },
  {
    category: 'Results and Expectations',
    color: '#FF6432',
    questions: [
      {
        q: 'How long before I see results?',
        a: 'That depends entirely on your starting point and how consistently you execute the weekly missions. The platform is built to get you to your first paying client or your first recurring customer as fast as possible. Members who follow the Foundation track typically see their first result — a response from a prospect, a discovery call booked, a first sale — within 30 to 60 days of consistent action.',
      },
      {
        q: 'What revenue can I realistically expect?',
        a: 'Your assessment calculates your specific revenue potential based on your skill, your price point, and your target customer count. That number is personal to you. What we can say generally is that members who complete their weekly missions consistently and have a skill with clear market demand typically reach their first $5,000 to $10,000 per month within 6 to 12 months. Members with an automated system and existing demand can move much faster.',
      },
      {
        q: 'What if I already have clients? Is NewMRR still useful?',
        a: 'Absolutely. If you already have clients, your assessment will likely place you in The Momentum or The Scale phase. Your missions will focus on systematizing what you are already doing, building recurring revenue from existing clients, adding a second product to your current audience, and preparing your business to run without you being the bottleneck. The platform grows with you.',
      },
      {
        q: 'I have never run a business before. Is this too advanced for me?',
        a: 'No. The Foundation track is designed specifically for people who are starting from zero. The missions are practical, low-cognitive-load, and never assume you already have an audience, clients, or systems in place. The first missions are about clarity, positioning, and making your first contact with a potential client. Everything builds from there.',
      },
    ],
  },
  {
    category: 'Your Data and Privacy',
    color: '#2ECC71',
    questions: [
      {
        q: 'What do you do with my assessment answers?',
        a: 'Your answers are used exclusively to personalize your NewMRR experience. They power your dashboard, your weekly missions, your downloadable resources, and your follow-up emails. We do not sell your data to third parties, use it for advertising, or share it with anyone outside of what is needed to run the platform.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Yes. All payments are processed through Stripe, which is the same payment infrastructure used by Amazon, Google, and millions of businesses worldwide. NewMRR never sees or stores your card information. Stripe handles all of it with bank-level encryption.',
      },
      {
        q: 'Can I delete my account and data?',
        a: 'Yes. Email hello@newmrr.com and request a full account and data deletion. We will remove your information from our systems within 5 business days.',
      },
    ],
  },
  {
    category: 'Getting Help',
    color: '#C9A84C',
    questions: [
      {
        q: 'What if I have a question the platform does not answer?',
        a: 'Email us at hello@newmrr.com. We read every email and respond within 1 business day. You can also request a 1-on-1 Strategy Session directly from your results page — a 90-minute deep dive where we map your specific path together.',
      },
      {
        q: 'Can I request a resource that is not in the library?',
        a: 'Yes. Every resource page has a Request a Resource button at the bottom. Tell us what you need and we will build it. The resource library grows every week based on what members are asking for.',
      },
      {
        q: 'Is there a community of other NewMRR members?',
        a: 'Not yet — but it is coming. A member community is on the roadmap. When it launches, it will be organized by phase so you are always learning from people at a similar stage, not being drowned out by noise from people at completely different points in their journey.',
      },
    ],
  },
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  function toggle(key: string) {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <>
      {/* Hero */}
      <section style={{ padding: '80px 0 60px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <p style={{ color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>
            Frequently Asked Questions
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: 16 }}>
            Everything You Need to Know
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.7 }}>
            If your question is not here, email us at <a href="mailto:hello@newmrr.com" style={{ color: 'var(--gold)' }}>hello@newmrr.com</a> and we will answer within 1 business day.
          </p>
          <Link href="/audit" className="btn-primary">
            Take the Free Assessment →
          </Link>
        </div>
      </section>

      {/* FAQ Sections */}
      <section style={{ padding: '60px 0 80px' }}>
        <div className="container" style={{ maxWidth: 780 }}>
          {FAQ_SECTIONS.map((section) => (
            <div key={section.category} style={{ marginBottom: 56 }}>
              {/* Section header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: section.color, flexShrink: 0 }} />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: section.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {section.category}
                </h2>
              </div>

              {/* Questions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {section.questions.map((item, i) => {
                  const key = `${section.category}-${i}`
                  const isOpen = openItems[key]
                  return (
                    <div
                      key={key}
                      style={{
                        background: 'var(--surface)',
                        border: `1px solid ${isOpen ? section.color : 'var(--border)'}`,
                        borderRadius: 'var(--radius)',
                        overflow: 'hidden',
                        transition: 'border-color 0.2s',
                      }}
                    >
                      <button
                        onClick={() => toggle(key)}
                        style={{
                          width: '100%',
                          background: 'none',
                          border: 'none',
                          padding: '18px 24px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                          textAlign: 'left',
                          gap: 16,
                        }}
                      >
                        <span style={{
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          color: isOpen ? section.color : 'var(--text)',
                          lineHeight: 1.4,
                          fontFamily: 'Syne, sans-serif',
                        }}>
                          {item.q}
                        </span>
                        <span style={{
                          color: isOpen ? section.color : 'var(--text-dim)',
                          fontSize: '1.2rem',
                          flexShrink: 0,
                          transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                          transition: 'transform 0.2s, color 0.2s',
                          fontWeight: 300,
                        }}>
                          +
                        </span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 24px 20px' }}>
                          <div style={{ height: 1, background: 'var(--border)', marginBottom: 16 }} />
                          <p style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.92rem',
                            lineHeight: 1.8,
                          }}>
                            {item.a}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Bottom CTA */}
          <div className="card" style={{ textAlign: 'center', borderColor: 'var(--gold)', background: 'var(--gold-dim)', padding: 40 }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 12 }}>
              Still have questions?
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.7 }}>
              Email us at <a href="mailto:hello@newmrr.com" style={{ color: 'var(--gold)' }}>hello@newmrr.com</a> or book a 1-on-1 Strategy Session and we will map out your exact path together.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/audit" className="btn-primary">
                Take the Free Assessment →
              </Link>
              <a href="mailto:hello@newmrr.com" className="btn-ghost">
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div className="nav-logo">New<span style={{ color: 'var(--gold)' }}>MRR</span> Wealth Group</div>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} NewMRR Wealth Group. Built to build wealth.
          </p>
        </div>
      </footer>
    </>
  )
}
