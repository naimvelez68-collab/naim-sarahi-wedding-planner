import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { PinGate } from './components/PinGate'
import './index.css'

// Reload the page when a new service worker takes control so users always
// get the latest code and data without manually clearing the PWA cache.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload()
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PinGate>
      <App />
    </PinGate>
  </React.StrictMode>,
)
