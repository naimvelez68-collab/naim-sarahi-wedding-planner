module.exports = async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY || ''
  const keyInfo = { len: apiKey.length, first10: apiKey.substring(0,10), last4: apiKey.substring(apiKey.length-4) }
  try {
    const r = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey,
      { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ contents:[{role:'user',parts:[{text:'OK'}]}] }) }
    )
    const d = await r.json()
    res.status(200).json({ keyInfo, geminiStatus: r.status, response: d?.candidates?.[0]?.content?.parts?.[0]?.text || d?.error?.message })
  } catch (e) {
    res.status(500).json({ keyInfo, error: String(e) })
  }
}
