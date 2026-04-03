import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser(token)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's 5 most recent scores
    const { data: scores, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: scores,
    })
  } catch (err) {
    console.error('Get scores error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { score, datePlayed } = await req.json()

    if (!score || typeof score !== 'number' || score < 1 || score > 45) {
      return NextResponse.json(
        { error: 'Score must be between 1 and 45' },
        { status: 400 }
      )
    }

    if (!datePlayed) {
      return NextResponse.json({ error: 'Date played is required' }, { status: 400 })
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser(token)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Insert new score (rolling 5 will be automatically maintained by trigger)
    const { data: newScore, error } = await supabase
      .from('scores')
      .insert({
        user_id: user.id,
        score,
        date_played: datePlayed,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: newScore,
    })
  } catch (err) {
    console.error('Post score error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
