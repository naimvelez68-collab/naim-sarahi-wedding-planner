export const config = { api: { bodyParser: true } }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return res.status(500).json({ error: 'Sin API key configurada' })

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const messages = body?.messages ?? []
    const context  = body?.context  ?? {}

    if (!messages.length) return res.status(400).json({ error: 'Sin mensajes' })

    const systemText = `Eres el asistente del Wedding Planner de Naim y Sarahi. Boda 8 agosto 2026 Ibarra Ecuador. Presupuesto: $${context.budgetTotal ?? 2000}. Invitados: ${context.totalGuests ?? 0} total, ${context.confirmed ?? 0} confirmados. Presupuesto real: $${context.budgetReal ?? 0}. Pagado: $${context.budgetPaid ?? 0}. Responde en espanol, breve y amigable.`

    const payload = {
      system_instruction: { parts: [{ text: systemText }] },
      contents: messages,
      generationConfig: { maxOutputTokens: 600, temperature: 0.7 },
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
    )

    const data = await geminiRes.json()

    if (!geminiRes.ok) {
      return res.status(500).json({ error: data?.error?.message ?? `Gemini HTTP ${geminiRes.status}` })
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sin respuesta.'
    return res.status(200).json({ text })

  } catch (e) {
    return res.status(500).json({ error: `Excepcion: ${e?.message ?? String(e)}` })
  }
}
