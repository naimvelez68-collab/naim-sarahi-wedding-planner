module.exports = async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY
  try {
    const r = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey,
      { method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'Di OK' }] }], generationConfig: { maxOutputTokens: 10 } }),
        signal: AbortSignal.timeout(9000)
      }
    )
    const d = await r.json()
    res.status(200).json({ status: r.status, text: d?.candidates?.[0]?.content?.parts?.[0]?.text, error: d?.error?.message })
  } catch (e) {
    res.status(500).json({ caught: String(e) })
  }
}
