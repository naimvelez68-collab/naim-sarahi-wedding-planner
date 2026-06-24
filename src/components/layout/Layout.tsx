import React, { useState } from 'react'
import { Menu, User } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { NotificationBell } from '../NotificationBell'
import { getUserName } from '../UserNameModal'
import { useChangeTracker } from '../../hooks/useChangeTracker'

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const userName = getUserName()

  // Activate change tracker
  useChangeTracker()

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
            {/* Notification bell with changelog */}
            <NotificationBell />

            <div className="h-8 w-px bg-stone-200 mx-1 hidden sm:block" />

            {/* Current user + wedding info */}
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-stone-700">Naim & Sarahí</p>
              {userName ? (
                <p className="text-xs text-olive-600 flex items-center gap-1 justify-end">
                  <User className="w-3 h-3" />
                  {userName}
                </p>
              ) : (
                <p className="text-xs text-stone-400">Panel Administrador</p>
              )}
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
