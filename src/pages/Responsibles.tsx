import React, { useState } from 'react'
import { UserCheck, Plus, Edit2, Trash2 } from 'lucide-react'
import { useWeddingStore } from '../store/useWeddingStore'
import { Responsible } from '../types'
import { PageHeader, Card, Button, Modal, Input, Textarea, ConfirmDialog, EmptyState } from '../components/ui'

const EMPTY: Omit<Responsible, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '', role: '', phone: '', email: '', tasks: '', notes: '',
}

export const Responsibles: React.FC = () => {
  const { responsibles, addResponsible, updateResponsible, deleteResponsible } = useWeddingStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editItem, setEditItem]       = useState<Responsible | null>(null)
  const [deleteId, setDeleteId]       = useState<string | null>(null)
  const [form, setForm]               = useState(EMPTY)

  const openAdd  = () => { setForm(EMPTY); setEditItem(null); setIsModalOpen(true) }
  const openEdit = (r: Responsible) => { setForm({ ...r }); setEditItem(r); setIsModalOpen(true) }
  const handleClose = () => { setIsModalOpen(false); setEditItem(null); setForm(EMPTY) }
  const handleSave = () => {
    if (!form.name.trim()) return
    if (editItem) updateResponsible(editItem.id, form)
    else addResponsible(form)
    handleClose()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Responsables" subtitle={`${responsibles.length} personas asignadas`}
        icon={<UserCheck className="w-5 h-5" />}
        action={<Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Agregar</Button>} />

      {responsibles.length === 0 ? (
        <EmptyState icon={<UserCheck className="w-12 h-12" />} title="Sin responsables asignados"
          action={<Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Asignar responsable</Button>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {responsibles.map(r => (
            <Card key={r.id} hover>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="w-10 h-10 rounded-full bg-olive-100 text-olive-700 font-bold text-lg flex items-center justify-center mb-2">
                      {r.name.charAt(0)}
                    </div>
                    <p className="font-semibold text-stone-800">{r.name}</p>
                    <p className="text-sm text-olive-600">{r.role}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg text-stone-400 hover:text-olive-600 hover:bg-olive-50 transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(r.id)} className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  {r.phone && <p className="text-stone-500">📱 {r.phone}</p>}
                  {r.email && <p className="text-stone-500">✉️ {r.email}</p>}
                  {r.tasks && (
                    <div className="mt-2 p-2 bg-stone-50 rounded-lg">
                      <p className="text-xs font-semibold text-stone-500 mb-0.5">Responsabilidades:</p>
                      <p className="text-xs text-stone-600">{r.tasks}</p>
                    </div>
                  )}
                  {r.notes && <p className="text-xs text-stone-400 italic">{r.notes}</p>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleClose} title={editItem ? 'Editar responsable' : 'Nuevo responsable'}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.name.trim()}>{editItem ? 'Guardar' : 'Agregar'}</Button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <Input label="Nombre *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          <Input label="Rol / Función" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} />
          <Input label="Teléfono" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
          <Input label="Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          <div className="col-span-2"><Textarea label="Responsabilidades / Tareas" value={form.tasks} onChange={e => setForm(p => ({ ...p, tasks: e.target.value }))} /></div>
          <div className="col-span-2"><Textarea label="Notas" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} title="Eliminar responsable" message="¿Eliminar este responsable?"
        onConfirm={() => { if (deleteId) { deleteResponsible(deleteId); setDeleteId(null) } }}
        onCancel={() => setDeleteId(null)} confirmLabel="Eliminar" />
    </div>
  )
}
