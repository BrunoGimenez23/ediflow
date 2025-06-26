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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ReservationsProvider>
          <ResidentProvider>
            <BuildingProvider>
              <ApartmentProvider>
                <PaymentProvider>
                  <App />
                </PaymentProvider>
              </ApartmentProvider>
            </BuildingProvider>
          </ResidentProvider>
        </ReservationsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
