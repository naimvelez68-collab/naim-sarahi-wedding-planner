import { createClient, SupabaseClient } from '@supabase/supabase-js'

const env = (import.meta as unknown as { env: Record<string, string> }).env

// Anon key is public — safe to embed as fallback when Vercel env vars are missing
const url = env.VITE_SUPABASE_URL || 'https://hoanquznfonsnzwvitlj.supabase.co'
const key = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_pUDuYt8e-f14RAyUaK2DZQ_8pauPnZ1'

export const supabase: SupabaseClient = createClient(url, key)

export const isSupabaseConfigured = true
