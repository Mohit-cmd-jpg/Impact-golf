import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(
  request: NextRequest,
  { params }: { params: { charityId: string } }
) {
  try {
    const charityId = params.charityId;

    const { error } = await supabaseAdmin.from('charities').delete().eq('id', charityId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting charity:', error);
    return NextResponse.json({ error: 'Failed to delete charity' }, { status: 500 });
  }
}
