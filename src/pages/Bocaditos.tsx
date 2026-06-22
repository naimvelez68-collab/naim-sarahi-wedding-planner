import React, { useState } from 'react'
import { UtensilsCrossed, Plus, Edit2, Trash2, Star } from 'lucide-react'
import { useWeddingStore } from '../store/useWeddingStore'
import { BocaditoOption } from '../types'
import { PageHeader, Card, Button, Badge, Modal, Input, Textarea, ConfirmDialog, EmptyState, Alert } from '../components/ui'
import { formatCurrency, getTotalAttendees } from '../utils'
import { BOCADITO_BUDGET_PER_PERSON } from '../constants/wedding'

const EMPTY: Omit<BocaditoOption, 'id' | 'createdAt' | 'updatedAt'> = {
  option: '', vendor: '', pricePerPerson: 0, quantityPerPerson: '',
  includesMontaje: false, includesVajilla: false, includesTransport: false,
  advantages: '', disadvantages: '', recommendation: '', isSelected: false, notes: '',
}

export const Bocaditos: React.FC = () => {
  const { bocaditos, guests, addBocadito, updateBocadito, deleteBocadito, selectBocadito } = useWeddingStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editItem, setEditItem]       = useState<BocaditoOption | null>(null)
  const [deleteId, setDeleteId]       = useState<string | null>(null)
  const [form, setForm]               = useState(EMPTY)

  const totalAttend = getTotalAttendees(guests)
  const budgetTotal = BOCADITO_BUDGET_PER_PERSON * totalAttend
  const selected    = bocaditos.find(b => b.isSelected)

  const openAdd  = () => { setForm(EMPTY); setEditItem(null); setIsModalOpen(true) }
  const openEdit = (b: BocaditoOption) => { setForm({ ...b }); setEditItem(b); setIsModalOpen(true) }
  const handleClose = () => { setIsModalOpen(false); setEditItem(null); setForm(EMPTY) }
  const handleSave = () => {
    if (!form.option.trim()) return
    if (editItem) updateBocadito(editItem.id, form)
    else addBocadito(form)
    handleClose()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Bocaditos" subtitle={`Presupuesto máx: $${BOCADITO_BUDGET_PER_PERSON}/persona`}
        icon={<UtensilsCrossed className="w-5 h-5" />}
        action={<Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Agregar opción</Button>} />

      {/* Budget summary */}
      <Card className="p-4 bg-cream border-gold-200 border">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div><p className="text-xs text-stone-400">Presupuesto/persona</p><p className="font-bold text-gold-600 text-lg">{formatCurrency(BOCADITO_BUDGET_PER_PERSON)}</p></div>
          <div><p className="text-xs text-stone-400">Invitados confirmados</p><p className="font-bold text-stone-800 text-lg">{totalAttend}</p></div>
          <div><p className="text-xs text-stone-400">Presupuesto total</p><p className="font-bold text-olive-600 text-lg">{formatCurrency(budgetTotal)}</p></div>
          {selected && <div><p className="text-xs text-stone-400">Opción elegida</p><p className="font-bold text-green-600 text-sm mt-1">{selected.option}</p></div>}
        </div>
      </Card>

      {selected && (
        <Alert variant="success" title={`Opción seleccionada: ${selected.option}`}
          message={`${selected.vendor} — ${formatCurrency(selected.pricePerPerson)}/persona — Total: ${formatCurrency(selected.pricePerPerson * totalAttend)}`} />
      )}

      {bocaditos.length === 0 ? (
        <EmptyState icon={<UtensilsCrossed className="w-12 h-12" />} title="Sin opciones de bocaditos"
          action={<Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Agregar opción</Button>} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {bocaditos.map(b => {
            const totalCost = b.pricePerPerson * totalAttend
            const isOver    = b.pricePerPerson > BOCADITO_BUDGET_PER_PERSON
            return (
              <Card key={b.id} className={`overflow-hidden ${b.isSelected ? 'ring-2 ring-green-400' : ''}`} hover>
                <div className={`px-4 py-3 flex items-start justify-between ${b.isSelected ? 'bg-green-50' : 'bg-stone-50'}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-stone-800">{b.option}</h3>
                      {b.isSelected && <Badge variant="green">⭐ Elegida</Badge>}
                      {isOver && <Badge variant="red">Excede presupuesto</Badge>}
                    </div>
                    <p className="text-sm text-stone-500">{b.vendor}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg text-stone-400 hover:text-olive-600 hover:bg-olive-100 transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(b.id)} className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><p className="text-xs text-stone-400">Por persona</p><p className={`font-bold text-lg ${isOver ? 'text-red-600' : 'text-olive-600'}`}>{formatCurrency(b.pricePerPerson)}</p></div>
                    <div><p className="text-xs text-stone-400">Total ({totalAttend}p)</p><p className={`font-bold text-lg ${isOver ? 'text-red-600' : 'text-stone-800'}`}>{formatCurrency(totalCost)}</p></div>
                  </div>
                  {b.quantityPerPerson && <p className="text-sm text-stone-600 mb-2">Cantidad: {b.quantityPerPerson}</p>}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant={b.includesMontaje ? 'olive' : 'gray'}>Montaje {b.includesMontaje ? '✓' : '✗'}</Badge>
                    <Badge variant={b.includesVajilla ? 'olive' : 'gray'}>Vajilla {b.includesVajilla ? '✓' : '✗'}</Badge>
                    <Badge variant={b.includesTransport ? 'olive' : 'gray'}>Transporte {b.includesTransport ? '✓' : '✗'}</Badge>
                  </div>
                  {b.advantages && <p className="text-xs text-green-700 bg-green-50 rounded-lg p-2 mb-1">✓ {b.advantages}</p>}
                  {b.disadvantages && <p className="text-xs text-red-700 bg-red-50 rounded-lg p-2 mb-1">✗ {b.disadvantages}</p>}
                  {b.recommendation && <p className="text-xs text-blue-700 bg-blue-50 rounded-lg p-2 mb-3">💡 {b.recommendation}</p>}
                  {!b.isSelected && (
                    <Button variant="secondary" size="sm" className="w-full" onClick={() => selectBocadito(b.id)}>
                      <Star className="w-4 h-4" /> Elegir esta opción
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleClose} title={editItem ? 'Editar opción' : 'Nueva opción de bocaditos'} maxWidth="max-w-2xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.option.trim()}>{editItem ? 'Guardar' : 'Agregar'}</Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Opción / Nombre *" value={form.option} onChange={e => setForm(p => ({ ...p, option: e.target.value }))} />
          <Input label="Proveedor" value={form.vendor} onChange={e => setForm(p => ({ ...p, vendor: e.target.value }))} />
          <Input label="Precio por persona ($)" type="number" min={0} step={0.01} value={form.pricePerPerson} onChange={e => setForm(p => ({ ...p, pricePerPerson: Number(e.target.value) }))} />
          <Input label="Cantidad por persona" value={form.quantityPerPerson} onChange={e => setForm(p => ({ ...p, quantityPerPerson: e.target.value }))} placeholder="Ej: 3 dulces + 3 salados" />
          <div className="sm:col-span-2 flex flex-wrap gap-4">
            {[
              { key: 'includesMontaje', label: 'Incluye montaje' },
              { key: 'includesVajilla', label: 'Incluye vajilla' },
              { key: 'includesTransport', label: 'Incluye transporte' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form[key as keyof typeof form] as boolean}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.checked }))}
                  className="w-4 h-4 rounded accent-olive-500" />
                <span className="text-sm text-stone-700">{label}</span>
              </label>
            ))}
          </div>
          <div className="sm:col-span-2"><Textarea label="Ventajas" value={form.advantages} onChange={e => setForm(p => ({ ...p, advantages: e.target.value }))} /></div>
          <div className="sm:col-span-2"><Textarea label="Desventajas" value={form.disadvantages} onChange={e => setForm(p => ({ ...p, disadvantages: e.target.value }))} /></div>
          <div className="sm:col-span-2"><Textarea label="Recomendación" value={form.recommendation} onChange={e => setForm(p => ({ ...p, recommendation: e.target.value }))} /></div>
          <div className="sm:col-span-2"><Textarea label="Notas" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} title="Eliminar opción" message="¿Eliminar esta opción de bocaditos?"
        onConfirm={() => { if (deleteId) { deleteBocadito(deleteId); setDeleteId(null) } }}
        onCancel={() => setDeleteId(null)} confirmLabel="Eliminar" />
    </div>
  )
}
