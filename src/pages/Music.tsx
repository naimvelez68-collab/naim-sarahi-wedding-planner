import React, { useState } from 'react'
import { Music as MusicIcon, Plus, Edit2, Trash2, Download } from 'lucide-react'
import { useWeddingStore } from '../store/useWeddingStore'
import { MusicItem } from '../types'
import { PageHeader, Card, Button, Badge, Modal, Input, Textarea, ConfirmDialog, EmptyState } from '../components/ui'

const EMPTY: Omit<MusicItem, 'id' | 'createdAt' | 'updatedAt'> = {
  moment: '', song: '', artist: '', responsible: '', duration: 3, isProhibited: false, isMandatory: false, notes: '', order: 1,
}

export const Music: React.FC = () => {
  const { music, addMusicItem, updateMusicItem, deleteMusicItem } = useWeddingStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editItem, setEditItem]       = useState<MusicItem | null>(null)
  const [deleteId, setDeleteId]       = useState<string | null>(null)
  const [form, setForm]               = useState(EMPTY)

  const sorted     = [...music].sort((a, b) => (a.isProhibited ? 1 : 0) - (b.isProhibited ? 1 : 0) || a.order - b.order)
  const mandatory  = sorted.filter(m => m.isMandatory)
  const optional   = sorted.filter(m => !m.isMandatory && !m.isProhibited)
  const prohibited = sorted.filter(m => m.isProhibited)

  const openAdd  = () => { setForm({ ...EMPTY, order: music.length + 1 }); setEditItem(null); setIsModalOpen(true) }
  const openEdit = (m: MusicItem) => { setForm({ ...m }); setEditItem(m); setIsModalOpen(true) }
  const handleClose = () => { setIsModalOpen(false); setEditItem(null); setForm(EMPTY) }
  const handleSave = () => {
    if (!form.moment.trim()) return
    if (editItem) updateMusicItem(editItem.id, form)
    else addMusicItem(form)
    handleClose()
  }

  const MusicList = ({ items, label, emptyMsg }: { items: MusicItem[]; label: string; emptyMsg: string }) => (
    <div>
      <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2">{label}</h3>
      {items.length === 0
        ? <p className="text-sm text-stone-400 italic p-4">{emptyMsg}</p>
        : (
          <Card>
            <div className="divide-y divide-stone-100">
              {items.map(m => (
                <div key={m.id} className={`flex items-start gap-3 p-4 ${m.isProhibited ? 'bg-red-50/50' : ''}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-stone-800">{m.moment}</p>
                      {m.isMandatory && <Badge variant="olive">Obligatoria</Badge>}
                      {m.isProhibited && <Badge variant="red">🚫 Prohibida</Badge>}
                    </div>
                    <p className="text-sm text-stone-600">{m.song}{m.artist ? ` — ${m.artist}` : ''}</p>
                    <div className="flex gap-3 mt-0.5 text-xs text-stone-400">
                      {m.responsible && <span>👤 {m.responsible}</span>}
                      {m.duration > 0 && <span>⏱ {m.duration}min</span>}
                    </div>
                    {m.notes && <p className="text-xs text-stone-400 italic mt-0.5">{m.notes}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg text-stone-400 hover:text-olive-600 hover:bg-olive-50 transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(m.id)} className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )
      }
    </div>
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Bailes & Canciones" subtitle={`${music.length} entradas`}
        icon={<MusicIcon className="w-5 h-5" />}
        action={<Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Agregar</Button>} />

      {music.length === 0 ? (
        <EmptyState icon={<MusicIcon className="w-12 h-12" />} title="Sin canciones registradas"
          action={<Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Agregar canción</Button>} />
      ) : (
        <>
          <MusicList items={mandatory}  label="Canciones obligatorias" emptyMsg="Sin canciones obligatorias" />
          <MusicList items={optional}   label="Canciones opcionales"   emptyMsg="Sin canciones opcionales" />
          <MusicList items={prohibited} label="Canciones prohibidas"   emptyMsg="Sin canciones prohibidas" />
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={handleClose} title={editItem ? 'Editar canción' : 'Nueva canción / momento'} maxWidth="max-w-lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.moment.trim()}>{editItem ? 'Guardar' : 'Agregar'}</Button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Input label="Momento *" value={form.moment} onChange={e => setForm(p => ({ ...p, moment: e.target.value }))} placeholder="Ej: Primer baile, Entrada a la iglesia" /></div>
          <Input label="Canción" value={form.song} onChange={e => setForm(p => ({ ...p, song: e.target.value }))} />
          <Input label="Artista" value={form.artist} onChange={e => setForm(p => ({ ...p, artist: e.target.value }))} />
          <Input label="Responsable (DJ, músico)" value={form.responsible} onChange={e => setForm(p => ({ ...p, responsible: e.target.value }))} />
          <Input label="Duración (min)" type="number" min={0} step={0.5} value={form.duration} onChange={e => setForm(p => ({ ...p, duration: Number(e.target.value) }))} />
          <div className="col-span-2 flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isMandatory} onChange={e => setForm(p => ({ ...p, isMandatory: e.target.checked }))} className="w-4 h-4 rounded accent-olive-500" />
              <span className="text-sm text-stone-700">Obligatoria</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isProhibited} onChange={e => setForm(p => ({ ...p, isProhibited: e.target.checked }))} className="w-4 h-4 rounded accent-red-500" />
              <span className="text-sm text-stone-700">Prohibida / No poner</span>
            </label>
          </div>
          <div className="col-span-2"><Textarea label="Notas" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} title="Eliminar canción" message="¿Eliminar esta canción?"
        onConfirm={() => { if (deleteId) { deleteMusicItem(deleteId); setDeleteId(null) } }}
        onCancel={() => setDeleteId(null)} confirmLabel="Eliminar" />
    </div>
  )
}
