import { NextRequest, NextResponse } from 'next/server'
import { newsScheduler } from '@/lib/scheduler'

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    if (action === 'start') {
      await newsScheduler.start()
      return NextResponse.json({
        success: true,
        message: 'News scheduler started successfully'
      })
    } else if (action === 'stop') {
      await newsScheduler.stop()
      return NextResponse.json({
        success: true,
        message: 'News scheduler stopped successfully'
      })
    } else if (action === 'fetch') {
      const { category = 'tech', limit = 10 } = await request.json()
      const result = await newsScheduler.fetchNewsNow(category, limit)
      return NextResponse.json(result)
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid action. Use "start", "stop", or "fetch"'
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in scheduler API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'News scheduler API is running',
      endpoints: {
        start: 'POST /api/news/scheduler with { "action": "start" }',
        stop: 'POST /api/news/scheduler with { "action": "stop" }',
        fetch: 'POST /api/news/scheduler with { "action": "fetch", "category": "tech", "limit": 10 }'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
