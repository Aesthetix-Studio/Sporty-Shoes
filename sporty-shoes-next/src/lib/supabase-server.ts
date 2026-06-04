import { createServerClient, type CookieMethodsServer } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { sanitizeEnvVar } from './env'

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  const cookieMethods: CookieMethodsServer = {
    getAll() { return cookieStore.getAll() },
    setAll(cookiesToSet) {
      try {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        )
      } catch {}
    },
  }

  return createServerClient(
    sanitizeEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL!)!,
    sanitizeEnvVar(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)!,
    { cookies: cookieMethods }
  )
}
