import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, Loader2, Sparkles } from 'lucide-react'
import { useWeddingStore } from '../store/useWeddingStore'
import { getBudgetTotals, getTotalAttendees } from '../utils'

interface Message {
  role: 'user' | 'model'
  parts: [{ text: string }]
}

const SUGGESTED = [
  '¿Cuántos invitados confirmaron?',
  '¿Cuánto presupuesto queda?',
  '¿Qué pagos están próximos?',
  'Ideas para decoración económica',
]

export const ChatBot: React.FC = () => {
  const [open, setOpen]       = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const { config, guests, budgetItems } = useWeddingStore()
  const totals = getBudgetTotals(budgetItems)
  const confirmed = guests.filter(g => g.status === 'confirmed').length
  const pending   = guests.filter(g => g.status === 'pending').length

  const context = {
    budgetTotal:   config.budgetTotal,
    budgetReal:    totals.totalReal,
    budgetPaid:    totals.totalPaid,
    budgetPending: totals.totalPending,
    totalGuests:   guests.length,
    confirmed,
    pending,
    venue: config.venue,
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    setError('')
    const userMsg: Message = { role: 'user', parts: [{ text: text.trim() }] }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)
    try {
      const apiKey = (import.meta as unknown as { env: Record<string, string> }).env['VITE_GEMINI_KEY']
      if (!apiKey) throw new Error('Clave de IA no configurada')

      const systemText = `Eres el asistente del Wedding Planner de Naim y Sarahi. Boda: 8 agosto 2026, Ibarra, Ecuador. Presupuesto: $${context.budgetTotal}. Invitados: ${context.totalGuests} registrados, ${context.confirmed} confirmados, ${context.pending} pendientes. Presupuesto real: $${context.budgetReal} de $${context.budgetTotal}. Pagado: $${context.budgetPaid}. Pendiente: $${context.budgetPending}. Lugar: ${context.venue}. Responde en espanol, amigable y conciso, maximo 3 parrafos.`

      const payload = {
        system_instruction: { parts: [{ text: systemText }] },
        contents: updated,
        generationConfig: { maxOutputTokens: 600, temperature: 0.7 },
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message ?? 'Error de Gemini')
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sin respuesta.'
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: reply }] }])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al conectar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-16 right-4 z-50 w-14 h-14 rounded-full bg-olive-600 hover:bg-olive-700 text-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
        title="Asistente IA de la boda"
      >
        {open ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-32 right-4 z-50 w-[340px] sm:w-[380px] flex flex-col rounded-2xl shadow-2xl border border-olive-200 bg-white overflow-hidden"
             style={{ maxHeight: '70vh' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-olive-700 to-olive-600 px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Asistente de Boda</p>
              <p className="text-olive-200 text-xs">Naim &amp; Sarahí · Gemini IA</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-parchment" style={{ minHeight: 200 }}>
            {messages.length === 0 && (
              <div className="text-center py-4">
                <p className="text-stone-500 text-sm mb-4">¡Hola! Pregúntame sobre la boda 💍</p>
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
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
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

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-600">
                ⚠️ {error}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-stone-100 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
              placeholder="Escribe tu pregunta..."
              className="flex-1 text-sm border border-stone-200 rounded-xl px-3 py-2 outline-none focus:border-olive-400 focus:ring-1 focus:ring-olive-200 bg-stone-50"
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
