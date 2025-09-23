import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { BuildingProvider } from './contexts/BuildingContext.jsx'
import './index.css'
import { ApartmentProvider } from './contexts/ApartmentContext.jsx'
import { PaymentProvider } from './contexts/PaymentContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ResidentProvider } from './contexts/ResidentContext.jsx'
import { ReservationsProvider } from './contexts/ReservationsContext.jsx'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/react';
import { MarketplaceProvider } from './contexts/marketplace/MarketplaceContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BuildingProvider>        
          <MarketplaceProvider>
            <ReservationsProvider>
              <ResidentProvider>
                <ApartmentProvider>
                  <PaymentProvider>
                    <App />
                    <Analytics />
                    <Toaster position="top-right" />
                  </PaymentProvider>
                </ApartmentProvider>
              </ResidentProvider>
            </ReservationsProvider>
          </MarketplaceProvider>
        </BuildingProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
