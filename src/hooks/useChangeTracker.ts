import { useEffect, useRef } from 'react'
import { useWeddingStore } from '../store/useWeddingStore'
import { ChangeEntry } from '../types'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const ROW_ID = 'main'
const USER_KEY = 'wedding-user-name'

function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36) }
function getUser() { return localStorage.getItem(USER_KEY) || 'Anónimo' }

const MODULE_LABELS: Record<string, string> = {
  guests: 'Invitados', budgetItems: 'Presupuesto', tasks: 'Checklist',
  vendors: 'Proveedores', tables: 'Mesas', daySchedule: 'Cronograma',
  shopping: 'Compras', ceremony: 'Ceremonia', config: 'Configuración',
}

function detectChanges(prev: ReturnType<typeof useWeddingStore.getState>, next: ReturnType<typeof useWeddingStore.getState>): Omit<ChangeEntry, 'id' | 'user' | 'timestamp'>[] {
  const entries: Omit<ChangeEntry, 'id' | 'user' | 'timestamp'>[] = []

  // Guests
  if (prev.guests !== next.guests) {
    const added   = next.guests.filter(g => !prev.guests.find(p => p.id === g.id))
    const removed = prev.guests.filter(g => !next.guests.find(n => n.id === g.id))
    const changed = next.guests.filter(g => {
      const p = prev.guests.find(p => p.id === g.id)
      return p && JSON.stringify(p) !== JSON.stringify(g)
    })
    added.forEach(g   => entries.push({ module: 'Invitados', action: 'Agregó', detail: g.name }))
    removed.forEach(g => entries.push({ module: 'Invitados', action: 'Eliminó', detail: g.name }))
    changed.forEach(g => {
      const p = prev.guests.find(p => p.id === g.id)!
      if (p.status !== g.status) {
        const labels: Record<string, string> = { confirmed: 'Confirmado', pending: 'Pendiente', declined: 'No asistirá' }
        entries.push({ module: 'Invitados', action: 'Actualizó', detail: `${g.name} → ${labels[g.status] ?? g.status}` })
      } else {
        entries.push({ module: 'Invitados', action: 'Editó', detail: g.name })
      }
    })
  }

  // Budget
  if (prev.budgetItems !== next.budgetItems) {
    const added   = next.budgetItems.filter(b => !prev.budgetItems.find(p => p.id === b.id))
    const removed = prev.budgetItems.filter(b => !next.budgetItems.find(n => n.id === b.id))
    const changed = next.budgetItems.filter(b => {
      const p = prev.budgetItems.find(p => p.id === b.id)
      return p && JSON.stringify(p) !== JSON.stringify(b)
    })
    added.forEach(b   => entries.push({ module: 'Presupuesto', action: 'Agregó rubro', detail: `${b.concept} ($${b.estimatedAmount})` }))
    removed.forEach(b => entries.push({ module: 'Presupuesto', action: 'Eliminó rubro', detail: b.concept }))
    changed.forEach(b => {
      const p = prev.budgetItems.find(p => p.id === b.id)!
      if (p.paidAmount !== b.paidAmount) {
        entries.push({ module: 'Presupuesto', action: 'Registró pago', detail: `${b.concept}: $${b.paidAmount}` })
      } else {
        entries.push({ module: 'Presupuesto', action: 'Editó', detail: b.concept })
      }
    })
  }

  // Tasks
  if (prev.tasks !== next.tasks) {
    const changed = next.tasks.filter(t => {
      const p = prev.tasks.find(p => p.id === t.id)
      return p && p.status !== t.status
    })
    const added   = next.tasks.filter(t => !prev.tasks.find(p => p.id === t.id))
    const removed = prev.tasks.filter(t => !next.tasks.find(n => n.id === t.id))
    changed.forEach(t => {
      if (t.status === 'completed') entries.push({ module: 'Checklist', action: 'Completó tarea', detail: t.title })
      else entries.push({ module: 'Checklist', action: 'Actualizó tarea', detail: t.title })
    })
    added.forEach(t   => entries.push({ module: 'Checklist', action: 'Agregó tarea', detail: t.title }))
    removed.forEach(t => entries.push({ module: 'Checklist', action: 'Eliminó tarea', detail: t.title }))
  }

  // Vendors
  if (prev.vendors !== next.vendors) {
    const added   = next.vendors.filter(v => !prev.vendors.find(p => p.id === v.id))
    const removed = prev.vendors.filter(v => !next.vendors.find(n => n.id === v.id))
    const changed = next.vendors.filter(v => {
      const p = prev.vendors.find(p => p.id === v.id)
      return p && JSON.stringify(p) !== JSON.stringify(v)
    })
    added.forEach(v   => entries.push({ module: 'Proveedores', action: 'Agregó', detail: v.name }))
    removed.forEach(v => entries.push({ module: 'Proveedores', action: 'Eliminó', detail: v.name }))
    changed.forEach(v => entries.push({ module: 'Proveedores', action: 'Actualizó', detail: v.name }))
  }

  // Config
  if (JSON.stringify(prev.config) !== JSON.stringify(next.config)) {
    entries.push({ module: 'Configuración', action: 'Actualizó', detail: 'Configuración general de la boda' })
  }

  return entries
}

async function saveChangelogToSupabase(entry: ChangeEntry) {
  if (!isSupabaseConfigured || !supabase) return
  try {
    // Append entry to changelog array in Supabase
    const sb = supabase!
    const { data } = await sb.from('wedding_data').select('changelog').eq('id', ROW_ID).maybeSingle()
    const existing: ChangeEntry[] = (data?.changelog as ChangeEntry[]) ?? []
    const updated = [entry, ...existing].slice(0, 100) // Keep last 100
    await sb.from('wedding_data').update({ changelog: updated }).eq('id', ROW_ID)
  } catch (e) {
    // Column might not exist yet — store locally only
  }
}

export function useChangeTracker() {
  const prevState = useRef(useWeddingStore.getState())
  const isMounted = useRef(false)

  useEffect(() => {
    // Skip initial mount to avoid logging load-from-supabase as changes
    const timer = setTimeout(() => { isMounted.current = true }, 3000)

    const unsubscribe = useWeddingStore.subscribe((next) => {
      if (!isMounted.current) return

      const changes = detectChanges(prevState.current, next)
      prevState.current = next

      if (changes.length === 0) return

      const user = getUser()
      const timestamp = new Date().toISOString()

      changes.forEach(async (c) => {
        const entry: ChangeEntry = { id: uid(), user, timestamp, ...c }
        // Save to local store
        useWeddingStore.getState().addChangeEntry(entry)
        // Sync to Supabase
        await saveChangelogToSupabase(entry)
      })
    })

    return () => { unsubscribe(); clearTimeout(timer) }
  }, [])
}

export { MODULE_LABELS }
