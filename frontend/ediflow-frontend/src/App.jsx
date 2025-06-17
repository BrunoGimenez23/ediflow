
import { Route, Routes } from 'react-router-dom'
import './App.css'
import AdminDashboard from './pages/admin/AdminDashboard'
import Buildings from './pages/admin/Buildings'
import Layout from './layout/Layout'
import Register from './pages/auth/Register'
import Home from './pages/home/Home'
import Login from './pages/auth/Login'


function App() {
<body class="font-sans"></body>

  return (
    <>
    
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path="/auth/register-admin" element={<Register />} />
        <Route path="/auth/login-admin" element={<Login />} />
        
        {/* Admin Routes */}
         <Route path='/admin/login' element={<Register />} />
         <Route path='/admin/register' element={<Register />} />

        <Route path='/admin' element={<Layout/>}>
          <Route index element={<AdminDashboard />} />
          <Route path="buildings" element={<Buildings />} />
          
        </Route>
      </Routes>
    
    
    </>
    
  )
}

export default App
