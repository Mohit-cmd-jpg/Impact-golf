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
      data: { user: authUser },
    } = await supabase.auth.getUser(token)

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile with related data
    const { data: user, error } = await supabase
      .from('users')
      .select(
        `
        *,
        charity:charity_id (
          id,
          name,
          image_url,
          category
        ),
        subscription:subscriptions (
          id,
          stripe_subscription_id,
          plan,
          status,
          amount,
          created_at
        )
      `
      )
      .eq('id', authUser.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        email: authUser.email,
      },
    })
  } catch (err) {
    console.error('Get profile error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createServerClient()

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser(token)

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, charityId, charityContributionPercent } = await req.json()

    const updateData: any = {}
    if (name) updateData.name = name
    if (charityId) updateData.charity_id = charityId
    if (charityContributionPercent)
      updateData.charity_contribution_percent = charityContributionPercent

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', authUser.id)
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
    console.error('Update profile error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
