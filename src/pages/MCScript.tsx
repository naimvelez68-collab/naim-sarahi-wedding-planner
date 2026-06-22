import React, { useState } from 'react'
import { Mic, Plus, Edit2, Trash2, Download, ChevronUp, ChevronDown } from 'lucide-react'
import { useWeddingStore } from '../store/useWeddingStore'
import { MCSection } from '../types'
import { PageHeader, Card, Button, Modal, Input, Textarea, ConfirmDialog, EmptyState } from '../components/ui'

const EMPTY: Omit<MCSection, 'id' | 'createdAt' | 'updatedAt'> = {
  order: 1, title: '', content: '', timing: '', notes: '',
}

export const MCScript: React.FC = () => {
  const { mcScript, addMCSection, updateMCSection, deleteMCSection } = useWeddingStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editItem, setEditItem]       = useState<MCSection | null>(null)
  const [deleteId, setDeleteId]       = useState<string | null>(null)
  const [expandedId, setExpandedId]   = useState<string | null>(null)
  const [form, setForm]               = useState(EMPTY)

  const sorted = [...mcScript].sort((a, b) => a.order - b.order)

  const openAdd  = () => { setForm({ ...EMPTY, order: mcScript.length + 1 }); setEditItem(null); setIsModalOpen(true) }
  const openEdit = (s: MCSection) => { setForm({ ...s }); setEditItem(s); setIsModalOpen(true) }
  const handleClose = () => { setIsModalOpen(false); setEditItem(null); setForm(EMPTY) }
  const handleSave = () => {
    if (!form.title.trim()) return
    if (editItem) updateMCSection(editItem.id, form)
    else addMCSection(form)
    handleClose()
  }

  const handlePrint = () => {
    const lines = sorted.map(s => `═══ ${s.title} ═══\n(${s.timing})\n\n${s.content}\n${s.notes ? `\n[Nota: ${s.notes}]` : ''}`).join('\n\n')
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<pre>GUION DEL MAESTRO DE CEREMONIA\nBoda de Naim & Sarahí — 8 de Agosto 2026\n\n${lines}</pre>`)
    w.print()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Guion del MC" subtitle="Maestro de Ceremonia — guion editable"
        icon={<Mic className="w-5 h-5" />}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handlePrint}><Download className="w-4 h-4" /> Imprimir</Button>
            <Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Agregar sección</Button>
          </div>
        }
      />

      {sorted.length === 0 ? (
        <EmptyState icon={<Mic className="w-12 h-12" />} title="Sin guion cargado"
          action={<Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Primera sección</Button>} />
      ) : (
        <div className="space-y-3">
          {sorted.map((s, i) => {
            const isExpanded = expandedId === s.id
            return (
              <Card key={s.id} className="overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : s.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-gold-100 text-gold-700 font-bold text-sm flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-800">{s.title}</p>
                    {s.timing && <p className="text-xs text-stone-400">{s.timing}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={e => { e.stopPropagation(); openEdit(s) }} className="p-1.5 rounded-lg text-stone-400 hover:text-olive-600 hover:bg-olive-50 transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={e => { e.stopPropagation(); setDeleteId(s.id) }} className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-6 pb-4 border-t border-stone-100 pt-4 animate-fade-in">
                    <div className="bg-parchment rounded-xl p-4 font-serif text-stone-700 leading-relaxed whitespace-pre-wrap">
                      {s.content || <span className="italic text-stone-400">Sin contenido</span>}
                    </div>
                    {s.notes && (
                      <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                        <p className="text-xs font-semibold text-amber-700 mb-0.5">Nota del MC:</p>
                        <p className="text-sm text-amber-800">{s.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleClose} title={editItem ? 'Editar sección' : 'Nueva sección del guion'} maxWidth="max-w-2xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.title.trim()}>{editItem ? 'Guardar' : 'Agregar'}</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="Título *" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          <Input label="Momento (cuándo se usa)" value={form.timing} onChange={e => setForm(p => ({ ...p, timing: e.target.value }))} placeholder="Ej: Al inicio, durante la cena..." />
          <Textarea label="Contenido / Palabras del MC" value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={6} placeholder="Escribe aquí lo que debe decir el maestro de ceremonia..." />
          <Textarea label="Notas internas" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Notas para el MC (no se leen en voz alta)" />
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} title="Eliminar sección" message="¿Eliminar esta sección del guion?"
        onConfirm={() => { if (deleteId) { deleteMCSection(deleteId); setDeleteId(null) } }}
        onCancel={() => setDeleteId(null)} confirmLabel="Eliminar" />
    </div>
  )
}
