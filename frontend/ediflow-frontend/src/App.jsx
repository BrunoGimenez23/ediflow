
import { Route, Routes } from 'react-router-dom'
import './App.css'
import AdminDashboard from './pages/admin/AdminDashboard'
import Buildings from './pages/admin/Buildings'
import BuildingAdminContext from './contexts/BuildingContext'
import Layout from './layout/Layout'


function App() {
  

  return (
    <>
    
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<AdminDashboard />} />
          <Route path="/admin/buildings" element={<Buildings />} />
        </Route>
      
    </Routes>
    
    
    </>
    
  )
}

export default App
