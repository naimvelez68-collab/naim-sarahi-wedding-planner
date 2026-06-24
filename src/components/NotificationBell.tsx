import React, { useState, useRef, useEffect } from 'react'
import { Bell, X, Clock, User } from 'lucide-react'
import { useWeddingStore } from '../store/useWeddingStore'
import { ChangeEntry } from '../types'

const MODULE_COLORS: Record<string, string> = {
  'Invitados':     'bg-blue-100 text-blue-700',
  'Presupuesto':   'bg-gold-100 text-gold-700',
  'Checklist':     'bg-green-100 text-green-700',
  'Proveedores':   'bg-purple-100 text-purple-700',
  'Configuración': 'bg-stone-100 text-stone-700',
  'Mesas':         'bg-amber-100 text-amber-700',
  'Cronograma':    'bg-cyan-100 text-cyan-700',
  'Compras':       'bg-orange-100 text-orange-700',
}

function formatTime(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffH   = Math.floor(diffMs / 3600000)
  const diffD   = Math.floor(diffMs / 86400000)
  if (diffMin < 1)  return 'hace un momento'
  if (diffMin < 60) return `hace ${diffMin} min`
  if (diffH < 24)   return `hace ${diffH}h`
  if (diffD === 1)   return 'ayer'
  return d.toLocaleDateString('es', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const { changelog, lastReadAt, markAllRead } = useWeddingStore()

  const unread = changelog.filter(e => e.timestamp > lastReadAt).length

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleOpen = () => {
    setOpen(o => !o)
    if (!open && unread > 0) markAllRead()
  }

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
        title="Registro de cambios"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold animate-pulse">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 z-50 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 bg-stone-50">
            <div>
              <p className="text-sm font-semibold text-stone-700">Registro de cambios</p>
              <p className="text-xs text-stone-400">{changelog.length} cambios registrados</p>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-stone-200 text-stone-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Entries */}
          <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
            {changelog.length === 0 ? (
              <div className="py-10 text-center text-stone-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Sin cambios registrados</p>
                <p className="text-xs mt-1">Los cambios aparecerán aquí</p>
              </div>
            ) : (
              changelog.map((entry: ChangeEntry, i) => {
                const isNew = entry.timestamp > lastReadAt
                const colorClass = MODULE_COLORS[entry.module] ?? 'bg-stone-100 text-stone-600'
                return (
                  <div key={entry.id ?? i}
                       className={`px-4 py-3 border-b border-stone-50 hover:bg-stone-50 transition-colors ${isNew ? 'bg-gold-50/40' : ''}`}>
                    <div className="flex items-start gap-2">
                      {isNew && <span className="w-2 h-2 rounded-full bg-gold-400 mt-1.5 shrink-0" />}
                      {!isNew && <span className="w-2 h-2 rounded-full bg-transparent mt-1.5 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${colorClass}`}>
                            {entry.module}
                          </span>
                          <span className="text-xs font-medium text-stone-700">{entry.action}</span>
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5 truncate">{entry.detail}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1 text-[10px] text-stone-400">
                            <User className="w-2.5 h-2.5" />
                            <span className="font-medium">{entry.user}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-stone-400">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{formatTime(entry.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {changelog.length > 0 && (
            <div className="px-4 py-2 text-center border-t border-stone-100">
              <p className="text-[10px] text-stone-400">Últimos 100 cambios · sincronizado en tiempo real</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
