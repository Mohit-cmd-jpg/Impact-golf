import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Helper function to check if user is admin
async function isAdmin(token: string, supabase: any): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser(token)

  if (!user) return false

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  return userData?.role === 'admin'
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createServerClient()

    if (!(await isAdmin(token, supabase))) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { action, month, year, drawType, winningNumbers, jackpotRollover } =
      await req.json()

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 })
    }

    if (action === 'create') {
      if (!month || !year || !drawType) {
        return NextResponse.json(
          { error: 'Month, year, and draw type are required' },
          { status: 400 }
        )
      }

      // Check if draw already exists for this month/year
      const { data: existing } = await supabase
        .from('draws')
        .select('id')
        .eq('month', month)
        .eq('year', year)
        .single()

      if (existing) {
        return NextResponse.json(
          { error: 'Draw already exists for this month/year' },
          { status: 400 }
        )
      }

      const { data: newDraw, error } = await supabase
        .from('draws')
        .insert({
          month,
          year,
          draw_type: drawType,
          status: 'draft',
          winning_numbers: [],
          jackpot_rollover: jackpotRollover || false,
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        data: newDraw,
      })
    }

    if (action === 'simulate') {
      if (!winningNumbers || winningNumbers.length !== 5) {
        return NextResponse.json(
          { error: 'Exactly 5 winning numbers are required' },
          { status: 400 }
        )
      }

      // This would run the matching logic without publishing
      return NextResponse.json({
        success: true,
        message: 'Simulation would process matches here',
      })
    }

    if (action === 'publish') {
      if (!winningNumbers || winningNumbers.length !== 5) {
        return NextResponse.json(
          { error: 'Exactly 5 winning numbers are required' },
          { status: 400 }
        )
      }

      // More implementation needed for actual publishing
      return NextResponse.json({
        success: true,
        message: 'Draw published',
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    console.error('Admin draws error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
