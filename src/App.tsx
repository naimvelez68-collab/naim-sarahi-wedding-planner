import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { useWeddingStore } from './store/useWeddingStore'
import { useSupabaseSync } from './hooks/useSupabaseSync'
import { isSupabaseConfigured } from './lib/supabase'
import { ChatBot } from './components/ChatBot'
import { UserNameModal } from './components/UserNameModal'

// Pages
import { Dashboard }    from './pages/Dashboard'
import { Guests }       from './pages/Guests'
import { Tables }       from './pages/Tables'
import { Budget }       from './pages/Budget'
import { Vendors }      from './pages/Vendors'
import { Quotes }       from './pages/Quotes'
import { Bocaditos }    from './pages/Bocaditos'
import { Beverages }    from './pages/Beverages'
import { Savings }      from './pages/Savings'
import { Checklist }    from './pages/Checklist'
import { DaySchedule }  from './pages/DaySchedule'
import { Shopping }     from './pages/Shopping'
import { Responsibles } from './pages/Responsibles'
import { Ceremony }     from './pages/Ceremony'
import { Games }        from './pages/Games'
import { Music }        from './pages/Music'
import { MCScript }     from './pages/MCScript'
import { Photos }       from './pages/Photos'
import { PlanB }        from './pages/PlanB'
import { EmergencyKit } from './pages/EmergencyKit'

// ── Supabase badge (top-right) ─────────────────────────────────────────────
const SupabaseBadge: React.FC = () => {
  const [saved, setSaved] = useState(false)

  // Flash "guardado" on store changes
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    const unsub = useWeddingStore.subscribe(() => {
      setSaved(true)
      clearTimeout(t)
      t = setTimeout(() => setSaved(false), 2500)
    })
    return () => { unsub(); clearTimeout(t) }
  }, [])

  if (!isSupabaseConfigured) return (
    <div className="fixed bottom-4 right-4 z-50 text-xs bg-amber-100 text-amber-700 border border-amber-300 rounded-full px-3 py-1 shadow flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
      Modo local (sin Supabase)
    </div>
  )

  return (
    <div className={`fixed bottom-4 right-4 z-50 text-xs rounded-full px-3 py-1 shadow flex items-center gap-1.5 transition-all duration-500 ${
      saved
        ? 'bg-green-100 text-green-700 border border-green-300'
        : 'bg-olive-100 text-olive-700 border border-olive-300'
    }`}>
      <span className={`w-2 h-2 rounded-full ${saved ? 'bg-green-500' : 'bg-olive-400'}`} />
      {saved ? '✓ Guardado en Supabase' : '● Conectado a Supabase'}
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
function AppInner() {
  const { isInitialized, initializeSeedData } = useWeddingStore()
  useSupabaseSync()

  useEffect(() => {
    if (!isInitialized) initializeSeedData()
  }, [isInitialized, initializeSeedData])

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"             element={<Dashboard />} />
          <Route path="/guests"       element={<Guests />} />
          <Route path="/tables"       element={<Tables />} />
          <Route path="/budget"       element={<Budget />} />
          <Route path="/vendors"      element={<Vendors />} />
          <Route path="/quotes"       element={<Quotes />} />
          <Route path="/bocaditos"    element={<Bocaditos />} />
          <Route path="/beverages"    element={<Beverages />} />
          <Route path="/savings"      element={<Savings />} />
          <Route path="/checklist"    element={<Checklist />} />
          <Route path="/schedule"     element={<DaySchedule />} />
          <Route path="/shopping"     element={<Shopping />} />
          <Route path="/responsibles" element={<Responsibles />} />
          <Route path="/ceremony"     element={<Ceremony />} />
          <Route path="/games"        element={<Games />} />
          <Route path="/music"        element={<Music />} />
          <Route path="/mc-script"    element={<MCScript />} />
          <Route path="/photos"       element={<Photos />} />
          <Route path="/plan-b"       element={<PlanB />} />
          <Route path="/emergency"    element={<EmergencyKit />} />
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      <SupabaseBadge />
      <ChatBot />
      <UserNameModal />
    </BrowserRouter>
  )
}

export default AppInner
