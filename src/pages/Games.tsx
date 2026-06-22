import React, { useState } from 'react'
import { Gamepad2, Plus, Edit2, Trash2 } from 'lucide-react'
import { useWeddingStore } from '../store/useWeddingStore'
import { Game, GameStatus } from '../types'
import { PageHeader, Card, Button, Badge, Modal, Input, Select, Textarea, ConfirmDialog, EmptyState } from '../components/ui'

const EMPTY: Omit<Game, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '', description: '', timing: '', duration: 15, materials: '',
  responsible: '', prizes: '', notes: '', status: 'planned',
}
const STATUS_BADGE: Record<GameStatus, { variant: 'gray' | 'olive' | 'red'; label: string }> = {
  planned: { variant: 'gray', label: 'Planificado' }, confirmed: { variant: 'olive', label: 'Confirmado' }, cancelled: { variant: 'red', label: 'Cancelado' },
}

export const Games: React.FC = () => {
  const { games, addGame, updateGame, deleteGame } = useWeddingStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editItem, setEditItem]       = useState<Game | null>(null)
  const [deleteId, setDeleteId]       = useState<string | null>(null)
  const [form, setForm]               = useState(EMPTY)

  const openAdd  = () => { setForm(EMPTY); setEditItem(null); setIsModalOpen(true) }
  const openEdit = (g: Game) => { setForm({ ...g }); setEditItem(g); setIsModalOpen(true) }
  const handleClose = () => { setIsModalOpen(false); setEditItem(null); setForm(EMPTY) }
  const handleSave = () => {
    if (!form.name.trim()) return
    if (editItem) updateGame(editItem.id, form)
    else addGame(form)
    handleClose()
  }
  const totalDuration = games.reduce((s, g) => s + g.duration, 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Juegos & Dinámicas" subtitle={`${games.length} juegos · ${totalDuration} minutos`}
        icon={<Gamepad2 className="w-5 h-5" />}
        action={<Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Agregar juego</Button>} />

      {games.length === 0 ? (
        <EmptyState icon={<Gamepad2 className="w-12 h-12" />} title="Sin juegos planificados"
          description="Agrega juegos y dinámicas para entretener a tus invitados de 8 a 80 años."
          action={<Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Agregar juego</Button>} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {games.map(g => {
            const st = STATUS_BADGE[g.status]
            return (
              <Card key={g.id} hover>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-stone-800">{g.name}</h3>
                        <Badge variant={st.variant}>{st.label}</Badge>
                        <Badge variant="gray">{g.duration}min</Badge>
                      </div>
                      {g.timing && <p className="text-xs text-stone-400 mt-0.5">⏰ {g.timing}</p>}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <select value={g.status} onChange={e => updateGame(g.id, { status: e.target.value as GameStatus })}
                        className="text-xs px-2 py-1 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-olive-400">
                        <option value="planned">Planificado</option>
                        <option value="confirmed">Confirmado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                      <button onClick={() => openEdit(g)} className="p-1.5 rounded-lg text-stone-400 hover:text-olive-600 hover:bg-olive-50 transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteId(g.id)} className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <p className="text-sm text-stone-600 mb-2">{g.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-stone-500">
                    {g.materials && <div><span className="font-medium">Materiales:</span> {g.materials}</div>}
                    {g.responsible && <div><span className="font-medium">Responsable:</span> {g.responsible}</div>}
                    {g.prizes && <div className="col-span-2"><span className="font-medium">Premios:</span> {g.prizes}</div>}
                  </div>
                  {g.notes && <p className="text-xs text-stone-400 italic mt-2">{g.notes}</p>}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleClose} title={editItem ? 'Editar juego' : 'Nuevo juego / dinámica'} maxWidth="max-w-2xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.name.trim()}>{editItem ? 'Guardar' : 'Agregar'}</Button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Input label="Nombre *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
          <Input label="Momento del evento" value={form.timing} onChange={e => setForm(p => ({ ...p, timing: e.target.value }))} placeholder="Después de la cena" />
          <Input label="Duración (min)" type="number" min={1} value={form.duration} onChange={e => setForm(p => ({ ...p, duration: Number(e.target.value) }))} />
          <Input label="Responsable" value={form.responsible} onChange={e => setForm(p => ({ ...p, responsible: e.target.value }))} />
          <Input label="Materiales" value={form.materials} onChange={e => setForm(p => ({ ...p, materials: e.target.value }))} />
          <div className="col-span-2"><Input label="Premios" value={form.prizes} onChange={e => setForm(p => ({ ...p, prizes: e.target.value }))} /></div>
          <div className="col-span-2"><Textarea label="Descripción" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
          <div className="col-span-2"><Textarea label="Notas" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} title="Eliminar juego" message="¿Eliminar este juego?"
        onConfirm={() => { if (deleteId) { deleteGame(deleteId); setDeleteId(null) } }}
        onCancel={() => setDeleteId(null)} confirmLabel="Eliminar" />
    </div>
  )
}
