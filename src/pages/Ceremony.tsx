import React, { useState } from 'react'
import { Church, Plus, Edit2, Trash2, ChevronUp, ChevronDown, Download } from 'lucide-react'
import { useWeddingStore } from '../store/useWeddingStore'
import { CeremonyStep } from '../types'
import { PageHeader, Card, Button, Badge, Modal, Input, Textarea, ConfirmDialog, EmptyState } from '../components/ui'

const EMPTY: Omit<CeremonyStep, 'id' | 'createdAt' | 'updatedAt'> = {
  order: 1, title: '', description: '', responsible: '', duration: 5, text: '', notes: '',
}

export const Ceremony: React.FC = () => {
  const { ceremony, addCeremonyStep, updateCeremonyStep, deleteCeremonyStep, reorderCeremony } = useWeddingStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editStep, setEditStep]       = useState<CeremonyStep | null>(null)
  const [deleteId, setDeleteId]       = useState<string | null>(null)
  const [form, setForm]               = useState(EMPTY)

  const sorted = [...ceremony].sort((a, b) => a.order - b.order)
  const totalDuration = ceremony.reduce((s, c) => s + c.duration, 0)

  const openAdd  = () => { setForm({ ...EMPTY, order: ceremony.length + 1 }); setEditStep(null); setIsModalOpen(true) }
  const openEdit = (s: CeremonyStep) => { setForm({ ...s }); setEditStep(s); setIsModalOpen(true) }
  const handleClose = () => { setIsModalOpen(false); setEditStep(null); setForm(EMPTY) }
  const handleSave = () => {
    if (!form.title.trim()) return
    if (editStep) updateCeremonyStep(editStep.id, form)
    else addCeremonyStep(form)
    handleClose()
  }

  const moveStep = (index: number, dir: -1 | 1) => {
    const newArr = [...sorted]
    const swap = index + dir
    if (swap < 0 || swap >= newArr.length) return
    const tmp = newArr[index].order
    newArr[index] = { ...newArr[index], order: newArr[swap].order }
    newArr[swap]  = { ...newArr[swap], order: tmp }
    reorderCeremony(newArr)
  }

  const handlePrint = () => {
    const lines = sorted.map((s, i) => `${i+1}. ${s.title} (${s.duration}min) — ${s.responsible}\n   ${s.text || s.description}`).join('\n\n')
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<pre>ORDEN DE CEREMONIA — Naim & Sarahí · 8/08/2026\nDuración total: ${totalDuration} minutos\n\n${lines}</pre>`)
    w.print()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Ceremonia de Casamiento" subtitle={`${ceremony.length} pasos · ${totalDuration} minutos`}
        icon={<Church className="w-5 h-5" />}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handlePrint}><Download className="w-4 h-4" /> Imprimir</Button>
            <Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Agregar paso</Button>
          </div>
        }
      />

      {sorted.length === 0 ? (
        <EmptyState icon={<Church className="w-12 h-12" />} title="Sin pasos de ceremonia"
          action={<Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Agregar primer paso</Button>} />
      ) : (
        <div className="space-y-3">
          {sorted.map((s, i) => (
            <Card key={s.id} className="overflow-hidden" hover>
              <div className="flex items-start gap-3 p-4">
                <div className="w-8 h-8 rounded-full bg-olive-100 text-olive-700 font-bold text-sm flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-stone-800">{s.title}</h3>
                    <Badge variant="gray">{s.duration}min</Badge>
                    {s.responsible && <Badge variant="olive">{s.responsible}</Badge>}
                  </div>
                  {s.description && <p className="text-sm text-stone-500 mt-0.5">{s.description}</p>}
                  {s.text && (
                    <blockquote className="mt-2 pl-3 border-l-2 border-gold-300 text-sm text-stone-600 italic">
                      {s.text.substring(0, 200)}{s.text.length > 200 ? '...' : ''}
                    </blockquote>
                  )}
                  {s.notes && <p className="text-xs text-stone-400 mt-1">{s.notes}</p>}
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <button onClick={() => moveStep(i, -1)} disabled={i === 0} className="p-1 rounded hover:bg-stone-100 disabled:opacity-30 transition-colors"><ChevronUp className="w-4 h-4" /></button>
                  <button onClick={() => moveStep(i, 1)} disabled={i === sorted.length - 1} className="p-1 rounded hover:bg-stone-100 disabled:opacity-30 transition-colors"><ChevronDown className="w-4 h-4" /></button>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-stone-400 hover:text-olive-600 hover:bg-olive-50 transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteId(s.id)} className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleClose} title={editStep ? 'Editar paso' : 'Nuevo paso de ceremonia'} maxWidth="max-w-2xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.title.trim()}>{editStep ? 'Guardar' : 'Agregar'}</Button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Input label="Título del paso *" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
          <Input label="Responsable" value={form.responsible} onChange={e => setForm(p => ({ ...p, responsible: e.target.value }))} />
          <Input label="Duración (min)" type="number" min={1} value={form.duration} onChange={e => setForm(p => ({ ...p, duration: Number(e.target.value) }))} />
          <div className="col-span-2"><Textarea label="Descripción" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
          <div className="col-span-2"><Textarea label="Texto / Palabras (lo que se dice)" value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))} rows={4} /></div>
          <div className="col-span-2"><Textarea label="Notas" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} title="Eliminar paso" message="¿Eliminar este paso de la ceremonia?"
        onConfirm={() => { if (deleteId) { deleteCeremonyStep(deleteId); setDeleteId(null) } }}
        onCancel={() => setDeleteId(null)} confirmLabel="Eliminar" />
    </div>
  )
}
