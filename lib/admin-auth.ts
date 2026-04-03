import { createClient } from '@supabase/supabase-js';

export async function verifyAdminToken(token: string): Promise<{ id: string; email: string } | null> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) return null;

    // Check if user is admin (role = 'admin')
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (userData?.role === 'admin') {
      return { id: data.user.id, email: data.user.email! };
    }

    return null;
  } catch (error) {
    console.error('Error verifying admin token:', error);
    return null;
  }
}

export function getAdminTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
}
