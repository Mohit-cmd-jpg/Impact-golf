import { NextRequest, NextResponse } from 'next/server'
import { supabase, createServerClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 400 })
    }

    // Create user record in database
    const serverClient = createServerClient()
    const { error: dbError } = await serverClient.from('users').insert({
      id: authData.user.id,
      email,
      name,
      role: 'subscriber',
      subscription_status: 'expired',
    })

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: {
        user: authData.user,
        session: authData.session,
        message: 'Signup successful! Please check your email to confirm your account.',
      },
    })
  } catch (err) {
    console.error('Signup error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
