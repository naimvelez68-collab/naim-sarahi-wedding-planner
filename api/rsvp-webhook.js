// Called by velezguevara-boda.vercel.app when a guest confirms attendance.
// Marks the matching guest as confirmed in the wedding planner Supabase.

const { createClient } = require('@supabase/supabase-js')

const WP_URL = 'https://hoanquznfonsnzwvitlj.supabase.co'
const WP_KEY = 'sb_publishable_pUDuYt8e-f14RAyUaK2DZQ_8pauPnZ1'
const SECRET  = process.env.RSVP_WEBHOOK_SECRET ?? 'boda-naim-sarahi-2026'

function norm(n) {
  return (n || '').trim().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
}

function tokenMatch(a, b) {
  const ta = a.split(' ').filter(Boolean)
  const tb = b.split(' ').filter(Boolean)
  const [sh, lo] = ta.length <= tb.length ? [ta, tb] : [tb, ta]
  return sh.length > 0 && sh.every(tok => lo.includes(tok))
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://velezguevara-boda.vercel.app')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-webhook-secret')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (req.headers['x-webhook-secret'] !== SECRET) return res.status(401).json({ error: 'Unauthorized' })

  const { nombre, apellido } = req.body || {}
  if (!nombre) return res.status(400).json({ error: 'nombre required' })

  try {
    const supabase = createClient(WP_URL, WP_KEY)

    // Fetch current guests
    const { data: row, error: fetchErr } = await supabase
      .from('wedding_data')
      .select('guests')
      .eq('id', 'main')
      .single()

    if (fetchErr) return res.status(500).json({ error: fetchErr.message })
    const guests = row?.guests ?? []

    const incomingNorm = norm(`${nombre} ${apellido || ''}`.trim())
    let matched = 0

    const updated = guests.map(g => {
      if (g.status === 'confirmed') return g
      if (tokenMatch(incomingNorm, norm(g.name))) {
        matched++
        return { ...g, status: 'confirmed', updatedAt: new Date().toISOString() }
      }
      return g
    })

    if (matched > 0) {
      const { error: updateErr } = await supabase
        .from('wedding_data')
        .update({ guests: updated, updated_at: new Date().toISOString() })
        .eq('id', 'main')

      if (updateErr) return res.status(500).json({ error: updateErr.message })
    }

    return res.status(200).json({ ok: true, matched, name: incomingNorm })
  } catch (e) {
    console.error('[rsvp-webhook]', e)
    return res.status(500).json({ error: String(e) })
  }
}
