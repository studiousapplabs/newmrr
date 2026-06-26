import { NextRequest, NextResponse } from 'next/server'
import { cleanAuditLanguage } from '@/lib/groq'

export async function POST(req: NextRequest) {
  try {
    const { answers } = await req.json()

    const get = (id: string) => {
      const found = answers.find((a: { questionId: string; value: string }) => a.questionId === id)
      return found?.value || ''
    }

    const cleaned = await cleanAuditLanguage({
      skill: get('skill'),
      audience: get('audience'),
      delivery: get('delivery'),
      priceComfort: get('priceComfort'),
      outcome: get('result_delivered') || get('outcome') || '',
      dreamClient: get('dream_client'),
      clientProblem: get('client_problem'),
      industry: get('industry'),
      niche: get('niche'),
      biggestWin: get('biggest_win'),
      resultTimeframe: get('result_timeframe'),
    })

    return NextResponse.json({ success: true, cleaned })
  } catch (err) {
    console.error('Process audit error:', err)
    return NextResponse.json({ error: 'Failed to process audit' }, { status: 500 })
  }
}
