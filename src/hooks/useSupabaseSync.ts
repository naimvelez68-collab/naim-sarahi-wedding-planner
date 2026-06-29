import { useEffect, useRef, useState } from 'react'
import { useWeddingStore } from '../store/useWeddingStore'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const ROW_ID = 'main'
const DEBOUNCE_MS = 1800

// ─── Serialize store → Supabase row ──────────────────────────────────────────
function extractRow() {
  const s = useWeddingStore.getState()
  return {
    id:             ROW_ID,
    config:         s.config,
    guests:         s.guests,
    tables:         s.tables,
    budget_items:   s.budgetItems,
    vendors:        s.vendors,
    tasks:          s.tasks,
    day_schedule:   s.daySchedule,
    ceremony:       s.ceremony,
    games:          s.games,
    music:          s.music,
    mc_script:      s.mcScript,
    photos:         s.photos,
    plan_b:         s.planB,
    responsibles:   s.responsibles,
    shopping:       s.shopping,
    emergency_kit:  s.emergencyKit,
    quotes:         s.quotes,
    bocaditos:      s.bocaditos,
    beverages:      s.beverages,
    savings:        s.savings,
    is_initialized: s.isInitialized,
    updated_at:     new Date().toISOString(),
  }
}

// ─── Load Supabase row → store ───────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyRow(data: any) {
  useWeddingStore.setState({
    isInitialized: data.is_initialized ?? true,
    config:        data.config        ?? useWeddingStore.getState().config,
    guests:        data.guests        ?? [],
    tables:        data.tables        ?? [],
    budgetItems:   data.budget_items  ?? [],
    vendors:       data.vendors       ?? [],
    tasks:         data.tasks         ?? [],
    daySchedule:   data.day_schedule  ?? [],
    ceremony:      data.ceremony      ?? [],
    games:         data.games         ?? [],
    music:         data.music         ?? [],
    mcScript:      data.mc_script     ?? [],
    photos:        data.photos        ?? [],
    planB:         data.plan_b        ?? [],
    responsibles:  data.responsibles  ?? [],
    shopping:      data.shopping      ?? [],
    emergencyKit:  data.emergency_kit ?? [],
    quotes:        data.quotes        ?? [],
    bocaditos:     data.bocaditos     ?? [],
    beverages:     data.beverages     ?? [],
    savings:       data.savings       ?? [],
  })
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useSupabaseSync() {
  const isSyncingRef  = useRef(false)
  const saveTimer     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSaved     = useRef<string>('')
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return

    // 1. Load from Supabase on mount
    const load = async () => {
      isSyncingRef.current = true
      try {
        const sb = supabase!
        const { data, error } = await sb
          .from('wedding_data')
          .select('*')
          .eq('id', ROW_ID)
          .maybeSingle()

        if (error) { console.warn('[Supabase] Load error:', error.message); return }

        if (data) {
          applyRow(data)
          // Load changelog if column exists
          if (Array.isArray(data.changelog) && data.changelog.length > 0) {
            useWeddingStore.setState({ changelog: data.changelog })
          }
        } else {
          // First time — push local data to Supabase
          const s = useWeddingStore.getState()
          if (s.isInitialized) {
            await sb.from('wedding_data').upsert(extractRow())
          }
        }
      } catch (e) {
        console.warn('[Supabase] Load failed, using localStorage:', e)
      } finally {
        isSyncingRef.current = false
        setIsLoading(false)
      }
    }
    load()

    const sb = supabase // narrowed to non-null inside the effect guard above

    // 2. Save to Supabase whenever store changes (debounced)
    const unsubscribe = useWeddingStore.subscribe((_state) => {
      if (isSyncingRef.current) return
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(async () => {
        const state = useWeddingStore.getState()
        if (!state.isInitialized) return
        // Guard: never overwrite Supabase with fewer guests than it already has
        const { data: current } = await sb.from('wedding_data').select('guests').eq('id', ROW_ID).maybeSingle()
        const supabaseTotal = Array.isArray(current?.guests) ? current.guests.length : 0
        if (supabaseTotal > 0 && state.guests.length < supabaseTotal - 5) {
          console.warn('[Supabase] Abortando guardado: datos locales obsoletos', state.guests.length, '<', supabaseTotal)
          // Refresh from Supabase instead
          if (current) applyRow(current)
          return
        }
        const row = extractRow()
        const rowKey = JSON.stringify(row)
        if (rowKey === lastSaved.current) return
        lastSaved.current = rowKey
        try {
          await sb.from('wedding_data').upsert(row)
        } catch (e) {
          console.warn('[Supabase] Save failed:', e)
        }
      }, DEBOUNCE_MS)
    })

    // 3. Real-time subscription — sync changes from other users
    const channel = sb
      .channel('wedding-realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'wedding_data', filter: `id=eq.${ROW_ID}` },
        (payload) => {
          if (isSyncingRef.current) return
          isSyncingRef.current = true
          applyRow(payload.new)
          // Sync changelog from other devices
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const newChangelog = (payload.new as any).changelog
          if (Array.isArray(newChangelog)) {
            useWeddingStore.setState({ changelog: newChangelog })
          }
          isSyncingRef.current = false
        }
      )
      .subscribe()

    return () => {
      unsubscribe()
      if (saveTimer.current) clearTimeout(saveTimer.current)
      sb.removeChannel(channel)
    }
  }, [])

  return { isSupabaseConfigured, isLoading }
}
