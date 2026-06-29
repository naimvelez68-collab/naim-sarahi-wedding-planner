import { createClient, SupabaseClient } from '@supabase/supabase-js'

const env = (import.meta as unknown as { env: Record<string, string> }).env

// Strip BOM (﻿) that Vercel sometimes injects into env var values
const strip = (s: string) => (s || '').replace(/^﻿/, '').trim()

const url = strip(env.VITE_SUPABASE_URL) || 'https://hoanquznfonsnzwvitlj.supabase.co'
const key = strip(env.VITE_SUPABASE_ANON_KEY) || 'sb_publishable_pUDuYt8e-f14RAyUaK2DZQ_8pauPnZ1'

export const supabase: SupabaseClient = createClient(url, key)

export const isSupabaseConfigured = true
