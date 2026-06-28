import React, { useState, useMemo } from 'react'
import { Users, Plus, Search, Edit2, Trash2, Filter, UserCheck, UserX, Clock, Download, RefreshCw } from 'lucide-react'
import { useWeddingStore } from '../store/useWeddingStore'
import { Guest, GuestStatus, GuestGroup, GuestDiet } from '../types'
import { PageHeader, Card, Button, Badge, Modal, Input, Select, Textarea, ConfirmDialog, EmptyState, StatCard } from '../components/ui'
import { uid, now, getTotalAttendees } from '../utils'
import { GUEST_GROUP_LABELS, GUEST_STATUS_LABELS } from '../constants/wedding'

const EMPTY: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '', group: 'friends', status: 'pending', hasCompanion: false, companionCount: 0,
  companionName: '', tableId: null, dietaryRestriction: 'none', dietaryNote: '',
  isElderly: false, isChild: false, hasReducedMobility: false, phone: '', email: '', notes: '',
}

const STATUS_BADGE: Record<GuestStatus, { variant: 'olive' | 'amber' | 'red'; label: string }> = {
  confirmed: { variant: 'olive', label: 'Confirmado' },
  pending:   { variant: 'amber', label: 'Pendiente' },
  declined:  { variant: 'red',   label: 'No asiste' },
}

