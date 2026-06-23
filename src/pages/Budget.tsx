import React, { useState, useMemo } from 'react'
import { DollarSign, Plus, Edit2, Trash2, Download } from 'lucide-react'
import { useWeddingStore } from '../store/useWeddingStore'
import { BudgetItem, BudgetCategory, BudgetStatus, BudgetPriority } from '../types'
import { PageHeader, Card, Button, Badge, Modal, Input, Select, Textarea, ConfirmDialog, EmptyState, StatCard, ProgressBar, Alert } from '../components/ui'
import { getBudgetTotals, getUpcomingPayments, formatCurrency, formatShortDate, isDatePast, getTotalAttendees } from '../utils'
import { BUDGET_CATEGORY_LABELS, BUDGET_PRIORITY_LABELS } from '../constants/wedding'

const EMPTY: Omit<BudgetItem, 'id' | 'createdAt' | 'updatedAt'> = {
  concept: '', category: 'other', estimatedAmount: 0, realAmount: 0, paidAmount: 0,
  status: 'pending', priority: 'important', dueDate: '', vendorId: null, notes: '', receipt: '',
}

const PRIORITY_BADGE: Record<BudgetPriority, { variant: 'red' | 'amber' | 'blue' | 'gray'; label: string }> = {
  mandatory:  { variant: 'red',   label: 'Obligatorio' },
  important:  { variant: 'amber', label: 'Importante' },
  optional:   { variant: 'blue',  label: 'Opcional' },
  reducible:  { variant: 'gray',  label: 'Reducible' },
}
const STATUS_BADGE: Record<BudgetStatus, { variant: 'olive' | 'amber' | 'gray'; label: string }> = {
  paid:    { variant: 'olive', label: 'Pagado' },
  partial: { variant: 'amber', label: 'Parcial' },
  pending: { variant: 'gray',  label: 'Pendiente' },
}

