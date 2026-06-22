import React, { useState, useMemo } from 'react'
import { CheckSquare, Plus, Edit2, Trash2, Download, Check } from 'lucide-react'
import { useWeddingStore } from '../store/useWeddingStore'
import { Task, TaskStatus, TaskPriority } from '../types'
import { PageHeader, Card, Button, Badge, Modal, Input, Select, Textarea, ConfirmDialog, EmptyState, Alert, StatCard, ProgressBar } from '../components/ui'
import { formatShortDate, isDatePast, isDateSoon, daysUntilWedding } from '../utils'
import { TASK_PRIORITY_LABELS } from '../constants/wedding'

const EMPTY: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '', description: '', dueDate: '', suggestedDate: '', responsible: '',
  priority: 'medium', status: 'pending', category: 'General', monthsBefore: 0, notes: '',
}

const STATUS_BADGE: Record<TaskStatus, { variant: 'olive' | 'blue' | 'green' | 'red'; label: string }> = {
  pending:     { variant: 'blue',  label: 'Pendiente' },
  in_progress: { variant: 'olive', label: 'En proceso' },
  completed:   { variant: 'green', label: 'Completada' },
  overdue:     { variant: 'red',   label: 'Vencida' },
}
const PRIORITY_BADGE: Record<TaskPriority, { variant: 'red' | 'amber' | 'blue' | 'gray'; label: string }> = {
  urgent: { variant: 'red',   label: 'Urgente' },
  high:   { variant: 'amber', label: 'Alta' },
  medium: { variant: 'blue',  label: 'Media' },
  low:    { variant: 'gray',  label: 'Baja' },
}

