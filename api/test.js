export default function handler(req, res) {
  res.status(200).json({ ok: true, key: process.env.GEMINI_API_KEY ? 'present' : 'missing' })
}
