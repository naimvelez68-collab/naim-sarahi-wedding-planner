export default async function handler(req, res) {
  console.log('[chat] start', req.method)
  if (req.method !== 'POST') return res.status(405).end()
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'no key' })
  const { messages = [] } = req.body || {}
  if (!messages.length) return res.status(400).json({ error: 'no messages' })
  console.log('[chat] calling gemini, messages:', messages.length)
  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: messages, generationConfig: { maxOutputTokens: 400 } }) }
    )
    const d = await r.json()
    console.log('[chat] gemini status:', r.status)
    if (!r.ok) return res.status(500).json({ error: d?.error?.message || 'gemini error' })
    return res.status(200).json({ text: d?.candidates?.[0]?.content?.parts?.[0]?.text || 'sin respuesta' })
  } catch (e) {
    console.log('[chat] exception:', String(e))
    return res.status(500).json({ error: String(e) })
  }
}