export const Budget: React.FC = () => {
  const { budgetItems, guests, config, updateConfig, addBudgetItem, updateBudgetItem, deleteBudgetItem } = useWeddingStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editItem, setEditItem]       = useState<BudgetItem | null>(null)
  const [deleteId, setDeleteId]       = useState<string | null>(null)
  const [editingTotal, setEditingTotal] = useState(false)
  const [totalDraft, setTotalDraft]     = useState('')
  const [form, setForm]               = useState(EMPTY)
  const [filterPriority, setFilterPriority] = useState<BudgetPriority | 'all'>('all')
  const [filterStatus, setFilterStatus]     = useState<BudgetStatus | 'all'>('all')

  const filtered = useMemo(() => budgetItems.filter(b =>
    (filterPriority === 'all' || b.priority === filterPriority) &&
    (filterStatus === 'all' || b.status === filterStatus)
  ), [budgetItems, filterPriority, filterStatus])

  const totals   = getBudgetTotals(budgetItems)
  const upcoming = getUpcomingPayments(budgetItems, 21)
  const totalAttend = getTotalAttendees(guests)
  const budgetPct = totals.totalReal > 0 ? (totals.totalPaid / totals.totalReal) * 100 : 0

  const openAdd  = () => { setForm(EMPTY); setEditItem(null); setIsModalOpen(true) }
  const openEdit = (b: BudgetItem) => { setForm({ ...b }); setEditItem(b); setIsModalOpen(true) }
  const handleClose = () => { setIsModalOpen(false); setEditItem(null); setForm(EMPTY) }

  const handleSave = () => {
    if (!form.concept.trim()) return
    const status: BudgetStatus = form.paidAmount >= form.realAmount && form.realAmount > 0
      ? 'paid'
      : form.paidAmount > 0 ? 'partial' : 'pending'
    const data = { ...form, status }
    if (editItem) updateBudgetItem(editItem.id, data)
    else addBudgetItem(data)
    handleClose()
  }

  const handlePrint = () => {
    const rows = budgetItems.map(b =>
      `${b.concept}\t${BUDGET_CATEGORY_LABELS[b.category]}\t${formatCurrency(b.estimatedAmount)}\t${formatCurrency(b.realAmount)}\t${formatCurrency(b.paidAmount)}\t${b.status}\t${formatShortDate(b.dueDate)}`
    ).join('\n')
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<pre>PRESUPUESTO — Naim & Sarahí\n\nCONCEPTO\tCATEGORÍA\tESTIMADO\tREAL\tPAGADO\tESTADO\tFECHA LÍMITE\n${rows}\n\nTOTAL ESTIMADO: ${formatCurrency(totals.totalEstimated)}\nTOTAL REAL: ${formatCurrency(totals.totalReal)}\nTOTAL PAGADO: ${formatCurrency(totals.totalPaid)}\nPENDIENTE: ${formatCurrency(totals.totalPending)}</pre>`)
    w.print()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Presupuesto"
        subtitle={`${budgetItems.length} rubros registrados`}
        icon={<DollarSign className="w-5 h-5" />}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handlePrint}><Download className="w-4 h-4" /> Imprimir</Button>
            <Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Agregar</Button>
          </div>
        }
      />

      {/* Presupuesto total editable */}
      <Card className="p-4 border-2 border-gold-200 bg-gold-50">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Presupuesto total aprobado</p>
            {editingTotal ? (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-stone-500 font-medium">$</span>
                <input
                  type="number"
                  value={totalDraft}
                  onChange={e => setTotalDraft(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const v = parseFloat(totalDraft)
                      if (!isNaN(v) && v > 0) updateConfig({ budgetTotal: v })
                      setEditingTotal(false)
                    }
                    if (e.key === 'Escape') setEditingTotal(false)
                  }}
                  className="w-36 text-2xl font-bold text-gold-700 border-b-2 border-gold-400 bg-transparent outline-none"
                  autoFocus
                />
                <button
                  onClick={() => {
                    const v = parseFloat(totalDraft)
                    if (!isNaN(v) && v > 0) updateConfig({ budgetTotal: v })
                    setEditingTotal(false)
                  }}
                  className="text-xs bg-olive-600 text-white px-3 py-1 rounded-lg hover:bg-olive-700"
                >Guardar</button>
                <button onClick={() => setEditingTotal(false)} className="text-xs text-stone-400 hover:text-stone-600">Cancelar</button>
              </div>
            ) : (
              <button
                onClick={() => { setTotalDraft(String(config.budgetTotal)); setEditingTotal(true) }}
                className="flex items-center gap-2 mt-1 group"
                title="Clic para editar el presupuesto total"
              >
                <span className="text-2xl font-bold text-gold-700 font-serif">{formatCurrency(config.budgetTotal)}</span>
                <Edit2 className="w-4 h-4 text-stone-400 group-hover:text-gold-600 transition-colors" />
              </button>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-stone-500">Total real vs presupuesto</p>
            <p className={`text-xl font-bold font-serif ${totals.totalReal > config.budgetTotal ? 'text-red-600' : 'text-olive-600'}`}>
              {formatCurrency(totals.totalReal)} / {formatCurrency(config.budgetTotal)}
            </p>
            <p className={`text-sm font-medium mt-0.5 ${totals.totalReal > config.budgetTotal ? 'text-red-500' : 'text-olive-500'}`}>
              {totals.totalReal > config.budgetTotal
                ? `⚠️ $${(totals.totalReal - config.budgetTotal).toFixed(0)} sobre el presupuesto`
                : `✓ $${(config.budgetTotal - totals.totalReal).toFixed(0)} disponibles`
              }
            </p>
          </div>
        </div>
        <div className="mt-3">
          <ProgressBar value={totals.totalReal} max={config.budgetTotal} color={totals.totalReal > config.budgetTotal ? 'red' : 'gold'} />
        </div>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total estimado"  value={formatCurrency(totals.totalEstimated)} icon={<DollarSign className="w-5 h-5" />} color="olive" />
        <StatCard label="Total real"      value={formatCurrency(totals.totalReal)}      icon={<DollarSign className="w-5 h-5" />} color="gold" />
        <StatCard label="Pagado"          value={formatCurrency(totals.totalPaid)}      icon={<DollarSign className="w-5 h-5" />} color="green" />
        <StatCard label="Pendiente"       value={formatCurrency(totals.totalPending)}   icon={<DollarSign className="w-5 h-5" />} color="amber" />
      </div>

      {/* Progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-stone-600">Progreso de pagos</p>
          <span className="text-sm font-bold text-gold-600">{Math.round(budgetPct)}%</span>
        </div>
        <ProgressBar value={totals.totalPaid} max={totals.totalReal || 1} color="gold" />
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div><p className="text-xs text-stone-400">Obligatorios</p><p className="font-semibold text-red-600">{formatCurrency(totals.totalMandatory)}</p></div>
          <div><p className="text-xs text-stone-400">Reducibles</p><p className="font-semibold text-amber-600">{formatCurrency(totals.totalReducible)}</p></div>
          {totalAttend > 0 && (
            <div><p className="text-xs text-stone-400">Por invitado</p><p className="font-semibold text-olive-600">{formatCurrency(totals.totalReal / totalAttend)}</p></div>
          )}
          {totalAttend > 0 && (
            <div><p className="text-xs text-stone-400">Por mesa (10p)</p><p className="font-semibold text-blue-600">{formatCurrency((totals.totalReal / totalAttend) * 10)}</p></div>
          )}
        </div>
      </Card>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <Alert variant="warning" title={`${upcoming.length} pago(s) próximo(s) en 21 días`}
          message={upcoming.slice(0, 3).map(b => `${b.concept}: ${formatCurrency(b.realAmount - b.paidAmount)} (${formatShortDate(b.dueDate)})`).join(' · ')}
        />
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value as BudgetPriority | 'all')}
          className="px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-400">
          <option value="all">Todas las prioridades</option>
          {Object.entries(BUDGET_PRIORITY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as BudgetStatus | 'all')}
          className="px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-400">
          <option value="all">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="partial">Parcial</option>
          <option value="paid">Pagado</option>
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<DollarSign className="w-12 h-12" />}
          title="Sin rubros de presupuesto"
          action={<Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Agregar rubro</Button>}
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-left">
                  <th className="px-4 py-3 font-semibold text-stone-600">Concepto</th>
                  <th className="px-4 py-3 font-semibold text-stone-600 hidden sm:table-cell">Categoría</th>
                  <th className="px-4 py-3 font-semibold text-stone-600">Estimado</th>
                  <th className="px-4 py-3 font-semibold text-stone-600">Real</th>
                  <th className="px-4 py-3 font-semibold text-stone-600 hidden md:table-cell">Pagado</th>
                  <th className="px-4 py-3 font-semibold text-stone-600">Estado</th>
                  <th className="px-4 py-3 font-semibold text-stone-600 hidden md:table-cell">Prioridad</th>
                  <th className="px-4 py-3 font-semibold text-stone-600 hidden lg:table-cell">Vence</th>
                  <th className="px-4 py-3 text-right font-semibold text-stone-600">Acc.</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => {
                  const priority = PRIORITY_BADGE[b.priority]
                  const status   = STATUS_BADGE[b.status]
                  const overdue  = b.status !== 'paid' && b.dueDate && isDatePast(b.dueDate)
                  return (
                    <tr key={b.id} className={`border-b border-stone-100 hover:bg-stone-50 transition-colors ${overdue ? 'bg-red-50/50' : ''}`}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-stone-800">{b.concept}</p>
                        {b.notes && <p className="text-xs text-stone-400">{b.notes}</p>}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs text-stone-500">{BUDGET_CATEGORY_LABELS[b.category]}</span>
                      </td>
                      <td className="px-4 py-3 text-stone-600">{formatCurrency(b.estimatedAmount)}</td>
                      <td className="px-4 py-3 font-medium text-stone-800">{formatCurrency(b.realAmount)}</td>
                      <td className="px-4 py-3 hidden md:table-cell text-green-600">{formatCurrency(b.paidAmount)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <Badge variant={priority.variant}>{priority.label}</Badge>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {b.dueDate ? (
                          <span className={`text-xs ${overdue ? 'text-red-600 font-medium' : 'text-stone-500'}`}>
                            {formatShortDate(b.dueDate)}{overdue ? ' ⚠️' : ''}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg text-stone-400 hover:text-olive-600 hover:bg-olive-50 transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => setDeleteId(b.id)} className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-stone-300 bg-stone-50">
                  <td className="px-4 py-3 font-bold text-stone-800">TOTAL</td>
                  <td className="hidden sm:table-cell" />
                  <td className="px-4 py-3 font-bold text-stone-600">{formatCurrency(filtered.reduce((s, b) => s + b.estimatedAmount, 0))}</td>
                  <td className="px-4 py-3 font-bold text-stone-800">{formatCurrency(filtered.reduce((s, b) => s + b.realAmount, 0))}</td>
                  <td className="px-4 py-3 font-bold text-green-600 hidden md:table-cell">{formatCurrency(filtered.reduce((s, b) => s + b.paidAmount, 0))}</td>
                  <td /><td className="hidden md:table-cell" /><td className="hidden lg:table-cell" /><td />
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={editItem ? 'Editar rubro' : 'Agregar rubro'}
        maxWidth="max-w-2xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.concept.trim()}>
              {editItem ? 'Guardar' : 'Agregar'}
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input label="Concepto *" value={form.concept} onChange={e => setForm(p => ({ ...p, concept: e.target.value }))} placeholder="Ej: Catering completo" />
          </div>
          <Select label="Categoría" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as BudgetCategory }))}
            options={Object.entries(BUDGET_CATEGORY_LABELS).map(([v, l]) => ({ value: v, label: l }))} />
          <Select label="Prioridad" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value as BudgetPriority }))}
            options={Object.entries(BUDGET_PRIORITY_LABELS).map(([v, l]) => ({ value: v, label: l }))} />
          <Input label="Monto estimado ($)" type="number" min={0} step={0.01} value={form.estimatedAmount} onChange={e => setForm(p => ({ ...p, estimatedAmount: Number(e.target.value) }))} />
          <Input label="Monto real ($)" type="number" min={0} step={0.01} value={form.realAmount} onChange={e => setForm(p => ({ ...p, realAmount: Number(e.target.value) }))} />
          <Input label="Monto pagado ($)" type="number" min={0} step={0.01} value={form.paidAmount} onChange={e => setForm(p => ({ ...p, paidAmount: Number(e.target.value) }))} />
          <Input label="Fecha límite de pago" type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
          <div className="sm:col-span-2">
            <Textarea label="Notas / Comprobante" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Eliminar rubro"
        message="¿Eliminar este rubro del presupuesto?"
        onConfirm={() => { if (deleteId) { deleteBudgetItem(deleteId); setDeleteId(null) } }}
        onCancel={() => setDeleteId(null)}
        confirmLabel="Eliminar"
      />
    </div>
  )
}
