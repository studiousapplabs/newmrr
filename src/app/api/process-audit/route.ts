import { NextRequest, NextResponse } from 'next/server'
import { cleanAuditLanguage } from '@/lib/groq'

export async function POST(req: NextRequest) {
  try {
    const { answers } = await req.json()
    const skill = answers.find((a: { questionId: string; value: string }) => a.questionId === 'skill')?.value || ''
    const audience = answers.find((a: { questionId: string; value: string }) => a.questionId === 'audience')?.value || ''
    const delivery = answers.find((a: { questionId: string; value: string }) => a.questionId === 'delivery')?.value || ''
    const priceComfort = answers.find((a: { questionId: string; value: string }) => a.questionId === 'priceComfort')?.value || ''
    const outcome = answers.find((a: { questionId: string; value: string }) => a.questionId === 'outcome')?.value || ''
    const cleaned = await cleanAuditLanguage({ skill, audience, delivery, priceComfort, outcome })
    return NextResponse.json({ success: true, cleaned })
  } catch (err) {
    console.error('Process audit error:', err)
    return NextResponse.json({ error: 'Failed to process audit' }, { status: 500 })
  }
}
