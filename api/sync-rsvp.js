// Full sync: reads all confirmed guests from velezguevara-boda and marks them
// as confirmed in the wedding planner. Safe to run periodically (cron).

const { createClient } = require('@supabase/supabase-js')

const WP_URL = 'https://hoanquznfonsnzwvitlj.supabase.co'
const WP_KEY = 'sb_publishable_pUDuYt8e-f14RAyUaK2DZQ_8pauPnZ1'
const RSVP_EXPORT = 'https://velezguevara-boda.vercel.app/api/rsvp-export'
const SECRET = process.env.RSVP_WEBHOOK_SECRET ?? 'boda-naim-sarahi-2026'

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
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 1. Fetch confirmed list from RSVP site
    const rsvpRes = await fetch(RSVP_EXPORT, {
      headers: { 'x-webhook-secret': SECRET }
    })
    if (!rsvpRes.ok) {
      const text = await rsvpRes.text()
      return res.status(500).json({ error: 'Failed to fetch RSVP data', detail: text })
    }
    const { guests: rsvpGuests } = await rsvpRes.json()
    const confirmedNorms = (rsvpGuests ?? []).map(r => norm(`${r.nombre} ${r.apellido}`))

    // 2. Fetch current wedding planner guests via Supabase client
    const supabase = createClient(WP_URL, WP_KEY)
    const { data: rows, error: fetchErr } = await supabase
      .from('wedding_data')
      .select('guests')
      .eq('id', 'main')
      .single()

    if (fetchErr) return res.status(500).json({ error: fetchErr.message })
    const guests = rows?.guests ?? []

    // 3. Match and update — only set confirmed, never downgrade manually-set status
    const updated = guests.map(g => {
      const gn = norm(g.name)
      const isRsvpConfirmed = confirmedNorms.some(cn => tokenMatch(gn, cn))
      if (isRsvpConfirmed && g.status !== 'confirmed') {
        return { ...g, status: 'confirmed', updatedAt: new Date().toISOString() }
      }
      return g
    })

    const confirmed = updated.filter(g => g.status === 'confirmed').length

    // 4. Save to wedding planner
    const { error: updateErr } = await supabase
      .from('wedding_data')
      .update({ guests: updated, updated_at: new Date().toISOString() })
      .eq('id', 'main')

    if (updateErr) return res.status(500).json({ error: updateErr.message })

    return res.status(200).json({
      ok: true,
      rsvp_registrations: confirmedNorms.length,
      confirmed,
      synced_at: new Date().toISOString(),
    })
  } catch (e) {
    console.error('[sync-rsvp]', e)
    return res.status(500).json({ error: String(e) })
  }
}
