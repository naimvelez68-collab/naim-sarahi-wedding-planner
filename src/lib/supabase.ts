import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Vite exposes env via import.meta.env
const url = (import.meta as unknown as { env: Record<string, string> }).env.VITE_SUPABASE_URL
const key = (import.meta as unknown as { env: Record<string, string> }).env.VITE_SUPABASE_ANON_KEY

export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key) : null

export const isSupabaseConfigured = !!(url && key)
