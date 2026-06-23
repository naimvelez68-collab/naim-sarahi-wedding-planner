import React, { useState, useEffect, useRef } from 'react'

const PIN = '080826'
const STORAGE_KEY = 'wedding-access-granted'

export const PinGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [granted, setGranted] = useState(false)
  const [input, setInput]     = useState('')
  const [error, setError]     = useState(false)
  const [shake, setShake]     = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === 'yes') setGranted(true)
    else setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  const attempt = () => {
    if (input === PIN) {
      localStorage.setItem(STORAGE_KEY, 'yes')
      setGranted(true)
    } else {
      setError(true)
      setShake(true)
      setInput('')
      setTimeout(() => { setError(false); setShake(false) }, 600)
      inputRef.current?.focus()
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') attempt()
  }

  if (granted) return <>{children}</>

  return (
    <div className="min-h-screen bg-parchment flex flex-col items-center justify-center px-4"
         style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236B7A3A' fill-opacity='0.04'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10S0 14.5 0 20s4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10z'/%3E%3C/g%3E%3C/svg%3E\")" }}>

      <div className="w-full max-w-sm">
        {/* Rings */}
        <div className="flex justify-center mb-6">
          <svg width="64" height="40" viewBox="0 0 64 40" fill="none">
            <circle cx="22" cy="20" r="16" stroke="#D4AF37" strokeWidth="3" fill="none"/>
            <circle cx="42" cy="20" r="16" stroke="#6B7A3A" strokeWidth="3" fill="none"/>
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-center font-serif text-3xl text-olive-700 mb-1 tracking-wide">
          Naim &amp; Sarahí
        </h1>
        <p className="text-center text-sm text-stone-400 mb-8 tracking-widest uppercase">
          8 · 08 · 2026 · Ibarra
        </p>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gold-100 p-8">
          <p className="text-center text-stone-600 text-sm mb-6">
            Ingresa el PIN del equipo para acceder al planificador
          </p>

          <div className={`transition-transform ${shake ? 'animate-bounce' : ''}`}>
            <input
              ref={inputRef}
              type="password"
              value={input}
              onChange={e => { setInput(e.target.value); setError(false) }}
              onKeyDown={handleKey}
              placeholder="••••••"
              maxLength={20}
              className={`w-full text-center text-xl tracking-widest rounded-xl border-2 px-4 py-3 outline-none transition-colors bg-parchment
                ${error
                  ? 'border-red-400 text-red-500 bg-red-50'
                  : 'border-gold-200 text-olive-800 focus:border-gold-400'
                }`}
            />
          </div>

          {error && (
            <p className="text-center text-red-500 text-xs mt-2 animate-fade-in">
              PIN incorrecto. Intenta de nuevo.
            </p>
          )}

          <button
            onClick={attempt}
            className="mt-5 w-full bg-olive-600 hover:bg-olive-700 active:bg-olive-800 text-white font-medium rounded-xl py-3 transition-colors text-sm tracking-wide"
          >
            Entrar
          </button>
        </div>

        <p className="text-center text-xs text-stone-300 mt-6">
          Solo para el equipo de la boda 💍
        </p>
      </div>
    </div>
  )
}
