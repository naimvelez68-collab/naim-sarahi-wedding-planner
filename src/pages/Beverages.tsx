import React, { useState } from 'react'
import { Wine, Plus, Edit2, Trash2 } from 'lucide-react'
import { useWeddingStore } from '../store/useWeddingStore'
import { Beverage, BeverageType } from '../types'
import { PageHeader, Card, Button, Badge, Modal, Input, Select, Textarea, ConfirmDialog, EmptyState, StatCard, Alert } from '../components/ui'
import { formatCurrency, getTotalAttendees } from '../utils'
import { BEER_PRICE_PER_CAN } from '../constants/wedding'

const EMPTY: Omit<Beverage, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '', type: 'alcoholic', brand: '', unit: 'lata 355ml', pricePerUnit: 0,
  quantityPlanned: 0, quantityPurchased: 0, vendor: '', notes: '',
}

const TYPE_LABELS: Record<BeverageType, string> = {
  alcoholic:     'Alcohólica',
  non_alcoholic: 'Sin alcohol',
  water:         'Agua',
  soda:          'Gaseosa',
  juice:         'Jugo',
  ice:           'Hielo',
}

export const Beverages: React.FC = () => {
  const { beverages, guests, addBeverage, updateBeverage, deleteBeverage } = useWeddingStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editItem, setEditItem]       = useState<Beverage | null>(null)
  const [deleteId, setDeleteId]       = useState<string | null>(null)
  const [form, setForm]               = useState(EMPTY)
  const [beerCans, setBeerCans]       = useState(150)
  const [beerPrice, setBeerPrice]     = useState(BEER_PRICE_PER_CAN)

  const totalAttend = getTotalAttendees(guests)
  const totalCost   = beverages.reduce((s, b) => s + b.pricePerUnit * b.quantityPlanned, 0)
  const beerTotal   = beerCans * beerPrice
  const beerPerPerson = totalAttend > 0 ? (beerCans / totalAttend).toFixed(2) : '—'

  const openAdd  = () => { setForm(EMPTY); setEditItem(null); setIsModalOpen(true) }
  const openEdit = (b: Beverage) => { setForm({ ...b }); setEditItem(b); setIsModalOpen(true) }
  const handleClose = () => { setIsModalOpen(false); setEditItem(null); setForm(EMPTY) }
  const handleSave = () => {
    if (!form.name.trim()) return
    if (editItem) updateBeverage(editItem.id, form)
    else addBeverage(form)
    handleClose()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Bebidas" subtitle="Cervezas, agua, gaseosas y más" icon={<Wine className="w-5 h-5" />}
        action={<Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Agregar</Button>} />

      {/* Beer calculator */}
      <Card className="p-5 border-2 border-gold-200 bg-gold-50/30">
        <h3 className="font-semibold text-stone-800 mb-4 font-serif">🍺 Calculadora de Cervezas</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-xs font-medium text-stone-500 block mb-1">Cantidad de latas</label>
            <input type="number" min={1} value={beerCans} onChange={e => setBeerCans(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500 block mb-1">Precio por lata ($)</label>
            <input type="number" min={0} step={0.01} value={beerPrice} onChange={e => setBeerPrice(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500 block mb-1">Costo total</label>
            <p className="text-lg font-bold text-gold-600 mt-1">{formatCurrency(beerTotal)}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500 block mb-1">Latas por persona</label>
            <p className="text-lg font-bold text-olive-600 mt-1">{beerPerPerson}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {[100, 120, 130, 150].map(n => (
            <div key={n} className="bg-white rounded-lg p-3 border border-gold-200 text-center">
              <p className="font-semibold text-stone-700">{n} latas</p>
              <p className="text-gold-600 font-bold">{formatCurrency(n * beerPrice)}</p>
              <p className="text-stone-500">{totalAttend > 0 ? `${(n / totalAttend).toFixed(1)} c/invitado` : '— invitados'}</p>
            </div>
          ))}
        </div>
        {beerTotal > 200 && (
          <Alert variant="warning" className="mt-3" message={`Con ${beerCans} latas, el gasto en cerveza es ${formatCurrency(beerTotal)}. Considera comprar en distribuidora al por mayor para ahorrar.`} />
        )}
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label="Total bebidas" value={beverages.length}          color="olive" />
        <StatCard label="Costo total"   value={formatCurrency(totalCost)} color="gold" />
        <StatCard label="Asistentes"    value={totalAttend}               color="blue" />
      </div>

      {/* List */}
      {beverages.length === 0 ? (
        <EmptyState icon={<Wine className="w-12 h-12" />} title="Sin bebidas registradas"
          action={<Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Agregar bebida</Button>} />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-left">
                  <th className="px-4 py-3 font-semibold text-stone-600">Nombre</th>
                  <th className="px-4 py-3 font-semibold text-stone-600">Tipo</th>
                  <th className="px-4 py-3 font-semibold text-stone-600">Precio</th>
                  <th className="px-4 py-3 font-semibold text-stone-600">Cantidad</th>
                  <th className="px-4 py-3 font-semibold text-stone-600">Total</th>
                  <th className="px-4 py-3 text-right">Acc.</th>
                </tr>
              </thead>
              <tbody>
                {beverages.map(b => (
                  <tr key={b.id} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-stone-800">{b.name}</p>
                      {b.brand && <p className="text-xs text-stone-400">{b.brand} · {b.unit}</p>}
                    </td>
                    <td className="px-4 py-3"><Badge variant="gray">{TYPE_LABELS[b.type]}</Badge></td>
                    <td className="px-4 py-3">{formatCurrency(b.pricePerUnit)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <input type="number" min={0} value={b.quantityPlanned}
                          onChange={e => updateBeverage(b.id, { quantityPlanned: Number(e.target.value) })}
                          className="w-20 px-2 py-1 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-olive-400" />
                        <span className="text-xs text-stone-400">{b.unit}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-olive-600">{formatCurrency(b.pricePerUnit * b.quantityPlanned)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg text-stone-400 hover:text-olive-600 hover:bg-olive-50 transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteId(b.id)} className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-stone-300 bg-stone-50 font-bold">
                  <td colSpan={4} className="px-4 py-3 text-stone-700">TOTAL</td>
                  <td className="px-4 py-3 text-olive-700">{formatCurrency(totalCost)}</td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal isOpen={isModalOpen} onClose={handleClose} title={editItem ? 'Editar bebida' : 'Nueva bebida'}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.name.trim()}>{editItem ? 'Guardar' : 'Agregar'}</Button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Input label="Nombre *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
          <Select label="Tipo" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as BeverageType }))}
            options={Object.entries(TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }))} />
          <Input label="Marca" value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} />
          <Input label="Unidad" value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))} />
          <Input label="Precio por unidad ($)" type="number" min={0} step={0.01} value={form.pricePerUnit} onChange={e => setForm(p => ({ ...p, pricePerUnit: Number(e.target.value) }))} />
          <Input label="Cantidad planificada" type="number" min={0} value={form.quantityPlanned} onChange={e => setForm(p => ({ ...p, quantityPlanned: Number(e.target.value) }))} />
          <Input label="Proveedor" value={form.vendor} onChange={e => setForm(p => ({ ...p, vendor: e.target.value }))} />
          <div className="col-span-2"><Textarea label="Notas" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} title="Eliminar bebida" message="¿Eliminar esta bebida?"
        onConfirm={() => { if (deleteId) { deleteBeverage(deleteId); setDeleteId(null) } }}
        onCancel={() => setDeleteId(null)} confirmLabel="Eliminar" />
    </div>
  )
}
