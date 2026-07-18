/**
 * Supabase client for Server Components, Route Handlers, and Server Actions.
 * Uses @supabase/ssr to read cookies — session is fully server-side.
 *
 * Usage:
 *   import { createServerClient } from '@/lib/supabase-server'
 *   const supabase = await createServerClient()
 */
import { createServerClient as _createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

  return _createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll is called from Server Components where cookies are read-only.
            // Safe to ignore — middleware handles cookie refresh.
          }
        },
      },
    }
  );
}

/**
 * Convenience: returns the authenticated user's role from their JWT.
 * Returns null if unauthenticated.
 *
 * app_role is embedded in the JWT by the custom_access_token_hook (SQL migration).
 * Falls back to a DB query if the claim is absent (e.g. hook not yet enabled).
 */
export async function getServerRole(): Promise<string | null> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Primary: JWT claim (fast, no DB hit)
  const jwtRole = user.app_metadata?.app_role as string | undefined;
  if (jwtRole) return jwtRole.toUpperCase();

  return 'CUSTOMER';
}
