import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Users, Grid3X3, DollarSign, AlertTriangle, CheckSquare, Calendar, TrendingDown, Store } from 'lucide-react'
import { useWeddingStore } from '../store/useWeddingStore'
import { Card, StatCard, Badge, Alert, ProgressBar } from '../components/ui'
import { daysUntilWedding, getTotalAttendees, getTablesNeeded, getBudgetTotals, getUpcomingPayments, formatCurrency, formatShortDate, isDatePast } from '../utils'

export const Dashboard: React.FC = () => {
  const { config, guests, tables, budgetItems, vendors, tasks } = useWeddingStore()

  const daysLeft     = daysUntilWedding(config.weddingDate)
  const confirmed    = guests.filter(g => g.status === 'confirmed')
  const pending      = guests.filter(g => g.status === 'pending')
  const declined     = guests.filter(g => g.status === 'declined')
  const totalAttend  = getTotalAttendees(guests)
  const tablesNeeded = getTablesNeeded(guests, config.maxPerTable)
  const budget       = getBudgetTotals(budgetItems)
  const upcoming     = getUpcomingPayments(budgetItems, 30)
  const urgentTasks  = tasks.filter(t => t.status !== 'completed' && (t.priority === 'urgent' || isDatePast(t.dueDate)))
  const vendorsNoContract = vendors.filter(v => !v.hasContract && v.status === 'reserved')
  const vendorsNoAdvance  = vendors.filter(v => v.advance === 0 && v.status !== 'discarded')

  const budgetPct = budget.totalReal > 0 ? (budget.totalPaid / budget.totalReal) * 100 : 0
  const guestPct  = guests.length > 0 ? (confirmed.length / guests.length) * 100 : 0

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero banner */}
      <Card className="bg-gradient-to-br from-olive-700 to-olive-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-wedding-pattern opacity-30" />
        <div className="relative p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-olive-200 text-sm font-medium uppercase tracking-widest">Bienvenida al</p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
              Wedding Planner
            </h1>
            <p className="text-olive-200 mt-1 flex items-center gap-1 justify-center sm:justify-start">
              <Heart className="w-4 h-4 text-gold-400" fill="currentColor" />
              {config.groomName} & {config.brideName} — {config.city}, {config.country}
            </p>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/20">
            <p className="text-gold-300 font-bold text-5xl font-serif">{daysLeft}</p>
            <p className="text-olive-200 text-sm mt-1">días faltantes</p>
            <p className="text-white font-medium text-sm">8 · Agosto · 2026</p>
          </div>
        </div>
      </Card>

      {/* Alerts */}
      {(urgentTasks.length > 0 || vendorsNoContract.length > 0 || vendorsNoAdvance.length > 0) && (
        <div className="space-y-2">
          {urgentTasks.slice(0, 2).map(t => (
            <Alert
              key={t.id}
              variant={isDatePast(t.dueDate) ? 'error' : 'warning'}
              title={isDatePast(t.dueDate) ? 'Tarea vencida' : 'Tarea urgente'}
              message={`${t.title} — Responsable: ${t.responsible}`}
            />
          ))}
          {vendorsNoContract.map(v => (
            <Alert key={v.id} variant="warning" title="Proveedor sin contrato" message={`${v.name} (${v.service}) — Riesgo de perder la reserva`} />
          ))}
          {vendorsNoAdvance.slice(0, 1).map(v => (
            <Alert key={v.id} variant="info" title="Anticipo pendiente" message={`${v.name} aún no tiene anticipo registrado`} />
          ))}
        </div>
      )}

      {/* Stats grid */}
      <div>
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">Invitados</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Total invitados" value={guests.length}  icon={<Users className="w-5 h-5" />} color="olive" />
          <StatCard label="Confirmados"     value={confirmed.length} sub={`${totalAttend} personas totales`} icon={<CheckSquare className="w-5 h-5" />} color="green" />
          <StatCard label="Pendientes"      value={pending.length}  icon={<AlertTriangle className="w-5 h-5" />} color="amber" />
          <StatCard label="No asistirán"    value={declined.length} icon={<Users className="w-5 h-5" />} color="red" />
        </div>
        <Card className="mt-3 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-stone-600">Confirmaciones</p>
            <span className="text-sm font-bold text-olive-600">{Math.round(guestPct)}%</span>
          </div>
          <ProgressBar value={confirmed.length} max={guests.length || 1} color="olive" />
        </Card>
      </div>

      {/* Mesas */}
      <div>
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">Mesas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard label="Mesas necesarias"  value={tablesNeeded}      sub={`con ${config.maxPerTable} personas c/u`} icon={<Grid3X3 className="w-5 h-5" />} color="olive" />
          <StatCard label="Mesas creadas"     value={tables.length}     icon={<Grid3X3 className="w-5 h-5" />} color="blue" />
          <StatCard label="Asistentes totales" value={totalAttend}      sub="incluyendo acompañantes" icon={<Users className="w-5 h-5" />} color="olive" />
        </div>
        {tablesNeeded > tables.length && (
          <Alert variant="warning" className="mt-2" message={`Necesitas ${tablesNeeded - tables.length} mesa(s) más para todos los confirmados.`} />
        )}
      </div>

      {/* Presupuesto */}
      <div>
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">Presupuesto</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Total estimado"  value={formatCurrency(budget.totalEstimated)} icon={<DollarSign className="w-5 h-5" />} color="olive" />
          <StatCard label="Total real"      value={formatCurrency(budget.totalReal)}      icon={<DollarSign className="w-5 h-5" />} color="gold" />
          <StatCard label="Pagado"          value={formatCurrency(budget.totalPaid)}      icon={<DollarSign className="w-5 h-5" />} color="green" />
          <StatCard label="Pendiente"       value={formatCurrency(budget.totalPending)}   icon={<DollarSign className="w-5 h-5" />} color="amber" />
        </div>
        <Card className="mt-3 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-stone-600">Progreso de pagos</p>
            <span className="text-sm font-bold text-gold-600">{Math.round(budgetPct)}%</span>
          </div>
          <ProgressBar value={budget.totalPaid} max={budget.totalReal || 1} color="gold" />
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-stone-500">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-400 rounded-full" />
              Gastos obligatorios: <strong className="text-stone-700">{formatCurrency(budget.totalMandatory)}</strong>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-amber-400 rounded-full" />
              Reducibles: <strong className="text-stone-700">{formatCurrency(budget.totalReducible)}</strong>
            </div>
          </div>
          {totalAttend > 0 && (
            <p className="text-xs text-stone-500 mt-2">
              Costo por invitado: <strong className="text-stone-700">{formatCurrency(budget.totalReal / totalAttend)}</strong>
            </p>
          )}
        </Card>
      </div>

      {/* Próximos pagos */}
      {upcoming.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">Próximos pagos</h2>
          <Card>
            <div className="divide-y divide-stone-100">
              {upcoming.slice(0, 5).map(item => (
                <div key={item.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium text-stone-700">{item.concept}</p>
                    <p className="text-xs text-stone-400 mt-0.5">Vence: {formatShortDate(item.dueDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-stone-700">{formatCurrency(item.realAmount - item.paidAmount)}</p>
                    <Badge variant={isDatePast(item.dueDate) ? 'red' : 'amber'} className="mt-0.5">
                      {isDatePast(item.dueDate) ? 'Vencido' : 'Próximo'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            {upcoming.length > 5 && (
              <div className="p-3 text-center">
                <Link to="/budget" className="text-sm text-olive-600 hover:underline font-medium">
                  Ver todos ({upcoming.length}) →
                </Link>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Tareas urgentes */}
      {urgentTasks.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">Tareas urgentes</h2>
          <Card>
            <div className="divide-y divide-stone-100">
              {urgentTasks.slice(0, 5).map(t => (
                <div key={t.id} className="flex items-center justify-between p-4">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${isDatePast(t.dueDate) ? 'bg-red-500' : 'bg-amber-500'}`} />
                    <div>
                      <p className="text-sm font-medium text-stone-700">{t.title}</p>
                      <p className="text-xs text-stone-400">{t.responsible} · {formatShortDate(t.dueDate)}</p>
                    </div>
                  </div>
                  <Badge variant={isDatePast(t.dueDate) ? 'red' : 'amber'}>
                    {isDatePast(t.dueDate) ? 'Atrasada' : 'Urgente'}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="p-3 text-center border-t border-stone-100">
              <Link to="/checklist" className="text-sm text-olive-600 hover:underline font-medium">
                Ver checklist completo →
              </Link>
            </div>
          </Card>
        </div>
      )}

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">Acceso rápido</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { to: '/guests',   label: 'Invitados',   icon: <Users className="w-5 h-5" />,       color: 'bg-olive-50 text-olive-600 border-olive-200' },
            { to: '/tables',   label: 'Mesas',       icon: <Grid3X3 className="w-5 h-5" />,     color: 'bg-blue-50 text-blue-600 border-blue-200' },
            { to: '/budget',   label: 'Presupuesto', icon: <DollarSign className="w-5 h-5" />,  color: 'bg-gold-50 text-gold-600 border-gold-200' },
            { to: '/vendors',  label: 'Proveedores', icon: <Store className="w-5 h-5" />,       color: 'bg-purple-50 text-purple-600 border-purple-200' },
            { to: '/checklist',label: 'Checklist',   icon: <CheckSquare className="w-5 h-5" />, color: 'bg-green-50 text-green-600 border-green-200' },
            { to: '/schedule', label: 'Cronograma',  icon: <Calendar className="w-5 h-5" />,   color: 'bg-amber-50 text-amber-600 border-amber-200' },
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${link.color} hover:shadow-md transition-all duration-200 text-center font-medium text-sm`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Inteligencia */}
      <div>
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">Recomendaciones automáticas</h2>
        <div className="space-y-2">
          {totalAttend > 0 && (
            <Alert variant="info" message={`Con ${totalAttend} asistentes confirmados necesitas al menos ${tablesNeeded} mesa(s) de ${config.maxPerTable} personas.`} />
          )}
          {budget.totalReal > 0 && totalAttend > 0 && (
            <Alert variant="info" message={`El costo estimado por invitado es ${formatCurrency(budget.totalReal / totalAttend)}.`} />
          )}
          {budget.totalReducible > 500 && (
            <Alert variant="warning" message={`Tienes ${formatCurrency(budget.totalReducible)} en gastos marcados como "reducibles". Revisa la sección de Ahorro & Decisiones.`} />
          )}
          {daysLeft <= 60 && daysLeft > 0 && (
            <Alert variant="warning" message={`Faltan menos de 60 días. Verifica que todos los proveedores tengan contrato y anticipo.`} />
          )}
          {vendorsNoContract.length > 0 && (
            <Alert variant="error" message={`${vendorsNoContract.length} proveedor(es) reservados sin contrato firmado. Esto es riesgo alto.`} />
          )}
        </div>
      </div>
    </div>
  )
}
