import React, { useState } from 'react'
import { PiggyBank, Plus, Edit2, Trash2 } from 'lucide-react'
import { useWeddingStore } from '../store/useWeddingStore'
import { SavingsDecision, SavingsDecisionType } from '../types'
import { PageHeader, Card, Button, Badge, Modal, Input, Select, Textarea, ConfirmDialog, EmptyState, StatCard } from '../components/ui'
import { formatCurrency } from '../utils'
import { SAVINGS_DECISION_LABELS } from '../constants/wedding'

const EMPTY: Omit<SavingsDecision, 'id' | 'createdAt' | 'updatedAt'> = {
  concept: '', currentPlan: '', alternative: '', estimatedSavings: 0,
  decision: 'keep', priority: 'medium', notes: '',
}
const DECISION_BADGE: Record<SavingsDecisionType, 'green' | 'amber' | 'red' | 'blue' | 'olive' | 'purple' | 'gray'> = {
  keep: 'gray', reduce: 'amber', eliminate: 'red', diy: 'olive', buy_early: 'blue', quote: 'blue', rent: 'purple',
}

export const Savings: React.FC = () => {
  const { savings, addSavings, updateSavings, deleteSavings } = useWeddingStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editItem, setEditItem]       = useState<SavingsDecision | null>(null)
  const [deleteId, setDeleteId]       = useState<string | null>(null)
  const [form, setForm]               = useState(EMPTY)

  const totalSavings = savings.filter(s => s.decision !== 'keep').reduce((sum, s) => sum + s.estimatedSavings, 0)

  const openAdd  = () => { setForm(EMPTY); setEditItem(null); setIsModalOpen(true) }
  const openEdit = (s: SavingsDecision) => { setForm({ ...s }); setEditItem(s); setIsModalOpen(true) }
  const handleClose = () => { setIsModalOpen(false); setEditItem(null); setForm(EMPTY) }
  const handleSave = () => {
    if (!form.concept.trim()) return
    if (editItem) updateSavings(editItem.id, form)
    else addSavings(form)
    handleClose()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Ahorro & Decisiones de Gasto" subtitle="¿Qué sí, qué reducir, qué eliminar?"
        icon={<PiggyBank className="w-5 h-5" />}
        action={<Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Agregar</Button>} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total items"    value={savings.length}             color="olive" />
        <StatCard label="Ahorro posible" value={formatCurrency(totalSavings)} color="green" />
        <StatCard label="Para reducir"   value={savings.filter(s => s.decision === 'reduce').length} color="amber" />
        <StatCard label="Para eliminar"  value={savings.filter(s => s.decision === 'eliminate').length} color="red" />
      </div>

      {savings.length === 0 ? (
        <EmptyState icon={<PiggyBank className="w-12 h-12" />} title="Sin decisiones de gasto"
          description="Agrega cada gasto y decide: mantener, reducir, eliminar, hacerlo vosotros o alquilar."
          action={<Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Agregar decisión</Button>} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {savings.map(s => (
            <Card key={s.id} hover>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-stone-800">{s.concept}</h3>
                      <Badge variant={DECISION_BADGE[s.decision]}>{SAVINGS_DECISION_LABELS[s.decision]}</Badge>
                      <Badge variant={s.priority === 'high' ? 'red' : s.priority === 'medium' ? 'amber' : 'gray'}>
                        {s.priority === 'high' ? 'Alta' : s.priority === 'medium' ? 'Media' : 'Baja'}
                      </Badge>
                    </div>
                    {s.estimatedSavings > 0 && (
                      <p className="text-sm text-green-600 font-medium mt-0.5">Ahorro estimado: {formatCurrency(s.estimatedSavings)}</p>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-stone-400 hover:text-olive-600 hover:bg-olive-50 transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(s.id)} className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                {s.currentPlan && <p className="text-sm text-stone-600 mb-1"><span className="text-xs text-stone-400 uppercase">Plan actual:</span> {s.currentPlan}</p>}
                {s.alternative && <p className="text-sm text-stone-600 mb-1"><span className="text-xs text-stone-400 uppercase">Alternativa:</span> {s.alternative}</p>}
                {s.notes && <p className="text-xs text-stone-400 italic">{s.notes}</p>}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleClose} title={editItem ? 'Editar decisión' : 'Nueva decisión de gasto'} maxWidth="max-w-2xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.concept.trim()}>{editItem ? 'Guardar' : 'Agregar'}</Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><Input label="Concepto *" value={form.concept} onChange={e => setForm(p => ({ ...p, concept: e.target.value }))} /></div>
          <div className="sm:col-span-2"><Textarea label="Plan actual" value={form.currentPlan} onChange={e => setForm(p => ({ ...p, currentPlan: e.target.value }))} /></div>
          <div className="sm:col-span-2"><Textarea label="Alternativa / Solución" value={form.alternative} onChange={e => setForm(p => ({ ...p, alternative: e.target.value }))} /></div>
          <Input label="Ahorro estimado ($)" type="number" min={0} step={1} value={form.estimatedSavings} onChange={e => setForm(p => ({ ...p, estimatedSavings: Number(e.target.value) }))} />
          <Select label="Decisión" value={form.decision} onChange={e => setForm(p => ({ ...p, decision: e.target.value as SavingsDecisionType }))}
            options={Object.entries(SAVINGS_DECISION_LABELS).map(([v, l]) => ({ value: v, label: l }))} />
          <Select label="Prioridad" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value as 'high' | 'medium' | 'low' }))}
            options={[{ value: 'high', label: 'Alta' }, { value: 'medium', label: 'Media' }, { value: 'low', label: 'Baja' }]} />
          <div className="sm:col-span-2"><Textarea label="Notas" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} title="Eliminar decisión" message="¿Eliminar esta decisión?"
        onConfirm={() => { if (deleteId) { deleteSavings(deleteId); setDeleteId(null) } }}
        onCancel={() => setDeleteId(null)} confirmLabel="Eliminar" />
    </div>
  )
}
