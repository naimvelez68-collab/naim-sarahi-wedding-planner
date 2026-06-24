import React, { useState, useEffect, useRef } from 'react'
import { Heart } from 'lucide-react'

const KEY = 'wedding-user-name'

export function getUserName(): string {
  return localStorage.getItem(KEY) || ''
}

export function setUserName(name: string) {
  localStorage.setItem(KEY, name.trim())
}

export const UserNameModal: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [name, setName]       = useState('')
  const [error, setError]     = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!getUserName()) {
      setVisible(true)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [])

  const confirm = () => {
    if (!name.trim()) { setError(true); return }
    setUserName(name.trim())
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-br from-olive-700 to-olive-900 px-6 py-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-wedding-pattern opacity-20" />
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
              <Heart className="w-7 h-7 text-gold-300" fill="currentColor" />
            </div>
            <h2 className="font-serif text-2xl text-white font-bold">Bienvenido/a</h2>
            <p className="text-olive-200 text-sm mt-1">Naim &amp; Sarahí · 8 Agosto 2026</p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <p className="text-stone-600 text-sm text-center mb-5">
            ¿Cómo te llamas? Esto aparecerá en el registro de cambios para identificar quién editó qué.
          </p>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setError(false) }}
            onKeyDown={e => e.key === 'Enter' && confirm()}
            placeholder="Ej: EVELYN, SARAHÍ, NAIM..."
            maxLength={30}
            className={`w-full border-2 rounded-xl px-4 py-3 text-center text-lg font-medium outline-none transition-colors
              ${error ? 'border-red-400 bg-red-50' : 'border-gold-200 focus:border-gold-400 bg-parchment'}`}
          />
          {error && <p className="text-red-500 text-xs text-center mt-1">Por favor escribe tu nombre</p>}

          <button
            onClick={confirm}
            className="mt-4 w-full bg-olive-600 hover:bg-olive-700 text-white font-semibold rounded-xl py-3 transition-colors"
          >
            Entrar al planificador
          </button>
          <p className="text-xs text-stone-400 text-center mt-3">
            Solo se pregunta una vez. Se guarda en este dispositivo.
          </p>
        </div>
      </div>
    </div>
  )
}
