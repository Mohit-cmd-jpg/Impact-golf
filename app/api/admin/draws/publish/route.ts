import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { drawId } = await req.json();

    if (!drawId) {
      return NextResponse.json({ error: 'drawId is required' }, { status: 400 });
    }

    // Verify the draw exists and is in a publishable state
    const { data: draw, error: fetchError } = await getSupabaseAdmin()
      .from('draws')
      .select('*')
      .eq('id', drawId)
      .single();

    if (fetchError || !draw) {
      return NextResponse.json({ error: 'Draw not found' }, { status: 404 });
    }

    if (draw.status === 'published') {
      return NextResponse.json({ error: 'Draw is already published' }, { status: 400 });
    }

    if (draw.status === 'draft') {
      return NextResponse.json(
        { error: 'Draw must be simulated before publishing' },
        { status: 400 }
      );
    }

    // Update status to published
    const { error: updateError } = await getSupabaseAdmin()
      .from('draws')
      .update({
        status: 'published',
        updated_at: new Date().toISOString(),
      })
      .eq('id', drawId);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: 'Draw published successfully',
    });
  } catch (error: any) {
    console.error('Publish error:', error);
    return NextResponse.json({ error: error.message || 'Failed to publish draw' }, { status: 500 });
  }
}
