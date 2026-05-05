import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

// Admin client bypasses RLS — only use in server-side API routes, never client-side.
// Lazy singleton so the module can be imported without crashing at build time
// when SUPABASE_SERVICE_ROLE_KEY is not available in the build environment.
export function getSupabaseAdmin(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) throw new Error('Missing Supabase admin env vars')
    _client = createClient(url, key, { auth: { persistSession: false } })
  }
  return _client
}

// Convenience proxy so existing call sites can use `supabaseAdmin.from(...)` directly
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseAdmin() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
