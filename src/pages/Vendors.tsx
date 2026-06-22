import React, { useState } from 'react'
import { Store, Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react'
import { useWeddingStore } from '../store/useWeddingStore'
import { Vendor, VendorStatus, VendorRisk } from '../types'
import { PageHeader, Card, Button, Badge, Modal, Input, Select, Textarea, ConfirmDialog, EmptyState, Alert } from '../components/ui'
import { formatCurrency, formatShortDate, isDatePast, isDateSoon } from '../utils'
import { VENDOR_STATUS_LABELS } from '../constants/wedding'

const EMPTY: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '', service: '', contact: '', phone: '', email: '', city: 'Ibarra',
  totalValue: 0, advance: 0, balance: 0, dueDate: '', status: 'quoting',
  hasContract: false, risk: 'low', notes: '',
}
const STATUS_BADGE: Record<VendorStatus, { variant: 'amber' | 'olive' | 'green' | 'red' }> = {
  quoting: { variant: 'amber' }, reserved: { variant: 'olive' }, paid: { variant: 'green' }, discarded: { variant: 'red' },
}
const RISK_BADGE: Record<VendorRisk, { variant: 'green' | 'amber' | 'red' }> = {
  low: { variant: 'green' }, medium: { variant: 'amber' }, high: { variant: 'red' },
}

