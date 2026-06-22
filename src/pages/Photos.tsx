import React, { useState } from 'react'
import { Camera, Plus, Trash2, Download, Check } from 'lucide-react'
import { useWeddingStore } from '../store/useWeddingStore'
import { PhotoItem } from '../types'
import { PageHeader, Card, Button, Badge, Modal, Input, Textarea, ConfirmDialog, EmptyState, ProgressBar, StatCard } from '../components/ui'

const EMPTY: Omit<PhotoItem, 'id' | 'createdAt' | 'updatedAt'> = {
  category: '', description: '', isRequired: true, isDone: false, notes: '',
}

export const Photos: React.FC = () => {
  const { photos, addPhotoItem, deletePhotoItem, togglePhoto, updatePhotoItem } = useWeddingStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteId, setDeleteId]       = useState<string | null>(null)
  const [form, setForm]               = useState(EMPTY)

  const done     = photos.filter(p => p.isDone).length
  const required = photos.filter(p => p.isRequired).length
  const reqDone  = photos.filter(p => p.isRequired && p.isDone).length
  const categories = [...new Set(photos.map(p => p.category))]

  const handleSave = () => {
    if (!form.description.trim()) return
    addPhotoItem(form)
    setIsModalOpen(false)
    setForm(EMPTY)
  }

  const handlePrint = () => {
    const lines = photos.map(p => `[${p.isDone ? 'X' : ' '}] ${p.category} — ${p.description}${p.isRequired ? ' *' : ''}`).join('\n')
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<pre>FOTOS OBLIGATORIAS — Naim & Sarahí\n* = obligatoria\n\n${lines}</pre>`)
    w.print()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Fotos Obligatorias" subtitle="Checklist para el fotógrafo"
        icon={<Camera className="w-5 h-5" />}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handlePrint}><Download className="w-4 h-4" /> Imprimir</Button>
            <Button size="sm" onClick={() => setIsModalOpen(true)}><Plus className="w-4 h-4" /> Agregar</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total"      value={photos.length} color="olive" />
        <StatCard label="Tomadas"    value={done}          color="green" />
        <StatCard label="Obligatorias" value={required}    color="amber" />
        <StatCard label="Oblig. listas" value={reqDone}    color="blue" />
      </div>

      <Card className="p-4">
        <div className="flex justify-between mb-2">
          <p className="text-sm font-medium text-stone-600">Progreso general</p>
          <span className="text-sm font-bold text-olive-600">{done}/{photos.length}</span>
        </div>
        <ProgressBar value={done} max={photos.length || 1} />
        <p className="text-xs text-stone-400 mt-1">Obligatorias: {reqDone}/{required}</p>
      </Card>

      {categories.length === 0 ? (
        <EmptyState icon={<Camera className="w-12 h-12" />} title="Sin fotos registradas"
          action={<Button size="sm" onClick={() => setIsModalOpen(true)}><Plus className="w-4 h-4" /> Agregar foto</Button>} />
      ) : (
        <div className="space-y-4">
          {categories.map(cat => {
            const catPhotos = photos.filter(p => p.category === cat)
            const catDone   = catPhotos.filter(p => p.isDone).length
            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wider">{cat}</h3>
                  <span className="text-xs text-stone-400">{catDone}/{catPhotos.length}</span>
                </div>
                <Card>
                  <div className="divide-y divide-stone-100">
                    {catPhotos.map(p => (
                      <div key={p.id} className={`flex items-center gap-3 px-4 py-3 ${p.isDone ? 'bg-green-50/40' : ''}`}>
                        <button
                          onClick={() => togglePhoto(p.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            p.isDone ? 'bg-green-500 border-green-500 text-white' : 'border-stone-300 hover:border-olive-400'
                          }`}
                        >
                          {p.isDone && <Check className="w-3 h-3" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${p.isDone ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                            {p.description}
                          </p>
                          {p.notes && <p className="text-xs text-stone-400">{p.notes}</p>}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {p.isRequired && <Badge variant="amber">Obligatoria</Badge>}
                          <button onClick={() => setDeleteId(p.id)} className="p-1 rounded text-stone-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nueva foto al checklist"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.description.trim()}>Agregar</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="Categoría" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="Ej: Novios, Familia, Ceremonia..." />
          <Input label="Descripción *" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Ej: Novios solos — retratos" />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isRequired} onChange={e => setForm(p => ({ ...p, isRequired: e.target.checked }))} className="w-4 h-4 rounded accent-olive-500" />
            <span className="text-sm text-stone-700">Es obligatoria</span>
          </label>
          <Textarea label="Notas" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} title="Eliminar foto" message="¿Eliminar esta foto del checklist?"
        onConfirm={() => { if (deleteId) { deletePhotoItem(deleteId); setDeleteId(null) } }}
        onCancel={() => setDeleteId(null)} confirmLabel="Eliminar" />
    </div>
  )
}
