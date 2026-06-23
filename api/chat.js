module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'Sin API key' })
  const body = req.body || {}
  const messages = Array.isArray(body.messages) ? body.messages : []
  const ctx = body.context || {}
  if (!messages.length) return res.status(400).json({ error: 'Sin mensajes' })

  const system = 'Eres el asistente del Wedding Planner de Naim y Sarahi. Boda: sabado 8 agosto 2026, Ibarra, Ecuador. ' +
    'DATOS REALES DEL PLANIFICADOR: ' +
    'Presupuesto aprobado: $' + (ctx.budgetTotal || 2000) + '. ' +
    'Total real estimado: $' + (ctx.budgetReal || 0) + '. ' +
    'Pagado hasta ahora: $' + (ctx.budgetPaid || 0) + '. ' +
    'Pendiente por pagar: $' + (ctx.budgetPending || 0) + '. ' +
    'Invitados registrados: ' + (ctx.totalGuests || 0) + '. ' +
    'Invitados confirmados: ' + (ctx.confirmed || 0) + '. ' +
    'Invitados pendientes: ' + (ctx.pending || 0) + '. ' +
    'Lugar: ' + (ctx.venue || 'Por confirmar') + '. ' +
    'Responde SIEMPRE en espanol, de forma amigable, breve y util. Usa los datos de arriba para responder preguntas sobre la boda.'

  try {
    const r = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey,
      { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system }] },
          contents: messages,
          generationConfig: { maxOutputTokens: 500, temperature: 0.7 }
        }) }
    )
    const d = await r.json()
    if (!r.ok) return res.status(500).json({ error: d?.error?.message || 'Error Gemini ' + r.status })
    const text = d?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sin respuesta'
    return res.status(200).json({ text })
  } catch (e) {
    return res.status(500).json({ error: String(e) })
  }
}