export const Checklist: React.FC = () => {
  const { config, tasks, addTask, updateTask, deleteTask, completeTask } = useWeddingStore()
  const [isModalOpen, setIsModalOpen]   = useState(false)
  const [editTask, setEditTask]         = useState<Task | null>(null)
  const [deleteId, setDeleteId]         = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all')
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all')
  const [form, setForm]                 = useState(EMPTY)

  const daysLeft = daysUntilWedding(config.weddingDate)

  const enrichedTasks = useMemo(() => tasks.map(t => {
    let computed = t.status
    if (t.status !== 'completed' && t.dueDate && isDatePast(t.dueDate)) computed = 'overdue'
    return { ...t, computedStatus: computed as TaskStatus }
  }), [tasks])

  const filtered = useMemo(() => enrichedTasks.filter(t =>
    (filterStatus === 'all' || t.computedStatus === filterStatus) &&
    (filterPriority === 'all' || t.priority === filterPriority)
  ), [enrichedTasks, filterStatus, filterPriority])

  const completed = enrichedTasks.filter(t => t.computedStatus === 'completed').length
  const overdue   = enrichedTasks.filter(t => t.computedStatus === 'overdue').length
  const urgent    = enrichedTasks.filter(t => t.priority === 'urgent' && t.computedStatus !== 'completed').length
  const pct = tasks.length > 0 ? (completed / tasks.length) * 100 : 0

  const openAdd  = () => { setForm(EMPTY); setEditTask(null); setIsModalOpen(true) }
  const openEdit = (t: Task) => { setForm({ ...t }); setEditTask(t); setIsModalOpen(true) }
  const handleClose = () => { setIsModalOpen(false); setEditTask(null); setForm(EMPTY) }
  const handleSave = () => {
    if (!form.title.trim()) return
    if (editTask) updateTask(editTask.id, form)
    else addTask(form)
    handleClose()
  }

  const handlePrint = () => {
    const lines = tasks.map(t =>
      `[${t.status === 'completed' ? 'X' : ' '}] ${t.title} — ${t.responsible} — ${formatShortDate(t.dueDate)}`
    ).join('\n')
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<pre>CHECKLIST — Naim & Sarahí\n\n${lines}</pre>`)
    w.print()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Checklist Inteligente" subtitle={`${tasks.length} tareas · ${completed} completadas`}
        icon={<CheckSquare className="w-5 h-5" />}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handlePrint}><Download className="w-4 h-4" /> Imprimir</Button>
            <Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Nueva tarea</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total"       value={tasks.length}  color="olive" />
        <StatCard label="Completadas" value={completed}      color="green" />
        <StatCard label="Atrasadas"   value={overdue}        color="red" />
        <StatCard label="Urgentes"    value={urgent}         color="amber" />
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-stone-600">Progreso general</p>
          <span className="text-sm font-bold text-olive-600">{Math.round(pct)}%</span>
        </div>
        <ProgressBar value={completed} max={tasks.length || 1} color="olive" />
        <p className="text-xs text-stone-400 mt-2">Faltan {daysLeft} días para la boda</p>
      </Card>

      {overdue > 0 && <Alert variant="error" title={`${overdue} tarea(s) atrasada(s)`} message="Revisa las tareas vencidas y actualiza su estado lo antes posible." />}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as TaskStatus | 'all')}
          className="px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-400">
          <option value="all">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="in_progress">En proceso</option>
          <option value="completed">Completadas</option>
          <option value="overdue">Atrasadas</option>
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value as TaskPriority | 'all')}
          className="px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-400">
          <option value="all">Todas las prioridades</option>
          {Object.entries(TASK_PRIORITY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<CheckSquare className="w-12 h-12" />} title="Sin tareas"
          action={<Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Nueva tarea</Button>} />
      ) : (
        <Card>
          <div className="divide-y divide-stone-100">
            {filtered.map(t => {
              const st = STATUS_BADGE[t.computedStatus]
              const pr = PRIORITY_BADGE[t.priority]
              const soon = t.dueDate && isDateSoon(t.dueDate, 7) && t.computedStatus !== 'completed'
              return (
                <div key={t.id} className={`flex items-start gap-3 p-4 ${t.computedStatus === 'completed' ? 'opacity-60' : ''}`}>
                  <button
                    onClick={() => t.computedStatus !== 'completed' ? completeTask(t.id) : updateTask(t.id, { status: 'pending', completedAt: undefined })}
                    className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      t.computedStatus === 'completed' ? 'bg-green-500 border-green-500 text-white' : 'border-stone-300 hover:border-olive-400'
                    }`}
                  >
                    {t.computedStatus === 'completed' && <Check className="w-3 h-3" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={`font-medium text-stone-800 ${t.computedStatus === 'completed' ? 'line-through' : ''}`}>{t.title}</p>
                      <Badge variant={st.variant}>{st.label}</Badge>
                      <Badge variant={pr.variant}>{pr.label}</Badge>
                      {soon && !isDatePast(t.dueDate) && <Badge variant="amber">⚡ Esta semana</Badge>}
                    </div>
                    {t.description && <p className="text-sm text-stone-500 mt-0.5">{t.description}</p>}
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-stone-400">
                      {t.responsible && <span>👤 {t.responsible}</span>}
                      {t.dueDate && <span className={isDatePast(t.dueDate) && t.computedStatus !== 'completed' ? 'text-red-500 font-medium' : ''}>📅 {formatShortDate(t.dueDate)}</span>}
                      {t.category && <span>🏷️ {t.category}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg text-stone-400 hover:text-olive-600 hover:bg-olive-50 transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(t.id)} className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      <Modal isOpen={isModalOpen} onClose={handleClose} title={editTask ? 'Editar tarea' : 'Nueva tarea'} maxWidth="max-w-2xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.title.trim()}>{editTask ? 'Guardar' : 'Agregar'}</Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input label="Título *" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          </div>
          <Input label="Responsable" value={form.responsible} onChange={e => setForm(p => ({ ...p, responsible: e.target.value }))} />
          <Input label="Categoría" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} />
          <Select label="Prioridad" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value as TaskPriority }))}
            options={Object.entries(TASK_PRIORITY_LABELS).map(([v, l]) => ({ value: v, label: l }))} />
          <Select label="Estado" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as TaskStatus }))}
            options={[
              { value: 'pending', label: 'Pendiente' }, { value: 'in_progress', label: 'En proceso' },
              { value: 'completed', label: 'Completada' },
            ]} />
          <Input label="Fecha límite" type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
          <Input label="Fecha sugerida" type="date" value={form.suggestedDate} onChange={e => setForm(p => ({ ...p, suggestedDate: e.target.value }))} />
          <div className="sm:col-span-2">
            <Textarea label="Descripción" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <Textarea label="Notas" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} title="Eliminar tarea" message="¿Eliminar esta tarea?"
        onConfirm={() => { if (deleteId) { deleteTask(deleteId); setDeleteId(null) } }}
        onCancel={() => setDeleteId(null)} confirmLabel="Eliminar" />
    </div>
  )
}
