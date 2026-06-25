import { NextRequest, NextResponse } from 'next/server'
import { getMission, getMissionTrackInfo } from '@/lib/missions'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const phase = searchParams.get('phase') as 'foundation' | 'momentum' | 'scale' || 'grind'
  const block = searchParams.get('block') || 'I don\'t have enough customers'
  const weekNumber = parseInt(searchParams.get('week') || '1')

  const mission = getMission(phase, block, weekNumber)
  const trackInfo = getMissionTrackInfo(phase, block)

  if (!mission) {
    return NextResponse.json({ error: 'Mission not found' }, { status: 404 })
  }

  return NextResponse.json({ mission, trackInfo, weekNumber })
}
