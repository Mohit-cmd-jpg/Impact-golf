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
      return NextResponse.json({ 
        error: authError.message === 'fetch failed' 
          ? 'Failed to connect to Supabase. Check your NEXT_PUBLIC_SUPABASE_URL in Vercel settings. It must be a valid Supabase project URL.' 
          : authError.message,
        details: authError 
      }, { status: 400 })
    }

    if (!authData?.user) {
      return NextResponse.json({ error: 'Failed to create user - no user returned from Supabase' }, { status: 400 })
    }

    // Create user record in database
    let serverClient;
    try {
      serverClient = createServerClient()
    } catch (e: any) {
      return NextResponse.json({ error: `Server Client Error: ${e.message}` }, { status: 500 })
    }

    const { error: dbError } = await serverClient.from('users').insert({
      id: authData.user.id,
      email,
      name,
      role: 'subscriber',
      subscription_status: 'expired',
    })

    if (dbError) {
      return NextResponse.json({ 
        error: dbError.message === 'fetch failed'
          ? 'Failed to connect to Supabase Database. Check your SUPABASE_SERVICE_ROLE_KEY and URL in Vercel.'
          : `Database Error: ${dbError.message}`, 
        details: dbError
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: {
        user: authData.user,
        session: authData.session,
        message: 'Signup successful! Please check your email to confirm your account.',
      },
    })
  } catch (err: any) {
    console.error('Signup Catch Block Error:', err)
    return NextResponse.json({ 
      error: err.message === 'fetch failed' 
        ? 'Fatal fetch failed. The Supabase URL is likely invalid or resolving incorrectly.' 
        : `Internal Server Error: ${err.message}`, 
      stack: err.stack 
    }, { status: 500 })
  }
}
