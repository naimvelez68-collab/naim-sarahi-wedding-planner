import React, { useState } from 'react'
import { Menu, Bell } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { useWeddingStore } from '../../store/useWeddingStore'
import { isDateSoon, isDatePast } from '../../utils'

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { budgetItems, tasks, vendors } = useWeddingStore()

  const alertCount =
    budgetItems.filter(b => b.status !== 'paid' && b.dueDate && (isDateSoon(b.dueDate, 14) || isDatePast(b.dueDate))).length +
    tasks.filter(t => t.status !== 'completed' && (isDateSoon(t.dueDate, 7) || isDatePast(t.dueDate))).length +
    vendors.filter(v => v.status !== 'paid' && v.advance === 0).length

  return (
    <div className="flex h-screen bg-parchment font-sans overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-stone-500 hover:bg-stone-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 ml-auto">
            {alertCount > 0 && (
              <div className="relative">
                <Bell className="w-5 h-5 text-stone-500" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {alertCount > 9 ? '9+' : alertCount}
                </span>
              </div>
            )}
            <div className="h-8 w-px bg-stone-200 mx-1 hidden sm:block" />
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-stone-700">Naim & Sarahí</p>
              <p className="text-xs text-stone-400">Panel Administrador</p>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
