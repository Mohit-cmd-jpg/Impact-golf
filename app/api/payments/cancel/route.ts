import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createServerClient()

    // Get current user to verify session
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser(token)

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Perform MOCK CANCELLATION for assessment
    // This updates the database instantly without calling Stripe
    const { error } = await supabase
      .from('users')
      .update({
        subscription_status: 'expired',
        subscription_plan: null,
        subscription_renewal_date: null
      })
      .eq('id', authUser.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription successfully canceled (Mock Mode)'
    })
  } catch (err) {
    console.error('Cancel subscription error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
