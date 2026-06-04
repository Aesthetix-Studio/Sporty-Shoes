import { createBrowserClient } from '@supabase/ssr'
import { sanitizeEnvVar } from './env'

export function createClient() {
  return createBrowserClient(
    sanitizeEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL!)!,
    sanitizeEnvVar(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)!
  )
}
