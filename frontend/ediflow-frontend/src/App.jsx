
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


function App() {
<body class="font-sans"></body>

  return (
    <>
    <Routes>
        <Route path='/' element={<Home />} />

        <Route path="/auth/register-admin" element={<Register />} />
        <Route path="/auth/login" element={<Login />} />

        <Route path='/admin' element={<Layout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="/admin/reservas" element={<AdminReservationsPanel />} />
          <Route path="common-areas/all" element={<CommonAreasPage />} />
          <Route path="buildings" element={<Buildings />} />
          <Route path="residents" element={<Residents />} />
          <Route path='apartment' element={<Apartments />} />
          <Route path='payment/all' element={<Payments />} />
        </Route>

        {/* Rutas de residente */}
        <Route path='/resident' element={<ResidentDashboard />} />
        <Route path="/mis-pagos" element={<MyPayments />} />
        <Route path="/mis-reservas" element={<MyReservations />} />
      </Routes>
    </>
    
  )
}

export default App
