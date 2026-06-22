import React, { useState } from 'react'
import { ShieldAlert, Plus, Edit2, Trash2 } from 'lucide-react'
import { useWeddingStore } from '../store/useWeddingStore'
import { PlanBItem } from '../types'
import { PageHeader, Card, Button, Badge, Modal, Input, Select, Textarea, ConfirmDialog, EmptyState } from '../components/ui'

const EMPTY: Omit<PlanBItem, 'id' | 'createdAt' | 'updatedAt'> = {
  scenario: '', solution: '', responsible: '', materials: '', priority: 'medium', notes: '',
}

export const PlanB: React.FC = () => {
  const { planB, addPlanBItem, updatePlanBItem, deletePlanBItem } = useWeddingStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editItem, setEditItem]       = useState<PlanBItem | null>(null)
  const [deleteId, setDeleteId]       = useState<string | null>(null)
  const [form, setForm]               = useState(EMPTY)

  const sorted = [...planB].sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.priority] - { high: 0, medium: 1, low: 2 }[b.priority]))
  const openAdd  = () => { setForm(EMPTY); setEditItem(null); setIsModalOpen(true) }
  const openEdit = (p: PlanBItem) => { setForm({ ...p }); setEditItem(p); setIsModalOpen(true) }
  const handleClose = () => { setIsModalOpen(false); setEditItem(null); setForm(EMPTY) }
  const handleSave = () => {
    if (!form.scenario.trim()) return
    if (editItem) updatePlanBItem(editItem.id, form)
    else addPlanBItem(form)
    handleClose()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Plan B" subtitle="Contingencias y soluciones de emergencia"
        icon={<ShieldAlert className="w-5 h-5" />}
        action={<Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Agregar escenario</Button>} />

      {sorted.length === 0 ? (
        <EmptyState icon={<ShieldAlert className="w-12 h-12" />} title="Sin planes de contingencia"
          description="Prepara soluciones para escenarios de emergencia: lluvia, proveedor que falla, emergencias médicas..."
          action={<Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Agregar escenario</Button>} />
      ) : (
        <div className="space-y-3">
          {sorted.map(p => (
            <Card key={p.id} hover>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-3 h-3 rounded-full shrink-0 ${
                    p.priority === 'high' ? 'bg-red-500' : p.priority === 'medium' ? 'bg-amber-500' : 'bg-stone-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-stone-800">⚠️ {p.scenario}</p>
                          <Badge variant={p.priority === 'high' ? 'red' : p.priority === 'medium' ? 'amber' : 'gray'}>
                            {p.priority === 'high' ? 'Alta' : p.priority === 'medium' ? 'Media' : 'Baja'}
                          </Badge>
                        </div>
                        <div className="mt-2 p-3 bg-green-50 rounded-xl border border-green-200">
                          <p className="text-xs font-semibold text-green-700 mb-0.5">✅ Solución:</p>
                          <p className="text-sm text-green-800">{p.solution}</p>
                        </div>
                        {(p.responsible || p.materials) && (
                          <div className="mt-2 flex flex-wrap gap-3 text-xs text-stone-500">
                            {p.responsible && <span>👤 <strong>Responsable:</strong> {p.responsible}</span>}
                            {p.materials && <span>🧰 <strong>Materiales:</strong> {p.materials}</span>}
                          </div>
                        )}
                        {p.notes && <p className="text-xs text-stone-400 italic mt-1">{p.notes}</p>}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-stone-400 hover:text-olive-600 hover:bg-olive-50 transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleClose} title={editItem ? 'Editar escenario' : 'Nuevo escenario Plan B'} maxWidth="max-w-2xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.scenario.trim()}>{editItem ? 'Guardar' : 'Agregar'}</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="Escenario *" value={form.scenario} onChange={e => setForm(p => ({ ...p, scenario: e.target.value }))} placeholder="Ej: Lluvia durante la ceremonia" />
          <Textarea label="Solución / Plan de acción" value={form.solution} onChange={e => setForm(p => ({ ...p, solution: e.target.value }))} rows={3} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Responsable" value={form.responsible} onChange={e => setForm(p => ({ ...p, responsible: e.target.value }))} />
            <Select label="Prioridad" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value as 'high' | 'medium' | 'low' }))}
              options={[{ value: 'high', label: 'Alta' }, { value: 'medium', label: 'Media' }, { value: 'low', label: 'Baja' }]} />
          </div>
          <Input label="Materiales / Recursos necesarios" value={form.materials} onChange={e => setForm(p => ({ ...p, materials: e.target.value }))} />
          <Textarea label="Notas" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} title="Eliminar escenario" message="¿Eliminar este escenario del Plan B?"
        onConfirm={() => { if (deleteId) { deletePlanBItem(deleteId); setDeleteId(null) } }}
        onCancel={() => setDeleteId(null)} confirmLabel="Eliminar" />
    </div>
  )
}