export const Guests: React.FC = () => {
  const { guests, tables, addGuest, updateGuest, deleteGuest } = useWeddingStore()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<GuestStatus | 'all'>('all')
  const [filterGroup, setFilterGroup]   = useState<GuestGroup | 'all'>('all')
  const [isModalOpen, setIsModalOpen]   = useState(false)
  const [editGuest, setEditGuest]       = useState<Guest | null>(null)
  const [deleteId, setDeleteId]         = useState<string | null>(null)
  const [form, setForm]                 = useState(EMPTY)
  const [syncState, setSyncState]       = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')

  const filtered = useMemo(() => guests.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.phone.includes(search) || g.notes.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || g.status === filterStatus
    const matchGroup  = filterGroup === 'all' || g.group === filterGroup
    return matchSearch && matchStatus && matchGroup
  }), [guests, search, filterStatus, filterGroup])

  const confirmed = guests.filter(g => g.status === 'confirmed')
  const pending   = guests.filter(g => g.status === 'pending')
  const declined  = guests.filter(g => g.status === 'declined')
  const totalAttend = getTotalAttendees(guests)

  const openAdd = () => { setForm(EMPTY); setEditGuest(null); setIsModalOpen(true) }
  const openEdit = (g: Guest) => { setForm({ ...g }); setEditGuest(g); setIsModalOpen(true) }
  const handleClose = () => { setIsModalOpen(false); setEditGuest(null); setForm(EMPTY) }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editGuest) {
      updateGuest(editGuest.id, form)
    } else {
      addGuest(form)
    }
    handleClose()
  }

  const handleDelete = () => {
    if (deleteId) { deleteGuest(deleteId); setDeleteId(null) }
  }

  const handleSync = async () => {
    setSyncState('loading')
    try {
      const res = await fetch('/api/sync-rsvp', { method: 'POST' })
      const data = await res.json()
      setSyncState(data.ok ? 'ok' : 'error')
    } catch {
      setSyncState('error')
    }
    setTimeout(() => setSyncState('idle'), 4000)
  }

  const handlePrint = () => {
    const rows = guests.map(g =>
      `${g.name}\t${GUEST_GROUP_LABELS[g.group]}\t${GUEST_STATUS_LABELS[g.status]}\t${g.hasCompanion ? `Sí (${g.companionCount})` : 'No'}\t${g.tableId ? tables.find(t => t.id === g.tableId)?.name || '—' : '—'}\t${g.dietaryRestriction !== 'none' ? g.dietaryRestriction : '—'}`
    ).join('\n')
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<pre>LISTA DE INVITADOS — Naim & Sarahí\n\nNOMBRE\tGRUPO\tESTADO\tACOMPAÑANTE\tMESA\tDIETA\n${rows}</pre>`)
    w.print()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Invitados"
        subtitle={`${guests.length} invitados registrados · ${totalAttend} asistentes totales`}
        icon={<Users className="w-5 h-5" />}
        action={
          <div className="flex gap-2">
            <Button
              variant="secondary" size="sm"
              onClick={handleSync}
              disabled={syncState === 'loading'}
              title="Sincronizar con velezguevara-boda.vercel.app"
            >
              <RefreshCw className={`w-4 h-4 ${syncState === 'loading' ? 'animate-spin' : ''}`} />
              {syncState === 'loading' ? 'Sincronizando…' : syncState === 'ok' ? '¡Sincronizado!' : syncState === 'error' ? 'Error' : 'Sincronizar RSVP'}
            </Button>
            <Button variant="secondary" size="sm" onClick={handlePrint}>
              <Download className="w-4 h-4" /> Imprimir
            </Button>
            <Button size="sm" onClick={openAdd}>
              <Plus className="w-4 h-4" /> Agregar
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total"        value={guests.length}      icon={<Users className="w-5 h-5" />}      color="olive" />
        <StatCard label="Confirmados"  value={confirmed.length}   icon={<UserCheck className="w-5 h-5" />}  color="green" />
        <StatCard label="Pendientes"   value={pending.length}     icon={<Clock className="w-5 h-5" />}      color="amber" />
        <StatCard label="No asistirán" value={declined.length}    icon={<UserX className="w-5 h-5" />}      color="red" />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre, teléfono..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-400"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as GuestStatus | 'all')}
            className="px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-400"
          >
            <option value="all">Todos los estados</option>
            <option value="confirmed">Confirmados</option>
            <option value="pending">Pendientes</option>
            <option value="declined">No asisten</option>
          </select>
          <select
            value={filterGroup}
            onChange={e => setFilterGroup(e.target.value as GuestGroup | 'all')}
            className="px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-400"
          >
            <option value="all">Todos los grupos</option>
            {Object.entries(GUEST_GROUP_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="w-12 h-12" />}
          title="Sin invitados"
          description="Agrega el primer invitado usando el botón de arriba."
          action={<Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Agregar invitado</Button>}
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-left">
                  <th className="px-4 py-3 font-semibold text-stone-600">Nombre</th>
                  <th className="px-4 py-3 font-semibold text-stone-600 hidden sm:table-cell">Grupo</th>
                  <th className="px-4 py-3 font-semibold text-stone-600">Estado</th>
                  <th className="px-4 py-3 font-semibold text-stone-600 hidden md:table-cell">Acompañante</th>
                  <th className="px-4 py-3 font-semibold text-stone-600 hidden lg:table-cell">Mesa</th>
                  <th className="px-4 py-3 font-semibold text-stone-600 hidden lg:table-cell">Especial</th>
                  <th className="px-4 py-3 font-semibold text-stone-600 text-right">Acc.</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(g => {
                  const table = tables.find(t => t.id === g.tableId)
                  const status = STATUS_BADGE[g.status]
                  return (
                    <tr key={g.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-stone-800">{g.name}</p>
                          {g.phone && <p className="text-xs text-stone-400">{g.phone}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <Badge variant="gray">{GUEST_GROUP_LABELS[g.group]}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {g.hasCompanion ? (
                          <span className="text-stone-600">{g.companionName || `+${g.companionCount}`}</span>
                        ) : (
                          <span className="text-stone-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {table ? <Badge variant="blue">{table.name}</Badge> : <span className="text-stone-300">Sin asignar</span>}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex gap-1">
                          {g.isElderly && <Badge variant="gray">Adulto mayor</Badge>}
                          {g.isChild && <Badge variant="gray">Niño</Badge>}
                          {g.hasReducedMobility && <Badge variant="amber">Movilidad</Badge>}
                          {g.dietaryRestriction !== 'none' && <Badge variant="purple">{g.dietaryRestriction}</Badge>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(g)} className="p-1.5 rounded-lg text-stone-400 hover:text-olive-600 hover:bg-olive-50 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteId(g.id)} className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 border-t border-stone-100 bg-stone-50 rounded-b-xl">
            <p className="text-xs text-stone-500">Mostrando {filtered.length} de {guests.length} invitados</p>
          </div>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={editGuest ? `Editar: ${editGuest.name}` : 'Agregar Invitado'}
        maxWidth="max-w-2xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.name.trim()}>
              {editGuest ? 'Guardar cambios' : 'Agregar invitado'}
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input label="Nombre completo *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Ej: María García" />
          </div>
          <Select
            label="Grupo"
            value={form.group}
            onChange={e => setForm(p => ({ ...p, group: e.target.value as GuestGroup }))}
            options={Object.entries(GUEST_GROUP_LABELS).map(([v, l]) => ({ value: v, label: l }))}
          />
          <Select
            label="Estado"
            value={form.status}
            onChange={e => setForm(p => ({ ...p, status: e.target.value as GuestStatus }))}
            options={Object.entries(GUEST_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }))}
          />
          <Input label="Teléfono" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="09XXXXXXXX" />
          <Input label="Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="correo@gmail.com" type="email" />

          {/* Mesa */}
          <div>
            <label className="text-sm font-medium text-stone-700 block mb-1">Mesa asignada</label>
            <select
              value={form.tableId || ''}
              onChange={e => setForm(p => ({ ...p, tableId: e.target.value || null }))}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-400"
            >
              <option value="">Sin asignar</option>
              {tables.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <Select
            label="Restricción alimentaria"
            value={form.dietaryRestriction}
            onChange={e => setForm(p => ({ ...p, dietaryRestriction: e.target.value as GuestDiet }))}
            options={[
              { value: 'none', label: 'Ninguna' },
              { value: 'vegetarian', label: 'Vegetariano' },
              { value: 'vegan', label: 'Vegano' },
              { value: 'gluten_free', label: 'Sin gluten' },
              { value: 'other', label: 'Otra' },
            ]}
          />

          {/* Acompañante */}
          <div className="sm:col-span-2">
            <div className="p-3 bg-stone-50 rounded-xl space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.hasCompanion}
                  onChange={e => setForm(p => ({ ...p, hasCompanion: e.target.checked, companionCount: e.target.checked ? 1 : 0 }))}
                  className="w-4 h-4 rounded accent-olive-500"
                />
                <span className="text-sm font-medium text-stone-700">Viene con acompañante(s)</span>
              </label>
              {form.hasCompanion && (
                <div className="grid grid-cols-2 gap-3 pl-6">
                  <Input
                    label="Nº de acompañantes"
                    type="number"
                    min={1}
                    max={5}
                    value={form.companionCount}
                    onChange={e => setForm(p => ({ ...p, companionCount: Number(e.target.value) }))}
                  />
                  <Input
                    label="Nombre del acompañante"
                    value={form.companionName}
                    onChange={e => setForm(p => ({ ...p, companionName: e.target.value }))}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Flags */}
          <div className="sm:col-span-2">
            <div className="flex flex-wrap gap-4">
              {[
                { key: 'isElderly', label: 'Adulto mayor' },
                { key: 'isChild', label: 'Niño/menor' },
                { key: 'hasReducedMobility', label: 'Movilidad reducida' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form[key as keyof typeof form] as boolean}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.checked }))}
                    className="w-4 h-4 rounded accent-olive-500"
                  />
                  <span className="text-sm text-stone-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <Textarea label="Notas" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Notas adicionales sobre este invitado..." />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Eliminar invitado"
        message="¿Estás seguro? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        confirmLabel="Eliminar"
      />
    </div>
  )
}
