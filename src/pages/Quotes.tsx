import React, { useState } from 'react'
import { FileSearch, Plus, Edit2, Trash2 } from 'lucide-react'
import { useWeddingStore } from '../store/useWeddingStore'
import { Quote, QuoteStatus } from '../types'
import { PageHeader, Card, Button, Badge, Modal, Input, Select, Textarea, ConfirmDialog, EmptyState } from '../components/ui'
import { formatCurrency, formatShortDate } from '../utils'

const EMPTY: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'> = {
  product: '', vendor: '', city: 'Ibarra', price: 0, unit: '', date: '',
  contact: '', link: '', notes: '', status: 'pending',
}
const STATUS_BADGE: Record<QuoteStatus, { variant: 'gray' | 'green' | 'red'; label: string }> = {
  pending:   { variant: 'gray',  label: 'Pendiente' },
  chosen:    { variant: 'green', label: 'Elegido' },
  discarded: { variant: 'red',   label: 'Descartado' },
}

export const Quotes: React.FC = () => {
  const { quotes, addQuote, updateQuote, deleteQuote } = useWeddingStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editItem, setEditItem]       = useState<Quote | null>(null)
  const [deleteId, setDeleteId]       = useState<string | null>(null)
  const [form, setForm]               = useState(EMPTY)

  const openAdd  = () => { setForm(EMPTY); setEditItem(null); setIsModalOpen(true) }
  const openEdit = (q: Quote) => { setForm({ ...q }); setEditItem(q); setIsModalOpen(true) }
  const handleClose = () => { setIsModalOpen(false); setEditItem(null); setForm(EMPTY) }
  const handleSave = () => {
    if (!form.product.trim()) return
    if (editItem) updateQuote(editItem.id, form)
    else addQuote(form)
    handleClose()
  }

  const products = [...new Set(quotes.map(q => q.product))]

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Cotizaciones" subtitle="Registro de precios reales en Ecuador/Ibarra"
        icon={<FileSearch className="w-5 h-5" />}
        action={<Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Agregar</Button>} />

      {products.length > 0 && (
        <div className="space-y-4">
          {products.map(prod => {
            const items = quotes.filter(q => q.product === prod)
            const minPrice = Math.min(...items.map(q => q.price))
            return (
              <Card key={prod} className="overflow-hidden">
                <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                  <h3 className="font-semibold text-stone-800">{prod}</h3>
                  <Badge variant="olive">Mejor precio: {formatCurrency(minPrice)}</Badge>
                </div>
                <div className="divide-y divide-stone-100">
                  {items.map(q => {
                    const st = STATUS_BADGE[q.status]
                    const isBest = q.price === minPrice
                    return (
                      <div key={q.id} className={`flex items-center justify-between p-4 ${isBest && q.status !== 'discarded' ? 'bg-green-50/50' : ''}`}>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-stone-800">{q.vendor}</p>
                            {isBest && q.status !== 'discarded' && <Badge variant="green">Más barato</Badge>}
                            <Badge variant={st.variant}>{st.label}</Badge>
                          </div>
                          <div className="flex gap-3 mt-0.5 text-xs text-stone-400">
                            <span>📍 {q.city}</span>
                            {q.contact && <span>📞 {q.contact}</span>}
                            {q.date && <span>📅 {formatShortDate(q.date)}</span>}
                          </div>
                          {q.notes && <p className="text-xs text-stone-400 mt-0.5 italic">{q.notes}</p>}
                        </div>
                        <div className="flex items-center gap-3 ml-3">
                          <div className="text-right">
                            <p className="font-bold text-stone-800">{formatCurrency(q.price)}</p>
                            <p className="text-xs text-stone-400">{q.unit}</p>
                          </div>
                          <select value={q.status} onChange={e => updateQuote(q.id, { status: e.target.value as QuoteStatus })}
                            className="text-xs px-2 py-1 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-olive-400">
                            <option value="pending">Pendiente</option>
                            <option value="chosen">Elegido</option>
                            <option value="discarded">Descartado</option>
                          </select>
                          <button onClick={() => openEdit(q)} className="p-1.5 rounded-lg text-stone-400 hover:text-olive-600 hover:bg-olive-50 transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => setDeleteId(q.id)} className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {quotes.length === 0 && (
        <EmptyState icon={<FileSearch className="w-12 h-12" />} title="Sin cotizaciones"
          description="Registra los precios reales de productos en Ibarra, Supermaxi, Tía, distribuidoras, etc."
          action={<Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Agregar cotización</Button>} />
      )}

      <Modal isOpen={isModalOpen} onClose={handleClose} title={editItem ? 'Editar cotización' : 'Nueva cotización'}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.product.trim()}>{editItem ? 'Guardar' : 'Agregar'}</Button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Input label="Producto / Servicio *" value={form.product} onChange={e => setForm(p => ({ ...p, product: e.target.value }))} /></div>
          <Input label="Proveedor" value={form.vendor} onChange={e => setForm(p => ({ ...p, vendor: e.target.value }))} />
          <Input label="Ciudad" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
          <Input label="Precio ($)" type="number" min={0} step={0.01} value={form.price} onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))} />
          <Input label="Unidad (lata, persona, etc)" value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))} />
          <Input label="Contacto" value={form.contact} onChange={e => setForm(p => ({ ...p, contact: e.target.value }))} />
          <Input label="Fecha de cotización" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
          <Select label="Estado" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as QuoteStatus }))}
            options={[{ value: 'pending', label: 'Pendiente' }, { value: 'chosen', label: 'Elegido' }, { value: 'discarded', label: 'Descartado' }]} />
          <Input label="Link o referencia" value={form.link} onChange={e => setForm(p => ({ ...p, link: e.target.value }))} />
          <div className="col-span-2"><Textarea label="Notas" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} title="Eliminar cotización" message="¿Eliminar esta cotización?"
        onConfirm={() => { if (deleteId) { deleteQuote(deleteId); setDeleteId(null) } }}
        onCancel={() => setDeleteId(null)} confirmLabel="Eliminar" />
    </div>
  )
}
