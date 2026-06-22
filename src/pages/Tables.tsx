import React, { useState } from 'react'
import { Grid3X3, Plus, Edit2, Trash2, UserMinus, AlertTriangle, Download } from 'lucide-react'
import { useWeddingStore } from '../store/useWeddingStore'
import { Table } from '../types'
import { PageHeader, Card, Button, Badge, Modal, Input, Textarea, ConfirmDialog, EmptyState, Alert } from '../components/ui'
import { getTableOccupancy, getGuestsAtTable } from '../utils'

const EMPTY: Omit<Table, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '', capacity: 10, notes: '', avoidWith: [],
}

export const Tables: React.FC = () => {
  const { config, tables, guests, addTable, updateTable, deleteTable, assignGuestToTable } = useWeddingStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editTable, setEditTable]     = useState<Table | null>(null)
  const [deleteId, setDeleteId]       = useState<string | null>(null)
  const [form, setForm]               = useState(EMPTY)

  const openAdd  = () => { setForm(EMPTY); setEditTable(null); setIsModalOpen(true) }
  const openEdit = (t: Table) => { setForm({ ...t }); setEditTable(t); setIsModalOpen(true) }
  const handleClose = () => { setIsModalOpen(false); setEditTable(null); setForm(EMPTY) }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editTable) updateTable(editTable.id, form)
    else addTable(form)
    handleClose()
  }

  const unassignedGuests = guests.filter(g => !g.tableId && g.status === 'confirmed')

  const handlePrint = () => {
    const lines = tables.map(t => {
      const occ = getTableOccupancy(guests, t.id)
      const gs = getGuestsAtTable(guests, t.id)
      return `\n${t.name} (${occ}/${t.capacity})\n${gs.map(g => `  - ${g.name}${g.hasCompanion ? ` +${g.companionCount}` : ''}`).join('\n')}`
    }).join('\n')
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<pre>DISTRIBUCIÓN DE MESAS — Naim & Sarahí\n${lines}</pre>`)
    w.print()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Mesas"
        subtitle={`${tables.length} mesa(s) creadas`}
        icon={<Grid3X3 className="w-5 h-5" />}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handlePrint}><Download className="w-4 h-4" /> Imprimir</Button>
            <Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Nueva mesa</Button>
          </div>
        }
      />

      {unassignedGuests.length > 0 && (
        <Alert
          variant="warning"
          title={`${unassignedGuests.length} confirmado(s) sin mesa`}
          message={`Invitados sin asignar: ${unassignedGuests.slice(0, 5).map(g => g.name).join(', ')}${unassignedGuests.length > 5 ? '...' : ''}`}
        />
      )}

      {tables.length === 0 ? (
        <EmptyState
          icon={<Grid3X3 className="w-12 h-12" />}
          title="Sin mesas creadas"
          description="Crea las mesas para asignar a tus invitados."
          action={<Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Nueva mesa</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map(t => {
            const occupancy = getTableOccupancy(guests, t.id)
            const tableGuests = getGuestsAtTable(guests, t.id)
            const isFull = occupancy >= t.capacity
            const isOver = occupancy > config.maxPerTable
            const pct    = Math.min(100, (occupancy / t.capacity) * 100)

            return (
              <Card key={t.id} className="overflow-hidden" hover>
                {/* Header */}
                <div className={`px-4 py-3 flex items-center justify-between ${isOver ? 'bg-red-50' : isFull ? 'bg-olive-50' : 'bg-stone-50'}`}>
                  <div>
                    <h3 className="font-semibold text-stone-800">{t.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-sm font-bold ${isOver ? 'text-red-600' : isFull ? 'text-olive-600' : 'text-stone-600'}`}>
                        {occupancy}/{t.capacity}
                      </span>
                      {isOver && <Badge variant="red"><AlertTriangle className="w-3 h-3 mr-1" />Excedida</Badge>}
                      {isFull && !isOver && <Badge variant="olive">Llena</Badge>}
                      {!isFull && !isOver && <Badge variant="gray">{t.capacity - occupancy} lugares libres</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg text-stone-400 hover:text-olive-600 hover:bg-olive-100 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteId(t.id)} className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-100 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="px-4 pt-2">
                  <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isOver ? 'bg-red-500' : isFull ? 'bg-olive-500' : 'bg-gold-400'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Guests list */}
                <div className="p-4">
                  {tableGuests.length === 0 ? (
                    <p className="text-sm text-stone-400 italic">Sin invitados asignados</p>
                  ) : (
                    <ul className="space-y-1">
                      {tableGuests.map(g => (
                        <li key={g.id} className="flex items-center justify-between text-sm">
                          <span className={g.status === 'declined' ? 'text-red-400 line-through' : 'text-stone-700'}>
                            {g.name}{g.hasCompanion ? ` +${g.companionCount}` : ''}
                          </span>
                          <button
                            onClick={() => assignGuestToTable(g.id, null)}
                            className="p-1 rounded text-stone-300 hover:text-red-500 transition-colors"
                            title="Quitar de esta mesa"
                          >
                            <UserMinus className="w-3 h-3" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Assign unassigned guest */}
                  {unassignedGuests.length > 0 && !isFull && (
                    <div className="mt-3 border-t border-stone-100 pt-3">
                      <select
                        className="w-full text-xs px-2 py-1.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-olive-400"
                        defaultValue=""
                        onChange={e => { if (e.target.value) { assignGuestToTable(e.target.value, t.id); e.target.value = '' } }}
                      >
                        <option value="" disabled>+ Asignar invitado confirmado...</option>
                        {unassignedGuests.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                      </select>
                    </div>
                  )}

                  {t.notes && (
                    <p className="text-xs text-stone-400 mt-2 italic">{t.notes}</p>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={editTable ? `Editar: ${editTable.name}` : 'Nueva Mesa'}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.name.trim()}>
              {editTable ? 'Guardar' : 'Crear mesa'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="Nombre de la mesa *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Ej: Mesa Novios, Mesa Familia..." />
          <Input label="Capacidad máxima" type="number" min={1} max={20} value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: Number(e.target.value) }))} />
          <Textarea label="Notas" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Ej: Mesa principal, centro del salón..." />
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Eliminar mesa"
        message="Los invitados de esta mesa quedarán sin asignar. ¿Continuar?"
        onConfirm={() => { if (deleteId) { deleteTable(deleteId); setDeleteId(null) } }}
        onCancel={() => setDeleteId(null)}
        confirmLabel="Eliminar"
      />
    </div>
  )
}
