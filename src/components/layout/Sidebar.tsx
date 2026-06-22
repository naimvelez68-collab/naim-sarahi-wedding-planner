import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, Grid3X3, DollarSign, Store, FileSearch,
  UtensilsCrossed, Wine, PiggyBank, CheckSquare, Clock, ShoppingCart,
  UserCheck, Church, Gamepad2, Music, Mic, Camera, ShieldAlert,
  BriefcaseMedical, ChevronDown, ChevronRight, X, Heart,
} from 'lucide-react'
import { cn } from '../../utils'
import { useWeddingStore } from '../../store/useWeddingStore'
import { daysUntilWedding } from '../../utils'

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  LayoutDashboard, Users, Grid3x3: Grid3X3, DollarSign, Store, FileSearch,
  UtensilsCrossed, Wine, PiggyBank, CheckSquare, Clock, ShoppingCart,
  UserCheck, Church, Gamepad2, Music, Mic, Camera, ShieldAlert, BriefcaseMedical,
}

const NAV_GROUPS = [
  {
    label: 'General',
    items: [{ path: '/', label: 'Dashboard', icon: 'LayoutDashboard' }],
  },
  {
    label: 'Invitados & Mesas',
    items: [
      { path: '/guests',  label: 'Invitados', icon: 'Users' },
      { path: '/tables',  label: 'Mesas',     icon: 'Grid3x3' },
    ],
  },
  {
    label: 'Finanzas',
    items: [
      { path: '/budget',     label: 'Presupuesto',         icon: 'DollarSign' },
      { path: '/vendors',    label: 'Proveedores',         icon: 'Store' },
      { path: '/quotes',     label: 'Cotizaciones',        icon: 'FileSearch' },
      { path: '/bocaditos',  label: 'Bocaditos',           icon: 'UtensilsCrossed' },
      { path: '/beverages',  label: 'Bebidas',             icon: 'Wine' },
      { path: '/savings',    label: 'Ahorro & Decisiones', icon: 'PiggyBank' },
    ],
  },
  {
    label: 'Planificación',
    items: [
      { path: '/checklist',    label: 'Checklist',          icon: 'CheckSquare' },
      { path: '/schedule',     label: 'Cronograma del Día', icon: 'Clock' },
      { path: '/shopping',     label: 'Lista de Compras',   icon: 'ShoppingCart' },
      { path: '/responsibles', label: 'Responsables',       icon: 'UserCheck' },
    ],
  },
  {
    label: 'El Evento',
    items: [
      { path: '/ceremony',   label: 'Ceremonia',          icon: 'Church' },
      { path: '/games',      label: 'Juegos & Dinámicas', icon: 'Gamepad2' },
      { path: '/music',      label: 'Bailes & Canciones', icon: 'Music' },
      { path: '/mc-script',  label: 'Guion del MC',       icon: 'Mic' },
      { path: '/photos',     label: 'Fotos Obligatorias', icon: 'Camera' },
    ],
  },
  {
    label: 'Contingencia',
    items: [
      { path: '/plan-b',    label: 'Plan B',             icon: 'ShieldAlert' },
      { path: '/emergency', label: 'Kit de Emergencia',  icon: 'BriefcaseMedical' },
    ],
  },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation()
  const { config } = useWeddingStore()
  const daysLeft = daysUntilWedding(config.weddingDate)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const toggleGroup = (label: string) =>
    setCollapsed(p => ({ ...p, [label]: !p[label] }))

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 z-50 h-full w-72 bg-olive-800 flex flex-col transition-transform duration-300 ease-out lg:relative lg:translate-x-0 lg:z-auto',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-olive-700">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-gold-400" fill="currentColor" />
            <div>
              <p className="text-white font-serif text-lg font-semibold leading-tight">
                {config.groomName} & {config.brideName}
              </p>
              <p className="text-olive-300 text-xs">
                {daysLeft > 0 ? `${daysLeft} días faltantes` : '¡El gran día!'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-olive-300 hover:text-white hover:bg-olive-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Countdown pill */}
        <div className="mx-4 mt-3 mb-1 bg-olive-700/60 rounded-xl px-4 py-2.5 text-center">
          <p className="text-gold-300 font-bold text-2xl font-serif">{daysLeft}</p>
          <p className="text-olive-300 text-xs">días para la boda · 8/8/2026</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
          {NAV_GROUPS.map(group => {
            const isCollapsed = collapsed[group.label]
            return (
              <div key={group.label}>
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-olive-400 text-xs font-semibold uppercase tracking-wider hover:text-olive-200 transition-colors"
                >
                  {group.label}
                  {isCollapsed
                    ? <ChevronRight className="w-3 h-3" />
                    : <ChevronDown className="w-3 h-3" />
                  }
                </button>
                {!isCollapsed && group.items.map(item => {
                  const Icon = ICON_MAP[item.icon]
                  const isActive = item.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.path)
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150',
                        isActive
                          ? 'bg-gold-400/20 text-gold-300 font-medium'
                          : 'text-olive-200 hover:bg-olive-700 hover:text-white'
                      )}
                    >
                      {Icon && <Icon className="w-4 h-4 shrink-0" />}
                      {item.label}
                    </NavLink>
                  )
                })}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-olive-700">
          <p className="text-olive-400 text-xs text-center">
            Wedding Planner Digital
          </p>
          <p className="text-olive-500 text-xs text-center mt-0.5">
            Ibarra, Ecuador · 2026
          </p>
        </div>
      </aside>
    </>
  )
}
