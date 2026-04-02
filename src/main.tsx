import React from 'react'
import ReactDOM from 'react-dom/client'

import { StoreProvider } from '@/app/providers/store-provider'
import { TooltipProvider } from '@/components/ui/tooltip'

import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="theme">
      <StoreProvider>
        <TooltipProvider delay={100}>
          <App />
        </TooltipProvider>
      </StoreProvider>
    </div>
  </React.StrictMode>,
)