export const Vendors: React.FC = () => {
  const { vendors, addVendor, updateVendor, deleteVendor } = useWeddingStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editVendor, setEditVendor]   = useState<Vendor | null>(null)
  const [deleteId, setDeleteId]       = useState<string | null>(null)
  const [form, setForm]               = useState(EMPTY)

  const openAdd  = () => { setForm(EMPTY); setEditVendor(null); setIsModalOpen(true) }
  const openEdit = (v: Vendor) => { setForm({ ...v }); setEditVendor(v); setIsModalOpen(true) }
  const handleClose = () => { setIsModalOpen(false); setEditVendor(null); setForm(EMPTY) }
  const handleSave = () => {
    if (!form.name.trim()) return
    const balance = form.totalValue - form.advance
    const data = { ...form, balance }
    if (editVendor) updateVendor(editVendor.id, data)
    else addVendor(data)
    handleClose()
  }

  const noContract = vendors.filter(v => !v.hasContract && v.status === 'reserved')
  const noAdvance  = vendors.filter(v => v.advance === 0 && v.status === 'reserved')

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Proveedores" subtitle={`${vendors.length} registrados`} icon={<Store className="w-5 h-5" />}
        action={<Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Agregar</Button>} />

      {noContract.length > 0 && (
        <Alert variant="error" title={`${noContract.length} proveedor(es) sin contrato`}
          message={noContract.map(v => v.name).join(', ')} />
      )}
      {noAdvance.length > 0 && (
        <Alert variant="warning" title={`${noAdvance.length} proveedor(es) sin anticipo`}
          message={noAdvance.map(v => v.name).join(', ')} />
      )}

      {vendors.length === 0 ? (
        <EmptyState icon={<Store className="w-12 h-12" />} title="Sin proveedores"
          action={<Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Agregar proveedor</Button>} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {vendors.map(v => {
            const st = STATUS_BADGE[v.status]
            const rk = RISK_BADGE[v.risk]
            const overdue = v.status !== 'paid' && v.dueDate && isDatePast(v.dueDate)
            const soon    = v.status !== 'paid' && v.dueDate && isDateSoon(v.dueDate, 14)
            return (
              <Card key={v.id} className="overflow-hidden" hover>
                <div className="flex items-start justify-between p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-stone-800">{v.name}</h3>
                      <Badge variant={st.variant}>{VENDOR_STATUS_LABELS[v.status]}</Badge>
                      <Badge variant={rk.variant}>Riesgo {v.risk === 'low' ? 'bajo' : v.risk === 'medium' ? 'medio' : 'alto'}</Badge>
                    </div>
                    <p className="text-sm text-stone-500 mt-0.5">{v.service} · {v.city}</p>
                  </div>
                  <div className="flex gap-1 ml-2 shrink-0">
                    <button onClick={() => openEdit(v)} className="p-1.5 rounded-lg text-stone-400 hover:text-olive-600 hover:bg-olive-50 transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(v.id)} className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="border-t border-stone-100 px-4 py-3 grid grid-cols-3 gap-3 text-sm">
                  <div><p className="text-xs text-stone-400">Total</p><p className="font-semibold text-stone-800">{formatCurrency(v.totalValue)}</p></div>
                  <div><p className="text-xs text-stone-400">Anticipo</p><p className="font-semibold text-green-600">{formatCurrency(v.advance)}</p></div>
                  <div><p className="text-xs text-stone-400">Saldo</p><p className={`font-semibold ${overdue ? 'text-red-600' : 'text-amber-600'}`}>{formatCurrency(v.balance)}</p></div>
                </div>
                <div className="border-t border-stone-100 px-4 py-3 flex flex-wrap gap-3 text-sm items-center">
                  <span className="text-stone-500">{v.contact}</span>
                  {v.phone && <span className="text-stone-500">· {v.phone}</span>}
                  <div className="flex gap-2 ml-auto">
                    {v.hasContract
                      ? <Badge variant="olive">Contrato firmado</Badge>
                      : <Badge variant="red"><AlertTriangle className="w-3 h-3 mr-1" />Sin contrato</Badge>
                    }
                    {v.dueDate && (
                      <Badge variant={overdue ? 'red' : soon ? 'amber' : 'gray'}>
                        Vence {formatShortDate(v.dueDate)}
                      </Badge>
                    )}
                  </div>
                </div>
                {v.notes && <p className="px-4 pb-3 text-xs text-stone-400">{v.notes}</p>}
              </Card>
            )
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleClose}
        title={editVendor ? 'Editar proveedor' : 'Nuevo proveedor'} maxWidth="max-w-2xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.name.trim()}>{editVendor ? 'Guardar' : 'Agregar'}</Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Nombre *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          <Input label="Servicio" value={form.service} onChange={e => setForm(p => ({ ...p, service: e.target.value }))} />
          <Input label="Contacto" value={form.contact} onChange={e => setForm(p => ({ ...p, contact: e.target.value }))} />
          <Input label="Teléfono" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
          <Input label="Ciudad" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
          <Input label="Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} type="email" />
          <Input label="Valor total ($)" type="number" min={0} step={0.01} value={form.totalValue} onChange={e => setForm(p => ({ ...p, totalValue: Number(e.target.value) }))} />
          <Input label="Anticipo pagado ($)" type="number" min={0} step={0.01} value={form.advance} onChange={e => setForm(p => ({ ...p, advance: Number(e.target.value) }))} />
          <Select label="Estado" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as VendorStatus }))}
            options={Object.entries(VENDOR_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }))} />
          <Select label="Riesgo" value={form.risk} onChange={e => setForm(p => ({ ...p, risk: e.target.value as VendorRisk }))}
            options={[{ value: 'low', label: 'Bajo' }, { value: 'medium', label: 'Medio' }, { value: 'high', label: 'Alto' }]} />
          <Input label="Fecha límite de pago" type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
          <div className="flex items-center gap-2 mt-6">
            <input type="checkbox" id="contract" checked={form.hasContract} onChange={e => setForm(p => ({ ...p, hasContract: e.target.checked }))} className="w-4 h-4 rounded accent-olive-500" />
            <label htmlFor="contract" className="text-sm font-medium text-stone-700">Contrato firmado</label>
          </div>
          <div className="sm:col-span-2">
            <Textarea label="Notas" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} title="Eliminar proveedor" message="¿Eliminar este proveedor?"
        onConfirm={() => { if (deleteId) { deleteVendor(deleteId); setDeleteId(null) } }}
        onCancel={() => setDeleteId(null)} confirmLabel="Eliminar" />
    </div>
  )
}
