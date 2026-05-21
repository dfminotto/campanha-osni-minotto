import { createBrowserClient } from '@supabase/ssr'

type SupabaseClient = ReturnType<typeof createBrowserClient>

let _client: SupabaseClient | undefined

export function getSupabase(): SupabaseClient {
  return (_client ??= createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ))
}
