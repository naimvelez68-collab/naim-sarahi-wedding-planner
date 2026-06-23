module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'Sin API key' })

  const body = req.body || {}
  const messages = Array.isArray(body.messages) ? body.messages : []
  const ctx = body.context || {}
  if (!messages.length) return res.status(400).json({ error: 'Sin mensajes' })

  const cfg = ctx.config || {}
  const sum = ctx.summary || {}

  const system = `Eres el asistente inteligente del Wedding Planner de ${cfg.groomName || 'Naim'} y ${cfg.brideName || 'Sarahi'}.
Boda: sabado 8 agosto 2026, ${cfg.city || 'Ibarra'}, Ecuador.

DATOS COMPLETOS DEL PLANIFICADOR (usa estos datos para responder con precision):

CONFIGURACION:
- Lugar: ${cfg.venue || 'Por confirmar'}
- Presupuesto aprobado: $${cfg.budgetTotal || 2000}

RESUMEN:
- Total invitados: ${sum.totalGuests || 0} | Confirmados: ${sum.confirmed || 0} | Pendientes: ${sum.pending || 0} | No asistiran: ${sum.declined || 0}
- Presupuesto real estimado: $${sum.budgetReal || 0} de $${sum.budgetTotal || 2000} aprobados
- Pagado: $${sum.budgetPaid || 0} | Pendiente: $${sum.budgetPending || 0}

LISTA DE INVITADOS:
${JSON.stringify(ctx.guests || [], null, 0)}

ITEMS DE PRESUPUESTO:
${JSON.stringify(ctx.budgetItems || [], null, 0)}

PROVEEDORES:
${JSON.stringify(ctx.vendors || [], null, 0)}

TAREAS/CHECKLIST:
${JSON.stringify(ctx.tasks || [], null, 0)}

CRONOGRAMA DEL DIA:
${JSON.stringify(ctx.daySchedule || [], null, 0)}

RESPONSABLES:
${JSON.stringify(ctx.responsibles || [], null, 0)}

INSTRUCCIONES IMPORTANTES:
1. Responde SIEMPRE en espanol, de forma amigable y concisa.
2. Cuando el usuario pida ACTUALIZAR, CAMBIAR, MARCAR, AGREGAR algo en la base de datos, incluye al final de tu respuesta una accion en este formato exacto (sin espacios extras):
<ACTION>{"type":"TIPO","id":"ID_DEL_ELEMENTO","updates":{"campo":"valor"}}</ACTION>

Tipos de accion disponibles:
- update_guest: para cambiar status (confirmed/pending/declined), notas, etc. de un invitado
- complete_task: para marcar tarea como completada (solo necesita id)
- update_task: para actualizar campos de una tarea
- update_budget: para actualizar un item de presupuesto (paidAmount, status, realAmount, etc.)
- add_budget: para agregar nuevo item (campo "item" con el objeto completo)
- update_vendor: para actualizar proveedor
- update_config: para actualizar configuracion (campo "updates" con los campos a cambiar)

EJEMPLOS:
Usuario: "Marca a Juan Carlos Velez como confirmado"
Respuesta: "He marcado a Juan Carlos Velez como confirmado. <ACTION>{"type":"update_guest","id":"h7q16w90g5amqpsqkp9","updates":{"status":"confirmed"}}</ACTION>"

Usuario: "El DJ ya fue pagado, costo $350"
Respuesta: "Actualizado el pago del DJ. <ACTION>{"type":"update_budget","id":"ID","updates":{"paidAmount":350,"status":"paid"}}</ACTION>"

3. Si no puedes encontrar el ID exacto del elemento, busca por nombre en la lista y usa el id que corresponda.
4. Si no hay accion que realizar, responde solo con texto normal.`

  try {
    const r = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey,
      { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system }] },
          contents: messages,
          generationConfig: { maxOutputTokens: 800, temperature: 0.5 }
        }) }
    )
    const d = await r.json()
    if (!r.ok) return res.status(500).json({ error: d?.error?.message || 'Error Gemini ' + r.status })
    const text = d?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sin respuesta'
    return res.status(200).json({ text })
  } catch (e) {
    return res.status(500).json({ error: String(e) })
  }
}
