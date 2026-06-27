// Called automatically by RSVP Supabase trigger when someone registers
const https = require('https')

const WP_URL  = 'https://hoanquznfonsnzwvitlj.supabase.co'
const WP_KEY  = process.env.VITE_SUPABASE_ANON_KEY

const RSVP_URL = 'https://btypvaktpzoqzafjhhqu.supabase.co'
const RSVP_KEY = process.env.RSVP_SERVICE_KEY

function norm(n) {
  return (n || '').toString().trim().replace(/^\.+/, '').replace(/\s+/g, ' ')
    .toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function tokenMatch(a, b) {
  const ta = a.split(' ').filter(Boolean)
  const tb = b.split(' ').filter(Boolean)
  const [sh, lo] = ta.length <= tb.length ? [ta, tb] : [tb, ta]
  return sh.every(tok => lo.includes(tok))
}

function apiRequest(baseUrl, key, method, path, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : null
    const u = new URL(baseUrl + path)
    const opts = {
      hostname: u.hostname, path: u.pathname + u.search, method,
      headers: {
        apikey: key, Authorization: `Bearer ${key}`,
        ...(bodyStr ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(bodyStr), Prefer: 'return=minimal' } : {})
      }
    }
    const r = https.request(opts, res => {
      let d = ''; res.on('data', c => d += c)
      res.on('end', () => resolve({ status: res.statusCode, body: d }))
    })
    r.on('error', reject)
    if (bodyStr) r.write(bodyStr)
    r.end()
  })
}

module.exports = async function handler(req, res) {
  // Allow GET (manual trigger) and POST (from Supabase webhook/trigger)
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!RSVP_KEY) return res.status(500).json({ error: 'RSVP_SERVICE_KEY not configured' })
  if (!WP_KEY)   return res.status(500).json({ error: 'VITE_SUPABASE_ANON_KEY not configured' })

  try {
    // 1. Fetch confirmed registrations from RSVP site
    const rsvpRes = await apiRequest(
      RSVP_URL, RSVP_KEY, 'GET',
      '/rest/v1/confirmaciones?select=nombre,apellido,acompanante_de&opcion=eq.quiero_invitacion&order=created_at.desc'
    )
    if (rsvpRes.status !== 200) {
      return res.status(500).json({ error: 'Failed to fetch RSVP data', detail: rsvpRes.body })
    }

    const registros = JSON.parse(rsvpRes.body)
    // Only independent guests (not companions)
    const mainGuests = registros.filter(r => !r.acompanante_de)
    const confirmedNorms = mainGuests.map(r => norm(`${r.nombre} ${r.apellido}`))

    // 2. Fetch current wedding planner guests
    const wpRes = await apiRequest(WP_URL, WP_KEY, 'GET', '/rest/v1/wedding_data?id=eq.main&select=guests')
    const guests = JSON.parse(wpRes.body)[0]?.guests || []

    // 3. Update statuses
    const updated = guests.map(g => {
      const gn = norm(g.name)
      const isConfirmed = confirmedNorms.some(cn => tokenMatch(gn, cn))
      return { ...g, status: isConfirmed ? 'confirmed' : 'pending', updatedAt: new Date().toISOString() }
    })

    const confirmed = updated.filter(g => g.status === 'confirmed').length
    const pending   = updated.filter(g => g.status === 'pending').length

    // 4. PATCH wedding planner
    const patch = await apiRequest(WP_URL, WP_KEY, 'PATCH', '/rest/v1/wedding_data?id=eq.main', { guests: updated })
    if (patch.status < 200 || patch.status >= 300) {
      return res.status(500).json({ error: 'Failed to update wedding planner', detail: patch.body })
    }

    return res.status(200).json({
      ok: true,
      rsvp_registrations: mainGuests.length,
      confirmed,
      pending,
      synced_at: new Date().toISOString()
    })
  } catch (e) {
    return res.status(500).json({ error: String(e) })
  }
}
