import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ winnerId: string; action: string }> }
) {
  try {
    const { winnerId, action } = await params;

    if (action === 'approve') {
      const { error } = await supabaseAdmin
        .from('winners')
        .update({ verification_status: 'approved', updated_at: new Date().toISOString() })
        .eq('id', winnerId);

      if (error) throw error;

      return NextResponse.json({ success: true, status: 'approved' });
    } else if (action === 'paid') {
      const { error } = await supabaseAdmin
        .from('winners')
        .update({ payment_status: 'paid', updated_at: new Date().toISOString() })
        .eq('id', winnerId);

      if (error) throw error;

      return NextResponse.json({ success: true, status: 'paid' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating winner:', error);
    return NextResponse.json({ error: 'Failed to update winner' }, { status: 500 });
  }
}
