import { Route, Routes } from 'react-router-dom'
import './App.css'

import AdminDashboard from './pages/admin/AdminDashboard'
import Buildings from './pages/admin/Buildings'
import Layout from './layout/Layout'
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

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path='/' element={<Home />} />
      <Route path="/auth/register-admin" element={<Register />} />
      <Route path="/auth/login" element={<Login />} />

      {/* Rutas de administrador */}
      <Route path='/admin' element={<Layout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="reservas" element={<AdminReservationsPanel />} />
        <Route path="common-areas/all" element={<CommonAreasPage />} />
        <Route path="buildings" element={<Buildings />} />
        <Route path="residents" element={<Residents />} />
        <Route path="apartment" element={<Apartments />} />
        <Route path="payment/all" element={<Payments />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="assign-plan" element={<AssignPlanPage />} />
        <Route path="planes" element={<PricingPlans />} />
      </Route>
      

      {/* Rutas de residente */}
      <Route path='/resident' element={<ResidentDashboard />} />
      <Route path="/mis-pagos" element={<MyPayments />} />
      <Route path="/mis-reservas" element={<MyReservations />} />
    </Routes>
  )
}

export default App
