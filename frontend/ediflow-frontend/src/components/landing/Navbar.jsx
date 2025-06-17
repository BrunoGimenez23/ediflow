import { Link } from 'react-router-dom'
import logo from '../../assets/iconos/logo.png'

const Navbar = () => {
  return (
    <nav className="bg-ediblue">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* Logo */}
        <img src={logo} alt="Logo de Ediflow" className="h-20 w-auto object-contain" />

        {/* Navegación principal */}
        <ul className="flex space-x-6 text-white text-lg font-medium">
          <li className="cursor-pointer hover:text-ediblueLight">Inicio</li>
          <li className="cursor-pointer hover:text-ediblueLight">Funcionalidades</li>
          <li className="cursor-pointer hover:text-ediblueLight">Contacto</li>
        </ul>

        {/* Acciones */}
        <ul className="flex space-x-4 text-white text-lg font-semibold">
          <Link to="/auth/login-admin">
          <li className="cursor-pointer hover:text-ediblueLight">Iniciar sesión</li>
          </Link>
          <Link to="/auth/register-admin">
          <li className="cursor-pointer hover:text-ediblueLight">Registrarse</li>
          </Link>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar