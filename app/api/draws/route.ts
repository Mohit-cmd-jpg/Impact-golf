import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(req.url)
    const published = searchParams.get('published')

    let query = supabase
      .from('draws')
      .select('*, prizes(*), draw_entries(*)')
      .order('year', { ascending: false })
      .order('month', { ascending: false })

    if (published === 'true') {
      query = query.eq('status', 'published')
    }

    const { data: draws, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: draws,
    })
  } catch (err) {
    console.error('Get draws error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Create a draw entry for current user
export async function POST(req: NextRequest) {
  try {
    const { drawId } = await req.json()

    if (!drawId) {
      return NextResponse.json({ error: 'Draw ID is required' }, { status: 400 })
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

    // Get user's 5 most recent scores
    const { data: scores, error: scoresError } = await supabase
      .from('scores')
      .select('score')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (scoresError) {
      return NextResponse.json({ error: scoresError.message }, { status: 400 })
    }

    if (scores.length < 5) {
      return NextResponse.json(
        { error: 'You need to enter 5 scores to participate in draws' },
        { status: 400 }
      )
    }

    const scoresArray = scores.map((s) => s.score).reverse() // Reverse to get oldest first

    // Create draw entry
    const { data: entry, error } = await supabase
      .from('draw_entries')
      .insert({
        draw_id: drawId,
        user_id: user.id,
        scores_snapshot: scoresArray,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: entry,
    })
  } catch (err) {
    console.error('Create draw entry error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
