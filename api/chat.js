export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end('Method Not Allowed')
    return
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'Sin API key' })
    return
  }

  let messages, context
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})
    messages = body.messages || []
    context  = body.context  || {}
  } catch {
    res.status(400).json({ error: 'Body invalido' })
    return
  }

  const systemText = 'Eres el asistente del Wedding Planner de Naim y Sarahi. Boda 8 agosto 2026 Ibarra Ecuador. Responde en espanol, breve y amigable. Presupuesto aprobado: $' + (context.budgetTotal || 2000) + '. Invitados confirmados: ' + (context.confirmed || 0) + '.'

  const payload = JSON.stringify({
    system_instruction: { parts: [{ text: systemText }] },
    contents: messages,
    generationConfig: { maxOutputTokens: 500, temperature: 0.7 },
  })

  try {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey
    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    })
    const data = await geminiRes.json()
    if (!geminiRes.ok) {
      res.status(500).json({ error: data?.error?.message || 'Error Gemini ' + geminiRes.status })
      return
    }
    const text = (data?.candidates?.[0]?.content?.parts?.[0]?.text) || 'Sin respuesta'
    res.status(200).json({ text })
  } catch (err) {
    res.status(500).json({ error: 'Excepcion: ' + String(err) })
  }
}
