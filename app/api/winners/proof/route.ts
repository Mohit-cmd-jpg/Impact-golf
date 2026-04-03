import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// Upload winner proof (screenshot URL)
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createServerClient();

    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { winnerId, proofUrl } = await req.json();

    if (!winnerId || !proofUrl) {
      return NextResponse.json({ error: 'Winner ID and proof URL are required' }, { status: 400 });
    }

    // Verify the winner record belongs to this user
    const { data: winner } = await supabase
      .from('winners')
      .select('id, user_id')
      .eq('id', winnerId)
      .eq('user_id', user.id)
      .single();

    if (!winner) {
      return NextResponse.json({ error: 'Winner record not found or access denied' }, { status: 404 });
    }

    // Update proof URL
    const { data: updated, error } = await supabase
      .from('winners')
      .update({ proof_url: proofUrl, updated_at: new Date().toISOString() })
      .eq('id', winnerId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error('Proof upload error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
