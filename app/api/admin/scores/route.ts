import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { data: scores, error } = await supabaseAdmin
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    return NextResponse.json(scores || []);
  } catch (error) {
    console.error('Error fetching user scores:', error);
    return NextResponse.json({ error: 'Failed to fetch user scores' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { scoreId, score } = await request.json();

    if (!scoreId || score === undefined) {
      return NextResponse.json({ error: 'Score ID and new score are required' }, { status: 400 });
    }

    if (score < 1 || score > 45) {
      return NextResponse.json({ error: 'Score must be between 1 and 45' }, { status: 400 });
    }

    const { data: updatedScore, error } = await supabaseAdmin
      .from('scores')
      .update({ score, updated_at: new Date().toISOString() })
      .eq('id', scoreId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: updatedScore });
  } catch (error) {
    console.error('Error updating score:', error);
    return NextResponse.json({ error: 'Failed to update score' }, { status: 500 });
  }
}
