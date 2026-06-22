import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { useWeddingStore } from './store/useWeddingStore'

// Pages
import { Dashboard }   from './pages/Dashboard'
import { Guests }      from './pages/Guests'
import { Tables }      from './pages/Tables'
import { Budget }      from './pages/Budget'
import { Vendors }     from './pages/Vendors'
import { Quotes }      from './pages/Quotes'
import { Bocaditos }   from './pages/Bocaditos'
import { Beverages }   from './pages/Beverages'
import { Savings }     from './pages/Savings'
import { Checklist }   from './pages/Checklist'
import { DaySchedule } from './pages/DaySchedule'
import { Shopping }    from './pages/Shopping'
import { Responsibles } from './pages/Responsibles'
import { Ceremony }    from './pages/Ceremony'
import { Games }       from './pages/Games'
import { Music }       from './pages/Music'
import { MCScript }    from './pages/MCScript'
import { Photos }      from './pages/Photos'
import { PlanB }       from './pages/PlanB'
import { EmergencyKit } from './pages/EmergencyKit'

function App() {
  const { isInitialized, initializeSeedData } = useWeddingStore()

  useEffect(() => {
    if (!isInitialized) {
      initializeSeedData()
    }
  }, [isInitialized, initializeSeedData])

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"           element={<Dashboard />} />
          <Route path="/guests"     element={<Guests />} />
          <Route path="/tables"     element={<Tables />} />
          <Route path="/budget"     element={<Budget />} />
          <Route path="/vendors"    element={<Vendors />} />
          <Route path="/quotes"     element={<Quotes />} />
          <Route path="/bocaditos"  element={<Bocaditos />} />
          <Route path="/beverages"  element={<Beverages />} />
          <Route path="/savings"    element={<Savings />} />
          <Route path="/checklist"  element={<Checklist />} />
          <Route path="/schedule"   element={<DaySchedule />} />
          <Route path="/shopping"   element={<Shopping />} />
          <Route path="/responsibles" element={<Responsibles />} />
          <Route path="/ceremony"   element={<Ceremony />} />
          <Route path="/games"      element={<Games />} />
          <Route path="/music"      element={<Music />} />
          <Route path="/mc-script"  element={<MCScript />} />
          <Route path="/photos"     element={<Photos />} />
          <Route path="/plan-b"     element={<PlanB />} />
          <Route path="/emergency"  element={<EmergencyKit />} />
          <Route path="*"           element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
