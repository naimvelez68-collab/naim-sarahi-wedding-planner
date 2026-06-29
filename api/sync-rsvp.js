const { createClient } = require('@supabase/supabase-js')

const WP_URL = 'https://hoanquznfonsnzwvitlj.supabase.co'
const WP_KEY = 'sb_publishable_pUDuYt8e-f14RAyUaK2DZQ_8pauPnZ1'
const RSVP_EXPORT = 'https://velezguevara-boda.vercel.app/api/rsvp-export'
const SECRET = process.env.RSVP_WEBHOOK_SECRET ?? 'boda-naim-sarahi-2026'

function norm(n) {
  return (n || '').replace(/^[^a-zA-ZÀ-ÿ]+/, '').trim().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
}
function tokenMatch(a, b) {
  const ta = a.split(' ').filter(Boolean)
  const tb = b.split(' ').filter(Boolean)
  const [sh, lo] = ta.length <= tb.length ? [ta, tb] : [tb, ta]
  return sh.length > 0 && sh.every(tok => lo.includes(tok))
}
function makeId() { return 'rsvp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7) }

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const rsvpRes = await fetch(RSVP_EXPORT, { headers: { 'x-webhook-secret': SECRET } })
    if (!rsvpRes.ok) {
      const text = await rsvpRes.text()
      return res.status(500).json({ error: 'Failed to fetch RSVP data', detail: text })
    }
    const { guests: rsvpGuests } = await rsvpRes.json()

    const supabase = createClient(WP_URL, WP_KEY)
    const { data: row, error: fetchErr } = await supabase
      .from('wedding_data').select('guests').eq('id', 'main').single()
    if (fetchErr) return res.status(500).json({ error: fetchErr.message })

    let guests = row?.guests ?? []
    const existingNorms = guests.map(g => norm(g.name))
    let newlyConfirmed = 0, added = 0

    // Confirm existing guests that match RSVP registrations
    guests = guests.map(g => {
      const gn = norm(g.name)
      const match = rsvpGuests.find(r => tokenMatch(gn, norm(`${r.nombre} ${r.apellido}`)))
      if (match && g.status !== 'confirmed') {
        newlyConfirmed++
        return { ...g, status: 'confirmed', updatedAt: new Date().toISOString() }
      }
      return g
    })

    // Add RSVP guests that are not in the wedding planner yet
    for (const r of rsvpGuests) {
      const rn = norm(`${r.nombre} ${r.apellido}`)
      if (!existingNorms.some(en => tokenMatch(rn, en))) {
        const fullName = (r.nombre.replace(/^[^a-zA-ZÀ-ÿ]+/, '').trim() + ' ' + r.apellido.trim()).trim()
        guests.push({
          id: makeId(), name: fullName, email: '', group: 'rsvp',
          notes: 'Registrado via RSVP', phone: '', status: 'confirmed',
          isChild: false, tableId: '', createdAt: new Date().toISOString(),
          isElderly: false, updatedAt: new Date().toISOString(), dietaryNote: '',
          hasCompanion: false, companionName: '', companionCount: 0,
          dietaryRestriction: 'none', hasReducedMobility: false,
        })
        added++
      }
    }

    const { error: updateErr } = await supabase
      .from('wedding_data')
      .update({ guests, updated_at: new Date().toISOString() })
      .eq('id', 'main')
    if (updateErr) return res.status(500).json({ error: updateErr.message })

    return res.status(200).json({
      ok: true,
      rsvp_registrations: rsvpGuests.length,
      newly_confirmed: newlyConfirmed,
      added,
      total_confirmed: guests.filter(g => g.status === 'confirmed').length,
      synced_at: new Date().toISOString(),
    })
  } catch (e) {
    console.error('[sync-rsvp]', e)
    return res.status(500).json({ error: String(e) })
  }
}
