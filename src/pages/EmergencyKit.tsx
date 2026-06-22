import React, { useState } from 'react'
import { BriefcaseMedical, Plus, Trash2, Download, Check } from 'lucide-react'
import { useWeddingStore } from '../store/useWeddingStore'
import { EmergencyKitItem } from '../types'
import { PageHeader, Card, Button, Modal, Input, Textarea, ConfirmDialog, EmptyState, ProgressBar, StatCard } from '../components/ui'

const EMPTY: Omit<EmergencyKitItem, 'id' | 'createdAt' | 'updatedAt'> = {
  item: '', quantity: 1, responsible: '', isPacked: false, notes: '',
}

export const EmergencyKit: React.FC = () => {
  const { emergencyKit, addEmergencyItem, deleteEmergencyItem, toggleEmergencyItem, updateEmergencyItem } = useWeddingStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteId, setDeleteId]       = useState<string | null>(null)
  const [form, setForm]               = useState(EMPTY)

  const packed   = emergencyKit.filter(i => i.isPacked).length
  const pct      = emergencyKit.length > 0 ? (packed / emergencyKit.length) * 100 : 0

  const handleSave = () => {
    if (!form.item.trim()) return
    addEmergencyItem(form)
    setIsModalOpen(false)
    setForm(EMPTY)
  }

  const handlePrint = () => {
    const lines = emergencyKit.map(i => `[${i.isPacked ? 'X' : ' '}] ${i.item} (x${i.quantity}) — ${i.responsible}`).join('\n')
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<pre>KIT DE EMERGENCIA — Naim & Sarahí\n\n${lines}</pre>`)
    w.print()
  }

  const responsibles = [...new Set(emergencyKit.map(i => i.responsible).filter(Boolean))]

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Kit de Emergencia" subtitle="Todo lo que necesitan el día de la boda"
        icon={<BriefcaseMedical className="w-5 h-5" />}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handlePrint}><Download className="w-4 h-4" /> Imprimir</Button>
            <Button size="sm" onClick={() => setIsModalOpen(true)}><Plus className="w-4 h-4" /> Agregar</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label="Total items" value={emergencyKit.length} color="olive" />
        <StatCard label="Empacados"   value={packed}              color="green" />
        <StatCard label="Pendientes"  value={emergencyKit.length - packed} color="amber" />
      </div>

      <Card className="p-4">
        <div className="flex justify-between mb-2">
          <p className="text-sm font-medium text-stone-600">Kit preparado</p>
          <span className="text-sm font-bold text-olive-600">{packed}/{emergencyKit.length}</span>
        </div>
        <ProgressBar value={packed} max={emergencyKit.length || 1} color={pct === 100 ? 'olive' : 'gold'} />
        {pct === 100 && <p className="text-xs text-green-600 font-medium mt-1">✅ ¡Kit completamente empacado!</p>}
      </Card>

      {emergencyKit.length === 0 ? (
        <EmptyState icon={<BriefcaseMedical className="w-12 h-12" />} title="Kit de emergencia vacío"
          action={<Button size="sm" onClick={() => setIsModalOpen(true)}><Plus className="w-4 h-4" /> Agregar item</Button>} />
      ) : (
        <>
          {responsibles.length > 0 && (
            <div className="space-y-4">
              {responsibles.map(resp => {
                const items = emergencyKit.filter(i => i.responsible === resp)
                return (
                  <div key={resp}>
                    <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2">👤 {resp}</h3>
                    <Card>
                      <div className="divide-y divide-stone-100">
                        {items.map(i => (
                          <div key={i.id} className={`flex items-center gap-3 px-4 py-3 ${i.isPacked ? 'bg-green-50/40' : ''}`}>
                            <button
                              onClick={() => toggleEmergencyItem(i.id)}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                i.isPacked ? 'bg-green-500 border-green-500 text-white' : 'border-stone-300 hover:border-olive-400'
                              }`}
                            >
                              {i.isPacked && <Check className="w-3 h-3" />}
                            </button>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${i.isPacked ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                                {i.item}
                              </p>
                              <div className="text-xs text-stone-400 flex gap-2">
                                <span>x{i.quantity}</span>
                                {i.notes && <span>· {i.notes}</span>}
                              </div>
                            </div>
                            <button onClick={() => setDeleteId(i.id)} className="p-1 rounded text-stone-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                )
              })}
            </div>
          )}
          {/* Unassigned */}
          {emergencyKit.filter(i => !i.responsible).length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2">Sin responsable</h3>
              <Card>
                {emergencyKit.filter(i => !i.responsible).map(i => (
                  <div key={i.id} className={`flex items-center gap-3 px-4 py-3 border-b border-stone-100 last:border-b-0 ${i.isPacked ? 'bg-green-50/40' : ''}`}>
                    <button onClick={() => toggleEmergencyItem(i.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${i.isPacked ? 'bg-green-500 border-green-500 text-white' : 'border-stone-300 hover:border-olive-400'}`}>
                      {i.isPacked && <Check className="w-3 h-3" />}
                    </button>
                    <p className={`flex-1 text-sm ${i.isPacked ? 'line-through text-stone-400' : 'text-stone-800'}`}>{i.item} (x{i.quantity})</p>
                    <button onClick={() => setDeleteId(i.id)} className="p-1 rounded text-stone-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </Card>
            </div>
          )}
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Agregar al kit de emergencia"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.item.trim()}>Agregar</Button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Input label="Item *" value={form.item} onChange={e => setForm(p => ({ ...p, item: e.target.value }))} /></div>
          <Input label="Cantidad" type="number" min={1} value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: Number(e.target.value) }))} />
          <Input label="Responsable" value={form.responsible} onChange={e => setForm(p => ({ ...p, responsible: e.target.value }))} />
          <div className="col-span-2"><Textarea label="Notas" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} title="Eliminar item" message="¿Eliminar este item del kit?"
        onConfirm={() => { if (deleteId) { deleteEmergencyItem(deleteId); setDeleteId(null) } }}
        onCancel={() => setDeleteId(null)} confirmLabel="Eliminar" />
    </div>
  )
}
