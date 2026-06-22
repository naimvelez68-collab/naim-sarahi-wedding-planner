import React, { useState } from 'react'
import { Clock, Plus, Edit2, Trash2, Download } from 'lucide-react'
import { useWeddingStore } from '../store/useWeddingStore'
import { DayEvent, DayEventStatus } from '../types'
import { PageHeader, Card, Button, Badge, Modal, Input, Select, Textarea, ConfirmDialog, EmptyState } from '../components/ui'

const EMPTY: Omit<DayEvent, 'id' | 'createdAt' | 'updatedAt'> = {
  time: '', activity: '', duration: 30, responsible: '', notes: '', status: 'planned',
}
const STATUS_BADGE: Record<DayEventStatus, { variant: 'gray' | 'olive' | 'green' | 'red'; label: string }> = {
  planned:     { variant: 'gray',  label: 'Planificado' },
  in_progress: { variant: 'olive', label: 'En curso' },
  done:        { variant: 'green', label: 'Hecho' },
  skipped:     { variant: 'red',   label: 'Omitido' },
}

export const DaySchedule: React.FC = () => {
  const { daySchedule, addDayEvent, updateDayEvent, deleteDayEvent } = useWeddingStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editEvent, setEditEvent]     = useState<DayEvent | null>(null)
  const [deleteId, setDeleteId]       = useState<string | null>(null)
  const [form, setForm]               = useState(EMPTY)

  const sorted = [...daySchedule].sort((a, b) => a.time.localeCompare(b.time))
  const openAdd  = () => { setForm(EMPTY); setEditEvent(null); setIsModalOpen(true) }
  const openEdit = (e: DayEvent) => { setForm({ ...e }); setEditEvent(e); setIsModalOpen(true) }
  const handleClose = () => { setIsModalOpen(false); setEditEvent(null); setForm(EMPTY) }
  const handleSave = () => {
    if (!form.time.trim() || !form.activity.trim()) return
    if (editEvent) updateDayEvent(editEvent.id, form)
    else addDayEvent(form)
    handleClose()
  }

  const totalMinutes = daySchedule.reduce((s, e) => s + e.duration, 0)
  const totalHours   = (totalMinutes / 60).toFixed(1)

  const handlePrint = () => {
    const lines = sorted.map(e => `${e.time}  ${e.activity.padEnd(45)} ${e.duration}min  ${e.responsible}`).join('\n')
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<pre style="font-family:monospace">CRONOGRAMA DEL DÍA — Naim & Sarahí · 8/08/2026\n\nHORA    ACTIVIDAD                                       DURACIÓN  RESPONSABLE\n${'─'.repeat(90)}\n${lines}\n\nTotal del evento: ${totalHours} horas</pre>`)
    w.print()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Cronograma del Día" subtitle={`${daySchedule.length} actividades · ${totalHours} horas totales`}
        icon={<Clock className="w-5 h-5" />}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handlePrint}><Download className="w-4 h-4" /> Imprimir</Button>
            <Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Agregar</Button>
          </div>
        }
      />

      {sorted.length === 0 ? (
        <EmptyState icon={<Clock className="w-12 h-12" />} title="Sin actividades en el cronograma"
          action={<Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Agregar actividad</Button>} />
      ) : (
        <div className="relative">
          <div className="absolute left-16 top-0 bottom-0 w-px bg-olive-200" />
          <div className="space-y-3">
            {sorted.map((e, i) => {
              const st = STATUS_BADGE[e.status]
              return (
                <div key={e.id} className="flex gap-4 items-start animate-fade-in">
                  <div className="w-14 text-right shrink-0">
                    <span className="text-sm font-bold text-olive-700 font-serif">{e.time}</span>
                  </div>
                  <div className="relative z-10 w-4 h-4 mt-1 shrink-0">
                    <div className={`w-4 h-4 rounded-full border-2 border-white shadow ${
                      e.status === 'done' ? 'bg-green-500' : e.status === 'in_progress' ? 'bg-gold-400' : 'bg-olive-400'
                    }`} />
                  </div>
                  <Card className="flex-1 overflow-hidden" hover>
                    <div className="flex items-start justify-between p-3 gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-stone-800">{e.activity}</p>
                          <Badge variant={st.variant}>{st.label}</Badge>
                          <Badge variant="gray">{e.duration}min</Badge>
                        </div>
                        {e.responsible && <p className="text-xs text-stone-400 mt-0.5">👤 {e.responsible}</p>}
                        {e.notes && <p className="text-xs text-stone-400 italic mt-0.5">{e.notes}</p>}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <select
                          value={e.status}
                          onChange={ev => updateDayEvent(e.id, { status: ev.target.value as DayEventStatus })}
                          className="text-xs px-2 py-1 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-olive-400"
                        >
                          <option value="planned">Planificado</option>
                          <option value="in_progress">En curso</option>
                          <option value="done">Hecho</option>
                          <option value="skipped">Omitido</option>
                        </select>
                        <button onClick={() => openEdit(e)} className="p-1.5 rounded-lg text-stone-400 hover:text-olive-600 hover:bg-olive-50 transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteId(e.id)} className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleClose} title={editEvent ? 'Editar actividad' : 'Nueva actividad'}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.time || !form.activity}>{editEvent ? 'Guardar' : 'Agregar'}</Button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <Input label="Hora *" type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} />
          <Input label="Duración (min)" type="number" min={5} step={5} value={form.duration} onChange={e => setForm(p => ({ ...p, duration: Number(e.target.value) }))} />
          <div className="col-span-2">
            <Input label="Actividad *" value={form.activity} onChange={e => setForm(p => ({ ...p, activity: e.target.value }))} />
          </div>
          <Input label="Responsable" value={form.responsible} onChange={e => setForm(p => ({ ...p, responsible: e.target.value }))} />
          <Select label="Estado" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as DayEventStatus }))}
            options={[
              { value: 'planned', label: 'Planificado' }, { value: 'in_progress', label: 'En curso' },
              { value: 'done', label: 'Hecho' }, { value: 'skipped', label: 'Omitido' },
            ]} />
          <div className="col-span-2">
            <Textarea label="Notas" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} title="Eliminar actividad" message="¿Eliminar esta actividad del cronograma?"
        onConfirm={() => { if (deleteId) { deleteDayEvent(deleteId); setDeleteId(null) } }}
        onCancel={() => setDeleteId(null)} confirmLabel="Eliminar" />
    </div>
  )
}
