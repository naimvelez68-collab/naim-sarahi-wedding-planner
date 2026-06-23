export default async function handler(req, res) {
  console.log('[chat] method:', req.method)

  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  console.log('[chat] reading apiKey')
  const apiKey = process.env.GEMINI_API_KEY
  console.log('[chat] apiKey present:', !!apiKey, 'length:', apiKey?.length)

  if (!apiKey) {
    return res.status(500).json({ error: 'Sin API key' })
  }

  console.log('[chat] reading body')
  const body = req.body || {}
  const messages = Array.isArray(body.messages) ? body.messages : []
  console.log('[chat] messages count:', messages.length)

  if (!messages.length) {
    return res.status(400).json({ error: 'Sin mensajes' })
  }

  console.log('[chat] calling Gemini')
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`
    const payload = {
      contents: messages,
      generationConfig: { maxOutputTokens: 300, temperature: 0.7 },
    }
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    console.log('[chat] Gemini status:', r.status)
    const data = await r.json()
    if (!r.ok) {
      console.log('[chat] Gemini error:', data?.error?.message)
      return res.status(500).json({ error: data?.error?.message || 'Error Gemini' })
    }
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sin respuesta'
    console.log('[chat] success, reply length:', text.length)
    return res.status(200).json({ text })
  } catch (e) {
    console.log('[chat] exception:', String(e))
    return res.status(500).json({ error: String(e) })
  }
}
