import { createClient } from '@supabase/supabase-js';

/**
 * Admin (service role) Supabase client.
 *
 * IMPORTANT: This client bypasses ALL Row Level Security policies.
 * Use ONLY in:
 *   - Server Actions
 *   - Route Handlers
 *   - Never in Client Components
 *   - Never expose the service role key to the browser
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
