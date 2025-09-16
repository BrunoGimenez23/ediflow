import { Route, Routes, Navigate } from 'react-router-dom'
import './App.css'

import AdminDashboard from './pages/admin/AdminDashboard'
import Buildings from './pages/admin/Buildings'
import Layout from './layout/Layout'
import PublicLayout from './layout/PublicLayout'
import Register from './pages/auth/Register'
import Home from './pages/home/Home'
import Login from './pages/auth/Login'
import Residents from './pages/admin/Residents'
import Apartments from './pages/admin/Apartments'
import Payments from './pages/admin/Payments'
import ResidentDashboard from './pages/resident/ResidentDashboard'
import CommonAreasPage from './pages/admin/CommonAreasPage'
import MyPayments from './pages/resident/MyPayments'
import MyReservations from './pages/resident/MyReservations'
import AdminReservationsPanel from './components/admin/AdminReservationsPanel'
import UserManagement from './components/admin/UserManagement'
import AssignPlanPage from './pages/admin/AssignPlanPage'
import PricingPlans from './components/landing/PricingPlans'
import UpgradePlansContainer from './components/common/UpgradePlansContainer'
import PlanConfirmationPage from './pages/admin/PlanConfirmationPage'
import MyLogEntries from './components/porteria/MyLogEntries'
import LogHistory from './components/porteria/LogHistory'
import { useAuth } from './contexts/AuthContext'
import { useBuildingsContext } from "./contexts/BuildingContext";
import PorterDashboard from './pages/porter/PorterDashboard'
import PaymentReport from './pages/admin/PaymentReport'

function App() {
  const { user } = useAuth();
  const { selectedBuilding } = useBuildingsContext();

  return (
    <Routes>
      {/* Home directo, sin layout */}
      <Route path='/' element={<Home />} />

      {/* Login y Register con PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/auth/register-admin" element={<Register />} />
        <Route path="/auth/login" element={<Login />} />
      </Route>

      {/* Rutas de administrador con Layout */}
      <Route path='/admin' element={<Layout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="reservas" element={<AdminReservationsPanel />} />
        <Route path="common-areas/all" element={<CommonAreasPage />} />
        <Route path="buildings" element={<Buildings />} />
        <Route path="residents" element={<Residents />} />
        <Route path="apartment" element={<Apartments />} />
        <Route path="payment/all" element={<Payments />} />
        <Route path="payment/report" element={<PaymentReport />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="assign-plan" element={<AssignPlanPage />} />
        <Route path="planes" element={<PricingPlans />} />

        {/* Ruta dedicada para UpgradePlansContainer */}
        <Route path="upgrade-plan" element={<UpgradePlansContainer />} />

        {/* historial relativo al admin */}
        {user?.role === "ADMIN" && selectedBuilding && (
          <Route
            path="historial"
            element={<LogHistory buildingId={selectedBuilding.id} userRole="ADMIN" />}
          />
        )}
      </Route>

      {/* PlanConfirmationPage usando params */}
      <Route path="/admin/plan-confirmation/:planName" element={<PlanConfirmationPage />} />

      {/* Rutas de residente */}
      <Route path='/resident' element={<ResidentDashboard />} />
      <Route path="/mis-pagos" element={<MyPayments />} />
      <Route path="/mis-reservas" element={<MyReservations />} />
      <Route path="/mis-registros" element={<MyLogEntries residentId={user?.residentId} />} />

      {/* Rutas de portero usando PorterDashboard */}
      <Route
        path="/porter/*"
        element={user?.role === "PORTER" ? <PorterDashboard /> : <Navigate to="/" />}
      />
    </Routes>
  )
}

export default App
