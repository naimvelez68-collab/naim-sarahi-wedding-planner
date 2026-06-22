import React, { useState } from 'react'
import { ShoppingCart, Plus, Edit2, Trash2, Download } from 'lucide-react'
import { useWeddingStore } from '../store/useWeddingStore'
import { ShoppingItem, ShoppingPriority, ShoppingStatus } from '../types'
import { PageHeader, Card, Button, Badge, Modal, Input, Select, Textarea, ConfirmDialog, EmptyState, StatCard } from '../components/ui'
import { formatCurrency } from '../utils'
import { SHOPPING_PRIORITY_LABELS } from '../constants/wedding'

const EMPTY: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'> = {
  product: '', quantity: 1, estimatedPrice: 0, realPrice: 0, vendor: '',
  priority: 'buy_now', status: 'pending', notes: '',
}
const PRIORITY_COLOR: Record<ShoppingPriority, string> = {
  buy_now:   'bg-red-100 text-red-700',
  buy_later: 'bg-amber-100 text-amber-700',
  quote:     'bg-blue-100 text-blue-700',
  rent:      'bg-purple-100 text-purple-700',
  borrow:    'bg-stone-100 text-stone-600',
}

export const Shopping: React.FC = () => {
  const { shopping, addShoppingItem, updateShoppingItem, deleteShoppingItem } = useWeddingStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editItem, setEditItem]       = useState<ShoppingItem | null>(null)
  const [deleteId, setDeleteId]       = useState<string | null>(null)
  const [form, setForm]               = useState(EMPTY)

  const groups = Object.keys(SHOPPING_PRIORITY_LABELS) as ShoppingPriority[]
  const totalEstimated = shopping.reduce((s, i) => s + i.estimatedPrice * i.quantity, 0)
  const totalReal      = shopping.reduce((s, i) => s + i.realPrice * i.quantity, 0)
  const purchased      = shopping.filter(i => i.status === 'purchased').length

  const openAdd  = () => { setForm(EMPTY); setEditItem(null); setIsModalOpen(true) }
  const openEdit = (i: ShoppingItem) => { setForm({ ...i }); setEditItem(i); setIsModalOpen(true) }
  const handleClose = () => { setIsModalOpen(false); setEditItem(null); setForm(EMPTY) }
  const handleSave = () => {
    if (!form.product.trim()) return
    if (editItem) updateShoppingItem(editItem.id, form)
    else addShoppingItem(form)
    handleClose()
  }

  const handlePrint = () => {
    const lines = groups.flatMap(g => {
      const items = shopping.filter(i => i.priority === g)
      if (!items.length) return []
      return [`\n${SHOPPING_PRIORITY_LABELS[g].toUpperCase()}`, ...items.map(i => `  [${i.status === 'purchased' ? 'X' : ' '}] ${i.product} x${i.quantity} — ${i.vendor || '—'} — ${formatCurrency(i.estimatedPrice)}`)]
    }).join('\n')
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<pre>LISTA DE COMPRAS — Naim & Sarahí\n${lines}</pre>`)
    w.print()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Lista de Compras" subtitle={`${shopping.length} items · ${purchased} adquiridos`}
        icon={<ShoppingCart className="w-5 h-5" />}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handlePrint}><Download className="w-4 h-4" /> Imprimir</Button>
            <Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Agregar</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total items" value={shopping.length}                  color="olive" />
        <StatCard label="Adquiridos"  value={purchased}                        color="green" />
        <StatCard label="Estimado"    value={formatCurrency(totalEstimated)}    color="gold" />
        <StatCard label="Real"        value={formatCurrency(totalReal)}         color="amber" />
      </div>

      {shopping.length === 0 ? (
        <EmptyState icon={<ShoppingCart className="w-12 h-12" />} title="Lista de compras vacía"
          action={<Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Agregar item</Button>} />
      ) : (
        <div className="space-y-4">
          {groups.map(grp => {
            const items = shopping.filter(i => i.priority === grp)
            if (!items.length) return null
            return (
              <div key={grp}>
                <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2">
                  {SHOPPING_PRIORITY_LABELS[grp]} ({items.length})
                </h3>
                <Card>
                  <div className="divide-y divide-stone-100">
                    {items.map(item => (
                      <div key={item.id} className={`flex items-center gap-3 px-4 py-3 ${item.status === 'purchased' ? 'bg-green-50/40' : ''}`}>
                        <input
                          type="checkbox"
                          checked={item.status === 'purchased'}
                          onChange={e => updateShoppingItem(item.id, { status: e.target.checked ? 'purchased' : 'pending' })}
                          className="w-4 h-4 rounded accent-olive-500 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${item.status === 'purchased' ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                            {item.product}
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs text-stone-400 mt-0.5">
                            <span>x{item.quantity}</span>
                            {item.vendor && <span>· {item.vendor}</span>}
                            {item.notes && <span>· {item.notes}</span>}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-medium text-stone-700">{formatCurrency(item.estimatedPrice)}</p>
                          {item.realPrice > 0 && <p className="text-xs text-green-600">Real: {formatCurrency(item.realPrice)}</p>}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-stone-400 hover:text-olive-600 hover:bg-olive-50 transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleClose} title={editItem ? 'Editar item' : 'Nuevo item de compra'}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.product.trim()}>{editItem ? 'Guardar' : 'Agregar'}</Button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Input label="Producto *" value={form.product} onChange={e => setForm(p => ({ ...p, product: e.target.value }))} /></div>
          <Input label="Cantidad" type="number" min={1} value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: Number(e.target.value) }))} />
          <Input label="Precio estimado ($)" type="number" min={0} step={0.01} value={form.estimatedPrice} onChange={e => setForm(p => ({ ...p, estimatedPrice: Number(e.target.value) }))} />
          <Input label="Precio real ($)" type="number" min={0} step={0.01} value={form.realPrice} onChange={e => setForm(p => ({ ...p, realPrice: Number(e.target.value) }))} />
          <Input label="Proveedor / Tienda" value={form.vendor} onChange={e => setForm(p => ({ ...p, vendor: e.target.value }))} />
          <Select label="Prioridad" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value as ShoppingPriority }))}
            options={Object.entries(SHOPPING_PRIORITY_LABELS).map(([v, l]) => ({ value: v, label: l }))} />
          <Select label="Estado" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as ShoppingStatus }))}
            options={[{ value: 'pending', label: 'Pendiente' }, { value: 'purchased', label: 'Adquirido' }, { value: 'cancelled', label: 'Cancelado' }]} />
          <div className="col-span-2"><Textarea label="Notas" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} title="Eliminar item" message="¿Eliminar este item?"
        onConfirm={() => { if (deleteId) { deleteShoppingItem(deleteId); setDeleteId(null) } }}
        onCancel={() => setDeleteId(null)} confirmLabel="Eliminar" />
    </div>
  )
}
