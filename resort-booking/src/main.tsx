import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Always use light mode (clear any saved dark preference)
document.documentElement.classList.remove('dark')
localStorage.removeItem('theme')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
