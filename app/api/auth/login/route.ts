import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    // Fetch role from the users table
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single()

    const response = NextResponse.json({
      success: true,
      data: {
        user: data.user,
        session: data.session,
        role: userData?.role || 'subscriber',
      },
    })

    // Set auth cookie server-side so middleware can read it on the very first redirect
    response.cookies.set('auth-token', data.session.access_token, {
      path: '/',
      maxAge: 86400,
      sameSite: 'lax',
      httpOnly: false,
    })

    return response
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
