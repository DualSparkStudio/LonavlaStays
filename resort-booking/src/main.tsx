import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SiteDataProvider } from './context/SiteDataContext'

// Always use light mode (clear any saved dark preference)
document.documentElement.classList.remove('dark')
localStorage.removeItem('theme')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SiteDataProvider>
      <App />
    </SiteDataProvider>
  </StrictMode>,
)
