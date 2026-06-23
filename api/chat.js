module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'no key' })
  const body = req.body || {}
  const messages = Array.isArray(body.messages) ? body.messages : []
  if (!messages.length) return res.status(400).json({ error: 'no messages' })
  try {
    const r = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey,
      { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: messages, generationConfig: { maxOutputTokens: 400 } }) }
    )
    const d = await r.json()
    if (!r.ok) return res.status(500).json({ error: d?.error?.message || 'error gemini ' + r.status })
    const text = d?.candidates?.[0]?.content?.parts?.[0]?.text || 'sin respuesta'
    return res.status(200).json({ text })
  } catch (e) {
    return res.status(500).json({ error: String(e) })
  }
}
