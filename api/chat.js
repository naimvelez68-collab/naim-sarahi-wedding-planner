export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY no configurada' })
  }

  const { messages, context } = req.body || {}
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages requerido' })
  }

  const systemText = `Eres el asistente inteligente del Wedding Planner de Naim y Sarahí.
Boda: 8 de agosto 2026, Ibarra, Ecuador. Presupuesto aprobado: $${context?.budgetTotal ?? 2000}.

DATOS ACTUALES DEL PLANIFICADOR:
- Invitados: ${context?.totalGuests ?? 0} registrados | ${context?.confirmed ?? 0} confirmados | ${context?.pending ?? 0} pendientes
- Presupuesto total real: $${context?.budgetReal ?? 0} de $${context?.budgetTotal ?? 2000} aprobados
- Pagado hasta ahora: $${context?.budgetPaid ?? 0}
- Pendiente por pagar: $${context?.budgetPending ?? 0}
- Lugar: ${context?.venue ?? 'Por confirmar'}

Responde en español, de forma amigable, directa y útil. Si te preguntan sobre datos del planificador usa los datos de arriba. Máximo 3 párrafos por respuesta.`

  const payload = {
    system_instruction: { parts: [{ text: systemText }] },
    contents: messages,
    generationConfig: { maxOutputTokens: 600, temperature: 0.7 },
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
    )
    const data = await geminiRes.json()

    if (!geminiRes.ok) {
      return res.status(500).json({ error: data?.error?.message ?? 'Error de Gemini' })
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No pude generar una respuesta.'
    res.status(200).json({ text })
  } catch (e) {
    res.status(500).json({ error: 'Error al conectar con Gemini' })
  }
}
