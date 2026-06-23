import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, Loader2, Sparkles, X } from 'lucide-react'
import { useWeddingStore } from '../store/useWeddingStore'
import { getBudgetTotals } from '../utils'

interface Message {
  role: 'user' | 'model'
  parts: [{ text: string }]
}

const SUGGESTED = [
  '¿Cuántos invitados confirmaron?',
  '¿Cuánto presupuesto queda?',
  '¿Qué pagos vencen pronto?',
  '¿Qué tareas están urgentes?',
  'Marca a Juan Vélez como confirmado',
]

// Extraer ACTION JSON embebido en la respuesta
function parseAction(text: string): { clean: string; action: Record<string, unknown> | null } {
  const match = text.match(/<ACTION>([\s\S]*?)<\/ACTION>/)
  if (!match) return { clean: text, action: null }
  try {
    const action = JSON.parse(match[1])
    const clean = text.replace(/<ACTION>[\s\S]*?<\/ACTION>/g, '').trim()
    return { clean, action }
  } catch {
    return { clean: text, action: null }
  }
}

export const ChatBot: React.FC = () => {
  const [open, setOpen]         = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [lastAction, setLastAction] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const store = useWeddingStore()
  const { config, guests, budgetItems, vendors, tasks, daySchedule, shopping, responsibles } = store
  const totals = getBudgetTotals(budgetItems)
  const confirmed = guests.filter(g => g.status === 'confirmed').length
  const pending   = guests.filter(g => g.status === 'pending').length
  const declined  = guests.filter(g => g.status === 'declined').length

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Contexto completo para Gemini
  const buildContext = () => ({
    config: {
      brideName: config.brideName,
      groomName: config.groomName,
      weddingDate: config.weddingDate,
      venue: config.venue,
      budgetTotal: config.budgetTotal,
      city: config.city,
    },
    summary: {
      totalGuests: guests.length, confirmed, pending, declined,
      budgetTotal: config.budgetTotal,
      budgetReal: totals.totalReal,
      budgetPaid: totals.totalPaid,
      budgetPending: totals.totalPending,
    },
    guests: guests.map(g => ({
      id: g.id, name: g.name, group: g.group, status: g.status,
      hasCompanion: g.hasCompanion, companionName: g.companionName,
      isChild: g.isChild, isElderly: g.isElderly, notes: g.notes,
    })),
    budgetItems: budgetItems.map(b => ({
      id: b.id, concept: b.concept, category: b.category,
      estimatedAmount: b.estimatedAmount, realAmount: b.realAmount,
      paidAmount: b.paidAmount, status: b.status, priority: b.priority, dueDate: b.dueDate,
    })),
    vendors: vendors.map(v => ({
      id: v.id, name: v.name, service: v.service, status: v.status,
      totalValue: v.totalValue, advance: v.advance, balance: v.balance, dueDate: v.dueDate, notes: v.notes,
    })),
    tasks: tasks.map(t => ({
      id: t.id, title: t.title, status: t.status, priority: t.priority,
      dueDate: t.dueDate, responsible: t.responsible,
    })),
    daySchedule: daySchedule.map(e => ({ id: e.id, time: e.time, activity: e.activity, responsible: e.responsible })),
    shopping: shopping.map(s => ({ id: s.id, product: s.product, priority: s.priority, status: s.status })),
    responsibles: responsibles.map(r => ({ id: r.id, name: r.name, role: r.role, phone: r.phone })),
  })

  // Ejecutar acción devuelta por la IA
  const executeAction = (action: Record<string, unknown>) => {
    const type = action.type as string
    try {
      if (type === 'update_guest') {
        const { id, updates } = action as { id: string; updates: Record<string, unknown> }
        store.updateGuest(id, updates as Parameters<typeof store.updateGuest>[1])
        setLastAction(`✓ Invitado actualizado`)
      } else if (type === 'complete_task') {
        store.completeTask(action.id as string)
        setLastAction(`✓ Tarea marcada como completada`)
      } else if (type === 'update_task') {
        const { id, updates } = action as { id: string; updates: Record<string, unknown> }
        store.updateTask(id, updates as Parameters<typeof store.updateTask>[1])
        setLastAction(`✓ Tarea actualizada`)
      } else if (type === 'update_budget') {
        const { id, updates } = action as { id: string; updates: Record<string, unknown> }
        store.updateBudgetItem(id, updates as Parameters<typeof store.updateBudgetItem>[1])
        setLastAction(`✓ Presupuesto actualizado`)
      } else if (type === 'add_budget') {
        store.addBudgetItem(action.item as Parameters<typeof store.addBudgetItem>[0])
        setLastAction(`✓ Rubro de presupuesto agregado`)
      } else if (type === 'update_vendor') {
        const { id, updates } = action as { id: string; updates: Record<string, unknown> }
        store.updateVendor(id, updates as Parameters<typeof store.updateVendor>[1])
        setLastAction(`✓ Proveedor actualizado`)
      } else if (type === 'update_config') {
        store.updateConfig(action.updates as Parameters<typeof store.updateConfig>[0])
        setLastAction(`✓ Configuración actualizada`)
      }
    } catch (e) {
      console.warn('Action error:', e)
    }
  }

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    setError('')
    setLastAction(null)
    const userMsg: Message = { role: 'user', parts: [{ text: text.trim() }] }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated, context: buildContext() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error del servidor')
      const { clean, action } = parseAction(data.text)
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: clean }] }])
      if (action) executeAction(action)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al conectar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-16 right-4 z-50 w-14 h-14 rounded-full bg-olive-600 hover:bg-olive-700 text-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
        title="Asistente IA de la boda"
      >
        {open ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-32 right-4 z-50 w-[340px] sm:w-[390px] flex flex-col rounded-2xl shadow-2xl border border-olive-200 bg-white overflow-hidden"
             style={{ maxHeight: '72vh' }}>
          <div className="bg-gradient-to-r from-olive-700 to-olive-600 px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Asistente de Boda</p>
              <p className="text-olive-200 text-xs">Naim &amp; Sarahí · Gemini IA · puede editar</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-parchment" style={{ minHeight: 200 }}>
            {messages.length === 0 && (
              <div className="text-center py-3">
                <p className="text-stone-500 text-sm mb-3">Pregúntame cualquier cosa sobre la boda o pídeme que actualice datos 💍</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {SUGGESTED.map(s => (
                    <button key={s} onClick={() => send(s)}
                      className="text-xs bg-white border border-olive-200 text-olive-700 rounded-full px-3 py-1.5 hover:bg-olive-50 transition-colors text-left">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-olive-600 text-white rounded-br-sm'
                    : 'bg-white text-stone-700 shadow-sm border border-stone-100 rounded-bl-sm'
                }`}>
                  {m.parts[0].text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm border border-stone-100 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-olive-500 animate-spin" />
                  <span className="text-xs text-stone-400">Pensando...</span>
                </div>
              </div>
            )}

            {lastAction && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-xs text-green-700 animate-fade-in">
                {lastAction} — sincronizado en Supabase
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-600">
                ⚠️ {error}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 bg-white border-t border-stone-100 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
              placeholder="Pregunta o pide una acción..."
              className="flex-1 text-sm border border-stone-200 rounded-xl px-3 py-2 outline-none focus:border-olive-400 bg-stone-50"
              disabled={loading}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl bg-olive-600 hover:bg-olive-700 disabled:bg-stone-200 text-white flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
