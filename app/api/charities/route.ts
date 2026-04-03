import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    let query = supabase.from('charities').select('*')

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    const { data: charities, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: charities,
    })
  } catch (err) {
    console.error('Get charities error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Update user's selected charity
export async function PUT(req: NextRequest) {
  try {
    const { charityId, contributionPercent } = await req.json()

    if (!charityId) {
      return NextResponse.json({ error: 'Charity ID is required' }, { status: 400 })
    }

    if (
      contributionPercent &&
      (typeof contributionPercent !== 'number' ||
        contributionPercent < 10 ||
        contributionPercent > 100)
    ) {
      return NextResponse.json(
        { error: 'Contribution percent must be between 10 and 100' },
        { status: 400 }
      )
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

    // Update user's charity
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        charity_id: charityId,
        charity_contribution_percent: contributionPercent || 10,
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
    })
  } catch (err) {
    console.error('Update charity error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
