import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { plan, charityId, charityContributionPercent } = await req.json()

    if (!plan || !['monthly', 'yearly'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createServerClient()

    // Verify user and get their info
    const {
      data: { user },
    } = await supabase.auth.getUser(token)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log(`Finalizing registration for user ${user.id} (Plan: ${plan}, Charity: ${charityId})`)

    // AUTO-ACTIVATE USER (Bypass Stripe)
    const { error: dbError } = await supabase
      .from('users')
      .update({ 
        subscription_status: 'active',
        charity_id: charityId,
        charity_contribution_percent: charityContributionPercent || 10
      })
      .eq('id', user.id)

    if (dbError) {
      return NextResponse.json({ error: `Database Error: ${dbError.message}` }, { status: 500 })
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    return NextResponse.json({
      success: true,
      data: {
        message: 'Registration finalized successfully!',
        sessionUrl: `${origin}/dashboard?registration=complete`,
      },
    })
  } catch (err: any) {
    console.error('Finalization error:', err)
    return NextResponse.json({ error: `Internal server error: ${err.message}` }, { status: 500 })
  }
}
